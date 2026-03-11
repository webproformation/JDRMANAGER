import React from 'react';
import { ChevronUp, ChevronDown, Flag } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

/**
 * CountryForm - Layout chirurgical pour l'entité Pays
 * Gère l'organisation des données nationales et l'injection des règles système (Nation)
 */
export default function CountryForm({ 
  formData, 
  activeTab, 
  handleChange, 
  setFormData, 
  config, 
  contentRef,
  readOnly = false 
}) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  
  // Navigation fluide interne pour les longs formulaires
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  /**
   * Rendu sécurisé d'un champ par son nom technique
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
      {/* Flèches de navigation rapide latérale */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button 
          type="button" 
          onClick={() => scrollContent('up')} 
          className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          type="button" 
          onClick={() => scrollContent('down')} 
          className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ==================================================================
            ONGLET 1 : GÉNÉRAL (Identité & Système)
            ================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Visuel principal en 4/12 */}
              <div className="md:col-span-4">
                {renderFieldByName('image_url', 'w-full')}
              </div>
              
              {/* Informations d'identité en 8/12 */}
              <div className="md:col-span-8 grid grid-cols-2 gap-6">
                {renderFieldByName('name')}
                {renderFieldByName('subtitle')}
                {renderFieldByName('world_id')}
                {renderFieldByName('continent_id')}
                {renderFieldByName('ocean_id')}
                {renderFieldByName('ruleset_id')}
                
                {/* Bloc dynamique système (Structure Planaire, etc.) */}
                <div className="col-span-2 mt-4">
                   {renderFieldByName('dynamic_nation', 'w-full')}
                </div>
              </div>
            </div>
            
            {/* Description longue en bas de l'onglet */}
            <div className="pt-6 border-t border-white/5">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 2 : GÉOGRAPHIE & TERRITOIRE
            ================================================================== */}
        {activeTab === 'geography' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderFieldByName('area')}
              {renderFieldByName('capital')}
              {renderFieldByName('population')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {renderFieldByName('terrain')}
              {renderFieldByName('climate_description')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 3 : POLITIQUE & GOUVERNEMENT
            ================================================================== */}
        {activeTab === 'politics' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Colonne Administration */}
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60 ml-1">Administration</h5>
                {['government_type', 'ruler', 'government_structure', 'laws'].map(n => renderFieldByName(n))}
              </div>
              
              {/* Colonne Force & Diplomatie */}
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 ml-1">Force & Diplomatie</h5>
                {['military_strength', 'military_structure', 'alliances', 'enemies'].map(n => renderFieldByName(n))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 4 : ÉCONOMIE & COMMERCE
            ================================================================== */}
        {activeTab === 'economy' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {renderFieldByName('currency')}
              {renderFieldByName('economy')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {['trade_goods', 'imports', 'exports'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 5 : CULTURE & SOCIÉTÉ
            ================================================================== */}
        {activeTab === 'culture' && (
          <div className="space-y-10">
            {/* Zone Langue en pleine largeur pour accueillir la grille de checkboxes */}
            <div className="w-full pb-8 border-b border-white/5">
               {renderFieldByName('language', 'w-full')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-8">
                {renderFieldByName('cultural_practices')}
                {renderFieldByName('festivals')}
              </div>
              <div className="space-y-8">
                {renderFieldByName('cuisine')}
                {renderFieldByName('art_style')}
                {renderFieldByName('education_system')}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET : VILLES, VILLAGES & LIEUX
            ================================================================== */}
        {activeTab === 'locations' && (
          <div className="w-full mt-4">
            {renderFieldByName('country_locations', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET : OCÉANS & MERS
            ================================================================== */}
        {activeTab === 'oceans' && (
          <div className="w-full mt-4">
            {renderFieldByName('country_oceans', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 6 : HISTOIRE
            ================================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {renderFieldByName('founding_date')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-8">
              {['history', 'major_wars', 'historical_figures', 'relations'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 7 : GALERIE D'IMAGES
            ================================================================== */}
        {activeTab === 'gallery' && (
          <div className="w-full">
            {renderFieldByName('country_images', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 8 : NOTES MJ (SECRET)
            ================================================================== */}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderFieldByName('gm_secrets_country')}
            {renderFieldByName('notes')}
          </div>
        )}

      </div>
    </div>
  );
}