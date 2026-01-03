
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, X, Loader2, ExternalLink, 
  ArrowRight, Tag, Zap, Store, Clock, 
  History, TrendingUp, DollarSign,
  BarChart4, LayoutGrid, ListFilter, AlertCircle
} from 'lucide-react';
import { MOCK_BUSINESSES, CITIES } from '../constants';
import { Region, Category } from '../types';
import BusinessCard from '../components/BusinessCard';
import { GeminiService } from '../GeminiService';

interface Suggestion {
  text: string;
  type: 'Business' | 'Category' | 'City' | 'History' | 'Trending' | 'Fuzzy';
  original?: string;
}

const getLevenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const findFuzzyMatch = (needle: string, haystack: string): string | null => {
  const n = needle.toLowerCase().trim();
  if (n.length < 2) return null;
  
  const words = haystack.toLowerCase().split(/[^a-z0-9]+/);
  for (const word of words) {
    if (word.includes(n) || n.includes(word)) return word;
    if (n.length >= 3) {
      const threshold = n.length > 8 ? 3 : n.length > 5 ? 2 : 1;
      if (getLevenshteinDistance(n, word) <= threshold) return word;
    }
  }
  return null;
};

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const regionParam = searchParams.get('region') || '';
  const categoryParam = searchParams.get('category') || '';
  const priceParam = searchParams.get('price') || '';

  const [activeTab, setActiveTab] = useState<'all' | 'popular'>('all');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ text: string; grounding: any[] } | null>(null);
  const [isFuzzyActive, setIsFuzzyActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(true);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('oc_thrive_search_history');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const addToHistory = (query: string) => {
    if (!query || query.trim().length < 2) return;
    const cleanQ = query.trim();
    const newHistory = [cleanQ, ...recentSearches.filter(h => h !== cleanQ)].slice(0, 5);
    setRecentSearches(newHistory);
    localStorage.setItem('oc_thrive_search_history', JSON.stringify(newHistory));
  };

  const { filteredBusinesses, highlightTerms, analytics } = useMemo(() => {
    const keywords = q.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0);
    const matchedTokens = new Set<string>();
    let fuzzyUsed = false;

    const results = MOCK_BUSINESSES.filter(b => {
      const searchableText = `${b.name} ${b.description} ${b.category} ${b.city} ${b.region}`.toLowerCase();
      
      // Filter logic
      if (keywords.length > 0 && !keywords.every(k => {
        // Direct match
        if (searchableText.includes(k)) {
          matchedTokens.add(k);
          return true;
        }
        // Fuzzy match
        const match = findFuzzyMatch(k, searchableText);
        if (match) {
          matchedTokens.add(match);
          fuzzyUsed = true;
          return true;
        }
        return false;
      })) return false;

      if (cityParam && b.city !== cityParam) return false;
      if (regionParam && b.region !== regionParam) return false;
      if (categoryParam && b.category !== categoryParam) return false;
      
      if (priceParam) {
        if (priceParam === 'free' && (b.category !== Category.ARTS_CULTURE && b.category !== Category.TECHNOLOGY)) return false;
        if (priceParam === 'value' && b.rating < 4.5) return false; 
      }

      if (activeTab === 'popular' && b.rating < 4.7) return false;
      return true;
    });

    const categoryCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    let totalRating = 0;

    results.forEach(b => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
      cityCounts[b.city] = (cityCounts[b.city] || 0) + 1;
      totalRating += b.rating;
    });

    const categoryBreakdown = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const cityBreakdown = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const avgRating = results.length > 0 ? (totalRating / results.length).toFixed(1) : '0';

    setIsFuzzyActive(fuzzyUsed);
    return { 
      filteredBusinesses: results, 
      highlightTerms: Array.from(matchedTokens),
      analytics: {
        categoryBreakdown,
        cityBreakdown,
        avgRating,
        topCategory: categoryBreakdown[0]?.name || 'N/A'
      }
    };
  }, [q, cityParam, regionParam, categoryParam, priceParam, activeTab]);

  useEffect(() => {
    const trimmedQ = q.trim();
    if (!trimmedQ) {
      const historyItems: Suggestion[] = recentSearches.map(s => ({ text: s, type: 'History' as const }));
      const trendingItems: Suggestion[] = [
        { text: 'Dana Point Surf', type: 'Trending' as const },
        { text: 'Harbor Dining', type: 'Trending' as const },
        { text: 'Startup Incubators', type: 'Trending' as const },
      ];
      setSuggestions([...historyItems, ...trendingItems]);
      return;
    }

    const searchVal = trimmedQ.toLowerCase();
    const matches: Suggestion[] = [];
    
    // Exact/Fuzzy matches for Suggestion Dropdown
    MOCK_BUSINESSES.forEach(b => { 
      if (b.name.toLowerCase().startsWith(searchVal)) {
        matches.push({ text: b.name, type: 'Business' }); 
      } else {
        const fuzzy = findFuzzyMatch(searchVal, b.name);
        if (fuzzy) matches.push({ text: b.name, type: 'Fuzzy', original: searchVal });
      }
    });

    Object.values(Category).forEach(cat => { 
      if (cat.toLowerCase().startsWith(searchVal)) {
        matches.push({ text: cat, type: 'Category' }); 
      }
    });

    CITIES.forEach(city => {
      if (city.toLowerCase().startsWith(searchVal)) {
        matches.push({ text: city, type: 'City' });
      }
    });

    setSuggestions(matches.filter((v, i, a) => a.findIndex(t => t.text === v.text && t.type === v.type) === i).slice(0, 10));
  }, [q, recentSearches]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value); else newParams.delete(key);
    setSearchParams(newParams);
    if (key === 'q' && value) addToHistory(value);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (s: Suggestion) => {
    if (s.type === 'Category') {
      updateFilter('category', s.text);
      updateFilter('q', '');
    } else if (s.type === 'City') {
      updateFilter('city', s.text);
      updateFilter('q', '');
    } else {
      updateFilter('q', s.text);
    }
  };

  const handleSearch = async () => {
    if (!q) return;
    addToHistory(q);
    setIsSearching(true);
    setSearchResults(null);
    try {
      let latLng = { latitude: 33.6846, longitude: -117.8265 };
      const results = await GeminiService.performSearch(q, latLng);
      setSearchResults(results);
    } catch (err) { console.error(err); } finally { setIsSearching(false); }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-sky-950 text-white pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Explore Directory</h1>
              <p className="text-sky-200 text-lg font-light max-w-xl">
                Discover local brands with intelligent fuzzy search and visual analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 p-6 md:p-8">
          
          <div className="flex flex-col lg:flex-row gap-4 mb-6 relative">
            <div className="flex-grow relative">
              <div className={`flex items-center bg-stone-50 rounded-2xl px-5 py-4 border transition-all shadow-sm ${isFuzzyActive ? 'border-sky-300 ring-2 ring-sky-100' : 'border-stone-200 focus-within:ring-2 focus-within:ring-sky-500'}`}>
                <Search className={`h-5 w-5 mr-3 ${isFuzzyActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder='Try searching "restraunt" or "surfer"...'
                  className="bg-transparent w-full outline-none text-slate-800 font-medium placeholder:text-slate-400"
                  value={q}
                  onChange={(e) => updateFilter('q', e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSearch(); }}
                />
                
                {isFuzzyActive && q.trim().length > 1 && (
                   <div className="hidden sm:flex items-center px-3 py-1 bg-sky-100 text-sky-700 rounded-lg text-[10px] font-black uppercase tracking-widest mr-4 border border-sky-200 animate-pulse">
                     <Sparkles className="h-3 w-3 mr-1.5" />
                     Smart Match Active
                   </div>
                )}

                {q && (
                  <button onClick={() => updateFilter('q', '')} className="p-1 hover:bg-stone-200 rounded-full mr-4">
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
                <button 
                  onClick={handleSearch}
                  disabled={isSearching || !q}
                  className="px-6 py-2.5 bg-sky-900 text-white text-sm font-bold rounded-xl flex items-center whitespace-nowrap hover:bg-sky-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Deep Search
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[500px] overflow-y-auto border-b-8 border-sky-900/10">
                  <div className="grid grid-cols-1 divide-y divide-stone-100">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        className="w-full text-left px-6 py-4 hover:bg-sky-50 flex items-center justify-between group transition-colors"
                        onClick={() => handleSuggestionClick(s)}
                      >
                        <div className="flex items-center">
                          <div className={`mr-4 p-2 rounded-xl ${s.type === 'Fuzzy' ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-slate-400'} group-hover:bg-white transition-colors`}>
                            {s.type === 'Category' ? <Tag className="h-4 w-4" /> : s.type === 'City' ? <MapPin className="h-4 w-4" /> : s.type === 'Fuzzy' ? <Sparkles className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                          </div>
                          <div>
                            <span className="text-slate-800 font-bold group-hover:text-sky-900">{s.text}</span>
                            {s.type === 'Fuzzy' && (
                              <span className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mt-0.5">Did you mean this?</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-200 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <select className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none cursor-pointer hover:bg-white transition-all appearance-none text-sm" value={cityParam} onChange={(e) => updateFilter('city', e.target.value)}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none cursor-pointer hover:bg-white transition-all appearance-none text-sm" value={categoryParam} onChange={(e) => updateFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {isFuzzyActive && filteredBusinesses.length > 0 && (
            <div className="mb-6 flex items-center p-4 bg-sky-50 border border-sky-100 rounded-2xl text-sky-800 text-sm font-medium animate-in slide-in-from-top-4">
              <Sparkles className="h-4 w-4 mr-2 text-sky-600" />
              Showing close matches for <strong>"{q}"</strong>. Some results may have minor spelling variations.
            </div>
          )}

          {/* Breakdown Section */}
          {filteredBusinesses.length > 0 && showBreakdown && (
             <div className="mb-12 border-b border-stone-100 pb-12 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-sky-900 rounded-xl text-white shadow-lg">
                      <BarChart4 className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-black text-sky-950 tracking-tight">Market Analytics</h3>
                  </div>
                  <button onClick={() => setShowBreakdown(false)} className="text-slate-400 hover:text-sky-900"><X className="h-5 w-5" /></button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Mix</h4>
                       {analytics.categoryBreakdown.slice(0, 3).map((item, i) => (
                         <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-sky-950">
                               <span>{item.name}</span>
                               <span className="text-sky-600">{Math.round((item.count / filteredBusinesses.length) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                               <div className="h-full bg-sky-900 rounded-full" style={{ width: `${(item.count / filteredBusinesses.length) * 100}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City Distribution</h4>
                       {analytics.cityBreakdown.slice(0, 3).map((item, i) => (
                         <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-sky-950">
                               <span>{item.name}</span>
                               <span className="text-orange-600">{item.count}</span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                               <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(item.count / (analytics.cityBreakdown[0]?.count || 1)) * 100}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="bg-sky-950 rounded-[2.5rem] p-6 text-white text-center flex flex-col justify-center">
                       <div className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2">Result Score</div>
                       <div className="text-4xl font-black italic">{analytics.avgRating} <span className="text-2xl text-amber-400">★</span></div>
                    </div>
                </div>
             </div>
          )}

          {searchResults && (
            <div className="mb-12 p-8 bg-sky-50 border border-sky-100 rounded-[2.5rem] shadow-inner">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-6 w-6 text-sky-600" />
                <h3 className="text-sky-950 font-extrabold text-xl">AI Insights</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg italic mb-6">"{searchResults.text}"</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-6">
             <div className="flex space-x-2">
               <button onClick={() => setActiveTab('all')} className={`px-5 py-2 rounded-xl text-sm font-bold ${activeTab === 'all' ? 'bg-sky-900 text-white' : 'text-slate-400'}`}>All Results</button>
               <button onClick={() => setActiveTab('popular')} className={`px-5 py-2 rounded-xl text-sm font-bold ${activeTab === 'popular' ? 'bg-sky-900 text-white' : 'text-slate-400'}`}>Popular</button>
             </div>
             <div className="text-slate-500 font-bold text-sm">{filteredBusinesses.length} results</div>
          </div>

          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} highlightTerms={highlightTerms} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-2xl font-extrabold text-sky-950">No matches found</h3>
              <p className="text-slate-500 mt-2">Try a different keyword or check for typos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
