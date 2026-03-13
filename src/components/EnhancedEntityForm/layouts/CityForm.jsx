import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload, History, CalendarDays } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * CityForm - Layout chirurgical pour l'entité Cité (Standard PRESTIGE 4.2)
 * Gère l'organisation des quartiers, de l'infrastructure et la présence multiverselle.
 */
export default function CityForm({ 
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
      contentRef.current.scrollBy({ top: direction === 'up' ? -350 : 350, behavior: 'smooth' });
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
        <div key={name} className={`${span} space-y-3`}>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visuel de la Cité</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Aperçu" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <div className="p-4 bg-teal-500/20 rounded-2xl border border-teal-500/40 text-teal-400">
                    <ImageIcon size={32} />
                  </div>
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

    // --- V4.2 : INTERCEPTION DU CHAMP MONDE ---
    if (name === 'world_id') {
      return (
        <div key={name} className={span}>
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 mb-2 block">Présence Multiverselle</label>
           <MultiversalRelationSelector 
              formData={formData}
              setFormData={setFormData}
              entityType="cities"
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- MOTEUR D'HISTOIRE V4.2 ---
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
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pr-2">
        
        {/* ONGLET 1 : GÉNÉRAL */}
        {activeTab === 'general' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {renderFieldByName('image_url')}
              <div className="md:col-span-1 space-y-6">{['name', 'subtitle', 'ruleset_id'].map(n => renderFieldByName(n))}</div>
              <div className="md:col-span-1 space-y-6">{['world_id', 'country_id'].map(n => renderFieldByName(n))}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
               {renderFieldByName('description', 'w-full')}
               <div className="p-6 bg-teal-500/5 rounded-[2rem] border border-teal-500/10 shadow-inner">
                  {renderFieldByName('dynamic_geo', 'w-full')}
               </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : INFRASTRUCTURE */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['area', 'founded', 'water_supply'].map(n => renderFieldByName(n))}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-8">{['sanitation', 'architecture', 'defenses'].map(n => renderFieldByName(n))}</div>
          </div>
        )}

        {/* ONGLET 3 : QUARTIERS & LIEUX */}
        {activeTab === 'districts' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['districts', 'landmarks', 'temples'].map(n => renderFieldByName(n))}</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">{['guildhalls', 'markets'].map(n => renderFieldByName(n))}</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{['inns_taverns', 'notable_locations'].map(n => renderFieldByName(n))}</div>
          </div>
        )}

        {/* ONGLET 4 : SOCIÉTÉ */}
        {activeTab === 'society' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{['population', 'demographics', 'crime_rate'].map(n => renderFieldByName(n))}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-8">{['government', 'social_classes', 'factions'].map(n => renderFieldByName(n))}</div>
          </div>
        )}

        {/* ONGLET 5 : ÉCONOMIE */}
        {activeTab === 'economy' && <div className="w-full">{renderFieldByName('economy', 'w-full')}</div>}

        {/* ONGLET 6 : HISTOIRE */}
        {activeTab === 'history' && (
          <div className="space-y-10">
            <div className="p-10 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <History size={100} className="text-[#2DD4BF]" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF] mb-8 flex items-center gap-4">
                    <CalendarDays size={18} /> Chronique de la Cité
                </h4>
                {renderFieldByName('historical_chronicle')}
            </div>
          </div>
        )}

        {/* ONGLET 7 : GALERIE */}
        {activeTab === 'gallery' && <div className="w-full">{renderFieldByName('city_images', 'w-full')}</div>}

        {/* ONGLET 8 : MJ SECRETS */}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderFieldByName('gm_secrets_city', 'w-full')}
            {renderFieldByName('notes', 'w-full')}
          </div>
        )}

      </div>
    </div>
  );
}