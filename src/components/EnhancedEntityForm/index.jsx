import React, { useState, useEffect, useRef } from 'react';
import { Save, ChevronUp, ChevronDown, Loader, Skull } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateCharacterData, calculateCombatStats } from '../../utils/rulesEngine';

import FormHeader from './FormHeader';
import TabsNavigation from './TabsNavigation';
import FieldRenderer from './FieldRenderer';

export default function EnhancedEntityForm({
  isOpen,
  onClose,
  onSuccess,
  item = null,
  config
}) {
  const { tableName, tabs } = config;

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'identity');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contentRef = useRef(null);

  // --- ANTI-ASCENSEUR GLOBAL ABSOLU ---
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (item) {
        setFormData(item);
      } else {
        const initialData = { level: 1, experience: 0, ruleset_id: 'dnd5', character_type: 'PJ' };
        tabs.forEach(tab => {
          tab.fields?.forEach(field => {
            if (field.type === 'images') initialData[field.name] = {};
            else if (!initialData[field.name] && !field.isVirtual) initialData[field.name] = '';
          });
        });
        setFormData(initialData);
      }
      setError(null);
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => { 
      document.documentElement.style.overflow = '';
      document.body.style.overflow = ''; 
    };
  }, [isOpen, item, tabs]);

  if (!isOpen) return null;

  const handleAutoGenerate = async () => {
    if (!formData.ruleset_id || !formData.race_id || !formData.class_id) {
      alert("Sélectionnez le Système, la Race et la Classe d'abord !"); return;
    }
    setLoading(true);
    try {
      const { data: race } = await supabase.from('races').select('name').eq('id', formData.race_id).single();
      const { data: cl } = await supabase.from('character_classes').select('name').eq('id', formData.class_id).single();
      const forge = generateCharacterData(formData.ruleset_id, race?.name, cl?.name);
      const derived = calculateCombatStats(formData.ruleset_id, forge.stats, formData.level);
      setFormData(prev => ({ 
        ...prev, 
        data: { ...forge.stats, ...derived },
        backstory: forge.bio.backstory,
        personality: forge.bio.personality,
        description: forge.bio.description
      }));
      setActiveTab('stats');
    } catch (err) { 
      setError("Échec de la forge arcanique."); 
    } finally { 
      setLoading(false); 
    }
  };

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 400;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'level' && prev.data) {
        const derived = calculateCombatStats(prev.ruleset_id || 'dnd5', prev.data, value);
        newState.data = { ...prev.data, ...derived };
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = { ...formData };
      tabs.forEach(tab => tab.fields?.forEach(field => {
        if (field.isVirtual) delete dataToSave[field.name];
      }));
      if (item?.id) await supabase.from(tableName).update(dataToSave).eq('id', item.id);
      else await supabase.from(tableName).insert([dataToSave]);
      onSuccess(); 
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      {/* INJECTION CSS POUR SÉCURISER L'ABSENCE DE SCROLLBAR NAVIGATEUR */}
      <style>{`html, body { overflow: hidden !important; touch-action: none; }`}</style>
      
      <div className="absolute inset-0 bg-[#08090f]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative w-full h-full max-w-7xl bg-[#0f111a] sm:rounded-[3rem] border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        
        <FormHeader config={config} formData={formData} item={item} onAutoGenerate={handleAutoGenerate} onClose={onClose} />
        <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex overflow-hidden relative">
          
          {/* NAVIGATION VERTICALE IDENTIQUE À LA PAGE DETAIL DE RÉFÉRENCE */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
             <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
             <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
          </div>

          <div ref={contentRef} className="flex-1 overflow-y-auto p-10 lg:p-16 space-y-12 no-scrollbar scroll-smooth">
             <form id="entity-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-32">
                {error && <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold flex items-center gap-4"><Skull size={20} /> {error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                   {currentTab?.fields?.map(field => (
                     <div key={field.name} className={field.fullWidth || ['textarea', 'image', 'custom', 'relation-list'].includes(field.type) ? "md:col-span-2" : "md:col-span-1"}>
                       <FieldRenderer field={field} formData={formData} handleChange={handleChange} setFormData={setFormData} onFullChange={(newFull) => setFormData(newFull)} />
                     </div>
                   ))}
                </div>
             </form>
          </div>

          {/* BARRE D'ACTIONS FLOTTANTE */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0f111a] via-[#0f111a] to-transparent pointer-events-none flex justify-end z-20">
             <div className="pointer-events-auto flex gap-6 items-center">
               <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-silver/60 hover:text-white hover:bg-white/5 transition-all">Annuler</button>
               <button 
                 type="submit" 
                 form="entity-form" 
                 disabled={loading}
                 className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-teal-500/20"
               >
                 {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />} Sauvegarder
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}