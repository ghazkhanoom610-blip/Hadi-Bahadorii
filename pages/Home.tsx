
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_BUSINESSES, CITIES } from '../constants';
import { Region } from '../types';
import BusinessCard from '../components/BusinessCard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?q=${keyword}&city=${city}`);
  };

  const dealBusinesses = MOCK_BUSINESSES.filter(b => b.deal);

  const regionCards = [
    { name: Region.COASTAL, image: 'https://images.unsplash.com/photo-1502680399488-66046e96387d?auto=format&fit=crop&q=80&w=800' },
    { name: Region.SOUTH_OC, image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&q=80&w=800' },
    { name: Region.NORTH_OC, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=800' },
    { name: Region.INLAND, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ghost Background Image */}
      <div className="fixed inset-0 -z-50 pointer-events-none opacity-[0.08] contrast-125">
        <img 
          src="https://images.unsplash.com/photo-1544413647-ad348259458c?auto=format&fit=crop&q=80&w=2000" 
          alt="OC Subtle Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 space-y-20 pb-20">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden bg-sky-950">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=2000" 
              alt="Laguna Coast" 
              className="w-full h-full object-cover transform transition-transform duration-[20s] hover:scale-105"
            />
            {/* Soft gradient to ensure text readability without obscuring the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-950/80 via-sky-950/20 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl text-white space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="h-4 w-4 text-sky-300" />
                <span className="text-sm font-semibold tracking-wide uppercase">Discover Local Excellence</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                The Best of <span className="text-sky-300 italic">Orange County.</span>
              </h1>
              <p className="text-xl text-stone-200 leading-relaxed font-light">
                Connect with premier local businesses, discover hidden gems, and unlock exclusive community deals across Southern California.
              </p>

              <form onSubmit={handleSearch} className="flex flex-col md:flex-row bg-white/95 backdrop-blur rounded-2xl p-2 shadow-2xl overflow-hidden border border-white/40">
                <div className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-stone-200">
                  <Search className="text-sky-900 h-5 w-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Keywords (Surf, Grill, Hub...)"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-stone-200 min-w-[200px]">
                  <MapPin className="text-sky-900 h-5 w-5 mr-3" />
                  <select 
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium appearance-none cursor-pointer"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="bg-sky-900 text-white px-8 py-4 font-bold rounded-xl hover:bg-sky-800 transition-all flex items-center justify-center m-1 shadow-lg">
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-sm font-bold text-sky-700 uppercase tracking-widest mb-2 italic">Special Offers</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-sky-950">Shop Local Deals</h3>
            </div>
            <Link to="/deals" className="hidden sm:flex items-center text-sky-800 font-bold hover:text-sky-600 transition-colors">
              View All Deals <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dealBusinesses.slice(0, 3).map(business => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>

        {/* Browse by Region */}
        <section className="bg-sky-50/50 backdrop-blur-sm py-24 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
              <h3 className="text-3xl md:text-4xl font-extrabold text-sky-950">Explore by Region</h3>
              <p className="text-slate-600 leading-relaxed">From the sunny shores of Dana Point to the bustling streets of Anaheim, find exactly what you're looking for.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {regionCards.map((region) => (
                <Link 
                  key={region.name}
                  to={`/explore?region=${region.name}`}
                  className="group relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl transition-all hover:-translate-y-2 border border-white"
                >
                  <img 
                    src={region.image} 
                    alt={region.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-950/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h4 className="text-2xl font-black text-white mb-2">{region.name}</h4>
                    <div className="flex items-center text-sky-300 font-bold text-xs uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      Browse Businesses <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Community CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-sky-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-sky-800">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-800 rounded-full opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-800 rounded-full opacity-50 blur-3xl" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Own a business in <br/><span className="text-sky-300 italic">Orange County?</span></h2>
              <p className="text-xl text-stone-300 font-light leading-relaxed">
                Join thousands of local owners who trust OC Thrive to connect with residents and visitors every day. 
                Get listed for free and start promoting your deals.
              </p>
              <Link 
                to="/add-business" 
                className="inline-flex items-center px-10 py-5 bg-orange-500 text-white text-lg font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                Get Started Now <ChevronRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
