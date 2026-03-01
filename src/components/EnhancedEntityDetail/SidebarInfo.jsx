import React from 'react';
import { Info, Hammer, Package, Skull, Clock, Hourglass, Lock, Shield, Zap, Footprints, Heart } from 'lucide-react';

export default function SidebarInfo({ item, gmFields }) {
  const isCharacter = !!item.level;

  const techFields = [
    { k: 'item_type', l: 'Type', i: Package },
    { k: 'material_type', l: 'Matériau', i: Hammer },
    { k: 'difficulty_dc', l: 'Difficulté', i: Skull },
    { k: 'preparation_time', l: 'Temps', i: Clock },
    { k: 'duration', l: 'Durée', i: Hourglass }
  ];

  return (
    <div className="sticky top-0 space-y-8">
      {/* BLOC TACTIQUE D&D 5.0 */}
      {isCharacter && (
        <div className="bg-gradient-to-br from-[#1a1d2d] to-[#161926] border border-teal-500/20 rounded-[2rem] p-6 shadow-2xl">
          <h3 className="text-teal-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 mb-6 border-b border-teal-500/10 pb-4">
            <Zap size={14} /> État de Combat
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <Shield className="mx-auto mb-2 text-blue-400" size={20} />
              <div className="text-[9px] text-silver/60 uppercase font-bold">CA</div>
              <div className="text-2xl font-black text-white">{item.armor_class || 10}</div>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <Zap className="mx-auto mb-2 text-amber-400" size={20} />
              <div className="text-[9px] text-silver/60 uppercase font-bold">Initiative</div>
              <div className="text-2xl font-black text-white">+{item.initiative || 0}</div>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <Footprints className="mx-auto mb-2 text-emerald-400" size={20} />
              <div className="text-[9px] text-silver/60 uppercase font-bold">Vitesse</div>
              <div className="text-xl font-black text-white">{item.speed || '9m'}</div>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
              <Heart className="mx-auto mb-2 text-red-500" size={20} />
              <div className="text-[9px] text-silver/60 uppercase font-bold">PV Max</div>
              <div className="text-xl font-black text-white">{item.hit_points || 10}</div>
            </div>
          </div>
        </div>
      )}

      {/* FICHE TECHNIQUE GÉNÉRIQUE */}
      <div className="bg-[#161926] border border-white/5 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
          <Info size={14} className="text-teal-500" /> Informations
        </h3>
        <div className="space-y-4">
          {techFields.map(tech => {
            const val = item[tech.k];
            const Icon = tech.i;
            return val ? (
              <div key={tech.k} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-teal-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-silver/40 group-hover:text-teal-400 transition-colors" />
                  <span className="text-[10px] text-silver/60 font-bold uppercase tracking-tighter">{tech.l}</span>
                </div>
                <div className="text-xs font-black text-white">{val}</div>
              </div>
            ) : null;
          })}
          {/* Ajout manuel pour les personnages : Race et Classe */}
          {isCharacter && (
            <>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-silver/60 font-bold uppercase">Système</span>
                <span className="text-xs font-black text-teal-400 uppercase">{item.ruleset_id || 'D&D 5.0'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SECRETS MJ */}
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
                    <p className="text-sm text-red-100/80 leading-relaxed italic">{val}</p>
                  </div>
                );
              })}
            </div>
        </div>
      )}
    </div>
  );
}