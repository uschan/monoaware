import React, { useState } from 'react';
import { runCodeArchaeology } from '../services/geminiService';
import { CodeArchResult } from '../types';

export const CodeArchaeologist: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeArchResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runCodeArchaeology(input); setResult(data); } 
    catch (e) { alert('代码太烂，考古铲折断了。'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Museum Header */}
      <div className="flex items-end justify-between border-b border-stone-700 pb-6">
        <div>
           <h2 className="text-4xl font-serif text-stone-300">数字遗迹博物馆</h2>
           <div className="text-xs font-serif text-stone-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
             <span>MUSEUM OF DIGITAL ANTIQUITY</span>
             <span className="text-stone-600 normal-case tracking-normal">// 像考古一样分析陈旧代码的历史层次。</span>
           </div>
        </div>
        <div className="text-right">
           <div className="text-stone-600 font-mono text-xs">EXHIBIT #: {Math.floor(Math.random()*9999)}</div>
           <div className="text-stone-600 font-mono text-xs">SECTION: RUINS</div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm text-stone-400 font-serif italic">
          Deposit an artifact (paste code snippet) for analysis:
        </label>
        <textarea 
          className="w-full h-48 bg-[#151412] border border-stone-800 rounded-sm p-4 text-stone-400 font-mono text-xs focus:outline-none focus:border-stone-500 transition-all placeholder-stone-700"
          placeholder="// 遗留代码粘贴处..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleRun}
          disabled={loading || !input.trim()}
          className="w-full py-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-serif uppercase tracking-widest text-xs border border-stone-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Performing Carbon-14 Dating...' : 'Analyze Artifact'}
        </button>
      </div>

      {result && (
        <div className="grid md:grid-cols-12 gap-8 bg-[#151412] border border-stone-800 p-8 shadow-2xl relative">
          {/* Decorative Corner Screws */}
          <div className="absolute top-2 left-2 text-stone-700">+</div>
          <div className="absolute top-2 right-2 text-stone-700">+</div>
          <div className="absolute bottom-2 left-2 text-stone-700">+</div>
          <div className="absolute bottom-2 right-2 text-stone-700">+</div>

          {/* Left Column: Metrics */}
          <div className="md:col-span-4 space-y-6 border-r border-stone-800 pr-6">
             <div className="space-y-1">
               <h4 className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Carbon Dating</h4>
               <p className="text-xl text-stone-200 font-serif font-bold">{result.carbonDating}</p>
             </div>

             <div className="space-y-1">
               <h4 className="text-[10px] text-stone-500 uppercase tracking-widest font-mono">Geological Layer</h4>
               <p className="text-sm text-stone-400 italic">{result.techStackLayer}</p>
             </div>

             <div className="space-y-1 pt-4 border-t border-stone-800">
               <h4 className="text-[10px] text-stone-500 uppercase tracking-widest font-mono mb-2">Author Profile</h4>
               <ul className="space-y-2 text-xs font-mono text-stone-400">
                 <li className="flex justify-between">
                   <span>Sanity:</span> <span className="text-stone-200">{result.authorProfile.mentalState}</span>
                 </li>
                 <li className="flex justify-between">
                   <span>Caffeine:</span> <span className="text-stone-200">{result.authorProfile.caffeineLevel}</span>
                 </li>
                 <li className="flex justify-between">
                   <span>Hair Loss:</span> <span className="text-red-400">{result.authorProfile.hairLossRisk}</span>
                 </li>
               </ul>
             </div>

             <div className="pt-4 border-t border-stone-800">
               <h4 className="text-[10px] text-stone-500 uppercase tracking-widest font-mono mb-2">Spaghetti Index</h4>
               <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-700" style={{width: `${result.spaghettiIndex}%`}}></div>
               </div>
               <div className="text-right text-xs text-yellow-700 mt-1 font-mono">{result.spaghettiIndex}/100</div>
             </div>
          </div>

          {/* Right Column: Report */}
          <div className="md:col-span-8 space-y-6">
             <div>
               <h3 className="text-stone-300 font-serif text-lg border-b border-stone-800 pb-2 mb-3">Excavation Report</h3>
               <p className="text-stone-400 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                 {result.excavationReport}
               </p>
             </div>

             <div>
                <h3 className="text-stone-500 font-serif text-xs uppercase mb-3">Fossilized Faults</h3>
                <div className="grid grid-cols-1 gap-2">
                  {result.fossilFaults.map((fault, i) => (
                    <div key={i} className="bg-stone-900/50 border border-stone-800 p-2 px-3 text-xs text-stone-400 font-mono flex items-center gap-2">
                       <span className="opacity-50">#{(i+1).toString().padStart(2,'0')}</span>
                       {fault}
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-[#1e1d1a] border border-stone-700 p-6 relative mt-6">
                <div className="absolute -top-3 left-4 bg-[#1e1d1a] px-2 text-[10px] text-stone-500 uppercase tracking-widest border border-stone-700">
                  Curator's Note
                </div>
                <p className="text-stone-300 font-serif italic text-sm">
                  "{result.curatorNote}"
                </p>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};