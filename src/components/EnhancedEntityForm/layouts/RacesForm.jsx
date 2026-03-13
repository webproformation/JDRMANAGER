import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Fingerprint, Sparkles, Landmark, MapPin } from 'lucide-react';
import { supabase } from '../../../lib/supabase'; // Import nécessaire pour le fetch dynamique
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector';

/**
 * RacesForm - Standard PRESTIGE 4.2
 * Gestion de l'identité des peuples avec injection dynamique des suggestions
 * depuis la base de données (Langues & Milieux).
 */
export default function RacesForm({ 
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
  const [dbLanguages, setDbLanguages] = useState([]);

  // --- CHARGEMENT DYNAMIQUE DES LANGUES ---
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        // On récupère les noms uniques de la table languages
        const { data, error } = await supabase
          .from('languages')
          .select('name')
          .order('name', { ascending: true });

        if (error) throw error;
        if (data) {
          // On filtre les doublons éventuels
          const uniqueNames = [...new Set(data.map(l => l.name))];
          setDbLanguages(uniqueNames);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des langues :", err);
      }
    };

    fetchLanguages();
  }, []);

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  /**
   * Rendu sécurisé avec injection de suggestions dynamiques
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- INTERCEPTION : IMAGE PRINCIPALE ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Portrait de la Race</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[400px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-amber-500/30'
            }`}
          >
            {formData.image_url ? (
              <img src={formData.image_url} alt="Portrait" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sélectionner un Portrait</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- INTERCEPTION : PRÉSENCE MONDIALE ---
    if (name === 'world_id') {
      return (
        <div key={name} className={span}>
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 mb-2 block">Présence Multiverselle</label>
           <MultiversalRelationSelector 
              formData={formData} 
              setFormData={setFormData}
              entityType="races" 
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- INJECTION DE SUGGESTIONS INTELLIGENTES ---
    let enhancedField = { ...field };

    // 1. Langages (Dynamique depuis la BDD)
    if (name === 'languages') {
      enhancedField.type = 'multi-select-other';
      // On utilise les langues de la BDD, avec un fallback de sécurité
      enhancedField.suggestions = dbLanguages.length > 0 ? dbLanguages : ['Commun', 'Elfique', 'Nain'];
    }

    // 2. Alignements (Statique - Standard de jeu)
    if (name === 'alignment') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais'];
    }

    // 3. Milieux Naturels (Milieux favoris)
    if (name === 'homeland') {
      enhancedField.type = 'multi-select-other';
      enhancedField.suggestions = ['Forêts Millénaires', 'Montagnes Escarpées', 'Cités Souterraines', 'Déserts Arides', 'Plaines Sauvages', 'Archipels Isolés', 'Marécages', 'Toundra', 'Villes Cosmopolites'];
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
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-amber-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-amber-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-2">
        
        {/* ONGLET 1 : GÉNÉRAL */}
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
            <div className="pt-8 border-t border-white/5">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {/* ONGLET 2 : PHYSIOLOGIE */}
        {activeTab === 'biology' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
             {['size', 'speed', 'lifespan', 'age'].map(n => renderFieldByName(n))}
             <div className="md:col-span-2">{renderFieldByName('physical_description')}</div>
          </div>
        )}

        {/* ONGLET 3 : CULTURE & SOCIÉTÉ */}
        {activeTab === 'culture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
             {['languages', 'alignment'].map(n => renderFieldByName(n))}
             {['society_structure', 'naming_conventions', 'religion_practices'].map(n => renderFieldByName(n, 'md:col-span-2'))}
          </div>
        )}

        {/* ONGLET 4 : CAPACITÉS & VTT */}
        {activeTab === 'abilities' && (
          <div className="space-y-10">
             <div className="p-8 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/10 shadow-xl">
                {renderFieldByName('dynamic_race_fields', 'w-full')}
             </div>
             {renderFieldByName('data', 'w-full')}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/5">
                {renderFieldByName('traits')}
                {renderFieldByName('racial_abilities')}
             </div>
          </div>
        )}

        {/* ONGLET 5 : TERRITOIRES */}
        {activeTab === 'homeland' && (
          <div className="space-y-10">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-amber-400" size={24} />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Répartition Géographique</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {renderFieldByName('homeland')}
               {renderFieldByName('relations_with_other_races')}
            </div>
          </div>
        )}

        {/* ONGLETS STANDARDS */}
        {activeTab === 'gallery' && <div className="w-full">{renderFieldByName('race_images', 'w-full')}</div>}
        {activeTab === 'gm' && <div className="w-full">{renderFieldByName('gm_secrets_race', 'w-full')}</div>}
      </div>
    </div>
  );
}