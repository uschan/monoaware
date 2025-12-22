
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('DEEPSEEK_API_KEY');
    setApiKey(stored || '');
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('DEEPSEEK_API_KEY', apiKey.trim());
    } else {
      localStorage.removeItem('DEEPSEEK_API_KEY');
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-black border border-cyan/30 p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,240,255,0.1)] relative">
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan"></div>

        <div className="flex justify-between items-start mb-8">
          <div>
             <h2 className="text-xl font-bold text-white font-sans tracking-widest text-glow">SYSTEM_CONFIG</h2>
             <p className="text-[10px] text-cyan/50 font-mono mt-1">AUTHORIZATION REQUIRED</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-cyan font-mono text-xl hover:rotate-90 transition-all">✕</button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <label className="block text-xs text-cyan font-mono uppercase tracking-wider">
                  &gt; ENTER DEEPSEEK API KEY
                </label>
             </div>
             
             <input 
               type="password" 
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               placeholder="sk-..."
               className="w-full p-4 text-sm"
             />
             <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
               Input valid DeepSeek V3 API Key.
               <br/>
               <span className="text-red-500">Note:</span> DeepSeek calls may fail locally due to CORS (Browser security). Check console [F12] if it falls back to Gemini.
             </p>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-zinc-900">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className={`px-6 py-2 font-bold font-mono text-xs uppercase tracking-widest transition-all border ${
                saved 
                  ? 'bg-green-500/20 text-green-400 border-green-500' 
                  : 'bg-cyan/10 text-cyan border-cyan hover:bg-cyan hover:text-black'
              }`}
            >
              {saved ? 'SAVED' : 'CONFIRM'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
