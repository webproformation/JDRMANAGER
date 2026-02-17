// src/components/EnhancedEntityDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Edit, Trash2, Image as ImageIcon, 
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Lock, Shield 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from './DynamicStatsEditor';

// --- COMPOSANT INTERNE : Affiche le nom au lieu de l'ID pour les relations ---
const RelationDisplay = ({ tableName, id }) => {
  const [label, setLabel] = useState('Chargement...');

  useEffect(() => {
    if (!id || !tableName) {
      setLabel('—');
      return;
    }

    const fetchName = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('name')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setLabel(data?.name || 'Inconnu (Lien cassé)');
      } catch (err) {
        console.error("Erreur relation:", err);
        setLabel('Erreur');
      }
    };

    fetchName();
  }, [tableName, id]);

  return <span className="text-teal-400 font-bold hover:underline cursor-pointer">{label}</span>;
};

// --- COMPOSANT INTERNE : Affiche une liste de badges pour les Sorts/Talents ---
const RelationListDisplay = ({ tableName, ids = [] }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('name')
          .in('id', ids);
        
        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Erreur list display:", err);
      }
    };

    fetchItems();
  }, [tableName, ids]);

  return (
    <div className="flex flex-wrap gap-2">
      {items.length === 0 ? (
        <span className="text-silver/30 italic text-xs">Aucun élément sélectionné</span>
      ) : (
        items.map((it, idx) => (
          <span key={idx} className="px-2 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase rounded shadow-sm">
            {it.name}
          </span>
        ))
      )}
    </div>
  );
};

