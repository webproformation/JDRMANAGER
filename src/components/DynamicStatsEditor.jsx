import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { getDerivedValue } from '../utils/rulesEngine';

const THEMES = {
  purple: { container: 'bg-purple-500/10 border-purple-500/20', bar: 'bg-purple-500', text: 'text-white' },
  red: { container: 'bg-red-500/10 border-red-500/20', bar: 'bg-red-500', text: 'text-white' },
  yellow: { container: 'bg-yellow-500/10 border-yellow-500/20', bar: 'bg-yellow-500', text: 'text-white' },
  blue: { container: 'bg-blue-500/10 border-blue-500/20', bar: 'bg-blue-500', text: 'text-white' },
  default: { container: 'bg-teal-500/10 border-teal-500/20', bar: 'bg-teal-500', text: 'text-white' }
};

export default function DynamicStatsEditor({ ruleset, data = {}, onChange }) {
  if (!ruleset) return <div className="text-silver italic">Aucun système de règles sélectionné.</div>;

  const updateStat = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-12">
      {ruleset.groups.map(group => (
        <div key={group.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
            {group.label}
          </h3>

          <div className={`
            ${group.layout === 'grid-4' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' : ''}
            ${group.layout === 'grid-3' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
            ${group.layout === 'grid-2' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}
            ${group.layout === 'grid-1' ? 'space-y-6' : ''}
            ${group.layout === 'list' ? 'space-y-3' : ''}
          `}>
            {group.fields.map(field => {
              const value = data[field.key] || 0;
              const Icon = field.icon;
              const derivedVal = field.derived ? getDerivedValue(ruleset.id, field.key, value) : null;

              // --- RENDU PROGRESS (Barres de vie / Santé) ---
              if (field.type === 'progress') {
                const max = field.max || 100;
                const percentage = Math.min(100, Math.max(0, (value / max) * 100));
                const theme = THEMES[field.theme] || THEMES.default;
                const derivedProgress = field.derived ? getDerivedValue(ruleset.id, field.key, value) : null;

                return (
                  <div key={field.key} className={`p-4 rounded-2xl border ${theme.container} shadow-lg backdrop-blur-sm flex flex-col justify-between h-full`}>
                    <div className="flex justify-between items-start mb-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-white/70">{field.label}</label>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-white">{value}<span className="text-[10px] opacity-40">/{max}</span></span>
                        {derivedProgress && <div className="text-[9px] text-teal-400/50 font-mono">Seuils: {derivedProgress}</div>}
                      </div>
                    </div>
                    <div className="relative h-2 bg-black/40 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`absolute inset-y-0 left-0 transition-all duration-500 shadow-[0_0_8px_rgba(0,0,0,0.5)] ${theme.bar}`} 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <input 
                      type="range" 
                      min="0" max={max} 
                      value={value} 
                      onChange={(e) => updateStat(field.key, parseInt(e.target.value))} 
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none" 
                    />
                  </div>
                );
              }

              // --- RENDU NUMBER (Boutons Plus/Moins côte à côte) ---
              if (field.type === 'number') {
                return (
                  <div key={field.key} className="bg-[#151725] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-teal-500/30 transition-all shadow-xl min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {Icon && <Icon size={18} className="text-cyan-400 shrink-0" />}
                      <div className="min-w-0">
                        <span className="block text-[9px] text-silver/50 uppercase tracking-tighter truncate mb-0.5">{field.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-black text-white">{field.prefix}{value}</span>
                          {derivedVal && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                              {derivedVal}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-200 shrink-0">
                      <button type="button" onClick={() => updateStat(field.key, Number(value) - 1)} className="p-2 bg-red-500/10 hover:bg-red-500 text-white rounded-lg transition-colors border border-red-500/20"><Minus size={12}/></button>
                      <button type="button" onClick={() => updateStat(field.key, Number(value) + 1)} className="p-2 bg-teal-500/10 hover:bg-teal-500 text-white rounded-lg transition-colors border border-teal-500/20"><Plus size={12}/></button>
                    </div>
                  </div>
                );
              }

              // --- RENDU CHECK_NUMBER (Compétences - Layout Grille 4 colonnes) ---
              if (field.type === 'check_number') {
                const isProficient = data[`${field.key}_prof`] || false;
                return (
                  <div key={field.key} className="flex flex-col gap-2 p-3 bg-[#151725]/50 border border-white/5 rounded-xl transition-all group hover:bg-[#151725] hover:border-teal-500/30">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => onChange({ ...data, [`${field.key}_prof`]: !isProficient })} 
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
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}