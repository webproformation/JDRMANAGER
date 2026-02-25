import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { getDerivedValue } from '../../../utils/rulesEngine';

export default function NumberField({ field, value, rulesetId, updateStat }) {
  const Icon = field.icon;
  const derivedVal = field.derived ? getDerivedValue(rulesetId, field.key, value) : null;

  return (
    <div className="bg-[#151725] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-teal-500/30 transition-all shadow-xl min-w-0">
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