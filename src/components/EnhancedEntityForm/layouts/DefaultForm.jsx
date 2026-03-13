import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * DefaultForm - Standard PRESTIGE 4.2
 * Layout de secours intelligent pour toutes les entités n'ayant pas de layout spécifique.
 * Intègre nativement la médiathèque et le sélecteur multiversel.
 */
export default function DefaultForm({ 
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
  
  // Navigation fluide Prestige
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  /**
   * Rendu intelligent des champs avec détection automatique des types critiques
   */
  const renderField = (field) => {
    const isFull = field.fullWidth || (['textarea', 'custom', 'relation-list', 'images', 'historical_chronicle'].includes(field.type) && field.fullWidth !== false);
    const colSpanClass = currentTab?.columns === 3 ? 'md:col-span-3' : 'md:col-span-2';

    // --- 1. INTERCEPTION MULTIVERSELLE (world_id) ---
    if (field.name === 'world_id') {
      return (
        <div key={field.name} className="md:col-span-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 block">Présence Multiverselle</label>
          <MultiversalRelationSelector 
            formData={formData} 
            setFormData={setFormData} 
            entityType={config.tableName} 
            readOnly={readOnly} 
          />
        </div>
      );
    }

    // --- 2. INTERCEPTION IMAGE PRINCIPALE (image_url) ---
    if (field.name === 'image_url') {
      return (
        <div key={field.name} className="md:col-span-1 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Illustration</label>
          <div 
            onClick={() => !readOnly && onOpenPicker && onOpenPicker('image_url')}
            className={`group relative aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <div className="p-4 bg-teal-500/20 rounded-2xl border border-teal-500/40 text-teal-400"><ImageIcon size={32} /></div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Remplacer</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-teal-500/40 transition-colors">
                <Upload size={40} className="mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sélectionner</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // --- 3. RENDU STANDARD (FieldRenderer) ---
    return (
      <div key={field.name} className={isFull ? colSpanClass : "md:col-span-1"}>
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

  const gridClass = currentTab?.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <div className="relative">
      {/* Navigation Rapide Latérale Prestige */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className={`grid grid-cols-1 ${gridClass} gap-x-12 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
        {currentTab?.fields?.map(field => renderField(field))}
      </div>
    </div>
  );
}