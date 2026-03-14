import React, { useState, useEffect, useRef } from 'react';
import { Loader, Skull, Save, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateCharacterData, calculateCombatStats } from '../../utils/rulesEngine';

import FormHeader from './FormHeader';
import TabsNavigation from './TabsNavigation';
import VTTDialog from '../VTTDialog'; 
import MediaLibrary from '../MediaLibrary';

// --- IMPORTS DES LAYOUTS ---
import WorldForm from './layouts/WorldForm';
import ContinentForm from './layouts/ContinentForm';
import CountryForm from './layouts/CountryForm';
import CityForm from './layouts/CityForm';
import VillageForm from './layouts/VillageForm';
import LocationForm from './layouts/LocationForm';
import OceanForm from './layouts/OceanForm';
import DeityForm from './layouts/DeityForm';
import CalendarsForm from './layouts/CalendarsForm';
import CelestialBodiesForm from './layouts/CelestialBodiesForm'; 
import RacesForm from './layouts/RacesForm';
import MonstersForm from './layouts/MonstersForm'; 
import DefaultForm from './layouts/DefaultForm';

/**
 * EnhancedEntityForm - Standard PRESTIGE 4.5.2 (Safe-Action & Symmetry)
 * Intègre la suppression isolée et la synchronisation visuelle totale.
 */
