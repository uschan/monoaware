import React, { useState } from 'react';
import { runConceptStitcher } from '../services/geminiService';
import { StitcherResult } from '../types';

export const ConceptStitcher: React.FC = () => {
  const [termA, setTermA] = useState('');
  const [termB, setTermB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StitcherResult | null>(null);

  const handleRun = async () => {
    if (!termA.trim() || !termB.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runConceptStitcher(termA, termB); setResult(data); } 
    catch (e) { console.error(e); alert('缝合失败，排异反应过大。'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-black text-fuchsia-500 font-sans tracking-tight uppercase">
          独角兽孵化器
        </h2>
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-1">
          <span>UNICORN INCUBATOR</span>
          <span className="text-[10px] text-zinc-600 normal-case tracking-normal">// 强行缝合无关概念，生成荒诞商业计划书。</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-xl max-w-2xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-600 to-purple-600"></div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
           <div className="flex-1 w-full">
             <label className="text-[10px] text-zinc-500 font-mono uppercase mb-1 block">Concept A</label>
             <input 
               className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-center text-zinc-200 focus:border-fuchsia-500 outline-none font-bold text-lg"
               placeholder="e.g. 足疗"
               value={termA}
               onChange={e => setTermA(e.target.value)}
             />
           </div>
           <div className="text-zinc-600 font-black text-2xl">+</div>
           <div className="flex-1 w-full">
             <label className="text-[10px] text-zinc-500 font-mono uppercase mb-1 block">Concept B</label>
             <input 
               className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-center text-zinc-200 focus:border-fuchsia-500 outline-none font-bold text-lg"
               placeholder="e.g. 元宇宙"
               value={termB}
               onChange={e => setTermB(e.target.value)}
             />
           </div>
        </div>

        <button
          onClick={handleRun}
          disabled={loading || !termA || !termB}
          className="w-full py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold tracking-widest uppercase rounded-lg shadow-[0_0_20px_rgba(192,38,211,0.3)] disabled:opacity-50 transition-all transform hover:scale-[1.01]"
        >
          {loading ? 'GENERATING PITCH DECK...' : 'INCUBATE STARTUP'}
        </button>
      </div>

      {/* Output Deck */}
      {result && (
        <div className="grid md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Card (Slide 1) */}
          <div className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
             {/* Background FX */}
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none"></div>
             
             <div className="relative z-10">
               <span className="bg-zinc-950 text-fuchsia-500 text-[10px] font-bold px-2 py-1 rounded border border-fuchsia-500/30 uppercase tracking-wider mb-4 inline-block">
                 Seed Round Open
               </span>
               <h3 className="text-5xl font-black text-white mb-2 tracking-tight">{result.startupName}</h3>
               <p className="text-2xl text-fuchsia-400 font-serif italic mb-6">"{result.tagline}"</p>
               
               <div className="h-px w-20 bg-zinc-700 mb-6"></div>
               
               <div>
                  <h4 className="text-zinc-500 text-xs font-mono uppercase mb-2">Revenue Model</h4>
                  <p className="text-zinc-300 leading-relaxed">{result.revenueModel}</p>
               </div>
             </div>
          </div>

          {/* Sidebar Cards */}
          <div className="md:col-span-4 space-y-6">
             
             {/* Persona Card */}
             <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <h4 className="text-zinc-500 text-xs font-mono uppercase mb-3 flex items-center gap-2">
                  <span>👤</span> Target Persona
                </h4>
                <div className="space-y-2">
                   <div className="text-lg font-bold text-zinc-200">{result.userPersona.name}</div>
                   <p className="text-xs text-zinc-400 leading-snug">{result.userPersona.description}</p>
                   <div className="bg-zinc-900 p-2 rounded text-xs text-fuchsia-300 italic border-l-2 border-fuchsia-500 mt-2">
                     "{result.userPersona.desire}"
                   </div>
                </div>
             </div>

             {/* Growth Hack */}
             <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                <h4 className="text-zinc-500 text-xs font-mono uppercase mb-3 flex items-center gap-2">
                  <span>🚀</span> Growth Hack
                </h4>
                <p className="text-sm text-zinc-300 font-bold">{result.growthHack}</p>
             </div>

          </div>

          {/* Bottom Bar: VC Verdict & Probability */}
          <div className="md:col-span-12 grid md:grid-cols-2 gap-6">
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-4">
                <div className="text-4xl grayscale opacity-50">👨‍⚖️</div>
                <div>
                   <h4 className="text-zinc-500 text-xs font-mono uppercase mb-1">VC Verdict</h4>
                   <p className="text-zinc-400 text-sm italic">"{result.vcVerdict}"</p>
                </div>
             </div>

             <div className="bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/30 rounded-xl p-6 flex items-center justify-between">
                <div>
                   <h4 className="text-fuchsia-400 text-xs font-mono uppercase mb-1">Unicorn Probability</h4>
                   <p className="text-zinc-400 text-[10px]">AI Calculated Risk</p>
                </div>
                <div className="text-4xl font-black text-white">
                  {result.unicornProbability}%
                </div>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};