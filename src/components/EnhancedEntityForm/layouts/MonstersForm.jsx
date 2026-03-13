import React from 'react';
import { ChevronUp, ChevronDown, Skull, Swords, Target, Heart, Shield, Activity, MapPin, Zap, Utensils, Users } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector';

/**
 * MonstersForm - Standard PRESTIGE 4.2 INTÉGRAL
 * Transformation des champs texte en Champs Intelligents (Smart Fields).
 * Unité visuelle Teal et structure chirurgicale.
 */
export default function MonstersForm({ 
  formData, 
  activeTab, 
  handleChange, 
  setFormData, 
  config, 
  contentRef, 
  readOnly = false, 
  onOpenPicker 
}) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  /**
   * Rendu avec Injection de Suggestions (Standard Prestige)
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- INTERCEPTION : IMAGE PRINCIPALE ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/40 ml-1">Archive Visuelle</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[400px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <img src={formData.image_url} alt="Spécimen" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <Skull size={48} className="mb-4 opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Capturer une Manifestation</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- INTERCEPTION : PRÉSENCE MULTIVERSELLE ---
    if (name === 'world_id') {
      return (
        <div key={name} className={span}>
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/40 ml-1 mb-2 block">Territoires Multiversels</label>
           <MultiversalRelationSelector 
              formData={formData} 
              setFormData={setFormData}
              entityType="monsters" 
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- INJECTION DES SMART FIELDS (Suggestions + Autre) ---
    let enhancedField = { ...field };

    // 1. Classification
    if (name === 'type') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Aberration', 'Bête', 'Céleste', 'Construct', 'Dragon', 'Élémentaire', 'Fée', 'Fiélon', 'Géant', 'Humanoïde', 'Monstruosité', 'Plante', 'Mort-vivant', 'Vase'];
    }

    if (name === 'size') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Très Petit (TP)', 'Petit (P)', 'Moyen (M)', 'Grand (G)', 'Très Grand (TG)', 'Gigantesque (Gig)'];
    }

    if (name === 'alignment') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais', 'Non-aligné', 'Tout alignement'];
    }

    // 2. Écologie (Nouveau : Ajout des suggestions intelligentes)
    if (name === 'habitat_description') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Forêts Millénaires', 'Montagnes Escarpées', 'Grottes Souterraines', 'Plaines Sauvages', 'Marécages Putrides', 'Déserts Arides', 'Océans Profonds', 'Abysses', 'Plan des Ombres', 'Ruines Antiques', 'Milieux Urbains'];
    }

    if (name === 'diet') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Carnivore strict', 'Herbivore', 'Omnivore', 'Charognard', 'Hématophage (Sang)', 'Magivore (Magie)', 'Lithophage (Minéraux)', 'Âmivore (Âmes)'];
    }

    if (name === 'social_structure') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Solitaire', 'Paire', 'Petit groupe (3-6)', 'Meute (7-20)', 'Colonie', 'Ruche (Esprit collectif)', 'Société hiérarchisée', 'Horde sauvage'];
    }

    return (
      <div key={field.name} className={span}>
        <FieldRenderer 
          field={enhancedField} 
          formData={formData} 
          handleChange={handleChange} 
          setFormData={setFormData} 
          readOnly={readOnly}
        />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-2">
        
        {/* ONGLET 1 : GÉNÉRAL (3 Colonnes Chirurgicales) */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {renderFieldByName('image_url')}
              <div className="space-y-6">
                {renderFieldByName('name')}
                {renderFieldByName('subtitle')}
                {renderFieldByName('ruleset_id')}
              </div>
              <div className="space-y-6">
                {renderFieldByName('world_id')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                {renderFieldByName('type')}
                {renderFieldByName('size')}
                {renderFieldByName('alignment')}
            </div>

            <div className="pt-4">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {/* ONGLET 2 : COMBAT & VTT */}
        {activeTab === 'combat' && (
          <div className="space-y-10">
             <div className="w-full">
                {renderFieldByName('stats')}
             </div>
             
             <div className="p-8 bg-teal-500/5 rounded-[2.5rem] border border-teal-500/10 shadow-xl">
                {renderFieldByName('dynamic_monster_fields', 'w-full')}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                {renderFieldByName('armor_class')}
                {renderFieldByName('hit_points')}
                {renderFieldByName('challenge_rating')}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {renderFieldByName('abilities')}
                {renderFieldByName('actions')}
             </div>

             <div className="w-full">
                {renderFieldByName('legendary_actions')}
             </div>
          </div>
        )}

        {/* ONGLET 3 : ÉCOLOGIE (Smart Fields activés) */}
        {activeTab === 'ecology' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
             {['habitat_description', 'diet', 'behavior_patterns', 'social_structure'].map(n => renderFieldByName(n))}
          </div>
        )}

        {/* ONGLET 4 : LORE */}
        {activeTab === 'lore' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {['lore', 'variants', 'treasure_typical'].map(n => renderFieldByName(n))}
          </div>
        )}
        
        {/* ONGLET 5 : GALERIE */}
        {activeTab === 'gallery' && <div className="w-full">{renderFieldByName('monster_images', 'w-full')}</div>}
        
        {/* ONGLET 6 : GM SECRETS */}
        {activeTab === 'gm' && (
          <div className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {renderFieldByName('gm_tactics')}
                {renderFieldByName('encounter_tips')}
             </div>
             {renderFieldByName('notes', 'w-full')}
          </div>
        )}
      </div>
    </div>
  );
}