import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF : On remonte 3 niveaux pour atteindre src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { History, CalendarDays, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import du moteur autonome V4
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * --- COMPOSANT DE SECOURS : RelationDisplay ---
 * Affiche le nom au lieu de l'ID pour les relations UNIQUES
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

  if (!item) return <span className="text-silver/50 italic">Chargement...</span>;

  const popupContent = showInfo && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
               <Info className="text-teal-400 shrink-0" size={28} /> 
               <span className="truncate">{item.name}</span>
             </h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all shrink-0"><X size={24} /></button>
          </div>
          <div className="p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 flex-1 bg-[#0f111a]">
            {item.image_url && (
              <div className="mb-8 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/20 shrink-0 shadow-2xl">
                <img src={item.image_url} alt={item.name} className="w-full h-64 sm:h-80 object-cover object-center" />
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
      <span onClick={() => setShowInfo(true)} className="inline-flex items-center gap-2 text-teal-400 font-bold hover:underline hover:text-teal-300 cursor-pointer transition-colors">
        {item.name} <Info size={14} className="opacity-60" />
      </span>
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </>
  );
};

/**
 * --- COMPOSANT DE SECOURS : RelationListDisplay ---
 * Liste de badges pour les relations MULTIPLES
 */
const RelationListDisplay = ({ tableName, ids = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) { setItems([]); setLoading(false); return; }
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from(tableName).select('*').in('id', ids).order('name');
        if (error) throw error;
        setItems(data || []);
      } catch (err) { console.error("Erreur list relation:", err); } finally { setLoading(false); }
    };
    fetchItems();
  }, [tableName, ids]);

  if (loading) return <span className="text-xs text-silver/50 italic">Incantation...</span>;
  if (items.length === 0) return <span className="text-xs text-silver/50 italic">—</span>;

  const handleOpenInfo = (idx) => { setCurrentIndex(idx); setShowInfo(true); };

  const popupContent = showInfo && items.length > 0 && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowInfo(false)} />
      <div className="relative z-10 flex items-center justify-center gap-6 w-full max-w-[1100px]">
        {items.length > 1 && <button onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)} className="p-5 bg-[#1a1d2d] text-teal-400 rounded-2xl border border-teal-500/30"><ChevronLeft size={32} /></button>}
        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#161926]">
             <h3 className="text-2xl font-black text-white uppercase tracking-widest">{items[currentIndex].name}</h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 text-white rounded-xl"><X size={24} /></button>
          </div>
          <div className="p-10 overflow-y-auto flex-1">
            {items[currentIndex].image_url && <img src={items[currentIndex].image_url} className="mb-8 w-full rounded-3xl h-80 object-cover shadow-2xl" />}
            <div className="text-silver text-lg leading-relaxed">{items[currentIndex].description || "Aucune description."}</div>
          </div>
        </div>
        {items.length > 1 && <button onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)} className="p-5 bg-[#1a1d2d] text-teal-400 rounded-2xl border border-teal-500/30"><ChevronRight size={32} /></button>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <span key={it.id} onClick={() => handleOpenInfo(idx)} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-bold text-teal-300 uppercase cursor-pointer flex items-center gap-2">
          {it.name} <Info size={12} className="opacity-50" />
        </span>
      ))}
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
};

/**
 * ContinentLayout - Standard PRESTIGE 4.5.9 (NUCLEAR RESOLUTION)
 */
export default function ContinentLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component || f.type === 'world_history_editor') || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-2 block ml-1";
  const nameTextStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[12px] md:text-[14px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[12px] md:text-[14px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || field.name === 'image_url' || field.name === 'continent_countries' || field.name === 'continent_images' || field.type === 'world_history_editor';
    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];

    // --- RÉSOLUTION DU MONDE ---
    if (field.name === 'world_id') {
        if (item.world_links && Array.isArray(item.world_links) && item.world_links.length > 0) {
            const worldIds = item.world_links.map(l => l.world_id).filter(Boolean);
            if (worldIds.length > 0) return <RelationListDisplay tableName="worlds" ids={worldIds} />;
        }
        if (rawValue && rawValue !== '—') {
            return <RelationDisplay tableName="worlds" id={rawValue} />;
        }
    }

    if (field.name === 'ruleset_id') {
        const ruleName = item.rulesets?.name || item.ruleset?.name || item.ruleset_name;
        if (ruleName) return ruleName;
    }

    if (rawValue && field.options) {
      const opt = field.options.find(o => String(o.value) === String(rawValue));
      if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    if (Array.isArray(rawValue)) return rawValue.length === 0 ? "—" : rawValue.join(" | ");
    
    return String(rawValue);
  };

  return (
    <div className="animate-in fade-in duration-500 h-auto w-full pb-24">
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                <div className="absolute inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
                  {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
                </div>
              </div>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12 h-full content-start">
                {['name', 'subtitle', 'world_id', 'ruleset_id'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  if (!f) return null;
                  return (
                    <div key={f.name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={name === 'name' ? nameTextStyle : plainTextStyle}>{smartRender(f)}</div>
                    </div>
                  );
                })}
              </div>
              {visibleFields.find(f => f.name === 'dynamic_geo') && (
                <div className="mt-2 pt-8 border-t border-white/5">
                   <label className={labelStyle}>Données de Système</label>
                   {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_geo'))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-white/5 pt-10">
            {visibleFields.filter(f => f.name === 'description').map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={descriptionStyle}>{smartRender(f)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {['geography', 'nature', 'culture'].includes(activeTab) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'textarea' ? descriptionStyle : plainTextStyle}>{smartRender(f)}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="w-full space-y-12">
          <label className={labelStyle}>Annales du Continent</label>
          <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-black/20 p-1 shadow-2xl">
            <div className="bg-teal-500/5 p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><CalendarDays size={140} className="text-teal-400" /></div>
              <HistoryChronicleEditor 
                worldId={item?.world_links?.[0]?.world_id || item?.world_id} 
                entityId={item?.id}
                entityType="continent"
                readOnly={true}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'countries' && (
        <div className="w-full mt-4">
           <label className={labelStyle}>Nations & Territoires Souverains</label>
           <div className="py-4">{renderFieldValue(activeTabData?.fields.find(f => f.name === 'continent_countries'))}</div>
        </div>
      )}

      {!['general', 'geography', 'nature', 'culture', 'history', 'countries'].includes(activeTab) && (
        <div className="space-y-12">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'textarea' ? descriptionStyle : plainTextStyle}>{smartRender(f)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}