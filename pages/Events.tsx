
import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Search, Tag, Sparkles, Clock, ArrowRight, Filter, ChevronRight } from 'lucide-react';
import { MOCK_BUSINESSES, CITIES } from '../constants';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const allEvents = useMemo(() => {
    return MOCK_BUSINESSES.flatMap(b => 
      (b.events || []).map(e => ({ ...e, business: b }))
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchesCity = !selectedCity || e.business.city === selectedCity;
      const matchesSearch = !searchQuery || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.business.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [allEvents, selectedCity, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Header */}
      <div className="bg-sky-950 text-white relative overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute top-0 right-0 w-[40%] h-full opacity-10">
          <Calendar className="w-full h-full transform -rotate-12 translate-y-12 translate-x-12" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-4 h-4" />
            Live Orange County
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The OC <span className="text-sky-300 italic">Calendar.</span></h1>
          <p className="text-sky-200 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            From sunrise surf clinics to harbor-side jazz, discover the events defining our community this season.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search events, festivals, or hosts..."
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-16 pr-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-medium text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:col-span-4 relative">
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
            <div className="md:col-span-2">
              <button className="w-full h-full bg-sky-900 text-white font-black rounded-2xl hover:bg-sky-800 shadow-lg shadow-sky-900/20 transition-all active:scale-95 flex items-center justify-center">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-stone-100 overflow-hidden flex flex-col lg:flex-row group group/item">
                <div className="lg:w-1/4 bg-stone-50 p-10 flex flex-col items-center justify-center text-center border-r border-stone-100">
                  <div className="text-sky-900 font-black text-5xl tracking-tighter mb-1">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="mt-6 inline-flex items-center px-4 py-1.5 bg-sky-100 text-sky-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {event.time}
                  </div>
                </div>

                <div className="lg:w-3/4 p-10 md:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Link to={`/business/${event.business.id}`} className="flex items-center space-x-2 text-sky-700 hover:text-sky-900 transition-colors">
                        <div className="w-6 h-6 rounded-lg overflow-hidden border border-sky-100">
                          <img src={event.business.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{event.business.name}</span>
                      </Link>
                      <span className="text-slate-200">|</span>
                      <div className="flex items-center text-slate-400 text-sm font-bold">
                        <MapPin className="h-4 w-4 mr-1 text-sky-500" />
                        {event.location || `${event.business.city}, CA`}
                      </div>
                    </div>

                    <h3 className="text-3xl font-extrabold text-sky-950 tracking-tight group-hover/item:text-sky-700 transition-colors">{event.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-lg line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                    <div className="flex items-center space-x-4">
                      <div className="px-4 py-2 bg-stone-100 rounded-xl text-slate-700 font-black text-xs uppercase tracking-widest">
                        Price: {event.price || 'Free'}
                      </div>
                    </div>
                    <Link to={`/business/${event.business.id}`} className="flex items-center text-sky-900 font-black text-sm uppercase tracking-widest hover:translate-x-2 transition-transform">
                      Event Details <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-stone-200">
              <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Calendar className="h-10 w-10 text-slate-200" />
              </div>
              <h2 className="text-3xl font-black text-sky-950">No events found</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Try adjusting your city filter or search keywords to find local happenings.</p>
              <button 
                onClick={() => { setSelectedCity(''); setSearchQuery(''); }}
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

export default Events;
