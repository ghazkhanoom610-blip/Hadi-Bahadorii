
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  DollarSign, 
  Gem, 
  Check, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  Eye 
} from 'lucide-react';
import { ListingPackage } from '../types';

const Pricing: React.FC = () => {
  const plans = [
    {
      id: 'free',
      name: ListingPackage.FREE,
      price: '$0',
      description: 'Ideal for small local shops getting started on the platform.',
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      btn: 'bg-white text-emerald-700 border-emerald-200',
      features: [
        'Standard Business Profile',
        'Basic Description (AI Assisted)',
        'Local Search Inclusion',
        '1 Contact Method'
      ]
    },
    {
      id: 'silver',
      name: ListingPackage.SILVER,
      price: '$49',
      period: '/mo',
      description: 'The standard choice for businesses wanting more visibility.',
      icon: DollarSign,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      btn: 'bg-sky-900 text-white',
      featured: true,
      features: [
        'Priority Search Results',
        'Verified Local Badge',
        'Exclusive Deals Highlighting',
        '3 Photo Gallery',
        'Monthly View Analytics'
      ]
    },
    {
      id: 'gold',
      name: ListingPackage.GOLD,
      price: '$149',
      period: '/mo',
      description: 'Comprehensive marketing package to capture the OC market.',
      icon: Gem,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      btn: 'bg-white text-indigo-700 border-indigo-200',
      features: [
        'Featured Hero Status',
        'Premium 4K Visual Identity',
        'AI Assisted Content Writing',
        'Direct Messaging Suite',
        'Advanced Market Insights',
        'No Competitor Ads'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <div className="bg-sky-950 text-white pt-32 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 bg-sky-900 text-sky-300 rounded-full text-xs font-black uppercase tracking-widest border border-sky-800">
            Business Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Expand Your <span className="text-sky-400">Footprint.</span></h1>
          <p className="text-sky-200 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Choose a tier that aligns with your growth goals. From simple free listings to premium concierge exposure.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-white rounded-[3rem] p-10 shadow-2xl border-2 transition-all hover:-translate-y-2 relative flex flex-col ${
                plan.featured ? 'border-sky-500 scale-105 z-10' : 'border-stone-100'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                  Most Popular
                </div>
              )}
              
              <div className="flex-grow space-y-8">
                <div className="flex items-center justify-between">
                  <div className={`p-4 ${plan.bg} ${plan.color} rounded-[1.5rem]`}>
                    <plan.icon className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-sky-950">{plan.price}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{plan.period || 'Forever'}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-sky-950">{plan.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{plan.description}</p>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-slate-600 font-bold text-sm">
                      <div className={`mr-3 p-1 rounded-full ${plan.bg} ${plan.color}`}>
                        <Check className="h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                to={`/add-business?package=${plan.id}`}
                className={`w-full mt-10 py-5 rounded-[1.5rem] font-black text-center shadow-lg transition-all active:scale-95 ${plan.btn}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-sky-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-sky-800 rounded-full blur-3xl opacity-40 -mr-48 -mt-48" />
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
               <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Why list on <span className="text-sky-400 italic">OC Thrive?</span></h2>
               <p className="text-sky-200 text-lg leading-relaxed font-light">
                 Our platform isn't just a directory; it's a neighborhood engine powered by AI. We connect local shoppers with the stories behind the brands.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                 <div className="flex items-center space-x-4">
                   <div className="bg-sky-800 p-3 rounded-2xl"><Users className="text-sky-300" /></div>
                   <div className="text-sm font-bold">10k+ Monthly Users</div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="bg-sky-800 p-3 rounded-2xl"><TrendingUp className="text-sky-300" /></div>
                   <div className="text-sm font-bold">85% Local Traffic</div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="bg-sky-800 p-3 rounded-2xl"><Eye className="text-sky-300" /></div>
                   <div className="text-sm font-bold">High Intent Search</div>
                 </div>
                 <div className="flex items-center space-x-4">
                   <div className="bg-sky-800 p-3 rounded-2xl"><Sparkles className="text-sky-300" /></div>
                   <div className="text-sm font-bold">AI Content Suite</div>
                 </div>
               </div>
             </div>
             <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-10 border border-white/20 shadow-2xl space-y-8">
                   <div className="space-y-2">
                     <h4 className="text-xl font-black">Ready to scale?</h4>
                     <p className="text-sky-300 text-sm font-medium">Join 500+ Orange County businesses today.</p>
                   </div>
                   <Link to="/add-business" className="flex items-center justify-center w-full py-5 bg-white text-sky-950 font-black rounded-[1.5rem] shadow-xl hover:bg-sky-50 transition-all">
                     Join Now <ChevronRight className="ml-2 h-6 w-6" />
                   </Link>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
