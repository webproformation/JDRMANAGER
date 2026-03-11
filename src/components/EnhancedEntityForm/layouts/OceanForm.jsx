import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

export default function OceanForm({ formData, activeTab, handleChange, setFormData, config, contentRef, readOnly = false }) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  
  const scrollContent = (direction) => {
    if (contentRef.current) contentRef.current.scrollBy({ top: direction === 'up' ? -350 : 350, behavior: 'smooth' });
  };

  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;
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

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>{renderFieldByName('image_url', 'w-full')}</div>
              <div className="space-y-6">
                {renderFieldByName('name', 'w-full')}
                {renderFieldByName('subtitle', 'w-full')}
                {renderFieldByName('ruleset_id', 'w-full')}
              </div>
              <div className="space-y-6">{renderFieldByName('world_id', 'w-full')}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {renderFieldByName('description', 'w-full')}
              {renderFieldByName('dynamic_geo', 'w-full')}
            </div>
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['area', 'depth', 'water_temp', 'visibility'].map(n => renderFieldByName(n))}
          </div>
        )}

        {activeTab === 'navigation' && (
          <div className="grid grid-cols-3 gap-6 pt-4">
            {['currents', 'routes', 'resources'].map(n => renderFieldByName(n))}
          </div>
        )}

        {activeTab === 'hazards_tab' && <div className="w-full pt-4">{renderFieldByName('hazards', 'w-full')}</div>}
        {activeTab === 'gallery' && <div className="w-full pt-4">{renderFieldByName('ocean_images', 'w-full')}</div>}
        {activeTab === 'gm' && (
          <div className="grid grid-cols-2 gap-10 pt-4">
            {['gm_secrets_ocean', 'notes'].map(n => renderFieldByName(n))}
          </div>
        )}
      </div>
    </div>
  );
}