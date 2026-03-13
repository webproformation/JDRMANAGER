import React from 'react';
import { ChevronUp, ChevronDown, Star, ImageIcon, Upload } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * CelestialBodiesForm - Standard PRESTIGE 4.2
 * Miroir chirurgical de la structure WorldForm (Grille 4/12 - 8/12)
 * Gère la présence multiverselle des astres et leurs propriétés physiques.
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
   * Rendu sécurisé d'un champ avec interception Multiverselle V4.2
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- LE PONT MÉDIATHÈQUE INTERACTIF ---
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

    // --- V4.2 : INTERCEPTION DU CHAMP MONDE ---
    if (name === 'world_id') {
      return (
        <div key={name} className={span}>
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 mb-2 block text-teal-400/60">Visible dans les Mondes</label>
           <MultiversalRelationSelector 
              formData={formData}
              setFormData={setFormData}
              entityType="celestial_bodies"
              readOnly={readOnly}
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
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in duration-500">
        
        {/* ONGLET 1 : GÉNÉRAL */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
              
              <div className="md:col-span-4">
                {renderFieldByName('image_url', 'w-full')}
              </div>
              
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 content-start">
                  {renderFieldByName('name')}
                  {renderFieldByName('subtitle')}
                  {renderFieldByName('body_type')}
                  {renderFieldByName('ruleset_id')}
                  {renderFieldByName('world_id')}
                </div>

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
            
            <div className="pt-10 border-t border-white/5">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {/* ONGLET 2 : ASTROPHYSIQUE */}
        {activeTab === 'physical' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            {renderFieldByName('color')}
            {renderFieldByName('size')}
            {renderFieldByName('brightness')}
            {renderFieldByName('orbital_period')}
            <div className="md:col-span-2">
               {renderFieldByName('phases', 'w-full')}
            </div>
          </div>
        )}

        {/* ONGLET 3 : INFLUENCE & VTT */}
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

        {/* ONGLET 4 : GALERIE */}
        {activeTab === 'gallery' && (
          <div className="w-full mt-4">
             {renderFieldByName('celestial_images', 'w-full')}
          </div>
        )}

        {/* ONGLET 5 : MJ */}
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