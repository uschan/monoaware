
import React from 'react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 p-4" onClick={onClose}>
      <div 
        className="bg-[#050505] border border-zinc-800 w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Cyberpunk Deco Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan/50 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-zinc-800"></div>

        <div className="p-8 md:p-12 space-y-8 font-mono relative z-10">
          
          <div className="flex justify-between items-start">
             <div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                  The Protocol <span className="text-cyan">v2.0</span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">实验室入职须知 // User Manual</p>
             </div>
             <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors text-2xl leading-none">&times;</button>
          </div>

          <div className="space-y-6 text-sm md:text-base text-zinc-300 leading-relaxed h-[60vh] md:h-auto overflow-y-auto pr-2 custom-scrollbar">
            
            <section>
              <h3 className="text-cyan font-bold uppercase text-xs tracking-widest mb-2 border-b border-zinc-900 pb-1">01. 核心哲学</h3>
              <p>
                这里不是心理咨询室，这里是<strong className="text-white">认知解剖实验室</strong>。
                市面上的 AI 都在试图讨好你、安慰你，而在 Deep Dissect，我们利用 LLM (DeepSeek/Gemini) 的绝对理性，
                切除你思维中的<span className="text-red-500">情绪肿瘤</span>。
              </p>
            </section>

            <section>
              <h3 className="text-cyan font-bold uppercase text-xs tracking-widest mb-2 border-b border-zinc-900 pb-1">02. 工具使用指南</h3>
              <ul className="space-y-3 list-disc list-inside text-zinc-400">
                <li>
                  <span className="text-white font-bold">如果你很迷茫：</span> 使用 <span className="text-purple-400">平行宇宙观测站</span> 或 <span className="text-amber-500">时空信箱</span>，拉长视角看人生。
                </li>
                <li>
                  <span className="text-white font-bold">如果你很上头：</span> 使用 <span className="text-red-500">项目验尸官</span> 或 <span className="text-orange-500">混沌计算器</span>，用最坏的结果以此为鉴。
                </li>
                <li>
                  <span className="text-white font-bold">如果你在纠结：</span> 使用 <span className="text-cyan-400">决策推演矩阵</span> 或 <span className="text-lime-400">原型议会</span>，让 AI 替你把脑子里的声音具象化。
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-cyan font-bold uppercase text-xs tracking-widest mb-2 border-b border-zinc-900 pb-1">03. 警告</h3>
              <p className="text-red-900/80 bg-red-950/10 p-4 border border-red-900/20 text-xs">
                ⚠️ WARNING: 本系统输出的内容可能极度直白、刻薄或令人不适。
                如果你正在寻求情感慰藉，请立即关闭本页面。
                如果你准备好直面真相，欢迎来到实验室。
              </p>
            </section>

          </div>

          <div className="pt-6 border-t border-zinc-900 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-cyan hover:scale-105 transition-all"
            >
              I Accept The Truth
            </button>
          </div>

        </div>
        
        {/* Background Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
    </div>
  );
};
