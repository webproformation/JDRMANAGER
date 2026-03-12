import React from 'react';
import { ChevronUp, ChevronDown, Star, ImageIcon, Upload } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

/**
 * CelestialBodiesForm - Standard PRESTIGE 3.0
 * Miroir chirurgical de la structure WorldForm (Grille 4/12 - 8/12)
 * Organisation rigoureuse en 3 colonnes pour les données physiques [cite: 2026-03-12]
 */
export default function CelestialBodiesForm({ 
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
  
  // Navigation fluide interne pour les longs formulaires
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ 
        top: direction === 'up' ? -amount : amount, 
        behavior: 'smooth' 
      });
    }
  };

  /**
   * Rendu sécurisé d'un champ par son nom technique avec support Médiathèque
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- LE PONT MÉDIATHÈQUE INTERACTIF : SÉLECTION D'IMAGE ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
            Iconographie de l'Astre
          </label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[400px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img 
                  src={formData.image_url} 
                  alt="Aperçu" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <div className="p-4 bg-teal-500/20 rounded-2xl border border-teal-500/40 text-teal-400 shadow-xl">
                    <ImageIcon size={32} />
                  </div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Changer l'image</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-teal-500/40 transition-all">
                <Upload size={40} className="mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ouvrir les archives</span>
              </div>
            )}
          </div>
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
      {/* Flèches de navigation rapide latérale */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button 
          type="button" 
          onClick={() => scrollContent('up')} 
          className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"
        >
          <ChevronUp size={20} />
        </button>
        <button 
          type="button" 
          onClick={() => scrollContent('down')} 
          className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        
        {/* ==================================================================
            ONGLET 1 : GÉNÉRAL (Ratio 4/12 - 8/12 Miroir Monde) [cite: 2026-03-11]
            ================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
              
              {/* COLONNE 1 : IMAGE (md:col-span-4) */}
              <div className="md:col-span-4">
                {renderFieldByName('image_url', 'w-full')}
              </div>
              
              {/* COLONNE 2 & 3 : IDENTITÉ (md:col-span-8) [CORRECTIF : REMONTÉ] */}
              <div className="md:col-span-8 flex flex-col gap-6">
                
                {/* Grille d'identité compacte pour laisser la place au bloc système */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 content-start">
                  {renderFieldByName('name')}
                  {renderFieldByName('subtitle')}
                  {renderFieldByName('body_type')}
                  {renderFieldByName('ruleset_id')}
                  {renderFieldByName('world_id')}
                </div>

                {/* BLOC SPÉCIFICITÉS SYSTÈME (Ajustement des marges et du positionnement) */}
                <div className="bg-teal-500/5 p-7 rounded-[2rem] border border-teal-500/10 shadow-xl relative overflow-hidden mt-2">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Star size={40} className="text-teal-400" />
                  </div>
                  
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6 flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-teal-500/30"></div>
                    Propriétés du Système
                  </h4>

                  <div className="relative z-10">
                    {renderFieldByName('dynamic_celestial', 'w-full')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* DESCRIPTION EN BAS (Miroir WorldForm) */}
            <div className="pt-10 border-t border-white/5">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 2 : ASTROPHYSIQUE (Grille 3 Colonnes - 2 Lignes) [cite: 2026-03-12]
            ================================================================== */}
        {activeTab === 'physical' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            {/* Ligne 1 : Les 3 premiers champs physiques */}
            {renderFieldByName('color')}
            {renderFieldByName('size')}
            {renderFieldByName('brightness')}
            
            {/* Ligne 2 : Les champs restants */}
            {renderFieldByName('orbital_period')}
            <div className="md:col-span-2">
               {renderFieldByName('phases', 'w-full')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 3 : INFLUENCE & VTT (Focus Mécanique)
            ================================================================== */}
        {activeTab === 'influence' && (
          <div className="space-y-12">
            <div className="w-full">
               {renderFieldByName('data', 'w-full')}
            </div>
            <div className="grid grid-cols-1 gap-10 border-t border-white/5 pt-10">
              {renderFieldByName('astrological_influence', 'w-full')}
              {renderFieldByName('magical_properties', 'w-full')}
              {renderFieldByName('cultural_significance', 'w-full')}
            </div>
          </div>
        )}

        {/* ==================================================================
            ONGLET 4 : GALERIE (Grille d'images)
            ================================================================== */}
        {activeTab === 'gallery' && (
          <div className="w-full mt-4">
             {renderFieldByName('celestial_images', 'w-full')}
          </div>
        )}

        {/* ==================================================================
            ONGLET 5 : MJ (Secrets)
            ================================================================== */}
        {activeTab === 'gm' && (
          <div className="space-y-10">
             {renderFieldByName('lore', 'w-full')}
             <div className="pt-6 border-t border-white/5">
                {renderFieldByName('notes', 'w-full')}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}