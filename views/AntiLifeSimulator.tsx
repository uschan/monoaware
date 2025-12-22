
import React, { useState } from 'react';
import { runAntiLifeSimulation } from '../services/geminiService';
import { AntiLifeResult } from '../types';

export const AntiLifeSimulator: React.FC = () => {
  const [input, setInput] = useState('');
  const [weakness, setWeakness] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AntiLifeResult | null>(null);

  const handleSimulate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runAntiLifeSimulation(input, weakness || '未知风险');
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('验尸报告生成失败。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-red-900 pb-4">
        <div>
           <h2 className="text-4xl font-bold text-red-600 font-sans tracking-tight uppercase">项目验尸官</h2>
           <div className="text-xs font-mono text-red-800 mt-2 flex items-center gap-2">
             <span className="w-2 h-2 bg-red-700 animate-pulse"></span>
             PROJECT MORTUARY
             <span className="text-zinc-500 ml-2">// 假设项目已失败，进行事前验尸分析。</span>
           </div>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-xs font-mono text-zinc-600">PROTOCOL: PRE-MORTEM</div>
           <div className="text-xs font-mono text-zinc-600">AUTH: CORONER_AI</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: INTAKE FORM */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 relative">
            <span className="absolute top-0 left-0 bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 font-mono">SUBJECT_INTAKE</span>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-1 uppercase">Target Plan (计划/目标)</label>
                <textarea 
                  className="w-full h-24 bg-black border border-zinc-700 p-3 text-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
                  placeholder="例如：我准备辞职开发一款独立游戏，半年内上线..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs text-zinc-500 font-mono mb-1 uppercase">Known Weakness (已知隐患)</label>
                <input 
                  type="text"
                  className="w-full bg-black border border-zinc-700 p-3 text-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm"
                  placeholder="例如：存款不多 / 没有美术搭档..."
                  value={weakness}
                  onChange={(e) => setWeakness(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading || !input.trim()}
            className="w-full py-5 bg-red-950/30 hover:bg-red-900/50 border border-red-800 text-red-500 font-bold tracking-[0.2em] uppercase text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-3 font-mono group"
          >
            {loading ? (
              <span className="animate-pulse">AUTOPSY_IN_PROGRESS...</span>
            ) : (
              <>
                <span>GENERATE AUTOPSY REPORT</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: AUTOPSY REPORT */}
        <div className="relative min-h-[400px]">
          {!result ? (
            <div className="absolute inset-0 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-700">
               <span className="text-4xl mb-2 opacity-20">☠️</span>
               <span className="font-mono text-xs uppercase tracking-widest">Waiting for Cadaver</span>
            </div>
          ) : (
            <div className="h-full bg-[#0a0505] border border-red-900/50 relative p-6 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
               {/* Stamp */}
               <div className="absolute top-4 right-4 border-4 border-red-800 text-red-800 font-black text-2xl px-2 py-1 rotate-[-15deg] opacity-50 select-none">
                 DECEASED
               </div>

               <div className="space-y-6 font-mono">
                 <div className="border-b border-red-900/30 pb-4">
                   <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Cause of Death (死因)</h3>
                   <p className="text-2xl font-bold text-red-500">{result.causeOfDeath}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Time of Death</h3>
                      <p className="text-zinc-300 font-bold">{result.deathTime}</p>
                    </div>
                    <div>
                      <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Survival Rate</h3>
                      <p className="text-zinc-300 font-bold">{result.survivalRate}%</p>
                    </div>
                 </div>

                 <div className="bg-red-950/10 border-l-2 border-red-700 pl-4 py-2">
                   <h3 className="text-red-700 text-xs uppercase tracking-widest mb-1">Clinical Analysis (病理)</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed">{result.clinicalAnalysis}</p>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    <div className="bg-black border border-zinc-800 p-3">
                       <span className="text-[10px] text-zinc-500 block uppercase">Fatal Symptom (致命症状)</span>
                       <span className="text-zinc-300 text-sm">{result.fatalSymptom}</span>
                    </div>
                    <div className="bg-zinc-900 border border-green-900/30 p-3">
                       <span className="text-[10px] text-green-600 block uppercase">Prescription (处方)</span>
                       <span className="text-green-400 text-sm">{result.preventableMeasure}</span>
                    </div>
                 </div>
               </div>

               {/* Footer */}
               <div className="absolute bottom-2 right-4 text-[10px] text-zinc-700 font-mono">
                 CASE_ID: {Math.floor(Math.random() * 10000)}
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
