import React from 'react';
import { ChevronUp, ChevronDown, Calendar, ImageIcon, Upload, Clock, Sparkles, History, PlusCircle, CalendarDays } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import VTTSelect from '../../vtt-ui/VTTSelect'; 
import MultiversalRelationSelector from '../../MultiversalRelationSelector'; // IMPORT V4.2

/**
 * CalendarsForm - Standard PRESTIGE 4.2
 * Architecture temporelle multiverselle et moteur de chronologie.
 */
export default function CalendarsForm({ 
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
  const unifiedLabelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/50 mb-3 block ml-1";

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
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Iconographie</label>
          <div 
            onClick={() => !readOnly && onOpenPicker('image_url')}
            className={`group relative h-[calc(100%-24px)] min-h-[300px] rounded-[2.5rem] overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
              formData.image_url ? 'border-transparent shadow-2xl' : 'border-white/10 bg-black/20 hover:border-teal-500/30'
            }`}
          >
            {formData.image_url ? (
              <>
                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                   <div className="p-4 bg-teal-500/20 rounded-2xl border border-teal-500/40 text-teal-400"><ImageIcon size={32} /></div>
                   <span className="mt-4 text-[10px] font-black uppercase text-white tracking-widest">Changer l'image</span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-teal-500/40 transition-colors">
                <Upload size={40} className="mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ouvrir les Archives</span>
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
           <label className={unifiedLabelStyle}>Référentiel Multiversel</label>
           <MultiversalRelationSelector 
              formData={formData}
              setFormData={setFormData}
              entityType="calendars"
              readOnly={readOnly}
           />
        </div>
      );
    }

    // --- SÉLECTEUR DE MOIS ALIGNÉ ---
    if (name === 'current_month') {
      const monthOptions = Array.isArray(formData.months) 
        ? formData.months.map(m => ({ value: m.name, label: m.name })) 
        : [];

      return (
        <div key={name} className={span}>
          <label className={unifiedLabelStyle}>Mois Actuel</label>
          <div className="h-[44px] flex items-center">
            <VTTSelect
              value={formData.current_month}
              options={monthOptions}
              onChange={(val) => handleChange('current_month', val)}
              placeholder="Sélectionner..."
              readOnly={readOnly}
              required={true}
              upward={false}
              zIndex="z-[100]"
            />
          </div>
        </div>
      );
    }

    // --- SÉLECTEUR DE JOUR ALIGNÉ ---
    if (name === 'current_day') {
      const selectedMonthData = Array.isArray(formData.months) 
        ? formData.months.find(m => m.name === formData.current_month)
        : null;
      const maxDays = selectedMonthData?.days || formData.days_per_month || 30;

      return (
        <div key={name} className={span}>
          <label className={unifiedLabelStyle}>
            Jour <span className="text-white/10 font-normal ml-1">(Max {maxDays})</span>
          </label>
          <FieldRenderer 
            field={{ ...field, max: maxDays }} 
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
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in duration-500">
        
        {/* ONGLET 1 : GÉNÉRAL */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-4">{renderFieldByName('image_url')}</div>
              <div className="md:col-span-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full content-start">
                  {renderFieldByName('name')}
                  {renderFieldByName('world_id')}
                </div>
                {renderFieldByName('ruleset_id')}
                <div className="bg-teal-500/5 p-8 rounded-[2.5rem] border border-teal-500/10 shadow-xl">
                  {renderFieldByName('dynamic_celestial', 'w-full')}
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-white/5">{renderFieldByName('description', 'w-full')}</div>
          </div>
        )}

        {/* ONGLET 2 : STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-10 bg-black/20 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-teal-400" size={18} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Mécaniques Temporelles</h4>
              </div>
              {renderFieldByName('days_per_week')}
              {renderFieldByName('days_per_month')}
              {renderFieldByName('seasons')}
            </div>
            <div className="w-full">
               {renderFieldByName('months')}
            </div>
          </div>
        )}

        {/* ONGLET 3 : DATE & HOROSCOPE */}
        {activeTab === 'horoscope' && (
          <div className="space-y-10 pb-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-12 bg-teal-500/5 rounded-[3.5rem] border border-teal-500/10 shadow-2xl relative items-end">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Sparkles size={80} className="text-teal-400" />
               </div>
               {renderFieldByName('current_day')}
               {renderFieldByName('current_month')}
               {renderFieldByName('current_year')}
            </div>
            <div className="w-full">
               {renderFieldByName('horoscope_display')}
            </div>
          </div>
        )}

        {/* ONGLET 4 : HISTOIRE & CHRONOLOGIE */}
        {activeTab === 'history' && (
          <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-400">
                  <History size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Chronologie Mondiale</h3>
                  <p className="text-[10px] text-silver/40 uppercase font-bold tracking-widest">Événements imbriqués par cycle</p>
                </div>
              </div>
            </div>

            <div className="p-1 bg-white/5 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="bg-black/40 rounded-[2.8rem] p-10 space-y-8 min-h-[400px]">
                {renderFieldByName('world_history_editor', 'w-full')}
                
                {(!formData.history || formData.history.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                    <CalendarDays size={64} className="mb-4" />
                    <p className="text-xs uppercase font-black tracking-[0.3em]">Aucun événement répertorié</p>
                    <p className="text-[10px] mt-2">Commencez par définir les grandes dates de votre monde</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'festivals' && <div className="w-full">{renderFieldByName('festivals', 'w-full')}</div>}
        {activeTab === 'gm' && <div className="w-full">{renderFieldByName('notes', 'w-full')}</div>}
      </div>
    </div>
  );
}