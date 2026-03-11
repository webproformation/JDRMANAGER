import React from 'react';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

/**
 * ContinentForm - Layout spécifique pour l'entité Continent
 * Gère l'organisation visuelle des onglets et l'injection du RulesetDynamicFields
 */
export default function ContinentForm({ 
  formData, 
  activeTab, 
  handleChange, 
  setFormData, 
  config, 
  contentRef,
  readOnly = false
}) {
  const currentTab = config?.tabs?.find(t => t.id === activeTab);
  
  // Navigation interne au formulaire
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  /**
   * Rendu sécurisé d'un champ par son nom défini dans la config de la page.
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;
    
    return (
      <div key={field.name} className={span}>
        <FieldRenderer 
          field={field} 
          formData={formData} 
          handleChange={handleChange} 
          setFormData={setFormData} 
          readOnly={readOnly}
          onFullChange={(newFull) => setFormData(newFull)} 
        />
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Flèches de navigation (Scroll) */}
      <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center gap-4 z-10">
        <button 
          onClick={() => scrollContent('up')}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-silver/40 hover:text-teal-400 hover:border-teal-500/50 transition-all backdrop-blur-md"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          onClick={() => scrollContent('down')}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-silver/40 hover:text-teal-400 hover:border-teal-500/50 transition-all backdrop-blur-md"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="space-y-12 pr-4">
        
        {/* ==================================================================
            ONGLET 1 : GÉNÉRAL
            ================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              {/* Image Principale - Alignée sur la hauteur du Layout */}
              <div className="md:col-span-4 h-full min-h-[300px]">
                {renderFieldByName('image_url', 'h-full')}
              </div>
              
              {/* Colonne de droite : Infos Clés */}
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {renderFieldByName('ruleset_id')}
                   {renderFieldByName('name')}
                   {renderFieldByName('subtitle')}
                   {renderFieldByName('world_id')}
                </div>
                <div className="pt-4">
                   {renderFieldByName('description', 'w-full')}
                </div>
              </div>
            </div>

            {/* Propriétés Système (Ruleset) */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-teal-400" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
                  Propriétés du Système de Jeu
                </h3>
              </div>
              {renderFieldByName('dynamic_geo', 'w-full')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 2 : GÉOGRAPHIE
            ================================================================== */}
        {activeTab === 'geography' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {renderFieldByName('area')}
              {renderFieldByName('climate')}
              {renderFieldByName('terrain_description')}
              {renderFieldByName('resources')}
              {renderFieldByName('major_rivers')}
              {renderFieldByName('mountain_ranges')}
              {renderFieldByName('forests')}
              {renderFieldByName('deserts')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 3 : FAUNE & FLORE
            ================================================================== */}
        {activeTab === 'nature' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {renderFieldByName('fauna')}
              {renderFieldByName('flora')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 4 : CULTURE
            ================================================================== */}
        {activeTab === 'culture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {renderFieldByName('population')}
              {renderFieldByName('cultures')}
              {renderFieldByName('languages_spoken')}
              {renderFieldByName('religions')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 5 : HISTOIRE
            ================================================================== */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {renderFieldByName('historical_significance')}
              {renderFieldByName('history')}
              {renderFieldByName('legends')}
              {renderFieldByName('current_events')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 6 : PAYS
            ================================================================== */}
        {activeTab === 'countries' && (
          <div className="w-full mt-4">
             {renderFieldByName('continent_countries', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 7 : GALERIE
            ================================================================== */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1">
              {renderFieldByName('continent_images', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 8 : NOTES MJ
            ================================================================== */}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {renderFieldByName('gm_secrets_continent')}
              {renderFieldByName('notes')}
          </div>
        )}

      </div>
    </div>
  );
}