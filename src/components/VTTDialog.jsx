import React, { useState, useEffect } from 'react';
import { X, AlertCircle, HelpCircle, Info } from 'lucide-react';

export default function VTTDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', 
  placeholder = 'Saisir ici...',
  defaultValue = ''
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setInputValue(defaultValue);
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') onConfirm(inputValue);
    else onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#08090f]/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#242643] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent" />

        <div className="p-8">
          <div className="flex items-start gap-5">
            <div className={`p-3 rounded-2xl bg-opacity-10 shrink-0 ${
              type === 'confirm' ? 'bg-[#2DD4BF] text-[#2DD4BF]' : 
              type === 'prompt' ? 'bg-blue-400 text-blue-400' : 'bg-amber-400 text-amber-400'
            }`}>
              {type === 'confirm' ? <HelpCircle size={24} /> : 
               type === 'prompt' ? <Info size={24} /> : <AlertCircle size={24} />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{title}</h3>
              <p className="text-silver/60 text-sm mt-3 leading-relaxed">{message}</p>
            </div>
            <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {type === 'prompt' && (
            <div className="mt-6">
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/30 border border-white/5 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none text-sm font-bold shadow-inner placeholder-white/10"
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              />
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {type !== 'alert' && (
              <button onClick={onClose} className="flex-1 px-4 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest text-white/30 hover:bg-white/5 transition-all">
                Annuler
              </button>
            )}
            <button 
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg border ${
                type === 'confirm' && (title.toLowerCase().includes('supprim') || title.toLowerCase().includes('effacer'))
                ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 shadow-red-500/5' 
                : 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20 shadow-[#2DD4BF]/5'
              }`}
            >
              {type === 'alert' ? 'Compris' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}