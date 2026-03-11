import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

export default function CityForm({ 
  formData, activeTab, handleChange, setFormData, config, contentRef, readOnly = false, onOpenPicker 
}) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  
  const scrollContent = (direction) => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: direction === 'up' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    if (name === 'image_url') {
      return (
        <div key={name} className={`${span} space-y-3`}>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Visuel de la Cité</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
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

    return (
      <div key={field.name} className={span}>
        <FieldRenderer field={field} formData={formData} handleChange={handleChange} setFormData={setFormData} readOnly={readOnly} onFullChange={(newFull) => setFormData(newFull)} />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'general' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {renderFieldByName('image_url')}
              <div className="md:col-span-1 space-y-6">{['name', 'subtitle', 'ruleset_id'].map(n => renderFieldByName(n))}</div>
              <div className="md:col-span-1 space-y-6">{['world_id', 'country_id'].map(n => renderFieldByName(n))}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
               {renderFieldByName('description', 'w-full')}
               {renderFieldByName('dynamic_geo', 'w-full')}
            </div>
          </div>
        )}
        {activeTab === 'infrastructure' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">{['area', 'founded', 'water_supply'].map(n => renderFieldByName(n))}</div>
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">{['sanitation', 'architecture', 'defenses'].map(n => renderFieldByName(n))}</div>
          </div>
        )}
        {activeTab === 'districts' && (
          <div className="space-y-8">
             <div className="grid grid-cols-3 gap-6">{['districts', 'landmarks', 'temples'].map(n => renderFieldByName(n))}</div>
             <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">{['guildhalls', 'markets'].map(n => renderFieldByName(n))}</div>
             <div className="grid grid-cols-2 gap-6">{['inns_taverns', 'notable_locations'].map(n => renderFieldByName(n))}</div>
          </div>
        )}
        {activeTab === 'society' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">{['population', 'demographics', 'crime_rate'].map(n => renderFieldByName(n))}</div>
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">{['government', 'social_classes', 'factions'].map(n => renderFieldByName(n))}</div>
          </div>
        )}
        {activeTab === 'economy' && <div className="w-full">{renderFieldByName('economy', 'w-full')}</div>}
        {activeTab === 'gallery' && <div className="w-full">{renderFieldByName('city_images', 'w-full')}</div>}
        {activeTab === 'gm' && <div className="grid grid-cols-2 gap-10">{['gm_secrets_city', 'notes'].map(n => renderFieldByName(n))}</div>}
      </div>
    </div>
  );
}