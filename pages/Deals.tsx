
import React, { useState, useMemo } from 'react';
import { Tag, ArrowRight, Zap, Sparkles, Filter, X, MapPin } from 'lucide-react';
import { MOCK_BUSINESSES } from '../constants';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const Deals: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const categories = ['All', ...Object.values(Category)];

  const filteredDeals = useMemo(() => {
    const allDeals = MOCK_BUSINESSES.filter(b => b.deal);
    if (selectedCategory === 'All') return allDeals;
    return allDeals.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero */}
      <div className="bg-sky-950 text-white relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute top-0 right-0 w-[40%] h-full opacity-10">
          <Tag className="w-full h-full transform rotate-12 -translate-y-12 translate-x-12" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-4 h-4" />
            Exclusive Community Offers
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Shop Local, <span className="text-sky-300">Save Local.</span></h1>
          <p className="text-sky-200 text-xl font-light max-w-2xl leading-relaxed">
            Support the Orange County community while enjoying exclusive discounts and special offers from our partner businesses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Category Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-4 mb-10 overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-3 min-w-max">
            <div className="flex items-center text-sky-900 font-bold px-4 border-r border-stone-100 mr-2">
              <Filter className="w-4 h-4 mr-2" />
              <span className="text-sm">Filter</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-sky-900 text-white shadow-lg scale-105'
                    : 'bg-stone-50 text-slate-500 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Clear Filter"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDeals.length > 0 ? (
            filteredDeals.map(business => (
              <div key={business.id} className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full md:w-2/5 relative h-64 md:h-auto">
                  <img src={business.imageUrl} alt={business.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-sky-950/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4 bg-orange-500 text-white p-3 rounded-2xl shadow-lg">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-sky-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {business.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 md:w-3/5 space-y-4 flex flex-col justify-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-sky-700">
                       <span className="bg-sky-50 text-sky-900 px-2 py-0.5 rounded-md border border-sky-100">{business.category}</span>
                       <span className="opacity-30">|</span>
                       <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{business.city}</span>
                    </div>
                    <h4 className="text-2xl font-extrabold text-sky-950 pt-1">{business.name}</h4>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 space-y-2">
                    <div className="text-xl font-bold text-sky-900">{business.deal?.title}</div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {business.deal?.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="text-slate-500 text-sm font-medium italic">Limited time offer</div>
                    <Link to={`/business/${business.id}`} className="inline-flex items-center text-sky-800 font-bold hover:text-sky-600 group/link">
                      Get This Deal <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 py-20 bg-white rounded-[3rem] border border-stone-100 shadow-sm text-center">
              <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-sky-950">No {selectedCategory} deals found</h3>
              <p className="text-slate-500 mt-2">Check back soon for new offers in this category!</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-8 text-sky-900 font-bold underline"
              >
                View all categories
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 py-16 px-8 bg-sky-900 rounded-[3rem] text-white">
           <div className="space-y-4 text-center md:text-left">
             <div className="w-12 h-12 bg-sky-800 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
               <Sparkles className="text-sky-300" />
             </div>
             <h5 className="text-xl font-bold">Find Deals</h5>
             <p className="text-sky-200 text-sm leading-relaxed">Browse dozens of local offers updated daily by OC business owners.</p>
           </div>
           <div className="space-y-4 text-center md:text-left">
             <div className="w-12 h-12 bg-sky-800 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
               <ArrowRight className="text-sky-300" />
             </div>
             <h5 className="text-xl font-bold">Redeem Instantly</h5>
             <p className="text-sky-200 text-sm leading-relaxed">Simply show the deal on your phone or mention OC Thrive at checkout.</p>
           </div>
           <div className="space-y-4 text-center md:text-left">
             <div className="w-12 h-12 bg-sky-800 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
               <Tag className="text-sky-300" />
             </div>
             <h5 className="text-xl font-bold">Support Community</h5>
             <p className="text-sky-200 text-sm leading-relaxed">Keeping your spending local strengthens the Orange County economy.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;
