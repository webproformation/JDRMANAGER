// src/components/EnhancedEntityForm.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  X, Save, Edit, Image as ImageIcon, 
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, 
  AlertCircle, Loader, Trash2, Zap, Search, Plus, Minus 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import ImagePicker from './ImagePicker'; 
import RelationSelect from './RelationSelect'; 
import StaticSelect from './StaticSelect'; 
import { generateCharacterData, calculateCombatStats } from '../utils/rulesEngine';

// --- COMPOSANT : SÉLECTION MULTIPLE (SORTS, TALENTS, CAPACITÉS) ---
const RelationListSelect = ({ table, value = [], onChange, filterBy, filterValue }) => {
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        let query = supabase.from(table).select('id, name');
        if (filterBy && filterValue) query = query.eq(filterBy, filterValue);
        const { data, error } = await query.order('name');
        if (error) throw error;
        setOptions(data || []);
      } catch (err) { console.error("Erreur Liste:", err); }
      finally { setLoading(false); }
    };
    fetchOptions();
  }, [table, filterBy, filterValue]);

  const toggleItem = (id) => {
    const newValue = value.includes(id) ? value.filter(i => i !== id) : [...value, id];
    onChange(newValue);
  };

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#151725] rounded-xl border border-white/5 overflow-hidden shadow-inner">
      <div className="p-3 border-b border-white/5 bg-black/20 flex items-center gap-2">
        <Search size={14} className="text-teal-500/50" />
        <input 
          type="text" 
          placeholder="Rechercher dans la base de données..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[11px] text-white w-full placeholder-silver/20"
        />
      </div>
      <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-1 scrollbar-none">
        {loading ? (
          <div className="col-span-2 py-4 text-center text-silver/30 text-[10px] animate-pulse uppercase font-bold">Forge en cours...</div>
        ) : filtered.map(opt => (
          <button
            key={opt.id} 
            type="button" 
            onClick={() => toggleItem(opt.id)}
            className={`flex items-center justify-between p-2 rounded-lg text-left transition-all ${value.includes(opt.id) ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'hover:bg-white/5 text-silver/60 border border-transparent'}`}
          >
            <span className="text-[10px] font-bold uppercase truncate">{opt.name}</span>
            {value.includes(opt.id) ? <Minus size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- COMPOSANT INTERNE : Textarea Auto-Extensible ---
const AutoResizingTextarea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} overflow-hidden resize-none min-h-[100px]`}
      rows={1}
    />
  );
};

export default function EnhancedEntityForm({
  isOpen,
  onClose,
  onSuccess,
  item = null,
  config
}) {
  const { 
    entityName, tableName, tabs, 
    imageCategories = [], getHeaderColor, getHeaderIcon 
  } = config;

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'identity');
  const [activeImageCategory, setActiveImageCategory] = useState(imageCategories[0]?.id || null);
  
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  // --- INITIALISATION ---
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
      } else {
        const initialData = { level: 1, experience: 0, ruleset_id: 'dnd5', character_type: 'PJ' };
        tabs.forEach(tab => {
          tab.fields?.forEach(field => {
            if (field.type === 'images') initialData[field.name] = {};
            else if (!initialData[field.name]) initialData[field.name] = '';
          });
        });
        setFormData(initialData);
      }
      setError(null);
    }
  }, [isOpen, item, tabs]);

  if (!isOpen) return null;

  // --- LOGIQUE DE FORGE DIVINE ---
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
    } catch (err) { console.error(err); setError("Échec de la forge."); }
    finally { setLoading(false); }
  };

  // --- SCROLL ---
  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const amount = 200;
      tabsRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 300;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  // --- GESTION DONNÉES ---
  const handleChange = (name, value) => {
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'level' && prev.data) {
        const derived = calculateCombatStats(prev.ruleset_id, prev.data, value);
        newState.data = { ...prev.data, ...derived };
      }
      return newState;
    });
  };

  const handleGalleryAdd = (fieldName, categoryId, url) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [categoryId]: [...(prev[fieldName]?.[categoryId] || []), url]
      }
    }));
  };

  const handleGalleryRemove = (fieldName, categoryId, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        [categoryId]: prev[fieldName]?.[categoryId]?.filter((_, i) => i !== indexToRemove) || []
      }
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSave = { ...formData };
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === '') dataToSave[key] = null;
      });

      delete dataToSave.created_at; 
      delete dataToSave.updated_at;

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
      onSuccess(); onClose();
    } catch (err) {
      console.error("Erreur Sauvegarde:", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDU CHAMPS ---
  const renderField = (field) => {
    const value = formData[field.name];
    const inputClass = "w-full bg-[#151725] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder-silver/30 outline-none";
    const labelClass = "block text-xs font-bold text-teal-400 uppercase tracking-widest mb-2 ml-1";

    switch (field.type) {
      case 'relation-list':
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <RelationListSelect 
               table={field.table} 
               value={formData.data?.[field.key] || []} 
               onChange={(newList) => handleChange('data', { ...formData.data, [field.key]: newList })}
               filterBy={field.filterBy}
               filterValue={formData[field.filterBy]}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label} {field.required && '*'}</label>
            <AutoResizingTextarea
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label} {field.required && '*'}</label>
            <StaticSelect options={field.options} value={value} onChange={(val) => handleChange(field.name, val)} placeholder={field.placeholder} />
          </div>
        );

      case 'relation':
        if (!field.table) return null;
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label} {field.required && '*'}</label>
            <RelationSelect 
                table={field.table} 
                value={value} 
                onChange={(val) => handleChange(field.name, val)} 
                placeholder={field.placeholder} 
                filterBy={field.filterBy} 
                filterValue={formData[field.filterValue]} 
                required={field.required}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <ImagePicker value={value || ''} onChange={(url) => handleChange(field.name, url)} folder={field.bucket || 'images'} label={null} />
          </div>
        );

      case 'images':
        return (
          <div className="space-y-4 mt-4 bg-[#151725]/50 p-4 rounded-xl border border-white/5">
            <h3 className={labelClass}>{field.label}</h3>
            <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
              {field.categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveImageCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeImageCategory === cat.id ? 'bg-teal-600 text-white' : 'bg-white/5 text-silver'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {field.categories.map(cat => {
               if (activeImageCategory !== cat.id) return null;
               const currentImages = formData[field.name]?.[cat.id] || [];
               return (
                 <div key={cat.id} className="pt-4 space-y-4">
                    <ImagePicker 
                        value="" 
                        onChange={(url) => { if(url) handleGalleryAdd(field.name, cat.id, url); }}
                        label={`Ajouter à ${cat.label}`}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {currentImages.map((url, idx) => (
                            <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-white/10">
                                <img src={url} className="w-full h-full object-cover" alt="" />
                                <button type="button" onClick={() => handleGalleryRemove(field.name, cat.id, idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded"><Trash2 size={12}/></button>
                            </div>
                        ))}
                    </div>
                 </div>
               )
            })}
          </div>
        );

      case 'custom':
        const Component = field.component;
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label}</label>
            <Component 
              value={formData[field.name] || {}} 
              onChange={(newVal) => handleChange(field.name, newVal)}
              formData={formData} 
              {...field.props} 
            />
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <label className={labelClass}>{field.label} {field.required && '*'}</label>
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={value || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={inputClass}
              required={field.required}
            />
          </div>
        );
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);
  const isTechnicalTab = ['stats', 'combat', 'magic'].includes(activeTab);
  const isLargeField = (f) => f.type === 'textarea' || f.type === 'image' || f.type === 'images' || f.type === 'custom' || f.type === 'relation-list';

  // Logique mainFields/sideFields préservée
  const mainFields = isTechnicalTab ? currentTab?.fields || [] : currentTab?.fields.filter(f => isLargeField(f)) || [];
  const sideFields = isTechnicalTab ? [] : currentTab?.fields.filter(f => !isLargeField(f)) || [];

  const HeaderIcon = getHeaderIcon ? getHeaderIcon(formData) : null;
  const headerColor = getHeaderColor ? getHeaderColor(formData) : 'from-teal-900/50 to-cyan-900/50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col pointer-events-none">
        
        {/* BOUTONS LATERAUX DE SCROLL PRESERVES */}
        <div className="hidden lg:flex absolute -right-24 top-1/2 -translate-y-1/2 flex-col gap-4 z-[60] pointer-events-auto">
             <button type="button" onClick={(e) => { e.stopPropagation(); scrollContent('up'); }} className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer">
                <ChevronUp size={32} />
             </button>
             <button type="button" onClick={(e) => { e.stopPropagation(); scrollContent('down'); }} className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all hover:translate-y-1 hover:scale-110 active:scale-95 cursor-pointer">
                <ChevronDown size={32} />
             </button>
        </div>

        {/* MODALE INTEGRALE */}
        <div className="relative w-full h-full bg-[#1a1d2d] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_-10px_rgba(45,212,191,0.15)] border border-teal-500/20 animate-in zoom-in-95 duration-300 pointer-events-auto">
          
          {/* HEADER AVEC ZAP BUTTON */}
          <div className="relative h-40 shrink-0 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${headerColor}`}>
              {formData.image_url && <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2d] via-[#1a1d2d]/20 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-lg">
                     {HeaderIcon ? <HeaderIcon size={32} className="text-teal-400" /> : <Edit size={32} className="text-silver" />}
                  </div>
                  <div>
                     <p className="text-teal-400 font-bold text-xs tracking-[0.2em] uppercase mb-1">{item ? 'Modification du Héros' : 'Forge du Destin'}</p>
                     <h1 className="text-3xl font-bold text-white tracking-tight">{formData.name || (item ? 'Sans nom' : `Nouveau ${entityName}`)}</h1>
                  </div>
               </div>
               
               {!item && (
                 <button 
                   type="button" 
                   onClick={handleAutoGenerate} 
                   className="px-6 py-3 bg-teal-500 text-white rounded-xl font-black uppercase hover:bg-teal-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.4)] animate-pulse"
                 >
                   <Zap size={18} fill="currentColor" /> Forger le Destin
                 </button>
               )}
            </div>
            <button type="button" onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-red-500/20 text-white rounded-full transition-all z-20"><X size={20} /></button>
          </div>

          {/* TABS AVEC SCROLL PRESERVE */}
          <div className="relative border-b border-white/5 bg-[#151725] shrink-0 z-10 flex items-center">
            <button type="button" onClick={() => scrollTabs('left')} className="p-3 text-silver hover:bg-white/5"><ChevronLeft size={20}/></button>
            <div ref={tabsRef} className="flex-1 flex items-center overflow-x-hidden scroll-smooth px-2">
                {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-silver/50 hover:text-silver'}`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />}
                    </button>
                ))}
            </div>
            <button type="button" onClick={() => scrollTabs('right')} className="p-3 text-silver hover:bg-white/5"><ChevronRight size={20}/></button>
          </div>

          {/* CONTENU AVEC MAIN/SIDE FIELDS PRESERVES */}
          <div className="relative flex-1 bg-[#1a1d2d] min-h-0 w-full">
             <div ref={contentRef} className="absolute inset-0 overflow-y-auto scroll-smooth p-8 pb-32 [&::-webkit-scrollbar]:hidden">
                <form id="entity-form" onSubmit={handleSubmit}>
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className={isTechnicalTab ? "lg:col-span-12 space-y-8" : "lg:col-span-8 space-y-8"}>
                         {mainFields.length === 0 && sideFields.length === 0 && (
                            <div className="text-center py-10 text-silver/30 italic border-2 border-dashed border-white/5 rounded-xl">Cet onglet est vide.</div>
                         )}
                         {mainFields.map(field => <div key={field.name} className="animate-in fade-in slide-in-from-bottom-2 duration-500">{renderField(field)}</div>)}
                      </div>
                      {!isTechnicalTab && sideFields.length > 0 && (
                        <div className="lg:col-span-4 space-y-6">
                           <div className="bg-[#22263a]/50 border border-white/5 rounded-xl p-6 shadow-xl sticky top-0 shadow-inner">
                              <h3 className="text-xs font-bold text-silver/50 uppercase tracking-widest border-b border-white/5 pb-4 mb-6">Propriétés</h3>
                              <div className="space-y-6">{sideFields.map(field => <div key={field.name}>{renderField(field)}</div>)}</div>
                           </div>
                        </div>
                      )}
                   </div>
                </form>
             </div>

             {/* FOOTER FIXE */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a1d2d] via-[#1a1d2d] to-transparent pointer-events-none flex justify-end z-20">
                <div className="pointer-events-auto flex gap-4">
                  <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm text-silver hover:bg-white/5 transition-all">Annuler</button>
                  <button 
                    type="submit" 
                    form="entity-form"
                    disabled={loading} 
                    className={`flex items-center gap-3 px-10 py-3 rounded-xl font-bold uppercase tracking-wider shadow-xl transition-all ${loading ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105 shadow-cyan-500/20'}`}
                  >
                    {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
                    {loading ? 'Sauvegarde...' : 'Enregistrer le Destin'}
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}