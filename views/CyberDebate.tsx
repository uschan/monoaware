import React, { useState } from 'react';
import { runCyberDebate } from '../services/geminiService';
import { DebateResult } from '../types';

export const CyberDebate: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runCyberDebate(input); setResult(data); } 
    catch (e) { alert('双方辩手正在休息。'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Title / Arcade Marquee */}
      <div className="text-center mb-8 relative">
         <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-blue-600 font-sans italic tracking-tighter transform -skew-x-12">
           认知角斗场
         </h2>
         <div className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em] mt-2 flex flex-col items-center gap-1">
           <span>COGNITIVE COLOSSEUM</span>
           <span className="text-[10px] text-zinc-600 normal-case tracking-normal">// 红蓝 AI 针对议题进行极限逻辑互搏。</span>
         </div>
      </div>

      {/* Input */}
      <div className="max-w-xl mx-auto space-y-4 relative z-10">
        <label className="block text-sm text-zinc-400 text-center uppercase tracking-widest font-bold">Select Your Battleground</label>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <input type="text" className="relative w-full bg-black border border-zinc-800 rounded-lg p-4 text-zinc-200 text-center font-bold focus:border-purple-500 outline-none pr-32" 
            value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. AI 是否应该拥有人权？" onKeyDown={(e)=>e.key==='Enter' && handleRun()}/>
          <button onClick={handleRun} disabled={loading || !input.trim()} className="absolute right-2 top-2 bottom-2 px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-black italic text-xs rounded uppercase transform hover:scale-105 transition-all">
            {loading ? 'FIGHT...' : 'FIGHT!'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-12 mt-12">
          
          {/* FIGHTERS HUD */}
          <div className="grid grid-cols-2 gap-4 md:gap-24 items-center">
             {/* RED */}
             <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-red-600 rounded-full border-4 border-red-900 flex items-center justify-center font-black text-xl italic text-black">P1</div>
                  <div>
                    <h3 className="text-red-500 font-black text-2xl uppercase italic">{result.redFighter.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase">{result.redFighter.style}</p>
                  </div>
                </div>
                {/* Health Bar */}
                <div className="h-4 w-full bg-zinc-900 border border-red-900 skew-x-[-20deg] relative overflow-hidden">
                   <div className="absolute top-0 left-0 h-full bg-red-600 w-[80%]"></div>
                   <div className="absolute top-0 left-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=')] opacity-50"></div>
                </div>
             </div>

             {/* BLUE */}
             <div className="text-right space-y-2">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-blue-900 flex items-center justify-center font-black text-xl italic text-black">P2</div>
                  <div>
                    <h3 className="text-blue-500 font-black text-2xl uppercase italic">{result.blueFighter.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase">{result.blueFighter.style}</p>
                  </div>
                </div>
                {/* Health Bar */}
                <div className="h-4 w-full bg-zinc-900 border border-blue-900 skew-x-[20deg] relative overflow-hidden">
                   <div className="absolute top-0 right-0 h-full bg-blue-600 w-[75%]"></div>
                   <div className="absolute top-0 left-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=')] opacity-50"></div>
                </div>
             </div>
          </div>
          
          <div className="text-center font-black text-4xl text-zinc-800 italic select-none">VS</div>

          {/* ROUNDS */}
          <div className="space-y-8">
             {result.rounds.map((round, i) => (
               <div key={i} className="relative group">
                 <div className="absolute left-1/2 -top-4 -translate-x-1/2 bg-black border border-zinc-700 px-4 py-1 rounded-full text-zinc-400 font-mono text-xs uppercase z-10">
                   {round.roundName}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-hidden">
                    {/* Red Move */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-zinc-800 relative hover:bg-red-950/10 transition-colors">
                       <span className="text-[10px] text-red-500 font-bold uppercase mb-2 block tracking-wider">
                         {round.redMove.name}
                       </span>
                       <p className="text-zinc-300 text-sm leading-relaxed">
                         "{round.redMove.content}"
                       </p>
                       <div className="absolute bottom-2 right-2 text-red-700 font-black text-xl opacity-20 rotate-[-10deg]">
                         -{round.redMove.damage} HP
                       </div>
                    </div>

                    {/* Blue Move */}
                    <div className="p-6 relative hover:bg-blue-950/10 transition-colors">
                       <span className="text-[10px] text-blue-500 font-bold uppercase mb-2 block tracking-wider text-right">
                         {round.blueMove.name}
                       </span>
                       <p className="text-zinc-300 text-sm leading-relaxed text-right">
                         "{round.blueMove.content}"
                       </p>
                       <div className="absolute bottom-2 left-2 text-blue-700 font-black text-xl opacity-20 rotate-[10deg]">
                         -{round.blueMove.damage} HP
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>

          {/* WINNER ANNOUNCEMENT */}
          <div className="text-center py-10 relative overflow-hidden bg-black border-y border-zinc-800">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/20 to-transparent"></div>
             <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em] mb-4 relative z-10">K.O. - Winner</h3>
             <div className={`text-6xl font-black italic mb-6 relative z-10 ${result.winner === 'RED' ? 'text-red-500' : result.winner === 'BLUE' ? 'text-blue-500' : 'text-zinc-200'}`}>
                {result.winner === 'RED' ? result.redFighter.name : result.winner === 'BLUE' ? result.blueFighter.name : 'DRAW'}
             </div>
             <div className="max-w-2xl mx-auto bg-zinc-900/50 border border-zinc-700 p-6 rounded-lg relative z-10">
                <span className="text-purple-400 font-bold text-xs uppercase mb-2 block">Fatality Move</span>
                <p className="text-zinc-200 italic font-serif text-lg">"{result.fatalityMove}"</p>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};