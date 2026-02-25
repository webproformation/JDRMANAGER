import React from 'react';
import { Info, Hammer, Package, Skull, Clock, Hourglass, Lock } from 'lucide-react';

export default function SidebarInfo({ item, gmFields }) {
  const techFields = [
    { k: 'item_type', l: 'Type', i: Package },
    { k: 'material_type', l: 'Matériau', i: Hammer },
    { k: 'difficulty_dc', l: 'Difficulté', i: Skull },
    { k: 'preparation_time', l: 'Temps', i: Clock },
    { k: 'duration', l: 'Durée', i: Hourglass }
  ];

  return (
    <div className="sticky top-0 space-y-10">
      <div className="bg-[#161926] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
          <Info size={14} className="text-teal-500" /> Fiche Technique
        </h3>
        <div className="space-y-4">
          {techFields.map(tech => {
            const val = item[tech.k];
            return val ? (
              <div key={tech.k} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-silver/40">
                  <tech.i size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{tech.l}</span>
                </div>
                <div className="text-xs font-black text-white">{val}</div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {gmFields.some(f => item[f.name]) && (
        <div className="bg-red-900/10 border border-red-500/20 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="absolute -right-4 -top-4 text-red-500/10 rotate-12"><Lock size={80} /></div>
            <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] border-b border-red-500/20 pb-6 mb-8 flex items-center gap-3 relative z-10">
              <Lock size={14} /> Secrets du Maître
            </h3>
            <div className="space-y-8 relative z-10">
              {gmFields.map(field => {
                const val = item[field.name];
                if (!val) return null;
                return (
                  <div key={field.name}>
                    <span className="text-[9px] text-red-300/60 font-black uppercase block mb-3 tracking-widest">{field.label}</span>
                    <p className="text-sm text-red-100/90 italic bg-black/40 p-6 rounded-2xl border border-red-500/10 leading-relaxed shadow-inner">
                      {val}
                    </p>
                  </div>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}