
import React, { useEffect, useState } from 'react';
import { HistoryItem, HistoryService } from '../services/historyService';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory(HistoryService.getHistory());
      setSelectedItem(null);
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = HistoryService.deleteItem(id);
    setHistory(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleClear = () => {
    if (confirm("Clear all archived data? This cannot be undone.")) {
      HistoryService.clearHistory();
      setHistory([]);
      setSelectedItem(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200 p-4" onClick={onClose}>
      <div 
        className="bg-[#080808] border border-zinc-800 w-full max-w-5xl h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#111]">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
             <h2 className="text-xl font-mono font-bold text-zinc-200 uppercase tracking-widest">
               DATA_ARCHIVE
             </h2>
             <span className="text-[10px] text-zinc-500 font-mono hidden md:inline-block px-2 border-l border-zinc-700">
               STORAGE_USAGE: {history.length}/50 SLOTS
             </span>
          </div>
          <div className="flex gap-4">
            {history.length > 0 && (
              <button 
                onClick={handleClear}
                className="text-[10px] text-red-500 hover:text-red-400 font-mono uppercase tracking-widest border border-red-900/30 px-3 py-1 hover:bg-red-950/20 transition-colors"
              >
                Format Drive
              </button>
            )}
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* List Sidebar */}
          <div className="w-full md:w-1/3 border-r border-zinc-800 overflow-y-auto bg-black/50 custom-scrollbar">
            {history.length === 0 ? (
               <div className="p-8 text-center text-zinc-600 font-mono text-xs">
                 NO LOGS FOUND.<br/>RUN SIMULATIONS TO POPULATE.
               </div>
            ) : (
               <div className="divide-y divide-zinc-800/50">
                 {history.map(item => (
                   <div 
                     key={item.id}
                     onClick={() => setSelectedItem(item)}
                     className={`p-4 cursor-pointer hover:bg-zinc-900 transition-colors group relative ${selectedItem?.id === item.id ? 'bg-zinc-900 border-l-2 border-amber-500' : 'border-l-2 border-transparent'}`}
                   >
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-amber-500/80 uppercase">{item.appId.replace('_', ' ')}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                     </div>
                     <p className="text-xs text-zinc-300 font-mono truncate opacity-80 group-hover:opacity-100">
                       {item.inputSummary || "No Input Data"}
                     </p>
                     
                     <button 
                       onClick={(e) => handleDelete(item.id, e)}
                       className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-500 p-2 transition-all"
                       title="Delete Log"
                     >
                       ×
                     </button>
                   </div>
                 ))}
               </div>
            )}
          </div>

          {/* Detail View */}
          <div className="hidden md:flex md:w-2/3 bg-[#0c0c0c] flex-col relative">
             {selectedItem ? (
               <>
                 <div className="absolute top-0 right-0 p-4 z-10">
                   <span className="text-[9px] text-zinc-600 font-mono uppercase border border-zinc-800 px-2 py-1">READ_ONLY_MODE</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="mb-6 border-b border-zinc-800 pb-4">
                       <h3 className="text-amber-500 font-mono text-sm uppercase mb-2">Input Query</h3>
                       <p className="text-zinc-300 font-serif text-lg italic">"{selectedItem.inputSummary}"</p>
                    </div>
                    
                    <div>
                       <h3 className="text-zinc-500 font-mono text-xs uppercase mb-4 flex items-center gap-2">
                         <span>Processed Output</span>
                         <span className="h-px flex-1 bg-zinc-800"></span>
                       </h3>
                       
                       {/* JSON Viewer Style */}
                       <div className="font-mono text-xs text-zinc-400 bg-black border border-zinc-800 p-4 rounded-sm overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(selectedItem.result, null, 2)}
                       </div>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 space-y-4">
                  <div className="text-6xl opacity-20">📂</div>
                  <p className="font-mono text-xs uppercase tracking-widest">Select a log to inspect</p>
               </div>
             )}
             
             {/* Decorative Scanline */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
