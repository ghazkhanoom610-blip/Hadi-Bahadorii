
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Tag, 
  PlusCircle, 
  Settings, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Store,
  MapPin,
  Globe,
  BarChart,
  DollarSign,
  Info,
  X,
  MessageSquare,
  Zap,
  ChevronRight,
  History,
  Activity,
  Star,
  Heart,
  Clock,
  Briefcase,
  Share2,
  Save,
  Phone,
  Layout,
  Crown
} from 'lucide-react';
import { AuthUser, Category, Region, JobType, Business } from '../types';
import { MOCK_BUSINESSES, CITIES } from '../constants';
import { GeminiService } from '../GeminiService';

interface DashboardProps { user: AuthUser | null; }

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Simulate business ownership for the demo
  const [businessData, setBusinessData] = useState<Business>(MOCK_BUSINESSES[0]);
  const [activeView, setActiveView] = useState<'overview' | 'deals' | 'events' | 'jobs'>('overview');
  
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: businessData.name,
    description: businessData.description,
    category: businessData.category,
    city: businessData.city,
    address: businessData.address,
    phone: businessData.phone,
    website: businessData.website
  });

  const handleSaveProfile = () => {
    setBusinessData({ ...businessData, ...editForm });
    setIsEditProfileOpen(false);
  };

  const [deals, setDeals] = useState([
    { id: 'd1', title: '20% Off All Surfboards', status: 'Active', conversions: 42, views: 890, expiry: 'Dec 31, 2025' },
    { id: 'd2', title: 'Summer Bundle Discount', status: 'Scheduled', conversions: 0, views: 0, expiry: 'Aug 15, 2025' },
  ]);

  const [events, setEvents] = useState([
    { id: 'e1', title: 'Morning Surf Clinic', date: '2025-06-12', time: '7:00 AM', price: 'Free', attendees: 12, status: 'Published' },
    { id: 'e2', title: 'New Board Release Party', date: '2025-07-01', time: '6:00 PM', price: 'Free', attendees: 45, status: 'Draft' }
  ]);

  const [jobs, setJobs] = useState([
    { id: 'j1', title: 'Surf Instructor', type: JobType.PART_TIME, salary: '$25/hr', apps: 14, postedAt: '2025-05-01', isFeatured: true },
    { id: 'j2', title: 'Retail Associate', type: JobType.FULL_TIME, salary: '$18-20/hr', apps: 8, postedAt: '2025-05-05', isFeatured: false }
  ]);

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  const stats = [
    { label: 'Total Impressions', value: '14,280', growth: '+12.5%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Local Reach Index', value: '94/100', growth: '+3.1%', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Conversion Lift', value: '28%', growth: '+24.1%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Community Rating', value: '4.8', growth: 'Stable', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const getAiInsight = async () => {
    setIsAiSuggesting(true);
    try {
      const msg = `Act as a luxury business consultant for Orange County. Give a 1-sentence growth tip for a business named "${businessData.name}" which is a "${businessData.category}" in "${businessData.city}". Suggest an event, deal or hiring concept.`;
      const response = await GeminiService.chatWithThinking(msg);
      setAiInsight(response);
    } catch (e) {
      setAiInsight("Consider hosting a 'Sunset Social' event to leverage your coastal location and increase evening foot traffic.");
    } finally {
      setIsAiSuggesting(false);
    }
  };

  useEffect(() => {
    getAiInsight();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-4">
      
      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-md" onClick={() => setIsEditProfileOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-sky-900 transition-colors">
              <X className="h-6 w-6" />
            </button>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-sky-900 rounded-2xl text-white">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-sky-950 tracking-tight">Edit Business Profile</h3>
                  <p className="text-slate-500 font-medium">Manually update your brand's public presence.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Business Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold text-sky-950"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <select 
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none font-bold text-sky-950"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City</label>
                  <select 
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none font-bold text-sky-950"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 font-medium text-slate-700 leading-relaxed"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-5 bg-stone-100 text-slate-600 font-black rounded-2xl hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-5 bg-sky-900 text-white font-black rounded-2xl shadow-xl hover:bg-sky-800 transition-all flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Creation Modals */}
      {(isDealModalOpen || isEventModalOpen || isJobModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm" onClick={() => { setIsDealModalOpen(false); setIsEventModalOpen(false); setIsJobModalOpen(false); }} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
            <button onClick={() => { setIsDealModalOpen(false); setIsEventModalOpen(false); setIsJobModalOpen(false); }} className="absolute top-8 right-8 text-slate-400 hover:text-sky-900"><X /></button>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-sky-950 tracking-tight">Create New {isDealModalOpen ? 'Deal' : isEventModalOpen ? 'Event' : 'Job'}</h3>
                <p className="text-slate-500 font-medium">Fill in the details to publish to the OC Thrive network.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Title</label>
                  <input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Description</label>
                  <textarea rows={3} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 outline-none font-medium text-sm"></textarea>
                </div>
                <button className="w-full py-5 bg-sky-900 text-white font-black rounded-2xl shadow-xl hover:bg-sky-800 transition-all active:scale-95">Publish Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3.5rem] shadow-xl border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-40" />
          <div className="flex items-center space-x-6 relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl ring-4 ring-sky-100">
              <img src={businessData.imageUrl} alt={businessData.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-black text-sky-950 tracking-tight">{businessData.name}</h1>
                <div className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Owner
                </div>
              </div>
              <p className="text-slate-500 font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-sky-700" /> {businessData.city}, {businessData.region}
              </p>
            </div>
          </div>
          <div className="flex gap-3 relative z-10">
            <button 
              onClick={() => setIsEditProfileOpen(true)}
              className="p-4 bg-stone-100 text-sky-950 rounded-2xl hover:bg-stone-200 transition-all shadow-sm border border-stone-200"
            >
              <Edit3 className="h-5 w-5" />
            </button>
            <Link to={`/business/${businessData.id}`} className="px-8 py-4 bg-sky-950 text-white font-black rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 active:scale-95 flex items-center">
              <Eye className="h-5 w-5 mr-2" /> Live Preview
            </Link>
          </div>
        </div>

        {/* AI Insight Bar */}
        <div className="bg-gradient-to-r from-sky-950 to-indigo-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group shadow-2xl">
          <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-300">AI Growth Strategist</h3>
              </div>
              <h4 className="text-2xl font-black italic max-w-3xl leading-snug">
                {isAiSuggesting ? "Analyzing local market density..." : aiInsight ? `"${aiInsight}"` : "Calculating your next competitive advantage..."}
              </h4>
            </div>
            <button onClick={getAiInsight} className="px-8 py-4 bg-white text-sky-950 font-black rounded-2xl hover:bg-sky-50 transition-all active:scale-95 shadow-xl whitespace-nowrap">
              Refresh Insights
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-3xl border border-stone-200 shadow-sm inline-flex">
          <button onClick={() => setActiveView('overview')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center ${activeView === 'overview' ? 'bg-sky-900 text-white shadow-xl' : 'text-slate-400 hover:text-sky-900'}`}>
            <Activity className="h-4 w-4 mr-2" /> Overview
          </button>
          <button onClick={() => setActiveView('deals')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center ${activeView === 'deals' ? 'bg-sky-900 text-white shadow-xl' : 'text-slate-400 hover:text-sky-900'}`}>
            <Tag className="h-4 w-4 mr-2" /> Deals
          </button>
          <button onClick={() => setActiveView('events')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center ${activeView === 'events' ? 'bg-sky-900 text-white shadow-xl' : 'text-slate-400 hover:text-sky-900'}`}>
            <Calendar className="h-4 w-4 mr-2" /> Events
          </button>
          <button onClick={() => setActiveView('jobs')} className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center ${activeView === 'jobs' ? 'bg-sky-900 text-white shadow-xl' : 'text-slate-400 hover:text-sky-900'}`}>
            <Briefcase className="h-4 w-4 mr-2" /> Jobs
          </button>
        </div>

        {/* View Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeView === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl border border-stone-100 hover:border-sky-200 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`${stat.bg} ${stat.color} p-4 rounded-[1.5rem] shadow-inner transition-transform group-hover:scale-110`}><stat.icon className="h-6 w-6" /></div>
                      <div className="text-emerald-500 font-bold text-[10px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">{stat.growth}</div>
                    </div>
                    <div className="text-4xl font-black text-sky-950 tracking-tighter mb-1">{stat.value}</div>
                    <div className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-xl border border-stone-100 p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-sky-950 tracking-tight">Listing Analytics</h2>
                      <p className="text-slate-400 text-sm font-medium">Daily profile impressions over the last 14 days</p>
                    </div>
                  </div>
                  <div className="h-64 flex items-end justify-between px-4 pb-12 border-b border-stone-50 gap-2">
                    {[45, 67, 43, 89, 55, 92, 120, 110, 85, 95, 140, 115, 130, 155].map((h, i) => (
                      <div key={i} className="flex-grow flex flex-col justify-end space-y-1 group relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-sky-950 text-white px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Day {i+1}: {Math.round(h * 1.5)}
                        </div>
                        <div className="w-full bg-sky-900 rounded-t-xl transition-all hover:bg-sky-700 cursor-pointer" style={{ height: `${h}%` }}></div>
                        <div className="w-full bg-sky-100 rounded-b-md" style={{ height: `${h * 0.3}%` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-4 text-center">
                    <div className="p-6 bg-stone-50 rounded-3xl">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Growth</div>
                      <div className="text-3xl font-black text-sky-950">+18.5%</div>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-3xl">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Quality</div>
                      <div className="text-3xl font-black text-emerald-600">High</div>
                    </div>
                    <div className="p-6 bg-stone-50 rounded-3xl">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Search %</div>
                      <div className="text-3xl font-black text-sky-900">72%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-950 rounded-[3.5rem] p-10 text-white space-y-10 relative overflow-hidden shadow-2xl">
                  <Activity className="absolute top-10 right-10 w-24 h-24 text-white/5" />
                  <h2 className="text-2xl font-black tracking-tight flex items-center">
                    <History className="h-6 w-6 mr-3 text-sky-400" /> Active Pulse
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400"><Tag className="h-5 w-5" /></div>
                      <div>
                        <div className="text-sm font-bold">New Deal Claim</div>
                        <p className="text-xs text-sky-300/60 mt-0.5">"20% Off Boards" claimed by 3 locals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="bg-sky-500/20 p-3 rounded-xl text-sky-400"><Calendar className="h-5 w-5" /></div>
                      <div>
                        <div className="text-sm font-bold">Event RSVP</div>
                        <p className="text-xs text-sky-300/60 mt-0.5">Marcus T. joined "Surf Clinic"</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400"><Star className="h-5 w-5 fill-current" /></div>
                      <div>
                        <div className="text-sm font-bold">New Review</div>
                        <p className="text-xs text-sky-300/60 mt-0.5">Chloe S. left a 5-star rating</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-5 bg-white/10 border border-white/10 rounded-[1.5rem] text-sm font-black hover:bg-white/20 transition-all flex items-center justify-center group">
                    Full Feed <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'deals' && (
            <div className="bg-white rounded-[3.5rem] shadow-xl border border-stone-100 p-10 md:p-14 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-sky-950 tracking-tight">Manage Promotions</h2>
                  <p className="text-slate-400 font-medium">Drive foot traffic with exclusive local offers.</p>
                </div>
                <button onClick={() => setIsDealModalOpen(true)} className="px-10 py-5 bg-sky-900 text-white font-black rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 flex items-center active:scale-95">
                  <PlusCircle className="mr-3 h-5 w-5" /> Launch Offer
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {deals.map(deal => (
                  <div key={deal.id} className="p-10 bg-stone-50 rounded-[3rem] border border-stone-100 flex flex-col justify-between group hover:border-sky-200 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${deal.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {deal.status === 'Active' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />}
                          {deal.status}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">EXP: {deal.expiry}</div>
                      </div>
                      <h3 className="text-2xl font-black text-sky-950 mb-2">{deal.title}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Views</div>
                            <div className="text-2xl font-black text-sky-950">{deal.views}</div>
                         </div>
                         <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Claims</div>
                            <div className="text-2xl font-black text-orange-600">{deal.conversions}</div>
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-stone-200">
                      <button className="flex-grow py-4 bg-white border border-stone-200 text-sky-900 font-bold rounded-xl hover:bg-stone-100 transition-all flex items-center justify-center"><Edit3 className="h-4 w-4 mr-2" /> Edit</button>
                      <button className="p-4 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'events' && (
            <div className="bg-white rounded-[3.5rem] shadow-xl border border-stone-100 p-10 md:p-14 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-sky-950 tracking-tight">Manage Events</h2>
                  <p className="text-slate-400 font-medium">Schedule workshops, launches, and community mixers.</p>
                </div>
                <button onClick={() => setIsEventModalOpen(true)} className="px-10 py-5 bg-sky-900 text-white font-black rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 flex items-center active:scale-95">
                  <PlusCircle className="mr-3 h-5 w-5" /> Host New Event
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map(event => (
                  <div key={event.id} className="p-10 bg-stone-50 rounded-[3rem] border border-stone-100 flex flex-col justify-between group hover:border-sky-200 transition-all">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <div className="bg-sky-900 p-3 rounded-2xl text-white"><Calendar className="h-5 w-5" /></div>
                           <div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                             <div className="text-sm font-black text-sky-950">{new Date(event.date).toLocaleDateString()}</div>
                           </div>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${event.status === 'Published' ? 'bg-sky-100 text-sky-700' : 'bg-stone-200 text-slate-500'}`}>
                            {event.status}
                         </div>
                      </div>
                      <h3 className="text-2xl font-black text-sky-950">{event.title}</h3>
                      <div className="flex items-center space-x-6">
                         <div className="flex items-center text-xs font-bold text-slate-500">
                            <Users className="h-4 w-4 mr-1.5 text-sky-700" /> {event.attendees} RSVPs
                         </div>
                         <div className="flex items-center text-xs font-bold text-slate-500">
                            <DollarSign className="h-4 w-4 mr-1.5 text-emerald-600" /> {event.price} Entry
                         </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-stone-200">
                      <button className="flex-grow py-4 bg-white border border-stone-200 text-sky-900 font-bold rounded-xl hover:bg-stone-100 transition-all flex items-center justify-center"><Edit3 className="h-4 w-4 mr-2" /> Update</button>
                      <button className="p-4 bg-stone-200 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'jobs' && (
            <div className="bg-white rounded-[3.5rem] shadow-xl border border-stone-100 p-10 md:p-14 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-sky-950 tracking-tight">Talent Hub</h2>
                  <p className="text-slate-400 font-medium">Recruit local talent for your growing business.</p>
                </div>
                <button onClick={() => setIsJobModalOpen(true)} className="px-10 py-5 bg-sky-900 text-white font-black rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 flex items-center active:scale-95">
                  <PlusCircle className="mr-3 h-5 w-5" /> Post Job
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.map(job => (
                  <div key={job.id} className={`relative p-10 rounded-[3rem] border transition-all flex flex-col justify-between group ${job.isFeatured ? 'bg-sky-50 border-sky-300 shadow-md' : 'bg-stone-50 border-stone-100'}`}>
                    {job.isFeatured && (
                       <div className="absolute -top-3 left-10 bg-sky-900 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] flex items-center shadow-lg">
                         <Crown className="h-3 w-3 mr-1.5 text-sky-300" /> Featured Posting
                       </div>
                    )}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <div className={`p-3 rounded-2xl border ${job.isFeatured ? 'bg-white border-sky-100 text-sky-900' : 'bg-sky-50 border-sky-50 text-sky-900'}`}><Briefcase className="h-5 w-5" /></div>
                           <div>
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</div>
                             <div className="text-sm font-black text-sky-950">{job.type}</div>
                           </div>
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}</div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-sky-950 mb-1">{job.title}</h3>
                        <div className="text-emerald-600 font-black text-sm uppercase tracking-widest">{job.salary}</div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-between">
                         <div className="flex items-center">
                            <Users className="h-5 w-5 mr-3 text-sky-700" />
                            <span className="text-sm font-black text-sky-950">Applicants</span>
                         </div>
                         <div className="text-2xl font-black text-sky-900">{job.apps}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-8 pt-8 border-t border-stone-200">
                      <button className={`flex-grow py-4 font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center ${job.isFeatured ? 'bg-sky-900 text-white' : 'bg-white border border-stone-200 text-sky-950'}`}>
                        Review Talent
                      </button>
                      {!job.isFeatured && (
                         <button className="p-4 bg-sky-100 text-sky-900 rounded-xl hover:bg-sky-200 transition-all flex items-center group/p" title="Promote to Featured">
                            <Sparkles className="h-5 w-5 group-hover/p:rotate-12 transition-transform" />
                         </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
