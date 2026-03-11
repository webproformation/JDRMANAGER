// src/components/CharacterSpellbook.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Book, Zap, CheckCircle2, ScrollText, 
  Info, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';

export default function CharacterSpellbook({ character, onChange }) {
  const [allSpells, setAllSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  // Ordre inversé : Bibliothèque en premier (tab "all" par défaut)
  const [activeTab, setActiveTab] = useState("all");
  const [expandedSpell, setExpandedSpell] = useState(null);

  // Moteur de calcul automatique des slots selon le niveau D&D 5e
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

  // Lecture du mastery — compatibilité avec les deux formats de stockage :
  // Nouveau : data.magic.mastery = { spell_uuid: 'prepared'|'learned' }
  // Ancien  : data.spells = { 0: [...], 1: [...] } (noms de sorts)
  const spellData = character.data?.magic || {
    slots: defaultSlots,
    mastery: {},
    resources: { current: 10, max: 10 }
  };

  useEffect(() => {
    async function fetchSpells() {
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

  // Compatibilité avec l'ancien format data.spells (noms de sorts)
  // → construit un set de noms pour marquer les sorts comme 'learned' visuellement
  const legacySpellNames = useMemo(() => {
    const names = new Set();
    const oldSpells = character.data?.spells || {};
    const spellList = oldSpells.prepared ? oldSpells.prepared : oldSpells;
    Object.keys(spellList).forEach(lvl => {
      if (Array.isArray(spellList[lvl])) {
        spellList[lvl].forEach(sp => {
          names.add(typeof sp === 'string' ? sp.toLowerCase() : sp.name?.toLowerCase());
        });
      }
    });
    return names;
  }, [character.data?.spells]);

  // FILTRAGE ET REGROUPEMENT PAR NIVEAU
  const spellsByLevel = useMemo(() => {
    const filtered = allSpells.filter(spell => {
      const status = spellData.mastery[spell.id];
      // Compatibilité legacy : si le sort est dans l'ancien format, on le compte comme 'learned'
      const isLegacy = legacySpellNames.has(spell.name?.toLowerCase());
      const effectiveStatus = status || (isLegacy ? 'learned' : null);

      if (activeTab === "prepared") return effectiveStatus === 'prepared';
      if (activeTab === "known") return effectiveStatus === 'known' || effectiveStatus === 'learned' || effectiveStatus === 'prepared';
      return true; // "all" = Bibliothèque complète
    });

    const grouped = {};
    filtered.forEach(spell => {
      const lvl = spell.level ?? 0;
      if (!grouped[lvl]) grouped[lvl] = [];
      grouped[lvl].push(spell);
    });
    return grouped;
  }, [allSpells, activeTab, spellData.mastery, legacySpellNames]);

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

  if (loading) return (
    <div className="p-12 text-center text-silver/20 animate-pulse uppercase font-black tracking-widest text-xs">
      Ouverture du Grimoire...
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── EMPLACEMENTS DE SORTS (NIV 1 À 9) ─────────────────────────
          Source unique, synchronisée avec data.spell_slots pour le PDF.
          Les 9 colonnes s'étirent pour remplir toute la largeur.
      ─────────────────────────────────────────────────────────────── */}
      {config.type === 'slots' ? (
        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 shadow-inner">
          <h4 className="text-[10px] font-black uppercase text-teal-400 mb-5 flex items-center gap-2 tracking-widest">
            <Zap size={14} /> Emplacements de Sorts (Niv 1 à 9)
          </h4>
          <div className="grid grid-cols-9 gap-2 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => {
              const totalVal = spellData.slots[lvl] || 0;
              const spentVal = character.data?.spell_slots?.[lvl]?.spent || 0;
              const isEmpty = totalVal === 0;
              return (
                <div
                  key={lvl}
                  className={`flex flex-col items-center px-2 py-3 rounded-2xl border transition-all ${
                    isEmpty ? 'border-white/5 opacity-40' : 'border-purple-500/30 bg-purple-900/10'
                  }`}
                >
                  <span className="text-[8px] font-black text-silver/40 uppercase tracking-widest mb-2">
                    Niv.{lvl}
                  </span>
                  {/* Total — écrit dans magic.slots ET spell_slots pour PDF */}
                  <input
                    type="number"
                    title="Total"
                    className="w-full bg-purple-500/10 text-center font-black text-white outline-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1.5 text-base mb-1 border border-transparent focus:border-purple-500/50 transition-colors"
                    value={totalVal}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value) || 0;
                      const newMagicSlots = { ...spellData.slots, [lvl]: newVal };
                      const pdfSlots = { ...(character.data?.spell_slots || {}) };
                      if (!pdfSlots[lvl]) pdfSlots[lvl] = { total: 0, spent: 0 };
                      pdfSlots[lvl].total = newVal;
                      onChange({ ...character.data, magic: { ...spellData, slots: newMagicSlots }, spell_slots: pdfSlots });
                    }}
                  />
                  <span className="text-[7px] font-bold text-silver/20 uppercase mb-1">Tot</span>
                  {/* Dépensés — écrit dans spell_slots.spent pour le PDF */}
                  <input
                    type="number"
                    title="Dépensés"
                    className="w-full bg-red-500/10 text-center font-black text-red-400 outline-none [&::-webkit-inner-spin-button]:appearance-none rounded-lg py-1 text-xs border border-transparent focus:border-red-500/50 transition-colors"
                    value={spentVal}
                    onChange={(e) => {
                      const newSpent = parseInt(e.target.value) || 0;
                      const pdfSlots = { ...(character.data?.spell_slots || {}) };
                      if (!pdfSlots[lvl]) pdfSlots[lvl] = { total: totalVal, spent: 0 };
                      pdfSlots[lvl].spent = newSpent;
                      onChange({ ...character.data, magic: { ...spellData }, spell_slots: pdfSlots });
                    }}
                  />
                  <span className="text-[7px] font-bold text-silver/20 uppercase mt-1">Dép</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Système non-slot : barre de Mana / Rêve */
        <div className="bg-[#0f111a] p-6 rounded-[2rem] border border-white/5 shadow-inner">
          <h4 className="text-[10px] font-black uppercase text-teal-400 mb-4 flex items-center gap-2 tracking-widest">
            <Zap size={14} /> Réserve d'Énergie
          </h4>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-[10px] font-black text-silver/50 uppercase tracking-tighter">
              <span>Mana / Rêve</span>
              <span className="text-white">{spellData.resources.current} / {spellData.resources.max}</span>
            </div>
            <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{ width: `${Math.min(100, (spellData.resources.current / (spellData.resources.max || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLETS — ordre : Bibliothèque → Grimoire → Mémoire ──── */}
      <div className="bg-[#151725] p-2 rounded-3xl border border-white/5 flex justify-center gap-2">
        {[
          { id: 'all',      label: 'Bibliothèque',          icon: Sparkles },
          { id: 'known',    label: 'Mon Grimoire',           icon: Book     },
          { id: 'prepared', label: 'Ma Mémoire (Préparés)',  icon: Zap      }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
              activeTab === t.id
                ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/20'
                : 'text-silver/40 hover:bg-white/5 hover:text-silver'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── LISTE DES SORTS ────────────────────────────────────────── */}
      <div className="space-y-8">
        {Object.keys(spellsByLevel).length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
            <ScrollText size={48} className="mx-auto mb-4 text-silver" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucun sortilège visible</p>
          </div>
        ) : (
          Object.keys(spellsByLevel).sort((a, b) => Number(a) - Number(b)).map(level => (
            <div key={level} className="space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/10 pb-2 flex items-center gap-3">
                <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-teal-400">
                  {level}
                </span>
                {level === '0' ? 'Sorts Mineurs (Cantrips)' : `Sorts de Niveau ${level}`}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spellsByLevel[level].map(spell => {
                  const status = spellData.mastery[spell.id];
                  const isLegacy = legacySpellNames.has(spell.name?.toLowerCase());
                  const effectiveStatus = status || (isLegacy ? 'learned' : null);
                  const isExpanded = expandedSpell === spell.id;

                  return (
                    <div
                      key={spell.id}
                      className={`bg-[#0f111a] border rounded-3xl overflow-hidden transition-all ${
                        effectiveStatus === 'prepared'
                          ? 'border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.08)]'
                          : effectiveStatus === 'learned' || effectiveStatus === 'known'
                            ? 'border-purple-500/30'
                            : 'border-white/5 hover:border-teal-500/20'
                      }`}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[13px] font-black text-white truncate uppercase tracking-tight">
                            {spell.name}
                          </h5>
                          <div className="text-[9px] font-black text-silver/30 uppercase tracking-widest mt-1 flex items-center gap-2">
                            {spell.components?.includes('R') && <span className="text-blue-400">Rituel</span>}
                            {spell.duration?.includes('Concentration') && <span className="text-amber-500">Concentration</span>}
                            {!spell.components?.includes('R') && !spell.duration?.includes('Concentration') && (
                              <span>{spell.subtitle}</span>
                            )}
                            {isLegacy && !status && (
                              <span className="text-orange-400/60 text-[8px]">ancien format</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setExpandedSpell(isExpanded ? null : spell.id)}
                            className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-white/10 text-white' : 'text-silver/20 hover:bg-white/5 hover:text-white'}`}
                            title="Détails"
                          >
                            <Info size={16} />
                          </button>
                          {config.hasPreparation && (
                            <button
                              type="button"
                              onClick={() => toggleMastery(spell.id, 'prepared')}
                              className={`p-2 rounded-xl transition-all ${effectiveStatus === 'prepared' ? 'text-teal-400 bg-teal-400/10' : 'text-silver/10 hover:bg-white/5 hover:text-teal-400'}`}
                              title="Préparer (Mémoire)"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleMastery(spell.id, 'learned')}
                            className={`p-2 rounded-xl transition-all ${effectiveStatus === 'learned' || effectiveStatus === 'prepared' ? 'text-purple-400 bg-purple-400/10' : 'text-silver/10 hover:bg-white/5 hover:text-purple-400'}`}
                            title="Ajouter au Grimoire"
                          >
                            <Book size={16} />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="bg-black/40 p-4 border-t border-white/5 text-xs text-silver space-y-3">
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase">
                            <span className="bg-white/5 px-2 py-1 rounded text-cyan-200">
                              <Clock size={10} className="inline mr-1" /> {spell.casting_time}
                            </span>
                            <span className="bg-white/5 px-2 py-1 rounded text-purple-200">
                              Portée : {spell.range}
                            </span>
                            <span className="bg-white/5 px-2 py-1 rounded text-amber-200">
                              Durée : {spell.duration}
                            </span>
                          </div>
                          <p className="leading-relaxed border-l-2 border-teal-500/30 pl-3">
                            {spell.description}
                          </p>
                          {spell.components && (
                            <div className="text-[10px] font-bold text-silver/40">
                              COMPOSANTES : <span className="text-white">{spell.components}</span>
                            </div>
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
