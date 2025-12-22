import React, { useState } from 'react';
import { runEgoBoundaryAnalysis } from '../services/geminiService';
import { EgoBoundaryResult } from '../types';

export const EgoBoundary: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EgoBoundaryResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runEgoBoundaryAnalysis(input);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('风洞测试中止。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Blueprint Header */}
      <div className="bg-[#0a3a5e]/10 border-b border-cyan-900/50 pb-6 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-cyan-500 font-mono uppercase tracking-tight">精神结构风洞</h2>
            <div className="text-cyan-800 font-mono text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span>PSYCHE STRUCTURAL INTEGRITY</span>
              <span className="text-cyan-900 normal-case tracking-normal text-[10px]">// 对人格进行高压测试，寻找崩溃点。</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-1 h-6 bg-cyan-900/50 ${loading ? 'animate-pulse' : ''}`}></div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Section (CAD Style) */}
      <div className="border border-cyan-900/30 bg-[#000810] p-1 relative">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
         
         <div className="relative z-10 p-6">
            <label className="text-cyan-600 font-mono text-[10px] uppercase mb-2 block border-b border-cyan-900/30 pb-1 w-fit">
              Subject Self-Description (Load Parameters)
            </label>
            <textarea 
              className="w-full h-32 bg-transparent text-cyan-100 font-mono text-sm focus:outline-none resize-none placeholder-cyan-900/50"
              placeholder="// 输入自我描述，系统将施加 5000 PSI 情绪压力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 border border-cyan-700 px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {loading ? 'PRESSURIZING...' : 'INITIATE STRESS TEST'}
              </button>
            </div>
         </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-8 mt-8">
           
           {/* Left Col: Integrity Monitor */}
           <div className="md:col-span-5 space-y-6">
              
              {/* Integrity Score */}
              <div className="bg-[#000810] border border-cyan-900 p-6 flex flex-col items-center justify-center relative overflow-hidden h-48">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]"></div>
                 <h3 className="text-cyan-700 font-mono text-[10px] uppercase mb-2">Structural Integrity</h3>
                 <div className={`text-6xl font-black font-mono z-10 ${
                   result.integrityScore < 40 ? 'text-red-500' :
                   result.integrityScore < 70 ? 'text-yellow-500' : 'text-cyan-400'
                 }`}>
                   {result.integrityScore}%
                 </div>
                 <div className="text-[10px] text-cyan-800 mt-2 font-mono">
                   STATUS: {result.integrityScore < 40 ? 'CRITICAL FAILURE' : result.integrityScore < 70 ? 'UNSTABLE' : 'STABLE'}
                 </div>
              </div>

              {/* Yield Point Data */}
              <div className="border-l-2 border-red-500 pl-4 py-2 bg-red-950/10">
                 <h4 className="text-red-500 font-mono text-[10px] uppercase mb-1">Yield Point (Failure Trigger)</h4>
                 <p className="text-zinc-300 font-bold text-sm mb-1">{result.yieldPoint.trigger}</p>
                 <span className="text-red-900/80 font-mono text-[10px]">PRESSURE: {result.yieldPoint.pressureLevel}</span>
              </div>
              
              {/* Fracture Mode */}
              <div className="border-l-2 border-yellow-500 pl-4 py-2 bg-yellow-950/10">
                 <h4 className="text-yellow-500 font-mono text-[10px] uppercase mb-1">Projected Fracture Mode</h4>
                 <p className="text-zinc-300 text-sm">{result.fractureMode}</p>
              </div>

           </div>

           {/* Right Col: Weakness Map */}
           <div className="md:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-cyan-900/30 pb-2">
                 <h3 className="text-cyan-600 font-mono text-xs uppercase">Structural Weaknesses Detected</h3>
                 <span className="text-cyan-900 text-[10px] font-mono">SCAN_ID: {Math.floor(Math.random()*1000)}</span>
              </div>

              <div className="space-y-3">
                 {result.structuralWeaknesses.map((weakness, i) => (
                    <div key={i} className="bg-black border border-zinc-800 p-4 relative group hover:border-cyan-700/50 transition-colors">
                       <div className={`absolute top-0 right-0 px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                          weakness.riskLevel === 'CRITICAL' ? 'bg-red-600 text-black' :
                          weakness.riskLevel === 'HIGH' ? 'bg-orange-600 text-black' :
                          weakness.riskLevel === 'MED' ? 'bg-yellow-600 text-black' : 'bg-cyan-900 text-cyan-300'
                       }`}>
                          Risk: {weakness.riskLevel}
                       </div>
                       
                       <div className="text-cyan-500 font-mono text-xs font-bold mb-1 uppercase">
                         LOC: {weakness.location}
                       </div>
                       <p className="text-zinc-400 text-sm leading-snug">
                         {weakness.description}
                       </p>
                    </div>
                 ))}
              </div>

              <div className="mt-8 bg-[#0a1f1a] border border-green-900/30 p-4 rounded-sm">
                 <h4 className="text-green-600 font-mono text-[10px] uppercase mb-2 flex items-center gap-2">
                   <span>🏗️</span> Reinforcement Plan
                 </h4>
                 <p className="text-green-100/80 text-sm leading-relaxed font-mono">
                   {result.reinforcementPlan}
                 </p>
              </div>

           </div>

        </div>
      )}
    </div>
  );
};