import React from 'react';
import { getDerivedValue } from '../../../utils/rulesEngine';

const THEMES = {
  purple: { container: 'bg-purple-500/10 border-purple-500/20', bar: 'bg-purple-500', text: 'text-white' },
  red: { container: 'bg-red-500/10 border-red-500/20', bar: 'bg-red-500', text: 'text-white' },
  yellow: { container: 'bg-yellow-500/10 border-yellow-500/20', bar: 'bg-yellow-500', text: 'text-white' },
  blue: { container: 'bg-blue-500/10 border-blue-500/20', bar: 'bg-blue-500', text: 'text-white' },
  default: { container: 'bg-teal-500/10 border-teal-500/20', bar: 'bg-teal-500', text: 'text-white' }
};

export default function ProgressField({ field, value, rulesetId, updateStat }) {
  const max = field.max || 100;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const theme = THEMES[field.theme] || THEMES.default;
  const derivedProgress = field.derived ? getDerivedValue(rulesetId, field.key, value) : null;

  return (
    <div className={`p-4 rounded-2xl border ${theme.container} shadow-lg backdrop-blur-sm flex flex-col justify-between h-full`}>
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