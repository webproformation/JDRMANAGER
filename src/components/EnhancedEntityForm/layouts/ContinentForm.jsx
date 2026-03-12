import React from 'react';
import { ChevronUp, ChevronDown, Sparkles, ImageIcon, Upload, History, CalendarDays } from 'lucide-react';
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
  readOnly = false,
  onOpenPicker // Ajouté pour gérer le pont avec la médiathèque
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
    
    // --- LE PONT MÉDIATHÈQUE INTERACTIF : SÉLECTION D'IMAGE ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visuel du Continent</label>
          <div 
            onClick={() => !readOnly && onOpenPicker && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[300px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <div className="p-4 bg-teal-500/20 rounded-2xl border border-teal-500/40 text-teal-400"><ImageIcon size={32} /></div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Changer l'image</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-teal-500/40 transition-colors">
                <Upload size={40} className="mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sélectionner depuis les archives</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- GESTION SPÉCIFIQUE DU MOTEUR D'HISTOIRE V4 ---
    if (name === 'historical_chronicle') {
        return (
          <div key={field.name} className={span}>
            <FieldRenderer 
              field={field} 
              formData={formData} 
              handleChange={handleChange} 
              setFormData={setFormData} 
              readOnly={readOnly}
              // Pas de onFullChange ici, le moteur V4 gère ses propres sauvegardes
            />
          </div>
        );
    }

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
      <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center gap-4 z-10 hidden lg:flex">
        <button 
          type="button"
          onClick={() => scrollContent('up')}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-silver/40 hover:text-teal-400 hover:border-teal-500/50 transition-all backdrop-blur-md shadow-xl"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          type="button"
          onClick={() => scrollContent('down')}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-silver/40 hover:text-teal-400 hover:border-teal-500/50 transition-all backdrop-blur-md shadow-xl"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="space-y-12 pr-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ==================================================================
            ONGLET 1 : GÉNÉRAL
            ================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              <div className="md:col-span-4 h-full min-h-[300px]">
                {renderFieldByName('image_url', 'h-full')}
              </div>
              
              <div className="md:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {renderFieldByName('ruleset_id')}
                   {renderFieldByName('name')}
                   {renderFieldByName('subtitle')}
                   {renderFieldByName('world_id')}
                </div>
                <div className="pt-4 border-t border-white/5">
                   {renderFieldByName('description', 'w-full')}
                </div>
              </div>
            </div>

            {/* Propriétés Système (Ruleset) */}
            <div className="p-8 bg-teal-500/5 rounded-[2.5rem] border border-teal-500/10 shadow-xl mt-4">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={18} className="text-teal-400" />
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
            ONGLET 5 : HISTOIRE (Moteur V4)
            ================================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-12">
            
            {/* MOTEUR DE CHRONIQUE V4 : Occupe toute la largeur pour la visibilité */}
            <div className="p-10 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <History size={100} className="text-[#2DD4BF]" />
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF] mb-8 flex items-center gap-4">
                    <CalendarDays size={18} />
                    Annales du Continent
                </h4>
                
                {renderFieldByName('historical_chronicle', 'w-full')}
            </div>

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