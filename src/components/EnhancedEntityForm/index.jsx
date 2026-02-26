import React, { useState, useEffect, useRef } from 'react';
import { Save, ChevronUp, ChevronDown, Loader, Skull, Info } from 'lucide-react';
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

  // --- INITIALISATION ---
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
      } else {
        const initialData = { 
          level: 1, 
          experience: 0, 
          ruleset_id: 'dnd5', 
          character_type: 'PJ',
          rarity: 'Commun' 
        };
        
        tabs.forEach(tab => {
          tab.fields?.forEach(field => {
            if (field.type === 'images') initialData[field.name] = {};
            else if (!initialData[field.name] && !field.isVirtual) initialData[field.name] = '';
          });
        });
        setFormData(initialData);
      }
      setError(null);
    }
  }, [isOpen, item, tabs]);

  if (!isOpen) return null;

  // --- LOGIQUE DE FORGE DIVINE (AUTO-GÉNÉRATION) ---
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
      
      alert("Le destin a été forgé ! Statistiques et biographie complétées.");
      setActiveTab('stats');
    } catch (err) { 
      console.error(err); 
      setError("Échec de la forge arcanique."); 
    } finally { 
      setLoading(false); 
    }
  };

  // --- SCROLL CONTENT ---
  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 300;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  // --- GESTION DES CHANGEMENTS ET DÉRIVATIONS ---
  const handleChange = (name, value) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      
      if (name === 'class_id' && prev.class_id !== value) {
         newState.subclass_id = null;
      }

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
    setError(null);

    try {
      const dataToSave = { ...formData };
      
      // MOTEUR DE FILTRAGE : Supprime les champs virtuels (comme dynamic_character_fields) avant la sauvegarde
      tabs.forEach(tab => {
        tab.fields?.forEach(field => {
          if (field.isVirtual) {
            delete dataToSave[field.name];
          }
        });
      });

      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === '') dataToSave[key] = null;
      });

      delete dataToSave.created_at; 
      delete dataToSave.updated_at;
      delete dataToSave.owner_name; 
      delete dataToSave.world_name;

      let resultError = null;
      if (item?.id) {
        const { error: err } = await supabase.from(tableName).update(dataToSave).eq('id', item.id);
        resultError = err;
      } else {
        if (!dataToSave.id) delete dataToSave.id; 
        const { error: err } = await supabase.from(tableName).insert([dataToSave]);
        resultError = err;
      }

      if (resultError) throw resultError;
      onSuccess(); 
      onClose();
    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
      setError(err.message || "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col pointer-events-none">
        
        {/* BOUTONS LATERAUX DE SCROLL */}
        <div className="hidden lg:flex absolute -right-24 top-1/2 -translate-y-1/2 flex-col gap-4 z-[60] pointer-events-auto">
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); scrollContent('up'); }} 
              className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer"
            >
               <ChevronUp size={32} />
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); scrollContent('down'); }} 
              className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:translate-y-1 hover:scale-110 active:scale-95 cursor-pointer"
            >
               <ChevronDown size={32} />
            </button>
        </div>

        <div className="relative w-full h-full bg-[#0f111a] rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_0_80px_-10px_rgba(45,212,191,0.2)] border border-white/10 animate-in zoom-in-95 duration-300 pointer-events-auto">
          
          <FormHeader 
            config={config} 
            formData={formData} 
            item={item} 
            onAutoGenerate={handleAutoGenerate} 
            onClose={onClose} 
          />

          <TabsNavigation 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          <div className="relative flex-1 bg-[#0f111a] min-h-0 w-full overflow-hidden">
             <div ref={contentRef} className="absolute inset-0 overflow-y-auto scroll-smooth p-10 pb-40 [&::-webkit-scrollbar]:hidden">
                <form id="entity-form" onSubmit={handleSubmit}>
                   {error && (
                     <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-4 animate-in slide-in-from-top-4">
                        <Skull size={20} /> {error}
                     </div>
                   )}

                   {/* --- GRILLE INTELLIGENTE DU FORMULAIRE --- */}
                   <div className="max-w-4xl mx-auto">
                      {(!currentTab?.fields || currentTab.fields.length === 0) && (
                         <div className="text-center py-20 text-silver/20 italic border-2 border-dashed border-white/5 rounded-3xl">Aucune donnée n'est requise.</div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {currentTab?.fields?.map(field => {
                          const isFullWidth = ['textarea', 'image', 'images', 'custom', 'relation-list', 'stats-editor'].includes(field.type) || field.name === 'data';

                          return (
                            <div key={field.name} className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}`}>
                              <FieldRenderer 
                                field={field} 
                                formData={formData} 
                                handleChange={handleChange}
                                setFormData={setFormData} // PASSAGE DE LA FONCTION POUR LES CHAMPS CUSTOM
                              />
                            </div>
                          );
                        })}
                      </div>
                   </div>

                </form>
             </div>

             <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#0f111a] via-[#0f111a] to-transparent pointer-events-none flex justify-end z-20">
                <div className="pointer-events-auto flex gap-6 items-center">
                  <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-silver/60 hover:text-white hover:bg-white/5 transition-all">Annuler</button>
                  <button 
                    type="submit" 
                    form="entity-form"
                    disabled={loading} 
                    className={`flex items-center gap-4 px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all ${
                      loading 
                        ? 'bg-gray-800 cursor-not-allowed text-gray-500' 
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-teal-500/20'
                    }`}
                  >
                    {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                    {loading ? 'Incantation...' : 'Enregistrer le Destin'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}