export default function EnhancedEntityDetail({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  item,
  config
}) {
  const { tabs, getHeaderColor, getHeaderIcon } = config;
  
  // On filtre les onglets : on cache GM Notes de la navigation publique
  const validTabs = tabs.filter(t => t.id !== 'gm_notes' && t.id !== 'gallery');
  const [activeTab, setActiveTab] = useState(validTabs[0]?.id || 'identity');
  
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  if (!isOpen || !item) return null;

  // --- LOGIQUE DE NAVIGATION (FLÈCHES) ---
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

  const currentTab = validTabs.find(t => t.id === activeTab);

  // Filtre les champs longs (textes narratifs, listes de sorts/talents)
  const longFields = currentTab?.fields.filter(f => 
    f.type === 'textarea' || ['description', 'history', 'backstory', 'personality', 'weapons', 'abilities', 'equipment', 'spell_slots', 'spells_known'].some(k => f.name.includes(k))
  ) || [];

  const listFields = currentTab?.fields.filter(f => f.type === 'relation-list') || [];

  // Filtre les champs courts (identité, badge de base)
  const shortFields = currentTab?.fields.filter(f => 
    !longFields.includes(f) && 
    !listFields.includes(f) &&
    f.type !== 'image' && 
    f.type !== 'images' && 
    f.type !== 'custom' && 
    f.name !== 'name' && 
    f.name !== 'subtitle' &&
    f.name !== 'ruleset_id'
  ) || [];

  const gmFields = config.tabs.find(t => t.id === 'gm_notes')?.fields.filter(f => item[f.name]);
  
  // Préparation des données techniques
  const statsData = item.data || {};
  const currentRuleset = DEFAULT_RULESETS[item.ruleset_id || 'dnd5'];

  // --- RENDU DES VALEURS COURTES ---
  const renderFieldValue = (field) => {
    const value = item[field.name];
    if (value !== 0 && !value) return null;

    switch (field.type) {
      case 'select':
        const option = field.options?.find(opt => opt.value === value);
        return <span className="font-bold text-white">{option ? option.label : value}</span>;
      
      case 'relation':
        return <RelationDisplay tableName={field.table} id={value} />;

      default:
        return <span className="text-gray-200">{value}</span>;
    }
  };

  const HeaderIcon = getHeaderIcon ? getHeaderIcon(item) : null;
  const headerColor = getHeaderColor ? getHeaderColor(item) : 'from-purple-900/40 to-blue-900/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* WRAPPER PRINCIPAL POUR BOUTONS FLOTTANTS EXTÉRIEURS */}
      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col pointer-events-none">
        
        {/* BOUTONS DE DÉFILEMENT VERTICAUX (EXTÉRIEURS A LA MODALE) */}
        <div className="hidden lg:flex absolute -right-24 top-1/2 -translate-y-1/2 flex-col gap-4 z-[60] pointer-events-auto">
             <button 
                onClick={(e) => { e.stopPropagation(); scrollContent('up'); }} 
                className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer"
                title="Défiler vers le haut"
             >
                <ChevronUp size={32} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); scrollContent('down'); }} 
                className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-full border border-purple-500/30 shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-all hover:translate-y-1 hover:scale-110 active:scale-95 cursor-pointer"
                title="Défiler vers le bas"
             >
                <ChevronDown size={32} />
             </button>
        </div>

        {/* MODALE INTEGRALE */}
        <div className="relative w-full h-full bg-[#1a1d2d] rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_-10px_rgba(45,212,191,0.15)] border border-purple-500/20 animate-in zoom-in-95 duration-300 pointer-events-auto">
          
          {/* --- HEADER --- */}
          <div className="relative h-56 shrink-0 overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${headerColor}`}>
              {item.image_url && <img src={item.image_url} alt="Héros" className="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2d] via-[#1a1d2d]/40 to-transparent" />
            </div>

            <div className="absolute top-6 right-6 flex gap-3 z-20">
              <button onClick={() => onEdit(item)} className="p-3 bg-black/40 hover:bg-purple-500/20 text-white rounded-full backdrop-blur-md border border-white/5 transition-all hover:scale-110" title="Modifier">
                <Edit size={18} />
              </button>
              <button onClick={onClose} className="p-3 bg-black/40 hover:bg-red-500/20 text-white rounded-full backdrop-blur-md border border-white/5 transition-all hover:scale-110" title="Fermer">
                <X size={18} />
              </button>
            </div>

            <div className="absolute bottom-6 left-8 right-8 flex items-end gap-6 z-10">
              <div className="w-24 h-24 rounded-2xl bg-[#1a1d2d] border-2 border-purple-500/30 flex items-center justify-center shadow-2xl shrink-0">
                  {HeaderIcon && <HeaderIcon size={48} className="text-teal-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
              </div>
              <div className="pb-2">
                  <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">{item.name}</h1>
                  <p className="text-teal-400 font-bold text-xs tracking-[0.2em] uppercase mt-2 opacity-80 italic">Archives de la Légende</p>
              </div>
            </div>
          </div>

          {/* --- NAVIGATION DES ONGLETS AVEC FLÈCHES --- */}
          <div className="relative border-b border-white/5 bg-[#151725] shrink-0 z-10 flex items-center">
            <button onClick={() => scrollTabs('left')} className="p-3 text-silver hover:bg-white/5 transition-colors" title="Précédent"><ChevronLeft size={20} /></button>
            <div ref={tabsRef} className="flex-1 flex items-center gap-1 overflow-x-hidden scroll-smooth px-2 scrollbar-none">
                {validTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-silver/50 hover:text-silver'}`}
                    >
                      {tab.label}
                      {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-light shadow-[0_0_10px_rgba(168,85,247,0.5)]" />}
                    </button>
                ))}
            </div>
            <button onClick={() => scrollTabs('right')} className="p-3 text-silver hover:bg-white/5 transition-colors" title="Suivant"><ChevronRight size={20} /></button>
          </div>

          {/* --- ZONE DE CONTENU --- */}
          <div className="relative flex-1 bg-[#1a1d2d] min-h-0 w-full flex">
            <div ref={contentRef} className="absolute inset-0 overflow-y-auto scroll-smooth p-8 pb-20 [&::-webkit-scrollbar]:hidden flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Colonne Principale (Narrative & Stats) */}
                <div className="lg:col-span-8 space-y-10">
                  
                  {/* AFFICHAGE DES STATS SI ONGLET ACTIF */}
                  {activeTab === 'stats' && (
                    <div className="animate-in fade-in duration-700 pointer-events-none opacity-90">
                      <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-6 flex items-center gap-2">
                        <Shield size={14}/> Fiche Technique Interactive (Lecture Seule)
                      </h3>
                      <DynamicStatsEditor 
                        ruleset={currentRuleset} 
                        data={statsData} 
                        onChange={() => {}} 
                      />
                    </div>
                  )}

                  {/* LISTES INTERACTIVES (SORTS/TALENTS) */}
                  {listFields.map(f => (
                    <div key={f.name} className="animate-in fade-in duration-500">
                      <h3 className="text-sm font-bold text-teal-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-purple-500/30 rounded-full" />
                        {f.label}
                      </h3>
                      <div className="bg-[#151725] p-4 rounded-xl border border-white/5 shadow-inner">
                        <RelationListDisplay tableName={f.table} ids={item.data?.[f.key]} />
                      </div>
                    </div>
                  ))}

                  {/* CHAMPS NARRATIFS / TEXTUELS */}
                  {longFields.map(field => {
                    const value = item[field.name];
                    if (!value) return null;
                    return (
                      <div key={field.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-sm font-bold text-teal-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-4 bg-teal-500/30 rounded-full shadow-[0_0_8px_cyan]" />
                          {field.label}
                        </h3>
                        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg bg-[#151725] p-6 rounded-2xl border border-white/5 shadow-inner whitespace-pre-wrap">
                          {value}
                        </div>
                      </div>
                    )
                  })}

                  {longFields.length === 0 && listFields.length === 0 && activeTab !== 'stats' && (
                    <div className="text-center py-20 text-silver/10 italic border-2 border-dashed border-white/5 rounded-2xl">
                      Aucun détail supplémentaire pour cette section.
                    </div>
                  )}
                </div>

                {/* COLONNE LATERALE (PROPRIETES) */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-gradient-to-b from-[#22263a] to-[#1a1d2d] border border-white/10 rounded-xl p-5 shadow-xl">
                    <h3 className="text-[10px] font-bold text-silver/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-4 italic">
                      Profil du Héros
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {shortFields.map(field => {
                        const content = renderFieldValue(field);
                        return content ? (
                          <div key={field.name} className="p-3 bg-black/20 rounded-lg border border-white/5">
                            <span className="text-[9px] text-silver/50 font-bold uppercase block mb-1">{field.label}</span>
                            <div className="text-sm text-white">{content}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* MJ SECRETS (Masqué si vide) */}
                  {gmFields && gmFields.length > 0 && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5 relative overflow-hidden animate-in zoom-in-95">
                        <div className="absolute -right-4 -top-4 text-red-500/10 rotate-12"><Lock size={64} /></div>
                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-red-500/20 pb-3 mb-4 flex items-center gap-2 relative z-10">
                          <Lock size={12} /> Secrets du MJ
                        </h3>
                        <div className="space-y-4 relative z-10">
                          {gmFields.map(field => (
                            <div key={field.name}>
                              <span className="text-[10px] text-red-300/60 font-bold uppercase block mb-1">{field.label}</span>
                              <p className="text-sm text-red-100/90 italic bg-black/20 p-3 rounded-lg border border-red-500/10">{item[field.name]}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}