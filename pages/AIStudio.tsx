
import React, { useState } from 'react';
import { 
  Sparkles, 
  ImageIcon, 
  Video as VideoIcon, 
  Mic, 
  Type, 
  Wand2, 
  Play, 
  Loader2, 
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { GeminiService } from '../GeminiService';

const AIStudio: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'image' | 'video' | 'audio'>('image');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tools State
  const [prompt, setPrompt] = useState('');
  // Fix: Explicitly type aspectRatio and imageSize to match the union types expected by GeminiService.generateImage
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "3:4" | "4:3" | "9:16" | "16:9">('1:1');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">('1K');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');

  const handleGenerateImage = async () => {
    setLoading(true); setError(null);
    try {
      const url = await GeminiService.generateImage(prompt, aspectRatio, imageSize);
      setResult(url);
    } catch (e) { setError('Failed to generate image.'); }
    finally { setLoading(false); }
  };

  const handleGenerateVideo = async () => {
    setLoading(true); setError(null);
    try {
      const url = await GeminiService.generateVideo(prompt, videoAspect);
      setResult(url);
    } catch (e) { setError('Failed to generate video.'); }
    finally { setLoading(false); }
  };

  const handleTranscribe = async () => {
    setLoading(true); setError(null);
    // Note: Live API or transcription logic would go here. 
    // For brevity, using a placeholder prompt to Flash model
    try {
      setError("Transcription requires microphone access. Feature coming in Live update.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm space-y-6">
            <h1 className="text-2xl font-extrabold text-sky-950 flex items-center">
              <Sparkles className="mr-2 text-sky-600" /> AI Studio
            </h1>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTool('image')}
                className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTool === 'image' ? 'bg-sky-900 text-white' : 'hover:bg-stone-50 text-slate-600'}`}
              >
                <ImageIcon className="mr-3 h-5 w-5" /> Image Generation
              </button>
              <button 
                onClick={() => setActiveTool('video')}
                className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTool === 'video' ? 'bg-sky-900 text-white' : 'hover:bg-stone-50 text-slate-600'}`}
              >
                <VideoIcon className="mr-3 h-5 w-5" /> Veo Video
              </button>
              <button 
                onClick={() => setActiveTool('audio')}
                className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${activeTool === 'audio' ? 'bg-sky-900 text-white' : 'hover:bg-stone-50 text-slate-600'}`}
              >
                <Mic className="mr-3 h-5 w-5" /> Audio & Speech
              </button>
            </div>
          </div>

          <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100 space-y-3">
             <h3 className="font-bold text-sky-900 flex items-center text-sm">
               <AlertCircle className="h-4 w-4 mr-2" /> Gemini Powered
             </h3>
             <p className="text-xs text-sky-800 leading-relaxed">
               All creations use Gemini 3 Pro and Veo models for high-fidelity Southern California visuals.
             </p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-200 shadow-xl space-y-10">
            
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-sky-950 capitalize">{activeTool} Creation</h2>
              <p className="text-slate-500">Describe what you'd like to create for your local business or community.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Creative Prompt</label>
                <textarea 
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-3xl p-6 outline-none focus:ring-2 focus:ring-sky-500 transition-all text-lg"
                  placeholder={activeTool === 'image' ? "A sunset over Huntington Beach pier in oil painting style..." : "A neon hologram of a surf shop at night..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {activeTool === 'image' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Aspect Ratio</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 outline-none appearance-none" 
                      value={aspectRatio} 
                      onChange={(e) => setAspectRatio(e.target.value as any)}
                    >
                      {/* Fix: Update list to only include aspect ratios supported by gemini-3-pro-image-preview according to guidelines */}
                      {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Resolution</label>
                    <select 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 outline-none appearance-none" 
                      value={imageSize} 
                      onChange={(e) => setImageSize(e.target.value as any)}
                    >
                      {/* Fix: Cast value to match specific resolution union type */}
                      {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {activeTool === 'video' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Video Aspect Ratio</label>
                  <div className="flex space-x-4">
                     <button onClick={() => setVideoAspect('16:9')} className={`px-6 py-3 rounded-xl border-2 font-bold ${videoAspect === '16:9' ? 'border-sky-900 bg-sky-50 text-sky-900' : 'border-stone-200 text-slate-400'}`}>Landscape 16:9</button>
                     <button onClick={() => setVideoAspect('9:16')} className={`px-6 py-3 rounded-xl border-2 font-bold ${videoAspect === '9:16' ? 'border-sky-900 bg-sky-50 text-sky-900' : 'border-stone-200 text-slate-400'}`}>Portrait 9:16</button>
                  </div>
                </div>
              )}

              <button 
                onClick={activeTool === 'image' ? handleGenerateImage : activeTool === 'video' ? handleGenerateVideo : handleTranscribe}
                disabled={loading || !prompt}
                className="w-full py-5 bg-sky-900 text-white font-bold rounded-[2rem] shadow-xl hover:bg-sky-800 transition-all flex items-center justify-center text-xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin mr-3" /> : <Wand2 className="h-6 w-6 mr-3" />}
                {loading ? 'Generating...' : `Generate ${activeTool}`}
              </button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center"><AlertCircle className="mr-2 h-5 w-5" /> {error}</div>}

            {result && (
              <div className="pt-10 border-t border-stone-100 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-sky-950">Result</h3>
                  <a href={result} download className="flex items-center text-sky-900 font-bold hover:underline">
                    <Download className="mr-2 h-5 w-5" /> Download
                  </a>
                </div>
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-stone-100 min-h-[300px] flex items-center justify-center">
                   {activeTool === 'video' ? (
                     <video src={result} controls className="w-full h-auto" />
                   ) : (
                     <img src={result} alt="AI Generation" className="w-full h-auto" />
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
