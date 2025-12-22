import React, { useState } from 'react';
import { runExtremeSimulation } from '../services/geminiService';
import { ExtremeSimResult } from '../types';

export const ExtremeSim: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtremeSimResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runExtremeSimulation(input); setResult(data); } 
    catch (e) { alert('Simulation Error'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b-2 border-orange-600 pb-4">
         <div>
            <h2 className="text-4xl font-black text-white font-sans uppercase tracking-tight">混沌计算器</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.2em]">The Chaos Calculator</span>
               <span className="text-[10px] font-mono text-zinc-500">// 模拟微小坏习惯引发的灾难性后果。</span>
            </div>
         </div>
         <div className="hidden md:block text-right">
            <div className="text-[10px] text-zinc-500 font-mono">MODEL: BUTTERFLY_EFFECT_V9</div>
         </div>
      </div>

      {/* Input */}
      <div className="bg-[#1a0e05] border border-orange-900/50 p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl text-orange-500 pointer-events-none group-hover:scale-110 transition-transform">🦋</div>
        
        <label className="block text-sm text-orange-400 font-mono uppercase mb-4">Initial Input (The Butterfly Wing Flap)</label>
        <div className="relative">
          <input 
            type="text" 
            className="w-full bg-black border-b border-orange-800 p-4 text-xl text-orange-100 focus:outline-none focus:border-orange-500 transition-colors font-mono placeholder-orange-900/50" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="e.g. Skipping the gym today..." 
            onKeyDown={e => e.key === 'Enter' && handleRun()}
          />
          <button 
            onClick={handleRun} 
            disabled={loading || !input.trim()} 
            className="absolute right-0 bottom-2 top-2 px-6 bg-orange-600/20 hover:bg-orange-600 text-orange-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? 'Simulating Cascade...' : 'Trigger Chaos'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-8 mt-8">
           
           {/* Left Col: Warning Panel */}
           <div className="md:col-span-4 space-y-6">
              
              <div className="bg-orange-950/20 border-2 border-orange-600 p-6 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(234,88,12,0.1)_10px,rgba(234,88,12,0.1)_20px)]"></div>
                 <h3 className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-2 relative z-10">Projected Disaster Level</h3>
                 <div className="text-5xl font-black text-orange-500 relative z-10 animate-pulse">{result.disasterLevel}</div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-6">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-3 border-b border-zinc-800 pb-2">Immediate Impact</h3>
                 <p className="text-zinc-300 text-sm leading-relaxed">{result.currentImpact}</p>
              </div>

              <div className="bg-zinc-900 p-6 border-l-2 border-red-600">
                 <h3 className="text-red-500 text-[10px] font-mono uppercase mb-2">The Tipping Point</h3>
                 <p className="text-red-200 text-sm font-bold">{result.tippingPoint}</p>
              </div>

           </div>

           {/* Right Col: Timeline & Collapse */}
           <div className="md:col-span-8 space-y-8">
              
              {/* Cascade Graph Visualization */}
              <div className="space-y-4">
                 <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Cascade Timeline</h3>
                 <div className="space-y-6 relative pl-4 border-l border-orange-900/30">
                    {result.cascadeTimeline.map((item, i) => (
                       <div key={i} className="relative group">
                          {/* Node */}
                          <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-black z-10 transition-all group-hover:scale-125 ${
                             item.magnitude > 80 ? 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 
                             item.magnitude > 50 ? 'border-orange-500' : 'border-yellow-500'
                          }`}></div>
                          
                          <div className="flex items-baseline justify-between mb-1">
                             <span className="text-orange-400 font-mono text-xs">{item.time}</span>
                             <span className="text-[10px] text-zinc-600 font-mono">MAGNITUDE: {item.magnitude}%</span>
                          </div>
                          
                          <div className="bg-zinc-900/50 border border-zinc-800 p-3 relative overflow-hidden">
                             <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${
                                item.magnitude > 80 ? 'bg-red-600' : item.magnitude > 50 ? 'bg-orange-500' : 'bg-yellow-500'
                             }`} style={{width: `${item.magnitude}%`}}></div>
                             <p className="text-zinc-200 text-sm">{item.event}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Final Collapse */}
              <div className="bg-black border border-red-900 p-6 relative">
                 <div className="absolute top-0 left-0 bg-red-900 text-black text-[10px] font-bold px-2 py-1 uppercase">System Collapse</div>
                 <p className="text-red-500 font-mono text-lg mt-4 leading-relaxed">
                   "{result.finalCollapse}"
                 </p>
              </div>

           </div>

        </div>
      )}
    </div>
  );
};