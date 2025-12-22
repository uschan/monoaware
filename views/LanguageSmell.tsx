
import React, { useState } from 'react';
import { runLanguageSmell } from '../services/geminiService';
import { LangSmellResult } from '../types';

export const LanguageSmell: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LangSmellResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runLanguageSmell(input);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('传感器堵塞。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Lab Header */}
      <div className="flex items-center justify-between border-b border-indigo-500/30 pb-4">
        <div>
           <h2 className="text-3xl font-bold text-white font-sans tracking-tight">语义光谱仪</h2>
           <div className="text-indigo-400 font-mono text-[10px] tracking-[0.2em] uppercase mt-1">
             SYNTACTIC SPECTROMETER
             <span className="text-zinc-500 normal-case tracking-normal ml-2">// 分析文本的化学成分、阶层气味和毒性。</span>
           </div>
        </div>
        <div className="hidden md:block text-right">
           <div className="text-[10px] text-zinc-600 font-mono uppercase">Sensor_Status: Active</div>
           <div className="text-[10px] text-zinc-600 font-mono uppercase">Mode: Olfactory</div>
        </div>
      </div>

      {/* Input Chamber */}
      <div className="relative group">
         <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>
         <div className="relative bg-black border border-zinc-800 p-1">
            <div className="bg-zinc-950 p-6 border border-zinc-900/50">
               <label className="text-indigo-500 font-mono text-xs uppercase mb-2 block">
                 Deposit Text Sample (Gas/Liquid/Solid)
               </label>
               <textarea 
                 className="w-full h-32 bg-transparent text-zinc-300 font-mono text-sm focus:outline-none resize-none placeholder-zinc-800"
                 placeholder="// 滴入一段文字进行化学分析..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
               />
               <div className="flex justify-end mt-4 pt-4 border-t border-zinc-900">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !input.trim()}
                    className="bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? <span className="animate-spin">🌀</span> : '⚗️'}
                    {loading ? 'ANALYZING SPECTRUM...' : 'IGNITE SPECTROMETER'}
                  </button>
               </div>
            </div>
         </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-6 mt-8">
           
           {/* Left Col: Composition & Toxicity */}
           <div className="md:col-span-4 space-y-6">
              
              {/* Toxicity Gauge */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 text-center relative overflow-hidden">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-2">Toxicity Levels</h3>
                 <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-black ${
                      result.toxicityPPM > 500 ? 'text-red-500 animate-pulse-fast' : 
                      result.toxicityPPM > 200 ? 'text-yellow-500' : 'text-zinc-300'
                    }`}>
                      {result.toxicityPPM}
                    </span>
                    <span className="text-zinc-600 text-xs font-mono">PPM</span>
                 </div>
                 {result.toxicityPPM > 500 && (
                    <div className="mt-2 bg-red-950/50 border border-red-900 text-red-500 text-[10px] font-mono py-1 uppercase animate-pulse">
                      Hazardous Material
                    </div>
                 )}
              </div>

              {/* Chemical Composition */}
              <div className="bg-zinc-950 border border-zinc-800 p-6">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-4">Chemical Composition</h3>
                 <div className="space-y-4">
                    {result.composition.map((comp, i) => (
                      <div key={i}>
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-300 font-bold">{comp.label}</span>
                            <span className="font-mono text-zinc-500">{comp.percentage}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000"
                              style={{ width: `${comp.percentage}%`, backgroundColor: comp.colorCode || '#6366f1' }}
                            ></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* AI Probability */}
              <div className="bg-zinc-900 p-4 border-l-2 border-indigo-500 flex justify-between items-center">
                 <span className="text-indigo-400 text-[10px] font-mono uppercase">Synthetic (AI) Probability</span>
                 <span className="text-white font-bold font-mono">{result.aiProbability}%</span>
              </div>

           </div>

           {/* Right Col: Scent Profile & Log */}
           <div className="md:col-span-8 space-y-6">
              
              {/* Olfactory Notes */}
              <div className="bg-[#0c0c0e] border border-zinc-800 p-6 relative">
                 <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">👃</div>
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-6 tracking-widest border-b border-zinc-800 pb-2">Olfactory Analysis</h3>
                 
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-12 text-[10px] font-mono text-zinc-600 uppercase text-right pt-1">Top Note</div>
                       <div className="flex-1">
                          <p className="text-indigo-200 font-serif italic text-lg">{result.scentProfile.topNote}</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 text-[10px] font-mono text-zinc-600 uppercase text-right pt-1">Middle Note</div>
                       <div className="flex-1">
                          <p className="text-zinc-300 text-sm font-bold">{result.scentProfile.middleNote}</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 text-[10px] font-mono text-zinc-600 uppercase text-right pt-1">Base Note</div>
                       <div className="flex-1">
                          <p className="text-zinc-400 text-sm">{result.scentProfile.baseNote}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Lab Log */}
              <div className="bg-black border border-zinc-800 p-4 font-mono text-xs text-zinc-400 leading-relaxed">
                 <span className="text-indigo-500 block mb-2">&gt; GENERATING DETECTION LOG...</span>
                 {result.detectionLog}
              </div>

           </div>

        </div>
      )}
    </div>
  );
};
