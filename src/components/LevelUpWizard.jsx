// src/components/LevelUpWizard.jsx
import React, { useState } from 'react';
import { ArrowUpCircle, ArrowRight, Heart, CheckCircle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLevelUpBenefits } from '../utils/rulesEngine';

export default function LevelUpWizard({ character, onClose, onSuccess }) {
  const [saving, setSaving] = useState(false);
  const newLevel = (character.level || 1) + 1;
  const hpRoll = Math.floor(Math.random() * 8) + 1; 
  const conMod = Math.floor(((character.data?.con || 10) - 10) / 2);
  const newHpMax = (character.data?.hp_max || character.data?.hp || 10) + hpRoll + conMod;

  const className = character.class_id ? character.class_id : 'Guerrier'; 
  const benefits = getLevelUpBenefits(className, newLevel, character.ruleset_id);

  const confirmLevelUp = async () => {
    setSaving(true);
    const updatedData = { ...character.data, hp: newHpMax, hp_max: newHpMax };
    
    await supabase.from('characters').update({ 
      level: newLevel, 
      data: updatedData 
    }).eq('id', character.id);
    
    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#0f111a] border border-amber-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in-95 overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/20 to-transparent" />
        <div className="absolute -top-24 -right-24 text-amber-500/10 rotate-12"><Star size={250} /></div>

        <div className="relative p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
             <ArrowUpCircle size={40} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">ASCENSION</h2>
          <p className="text-amber-500 font-bold uppercase tracking-[0.3em] mb-10 text-xs">
            {character.name} atteint le Niveau {newLevel}
          </p>

          <div className="w-full bg-[#151725] border border-white/5 rounded-[2rem] p-8 text-left space-y-6 shadow-inner">
             <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl"><Heart size={24}/></div>
                <div>
                   <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest">Points de Vie Maximum</h4>
                   <div className="text-2xl font-black text-white flex items-center gap-3 mt-1">
                      Anciens: <span className="text-silver">{character.data?.hp || 10}</span> 
                      <ArrowRight size={16} className="text-amber-500" /> 
                      Nouveaux: <span className="text-green-400">{newHpMax}</span>
                   </div>
                   <p className="text-[10px] text-silver/40 mt-1">Jet de dés ({hpRoll}) + Mod. Constitution ({conMod >= 0 ? '+'+conMod : conMod})</p>
                </div>
             </div>

             <div>
               <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest mb-4">Nouvelles Capacités Acquises</h4>
               <ul className="space-y-3">
                 {benefits.map((ben, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-silver font-medium bg-black/40 p-3 rounded-xl border border-white/5">
                     <CheckCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                     {ben}
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          <div className="flex gap-4 mt-10 w-full">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-silver rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              Remettre à plus tard
            </button>
            <button disabled={saving} onClick={confirmLevelUp} className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Incantation...' : 'Confirmer l\'Ascension'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}