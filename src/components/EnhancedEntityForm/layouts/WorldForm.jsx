import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload, History, CalendarDays } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

/**
 * WorldForm - Standard PRESTIGE 3.0
 * Gestion de la genèse et de la chronologie du monde.
 * Correctif : Intégration du référentiel temporel et du moteur d'histoire V4 [cite: 2026-03-12].
 */
export default function WorldForm({ 
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
  
  // Navigation fluide interne
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

    // --- LE PONT MÉDIATHÈQUE INTERACTIF : SÉLECTION D'IMAGE ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Icône du Monde</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[350px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
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

    // --- GESTION SPÉCIFIQUE DU NOUVEAU MOTEUR D'HISTOIRE V4 ---
    if (name === 'historical_chronicle') {
        return (
          <div key={field.name} className={span}>
            <FieldRenderer 
              field={{...field, entityType: 'world'}} // On force le type d'entité pour le moteur V4
              formData={formData} 
              handleChange={handleChange} 
              setFormData={setFormData} 
              readOnly={readOnly}
              // Pas de onFullChange ici, le moteur V4 gère ses propres sauvegardes en BDD
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
      {/* Navigation latérale Prestige */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ==================================================================
            GÉNÉRAL : Header 12 colonnes synchronisé avec WorldLayout [cite: 2026-03-11]
            ================================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
              <div className="md:col-span-4 h-full">
                {renderFieldByName('image_url')}
              </div>
              <div className="md:col-span-8 flex flex-col gap-6">
                {/* Ligne d'identité augmentée avec le calendrier de référence [cite: 2026-03-12] */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 content-start">
                  {renderFieldByName('name')}
                  {renderFieldByName('subtitle')}
                  {renderFieldByName('primary_calendar_id')}
                  {renderFieldByName('age')}
                  {renderFieldByName('ruleset_id')}
                  {renderFieldByName('size')}
                  {renderFieldByName('shape')}
                </div>
                
                {/* Bloc Système */}
                <div className="mt-4 p-8 bg-teal-500/5 rounded-[2.5rem] border border-teal-500/10 shadow-xl">
                   {renderFieldByName('dynamic_world', 'w-full')}
                </div>
              </div>
            </div>
            
            {/* Description & Mythe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
              {renderFieldByName('description')}
              {renderFieldByName('creation_myth')}
            </div>
          </div>
        )}

        {/* GÉOGRAPHIE */}
        {activeTab === 'geography' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
             {currentTab?.fields?.map(field => renderFieldByName(field.name))}
          </div>
        )}

        {/* MAGIE & COSMOLOGIE */}
        {activeTab === 'magic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start">
            <div className="space-y-10">
              {['magic_level', 'magic_source', 'magic_schools', 'planar_connections', 'cosmology', 'magical_phenomena'].map(n => renderFieldByName(n))}
            </div>
            <div className="h-full">
              {renderFieldByName('calendar_config', 'w-full')}
            </div>
          </div>
        )}

        {/* CIVILISATION / PEUPLES */}
        {activeTab === 'civilization' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {currentTab?.fields?.map(field => renderFieldByName(field.name))}
          </div>
        )}

        {/* ==================================================================
            HISTOIRE & CHRONOLOGIE : Layout Imbriqué Premium [cite: 2026-03-12]
            ================================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-12">
            {/* MOTEUR DE CHRONIQUE V4 : Occupe toute la largeur pour la visibilité [cite: 2026-03-12] */}
            <div className="p-10 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <History size={100} className="text-[#2DD4BF]" />
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF] mb-8 flex items-center gap-4">
                    <CalendarDays size={18} />
                    Chronique des Âges Imbriquée
                </h4>
                
                {renderFieldByName('historical_chronicle', 'w-full')}
            </div>

            {/* CHAMPS DE RÉSUMÉ ET CONFLITS (Grille 2 colonnes sous le moteur) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-10">
              <div className="space-y-8">
                {renderFieldByName('current_era')}
                {renderFieldByName('major_historical_events')}
                {renderFieldByName('ancient_civilizations')}
              </div>
              <div className="space-y-8">
                {renderFieldByName('prophecies')}
                {renderFieldByName('current_conflicts')}
                {renderFieldByName('time_engine')}
              </div>
            </div>
          </div>
        )}

        {/* CONTINENTS */}
        {activeTab === 'continents' && (
          <div className="w-full mt-4">
             {renderFieldByName('world_continents', 'w-full')}
          </div>
        )}

        {/* GALERIE */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1">
             {renderFieldByName('world_images', 'w-full')}
          </div>
        )}

        {/* MJ */}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {renderFieldByName('gm_secrets')}
             {renderFieldByName('gm_plot_hooks')}
             {renderFieldByName('notes')}
          </div>
        )}
      </div>
    </div>
  );
}