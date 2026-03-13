import React from 'react';
import { ChevronUp, ChevronDown, Flag, ImageIcon, Upload, History, CalendarDays } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * CountryForm - Standard PRESTIGE 4.2
 * Layout chirurgical pour l'entité Pays.
 * Gère l'organisation des données nationales et la présence multiverselle.
 */
export default function CountryForm({ 
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
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Emblème / Visuel du Pays</label>
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

    // --- V4.2 : L'INTERCEPTION MULTIVERSELLE ---
    if (name === 'world_id') {
      return (
        <div key={name} className={span}>
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 mb-2 block">Présence dans les Mondes</label>
           <MultiversalRelationSelector 
              formData={formData}
              setFormData={setFormData}
              entityType="countries"
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- INJECTION DU MOTEUR D'HISTOIRE V4.1 ---
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
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-2">
        
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                {renderFieldByName('image_url', 'w-full')}
              </div>
              
              <div className="md:col-span-8 grid grid-cols-2 gap-6">
                {renderFieldByName('ruleset_id')}
                {renderFieldByName('name')}
                {renderFieldByName('subtitle')}
                {renderFieldByName('world_id')}
                {renderFieldByName('continent_id')}
                {renderFieldByName('ocean_id')}
                
                <div className="col-span-2 mt-4 p-6 bg-teal-500/5 rounded-[2rem] border border-teal-500/10 shadow-inner">
                   {renderFieldByName('dynamic_nation', 'w-full')}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              {renderFieldByName('description', 'w-full')}
            </div>
          </div>
        )}

        {activeTab === 'geography' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {renderFieldByName('area')}
              {renderFieldByName('capital')}
              {renderFieldByName('population')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {renderFieldByName('terrain')}
              {renderFieldByName('climate_description')}
            </div>
          </div>
        )}

        {activeTab === 'politics' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60 ml-1">Administration</h5>
                {['government_type', 'ruler', 'government_structure', 'laws'].map(n => renderFieldByName(n))}
              </div>
              
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 ml-1">Force & Diplomatie</h5>
                {['military_strength', 'military_structure', 'alliances', 'enemies'].map(n => renderFieldByName(n))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economy' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {renderFieldByName('currency')}
              {renderFieldByName('economy')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {['trade_goods', 'imports', 'exports'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="space-y-10">
            <div className="w-full pb-8 border-b border-white/5">
                {renderFieldByName('language', 'w-full')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-8">
                {renderFieldByName('cultural_practices')}
                {renderFieldByName('festivals')}
              </div>
              <div className="space-y-8">
                {renderFieldByName('cuisine')}
                {renderFieldByName('art_style')}
                {renderFieldByName('education_system')}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="w-full mt-4">
            {renderFieldByName('country_locations', 'w-full')}
          </div>
        )}

        {activeTab === 'oceans' && (
          <div className="w-full mt-4">
            {renderFieldByName('country_oceans', 'w-full')}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-6">
              {renderFieldByName('founding_date')}
            </div>

            <div className="p-10 bg-black/40 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <History size={100} className="text-[#2DD4BF]" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF] mb-8 flex items-center gap-4">
                    <CalendarDays size={18} /> Chronique de la Nation
                </h4>
                {renderFieldByName('historical_chronicle')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-8">
              {['history', 'major_wars', 'historical_figures', 'relations'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="w-full">
            {renderFieldByName('country_images', 'w-full')}
          </div>
        )}

        {activeTab === 'gm' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderFieldByName('gm_secrets_country')}
            {renderFieldByName('notes')}
          </div>
        )}
      </div>
    </div>
  );
}