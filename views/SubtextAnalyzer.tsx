import React, { useState } from 'react';
import { runSubtextAnalysis } from '../services/geminiService';
import { SubtextResult } from '../types';

export const SubtextAnalyzer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubtextResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runSubtextAnalysis(input);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('通讯加密等级过高，无法破解。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Top Secret Header */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center border border-zinc-700 rounded-full">
             <span className="text-2xl">👁️</span>
           </div>
           <div>
              <h2 className="text-3xl font-bold text-zinc-200 font-sans tracking-tight uppercase">真相审讯室</h2>
              <div className="text-zinc-500 font-mono text-xs tracking-widest mt-1 flex items-center gap-2">
                <span>THE TRUTH INTERROGATOR</span>
                <span className="text-zinc-600">// 拆解话语背后的真实意图和权力关系。</span>
              </div>
           </div>
        </div>
        <div className="hidden md:block">
           <div className="border border-red-900/50 text-red-800 px-4 py-1 font-black text-xs uppercase tracking-[0.2em] rotate-[-2deg]">
             Top Secret
           </div>
        </div>
      </div>

      {/* Input Console */}
      <div className="bg-black border border-zinc-800 p-1">
         <div className="bg-zinc-950 p-6 border border-zinc-900">
            <label className="text-zinc-500 font-mono text-xs uppercase mb-2 block">Intercepted Communication (Paste Text)</label>
            <textarea 
              className="w-full h-32 bg-transparent text-zinc-300 font-mono text-sm focus:outline-none resize-none placeholder-zinc-800"
              placeholder="e.g. 领导说：‘我这都是为你好，这点小事都做不好...’"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-end mt-4 pt-4 border-t border-zinc-900">
               <button
                 onClick={handleAnalyze}
                 disabled={loading || !input.trim()}
                 className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50"
               >
                 {loading ? 'DECRYPTING...' : 'RUN INTERROGATION'}
               </button>
            </div>
         </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-8 relative">
           
           {/* Background watermark */}
           <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-9xl font-black rotate-[-15deg]">CLASSIFIED</span>
           </div>

           {/* Left Col: The Meters */}
           <div className="md:col-span-4 space-y-6 relative z-10">
              
              {/* Bullshit Meter */}
              <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 p-6 text-center">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4">Bullshit Meter</h3>
                 <div className="relative w-32 h-16 mx-auto overflow-hidden">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[12px] border-zinc-800 border-t-transparent border-l-transparent rotate-[-45deg]"></div>
                    {/* Dial */}
                    <div 
                      className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-500 origin-bottom transition-transform duration-1000 ease-out"
                      style={{ transform: `translateX(-50%) rotate(${(result.bullshitMeter / 100) * 180 - 90}deg)` }}
                    ></div>
                 </div>
                 <div className="mt-2 text-2xl font-black text-white">{result.bullshitMeter}<span className="text-xs text-zinc-600 ml-1">/100</span></div>
              </div>

              {/* Verdict Stamp */}
              <div className="bg-zinc-950 border border-zinc-800 p-6">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-2">Final Verdict</h3>
                 <p className="text-red-500 font-black text-xl uppercase leading-tight tracking-tight">
                   {result.verdict}
                 </p>
              </div>

              {/* Power Dynamics */}
              <div className="bg-zinc-900 border-l-4 border-blue-900 p-4">
                 <h3 className="text-blue-500 text-[10px] font-mono uppercase mb-2">Power Dynamics</h3>
                 <p className="text-zinc-300 text-xs leading-relaxed">{result.powerDynamics}</p>
              </div>

           </div>

           {/* Right Col: Declassified Files */}
           <div className="md:col-span-8 space-y-6 relative z-10">
              <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest border-b border-zinc-800 pb-2">Declassified Intelligence</h3>
              
              <div className="space-y-8">
                 {result.declassifiedContent.map((item, i) => (
                    <div key={i} className="relative pl-6 border-l border-zinc-800">
                       {/* Connection Line */}
                       <div className="absolute left-[-5px] top-4 w-3 h-3 bg-zinc-800 rounded-full border-2 border-zinc-950"></div>
                       
                       <div className="mb-4">
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono uppercase">Subject Said</span>
                          <p className="text-zinc-300 font-serif italic text-lg mt-2 pl-4 border-l-2 border-zinc-700/50">
                            "{item.original}"
                          </p>
                       </div>

                       <div className="grid gap-4 bg-zinc-900/30 p-4 rounded border border-zinc-800/50">
                          <div>
                             <span className="text-[10px] text-red-500 font-bold font-mono uppercase flex items-center gap-2">
                               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                               Decoded Subtext
                             </span>
                             <p className="text-red-200 text-sm font-bold mt-1">{item.decoded}</p>
                          </div>
                          <div className="pt-2 border-t border-zinc-800/50">
                             <span className="text-[10px] text-zinc-500 font-mono uppercase">True Intent</span>
                             <p className="text-zinc-400 text-xs mt-1">{item.intent}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Voice Stress (Flavor) */}
              <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center opacity-50">
                 <div className="text-[10px] font-mono text-zinc-500 uppercase">Voice Stress Analysis</div>
                 <div className="h-8 flex items-end gap-0.5">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-1 bg-red-900" style={{height: `${Math.random() * 100}%`}}></div>
                    ))}
                 </div>
                 <div className="text-[10px] font-mono text-red-900 uppercase">{result.voiceStressAnalysis}</div>
              </div>

           </div>

        </div>
      )}
    </div>
  );
};