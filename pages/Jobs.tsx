
import React, { useState, useMemo } from 'react';
import { Briefcase, MapPin, Search, Tag, Sparkles, Clock, ArrowRight, Filter, ChevronRight, DollarSign } from 'lucide-react';
import { MOCK_BUSINESSES, CITIES } from '../constants';
import { Link } from 'react-router-dom';
import { JobType } from '../types';

const Jobs: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState<JobType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const allJobs = useMemo(() => {
    return MOCK_BUSINESSES.flatMap(b => 
      (b.jobs || []).map(j => ({ ...j, business: b }))
    ).sort((a, b) => {
      // Primary Sort: Featured Status
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      // Secondary Sort: Chronological
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    });
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(j => {
      const matchesCity = !selectedCity || j.business.city === selectedCity;
      const matchesType = !selectedType || j.type === selectedType;
      const matchesSearch = !searchQuery || 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        j.business.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesType && matchesSearch;
    });
  }, [allJobs, selectedCity, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Header */}
      <div className="bg-sky-950 text-white relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute top-0 right-0 w-[40%] h-full opacity-10">
          <Briefcase className="w-full h-full transform rotate-12 translate-y-12 translate-x-12" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-4 h-4" />
            Grow With OC
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The OC <span className="text-sky-300 italic">Job Board.</span></h1>
          <p className="text-sky-200 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Discover career opportunities at the most innovative and beloved businesses across Orange County.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search jobs, titles, or companies..."
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-medium text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select 
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-3 relative">
              <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select 
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as JobType)}
              >
                <option value="">All Types</option>
                {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <button className="w-full h-full bg-sky-900 text-white font-black rounded-2xl hover:bg-sky-800 shadow-lg shadow-sky-900/20 transition-all active:scale-95 flex items-center justify-center">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className={`relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center group ${job.isFeatured ? 'border-sky-400 ring-4 ring-sky-500/5 bg-sky-50/20' : 'border-stone-100'}`}>
                
                {job.isFeatured && (
                  <div className="absolute top-4 right-8 flex items-center bg-sky-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-in fade-in zoom-in-95 duration-700">
                    <Sparkles className="h-3 w-3 mr-1.5 text-sky-300" /> Featured Posting
                  </div>
                )}

                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap items-center gap-4">
                    <Link to={`/business/${job.business.id}`} className="flex items-center space-x-3 text-sky-700 hover:text-sky-900 transition-colors">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-100 shadow-sm">
                        <img src={job.business.imageUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">{job.business.name}</span>
                    </Link>
                    <span className="text-stone-200">|</span>
                    <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <MapPin className="h-3 w-3 mr-1 text-sky-500" />
                      {job.business.city}, CA
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-sky-950 group-hover:text-sky-700 transition-colors">{job.title}</h3>
                    <p className="text-slate-500 font-medium max-w-2xl line-clamp-1">{job.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="px-4 py-1.5 bg-sky-50 text-sky-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-sky-100 flex items-center">
                      <Clock className="h-3 w-3 mr-1.5" /> {job.type}
                    </div>
                    {job.salary && (
                      <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center">
                        <DollarSign className="h-3 w-3 mr-1.5" /> {job.salary}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 md:mt-0 md:ml-8 flex flex-col items-end space-y-3">
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Posted: {new Date(job.postedAt).toLocaleDateString()}</div>
                  <Link to={`/business/${job.business.id}`} className={`px-8 py-4 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 whitespace-nowrap ${job.isFeatured ? 'bg-sky-900 hover:bg-sky-800' : 'bg-slate-800 hover:bg-slate-700'}`}>
                    Apply Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-stone-200">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Briefcase className="h-10 w-10 text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-sky-950">No jobs found</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Try adjusting your filters or search keywords to find opportunities.</p>
              <button 
                onClick={() => { setSelectedCity(''); setSelectedType(''); setSearchQuery(''); }}
                className="mt-10 px-10 py-4 bg-sky-900 text-white font-black rounded-2xl shadow-xl hover:bg-sky-800 transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
