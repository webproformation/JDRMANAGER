import React from 'react';
// Import direct depuis le dossier de définitions
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index';
import { Zap } from 'lucide-react';
import VTTSelect from './vtt-ui/VTTSelect';
import VTTCounter from './vtt-ui/VTTCounter';

/**
 * RulesetDynamicFields - Injecteur de champs spécifiques au système de jeu
 * Blindé contre les valeurs 'null' provenant de la base de données.
 */
export default function RulesetDynamicFields({ 
  rulesetId, 
  entityType, 
  formData, 
  onChange, 
  readOnly, 
  setFormData 
}) {
  
  // --- PROTECTION ANTI-NULL ---
  // On vérifie rulesetId, puis formData.ruleset_id. 
  // Si c'est null, undefined ou vide, on FORCE 'dnd5'.
  const activeId = rulesetId || formData?.ruleset_id;
  const currentId = (activeId && activeId !== 'null') ? String(activeId) : 'dnd5';

  const ruleset = DEFAULT_RULESETS[currentId] || DEFAULT_RULESETS['dnd5'];
  
  if (!ruleset) return null;

  // Récupération des champs selon le type (ex: geoFields)
  const fieldKey = `${entityType}Fields`;
  const fields = ruleset[fieldKey] || [];
  
  // Si aucun champ n'est trouvé, on sort
  if (fields.length === 0) return null;

  /**
   * Met à jour la colonne JSONB 'data' de l'entité
   */
  const updateData = (fieldName, value) => {
    if (readOnly) return;
    
    if (setFormData) {
      setFormData(prev => ({
        ...prev,
        data: { 
          ...(prev.data || {}), 
          [fieldName]: value 
        }
      }));
    } else if (onChange) {
      const currentData = formData?.data || {};
      const newData = { ...currentData, [fieldName]: value };
      onChange('data', newData);
    }
  };

  const labelClass = "block text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-0.5 ml-1";

  return (
    <div 
      className="mt-4 p-5 bg-white/5 rounded-[1.5rem] border border-white/5 space-y-5" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* En-tête du bloc système */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
        <div className={`p-1.5 rounded-lg bg-white/5 ${ruleset.color}`}>
          <Zap size={14} />
        </div>
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${ruleset.color}`}>
          Spécificités : {ruleset.name}
        </h4>
      </div>
      
      {/* Rendu des champs dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(field => {
          const currentValue = formData?.data?.[field.name] || '';
          
          return (
            <div key={field.name}>
              <label className={labelClass}>{field.label}</label>
              
              {field.type === 'select' ? (
                <VTTSelect
                  value={currentValue}
                  options={field.options || []}
                  onChange={(val) => updateData(field.name, val)}
                  readOnly={readOnly}
                  placeholder={`Choisir...`}
                  zIndex="z-[80]"
                />
              ) : field.type === 'number' ? (
                <VTTCounter
                  value={currentValue}
                  onChange={(val) => updateData(field.name, val)}
                  readOnly={readOnly}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  readOnly={readOnly}
                  value={currentValue}
                  onChange={(e) => updateData(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-[#151725] border border-white/10 rounded-xl px-3 py-1.5 text-[13px] text-white font-normal focus:border-teal-500/50 outline-none min-h-[38px] shadow-inner"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}