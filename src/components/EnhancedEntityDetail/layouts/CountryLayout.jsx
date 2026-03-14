import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { Scale, Shield, Landmark, Waves, History, CalendarDays, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import du moteur autonome V4.1
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * --- COMPOSANT DE RÉSOLUTION DYNAMIQUE : RelationDisplay ---
 * Va chercher le nom en base si la jointure est absente.
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
      <div className="relative z-10 flex items-center justify-center w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.25em] flex items-center gap-4">
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
      } catch (err) { console.error("Erreur list relation:", err); } finally { setLoading(false); }
    };
    fetchItems();
  }, [tableName, ids]);
  if (loading) return <span className="text-xs text-silver/50 italic">Incantation...</span>;
  if (items.length === 0) return <span className="text-xs text-silver/50 italic">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span key={it.id} className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-xs font-bold text-teal-300 uppercase">
          {it.name}
        </span>
      ))}
    </div>
  );
};

/**
 * CountryLayout - Standard PRESTIGE 4.5.9 (INTÉGRITÉ TOTALE & NUCLEAR RESOLVER)
 */
export default function CountryLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  const visibleFields = activeTabData?.fields.filter(f => 
    !f.isVirtual || f.component || f.type === 'world_history_editor'
  ) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  const nameTextStyle = "text-white font-black text-[13px] md:text-[15px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[11px] md:text-[13px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[11px] md:text-[13px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.9)
   */
  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || 
                       field.name === 'country_locations' || 
                       field.name === 'country_oceans' || 
                       field.name === 'country_images' ||
                       field.type === 'world_history_editor';

    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];

    // --- RÉSOLUTION FORCEE DES RELATIONS ---
    if (field.name === 'world_id') {
        if (item.world_links && Array.isArray(item.world_links) && item.world_links.length > 0) {
            const worldIds = item.world_links.map(l => l.world_id).filter(Boolean);
            if (worldIds.length > 0) return <RelationListDisplay tableName="worlds" ids={worldIds} />;
        }
        if (rawValue && rawValue !== '—') return <RelationDisplay tableName="worlds" id={rawValue} />;
    }

    if (field.name === 'continent_id' && rawValue && rawValue !== '—') {
        return <RelationDisplay tableName="continents" id={rawValue} />;
    }

    if (field.name === 'ocean_id' && rawValue && rawValue !== '—') {
        return <RelationDisplay tableName="oceans" id={rawValue} />;
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
    <div className="animate-in fade-in duration-500 h-auto w-full pb-20">
      
      {/* --- ONGLET GÉNÉRAL --- */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Emblème & Paysage</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                <div className="absolute inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
                  {renderFieldValue(getField('image_url'))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10 h-full content-start">
                {['name', 'subtitle', 'world_id', 'continent_id', 'ocean_id', 'ruleset_id'].map(name => {
                  const f = getField(name);
                  if (!f) return null;
                  return (
                    <div key={f.name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={name === 'name' ? nameTextStyle : plainTextStyle}>
                        {smartRender(f)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 pt-6 border-t border-white/5">
                 {renderFieldValue(getField('dynamic_nation'))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8">
            {getField('description') && (
              <div className="w-full">
                <label className={labelStyle}>Description Générale</label>
                <div className={descriptionStyle}>
                  {smartRender(getField('description'))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ONGLET GÉOGRAPHIE --- */}
      {activeTab === 'geography' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
            {['capital', 'population', 'area'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={plainTextStyle}>{smartRender(f)}</div>
                  </div>
                ) : null;
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-white/5 pt-10">
            {['terrain', 'climate_description'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={descriptionStyle}>{smartRender(f)}</div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}

      {/* --- ONGLET POLITIQUE --- */}
      {activeTab === 'politics' && (
        <div className="space-y-12">
          <div className="p-0">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3 mb-6">
              <Scale size={16} /> Autorité Civile
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {['government_type', 'ruler', 'government_structure', 'laws'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={f.type === 'textarea' ? descriptionStyle : plainTextStyle}>
                      {smartRender(f)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div className="pt-10 border-t border-white/5">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center gap-3 mb-6">
              <Shield size={16} /> Défense & Diplomatie
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {['military_strength', 'military_structure', 'alliances', 'enemies'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={f.type === 'textarea' ? descriptionStyle : plainTextStyle}>
                      {smartRender(f)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET ÉCONOMIE --- */}
      {activeTab === 'economy' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {['currency', 'economy'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={descriptionStyle}>{smartRender(f)}</div>
                  </div>
                ) : null;
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 border-t border-white/5 pt-10">
            {['trade_goods', 'imports', 'exports'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={descriptionStyle}>{smartRender(f)}</div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}

      {/* --- ONGLET CULTURE --- */}
      {activeTab === 'culture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {['language', 'cultural_practices', 'festivals', 'cuisine', 'art_style', 'education_system'].map(name => {
              const f = getField(name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={descriptionStyle}>{smartRender(f)}</div>
                </div>
              ) : null;
          })}
        </div>
      )}

      {/* --- RELATIONS --- */}
      {activeTab === 'locations' && (
        <div className="w-full">
          <label className={labelStyle}>Villes et Places Fortes</label>
          <div className="py-2">{renderFieldValue(getField('country_locations'))}</div>
        </div>
      )}
      {activeTab === 'oceans' && (
        <div className="w-full">
          <label className={labelStyle}>Façades Maritimes</label>
          <div className="py-2">{renderFieldValue(getField('country_oceans'))}</div>
        </div>
      )}

      {/* --- ONGLET HISTOIRE --- */}
      {activeTab === 'history' && (
        <div className="space-y-12">
          <div className="w-full">
            <label className={labelStyle}>Annales de la Nation</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-black/20 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <History size={120} className="text-teal-400" />
                </div>
                <HistoryChronicleEditor 
                  worldId={item?.world_links?.[0]?.world_id || item?.world_id} 
                  entityId={item?.id}
                  entityType="country"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/5 pt-12">
            <div className="md:col-span-4">
              {getField('founding_date') && (
                <div>
                  <label className={labelStyle}>Date de Fondation</label>
                  <div className={plainTextStyle}>{smartRender(getField('founding_date'))}</div>
                </div>
              )}
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
               {['history', 'major_wars', 'historical_figures', 'relations'].map(name => {
                  const f = getField(name);
                  return f ? (
                    <div key={f.name} className={name === 'history' ? 'md:col-span-2' : ''}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={descriptionStyle}>{smartRender(f)}</div>
                    </div>
                  ) : null;
               })}
            </div>
          </div>
        </div>
      )}

      {/* --- GALERIE & MJ --- */}
      {['gallery', 'gm'].includes(activeTab) && (
        <div className="space-y-10">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={descriptionStyle}>{smartRender(f)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}