import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { Sparkles, Clock, Calendar as CalendarIcon, Info, X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

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
 * CalendarsLayout - Standard PRESTIGE 4.5.9 (ÉPURE & NUCLEAR RESOLVER)
 */
export default function CalendarsLayout({ item, config, activeTab, renderFieldValue }) {
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

    const isGraphic = field.type === 'images' || field.name === 'image_url' || field.name === 'dynamic_celestial' || field.name === 'months' || field.name === 'horoscope_display';
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

    // Résolution Ruleset
    if (field.name === 'ruleset_id' && rawValue && field.options) {
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
          ONGLET 1 : GÉNÉRAL (Layout Triple Colonne ÉPURÉ)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* Col 1 : Visuel (4/12) */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Emblème Temporel</label>
              <div className="h-[calc(100%-24px)] rounded-[3rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 : Identité (5/12) */}
            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-8 h-full content-start">
                <div className="pb-4 border-b border-white/5">
                  <label className={labelStyle}>Désignation</label>
                  <div className="text-white font-black text-3xl uppercase tracking-widest px-1">
                    {smartRender(getField('name'))}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Système de Règles</label>
                  <div className={plainTextStyle}>{smartRender(getField('ruleset_id'))}</div>
                </div>

                {/* Propriétés célestes dynamiques */}
                <div className="mt-2 bg-teal-500/5 p-8 rounded-[2.5rem] border border-teal-500/10 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={40} className="text-teal-400" /></div>
                   <label className={labelStyle}>Propriétés Célestes</label>
                   <div className="py-2">{renderFieldValue(getField('dynamic_celestial'))}</div>
                </div>
              </div>
            </div>

            {/* Col 3 : Monde (3/12) */}
            <div className="md:col-span-3">
              <label className={labelStyle}>Monde lié</label>
              <div className={plainTextStyle + " text-teal-400 font-black uppercase tracking-widest"}>
                {smartRender(getField('world_id'))}
              </div>
            </div>
          </div>
          
          <div className="w-full pt-10 border-t border-white/5">
            <label className={labelStyle}>Contexte Historique</label>
            <div className={descriptionStyle}>{smartRender(getField('description'))}</div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : STRUCTURE DES CYCLES (ÉPURE)
          ================================================================== */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-10">
             <div className="flex items-center gap-3 mb-4 px-1">
                <Clock className="text-teal-400" size={20} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Mécaniques du Temps</h4>
             </div>
             <div className="grid grid-cols-1 gap-8">
               {['days_per_week', 'days_per_month', 'seasons'].map(name => (
                 <div key={name}>
                   <label className={labelStyle}>{getField(name)?.label || name}</label>
                   <div className={plainTextStyle}>{smartRender(getField(name))}</div>
                 </div>
               ))}
             </div>
          </div>
          <div className="rounded-[3rem] bg-black/10 p-8 border border-white/10 shadow-2xl">
            <label className={labelStyle}>Séquence des Mois configurée</label>
            <div className="py-4">
              {renderFieldValue(getField('months'))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 3 : DATE & HOROSCOPE (Maintenu avec Épure)
          ================================================================== */}
      {activeTab === 'horoscope' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-teal-500/5 rounded-[3.5rem] border border-teal-500/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Sparkles size={120} className="text-teal-400" />
            </div>
            
            <div className="flex flex-col items-center justify-center p-10 bg-black/40 rounded-[2.5rem] border border-white/5">
              <span className={labelStyle + " mb-4"}>Jour</span>
              <span className="text-7xl font-black text-white drop-shadow-2xl">{item.current_day || '01'}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-10 bg-teal-500/20 rounded-[2.5rem] border border-teal-500/30 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-4 text-center">Cycle Actuel</span>
              <span className="text-3xl font-black text-teal-300 uppercase tracking-tighter text-center leading-tight">
                {item.current_month || 'Inconnu'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-10 bg-black/40 rounded-[2.5rem] border border-white/5">
              <span className={labelStyle + " mb-4"}>Année</span>
              <span className="text-7xl font-black text-white drop-shadow-2xl">{item.current_year || '1000'}</span>
            </div>
          </div>

          <div className="w-full">
             <label className={labelStyle}>Aperçu de la Voûte Céleste & Horoscope</label>
             <div className="mt-6">
                {renderFieldValue(getField('horoscope_display'))}
             </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS : FESTIVALS & MJ
          ================================================================== */}
      {!['general', 'structure', 'horoscope'].includes(activeTab) && (
        <div className="space-y-12">
          {activeTab === 'gm' && (
            <div className="flex items-center gap-3 text-red-500/80 mb-4 px-1">
              <Shield size={18} />
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Archives Chronologiques MJ</h4>
            </div>
          )}
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'custom' ? "" : descriptionStyle}>
                {smartRender(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}