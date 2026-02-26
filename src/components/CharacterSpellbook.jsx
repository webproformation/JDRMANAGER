// src/components/CharacterSpellbook.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Book, Zap, Search, CheckCircle2, ScrollText, 
  Info, Wand2, Flame, AlertCircle, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';

export default function CharacterSpellbook({ character, onChange }) {
  const [allSpells, setAllSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prepared"); // "prepared", "known", "all"
  const [expandedSpell, setExpandedSpell] = useState(null);

  // Moteur de calcul automatique des slots selon le niveau
  const calculateAutoSlots = (level) => {
    if (!level || level < 1) return {};
    return {
      1: level >= 3 ? 4 : (level === 2 ? 3 : 2),
      2: level >= 3 ? (level >= 4 ? 3 : 2) : 0,
      3: level >= 5 ? (level >= 6 ? 3 : 2) : 0,
      4: level >= 7 ? (level >= 8 ? 3 : 1) : 0,
      5: level >= 9 ? (level >= 10 ? 3 : 1) : 0,
      6: level >= 11 ? 1 : 0,
      7: level >= 13 ? 1 : 0,
      8: level >= 15 ? 1 : 0,
      9: level >= 17 ? 1 : 0,
    };
  };

  const rulesetId = character.ruleset_id || 'dnd5';
  const config = DEFAULT_RULESETS[rulesetId]?.magicConfig || DEFAULT_RULESETS['dnd5'].magicConfig;

  const defaultSlots = config.type === 'slots' ? calculateAutoSlots(character.level || 1) : {};
  const spellData = character.data?.magic || { 
    slots: defaultSlots, 
    mastery: {}, 
    resources: { current: 10, max: 10 } 
  };

  useEffect(() => {
    async function fetchSpells() {
      // CORRECTION CRITIQUE : Affiche les sorts du monde du perso OU les sorts universels (world_id null)
      let query = supabase.from('spells').select('*');
      
      if (character?.world_id) {
        query = query.or(`world_id.eq.${character.world_id},world_id.is.null`);
      }

      const { data, error } = await query;
      if (!error && data) setAllSpells(data);
      setLoading(false);
    }
    fetchSpells();
  }, [character.world_id]);

  // FILTRAGE ET REGROUPEMENT PAR NIVEAU
  const spellsByLevel = useMemo(() => {
    const filtered = allSpells.filter(spell => {
      const status = spellData.mastery[spell.id];
      if (activeTab === "prepared") return status === 'prepared';
      if (activeTab === "known") return status === 'known' || status === 'learned' || status === 'prepared';
      return true;
    });

    const grouped = {};
    filtered.forEach(spell => {
      if (!grouped[spell.level]) grouped[spell.level] = [];
      grouped[spell.level].push(spell);
    });
    return grouped;
  }, [allSpells, activeTab, spellData.mastery]);

  const toggleMastery = (spellId, targetStatus) => {
    const newMastery = { ...spellData.mastery };
    if (newMastery[spellId] === targetStatus) {
      if (targetStatus === 'prepared') newMastery[spellId] = 'learned';
      else delete newMastery[spellId];
    } else {
      newMastery[spellId] = targetStatus;
    }
    onChange({ ...character.data, magic: { ...spellData, mastery: newMastery } });
  };

  if (loading) return <div className="p-12 text-center text-silver/20 animate-pulse uppercase font-black tracking-widest text-xs">Ouverture du Grimoire...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 shadow-inner flex flex-col justify-start">
          <h4 className="text-[10px] font-black uppercase text-teal-400 mb-4 flex items-center gap-2 tracking-widest">
            <Zap size={14}/> {config.type === 'slots' ? 'Emplacements de Sorts' : 'Réserve d\'Énergie'}
          </h4>
          {config.type === 'slots' ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
                <div key={lvl} className={`flex flex-col items-center bg-black/40 p-2 rounded-xl border border-white/5 min-w-[50px] ${(spellData.slots[lvl] === 0 || !spellData.slots[lvl]) ? 'opacity-30' : ''}`}>
                  <span className="text-[8px] font-bold text-silver/40 mb-1">Niv.{lvl}</span>
                  <input 
                    type="number" className="w-8 bg-transparent text-center font-black text-white outline-none [&::-webkit-inner-spin-button]:appearance-none"
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
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-[10px] font-black text-silver/50 uppercase tracking-tighter">
                <span>Mana / Rêve</span>
                <span className="text-white">{spellData.resources.current} / {spellData.resources.max}</span>
              </div>
              <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(100, (spellData.resources.current / (spellData.resources.max || 1)) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-start text-center h-full">
           <h4 className="text-[10px] font-black uppercase text-purple-400 mb-4 tracking-widest text-left">Puissance Arcanique</h4>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 py-4 rounded-2xl border border-white/5">
                <div className="text-3xl font-black text-white mb-1">{character.save_dc || 10}</div>
                <div className="text-[9px] font-bold text-silver/30 uppercase">DD Sauvegarde</div>
              </div>
              <div className="bg-black/20 py-4 rounded-2xl border border-white/5">
                <div className="text-3xl font-black text-white mb-1">{character.spell_atk >= 0 ? '+' : ''}{character.spell_atk || 0}</div>
                <div className="text-[9px] font-bold text-silver/30 uppercase">Bonus Attaque</div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#151725] p-2 rounded-3xl border border-white/5 flex justify-center gap-2">
        {[
          { id: 'prepared', label: 'Ma Mémoire (Préparés)', icon: Zap },
          { id: 'known', label: 'Mon Grimoire', icon: Book },
          { id: 'all', label: 'Bibliothèque', icon: Sparkles }
        ].map(t => (
          <button
            key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === t.id ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20' : 'text-silver/40 hover:bg-white/5 hover:text-silver'}`}
          >
            <t.icon size={16}/> {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {Object.keys(spellsByLevel).length === 0 ? (
           <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
             <ScrollText size={48} className="mx-auto mb-4 text-silver" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucun sortilège visible</p>
           </div>
        ) : (
          Object.keys(spellsByLevel).sort((a,b) => a-b).map(level => (
            <div key={level} className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-3">
                <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-teal-400">{level}</span> 
                {level === '0' ? 'Sorts Mineurs (Cantrips)' : `Sorts de Niveau ${level}`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spellsByLevel[level].map(spell => {
                  const status = spellData.mastery[spell.id];
                  const isExpanded = expandedSpell === spell.id;
                  
                  return (
                    <div key={spell.id} className="bg-[#0f111a] border border-white/5 rounded-3xl overflow-hidden group hover:border-teal-500/30 transition-all">
                      <div className="p-4 flex items-center gap-4 relative">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[13px] font-black text-white truncate uppercase tracking-tight">{spell.name}</h5>
                          <div className="text-[9px] font-black text-silver/30 uppercase tracking-widest mt-1 flex items-center gap-2">
                            {spell.components?.includes('R') && <span className="text-blue-400">Rituel</span>}
                            {spell.duration?.includes('Concentration') && <span className="text-amber-500">Concentration</span>}
                            {(!spell.components?.includes('R') && !spell.duration?.includes('Concentration')) && <span>{spell.subtitle}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button onClick={() => setExpandedSpell(isExpanded ? null : spell.id)} className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-white/10 text-white' : 'text-silver/20 hover:bg-white/5 hover:text-white'}`} title="Détails">
                            <Info size={16}/>
                          </button>
                          {config.hasPreparation && (
                            <button onClick={() => toggleMastery(spell.id, 'prepared')} className={`p-2 rounded-xl transition-all ${status === 'prepared' ? 'text-teal-400 bg-teal-400/10' : 'text-silver/10 hover:bg-white/5'}`} title="Préparer">
                              <CheckCircle2 size={16}/>
                            </button>
                          )}
                          <button onClick={() => toggleMastery(spell.id, 'learned')} className={`p-2 rounded-xl transition-all ${status === 'learned' || status === 'prepared' ? 'text-purple-400 bg-purple-400/10' : 'text-silver/10 hover:bg-white/5'}`} title="Grimoire">
                            <Book size={16}/>
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-black/40 p-4 border-t border-white/5 text-xs text-silver space-y-3">
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase">
                            <span className="bg-white/5 px-2 py-1 rounded text-cyan-200"><Clock size={10} className="inline mr-1"/> {spell.casting_time}</span>
                            <span className="bg-white/5 px-2 py-1 rounded text-purple-200">Portée: {spell.range}</span>
                            <span className="bg-white/5 px-2 py-1 rounded text-amber-200">Durée: {spell.duration}</span>
                          </div>
                          <p className="leading-relaxed border-l-2 border-teal-500/30 pl-3">{spell.description}</p>
                          {spell.components && (
                            <div className="text-[10px] font-bold text-silver/40">COMPOSANTES : <span className="text-white">{spell.components}</span></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}