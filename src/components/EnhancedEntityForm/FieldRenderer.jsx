import React from 'react';
import { Skull } from 'lucide-react';
import RelationListSelect from '../RelationListSelect';
import AutoResizingTextarea from '../AutoResizingTextarea';
import RelationSelect from '../RelationSelect';
import ImagePicker from '../ImagePicker';
import ImageGalleryField from './ImageGalleryField';

// IMPORTATION DU VTT-UI KIT (Standardisation Premium)
import VTTSelect from '../vtt-ui/VTTSelect';
import VTTCounter from '../vtt-ui/VTTCounter';

/**
 * FieldRenderer - Moteur de rendu des champs du formulaire
 * Ce fichier est le pivot qui distribue les données aux bons composants d'interface.
 */
export default function FieldRenderer({ 
  field, 
  formData, 
  handleChange, 
  setFormData, 
  readOnly = false 
}) {
  // Sécurité : Récupération de la valeur actuelle
  const value = formData ? formData[field.name] : '';
  
  // Design system unifié (Teal Premium)
  const inputClass = "w-full bg-[#151725] border border-white/10 rounded-xl px-3 py-1.5 text-[13px] text-white font-normal focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all placeholder-silver/10 outline-none shadow-inner min-h-[38px]";
  const labelClass = "block text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-0.5 ml-1";

  switch (field.type) {
    // --- GESTION DES LISTES DE RELATIONS (Multi-sélection) ---
    case 'relation-list':
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label}</label>
          <RelationListSelect 
             table={field.table} 
             value={value || []} 
             onChange={(newList) => handleChange(field.name, newList)}
             filterBy={field.filterBy}
             filterValue={field.filterValue ? formData[field.filterValue] : undefined}
          />
        </div>
      );

    // --- GESTION DES TEXTES LONGS (Auto-expansion) ---
    case 'textarea':
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <AutoResizingTextarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
            rows={5} 
            readOnly={readOnly}
          />
        </div>
      );

    // --- GESTION DES SÉLECTEURS (Kit VTT-UI) ---
    case 'select':
    case 'static-select':
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <VTTSelect 
            options={field.options || []} 
            value={value} 
            onChange={(val) => handleChange(field.name, val)} 
            placeholder={field.placeholder} 
            required={field.required}
            readOnly={readOnly}
          />
        </div>
      );

    // --- GESTION DES RELATIONS SIMPLES (Dropdown DB) ---
    case 'relation':
      if (!field.table) return null;
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <RelationSelect 
              tableName={field.table} 
              value={value} 
              onChange={(val) => handleChange(field.name, val)} 
              placeholder={field.placeholder} 
              filterBy={field.filterBy} 
              filterValue={field.filterValue ? formData[field.filterValue] : undefined} 
              required={field.required}
          />
        </div>
      );

    // --- GESTION DES IMAGES (Single Picker) ---
    case 'image':
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label}</label>
          <ImagePicker 
            value={value || ''} 
            onChange={(url) => handleChange(field.name, url)} 
            folder={field.bucket || 'images'} 
            label={null} 
          />
        </div>
      );

    // --- GESTION DES GALERIES D'IMAGES (Multi-catégories) ---
    case 'images':
      return (
        <div className="space-y-0">
          <ImageGalleryField 
            field={field} 
            value={value} 
            onChange={(newVal) => handleChange(field.name, newVal)} 
          />
        </div>
      );

    // --- GESTION DES COMPOSANTS PERSONNALISÉS (Injecteur de Ruleset) ---
    case 'custom':
    case 'stats-editor':
      const Component = field.component;
      if (!Component) return null;
      return (
        <div className="space-y-0 relative z-30">
          <label className={`${labelClass} flex justify-between items-center`}>
            <span>{field.label}</span>
            {field.isVirtual && (
              <span className="bg-teal-500/5 text-teal-400/40 px-1 py-0 rounded text-[6px] tracking-[0.2em] font-black border border-teal-500/10">
                SYS
              </span>
            )}
          </label>
          <Component 
            // On passe l'intégralité du contexte pour la réactivité du ruleset
            value={value} 
            onChange={(newVal) => handleChange(field.name, newVal)}
            setFormData={setFormData} 
            onFullChange={setFormData} 
            formData={formData} 
            readOnly={readOnly}
            {...field.props} 
          />
        </div>
      );

    // --- GESTION DES COMPTEURS (Kit VTT-UI) ---
    case 'number':
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <VTTCounter
            value={value}
            onChange={(val) => handleChange(field.name, val)}
            readOnly={readOnly}
          />
        </div>
      );

    // --- CAS PAR DÉFAUT (INPUT TEXT) ---
    default:
      return (
        <div className="space-y-0">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <input
            type={field.type || "text"}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
            required={field.required}
            readOnly={readOnly}
          />
        </div>
      );
  }
}