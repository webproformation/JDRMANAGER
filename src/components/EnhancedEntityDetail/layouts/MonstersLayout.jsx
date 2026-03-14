import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
// CORRECTIF CHEMIN : On remonte 3 niveaux pour src/lib/supabase
import { supabase } from '../../../lib/supabase';
import { 
  Skull, Swords, Heart, Shield, Activity, Scroll, TreePine, Zap, 
  Target, Eye, Info, X, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';

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
 * MonstersLayout - Standard PRESTIGE 4.5.9 (ÉPURE & NUCLEAR RESOLVER)
 */
export default function MonstersLayout({ config, activeTab, renderFieldValue, formData }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // STYLES PURS PRESTIGE
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-2 block ml-1";
  const nameTextStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[12px] md:text-[14px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[12px] md:text-[14px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  // BOX COMBAT GÉANTE (Ciblée) - Purifiée
  const combatStatBoxStyle = "justify-center text-[32px] font-black h-24 flex items-center text-white tracking-tighter drop-shadow-[0_0_10px_rgba(20,184,166,0.3)]";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.9)
   */
  const smartRender = (field) => {
    if (!field) return "—";

    const isGraphic = field.type === 'images' || field.name === 'image_url' || field.name === 'dynamic_monster_fields' || field.name === 'stats';
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

    // Résolution Options (Ruleset, Alignement, Taille)
    if (rawValue && field.options) {
        const opt = field.options.find(o => String(o.value) === String(rawValue));
        if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    if (Array.isArray(rawValue)) return rawValue.length === 0 ? "—" : rawValue.join(" | ");

    return String(rawValue);
  };

  const getField = (name) => activeTabData.fields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Layout 3 colonnes ÉPURÉ)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* Col 1 : Image (4/12) */}
            <div className="md:col-span-4 h-full min-h-[380px]">
              <label className={labelStyle}>Spécimen Identifié</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>

            {/* Col 2 & 3 : Détails (8/12) */}
            <div className="md:col-span-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-12 h-full content-start">
                <div className="sm:col-span-3 pb-4 border-b border-white/5">
                  <label className={labelStyle}>Désignation</label>
                  <div className="text-white font-black text-3xl uppercase tracking-widest px-1">
                    {smartRender(getField('name'))}
                  </div>
                </div>

                {['subtitle', 'ruleset_id', 'world_id', 'type', 'size', 'alignment'].map(name => (
                  <div key={name}>
                    <label className={labelStyle}>{getField(name)?.label || name}</label>
                    <div className={plainTextStyle}>{smartRender(getField(name))}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 pt-8 border-t border-white/5">
                <label className={labelStyle}>Capacités Système</label>
                <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 shadow-inner">
                   {renderFieldValue(getField('dynamic_monster_fields'))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10">
            <label className={labelStyle}>Description Fondamentale</label>
            <div className={descriptionStyle}>
              {smartRender(getField('description'))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : COMBAT (Gros Stats & Répertoire Actions)
          ================================================================== */}
      {activeTab === 'combat' && (
        <div className="space-y-12">
          
          <div className="w-full">
            <label className={labelStyle}>Architecture des Attributs</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-white/10 bg-black/20 p-1 shadow-2xl">
               <div className="bg-white/5 p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Skull size={120} className="text-teal-400" />
                  </div>
                  {renderFieldValue(getField('stats'))}
               </div>
            </div>
          </div>

          {/* GRILLE GÉANTE POUR LES 3 STATS CLÉS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {[
              { id: 'armor_class', label: "Classe d'Armure", icon: Shield },
              { id: 'hit_points', label: 'Points de Vie', icon: Heart },
              { id: 'challenge_rating', label: 'Facteur de Danger', icon: Activity }
            ].map(stat => (
              <div key={stat.id}>
                <label className={labelStyle}>{stat.label}</label>
                <div className={combatStatBoxStyle}>
                  {smartRender(getField(stat.id))}
                </div>
              </div>
            ))}
          </div>

          {/* TRAITS ET ACTIONS (ÉPURE) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-white/5">
            <div className="md:col-span-5 space-y-12">
              <div>
                <label className={labelStyle}>Traits & Facultés Passives</label>
                <div className={descriptionStyle}>
                  {renderFieldValue(getField('abilities'))}
                </div>
              </div>
              <div className="pt-8 border-t border-white/5">
                <label className={labelStyle}>Manifestations Légendaires</label>
                <div className={descriptionStyle + " text-teal-200/60 italic"}>
                  {renderFieldValue(getField('legendary_actions'))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-7">
              <label className={labelStyle}>Répertoire d'Attaques & Actions</label>
              <div className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 text-[15px] text-silver/90 whitespace-pre-wrap leading-loose shadow-2xl">
                {renderFieldValue(getField('actions'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLETS ÉCOLOGIE & LORE (Standard ÉPURÉ)
          ================================================================== */}
      {['ecology', 'lore', 'gm'].includes(activeTab) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {activeTabData.fields.map(f => (
            <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
              <label className={labelStyle}>{f.label}</label>
              <div className={descriptionStyle}>
                {smartRender(f)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GALERIE */}
      {activeTab === 'gallery' && (
        <div className="py-4">
          <label className={labelStyle}>Archives Visuelles du Spécimen</label>
          {renderFieldValue(activeTabData.fields[0])}
        </div>
      )}
    </div>
  );
}