import React, { useState } from 'react';
import { Clock, Calendar, ChevronRight, ChevronsRight, Loader2, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';

export default function WorldClockControl({ world, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!world) return null;

  // Récupération de la config ou calendrier universel par défaut (12 mois de 30 jours)
  const config = world.calendar_config || {};
  const hoursPerDay = config.hours_per_day || 24;
  const months = (config.months && config.months.length > 0) 
    ? config.months 
    : Array.from({ length: 12 }, (_, i) => ({ name: `Mois ${i + 1}`, days: 30 }));

  // Récupération du nom du système pour l'affichage
  const currentRuleset = DEFAULT_RULESETS[world.ruleset_id] || DEFAULT_RULESETS['dnd5'];

  const advanceTime = async (unit, amount) => {
    if (isUpdating) return;
    setIsUpdating(true);

    let { current_year, current_month, current_day, current_hour } = world;

    // 1. Incrémentation initiale
    if (unit === 'hour') current_hour += amount;
    if (unit === 'day') current_day += amount;
    if (unit === 'month') current_month += amount;

    // 2. Logique de débordement en cascade
    
    // Heures vers Jours
    while (current_hour >= hoursPerDay) {
      current_hour -= hoursPerDay;
      current_day += 1;
    }

    // Jours vers Mois (Basé sur la durée réelle de chaque mois traversé)
    let daysInCurrentMonth = months[current_month - 1]?.days || 30;
    while (current_day > daysInCurrentMonth) {
      current_day -= daysInCurrentMonth;
      current_month += 1;
      
      // Mois vers Année
      if (current_month > months.length) {
        current_month = 1;
        current_year += 1;
      }
      
      // Mise à jour du référentiel pour le prochain cycle de la boucle
      daysInCurrentMonth = months[current_month - 1]?.days || 30;
    }

    // Sécurité finale pour le wrap-around des mois seuls
    if (current_month > months.length) {
      current_month = 1;
      current_year += 1;
    }

    try {
      const { error } = await supabase
        .from('worlds')
        .update({ 
          current_year, 
          current_month, 
          current_day, 
          current_hour,
          updated_at: new Date().toISOString()
        })
        .eq('id', world.id);

      if (!error && onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'horloge:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentMonthName = months[world.current_month - 1]?.name || `Mois ${world.current_month}`;

  return (
    <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-cyan-500/20 shadow-2xl space-y-6 relative overflow-hidden">
      {/* INDICATEUR DE CHARGEMENT */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
          <Loader2 className="text-cyan-400 animate-spin" size={32} />
        </div>
      )}

      {/* HEADER DE L'HORLOGE */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} /> Horloge Mondiale
          </h3>
          <span className="text-[9px] font-bold text-silver/40 uppercase mt-1">{world.name}</span>
        </div>
        
        {/* BADGE SYSTEME (Cohérence Moteur Ultime) */}
        <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full">
          <Zap size={10} className="text-teal-400" />
          <span className="text-[9px] font-black text-teal-400 uppercase tracking-tighter">
            {currentRuleset.name}
          </span>
        </div>
      </div>

      {/* AFFICHAGE DU TEMPS ACTUEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group hover:border-cyan-500/30 transition-colors">
          <div className="text-[9px] font-black text-silver/30 uppercase mb-1 group-hover:text-cyan-400/50">Année</div>
          <div className="text-xl font-black text-white tracking-tighter">{world.current_year}</div>
        </div>
        
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group hover:border-cyan-500/30 transition-colors">
          <div className="text-[9px] font-black text-silver/30 uppercase mb-1 group-hover:text-cyan-400/50">Mois</div>
          <div className="text-sm font-black text-white truncate px-1 uppercase">{currentMonthName}</div>
        </div>
        
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group hover:border-cyan-500/30 transition-colors">
          <div className="text-[9px] font-black text-silver/30 uppercase mb-1 group-hover:text-cyan-400/50">Jour</div>
          <div className="text-xl font-black text-white">{world.current_day}</div>
        </div>
        
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group hover:border-cyan-500/30 transition-colors">
          <div className="text-[9px] font-black text-silver/30 uppercase mb-1 group-hover:text-cyan-400/50">Heure</div>
          <div className="text-xl font-black text-cyan-400">{world.current_hour}h</div>
        </div>
      </div>

      {/* BOUTONS D'AVANCEMENT RAPIDE */}
      <div className="flex flex-wrap gap-2 pt-4">
        <button 
          onClick={() => advanceTime('hour', 1)} 
          disabled={isUpdating}
          className="flex-1 bg-white/5 hover:bg-cyan-500/20 text-silver hover:text-cyan-300 p-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border border-transparent hover:border-cyan-500/20 disabled:opacity-50"
        >
          +1 Heure <ChevronRight size={14}/>
        </button>
        
        <button 
          onClick={() => advanceTime('day', 1)} 
          disabled={isUpdating}
          className="flex-1 bg-white/5 hover:bg-cyan-500/20 text-silver hover:text-cyan-300 p-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border border-transparent hover:border-cyan-500/20 disabled:opacity-50"
        >
          +1 Jour <ChevronsRight size={14}/>
        </button>
        
        <button 
          onClick={() => advanceTime('month', 1)} 
          disabled={isUpdating}
          className="flex-1 bg-white/5 hover:bg-cyan-500/20 text-silver hover:text-cyan-300 p-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 border border-transparent hover:border-cyan-500/20 disabled:opacity-50"
        >
          +1 Mois <Calendar size={14}/>
        </button>
      </div>
    </div>
  );
}