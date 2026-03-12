import React from 'react';
import { Plus, Trash2, Calendar, Clock, Hash } from 'lucide-react';
import VTTCounter from './vtt-ui/VTTCounter';

export default function CalendarConfigEditor({ value, onChange, readOnly = false }) {
  // --- NORMALISATION PRESTIGE 3.0 [cite: 2026-03-12] ---
  // On détecte si la valeur est un tableau (Table Calendars) ou un objet (Table Worlds)
  const isArrayMode = Array.isArray(value);
  
  // Sécurisation absolue : on s'assure d'avoir un tableau de mois, quoi qu'il arrive
  const months = (isArrayMode ? value : value?.months) || [];
  const hoursPerDay = isArrayMode ? 24 : (value?.hours_per_day || 24);
  const daysPerWeek = isArrayMode ? 7 : (value?.days_per_week || 7);

  const updateConfig = (key, val) => {
    if (isArrayMode) {
      // En mode tableau, on ne peut mettre à jour que les mois ici
      if (key === 'months') onChange(val);
    } else {
      // En mode objet, on met à jour la propriété demandée
      onChange({ ...(value || {}), [key]: val });
    }
  };

  const updateMonth = (index, field, val) => {
    const newMonths = [...months];
    newMonths[index] = { ...newMonths[index], [field]: val };
    updateConfig('months', newMonths);
  };

  const addMonth = () => {
    updateConfig('months', [...months, { name: '', days: 28 }]);
  };

  const removeMonth = (index) => {
    updateConfig('months', months.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* --- CONFIGURATION GLOBALE --- */}
      {!isArrayMode && (
        <div className="grid grid-cols-2 gap-4 bg-black/20 p-3.5 rounded-2xl border border-white/5 shadow-inner">
          <div className="space-y-1.5">
            <label className="text-[8px] font-black uppercase text-teal-500/50 flex items-center gap-1.5 tracking-[0.2em]">
              <Clock size={10} className="text-teal-500" /> Heures / Jour
            </label>
            <div className="scale-90 origin-left">
              <VTTCounter 
                value={hoursPerDay} 
                onChange={(v) => updateConfig('hours_per_day', v)} 
                readOnly={readOnly}
                min={1}
                max={100}
                size="small"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[8px] font-black uppercase text-teal-500/50 flex items-center gap-1.5 tracking-[0.2em]">
              <Calendar size={10} className="text-teal-500" /> Jours / Semaine
            </label>
            <div className="scale-90 origin-left">
              <VTTCounter 
                value={daysPerWeek} 
                onChange={(v) => updateConfig('days_per_week', v)} 
                readOnly={readOnly}
                min={1}
                max={20}
                size="small"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- SÉQUENCE DES MOIS --- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Hash size={12} className="text-white/20" />
            <h4 className="text-[8px] font-black uppercase tracking-[0.25em] text-white/40">Séquence des Mois</h4>
          </div>
          {!readOnly && (
            <button 
              onClick={addMonth}
              type="button"
              className="flex items-center gap-1 px-2 py-1 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 hover:bg-teal-500/20 transition-all text-[7px] font-black uppercase tracking-widest"
            >
              <Plus size={10} /> Ajouter
            </button>
          )}
        </div>

        {/* RESTRUCTURATION VERTICALE : Évite les débordements de flèches [cite: 2026-03-12] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {months.map((month, idx) => (
            <div 
              key={idx} 
              className="flex flex-col gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 group hover:border-teal-500/30 transition-all shadow-md overflow-hidden relative"
            >
              {/* Ligne 1 : Index et Nom du Mois */}
              <div className="flex items-center gap-2 w-full">
                <div className="w-5 h-5 flex items-center justify-center bg-white/5 rounded text-[7px] font-black text-white/20 shrink-0 border border-white/5">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                
                <input 
                  type="text"
                  value={month.name || ''}
                  onChange={(e) => updateMonth(idx, 'name', e.target.value)}
                  placeholder="Nom du mois..."
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-[9px] text-white font-bold placeholder:text-white/5 focus:text-teal-400 transition-colors"
                  readOnly={readOnly}
                />

                {!readOnly && (
                  <button 
                    onClick={() => removeMonth(idx)}
                    type="button"
                    className="p-1 text-white/10 hover:text-red-400 transition-colors bg-white/5 rounded hover:bg-red-400/10 shrink-0"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
              
              {/* Ligne 2 : Capacité en Jours (Label à gauche, Compteur à droite) */}
              <div className="flex items-center justify-between border-t border-white/5 pt-1.5 mt-0.5">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter shrink-0">Nb Jours</span>
                <div className="scale-[0.65] transform-gpu origin-right -mr-4">
                  <VTTCounter 
                    value={month.days || 28} 
                    onChange={(v) => updateMonth(idx, 'days', v)} 
                    readOnly={readOnly}
                    min={1}
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {months.length === 0 && (
          <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl opacity-20">
            <Calendar size={20} className="mb-2" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Calendrier vide</span>
          </div>
        )}
      </div>
    </div>
  );
}