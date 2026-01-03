
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  login: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544413647-ad348259458c?auto=format&fit=crop&q=80&w=2000" 
          alt="Huntington Beach Pier" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 space-y-4">
           <Link to="/" className="inline-flex items-center space-x-2 text-white group">
             <div className="bg-sky-900/40 backdrop-blur-md p-2 rounded-xl border border-white/10 group-hover:scale-110 transition-transform shadow-2xl">
               <Compass className="h-8 w-8" />
             </div>
             <span className="text-3xl font-black tracking-tighter">OC Thrive</span>
           </Link>
           <h2 className="text-sky-100 font-bold uppercase tracking-[0.3em] text-[10px]">Business Owner Dashboard</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] p-10 md:p-12 space-y-8 border border-white/40">
           <div className="text-center">
             <h1 className="text-3xl font-black text-sky-950 tracking-tight">Welcome Back</h1>
             <p className="text-slate-600 mt-2 font-medium">Sign in to manage your local presence.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white/50 border border-stone-200 rounded-2xl pl-12 pr-5 py-5 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-sky-950"
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                   <button type="button" className="text-[10px] font-black text-sky-700 hover:underline uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-white/50 border border-stone-200 rounded-2xl pl-12 pr-5 py-5 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-sky-950"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-sky-950 text-white font-black rounded-2xl hover:bg-sky-900 transition-all shadow-2xl shadow-sky-950/40 flex items-center justify-center active:scale-95">
                 Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </button>
           </form>

           <div className="text-center text-sm font-medium">
             <span className="text-slate-500">Don't have a business account?</span>{' '}
             <Link to="/register" className="text-sky-950 font-black hover:underline">Create one for free</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
