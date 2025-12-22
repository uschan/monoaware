import React, { useState } from 'react';
import { runBiasDetection } from '../services/geminiService';
import { BiasResult } from '../types';

export const BiasDetector: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BiasResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await runBiasDetection(input);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('样本受损，扫描失败。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-green-900 pb-4">
        <div>
           <h2 className="text-3xl font-bold text-green-500 font-sans tracking-tighter uppercase">认知生化扫描</h2>
           <div className="text-green-700 font-mono text-[10px] tracking-[0.2em] uppercase mt-1 flex items-center gap-2">
             <span className="w-2 h-2 bg-green-700 animate-pulse rounded-full"></span>
             COGNITIVE BIOHAZARD SCAN
             <span className="text-zinc-500 ml-2 normal-case tracking-normal">// 像检测病毒一样扫描文本中的逻辑谬误。</span>
           </div>
        </div>
        <div className="hidden md:block text-right">
           <div className="text-xs font-mono text-zinc-600">STATUS: {loading ? 'SCANNING...' : 'READY'}</div>
           <div className="text-xs font-mono text-zinc-600">SYS_VER: 4.2.0</div>
        </div>
      </div>

      {/* Input */}
      <div className="relative group">
         <div className="absolute -top-3 left-4 bg-[#020204] px-2 text-[10px] text-green-600 font-mono border border-green-900 uppercase">Input Biological Sample</div>
         <textarea 
           className="w-full h-32 bg-zinc-950 border border-zinc-800 p-6 text-zinc-300 focus:outline-none focus:border-green-600 transition-all font-mono text-sm resize-none"
           placeholder="// 粘贴一段疑似包含逻辑病毒的文本..."
           value={input}
           onChange={(e) => setInput(e.target.value)}
         />
         <div className="absolute bottom-0 right-0 p-2">
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="bg-green-900/20 hover:bg-green-900/40 text-green-500 border border-green-800 px-6 py-2 text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            >
              {loading ? 'INITIATING SCAN...' : 'SCAN FOR VIRUSES'}
            </button>
         </div>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-8 mt-12">
           
           {/* Left Col: Vitals */}
           <div className="md:col-span-4 space-y-6">
              {/* Infection Rate */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 text-center relative overflow-hidden">
                 <h3 className="text-zinc-500 text-[10px] font-mono uppercase mb-2">Infection Rate</h3>
                 <div className={`text-5xl font-black mb-2 ${
                   result.infectionRate > 80 ? 'text-red-500 animate-pulse' : 
                   result.infectionRate > 40 ? 'text-yellow-500' : 'text-green-500'
                 }`}>
                   {result.infectionRate}%
                 </div>
                 <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${result.infectionRate > 80 ? 'bg-red-500' : result.infectionRate > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{width: `${result.infectionRate}%`}}
                    ></div>
                 </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-zinc-950 border border-green-900/30 p-6">
                 <h3 className="text-green-600 text-[10px] font-mono uppercase mb-3 border-b border-green-900/30 pb-2">Overall Diagnosis</h3>
                 <p className="text-zinc-300 font-bold text-lg leading-tight">{result.overallDiagnosis}</p>
              </div>

              {/* Quarantine Advice */}
              <div className="bg-zinc-900 p-6 border-l-2 border-yellow-600">
                 <h3 className="text-yellow-600 text-[10px] font-mono uppercase mb-2">Quarantine Protocol</h3>
                 <p className="text-zinc-400 text-xs leading-relaxed">{result.quarantineAdvice}</p>
              </div>
           </div>

           {/* Right Col: Virus List */}
           <div className="md:col-span-8 space-y-4">
              <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-widest flex justify-between items-center">
                <span>Identified Pathogens</span>
                <span>COUNT: {result.viruses.length}</span>
              </h3>
              
              {result.viruses.length === 0 ? (
                 <div className="p-8 border border-zinc-800 border-dashed text-center text-zinc-600 font-mono">
                    NO ACTIVE VIRUSES DETECTED.
                 </div>
              ) : (
                 <div className="space-y-4">
                   {result.viruses.map((virus, i) => (
                     <div key={i} className="bg-black border border-zinc-800 hover:border-zinc-600 transition-colors p-5 relative group overflow-hidden">
                        {/* Hazard Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          virus.severity === 'CRITICAL' ? 'bg-red-600' :
                          virus.severity === 'HIGH' ? 'bg-orange-500' :
                          virus.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>

                        <div className="flex justify-between items-start mb-3 pl-3">
                           <h4 className="text-zinc-200 font-bold font-mono uppercase">{virus.name}</h4>
                           <span className={`text-[10px] px-2 py-0.5 font-mono font-bold border ${
                             virus.severity === 'CRITICAL' ? 'text-red-500 border-red-500 bg-red-950/20' :
                             virus.severity === 'HIGH' ? 'text-orange-500 border-orange-500 bg-orange-950/20' :
                             virus.severity === 'MEDIUM' ? 'text-yellow-500 border-yellow-500 bg-yellow-950/20' : 
                             'text-green-500 border-green-500 bg-green-950/20'
                           }`}>
                             {virus.severity}
                           </span>
                        </div>

                        <div className="pl-3 space-y-3">
                           <div className="bg-zinc-900/50 p-2 text-xs text-zinc-400 font-mono border-l border-zinc-700">
                              <span className="text-zinc-600 block text-[9px] uppercase mb-1">Symptom (Source Text)</span>
                              "{virus.symptom}"
                           </div>
                           <div className="text-sm text-zinc-300">
                              <span className="text-green-600 font-bold text-xs uppercase mr-2">[ TREATMENT ]</span>
                              {virus.treatment}
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              )}
           </div>

        </div>
      )}
    </div>
  );
};