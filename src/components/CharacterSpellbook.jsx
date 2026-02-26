import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Book, Zap, Clock, Search, Filter, 
  CheckCircle2, Circle, AlertCircle, Wand2, FlaskConical, ScrollText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';

export default function CharacterSpellbook({ character, onChange }) {
  const [allSpells, setAllSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [activeTab, setActiveTab] = useState("prepared"); // "prepared", "known", "all"

  // Récupération des données magiques stockées dans le JSONB 'data' du perso
  const spellData = character.data?.magic || { 
    slots: {}, 
    mastery: {}, // { spell_id: 'known' | 'prepared' | 'learned' }
    resources: { current: 0, max: 0 } 
  };

  const rulesetId = character.ruleset_id || 'dnd5';
  const config = DEFAULT_RULESETS[rulesetId]?.magicConfig || DEFAULT_RULESETS['dnd5'].magicConfig;

  useEffect(() => {
    async function fetchSpells() {
      // On récupère tous les sorts du monde actuel
      const { data } = await supabase.from('spells').select('*').eq('world_id', character.world_id);
      if (data) setAllSpells(data);
      setLoading(false);
    }
    fetchSpells();
  }, [character.world_id]);

  // FILTRAGE INTELLIGENT
  const filteredSpells = useMemo(() => {
    return allSpells.filter(spell => {
      // 1. Recherche texte
      const matchesSearch = spell.name.toLowerCase().includes(search.toLowerCase());
      // 2. Filtre niveau
      const matchesLevel = filterLevel === "all" || String(spell.level) === filterLevel;
      
      // 3. Filtre par onglet d'état
      if (activeTab === "prepared") {
        return matchesSearch && matchesLevel && spellData.mastery[spell.id] === 'prepared';
      }
      if (activeTab === "known") {
        const status = spellData.mastery[spell.id];
        return matchesSearch && matchesLevel && (status === 'known' || status === 'learned' || status === 'prepared');
      }
      return matchesSearch && matchesLevel;
    });
  }, [allSpells, search, filterLevel, activeTab, spellData.mastery]);

  const toggleMastery = (spellId, status) => {
    const newMastery = { ...spellData.mastery };
    if (newMastery[spellId] === status) {
      delete newMastery[spellId]; // Déselection
    } else {
      newMastery[spellId] = status;
    }
    onChange({ ...character.data, magic: { ...spellData, mastery: newMastery } });
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-silver/20 uppercase tracking-widest text-xs">Ouverture du grimoire...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER : GESTION DES RESSOURCES (SLOTS OU POINTS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 shadow-inner">
          <h4 className="text-[10px] font-black uppercase text-teal-400 mb-4 flex items-center gap-2 tracking-widest">
            <Zap size={14}/> {config.type === 'slots' ? 'Emplacements de Sorts' : 'Réserve d\'Énergie'}
          </h4>
          
          {config.type === 'slots' ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
                <div key={lvl} className="flex flex-col items-center bg-black/40 p-3 rounded-2xl border border-white/5 min-w-[50px]">
                  <span className="text-[9px] font-bold text-silver/40 mb-1">Niv.{lvl}</span>
                  <input 
                    type="number" 
                    className="w-full bg-transparent text-center font-black text-white outline-none text-lg"
                    value={spellData.slots[lvl] || 0}
                    onChange={(e) => {
                      const newSlots = { ...spellData.slots, [lvl]: parseInt(e.target.value) || 0 };
                      onChange({ ...character.data, magic: { ...spellData, slots: newSlots } });
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-silver/50 uppercase tracking-tighter">
                <span>Concentration Arcanique</span>
                <span className="text-white">{spellData.resources.current} / {spellData.resources.max}</span>
              </div>
              <div className="h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-700" 
                  style={{ width: `${Math.min(100, (spellData.resources.current / (spellData.resources.max || 1)) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-center text-center">
           <h4 className="text-[10px] font-black uppercase text-purple-400 mb-3 tracking-widest">Puissance Incantatoire</h4>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 py-3 rounded-2xl border border-white/5">
                <div className="text-2xl font-black text-white">15</div>
                <div className="text-[9px] font-bold text-silver/30 uppercase">DD Sauvegarde</div>
              </div>
              <div className="bg-black/20 py-3 rounded-2xl border border-white/5">
                <div className="text-2xl font-black text-white">+7</div>
                <div className="text-[9px] font-bold text-silver/30 uppercase">Bonus Attaque</div>
              </div>
           </div>
        </div>
      </div>

      {/* FILTRES & TABS */}
      <div className="bg-[#151725] p-5 rounded-[2.5rem] border border-white/5 space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver/20 group-focus-within:text-teal-500 transition-colors" size={16}/>
            <input 
              type="text" placeholder="Rechercher un sort dans le grimoire..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-teal-500/30 transition-all placeholder:text-silver/10"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs font-bold text-silver outline-none focus:border-teal-500/30 cursor-pointer"
            value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">Tous les Niveaux</option>
            {[0,1,2,3,4,5,6,7,8,9].map(l => <option key={l} value={l}>{l === 0 ? 'Sorts Mineurs' : `Niveau ${l}`}</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          {[
            { id: 'prepared', label: 'Préparés', icon: Zap },
            { id: 'known', label: 'Appris', icon: Book },
            { id: 'all', label: 'Tous les Sorts', icon: Sparkles }
          ].map(t => (
            <button
              key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20' : 'bg-black/20 text-silver/40 hover:bg-white/5 hover:text-silver'}`}
            >
              <t.icon size={12}/> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLE DES SORTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpells.map(spell => {
          const status = spellData.mastery[spell.id];
          const isConcentration = spell.duration?.includes('Concentration');
          
          return (
            <div key={spell.id} className="bg-[#0f111a] border border-white/5 p-5 rounded-3xl flex items-center gap-5 group hover:border-teal-500/30 transition-all cursor-default relative overflow-hidden">
              {/* INDICATEUR CONCENTRATION */}
              {isConcentration && (
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-500/20" title="Requiert Concentration">
                  <div className="w-full h-1/2 bg-amber-500 animate-pulse"/>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-transform group-hover:scale-105 ${spell.level === 0 ? 'bg-slate-500/10 text-slate-500' : 'bg-purple-500/20 text-purple-400'}`}>
                {spell.level}
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className="text-[13px] font-black text-white truncate group-hover:text-teal-400 transition-colors uppercase tracking-tight">{spell.name}</h5>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[9px] font-black text-silver/20 uppercase tracking-tighter">{spell.subtitle}</span>
                  <div className="flex gap-1">
                    {spell.components?.split(',').map(c => (
                      <span key={c} className="w-3.5 h-3.5 flex items-center justify-center rounded-sm bg-black/40 text-[7px] font-black text-silver/40 border border-white/5">{c.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTIONS RAPIDES */}
              <div className="flex items-center gap-1">
                {config.hasPreparation && (
                  <button 
                    onClick={() => toggleMastery(spell.id, 'prepared')}
                    className={`p-2.5 rounded-xl transition-all ${status === 'prepared' ? 'text-teal-400 bg-teal-400/10 scale-110' : 'text-silver/10 hover:bg-white/5 hover:text-silver/30'}`}
                    title="Marquer comme Préparé"
                  >
                    <CheckCircle2 size={18}/>
                  </button>
                )}
                <button 
                  onClick={() => toggleMastery(spell.id, 'learned')}
                  className={`p-2.5 rounded-xl transition-all ${status === 'learned' || status === 'prepared' ? 'text-purple-400 bg-purple-400/10' : 'text-silver/10 hover:bg-white/5 hover:text-silver/30'}`}
                  title="Ajouter au Grimoire"
                >
                  <Book size={18}/>
                </button>
              </div>
            </div>
          );
        })}

        {filteredSpells.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
            <ScrollText size={48} className="mx-auto mb-4 text-silver" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucun savoir arcanique ici</p>
          </div>
        )}
      </div>
    </div>
  );
}