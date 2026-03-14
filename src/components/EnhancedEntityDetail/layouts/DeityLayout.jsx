import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { 
  Shield, History, CalendarDays, Crown, Sun, Moon, Zap, Sparkles, 
  Scroll, Zap as PowerIcon, Users, Info, X, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Import du moteur de chronologie autonome V4.3
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * --- COMPOSANT DE RÉSOLUTION DYNAMIQUE : RelationDisplay ---
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
 * DeityLayout - Version Prestige 4.5.9 (INTÉGRITÉ TOTALE & ÉPURE)
 */
export default function DeityLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  const visibleFields = activeTabData?.fields.filter(f => 
    !f.isVirtual || f.component || f.type === 'world_history_editor'
  ) || [];
  
  // STYLES PURS PRESTIGE (Sans bordures ni boîtes)
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-2 block ml-1";
  const nameTextStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[12px] md:text-[14px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[12px] md:text-[14px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.9)
   */
  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || field.name === 'deity_images' || field.type === 'world_history_editor';
    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];

    // --- RÉSOLUTION FORCEE DES RELATIONS ---
    if (field.name === 'world_id') {
        if (item.world_links && Array.isArray(item.world_links) && item.world_links.length > 0) {
            const worldIds = item.world_links.map(l => l.world_id).filter(Boolean);
            return <RelationListDisplay tableName="worlds" ids={worldIds} />;
        }
        if (rawValue && rawValue !== '—') return <RelationDisplay tableName="worlds" id={rawValue} />;
    }

    // Résolution Alignement / Ruleset via options
    if (rawValue && field.options) {
        const opt = field.options.find(o => String(o.value) === String(rawValue));
        if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    
    // Transformation des listes simples
    if (Array.isArray(rawValue)) return rawValue.length === 0 ? "—" : rawValue.join(" | ");

    return String(rawValue);
  };

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* ==================================================================
          1. IDENTITÉ DIVINE : 3 COLONNES RÉELLES (ÉPURE)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Col 1 : Avatar (4/12) */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Manifestation Visuelle</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 & 3 : Rang, Alignement (8/12) */}
            <div className="md:col-span-8 grid grid-cols-3 gap-8 h-full content-start">
              <div className="col-span-3 pb-4 border-b border-white/5">
                <label className={labelStyle}>Nom de la Divinité</label>
                <div className="flex items-center gap-4 text-white font-black text-3xl uppercase tracking-widest px-1">
                  <Sparkles className="text-teal-400" size={28} />
                  {smartRender(getField('name'))}
                </div>
              </div>

              {['title', 'divine_rank', 'alignment', 'ruleset_id', 'pantheon', 'world_id'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={plainTextStyle}>{smartRender(f)}</div>
                  </div>
                ) : null;
              })}
              
              <div className="col-span-3 grid grid-cols-2 gap-8 mt-4 pt-4 border-t border-white/5">
                {['domains', 'portfolio'].map(name => {
                  const f = getField(name);
                  return f ? (
                    <div key={name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={descriptionStyle}>{smartRender(f)}</div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Propriétés Système */}
              <div className="col-span-3 mt-4">
                 {renderFieldValue(getField('dynamic_deity_fields'))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-10">
            <div>
              <label className={labelStyle}>Description & Mythes</label>
              <div className={descriptionStyle}>{smartRender(getField('description'))}</div>
            </div>
            <div>
              <label className={labelStyle}>Apparence Terrestre</label>
              <div className={descriptionStyle + " text-teal-100/60 italic"}>{smartRender(getField('appearance'))}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-10">
            <div>
              <label className={labelStyle}>Symbole Sacré</label>
              <div className="text-teal-400 font-black text-xl uppercase tracking-widest px-1">{smartRender(getField('symbol'))}</div>
            </div>
            <div>
              <label className={labelStyle}>Signification</label>
              <div className={descriptionStyle}>{smartRender(getField('sacred_symbol_description'))}</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. CULTE & DOGME (ÉPURE)
          ================================================================== */}
      {activeTab === 'worship' && (
        <div className="space-y-12">
          <div className="w-full">{renderFieldValue(getField('data'))}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {['favored_weapon', 'holy_days', 'clergy_alignments'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={plainTextStyle}>{smartRender(getField(name))}</div>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {['rituals', 'worshippers', 'typical_worshippers'].map(name => (
                <div key={name}>
                  <label className={labelStyle}>{getField(name)?.label}</label>
                  <div className={descriptionStyle}>{smartRender(getField(name))}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            {['divine_servants', 'temples'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={descriptionStyle}>{smartRender(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. ACTES & CHRONOLOGIE (MOTEUR V4.3)
          ================================================================== */}
      {activeTab === 'history_tab' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Mémoire de l'Éternité & Actes Divins</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-black/20 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={140} className="text-teal-400" />
                </div>
                <HistoryChronicleEditor 
                  worldId={item?.world_id || item?.world_links?.[0]?.world_id} 
                  entityId={item?.id}      
                  entityType="deity"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          4. POUVOIRS & ARTEFACTS (ÉPURE)
          ================================================================== */}
      {activeTab === 'powers' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {['sacred_artifacts', 'granted_powers', 'divine_spells'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={descriptionStyle}>{smartRender(getField(name))}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            {['avatar_description', 'manifestations'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={descriptionStyle + " text-teal-100/50 italic"}>{smartRender(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          5. RELATIONS (ÉPURE)
          ================================================================== */}
      {activeTab === 'relations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {['allies', 'enemies'].map(name => (
            <div key={name}>
              <label className={labelStyle}>{getField(name)?.label}</label>
              <div className={descriptionStyle}>{smartRender(getField(name))}</div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================
          6. GALERIE SACRÉE
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="py-4">{smartRender(getField('deity_images'))}</div>
      )}

      {/* ==================================================================
          7. SECRETS MJ (ÉPURE ROUGE)
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="space-y-12">
          <div className="flex items-center gap-3 text-red-500/80 mb-4 px-1">
            <Shield size={18} />
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Archives Interdites du MJ</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {['gm_notes', 'gm_secret_plots', 'gm_conspiracies'].map(name => (
              <div key={name}>
                <label className={labelStyle + " text-red-400/60"}>{getField(name)?.label}</label>
                <div className={descriptionStyle + " text-red-100/70"}>{smartRender(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="pt-10 border-t border-red-500/10">
             <label className={labelStyle + " text-red-400/60"}>Visualisations de Complots</label>
             <div className="py-4">{renderFieldValue(getField('gm_secret_images'))}</div>
          </div>
        </div>
      )}
    </div>
  );
}