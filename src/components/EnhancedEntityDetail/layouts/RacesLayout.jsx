import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { Fingerprint, Landmark, Sparkles, Users, Info, X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

/**
 * --- COMPOSANT DE RÉSOLUTION DYNAMIQUE : RelationDisplay ---
 * Va chercher le nom en base (ex: Krynn) si la jointure est absente.
 */
const RelationDisplay = ({ tableName, id }) => {
  const [item, setItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!id || !tableName) return;
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase.from(tableName).select('*').eq('id', id).maybeSingle();
        if (error) throw error;
        setItem(data);
      } catch (err) { console.error("Erreur relation:", err); }
    };
    fetchItem();
  }, [tableName, id]);

  if (!item) return <span className="text-silver/50 italic px-1">Chargement...</span>;

  const popupContent = showInfo && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.25em] flex items-center gap-4">
               <Info className="text-teal-400 shrink-0" size={28} /> 
               <span className="truncate">{item.name}</span>
             </h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all shrink-0"><X size={24} /></button>
          </div>
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-[#0f111a]">
            {item.image_url && <img src={item.image_url} alt={item.name} className="mb-8 w-full rounded-3xl h-64 object-cover shadow-2xl" />}
            <div className="text-silver text-base leading-relaxed">{item.description}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <span onClick={() => setShowInfo(true)} className="inline-flex items-center gap-2 text-teal-400 font-bold hover:underline hover:text-teal-300 cursor-pointer transition-colors px-1">
        {item.name} <Info size={14} className="opacity-60" />
      </span>
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </>
  );
};

/**
 * --- COMPOSANT DE RÉSOLUTION DYNAMIQUE : RelationListDisplay ---
 */
const RelationListDisplay = ({ tableName, ids = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!ids || ids.length === 0) { setItems([]); setLoading(false); return; }
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from(tableName).select('id, name').in('id', ids).order('name');
        if (error) throw error;
        setItems(data || []);
      } catch (err) { console.error("Erreur list:", err); } finally { setLoading(false); }
    };
    fetchItems();
  }, [tableName, ids]);
  if (loading) return <span className="text-xs text-silver/50 italic px-1">...</span>;
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {items.map((it) => (
        <span key={it.id} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-bold text-teal-300 uppercase tracking-widest">
          {it.name}
        </span>
      ))}
    </div>
  );
};

/**
 * RacesLayout - Standard PRESTIGE 4.5.9 (ÉPURE & NUCLEAR RESOLVER)
 */
export default function RacesLayout({ config, activeTab, renderFieldValue, formData }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // STYLES PURS PRESTIGE
  const labelStyle = "text-[9px] font-black text-amber-500/50 uppercase tracking-[0.3em] mb-2 block ml-1";
  const nameTextStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[12px] md:text-[14px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[12px] md:text-[14px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.9)
   */
  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || field.name === 'race_images' || field.name === 'image_url';
    if (isGraphic) return renderFieldValue(field);

    const rawValue = formData[field.name];

    // --- RÉSOLUTION FORCEE DU MONDE ---
    if (field.name === 'world_id') {
        if (formData.world_links && Array.isArray(formData.world_links) && formData.world_links.length > 0) {
            const worldIds = formData.world_links.map(l => l.world_id).filter(Boolean);
            return <RelationListDisplay tableName="worlds" ids={worldIds} />;
        }
        if (rawValue && rawValue !== '—') return <RelationDisplay tableName="worlds" id={rawValue} />;
    }

    // Résolution Options (Ruleset, Alignement)
    if (rawValue && field.options) {
        const opt = field.options.find(o => String(o.value) === String(rawValue));
        if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    if (Array.isArray(rawValue)) return rawValue.length === 0 ? "—" : rawValue.join(" | ");

    return String(rawValue);
  };

  const getField = (name) => {
    // On cherche d'abord dans l'onglet actif, puis dans toute la config si non trouvé
    let f = activeTabData?.fields.find(field => field.name === name);
    if (!f) {
        for (const tab of config.tabs) {
            f = tab.fields.find(field => field.name === name);
            if (f) break;
        }
    }
    return f;
  };

  const renderSection = (fieldNames) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {fieldNames.map(name => {
        const field = getField(name);
        return field ? (
          <div key={name}>
            <label className={labelStyle}>{field.label}</label>
            <div className={field.type === 'textarea' ? descriptionStyle : plainTextStyle}>
              {smartRender(field)}
            </div>
          </div>
        ) : null;
      })}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* ==================================================================
          1. GÉNÉRAL (Layout 4/12 ÉPURÉ)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Avatar (4/12) */}
            <div className="md:col-span-4">
               <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                  <img src={formData.image_url} alt="Race" className="w-full h-full object-cover" />
               </div>
            </div>

            {/* Détails (8/12) */}
            <div className="md:col-span-8 flex flex-col gap-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full content-start">
                  <div className="sm:col-span-2 pb-4 border-b border-white/5">
                    <label className={labelStyle}>Nom de la Race</label>
                    <div className="text-white font-black text-3xl uppercase tracking-widest px-1">
                      {smartRender(getField('name'))}
                    </div>
                  </div>

                  {['subtitle', 'ruleset_id', 'world_id'].map(n => (
                    <div key={n}>
                      <label className={labelStyle}>{getField(n)?.label || n}</label>
                      <div className={plainTextStyle}>{smartRender(getField(n))}</div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-2 pt-8 border-t border-white/5">
                  <label className={labelStyle}>Description Fondamentale</label>
                  <div className={descriptionStyle + " italic"}>
                    {smartRender(getField('description'))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. BIOLOGIE (ÉPURE)
          ================================================================== */}
      {activeTab === 'biology' && renderSection(['size', 'speed', 'lifespan', 'age', 'physical_description'])}

      {/* ==================================================================
          3. CULTURE (ÉPURE)
          ================================================================== */}
      {activeTab === 'culture' && renderSection(['languages', 'alignment', 'society_structure', 'naming_conventions'])}
      
      {/* ==================================================================
          4. CAPACITÉS (ÉPURE AMBRE)
          ================================================================== */}
      {activeTab === 'abilities' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {['traits', 'racial_abilities'].map(n => (
               <div key={n}>
                 <label className={labelStyle}>{getField(n)?.label || n}</label>
                 <div className={descriptionStyle + " text-amber-100/70"}>
                    {smartRender(getField(n))}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          5. GALERIE & MJ
          ================================================================== */}
      {activeTab === 'gallery' && <div className="py-4">{smartRender(getField('race_images') || activeTabData.fields[0])}</div>}
      
      {activeTab === 'gm' && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-red-500/80 mb-4 px-1">
            <Shield size={18} />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Archives Secrètes MJ</h4>
          </div>
          <div className={descriptionStyle + " text-red-100/60 italic p-8 bg-red-500/5 rounded-[2rem] border border-red-500/10"}>
            {smartRender(activeTabData.fields[0])}
          </div>
        </div>
      )}
    </div>
  );
}