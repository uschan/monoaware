import React, { useState } from 'react';
import { runPersonalityJury } from '../services/geminiService';
import { JuryResult } from '../types';

export const PersonalityJury: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JuryResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runPersonalityJury(input); setResult(data); } 
    catch (e) { alert('The jury is hung.'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Title */}
      <div className="text-center py-6">
        <h2 className="text-4xl font-serif italic font-bold text-lime-400 drop-shadow-md">
          原型议会
        </h2>
        <div className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest flex flex-col items-center gap-1">
          <span>THE COUNCIL OF ARCHETYPES</span>
          <span className="text-[10px] text-zinc-600 normal-case tracking-normal">// 脑内不同欲望人格对议题进行投票辩论。</span>
        </div>
      </div>

      {/* Input */}
      <div className="max-w-xl mx-auto relative group z-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-600 to-green-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex">
          <input 
            type="text" 
            className="w-full bg-zinc-900 border border-zinc-700 rounded-l-lg p-4 text-zinc-200 focus:outline-none focus:border-lime-500 font-serif italic text-lg placeholder-zinc-700" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="What is the dilemma, detective?" 
          />
          <button 
            onClick={handleRun} 
            disabled={loading || !input.trim()} 
            className="bg-lime-700 hover:bg-lime-600 text-black font-bold px-6 rounded-r-lg uppercase text-xs tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? 'Rolling Dice...' : 'Commune'}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-12 space-y-8">
           
           {/* Header Stats */}
           <div className="flex justify-between items-center bg-zinc-900/50 border-y border-zinc-700 py-3 px-6">
              <span className="text-zinc-400 font-mono text-xs uppercase">{result.councilName}</span>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-mono text-zinc-500 uppercase">Internal Chaos:</span>
                 <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${result.chaosMeter > 50 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{width: `${result.chaosMeter}%`}}
                    ></div>
                 </div>
                 <span className="text-xs font-bold text-zinc-300">{result.chaosMeter}%</span>
              </div>
           </div>

           {/* Jurors Cards */}
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {result.jurors.map((juror, i) => (
               <div key={i} className={`
                 relative p-6 border-l-4 bg-zinc-950 shadow-lg hover:-translate-y-1 transition-transform duration-300
                 ${juror.stance === 'SUPPORT' ? 'border-lime-600' : juror.stance === 'OPPOSE' ? 'border-red-600' : 'border-zinc-500'}
               `}>
                 <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl filter drop-shadow-md">{juror.icon}</div>
                    <div>
                       <h3 className={`font-black text-lg uppercase italic leading-none ${
                         juror.stance === 'SUPPORT' ? 'text-lime-500' : juror.stance === 'OPPOSE' ? 'text-red-500' : 'text-zinc-400'
                       }`}>
                         {juror.archetype}
                       </h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-black ${
                             juror.stance === 'SUPPORT' ? 'bg-lime-600' : juror.stance === 'OPPOSE' ? 'bg-red-600' : 'bg-zinc-500'
                          }`}>
                            {juror.stance}
                          </span>
                          <span className="text-[10px] text-zinc-600 font-mono">Intensity: {juror.intensity}</span>
                       </div>
                    </div>
                 </div>
                 
                 <p className="font-serif text-zinc-300 leading-relaxed italic text-sm">
                   "{juror.monologue}"
                 </p>
               </div>
             ))}
           </div>

           {/* Final Decree */}
           <div className="max-w-2xl mx-auto text-center pt-8 border-t border-zinc-800">
              <div className="inline-block border-2 border-white px-8 py-4 bg-black relative">
                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
                   The Final Decree
                 </span>
                 <p className="text-xl md:text-2xl font-black text-white font-serif leading-tight">
                   {result.finalDecree}
                 </p>
              </div>
           </div>

        </div>
      )}
    </div>
  );
};