export default function EnhancedEntityForm({
  isOpen, onClose, onSuccess, item = null, config, readOnly = false
}) {
  const { tableName, tabs } = config;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'identity');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState(null);

  const [dialog, setDialog] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'alert',
    onConfirm: null 
  });

  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  // --- LOGIQUE D'INITIALISATION (CONSERVÉE À 100%) ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      if (item) {
        const loadedData = { 
          ...item,
          data: item.data || {} 
        };
        
        tabs.forEach(tab => {
          tab.fields?.forEach(field => {
            if (field.type === 'images') {
              let val = loadedData[field.name];
              if (typeof val === 'string') {
                try { val = JSON.parse(val); } catch(e) { val = {}; }
              }
              
              const cleanObj = {};
              const defaultCat = field.categories?.[0]?.id || 'default';
              
              if (field.categories) {
                field.categories.forEach(cat => { cleanObj[cat.id] = []; });
              } else {
                cleanObj[defaultCat] = [];
              }

              if (Array.isArray(val)) {
                cleanObj[defaultCat] = val.filter(u => u && typeof u === 'string' && u.trim() !== '' && !u.includes('null') && !u.includes('undefined'));
              } else if (typeof val === 'object' && val !== null) {
                Object.keys(val).forEach(key => {
                  const arr = Array.isArray(val[key]) ? val[key] : [];
                  const cleanArr = arr.filter(u => u && typeof u === 'string' && u.trim() !== '' && !u.includes('null') && !u.includes('undefined'));
                  if (cleanObj.hasOwnProperty(key)) {
                    cleanObj[key] = [...cleanObj[key], ...cleanArr];
                  } else {
                    cleanObj[defaultCat] = [...cleanObj[defaultCat], ...cleanArr];
                  }
                });
              }
              loadedData[field.name] = cleanObj;
            }
          });
        });
        setFormData(loadedData);
      } else {
        const activeWorldId = localStorage.getItem('activeWorldId');
        const initialData = { 
          ruleset_id: localStorage.getItem('activeRuleset') || 'dnd5', 
          data: {},
          _world_links: (activeWorldId && activeWorldId !== 'all') ? [activeWorldId] : []
        };

        tabs.forEach(tab => {
          tab.fields?.forEach(field => {
            if (field.type === 'images') {
              const obj = {};
              if (field.categories) {
                  field.categories.forEach(cat => { obj[cat.id] = []; });
              }
              initialData[field.name] = obj;
            } else if (field.name === 'character_type') {
              initialData[field.name] = 'PJ';
            } else if (field.name === 'level') {
              initialData[field.name] = 1;
            } else if (!initialData[field.name] && !field.isVirtual) {
              initialData[field.name] = '';
            }
          });
        });
        setFormData(initialData);
      }
      setError(null);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, item, tabs, tableName]);

  if (!isOpen) return null;

  // --- ACTIONS ---

  const handleOpenPicker = (fieldName) => {
    setMediaTargetField(fieldName);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (url) => {
    if (mediaTargetField) {
      setFormData(prev => ({ ...prev, [mediaTargetField]: url }));
    }
    setIsMediaPickerOpen(false);
    setMediaTargetField(null);
  };

  // CORRECTIF : Gestion de la suppression isolée
  const handleDelete = async () => {
    setDialog({
      isOpen: true,
      type: 'confirm',
      title: 'Désintégration de l\'Entité',
      message: `Êtes-vous certain de vouloir effacer définitivement "${formData?.name || item?.name}" ? Cette action est irréversible dans tout le multivers.`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const { error: delError } = await supabase.from(tableName).delete().eq('id', item.id);
          if (delError) throw delError;
          setDialog({ isOpen: false });
          onSuccess();
          onClose();
        } catch (err) {
          setError("Échec de la désintégration : " + err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleAutoGenerate = async () => {
    if (!formData.ruleset_id || !formData.race_id || !formData.class_id) {
      setDialog({
        isOpen: true,
        type: 'alert',
        title: 'Forge Arcanique',
        message: 'Accès refusé : vous devez sélectionner le Système de Règles, la Race et la Classe avant d\'éveiller ce héros.'
      });
      return;
    }
    setLoading(true);
    try {
      const { data: race } = await supabase.from('races').select('name').eq('id', formData.race_id).single();
      const { data: cl } = await supabase.from('character_classes').select('name').eq('id', formData.class_id).single();
      const forge = generateCharacterData(formData.ruleset_id, race?.name, cl?.name);
      const derived = calculateCombatStats(formData.ruleset_id, forge.stats, formData.level || 1);
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
    setError(null);
    try {
      const dataToSave = { ...formData };
      
      const worldLinks = dataToSave._world_links || [];
      delete dataToSave._world_links; 

      tabs.forEach(tab => tab.fields?.forEach(field => {
        if (field.isVirtual) delete dataToSave[field.name];
        if (field.type === 'relation' && dataToSave[field.name] === '') dataToSave[field.name] = null;
      }));

      if (!dataToSave.data || typeof dataToSave.data !== 'object') {
        dataToSave.data = {};
      }

      const imgFields = ['world_images', 'continent_images', 'country_images', 'city_images', 'village_images', 'location_images', 'deity_images', 'celestial_images', 'animal_images', 'recipe_images', 'race_images', 'monster_images'];
      imgFields.forEach(fieldName => {
        if (dataToSave[fieldName]) {
          Object.keys(dataToSave[fieldName]).forEach(cat => {
            if (Array.isArray(dataToSave[fieldName][cat])) {
              dataToSave[fieldName][cat] = dataToSave[fieldName][cat].filter(u => u && typeof u === 'string' && u.trim() !== '');
            }
          });
        }
      });

      let result;
      if (item?.id) {
        result = await supabase.from(tableName).update(dataToSave).eq('id', item.id).select();
      } else {
        result = await supabase.from(tableName).insert([dataToSave]).select();
      }

      if (result.error) throw result.error;

      const savedItem = result.data[0];
      const entityId = savedItem.id;

      await supabase.from('world_links').delete().eq('entity_id', entityId).eq('entity_type', tableName);

      if (worldLinks.length > 0) {
        const linksToInsert = worldLinks.map(wId => ({
          world_id: wId,
          entity_id: entityId,
          entity_type: tableName
        }));
        const { error: linkError } = await supabase.from('world_links').insert(linksToInsert);
        if (linkError) throw linkError;
      }

      onSuccess(); 
      onClose();
    } catch (err) { 
      console.error("Erreur technique de sauvegarde :", err);
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const layoutProps = { 
    formData, 
    activeTab, 
    handleChange, 
    setFormData, 
    config, 
    contentRef,
    readOnly,
    onOpenPicker: handleOpenPicker 
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      <VTTDialog 
        {...dialog} 
        onClose={() => setDialog({ ...dialog, isOpen: false })} 
      />

      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-[#08090f]/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-6xl h-[700px] bg-[#242643] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <ImageIcon className="text-[#2DD4BF]" /> Archives visuelles : <span className="text-[#2DD4BF]">{tableName}</span>
              </h2>
              <button onClick={() => setIsMediaPickerOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
               <MediaLibrary onSelect={handleMediaSelect} />
            </div>
          </div>
        </div>
      )}

      <div ref={overlayRef} className="absolute inset-0 bg-[#08090f]/80 backdrop-blur-xl animate-in fade-in duration-500 cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full h-full max-w-7xl bg-[#242643] sm:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
        
        {/* CORRECTIF : onDelete est maintenant passé au FormHeader */}
        <FormHeader 
          config={config} 
          formData={formData} 
          item={item} 
          onAutoGenerate={handleAutoGenerate} 
          onClose={onClose} 
          onDelete={item?.id ? handleDelete : null}
        />
        
        <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex overflow-hidden relative">
          <div ref={contentRef} className="flex-1 overflow-y-auto p-10 lg:pl-16 lg:pr-24 pb-32 scroll-smooth scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
             <form id="entity-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto">
                {error && (
                  <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold flex items-center gap-4 animate-shake">
                    <Skull size={20} /> {error}
                  </div>
                )}

                {/* --- DISPATCHER PRESTIGE 4.2 --- */}
                {tableName === 'worlds' ? <WorldForm {...layoutProps} /> : 
                 tableName === 'continents' ? <ContinentForm {...layoutProps} /> : 
                 tableName === 'countries' ? <CountryForm {...layoutProps} /> : 
                 tableName === 'cities' ? <CityForm {...layoutProps} /> :
                 tableName === 'villages' ? <VillageForm {...layoutProps} /> :
                 tableName === 'locations' ? <LocationForm {...layoutProps} /> :
                 tableName === 'oceans' ? <OceanForm {...layoutProps} /> :
                 tableName === 'deities' ? <DeityForm {...layoutProps} /> : 
                 tableName === 'calendars' ? <CalendarsForm {...layoutProps} /> : 
                 tableName === 'celestial_bodies' ? <CelestialBodiesForm {...layoutProps} /> : 
                 tableName === 'races' ? <RacesForm {...layoutProps} /> : 
                 tableName === 'monsters' ? <MonstersForm {...layoutProps} /> : 
                 <DefaultForm {...layoutProps} />}
             </form>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#242643] via-[#242643] to-transparent pointer-events-none flex justify-end z-[100]">
             <div className="pointer-events-auto flex gap-6 items-center">
               <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white/30 hover:text-white transition-all">
                 Annuler
               </button>
               {!readOnly && (
                 <button 
                   type="submit" 
                   form="entity-form" 
                   disabled={loading} 
                   className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 active:scale-95 shadow-teal-500/20 disabled:opacity-50"
                 >
                   {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />} Sauvegarder
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}