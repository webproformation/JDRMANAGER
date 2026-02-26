// src/components/RulesetDynamicFields.jsx
import React from 'react';
import { DEFAULT_RULESETS } from '../data/rulesets';
import { Zap } from 'lucide-react';

export default function RulesetDynamicFields({ rulesetId, entityType, formData, onChange }) {
  const ruleset = DEFAULT_RULESETS[rulesetId];
  if (!ruleset) return null;

  // On récupère la liste des champs selon l'entité (worldFields, deityFields, etc.)
  const fields = ruleset[`${entityType}Fields`] || [];
  if (fields.length === 0) return null;

  const updateData = (fieldName, value) => {
    const currentData = formData.data || {};
    onChange({
      ...formData,
      data: { ...currentData, [fieldName]: value }
    });
  };

  return (
    <div className="mt-6 p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-8 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-4 border-b border-white/5 pb-5">
        <div className={`p-2 rounded-xl bg-white/5 ${ruleset.color}`}>
          <Zap size={20} />
        </div>
        <div>
          <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${ruleset.color}`}>
            Spécificités : {ruleset.name}
          </h4>
          <p className="text-[10px] text-silver/40 font-bold uppercase tracking-widest mt-1">
            Propriétés liées au système de règles
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fields.map(field => (
          <div key={field.name}>
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-silver/60 block mb-3 ml-1">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                value={formData.data?.[field.name] || ''}
                onChange={(e) => updateData(field.name, e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-white/30 outline-none transition-all cursor-pointer hover:bg-black/60"
              >
                <option value="">-- Sélectionner --</option>
                {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData.data?.[field.name] || ''}
                onChange={(e) => updateData(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-white/30 outline-none transition-all placeholder-silver/20 hover:bg-black/60"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}