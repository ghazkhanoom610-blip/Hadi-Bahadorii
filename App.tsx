
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Store, 
  Tag, 
  PlusCircle, 
  User, 
  Menu, 
  X,
  Compass,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Zap,
  DollarSign,
  Gem,
  Award,
  CalendarDays,
  Briefcase
} from 'lucide-react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Deals from './pages/Deals';
import Events from './pages/Events';
import Jobs from './pages/Jobs';
import Pricing from './pages/Pricing';
import BusinessProfile from './pages/BusinessProfile';
import AddBusiness from './pages/AddBusiness';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AIChatBot from './components/AIChatBot';
import { AuthUser } from './types';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar: React.FC<{ user: AuthUser | null; logout: () => void }> = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isPriceActive = (price: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('price') === price;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-sky-900 p-2 rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-sky-900/20">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-sky-950">OC Thrive</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <Link to="/explore" className="text-slate-600 hover:text-sky-900 font-bold transition-colors">Explore</Link>
            <Link to="/deals" className="text-slate-600 hover:text-sky-900 font-bold transition-colors">Deals</Link>
            <Link to="/events" className="text-slate-600 hover:text-sky-900 font-bold transition-colors">Events</Link>
            <Link to="/jobs" className="text-slate-600 hover:text-sky-900 font-bold transition-colors">Jobs</Link>
            
            {/* Quick Filter Shortcuts */}
            <div className="flex items-center space-x-2 mr-4">
              <Link 
                to="/explore?price=free" 
                title="Free Listings"
                className={`flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 group ${
                  isPriceActive('free') 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                <Zap className="h-3 w-3 mr-1.5 group-hover:animate-pulse" /> Free
              </Link>
              <Link 
                to="/explore?price=value" 
                title="Value Package"
                className={`flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 group ${
                  isPriceActive('value') 
                  ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-600/20' 
                  : 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100'
                }`}
              >
                <DollarSign className="h-3 w-3 mr-1.5 group-hover:rotate-12 transition-transform" /> Value
              </Link>
            </div>
            
            {user?.isLoggedIn ? (
              <>
                <Link to="/dashboard" className="flex items-center text-sky-900 hover:text-sky-700 font-bold transition-colors">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <button onClick={logout} className="text-slate-600 hover:text-sky-800 font-medium">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-slate-600 hover:text-sky-800 font-medium">Login</Link>
            )}
            
            <Link to="/add-business" className="inline-flex items-center px-6 py-3 bg-sky-950 text-white font-bold rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 active:scale-95">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Business
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-sky-900 p-2 bg-stone-100 rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 px-4 py-8 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/explore" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-slate-900 font-bold border border-stone-200">Explore</Link>
            <Link to="/deals" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-slate-900 font-bold border border-stone-200">Deals</Link>
            <Link to="/events" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-slate-900 font-bold border border-stone-200">Events</Link>
            <Link to="/jobs" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-4 bg-stone-50 rounded-2xl text-slate-900 font-bold border border-stone-200">Jobs</Link>
          </div>
          
          <div className="pt-6 border-t border-stone-100 space-y-5">
            {user?.isLoggedIn ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center text-sky-900 font-bold text-lg"><LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard</Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-slate-600 font-bold px-1">Login</Link>
            )}
            <Link to="/add-business" onClick={() => setIsOpen(false)} className="inline-flex items-center w-full justify-center px-5 py-5 bg-sky-950 text-white font-black rounded-[1.5rem] shadow-xl shadow-sky-900/20">
              <PlusCircle className="mr-3 h-6 w-6" />
              Add Your Business
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-sky-950 text-stone-300 py-20 px-4 border-t border-sky-900">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="space-y-6 col-span-1 md:col-span-2">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-1 rounded-lg">
            <Compass className="h-6 w-6 text-sky-950" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">OC Thrive</span>
        </div>
        <p className="max-w-md text-stone-400 leading-relaxed">
          The definitive guide to Orange County's vibrant local scene. From coastal luxury to inland innovation, we highlight the businesses that make SoCal unique.
        </p>
      </div>
      <div>
        <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Directory</h4>
        <ul className="space-y-4 font-bold text-sm">
          <li><Link to="/explore" className="hover:text-sky-400 transition-colors">Find Businesses</Link></li>
          <li><Link to="/deals" className="hover:text-sky-400 transition-colors">Exclusive Deals</Link></li>
          <li><Link to="/events" className="hover:text-sky-400 transition-colors">Local Events</Link></li>
          <li><Link to="/jobs" className="hover:text-sky-400 transition-colors">Job Board</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px]">Business Owners</h4>
        <ul className="space-y-4 font-bold text-sm">
          <li><Link to="/add-business" className="hover:text-sky-400 transition-colors">Get Listed (Free)</Link></li>
          <li><Link to="/pricing" className="hover:text-sky-400 transition-colors">Advertising Plans</Link></li>
          <li><Link to="/login" className="hover:text-sky-400 transition-colors">Owner Dashboard</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-sky-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-stone-500 font-bold uppercase tracking-widest">
      <div>&copy; {new Date().getFullYear()} OC Thrive. All rights reserved.</div>
      <div className="flex space-x-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string) => setUser({ email, isLoggedIn: true });
  const logout = () => setUser(null);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans selection:bg-sky-200 selection:text-sky-900">
        <Navbar user={user} logout={logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/events" element={<Events />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/add-business" element={<AddBusiness user={user} login={login} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/register" element={<Register login={login} />} />
          </Routes>
        </main>
        <Footer />
        <AIChatBot />
      </div>
    </HashRouter>
  );
}
