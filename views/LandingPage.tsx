
import React, { useEffect, useState } from 'react';
import { AppRoute } from '../types';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.05),transparent_70%)] z-0 pointer-events-none"></div>
      
      {/* --- HERO SECTION --- */}
      <div className={`text-center space-y-6 z-10 max-w-5xl px-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Badge */}
        <div className="flex justify-center mb-8">
           <div className="border border-cyan/30 bg-cyan/5 px-4 py-1 rounded-full text-cyan text-[10px] font-mono uppercase tracking-[0.3em] backdrop-blur-sm animate-pulse">
             System Status: Online // DeepSeek Model Active
           </div>
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mix-blend-overlay">
          DEEP DISSECT
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan via-purple-500 to-cyan bg-[length:200%_auto] animate-[scan_3s_linear_infinite]">
            LABORATORY
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 font-mono text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
          不要被所谓的“直觉”欺骗。这是一组<span className="text-cyan">反直觉</span>的认知解剖工具。
          <br className="hidden md:block"/>
          从蝴蝶效应到人生验尸，用 AI 的绝对理性，重构你的现实模型。
        </p>

        {/* CTA Button */}
        <div className="pt-12">
          <button 
            onClick={onEnter}
            className="group relative px-12 py-5 bg-white text-black font-bold text-xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter The Lab <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
          </button>
          <p className="text-zinc-600 text-[10px] font-mono mt-4 uppercase">
            Warning: Side effects may include disillusionment and epiphany.
          </p>
        </div>
      </div>

      {/* --- BENTO GRID SHOWCASE (Absolute positioned background elements) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 md:opacity-40">
         {/* Top Left: The Matrix */}
         <div className="absolute top-10 left-10 w-64 h-64 border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hidden xl:block rotate-[-6deg]">
            <div className="text-[10px] text-zinc-500 font-mono mb-2 uppercase">Decision Matrix</div>
            <div className="grid grid-cols-4 gap-1 h-full opacity-50">
               {[...Array(16)].map((_, i) => (
                 <div key={i} className={`bg-cyan/20 rounded ${i%3===0 ? 'bg-purple/20' : ''}`}></div>
               ))}
            </div>
         </div>

         {/* Top Right: The Code */}
         <div className="absolute top-20 right-10 w-80 p-4 border border-zinc-800 bg-black rounded-xl font-mono text-[8px] text-green-500 hidden xl:block rotate-[3deg]">
            {`> INITIATING COGNITIVE_SCAN...\n> TARGET: HUMAN_BIAS\n> LOADING MODULE: EGO_DESTRUCTION\n> [====================] 100%\n> RESULT: REALITY_DISTORTION_DETECTED`}
         </div>

         {/* Bottom Left: The Invoice */}
         <div className="absolute bottom-20 left-20 w-56 h-80 bg-zinc-200 text-black p-4 rotate-[5deg] hidden xl:block shadow-2xl opacity-80">
            <div className="border-b border-black pb-2 mb-2 text-center font-mono text-[10px] font-bold">KARMIC INVOICE</div>
            <div className="space-y-2 font-mono text-[8px]">
               <div className="flex justify-between"><span>ITEM: DREAM</span><span>$999k</span></div>
               <div className="flex justify-between"><span>COST: SOUL</span><span>100%</span></div>
               <div className="mt-8 text-center text-red-600 font-black text-xl rotate-[-20deg] border-2 border-red-600 inline-block p-1">PAID</div>
            </div>
         </div>

         {/* Bottom Right: The Mirror */}
         <div className="absolute bottom-10 right-20 w-64 h-64 rounded-full border-2 border-cyan/30 bg-gradient-to-tr from-cyan/10 to-purple/10 backdrop-blur-xl hidden xl:flex items-center justify-center">
            <span className="text-cyan font-mono text-xs animate-pulse">REFLECTING...</span>
         </div>
      </div>

      {/* Footer Ticker */}
      <div className="absolute bottom-0 left-0 w-full bg-black border-t border-zinc-800 py-3 overflow-hidden">
         <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] text-zinc-500 font-mono text-xs uppercase flex gap-12">
            <span>// 20+ Cognitive Tools Available</span>
            <span>// Powered by Gemini Pro & DeepSeek</span>
            <span>// Analysis Complete</span>
            <span>// No Soul Detected</span>
            <span>// Welcome to the machine</span>
            <span>// 20+ Cognitive Tools Available</span>
            <span>// Powered by Gemini Pro & DeepSeek</span>
            <span>// Analysis Complete</span>
         </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
