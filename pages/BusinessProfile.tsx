
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Star, 
  Share2, 
  Heart, 
  ArrowLeft,
  Tag,
  MessageSquare,
  Navigation,
  Map,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  CalendarDays,
  Briefcase,
  DollarSign,
  Zap,
  Sparkles,
  Mail,
  Link as LinkIcon,
  Plus
} from 'lucide-react';
import { MOCK_BUSINESSES } from '../constants';

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'events' | 'jobs'>('info');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const business = MOCK_BUSINESSES.find(b => b.id === id);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-sky-950">Business Not Found</h2>
          <p className="text-slate-500">The business you are looking for might have been removed or doesn't exist.</p>
          <Link to="/explore" className="inline-flex items-center px-6 py-3 bg-sky-900 text-white font-bold rounded-xl">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const hasJobs = business.jobs && business.jobs.length > 0;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Header */}
      <div className="relative h-[45vh] md:h-[60vh]">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-950/20 to-transparent" />
        
        <div className="absolute top-8 left-8 right-8 flex justify-between">
          <Link to="/explore" className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all shadow-lg">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex space-x-3">
             <button className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all shadow-lg">
               <Share2 className="h-6 w-6" />
             </button>
             <button className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all shadow-lg">
               <Heart className="h-6 w-6" />
             </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-8 right-8">
          <div className="max-w-7xl mx-auto space-y-4">
             <div className="flex items-center space-x-3">
               <div className="bg-sky-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                 {business.category}
               </div>
               {hasJobs && (
                 <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center shadow-lg animate-pulse">
                   <Briefcase className="h-3 w-3 mr-1.5" /> We're Hiring
                 </div>
               )}
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">{business.name}</h1>
             <div className="flex flex-wrap items-center gap-6 text-white/90">
               <div className="flex items-center">
                 <Star className="h-5 w-5 text-amber-400 fill-current mr-2" />
                 <span className="font-bold">{business.rating}</span>
                 <span className="ml-2 font-medium opacity-70">({business.reviewCount} reviews)</span>
               </div>
               <div className="flex items-center">
                 <MapPin className="h-5 w-5 text-sky-400 mr-2" />
                 <span>{business.city}, CA</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Special Offer Section */}
          {business.deal && (
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Tag className="h-40 w-40" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/20">
                    <Zap className="h-5 w-5 text-orange-100" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-100">Exclusive Local Offer</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight">{business.deal.title}</h3>
                <p className="text-orange-50 text-lg font-medium leading-relaxed">{business.deal.description}</p>
                <button className="px-8 py-4 bg-white text-orange-600 font-black rounded-2xl shadow-xl hover:bg-orange-50 transition-all active:scale-95 uppercase tracking-widest text-xs">
                  Claim Deal
                </button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href={`tel:${business.phone}`} className="flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <Phone className="h-6 w-6 text-sky-900 mb-2 group-hover:scale-110" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Call</span>
            </a>
            <a href={business.website} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <Globe className="h-6 w-6 text-sky-900 mb-2 group-hover:scale-110" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Website</span>
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 bg-sky-50 border border-sky-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <Map className="h-6 w-6 text-sky-900 mb-2 group-hover:scale-110" />
              <span className="text-xs font-bold text-sky-900 uppercase tracking-widest">Directions</span>
            </a>
            <button className="flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
              <MessageSquare className="h-6 w-6 text-sky-900 mb-2 group-hover:scale-110" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</span>
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="space-y-8">
            <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-hide">
               <button onClick={() => setActiveTab('info')} className={`pb-4 px-6 font-bold text-lg transition-all border-b-2 whitespace-nowrap ${activeTab === 'info' ? 'border-sky-900 text-sky-900' : 'border-transparent text-slate-400'}`}>About</button>
               <button onClick={() => setActiveTab('jobs')} className={`pb-4 px-6 font-bold text-lg transition-all border-b-2 whitespace-nowrap flex items-center ${activeTab === 'jobs' ? 'border-sky-900 text-sky-900' : 'border-transparent text-slate-400'}`}>
                 Careers {hasJobs && <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">{business.jobs?.length}</span>}
               </button>
               <button onClick={() => setActiveTab('events')} className={`pb-4 px-6 font-bold text-lg transition-all border-b-2 whitespace-nowrap ${activeTab === 'events' ? 'border-sky-900 text-sky-900' : 'border-transparent text-slate-400'}`}>Events ({business.events?.length || 0})</button>
               <button onClick={() => setActiveTab('reviews')} className={`pb-4 px-6 font-bold text-lg transition-all border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-sky-900 text-sky-900' : 'border-transparent text-slate-400'}`}>Reviews ({business.reviewCount})</button>
            </div>

            {/* Tab Content: Jobs */}
            {activeTab === 'jobs' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-2xl font-extrabold text-sky-950 tracking-tight">Open Opportunities</h4>
                  <div className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Sparkles className="h-3 w-3 mr-1.5" /> Actively Recruiting
                  </div>
                </div>
                
                {hasJobs ? (
                  <div className="grid grid-cols-1 gap-6">
                    {business.jobs?.map(job => (
                      <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-xl transition-all group">
                        <div className="md:w-32 flex flex-col items-center justify-center text-center p-6 bg-sky-50 rounded-3xl border border-sky-100 group-hover:bg-sky-100 transition-colors">
                           <Briefcase className="h-10 w-10 text-sky-900 mb-2" />
                           <div className="text-[10px] font-black text-sky-900 uppercase tracking-widest">{job.type}</div>
                        </div>
                        <div className="flex-grow space-y-4">
                           <div className="flex items-center space-x-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                             <div className="flex items-center"><DollarSign className="h-3 w-3 mr-1" /> {job.salary || 'Competitive'}</div>
                             <span className="text-stone-200">•</span>
                             <div className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Posted {new Date(job.postedAt).toLocaleDateString()}</div>
                           </div>
                           <h4 className="text-2xl font-black text-sky-950 group-hover:text-sky-700 transition-colors">{job.title}</h4>
                           <p className="text-slate-500 font-medium text-sm leading-relaxed">{job.description}</p>
                           <div className="flex items-center pt-2">
                             <button className="px-8 py-3 bg-sky-900 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:bg-sky-800 transition-all flex items-center">
                               {job.applicationMethod === 'email' ? <Mail className="h-4 w-4 mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                               Apply for this Role
                             </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
                    <Briefcase className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <h5 className="text-xl font-bold text-sky-950">No current openings</h5>
                    <p className="text-slate-500 mt-2">Check back soon for new opportunities at {business.name}.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-8 text-slate-700 leading-relaxed animate-in fade-in duration-500">
                <div className="space-y-4">
                  <h4 className="text-2xl font-extrabold text-sky-950">About {business.name}</h4>
                  <p className="text-lg font-light leading-relaxed">{business.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-stone-100">
                  <div className="space-y-4">
                    <h5 className="font-bold text-sky-900 flex items-center uppercase text-xs tracking-widest"><Clock className="mr-2 h-4 w-4" /> Hours</h5>
                    <ul className="space-y-2 text-sm bg-stone-50 p-6 rounded-3xl border border-stone-100">
                      <li className="flex justify-between"><span>Mon - Fri</span><span className="font-semibold">9:00 AM - 6:00 PM</span></li>
                      <li className="flex justify-between"><span>Sat</span><span className="font-semibold">10:00 AM - 4:00 PM</span></li>
                      <li className="flex justify-between text-slate-400"><span>Sun</span><span>Closed</span></li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-bold text-sky-900 flex items-center uppercase text-xs tracking-widest"><MapPin className="mr-2 h-4 w-4" /> Location</h5>
                    <p className="text-sm font-medium">{business.address}</p>
                    <div className="aspect-video w-full rounded-3xl bg-stone-200 overflow-hidden shadow-inner border border-stone-100">
                       <img src={`https://picsum.photos/seed/${business.id}/800/450`} alt="Location Preview" className="w-full h-full object-cover opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                 {business.events && business.events.length > 0 ? (
                    business.events.map(event => (
                      <div key={event.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-xl transition-all">
                        <div className="md:w-32 flex flex-col items-center justify-center text-center p-6 bg-stone-50 rounded-3xl border border-stone-100">
                           <div className="text-sky-950 font-black text-3xl">{new Date(event.date).getDate()}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        </div>
                        <div className="flex-grow space-y-3">
                           <div className="flex items-center space-x-2 text-[10px] font-black text-sky-700 uppercase tracking-widest"><Clock className="h-3 w-3" /><span>{event.time}</span><span>•</span><span>{event.price || 'Free'}</span></div>
                           <h4 className="text-xl font-black text-sky-950">{event.title}</h4>
                           <p className="text-slate-500 font-medium text-sm leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    ))
                 ) : (
                    <div className="text-center py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
                      <CalendarDays className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                      <h5 className="text-xl font-bold text-sky-950">No upcoming events</h5>
                    </div>
                 )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-extrabold text-sky-950">Guest Reviews</h4>
                  <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-6 py-2 bg-sky-900 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg">Write Review</button>
                </div>
                {business.reviews?.map(review => (
                  <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-900">{review.userName.charAt(0)}</div>
                        <div>
                          <div className="font-bold text-sky-950 flex items-center">{review.userName} {review.isVerified && <CheckCircle2 className="h-3 w-3 ml-2 text-emerald-500" />}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{review.timestamp}</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-lg sticky top-32">
            <h4 className="text-xl font-extrabold text-sky-950 mb-6 border-b border-stone-100 pb-4">Contact Detail</h4>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sky-50 rounded-2xl text-sky-700"><Phone className="h-5 w-5" /></div>
                <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Phone</div><div className="font-bold text-sky-950 text-lg">{business.phone}</div></div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sky-50 rounded-2xl text-sky-700"><Globe className="h-5 w-5" /></div>
                <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</div><a href={business.website} target="_blank" rel="noreferrer" className="font-bold text-sky-950 hover:text-sky-600 break-all">{business.website.replace('https://', '')}</a></div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-sky-50 rounded-2xl text-sky-700"><MapPin className="h-5 w-5" /></div>
                <div className="flex-grow"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</div><div className="font-bold text-sky-950 leading-relaxed">{business.address}</div></div>
              </div>
            </div>
            <button className="w-full mt-10 py-5 bg-sky-900 text-white font-black rounded-2xl shadow-xl shadow-sky-900/20 active:scale-95 transition-all">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
