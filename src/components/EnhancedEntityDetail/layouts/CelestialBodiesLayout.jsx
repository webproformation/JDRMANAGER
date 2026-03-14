import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { Star, Info, X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

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
          <div className="p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 flex-1 bg-[#0f111a]">
            {item.image_url && (
              <div className="mb-8 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/20 shrink-0 shadow-2xl">
                <img src={item.image_url} alt={item.name} className="w-full h-64 sm:h-80 object-cover object-center shadow-2xl" />
              </div>
            )}
            <div className="text-silver text-base sm:text-lg leading-relaxed font-medium">
              {item.description ? item.description.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>) : <span className="italic opacity-50 block text-center py-10">Aucune description disponible.</span>}
            </div>
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
 * CelestialBodiesLayout - Standard PRESTIGE 4.5.9 (ÉPURE & NUCLEAR RESOLVER)
 */
export default function CelestialBodiesLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  // STYLES PURS PRESTIGE
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-2 block ml-1";
  const nameTextStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[12px] md:text-[14px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[12px] md:text-[14px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.9)
   */
  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || field.name === 'dynamic_celestial' || field.name === 'data';
    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];

    // --- RÉSOLUTION FORCEE DU MONDE ---
    if (field.name === 'world_id') {
        if (item.world_links && Array.isArray(item.world_links) && item.world_links.length > 0) {
            const worldIds = item.world_links.map(l => l.world_id).filter(Boolean);
            return <RelationListDisplay tableName="worlds" ids={worldIds} />;
        }
        if (rawValue && rawValue !== '—') return <RelationDisplay tableName="worlds" id={rawValue} />;
    }

    // Résolution Options (Ruleset, Body Type)
    if (rawValue && field.options) {
        const opt = field.options.find(o => String(o.value) === String(rawValue));
        if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    if (Array.isArray(rawValue)) return rawValue.length === 0 ? "—" : rawValue.join(" | ");

    return String(rawValue);
  };

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Layout 4/12 ÉPURÉ)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* Col 1 : Image (4/12) */}
            <div className="md:col-span-4 h-full min-h-[400px]">
              <label className={labelStyle}>Observation Céleste</label>
              <div className="h-[calc(100%-24px)] rounded-[3rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 & 3 : Détails (8/12) */}
            <div className="md:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full content-start">
                <div className="md:col-span-3 pb-4 border-b border-white/5">
                  <label className={labelStyle}>Nom de l'Astre</label>
                  <div className="text-white font-black text-3xl uppercase tracking-widest px-1">
                    {smartRender(getField('name'))}
                  </div>
                </div>

                {['subtitle', 'body_type', 'ruleset_id', 'world_id'].map(name => {
                  const f = getField(name);
                  if (!f) return null;
                  return (
                    <div key={name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={plainTextStyle}>{smartRender(f)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Spécificités Système */}
              <div className="mt-2 bg-teal-500/5 p-8 rounded-[2.5rem] border border-teal-500/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Star size={40} className="text-teal-400" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-teal-500/30"></div>
                  Propriétés du Système
                </h4>
                <div className="py-2">
                  {renderFieldValue(getField('dynamic_celestial'))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full pt-10 border-t border-white/5">
            <label className={labelStyle}>Analyse et Description</label>
            <div className={descriptionStyle}>
              {smartRender(getField('description'))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : ASTROPHYSIQUE (ÉPURE)
          ================================================================== */}
      {activeTab === 'physical' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">
          {['color', 'size', 'brightness', 'orbital_period', 'phases'].map(name => {
            const f = getField(name);
            if (!f) return null;
            return (
              <div key={name} className={name === 'phases' ? "md:col-span-2" : "w-full"}>
                <label className={labelStyle}>{f.label}</label>
                <div className={name === 'phases' ? descriptionStyle : plainTextStyle}>
                  {smartRender(f)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================
          ONGLET 3 : INFLUENCES ET VTT (ÉPURE)
          ================================================================== */}
      {activeTab === 'influence' && (
        <div className="space-y-12">
          <div className="w-full">
             <label className={labelStyle}>Modificateurs Environnementaux (Temps Réel)</label>
             <div className="py-4">
                {renderFieldValue(getField('data'))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
            {['astrological_influence', 'magical_properties', 'cultural_significance'].map(name => {
              const f = getField(name);
              return f ? (
                <div key={name} className="space-y-4">
                  <label className={labelStyle}>{f.label}</label>
                  <div className={descriptionStyle + " italic text-silver/70"}>
                    {smartRender(f)}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS : GALERIE ET MJ
          ================================================================== */}
      {!['general', 'physical', 'influence'].includes(activeTab) && (
        <div className="space-y-12">
          {activeTab === 'gm' && (
             <div className="flex items-center gap-3 text-red-500/80 mb-4 px-1">
               <Shield size={18} />
               <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Archives Célestes MJ</h4>
             </div>
          )}
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'images' ? "py-4" : descriptionStyle}>
                {smartRender(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}