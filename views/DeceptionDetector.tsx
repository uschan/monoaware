
import React, { useState } from 'react';
import { runSelfDeception } from '../services/geminiService';
import { DeceptionResult } from '../types';

export const DeceptionDetector: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeceptionResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runSelfDeception(input); setResult(data); } 
    catch (e) { alert('System Failure.'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-green-500/30 pb-4">
        <div>
           <h2 className="text-4xl font-bold text-white font-mono tracking-tighter">
             红丸终端
           </h2>
           <div className="text-green-500 font-mono text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
             <span className="animate-pulse">RED_PILL_TERMINAL</span>
             <span className="text-green-800 normal-case tracking-normal">// 撕碎自我欺骗的幻象，直面残酷真相。</span>
           </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-[10px] font-mono text-green-800">MATRIX_CONNECTION: UNSTABLE</div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-black border border-green-900/50 p-2 relative shadow-[0_0_20px_rgba(0,255,0,0.05)]">
        <textarea 
          className="w-full h-32 bg-zinc-950/80 p-4 text-green-100 font-mono text-sm focus:outline-none resize-none placeholder-green-900" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="> Enter the narrative you tell yourself..." 
        />
        <div className="flex justify-end p-2 bg-zinc-950 border-t border-green-900/30">
          <button 
            onClick={handleRun} 
            disabled={loading || !input.trim()} 
            className="bg-green-900/20 hover:bg-green-900/40 text-green-500 border border-green-800 px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all hover:text-white"
          >
            {loading ? 'Decoupling from Matrix...' : 'Swallow Red Pill'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-0 border border-green-900/50 mt-12 relative overflow-hidden group">
           
           {/* Center Glitch Divider */}
           <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-500/50 z-20 hidden md:block group-hover:animate-pulse"></div>

           {/* LEFT: BLUE PILL (The Lie) */}
           <div className="bg-[#0a0f1c] p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-blue-900/20 text-blue-400 text-[10px] font-mono px-3 py-1 uppercase font-bold">
                 Simulation Layer (Comfort)
              </div>
              <div className="mt-8 relative z-10 blur-[0.5px] group-hover:blur-none transition-all duration-700">
                 <h3 className="text-blue-200 font-serif italic text-2xl leading-relaxed opacity-80">
                   "{result.bluePillNarrative}"
                 </h3>
                 <p className="text-blue-500/50 text-xs font-mono mt-4 uppercase">
                   Status: Blissful Ignorance
                 </p>
              </div>
           </div>

           {/* RIGHT: RED PILL (The Truth) */}
           <div className="bg-black p-8 relative border-l border-green-900/50">
              <div className="absolute top-0 right-0 bg-red-900/20 text-red-500 text-[10px] font-mono px-3 py-1 uppercase font-bold animate-pulse">
                 Reality Layer (Hazard)
              </div>
              
              <div className="mt-8 space-y-6">
                 <div>
                   <h3 className="text-white font-mono font-bold text-lg border-l-2 border-red-600 pl-3 leading-relaxed animate-glitch">
                     {result.redPillTruth}
                   </h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-3 border border-zinc-800">
                       <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Glitch Factor</span>
                       <span className="text-red-500 font-black text-2xl">{result.glitchFactor}%</span>
                    </div>
                    <div className="bg-zinc-900/50 p-3 border border-zinc-800">
                       <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">System Failures</span>
                       <span className="text-zinc-300 font-mono text-sm">{result.systemFailureLog.length} detected</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    {result.systemFailureLog.map((log, i) => (
                       <div key={i} className="text-xs font-mono text-green-700/70">
                         &gt; ERROR_{i}: {log}
                       </div>
                    ))}
                 </div>

                 <div className="pt-4 border-t border-zinc-800">
                    <span className="text-[10px] text-green-500 font-mono uppercase block mb-2">&gt; Installing Reality Patch...</span>
                    <p className="text-green-400 font-mono text-sm leading-relaxed">
                      {result.realityPatch}
                    </p>
                 </div>
              </div>
           </div>

        </div>
      )}
    </div>
  );
};
