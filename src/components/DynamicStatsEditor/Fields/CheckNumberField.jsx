import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';

export default function CheckNumberField({ field, value, isProficient, updateStat, toggleProficiency }) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-[#151725]/50 border border-white/5 rounded-xl transition-all group hover:bg-[#151725] hover:border-teal-500/30">
      <div className="flex items-center gap-2">
        <button 
          type="button" 
          onClick={() => toggleProficiency(field.key)} 
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isProficient ? 'bg-teal-600 border-teal-500 text-white shadow-[0_0_8px_rgba(20,184,166,0.3)]' : 'border-white/20 bg-black/20 text-transparent hover:border-white/40'}`}
        >
          <Check size={12} strokeWidth={4} />
        </button>
        <span className={`text-[11px] font-bold leading-tight truncate ${isProficient ? 'text-white' : 'text-silver/60'}`}>{field.label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`font-mono text-base font-black ${isProficient ? 'text-teal-400' : 'text-white/40'}`}>{field.prefix}{value}{field.suffix}</span>
        <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button type="button" onClick={() => updateStat(field.key, Number(value) - 1)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-white rounded-md border border-red-500/10"><Minus size={10}/></button>
          <button type="button" onClick={() => updateStat(field.key, Number(value) + 1)} className="p-1.5 bg-teal-500/10 hover:bg-teal-500 text-white rounded-md border border-teal-500/10"><Plus size={10}/></button>
        </div>
      </div>
    </div>
  );
}