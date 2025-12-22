
import React, { useState } from 'react';
import { runDecisionMatrix } from '../services/geminiService';
import { DecisionPathResult, DecisionInput } from '../types';

export const DecisionPath: React.FC = () => {
  const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'RESULT'>('INPUT');
  
  // Simplified State for User
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']); // Start with 2 empty options

  const [result, setResult] = useState<DecisionPathResult | null>(null);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const updateOption = (idx: number, val: string) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };

  const handleAnalyze = async () => {
    // 1. Validation: Title and at least 2 non-empty options
    const validOptions = options.filter(o => o.trim().length > 0);
    
    if (!title.trim()) {
      alert("请输入决策问题（如：要不要辞职？）");
      return;
    }
    if (validOptions.length < 2) {
      alert("请至少输入两个选项进行对比。");
      return;
    }

    setStep('ANALYZING');

    // 2. Construct complex object from simple inputs (AI will fill the gaps)
    const payload: DecisionInput = {
      title: title,
      category: 'General', // AI inferred
      timeframe: 'Medium Term', // AI inferred
      urgency: 3,
      currentState: context,
      constraints: '', // Merged into context
      irreversibles: '', // Merged into context
      options: validOptions.map(name => ({
        name: name,
        desc: name, // AI will expand based on name
        pros: '', // AI will generate
        cons: '', // AI will generate
        emotionalPull: 3 // Default
      })),
      weights: {
        riskTolerance: 3,
        stabilityPref: 3,
        growthPriority: 3,
        shortTermPressure: 3
      }
    };

    try {
      const data = await runDecisionMatrix(payload);
      setResult(data);
      setStep('RESULT');
    } catch (e) {
      console.error(e);
      alert('矩阵构建失败，系统过载。请稍后重试。');
      setStep('INPUT');
    }
  };

  if (step === 'INPUT') {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="border-l-2 border-cyan pl-4 mb-8">
          <h2 className="text-3xl font-bold text-cyan font-sans tracking-tight">决策推演矩阵</h2>
          <div className="text-zinc-400 mt-2 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <span>DECISION MATRIX PROTOCOL</span>
            <span className="text-zinc-600 normal-case tracking-normal">// 理性拆解复杂决策，权衡收益与不可逆风险。</span>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. The Question */}
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 relative">
            <span className="absolute top-0 left-0 bg-cyan text-black text-[10px] px-2 py-0.5 font-bold font-mono">STEP 1: THE DILEMMA</span>
            <div className="mt-4">
              <label className="text-sm text-zinc-400 font-bold block mb-2">决策主题 (Decision Topic)</label>
              <input 
                className="w-full bg-black border border-zinc-700 p-4 text-zinc-200 focus:border-cyan text-lg placeholder-zinc-700 outline-none transition-colors"
                placeholder="例如：是否应该辞职去创业？ / 要不要在大城市买房？"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* 2. The Context */}
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 relative">
            <span className="absolute top-0 left-0 bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 font-bold font-mono">STEP 2: CONTEXT</span>
            <div className="mt-4">
              <label className="text-sm text-zinc-400 font-bold block mb-2">背景情况 & 顾虑 (Background & Constraints)</label>
              <textarea 
                className="w-full h-32 bg-black border border-zinc-700 p-4 text-zinc-200 focus:border-cyan text-sm resize-none placeholder-zinc-700 outline-none transition-colors"
                placeholder="请简要描述你的现状、主要纠结的点、以及有什么硬性限制（比如缺钱、家庭阻力等）..."
                value={context}
                onChange={e => setContext(e.target.value)}
              />
            </div>
          </div>

          {/* 3. The Options */}
          <div className="bg-zinc-950/50 border border-zinc-800 p-6 relative">
            <div className="flex justify-between items-center mb-4 mt-2">
               <span className="absolute top-0 left-0 bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 font-bold font-mono">STEP 3: OPTIONS</span>
               <label className="text-sm text-zinc-400 font-bold">可选方案 (Options)</label>
               {options.length < 4 && (
                 <button 
                   onClick={handleAddOption}
                   className="text-xs bg-cyan/10 text-cyan border border-cyan/50 px-3 py-1 hover:bg-cyan hover:text-black transition-colors"
                 >
                   + 添加方案
                 </button>
               )}
            </div>
            
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                   <div className="flex-none w-8 h-12 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 font-mono text-xs">
                     {String.fromCharCode(65 + idx)}
                   </div>
                   <input 
                     className="flex-1 bg-black border border-zinc-700 p-3 text-zinc-200 focus:border-cyan text-sm outline-none transition-colors placeholder-zinc-700"
                     placeholder={`方案 ${idx + 1} (如: ${idx === 0 ? '立刻裸辞' : '苟着不动'})`}
                     value={opt}
                     onChange={e => updateOption(idx, e.target.value)}
                   />
                   {options.length > 2 && (
                     <button 
                       onClick={() => handleRemoveOption(idx)}
                       className="flex-none w-10 bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-900 hover:text-white transition-colors flex items-center justify-center text-lg"
                     >
                       ×
                     </button>
                   )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 font-mono">
              * 只需填写方案名称，AI 会自动推演其优缺点和潜在风险。
            </p>
          </div>

          <button 
            onClick={handleAnalyze}
            className="w-full py-5 bg-cyan text-black font-bold font-sans text-xl tracking-[0.2em] hover:bg-cyan/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 group mt-8"
          >
            启动矩阵推演
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'ANALYZING') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 font-mono">
        <div className="relative w-32 h-32">
           <div className="absolute inset-0 border-t-2 border-cyan animate-spin"></div>
           <div className="absolute inset-4 border-r-2 border-purple animate-spin animation-delay-200"></div>
           <div className="absolute inset-8 border-b-2 border-white animate-spin animation-delay-500"></div>
        </div>
        <div className="text-center space-y-4">
           <h3 className="text-cyan text-2xl tracking-widest animate-pulse font-sans">构建决策矩阵...</h3>
           <p className="text-zinc-500 text-sm">
             模拟未来时间线 // 计算隐性代价 // 审计情绪干扰
           </p>
        </div>
        <div className="w-64 h-1 bg-zinc-900 rounded overflow-hidden mt-8">
           <div className="h-full bg-cyan animate-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-4">
        <div>
           <div className="text-xs font-mono text-zinc-500 mb-1">DECISION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
           <h2 className="text-3xl font-bold text-white font-sans">{title}</h2>
        </div>
        <button onClick={() => setStep('INPUT')} className="text-xs font-mono text-cyan hover:underline mt-4 md:mt-0 flex items-center gap-1">
          <span>[ 重新配置 ]</span>
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COL: Diagnostic & Risks (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. Diagnostic Card */}
            <div className="bg-zinc-950 border border-purple/50 p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-purple select-none pointer-events-none group-hover:opacity-20 transition-opacity">?</div>
               <h3 className="text-purple font-mono text-xs uppercase tracking-widest mb-4 border-b border-purple/20 pb-2">决策本质诊断</h3>
               <div className="space-y-4 relative z-10">
                  <div>
                     <span className="text-[10px] text-zinc-500 block uppercase">Nature (类型)</span>
                     <span className="text-lg font-bold text-white leading-tight">{result.decision_nature.type}</span>
                  </div>
                  <div>
                     <span className="text-[10px] text-zinc-500 block uppercase">Core Conflict (核心冲突)</span>
                     <span className="text-sm text-zinc-300 leading-snug">{result.decision_nature.core_conflict}</span>
                  </div>
                  <div>
                     <span className="text-[10px] text-zinc-500 block uppercase">Uncertainty (最大变量)</span>
                     <span className="text-sm text-zinc-300 leading-snug">{result.decision_nature.key_uncertainty}</span>
                  </div>
               </div>
            </div>

            {/* Risk Warnings */}
            <div className="space-y-4">
               <h3 className="text-red-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  风险警报区 (ALERTS)
               </h3>
               {result.risk_warnings.map((risk, i) => (
                  <div key={i} className="bg-red-950/10 border border-red-900/40 p-4 rounded-sm hover:bg-red-950/20 transition-colors">
                     <span className="text-red-400 text-[10px] font-bold uppercase mb-1 block tracking-wider">{risk.option}</span>
                     <p className="text-zinc-200 text-sm font-bold mb-2">"{risk.underestimated_risk}"</p>
                     <p className="text-zinc-500 text-xs leading-relaxed">{risk.why_it_is_dangerous}</p>
                  </div>
               ))}
            </div>

          </div>

          {/* MIDDLE COL: Matrix (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
             <h3 className="text-cyan font-mono text-xs uppercase tracking-widest">核心对照矩阵 (COMPARISON MATRIX)</h3>
             <div className="overflow-x-auto border border-zinc-800 bg-black shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[600px]">
                   <thead>
                      <tr className="bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase tracking-wider text-center">
                         <th className="p-3 border-r border-zinc-800 w-24 sticky left-0 bg-zinc-900 z-10 text-left">方案</th>
                         <th className="p-3 border-r border-zinc-800 w-32 text-cyan">短期收益<br/>(0-6m)</th>
                         <th className="p-3 border-r border-zinc-800 w-32 text-yellow-500">中期风险<br/>(6-18m)</th>
                         <th className="p-3 border-r border-zinc-800 w-32 text-purple">长期天花板<br/>(2-5y)</th>
                         <th className="p-3 w-32 text-red-500">不可逆点<br/>(Warning)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-800">
                      {result.comparison_matrix.map((row, i) => (
                        <tr key={i} className="group hover:bg-zinc-900/30 transition-colors">
                           <td className="p-4 border-r border-zinc-800 font-bold text-zinc-100 text-sm sticky left-0 bg-black group-hover:bg-zinc-900/30 align-top">
                              {row.option}
                           </td>
                           <td className="p-3 border-r border-zinc-800 text-xs text-zinc-400 align-top leading-relaxed">{row.short_term_gain}</td>
                           <td className="p-3 border-r border-zinc-800 text-xs text-zinc-400 align-top leading-relaxed">{row.medium_term_risk}</td>
                           <td className="p-3 border-r border-zinc-800 text-xs text-zinc-400 align-top leading-relaxed">{row.long_term_ceiling}</td>
                           <td className="p-3 text-xs text-red-400 align-top leading-relaxed">{row.irreversibility}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             {/* Secondary Details for Matrix items */}
             <div className="grid md:grid-cols-2 gap-4">
                 {result.comparison_matrix.map((row, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 p-4 flex flex-col justify-between">
                       <span className="text-zinc-500 text-[10px] uppercase font-bold mb-2">{row.option} - 补充分析</span>
                       <div className="space-y-2 text-xs">
                          <div className="flex justify-between border-b border-zinc-800 pb-1">
                            <span className="text-zinc-500">退路 (Exit Path):</span>
                            <span className="text-zinc-300 text-right max-w-[60%]">{row.exit_path}</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-zinc-500">情绪耐受 (Mood):</span>
                            <span className="text-zinc-300 text-right max-w-[60%]">{row.emotional_sustainability}</span>
                          </div>
                       </div>
                    </div>
                 ))}
             </div>
          </div>

          {/* RIGHT COL: Action & Cooling (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Experiments */}
            <div className="space-y-4">
               <h3 className="text-green-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  低成本试错 (SANDBOX)
               </h3>
               {result.experimentation_suggestions.map((exp, i) => (
                  <div key={i} className="bg-green-950/10 border border-green-900/30 p-4 rounded-sm">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-green-400 text-[10px] font-bold uppercase">{exp.option}</span>
                        <span className="text-[10px] bg-green-900/30 text-green-300 px-1.5 py-0.5 rounded border border-green-800">{exp.cost}</span>
                     </div>
                     <p className="text-zinc-300 text-xs mb-2 leading-relaxed">{exp.test_method}</p>
                     <p className="text-zinc-600 text-[10px] font-mono text-right">{exp.timeframe}</p>
                  </div>
               ))}
            </div>

            {/* Stop Loss */}
            <div className="bg-zinc-900 p-5 rounded-sm border border-zinc-800">
               <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">止损信号 (STOP LOSS)</h3>
               <ul className="space-y-3">
                  {result.stop_loss_signals.map((sl, i) => (
                     <li key={i} className="text-xs text-zinc-400 flex flex-col gap-1 pb-2 border-b border-zinc-800 last:border-0">
                        <strong className="text-zinc-200">{sl.option}</strong>
                        <span>若: "{sl.signal}"</span>
                        <span className="text-red-400">则: {sl.action}</span>
                     </li>
                  ))}
               </ul>
            </div>

            {/* Cooling */}
            <div className="bg-black p-5 rounded-sm border border-cyan/20">
               <h3 className="text-cyan font-mono text-xs uppercase tracking-widest mb-4">冷却建议 (COOLING)</h3>
               <div className="space-y-3">
                  <div>
                     <span className="text-[10px] text-zinc-500 block">检测到的情绪干扰</span>
                     <span className="text-xs text-yellow-500">{result.cooling_advice.emotional_bias_detected}</span>
                  </div>
                  <div>
                     <span className="text-[10px] text-zinc-500 block">建议冷静期</span>
                     <span className="text-xs text-cyan font-bold">{result.cooling_advice.recommended_wait_time}</span>
                  </div>
                  <div className="pt-2">
                     <span className="text-[10px] text-zinc-500 block mb-1">冷静后请自问:</span>
                     <ul className="list-disc list-inside text-[10px] text-zinc-300 space-y-1">
                        {result.cooling_advice.recheck_questions.map((q, i) => (
                           <li key={i}>{q}</li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
