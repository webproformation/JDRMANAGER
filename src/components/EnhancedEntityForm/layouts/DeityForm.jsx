import React from 'react';
import { ChevronUp, ChevronDown, ImageIcon, Upload, Sparkles } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

export default function DeityForm({ 
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

  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;

    // --- LE PONT MÉDIATHÈQUE INTERACTIF (CHARTE PRESTIGE 3.0) ---
    if (name === 'image_url') {
      return (
        <div key={name} className="space-y-3 h-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/50 ml-1">Avatar Divin</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[350px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
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
      {/* Navigation de scroll latérale */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ONGLET : IDENTITÉ DIVINE (HEADER 12 COLONNES) */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
              <div className="md:col-span-4 h-full">
                {renderFieldByName('image_url')}
              </div>
              <div className="md:col-span-8 grid grid-cols-3 gap-6 content-start">
                {['name', 'title', 'ruleset_id', 'pantheon', 'alignment', 'divine_rank'].map(n => renderFieldByName(n))}
                <div className="col-span-3 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    {['world_id', 'domains', 'portfolio'].map(n => renderFieldByName(n))}
                  </div>
                  {renderFieldByName('dynamic_deity_fields', 'w-full')}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
              {renderFieldByName('description')}
              {renderFieldByName('appearance')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {renderFieldByName('symbol')}
              {renderFieldByName('sacred_symbol_description')}
            </div>
          </div>
        )}

        {/* ONGLET : CULTE & DOGME (STRUCTURE 3 + 2) */}
        {activeTab === 'worship' && (
          <div className="space-y-12">
            {renderFieldByName('data', 'w-full')}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['favored_weapon', 'holy_days', 'clergy_alignments'].map(n => renderFieldByName(n))}
            </div>

            {/* Grille Arithmétique : 3 Colonnes */}
            <div className="pt-10 border-t border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {['rituals', 'worshippers', 'typical_worshippers'].map(n => renderFieldByName(n))}
              </div>
            </div>

            {/* Grille Arithmétique : 2 Colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {['divine_servants', 'temples'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* ONGLET : POUVOIRS & ARTEFACTS (STRUCTURE 3 + 2) */}
        {activeTab === 'powers' && (
          <div className="space-y-12">
            {/* Grille Arithmétique : 3 Colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {['sacred_artifacts', 'granted_powers', 'divine_spells'].map(n => renderFieldByName(n))}
            </div>

            {/* Grille Arithmétique : 2 Colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
              {['avatar_description', 'manifestations'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* ONGLET : RELATIONS */}
        {activeTab === 'relations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {['allies', 'enemies'].map(n => renderFieldByName(n, 'w-full'))}
          </div>
        )}

        {/* ONGLET : GALERIE */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1">
             {renderFieldByName('deity_images', 'w-full')}
          </div>
        )}

        {/* ONGLET : SECRETS MJ */}
        {activeTab === 'gm' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['gm_notes', 'gm_secret_plots', 'gm_conspiracies'].map(n => renderFieldByName(n))}
            </div>
            <div className="pt-8 border-t border-white/5">
               {renderFieldByName('gm_secret_images', 'w-full')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}