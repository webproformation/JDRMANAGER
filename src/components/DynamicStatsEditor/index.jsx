import React from 'react';
import ProgressField from './Fields/ProgressField';
import NumberField from './Fields/NumberField';
import CheckNumberField from './Fields/CheckNumberField';

export default function DynamicStatsEditor({ ruleset, data = {}, onChange }) {
  if (!ruleset) return <div className="text-silver italic">Aucun système de règles sélectionné.</div>;

  const updateStat = (key, value) => {
    onChange({ ...data, [key]: value });
  };

  const toggleProficiency = (key) => {
    const profKey = `${key}_prof`;
    onChange({ ...data, [profKey]: !data[profKey] });
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

              if (field.type === 'progress') {
                return <ProgressField key={field.key} field={field} value={value} rulesetId={ruleset.id} updateStat={updateStat} />;
              }

              if (field.type === 'number') {
                return <NumberField key={field.key} field={field} value={value} rulesetId={ruleset.id} updateStat={updateStat} />;
              }

              if (field.type === 'check_number') {
                const isProficient = data[`${field.key}_prof`] || false;
                return <CheckNumberField key={field.key} field={field} value={value} isProficient={isProficient} updateStat={updateStat} toggleProficiency={toggleProficiency} />;
              }
              
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}