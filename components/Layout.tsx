
import React, { useState } from 'react';
import { AppRoute } from '../types';
import { ArchiveModal } from './ArchiveModal';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenSettings: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeRoute, onNavigate, onOpenSettings }) => {
  const isLanding = activeRoute === 'LANDING';
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void text-zinc-300 font-mono selection:bg-cyan selection:text-black flex flex-col relative overflow-hidden">
      <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />

      {/* --- GLOBAL FX LAYERS --- */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40"></div>
      <div className="bg-noise"></div>
      <div className="scanline"></div>
      
      {/* --- HUD HEADER (Hidden on Landing) --- */}
      {!isLanding && (
        <header className="border-b border-glass-border bg-glass backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={() => onNavigate('HUB')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-8 h-8 flex items-center justify-center border border-cyan bg-cyan/10 shadow-[0_0_10px_rgba(0,240,255,0.3)] group-hover:bg-cyan group-hover:text-black transition-all">
                <span className="text-lg font-bold">D</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-cyan tracking-widest leading-none font-sans text-lg text-glow">DEEP_DISSECT</span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">System v2.0</span>
              </div>
            </button>

            <div className="flex items-center gap-4">
               {activeRoute !== 'HUB' && (
                <button 
                  onClick={() => onNavigate('HUB')}
                  className="hidden md:block text-xs font-mono text-cyan/70 hover:text-cyan border border-cyan/30 px-3 py-1.5 hover:bg-cyan/10 transition-all uppercase"
                >
                  [ ESC_BACK ]
                </button>
              )}
              
              <button
                onClick={() => setIsArchiveOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 border border-zinc-700 hover:border-amber-500 hover:bg-amber-950/30 transition-all"
                title="ARCHIVE"
              >
                 <span className="text-zinc-500 group-hover:text-amber-500">📂</span>
                 <span className="text-[10px] font-mono text-zinc-500 group-hover:text-amber-500 uppercase hidden md:inline">Logs</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="w-8 h-8 flex items-center justify-center border border-zinc-700 hover:border-cyan text-zinc-500 hover:text-cyan bg-black hover:bg-cyan/10 transition-all"
                title="CONFIG"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}
      
      <main className={`flex-1 w-full ${isLanding ? '' : 'max-w-6xl mx-auto p-4 md:p-8'} relative z-10`}>
        {children}
      </main>

      {/* --- FOOTER (Hidden on Landing) --- */}
      {!isLanding && (
        <footer className="border-t border-glass-border bg-black/50 py-6 text-center backdrop-blur-sm z-10">
          <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
            SYSTEM STATUS: ONLINE • POWERED BY DEEPSEEK & GEMINI • <span className="text-purple/70">NO SOUL DETECTED</span>
          </p>
        </footer>
      )}
    </div>
  );
};
