import React, { useState } from 'react';
import { runWorldSimulation } from '../services/geminiService';
import { WorldSimResult } from '../types';

export const WorldSim: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorldSimResult | null>(null);

  const handleSimulate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runWorldSimulation(input);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('宇宙观测链路断开。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HUD Header */}
      <div className="flex justify-between items-end mb-6 border-b border-purple-500/30 pb-4">
        <div>
           <h2 className="text-4xl font-bold text-white font-sans tracking-tighter">平行宇宙观测站</h2>
           <div className="text-purple-400 font-mono text-[10px] tracking-[0.3em] uppercase mt-2 animate-pulse flex items-center gap-2">
             <span>CHRONICLE OF DIVERGENCE</span>
             <span className="text-zinc-500 normal-case tracking-normal text-xs">// 推演异变点引发的蝴蝶效应和新世界法则。</span>
           </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-[10px] text-zinc-600 font-mono">SIGNAL_STRENGTH: 98%</div>
           <div className="text-[10px] text-zinc-600 font-mono">QUANTUM_FLUX: STABLE</div>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <label className="block text-sm text-purple-300 font-mono text-center">
          Define the Divergence Point (异变点):
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <input 
            type="text"
            className="relative w-full bg-black border border-zinc-800 rounded-lg p-4 text-center text-zinc-200 focus:outline-none focus:text-white font-mono text-sm"
            placeholder="e.g. 如果没有发明互联网..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
          />
          <button
            onClick={handleSimulate}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 font-bold text-xs rounded transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? 'Observing...' : 'Observe'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* LEFT COL: Timeline & Laws (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
             
             {/* Chaos Meter */}
             <div className="bg-zinc-900/50 border border-zinc-800 p-6 relative overflow-hidden">
                <div className="flex justify-between items-end mb-2">
                   <h3 className="text-purple-400 font-mono text-xs uppercase tracking-widest">Chaos Level</h3>
                   <span className="text-2xl font-bold text-white">{result.chaosLevel}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" 
                     style={{width: `${result.chaosLevel}%`}}
                   ></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono text-right uppercase">
                  {result.chaosLevel > 80 ? 'Total Collapse Imminent' : result.chaosLevel > 50 ? 'Social Instability Detected' : 'Stable Deviation'}
                </p>
             </div>

             {/* Timeline */}
             <div className="bg-black border-l-2 border-purple-500/50 pl-6 py-2 space-y-8 relative">
                {result.timeline.map((event, i) => (
                  <div key={i} className="relative">
                     <span className="absolute -left-[31px] top-1 w-3 h-3 bg-black border-2 border-purple-500 rounded-full z-10"></span>
                     <span className="text-cyan-500 font-mono text-sm font-bold block mb-1">{event.year}</span>
                     <h4 className="text-white font-bold text-base mb-1">{event.event}</h4>
                     <p className="text-zinc-400 text-xs leading-relaxed">{event.impact}</p>
                  </div>
                ))}
             </div>

             {/* New Laws */}
             <div className="bg-zinc-950 border border-zinc-800 p-6">
                <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">New Social Laws</h3>
                <ul className="space-y-3">
                  {result.newLaws.map((law, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex gap-3">
                      <span className="text-purple-500 font-bold">§{i+1}</span>
                      {law}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* RIGHT COL: Breaking News & Survivor (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
             
             {/* Breaking News Card */}
             <div className="bg-red-950/10 border border-red-900/50 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-red-600 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
                  Breaking News
                </div>
                <div className="mb-6 mt-2">
                   <div className="flex justify-between text-[10px] text-red-400 font-mono uppercase mb-2 opacity-70">
                      <span>{result.breakingNews.source}</span>
                      <span>{result.breakingNews.date}</span>
                   </div>
                   <h3 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight font-sans glitch-text" data-text={result.breakingNews.headline}>
                     {result.breakingNews.headline}
                   </h3>
                </div>
                <div className="h-px w-full bg-red-900/30"></div>
             </div>

             {/* Survivor Guide */}
             <div className="bg-zinc-900 border border-cyan-900/30 p-1 rounded-lg">
                <div className="bg-black p-6 rounded border border-zinc-800">
                   <div className="flex justify-between items-start mb-6">
                      <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
                        Survivor Profile
                      </h3>
                      <div className="px-2 py-0.5 bg-cyan-950 text-cyan-400 text-[10px] font-mono border border-cyan-900">
                        CLASS: {result.survivorGuide.role}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <span className="text-zinc-600 text-[10px] uppercase font-bold block mb-1">Essential Skill</span>
                         <p className="text-xl text-white font-bold">{result.survivorGuide.keySkill}</p>
                      </div>
                      <div>
                         <span className="text-zinc-600 text-[10px] uppercase font-bold block mb-1">Inventory Item</span>
                         <p className="text-xl text-white font-bold">{result.survivorGuide.mustHaveItem}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Footer Flavor Text */}
             <div className="text-center pt-8">
                <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.2em]">
                  Timeline Simulation Complete • Probability: {(Math.random() * 10).toFixed(4)}%
                </p>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};