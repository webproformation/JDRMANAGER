import React from 'react';
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarConfigEditor({ value = {}, onChange, readOnly = false }) {
  const config = value || { months: [], hours_per_day: 24 };

  const updateConfig = (newConfig) => {
    if (readOnly) return;
    onChange({ ...config, ...newConfig });
  };

  const addMonth = () => {
    if (readOnly) return;
    const newMonths = [...(config.months || []), { name: 'Nouveau Mois', days: 30 }];
    updateConfig({ months: newMonths });
  };

  const updateMonth = (index, field, val) => {
    if (readOnly) return;
    const newMonths = [...config.months];
    newMonths[index][field] = field === 'days' ? parseInt(val) || 0 : val;
    updateConfig({ months: newMonths });
  };

  const removeMonth = (index) => {
    if (readOnly) return;
    const newMonths = config.months.filter((_, i) => i !== index);
    updateConfig({ months: newMonths });
  };

  // Classe utilitaire pour supprimer les flèches par défaut des inputs number
  const noArrowsClass = "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className={`bg-[#0f111a] rounded-[2rem] p-8 border ${readOnly ? 'border-white/5' : 'border-cyan-500/20'} shadow-2xl space-y-8 animate-in fade-in duration-500`}>
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <CalendarIcon size={16} /> {readOnly ? "Détails du Calendrier" : "Configuration du Calendrier"}
        </h3>
      </div>

      {/* SECTION : HEURES PAR JOUR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 mb-6">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-silver block mb-2 flex items-center gap-2">
            <Clock size={12}/> Heures par jour
          </label>
          <input 
            type="number" 
            disabled={readOnly}
            value={config.hours_per_day || 24} 
            onChange={(e) => updateConfig({ hours_per_day: parseInt(e.target.value) || 1 })}
            className={`w-full bg-black/40 border border-white/10 rounded-lg p-3 text-[13px] font-normal text-white focus:border-cyan-500/50 outline-none transition-all ${noArrowsClass} ${readOnly ? 'cursor-default opacity-70' : ''}`} 
          />
        </div>
      </div>

      {/* SECTION : LISTE DES MOIS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-silver/40 uppercase tracking-widest">Liste des Mois</h4>
          {!readOnly && (
            <button 
              type="button" 
              onClick={addMonth}
              className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/20 transition-all active:scale-95"
            >
              <Plus size={14} /> Ajouter un mois
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {config.months?.map((month, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
              <span className="text-xs font-black text-silver/30 w-6">{idx + 1}</span>
              
              <input 
                type="text" 
                disabled={readOnly}
                value={month.name} 
                onChange={(e) => updateMonth(idx, 'name', e.target.value)}
                placeholder="Nom du mois" 
                className={`flex-1 bg-[#151725] text-[13px] font-normal text-white border border-white/10 rounded-lg p-2 outline-none focus:border-cyan-500/50 ${readOnly ? 'cursor-default' : ''}`}
              />
              
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  disabled={readOnly}
                  value={month.days} 
                  onChange={(e) => updateMonth(idx, 'days', e.target.value)}
                  placeholder="Jours" 
                  className={`w-20 bg-[#151725] text-center text-[13px] font-normal text-white border border-white/10 rounded-lg p-2 outline-none focus:border-cyan-500/50 ${noArrowsClass} ${readOnly ? 'cursor-default' : ''}`}
                />
                <span className="text-[10px] font-black text-silver/40 uppercase">Jours</span>
              </div>

              {!readOnly && (
                <button 
                  type="button" 
                  onClick={() => removeMonth(idx)} 
                  className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}