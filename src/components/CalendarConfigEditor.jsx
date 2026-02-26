import React from 'react';
import { Plus, Trash2, Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarConfigEditor({ value = {}, onChange }) {
  const config = value || { months: [], hours_per_day: 24 };

  const updateConfig = (newConfig) => {
    onChange({ ...config, ...newConfig });
  };

  const addMonth = () => {
    const newMonths = [...(config.months || []), { name: 'Nouveau Mois', days: 30 }];
    updateConfig({ months: newMonths });
  };

  const updateMonth = (index, field, val) => {
    const newMonths = [...config.months];
    newMonths[index][field] = field === 'days' ? parseInt(val) || 0 : val;
    updateConfig({ months: newMonths });
  };

  const removeMonth = (index) => {
    const newMonths = config.months.filter((_, i) => i !== index);
    updateConfig({ months: newMonths });
  };

  return (
    <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-cyan-500/20 shadow-2xl space-y-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <CalendarIcon size={16} /> Configuration du Calendrier
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 mb-6">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-silver block mb-2 flex items-center gap-2">
            <Clock size={12}/> Heures par jour
          </label>
          <input 
            type="number" 
            value={config.hours_per_day || 24} 
            onChange={(e) => updateConfig({ hours_per_day: parseInt(e.target.value) || 1 })}
            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cyan-500/50 outline-none" 
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-silver/40 uppercase tracking-widest">Liste des Mois</h4>
          <button 
            type="button" 
            onClick={addMonth}
            className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-500/20 transition-all"
          >
            <Plus size={14} /> Ajouter un mois
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {config.months?.map((month, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-xs font-black text-silver/30 w-6">{idx + 1}</span>
              <input 
                type="text" 
                value={month.name} 
                onChange={(e) => updateMonth(idx, 'name', e.target.value)}
                placeholder="Nom du mois" 
                className="flex-1 bg-[#151725] text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-cyan-500/50 font-bold"
              />
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={month.days} 
                  onChange={(e) => updateMonth(idx, 'days', e.target.value)}
                  placeholder="Jours" 
                  className="w-20 bg-[#151725] text-center text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-cyan-500/50"
                />
                <span className="text-[10px] font-black text-silver/40 uppercase">Jours</span>
              </div>
              <button 
                type="button" 
                onClick={() => removeMonth(idx)} 
                className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}