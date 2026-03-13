import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload, History, CalendarDays } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * LocationForm - Layout Prestige 4.2 pour les Lieux Remarquables
 * Gère l'exploration, les dangers et la présence multiverselle.
 */
export default function LocationForm({ 
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
   * Rendu sécurisé d'un champ avec interception Multiverselle V4.2
   */
  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- LE PONT MÉDIATHÈQUE INTERACTIF ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visuel de référence</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[300px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-amber-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400"><ImageIcon size={32} /></div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Changer le visuel</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-amber-500/40 transition-colors">
                <Upload size={40} className="mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sélectionner une archive</span>
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
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 mb-2 block">Ancrage Multiversel</label>
           <MultiversalRelationSelector 
              formData={formData}
              setFormData={setFormData}
              entityType="locations"
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- INJECTION DU MOTEUR D'HISTOIRE V4.3 ---
    if (name === 'historical_chronicle') {
      return (
        <div key={name} className="w-full">
          <FieldRenderer 
            field={field} 
            formData={formData} 
            handleChange={handleChange} 
            setFormData={setFormData} 
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
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-amber-500/20 text-silver/40 hover:text-amber-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-amber-500/20 text-silver/40 hover:text-amber-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-2">
        
        {/* 1. GÉNÉRAL : 3 COLONNES RÉELLES */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>{renderFieldByName('image_url')}</div>
              <div className="space-y-6">
                {renderFieldByName('name')}
                {renderFieldByName('subtitle')}
                {renderFieldByName('ruleset_id')}
              </div>
              <div className="space-y-6">
                {renderFieldByName('world_id')}
                {renderFieldByName('country_id')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {renderFieldByName('description')}
              <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10 shadow-inner">
                {renderFieldByName('dynamic_geo')}
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPLORATION : Grille 3 + 2 */}
        {activeTab === 'exploration' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['location_type', 'accessibility', 'climate'].map(n => renderFieldByName(n))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-8">
              {['visibility', 'area'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* 3. HISTOIRE */}
        {activeTab === 'history_tab' && (
          <div className="space-y-10">
            <div className="p-10 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <History size={100} className="text-amber-500" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-8 flex items-center gap-4">
                    <CalendarDays size={18} /> Annales du Lieu
                </h4>
                {renderFieldByName('historical_chronicle')}
            </div>
          </div>
        )}

        {/* 4. SERVICES & COMMERCES */}
        {activeTab === 'services' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['artisans', 'merchants', 'inns_accommodation'].map(n => renderFieldByName(n))}
             </div>
          </div>
        )}

        {/* 5. DANGERS & TRÉSORS */}
        {activeTab === 'dangers' && (
          <div className="space-y-8">
            <div className="w-full">
              {renderFieldByName('danger_level')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-8">
               {['encounters', 'treasures'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* 6. GALERIE */}
        {activeTab === 'gallery' && (
          <div className="w-full pt-4">{renderFieldByName('location_images')}</div>
        )}

        {/* 7. MJ : SECRETS */}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            {renderFieldByName('gm_secrets_location')}
            {renderFieldByName('notes')}
          </div>
        )}
      </div>
    </div>
  );
}