import React, { useState } from 'react';
import { runCostCalculation } from '../services/geminiService';
import { CostCalcResult } from '../types';

export const CostCalc: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CostCalcResult | null>(null);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    try { const data = await runCostCalculation(input); setResult(data); } 
    catch (e) { alert('Error generating invoice.'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white font-mono uppercase tracking-widest">
          因果发票
        </h2>
        <div className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-[0.2em] flex flex-col items-center gap-1">
          <span>THE KARMIC INVOICE</span>
          <span className="text-[10px] text-zinc-600 normal-case tracking-normal">// 计算选择背后的隐性代价和灵魂损耗。</span>
        </div>
      </div>

      {/* Input */}
      <div className="max-w-xl mx-auto space-y-4">
        <div className="relative">
          <input type="text" className="w-full bg-black border-b-2 border-zinc-700 p-4 text-center text-zinc-200 focus:border-white outline-none font-mono" 
            value={input} onChange={(e) => setInput(e.target.value)} placeholder="What do you want to buy? (e.g. A chill job)" />
        </div>
        <button onClick={handleRun} disabled={loading || !input.trim()} className="w-full py-3 bg-white text-black font-bold font-mono uppercase text-xs hover:bg-zinc-200 transition-all disabled:opacity-50">
          {loading ? 'CALCULATING SOUL COST...' : 'PRINT INVOICE'}
        </button>
      </div>

      {result && (
        <div className="max-w-md mx-auto mt-12 filter drop-shadow-xl animate-in slide-in-from-top-8 duration-700">
           
           {/* Receipt Paper */}
           <div className="bg-[#f0f0f0] text-black font-mono p-6 relative pb-16 receipt-paper">
              
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-black border-dashed pb-4 mb-4">
                 <h3 className="font-black text-xl uppercase tracking-tighter">HELL'S KITCHEN LLC</h3>
                 <p className="text-[10px] uppercase">Department of Hidden Costs</p>
                 <p className="text-[10px] mt-2">ID: {result.invoiceId}</p>
                 <p className="text-[10px]">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>

              {/* Line Items */}
              <div className="space-y-3 mb-6 min-h-[200px]">
                 {result.lineItems.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between items-baseline">
                          <span className="font-bold text-sm uppercase">{item.category}</span>
                          <span className="font-bold text-sm">{item.cost}</span>
                       </div>
                       <p className="text-[10px] opacity-70 leading-tight pr-4">{item.description}</p>
                    </div>
                 ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-black border-dashed pt-4 mb-6">
                 <div className="flex justify-between items-end">
                    <span className="font-black text-xl">TOTAL</span>
                    <span className="font-black text-xl">{result.totalCost}</span>
                 </div>
                 <div className="text-right text-[10px] uppercase mt-1">
                    Currency: {result.currencyUnit}
                 </div>
              </div>

              {/* Barcode & Fine Print */}
              <div className="text-center space-y-4">
                 <div className="h-12 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAAXNSR0IArs4c6QAAABNJREFUGFdjvb29/z8DExAzEAAAQAwBv9H6gAAAABJRU5ErkJggg==')] bg-repeat-x bg-contain w-3/4 mx-auto opacity-80"></div>
                 <p className="text-[8px] uppercase leading-tight opacity-60">
                    {result.finePrint}
                 </p>
                 <p className="text-[8px] uppercase font-bold">NO REFUNDS.</p>
              </div>

              {/* Jagged Bottom Edge (CSS trick) */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-[#020204]" style={{
                 maskImage: 'linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%)',
                 maskSize: '20px 20px',
                 maskRepeat: 'repeat-x',
                 maskPosition: '0 100%'
              }}></div>
              
              {/* Actual Jagged Edge Visual on the white paper */}
              <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#f0f0f0]" style={{
                 clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'
              }}></div>

           </div>
        </div>
      )}
    </div>
  );
};