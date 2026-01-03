
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Store, 
  User, 
  MapPin, 
  FileText,
  AlertCircle,
  Sparkles, 
  Loader2, 
  RefreshCw,
  DollarSign,
  Plus,
  Mail,
  Link as LinkIcon,
  Zap,
  Gem,
  Trash2,
  UploadCloud,
  Briefcase,
  XCircle,
  LayoutDashboard,
  Home as HomeIcon,
  RotateCcw
} from 'lucide-react';
import { Category, Region, AuthUser, JobType, Job, ListingPackage } from '../types';
import { CITIES } from '../constants';
import { GeminiService } from '../GeminiService';

interface AddBusinessProps {
  user: AuthUser | null;
  login: (email: string) => void;
}

const REASSURING_MESSAGES = [
  "Crafting your custom visual identity...",
  "Applying California Coastal aesthetics...",
  "Optimizing resolution for 1K display...",
  "Polishing pixels for professional appeal...",
  "Finalizing your business cover photo..."
];

const AddBusiness: React.FC<AddBusinessProps> = ({ user, login }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Step 1: Package
  const initialPackage = searchParams.get('package') === 'silver' ? ListingPackage.SILVER : 
                         searchParams.get('package') === 'gold' ? ListingPackage.GOLD : 
                         ListingPackage.FREE;
  const [selectedPackage, setSelectedPackage] = useState<ListingPackage>(initialPackage);

  // Step 2: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 3: Brand Identity (Name, Category, Description)
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [description, setDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [hasGeneratedAutoDescription, setHasGeneratedAutoDescription] = useState(false);
  
  // Step 4: Contact & Pricing
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [priceRange, setPriceRange] = useState<'low' | 'mid' | 'high' | 'ultra' | ''>('');

  // Step 5: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState<Region | ''>('');

  // Step 6: Jobs
  const [jobs, setJobs] = useState<Partial<Job>[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({
    title: '',
    description: '',
    type: JobType.FULL_TIME,
    salary: '',
    isFeatured: false
  });
  const [appMethod, setAppMethod] = useState<'email' | 'link'>('email');
  const [appValue, setAppValue] = useState('');

  // Step 7: Media (AI Generation + Manual Upload)
  const [image, setImage] = useState<File | null>(null);
  const [manualPreviewUrl, setManualPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Step 8: Legal
  const [certified, setCertified] = useState(false);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof (window as any).aistudio !== 'undefined') {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    if (step === 7) { checkKey(); }
  }, [step]);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % REASSURING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    return () => {
      if (manualPreviewUrl) URL.revokeObjectURL(manualPreviewUrl);
    };
  }, [manualPreviewUrl]);

  // Automatic Description Generation Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        name.trim().length > 3 && 
        category && 
        !description && 
        !hasGeneratedAutoDescription &&
        step === 3
      ) {
        handleGenerateDescription();
        setHasGeneratedAutoDescription(true);
      }
    }, 1500); 
    return () => clearTimeout(timer);
  }, [name, category, step, description, hasGeneratedAutoDescription]);

  const handleOpenKeySelector = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerateDescription = async () => {
    if (!name || !category) {
      setError('Please enter a business name and select a category first.');
      return;
    }
    setIsGeneratingDescription(true);
    setError('');
    try {
      const result = await GeminiService.generateDescription(name, category);
      if (result) {
        setDescription(result.trim());
      }
    } catch (err) {
      setError('Failed to generate description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    setError('');
    setImage(file);
    setAiImageUrl(null);
    if (manualPreviewUrl) URL.revokeObjectURL(manualPreviewUrl);
    setManualPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    if (file) {
      handleFileSelection(file);
    }
  }, []);

  const clearManualImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(null);
    if (manualPreviewUrl) URL.revokeObjectURL(manualPreviewUrl);
    setManualPreviewUrl(null);
  };

  const addJob = () => {
    if (!currentJob.title || !currentJob.description || !appValue) return;
    const newJob: Partial<Job> = { 
      ...currentJob, 
      id: Math.random().toString(36).substr(2, 9), 
      postedAt: new Date().toISOString(),
      applicationMethod: appMethod,
      applicationValue: appValue
    };
    setJobs([...jobs, newJob]);
    setCurrentJob({ title: '', description: '', type: JobType.FULL_TIME, salary: '', isFeatured: false });
    setAppValue('');
    setShowJobForm(false);
  };

  const removeJob = (idx: number) => {
    setJobs(jobs.filter((_, i) => i !== idx));
  };

  const nextStep = () => {
    if (step === 2 && !user?.isLoggedIn) {
      if (!email || !password) {
        setError('Please enter your account details');
        return;
      }
      login(email);
    }
    if (step === 3 && (!name || !category || !description)) {
      setError('Please complete all business identity details');
      return;
    }
    if (step === 3) {
      if (!aiPrompt) {
        setAiPrompt(`A high-end storefront or interior for "${name}", a premium ${category} business in Orange County, CA. Stunning commercial photography.`);
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    const keySelected = await (window as any).aistudio.hasSelectedApiKey();
    if (!keySelected) await handleOpenKeySelector();

    setIsGenerating(true);
    setError('');
    try {
      const url = await GeminiService.generateImage(aiPrompt as any, "16:9", "1K");
      if (url) {
        setAiImageUrl(url);
        setImage(null);
        setManualPreviewUrl(null);
      } else {
        setError('The generation returned no image. Please refine your description.');
      }
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError("Your API Key selection expired or is invalid. Please select a valid paid API key.");
        await handleOpenKeySelector();
      } else {
        setError('An unexpected error occurred during generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certified || !terms) {
      setError('Agreement to our terms is mandatory for listing.');
      return;
    }
    if (!image && !aiImageUrl) {
      setError('A visual identity (AI generated or Uploaded) is required.');
      setStep(7);
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-[4rem] shadow-2xl p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg">
             <CheckCircle2 className="h-12 w-12" />
           </div>
           <div className="space-y-4">
             <h1 className="text-4xl font-black text-sky-950 tracking-tight">Listing Submitted!</h1>
             <p className="text-slate-500 text-lg font-medium leading-relaxed">
               Your {selectedPackage} registration is being processed. You can now manage your brand from your owner dashboard.
             </p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
             <Link to="/dashboard" className="px-8 py-5 bg-sky-900 text-white font-black rounded-2xl shadow-xl hover:bg-sky-800 transition-all flex items-center justify-center">
               <LayoutDashboard className="h-5 w-5 mr-2" /> Go to Dashboard
             </Link>
             <Link to="/" className="px-8 py-5 bg-stone-100 text-sky-950 font-black rounded-2xl hover:bg-stone-200 transition-all flex items-center justify-center">
               <HomeIcon className="h-5 w-5 mr-2" /> Return Home
             </Link>
           </div>
        </div>
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-16 px-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex flex-col items-center flex-grow last:flex-grow-0 relative">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-xs z-10 border-2 transition-all duration-500 ${
            step >= i ? 'bg-sky-900 border-sky-900 text-white shadow-xl rotate-0' : 'bg-white border-stone-200 text-slate-400 rotate-12'
          }`}>
            {step > i ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> : i}
          </div>
          {i < 8 && (
            <div className={`absolute left-[50%] top-4 md:top-5 w-full h-0.5 -z-0 transition-all duration-700 ${
              step > i ? 'bg-sky-900' : 'bg-stone-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-sky-100 text-sky-900 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            Professional Business Suite
          </div>
          <h1 className="text-5xl font-extrabold text-sky-950 tracking-tighter">List Your Business</h1>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-stone-100 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-40" />
          
          <StepIndicator />

          {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-700 rounded-3xl flex items-start space-x-4 text-sm font-semibold animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg">
                     <Zap className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Select Package</h2>
                     <p className="text-slate-500 font-medium">Choose a tier that fits your business needs.</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <button 
                    type="button" 
                    onClick={() => setSelectedPackage(ListingPackage.FREE)}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${selectedPackage === ListingPackage.FREE ? 'bg-emerald-50 border-emerald-500 shadow-xl' : 'bg-stone-50 border-stone-100 opacity-60'}`}
                   >
                     <div className={`p-3 rounded-xl bg-emerald-100 text-emerald-600 inline-block`}>
                       <Zap className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-black text-sky-950">{ListingPackage.FREE}</h3>
                     <p className="text-xs text-slate-500 font-bold">$0 Forever</p>
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setSelectedPackage(ListingPackage.SILVER)}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${selectedPackage === ListingPackage.SILVER ? 'bg-sky-50 border-sky-500 shadow-xl' : 'bg-stone-50 border-stone-100 opacity-60'}`}
                   >
                     <div className={`p-3 rounded-xl bg-sky-100 text-sky-600 inline-block`}>
                       <Store className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-black text-sky-950">{ListingPackage.SILVER}</h3>
                     <p className="text-xs text-slate-500 font-bold">$49 / month</p>
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setSelectedPackage(ListingPackage.GOLD)}
                    className={`p-8 rounded-[2rem] border-2 transition-all text-left space-y-4 ${selectedPackage === ListingPackage.GOLD ? 'bg-indigo-50 border-indigo-500 shadow-xl' : 'bg-stone-50 border-stone-100 opacity-60'}`}
                   >
                     <div className={`p-3 rounded-xl bg-indigo-100 text-indigo-600 inline-block`}>
                       <Gem className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-black text-sky-950">{ListingPackage.GOLD}</h3>
                     <p className="text-xs text-slate-500 font-bold">$149 / month</p>
                   </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                     <User className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Ownership Account</h2>
                     <p className="text-slate-500 font-medium">Create credentials to manage your listing.</p>
                   </div>
                </div>
                {user?.isLoggedIn ? (
                  <div className="bg-sky-50 border-2 border-sky-100 p-10 rounded-[2.5rem] shadow-inner">
                    <p className="text-sky-900 font-extrabold text-2xl tracking-tight">Active: {user.email}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    <input 
                      type="email" required placeholder="admin@brand.com"
                      className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-sky-950"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                      type="password" required placeholder="••••••••"
                      className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-900 transition-all font-bold text-sky-950"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                     <Store className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Brand Identity</h2>
                     <p className="text-slate-500 font-medium">The public-facing information for your brand.</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Business Name</label>
                       <input 
                        type="text" required placeholder="e.g., OC Yacht Services"
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950"
                        value={name} onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                       <select 
                        required value={category} onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950"
                      >
                        <option value="">Select Category</option>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">About the Business</label>
                      {isGeneratingDescription && (
                        <div className="flex items-center text-[10px] font-black text-sky-600 uppercase tracking-widest animate-pulse">
                          <Sparkles className="h-3 w-3 mr-2" /> Gemini is writing...
                        </div>
                      )}
                    </div>
                    
                    <div className="relative group">
                      <textarea 
                        required rows={5} placeholder="Describe your business and what makes it special..."
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-8 py-6 outline-none focus:border-sky-900 resize-none font-medium text-sky-950 shadow-sm"
                        value={description} onChange={(e) => setDescription(e.target.value)}
                      />
                      <button 
                        type="button" 
                        onClick={handleGenerateDescription} 
                        className="absolute bottom-6 right-6 p-3 bg-white text-sky-900 rounded-xl shadow-lg border border-stone-100 hover:scale-105 transition-transform"
                        title="Regenerate with AI"
                      >
                        <RefreshCw className={`h-4 w-4 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                     <DollarSign className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Commercial Presence</h2>
                     <p className="text-slate-500 font-medium">Pricing and direct contact methods.</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid grid-cols-2 gap-3">
                    {['low', 'mid', 'high', 'ultra'].map((tier) => (
                      <button key={tier} type="button" onClick={() => setPriceRange(tier as any)} className={`py-4 rounded-2xl font-bold transition-all border-2 ${priceRange === tier ? 'bg-sky-900 text-white border-sky-900' : 'bg-stone-50 text-slate-400 border-stone-100'}`}>
                        {tier === 'low' && '$ Budget'} {tier === 'mid' && '$$ Value'} {tier === 'high' && '$$$ Premium'} {tier === 'ultra' && '$$$$ Luxury'}
                      </button>
                    ))}
                  </div>
                  <input type="tel" required placeholder="(949) 555-0100" className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <input type="url" placeholder="https://brand.com" className="w-full md:col-span-2 bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                     <MapPin className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Local Footprint</h2>
                     <p className="text-slate-500 font-medium">Pin your business on the map.</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <input type="text" required placeholder="123 Coastal Hwy" className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select required value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950">
                      <option value="">Select City</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select required value={region} onChange={(e) => setRegion(e.target.value as Region)} className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] px-8 py-5 outline-none focus:border-sky-900 font-bold text-sky-950">
                      <option value="">Select Region</option>
                      {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-extrabold text-sky-950">Talent & Opportunities</h2>
                        <p className="text-slate-500 font-medium">Are you hiring? List your open positions here.</p>
                      </div>
                   </div>
                   <button 
                    type="button" 
                    onClick={() => setShowJobForm(true)}
                    className="flex items-center px-6 py-3 bg-sky-50 text-sky-900 font-black rounded-xl hover:bg-sky-100 transition-all border border-sky-100"
                   >
                     <Plus className="h-4 w-4 mr-2" /> Add Posting
                   </button>
                </div>

                {showJobForm && (
                  <div className="bg-stone-50 rounded-[2.5rem] p-10 border-2 border-sky-100 space-y-6 shadow-inner animate-in slide-in-from-top-4 duration-300">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-sky-950">Job Details</h3>
                        <button type="button" onClick={() => setShowJobForm(false)} className="text-slate-400 hover:text-red-500"><XCircle className="h-5 w-5" /></button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Position Title</label>
                           <input type="text" placeholder="e.g. Lead Barista" className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold" value={currentJob.title} onChange={(e) => setCurrentJob({...currentJob, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Salary Range / Rate</label>
                           <input type="text" placeholder="e.g. $25/hr or $60k-$75k" className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-sky-500/10 font-bold" value={currentJob.salary} onChange={(e) => setCurrentJob({...currentJob, salary: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Type</label>
                           <select className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 outline-none font-bold" value={currentJob.type} onChange={(e) => setCurrentJob({...currentJob, type: e.target.value as JobType})}>
                              {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Application Method</label>
                           <div className="flex space-x-2">
                              <button type="button" onClick={() => setAppMethod('email')} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center border-2 transition-all ${appMethod === 'email' ? 'bg-sky-900 text-white border-sky-900' : 'bg-white text-slate-400 border-stone-100'}`}><Mail className="h-4 w-4 mr-2" /> Email</button>
                              <button type="button" onClick={() => setAppMethod('link')} className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center border-2 transition-all ${appMethod === 'link' ? 'bg-sky-900 text-white border-sky-900' : 'bg-white text-slate-400 border-stone-100'}`}><LinkIcon className="h-4 w-4 mr-2" /> Link</button>
                           </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Premium Exposure (Optional)</label>
                           <div className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${currentJob.isFeatured ? 'bg-sky-50 border-sky-400 shadow-md' : 'bg-white border-stone-100'}`}>
                              <div className="flex items-center space-x-4">
                                 <div className={`p-3 rounded-xl shadow-sm ${currentJob.isFeatured ? 'bg-sky-900 text-white' : 'bg-stone-100 text-slate-400'}`}>
                                    <Sparkles className="h-6 w-6" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-sky-950">Feature this Job?</h4>
                                    <p className="text-xs text-slate-500 font-medium">Pinned to top of Jobs board for a <strong>$25</strong> fee.</p>
                                 </div>
                              </div>
                              <input 
                                type="checkbox" 
                                className="w-8 h-8 rounded-xl border-stone-300 text-sky-900 cursor-pointer" 
                                checked={currentJob.isFeatured || false}
                                onChange={(e) => setCurrentJob({...currentJob, isFeatured: e.target.checked})}
                              />
                           </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{appMethod === 'email' ? 'Application Email' : 'Application URL'}</label>
                           <input type="text" placeholder={appMethod === 'email' ? 'hiring@yourbrand.com' : 'https://careers.yourbrand.com'} className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 outline-none font-bold" value={appValue} onChange={(e) => setAppValue(e.target.value)} />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description & Requirements</label>
                           <textarea rows={3} placeholder="Tell applicants what you are looking for..." className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 outline-none font-medium" value={currentJob.description} onChange={(e) => setCurrentJob({...currentJob, description: e.target.value})} />
                        </div>
                     </div>
                     <button type="button" onClick={addJob} disabled={!currentJob.title || !currentJob.description || !appValue} className="w-full py-4 bg-sky-900 text-white font-black rounded-2xl shadow-xl disabled:opacity-50 transition-all active:scale-95">Add Posting to List</button>
                  </div>
                )}

                <div className="space-y-4">
                   {jobs.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                         {jobs.map((job, idx) => (
                           <div key={idx} className={`relative bg-white border-2 p-6 rounded-[2rem] flex items-center justify-between group transition-all ${job.isFeatured ? 'border-sky-400 bg-sky-50/30' : 'border-stone-100 hover:border-sky-200'}`}>
                              {job.isFeatured && (
                                 <div className="absolute -top-3 left-6 px-3 py-1 bg-sky-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center shadow-lg">
                                    <Sparkles className="h-2 w-2 mr-1" /> Featured Role
                                 </div>
                              )}
                              <div className="flex items-center space-x-6">
                                 <div className={`p-4 rounded-2xl ${job.isFeatured ? 'bg-sky-100 text-sky-900' : 'bg-sky-50 text-sky-900'}`}>
                                   <Briefcase className="h-6 w-6" />
                                 </div>
                                 <div>
                                   <div className="text-[10px] font-black text-sky-700 uppercase tracking-widest mb-0.5">{job.type} • {job.salary || 'Competitive'}</div>
                                   <h4 className="text-xl font-black text-sky-950">{job.title}</h4>
                                   <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center">
                                      {job.applicationMethod === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <LinkIcon className="h-3 w-3 mr-1" />}
                                      {job.applicationValue}
                                   </div>
                                 </div>
                              </div>
                              <button type="button" onClick={() => removeJob(idx)} className="p-3 bg-stone-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                                <Trash2 className="h-5 w-5" />
                              </button>
                           </div>
                         ))}
                      </div>
                   ) : !showJobForm && (
                      <div className="py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                         <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                           <Briefcase className="h-8 w-8 text-slate-200" />
                         </div>
                         <h4 className="text-lg font-bold text-sky-950">Not hiring right now?</h4>
                         <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">You can always skip this step and add jobs later from your owner dashboard.</p>
                      </div>
                   )}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                      <Camera className="h-7 w-7" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-sky-950">Visual Identity</h2>
                      <p className="text-slate-500 font-medium">AI generated cover or upload media.</p>
                    </div>
                  </div>
                  {!hasApiKey && <button type="button" onClick={handleOpenKeySelector} className="flex items-center text-[10px] font-bold text-sky-900 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">Select API Key</button>}
                </div>

                <div className="bg-sky-950 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                        <Sparkles className="h-7 w-7 text-sky-300" />
                      </div>
                      <h3 className="text-2xl font-extrabold tracking-tight">AI Content Creation</h3>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="text" className="w-full bg-sky-900/30 border border-sky-800 rounded-2xl px-8 py-5 outline-none text-sm font-bold text-white"
                        placeholder="Describe your storefront or interior..."
                        value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                      />
                      <button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt} className="w-full bg-white text-sky-950 px-10 py-5 rounded-[1.5rem] font-extrabold flex items-center justify-center shadow-2xl active:scale-95">
                        {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5 mr-3" />}
                        {isGenerating ? 'Generating...' : 'Generate Identity'}
                      </button>
                    </div>
                    {aiImageUrl && <img src={aiImageUrl} alt="AI Preview" className="w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl border-4 border-sky-800 animate-in zoom-in-95 duration-700" />}
                  </div>
                </div>

                <div 
                  className={`relative border-4 border-dashed rounded-[3.5rem] p-16 text-center transition-all duration-300 ${
                    isDragging ? 'border-sky-600 bg-sky-50' : 'border-stone-100 bg-transparent hover:bg-stone-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!manualPreviewUrl ? (
                    <label className="cursor-pointer space-y-4 block">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelection(file); }} 
                      />
                      <div className="mx-auto w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-sky-900 shadow-xl border border-stone-100 transform transition-transform group-hover:scale-110">
                        <UploadCloud className="h-10 w-10" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-black text-sky-950 tracking-tight">Manual Image Upload</div>
                        <p className="text-slate-400 font-medium">Drag and drop your brand assets here</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative animate-in zoom-in-95 duration-500">
                       <img 
                        src={manualPreviewUrl} 
                        alt="Manual Preview" 
                        className="w-full aspect-video object-cover rounded-[2.5rem] shadow-2xl border-4 border-white" 
                       />
                       <button 
                        type="button" 
                        onClick={clearManualImage} 
                        className="absolute top-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-2xl hover:bg-red-600 transition-all active:scale-90 flex items-center justify-center"
                       >
                         <Trash2 className="h-6 w-6" />
                       </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex items-center space-x-4">
                   <div className="p-4 bg-sky-900 rounded-2xl text-white shadow-lg shadow-sky-900/20">
                     <FileText className="h-7 w-7" />
                   </div>
                   <div>
                     <h2 className="text-3xl font-extrabold text-sky-950">Review & Legal</h2>
                     <p className="text-slate-500 font-medium">Finalize your professional registration.</p>
                   </div>
                </div>

                <div className="bg-stone-50 rounded-[2.5rem] p-10 border-2 border-stone-100 space-y-6">
                   <div className="flex items-center space-x-4 border-b-2 border-stone-200 pb-6">
                     <div className="bg-white p-3 rounded-2xl shadow-md font-extrabold text-sky-900 uppercase text-xs tracking-widest">{selectedPackage}</div>
                     <h3 className="text-2xl font-extrabold text-sky-950">{name}</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold text-slate-600">
                      <div className="space-y-3">
                        <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-sky-700" /> {address}, {city}</div>
                        <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-sky-700" /> {jobs.length} Active Jobs Listed</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-sky-700" /> {priceRange} Tier</div>
                        <div className="flex items-center"><Camera className="h-4 w-4 mr-2 text-sky-700" /> {aiImageUrl || manualPreviewUrl ? 'Cover Photo Ready' : 'No Cover Photo'}</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <label className="flex items-start space-x-6 p-8 bg-white border-2 border-stone-100 rounded-[3rem] cursor-pointer hover:bg-stone-50 transition-all group">
                    <input type="checkbox" className="w-8 h-8 rounded-xl border-stone-300 text-sky-900 mt-1" checked={certified} onChange={(e) => setCertified(e.target.checked)} />
                    <div className="space-y-1">
                      <div className="font-extrabold text-sky-950 text-xl">Ownership Certification</div>
                      <p className="text-slate-500 font-medium">I certify that I am the authorized representative of this business.</p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-6 p-8 bg-white border-2 border-stone-100 rounded-[3rem] cursor-pointer hover:bg-stone-50 transition-all group">
                    <input type="checkbox" className="w-8 h-8 rounded-xl border-stone-300 text-sky-900 mt-1" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    <div className="space-y-1">
                      <div className="font-extrabold text-sky-950 text-xl">Platform Terms</div>
                      <p className="text-slate-500 font-medium">I agree to OC Thrive's terms of service and commercial guidelines.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="pt-12 border-t-2 border-stone-100 flex justify-between">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="flex items-center px-8 py-5 text-slate-400 font-extrabold hover:text-sky-950 transition-all group">
                  <ChevronLeft className="mr-3 h-6 w-6 group-hover:-translate-x-2 transition-transform" /> Back
                </button>
              )}
              {step < 8 ? (
                <button type="button" onClick={nextStep} className="ml-auto flex items-center px-12 py-5 bg-sky-900 text-white font-extrabold rounded-[1.5rem] hover:bg-sky-800 transition-all shadow-2xl active:scale-95 group">
                  Continue <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </button>
              ) : (
                <button type="submit" className="ml-auto flex items-center px-12 py-5 bg-sky-900 text-white font-extrabold rounded-[1.5rem] hover:bg-sky-800 transition-all shadow-2xl active:scale-95">
                  Finalize Publication
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBusiness;
