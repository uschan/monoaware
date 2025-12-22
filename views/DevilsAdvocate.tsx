import React, { useState } from 'react';
import { runDevilsAdvocate } from '../services/geminiService';
import { DevilsResult } from '../types';

export const DevilsAdvocate: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DevilsResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runDevilsAdvocate(input); setResult(data); } 
    catch (e) { alert('审判官去喝茶了。'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Dungeon Header */}
      <div className="text-center space-y-2 py-8 border-b border-zinc-800">
        <h2 className="text-4xl font-black text-red-800 font-serif uppercase tracking-widest drop-shadow-[0_2px_0_rgba(255,0,0,0.2)]">
          逻辑异端裁判所
        </h2>
        <div className="text-zinc-600 font-mono text-xs tracking-[0.5em] flex flex-col items-center gap-1">
          <span>THE LOGIC DUNGEON</span>
          <span className="text-[10px] text-zinc-700 normal-case tracking-normal">// 对你的观点进行残酷的逻辑刑讯逼供。</span>
        </div>
      </div>

      {/* Input Cell */}
      <div className="max-w-2xl mx-auto space-y-4">
        <label className="block text-sm text-zinc-500 text-center font-serif italic">
          Confess your opinion (Logic to be tortured):
        </label>
        <div className="relative">
          <textarea 
            className="w-full h-32 bg-[#0a0505] border border-red-900/30 rounded-none p-6 text-zinc-300 focus:outline-none focus:border-red-700 transition-all font-serif text-lg text-center placeholder-zinc-800"
            placeholder="e.g. 只要我努力工作，老板就会给我加薪..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {/* Chains Decoration */}
          <div className="absolute -left-2 top-1/2 w-4 h-8 border-l-2 border-t-2 border-b-2 border-zinc-800 rounded-l-full -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute -right-2 top-1/2 w-4 h-8 border-r-2 border-t-2 border-b-2 border-zinc-800 rounded-r-full -translate-y-1/2 pointer-events-none"></div>
        </div>
        
        <button
          onClick={handleRun}
          disabled={loading || !input.trim()}
          className="w-full py-4 bg-red-950 hover:bg-red-900 text-red-500 font-black uppercase text-xs tracking-[0.3em] border border-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? 'SUMMONING INQUISITORS...' : 'SUBMIT TO INQUISITION'}
        </button>
      </div>

      {result && (
        <div className="mt-16 space-y-12">
           
           {/* THE VERDICT */}
           <div className="text-center relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-20 border-4 border-red-600 -rotate-12 opacity-50 pointer-events-none"></div>
              <h3 className="text-red-500 font-black text-5xl uppercase tracking-tighter relative z-10 drop-shadow-lg">
                {result.verdict}
              </h3>
              <div className="mt-4 flex justify-center gap-4">
                 <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded text-xs text-zinc-500 font-mono">
                   SANITY_SCORE: <span className={result.sanityScore > 50 ? 'text-green-500' : 'text-red-500'}>{result.sanityScore}/100</span>
                 </div>
              </div>
           </div>

           {/* CRIMES LIST */}
           <div className="grid md:grid-cols-2 gap-6">
              {result.logicalCrimes?.map((crime, i) => (
                <div key={i} className="bg-[#110a0a] border border-red-900/20 p-6 relative">
                   <div className="absolute top-0 left-0 bg-red-900/50 text-red-200 text-[10px] font-bold px-2 py-0.5 uppercase">Crime #{i+1}</div>
                   <h4 className="mt-4 text-xl font-bold text-zinc-200 font-serif mb-2">{crime.name}</h4>
                   <p className="text-sm text-zinc-500 mb-4">{crime.description}</p>
                   <div className="text-red-400 text-xs font-mono border-t border-red-900/20 pt-2">
                     Sentence: {crime.sentence}
                   </div>
                </div>
              ))}
           </div>

           {/* TORTURE SESSION */}
           <div className="space-y-6">
              <h3 className="text-center text-zinc-500 font-serif italic text-lg decoration-zinc-800 underline underline-offset-8">
                The Torture Chamber
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                 {result.tortureSession?.map((tool, i) => (
                    <div key={i} className="bg-zinc-900 p-6 text-center border-b-4 border-zinc-800 hover:border-red-800 transition-colors group">
                       <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">🛠️</div>
                       <h4 className="text-zinc-300 font-bold uppercase text-xs mb-2 tracking-widest">{tool.tool}</h4>
                       <p className="text-zinc-500 text-xs mb-4 min-h-[3rem]">{tool.method}</p>
                       <p className="text-red-400 text-sm font-serif italic">"{tool.outcome}"</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* FORCED CONFESSION */}
           <div className="max-w-xl mx-auto bg-[#e3dcd2] text-black p-8 shadow-2xl rotate-1 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 w-4 h-4 rounded-full bg-red-900 shadow-sm"></div>
              <h3 className="text-center font-serif font-bold text-2xl uppercase border-b-2 border-black pb-4 mb-4">
                Official Confession
              </h3>
              <div className="font-serif text-lg leading-relaxed italic opacity-90">
                "{result.forcedConfession}"
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-32 border-b border-black text-right text-xs pt-8 relative">
                   <span className="absolute bottom-2 right-0 font-cursive text-xl opacity-50 -rotate-6">Guilty Soul</span>
                   (Signature)
                </div>
              </div>
           </div>

        </div>
      )}
    </div>
  );
};