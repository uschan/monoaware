
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
        <footer className="border-t border-glass-border bg-black/80 py-8 text-center backdrop-blur-md z-10 flex flex-col items-center gap-3">
          
          {/* Line 1: Status */}
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span>SYSTEM STATUS: ONLINE</span>
            <span className="text-zinc-700">•</span>
            <span className="text-purple/70">NO SOUL DETECTED</span>
          </div>

          {/* Line 2: Powered By */}
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
            POWERED BY DEEPSEEK & GEMINI <span className="mx-1 text-zinc-700">//</span> <span className="text-cyan/60 hover:text-cyan transition-colors cursor-default">野盐Vibe Coding</span>
          </div>

          {/* Line 3: Social Capsule */}
          <div className="mt-2 px-6 py-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm flex items-center gap-5 shadow-lg hover:border-zinc-700/80 transition-all duration-300 group">
            
            <SocialLink href="https://x.com/uschan" icon={<XIcon />} label="X (Twitter)" />
            <SocialLink href="https://github.com/uschan" icon={<GithubIcon />} label="GitHub" />
            <SocialLink href="https://www.instagram.com/bujjun" icon={<InstaIcon />} label="Instagram" />
            <SocialLink href="https://bsky.app/profile/wildsalt.bsky.social" icon={<BlueskyIcon />} label="Bluesky" />
            <SocialLink href="https://paypal.me/wildsaltme?utm_source=wildsalt.me" icon={<PayPalIcon />} label="PayPal" />
            <SocialLink href="https://discord.gg/26nJEhq6Yj" icon={<DiscordIcon />} label="Discord" />
            
            <div className="w-px h-3 bg-zinc-800 mx-1"></div>
            
            <SocialLink href="https://wildsalt.me/" icon={<WildSaltIcon />} label="WildSalt.me" />

          </div>

        </footer>
      )}
    </div>
  );
};

// --- SUB COMPONENTS FOR FOOTER ICONS ---

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-zinc-500 hover:text-cyan hover:scale-110 transition-all duration-300 flex items-center justify-center opacity-80 hover:opacity-100"
    title={label}
    aria-label={label}
  >
    {icon}
  </a>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.475 2 2 6.475 2 12a10 10 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.362 1.087 2.937.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.338 1.912-1.288 2.75-1.026 2.75-1.026.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.688 0 3.837-2.337 4.687-4.562 4.937.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.575.688.475A10.005 10.005 0 0022 12c0-5.525-4.475-10-10-10z" /></svg>
);

const InstaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

const BlueskyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565-.131 2.032-2.812 6.121 2.916 12.185c1.832 1.94 4.148 2.112 5.378 1.933-.513.738-.971 1.677-.971 2.721 0 2.714 3.73 3.649 4.677 3.649.947 0 4.677-.935 4.677-3.649 0-1.044-.458-1.983-.97-2.721 1.23.179 3.546.007 5.378-1.933 5.728-6.064 3.047-10.153 2.014-10.62-.66-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.686 12 10.8z"/></svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7.076 21.337l.884-5.6h2.256c3.957 0 5.626-1.94 5.923-4.832.176-1.714-.523-3.08-2.52-3.824L13.5 7.02l.142-.894c.36-2.272-1.228-3.096-3.882-3.096H4.25l-2.6 16.42h2.822l.68-4.293h1.924z" /></svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" /></svg>
);

const WildSaltIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" /></svg>
);
