import React from 'react';
import { 
  Shield, Sword, Award, Check, Sparkles, Hammer, Backpack, 
  User, Dices, Scale, Zap, Info, Heart, Eye, Activity, 
  Crosshair, ScrollText, Coins, Package, Weight, ChevronRight 
} from 'lucide-react';
import ArsenalEditor from '../../components/ArsenalEditor'; 
import CharacterFeaturesEditor from '../../components/CharacterFeaturesEditor';
import CharacterSpellbook from '../../components/CharacterSpellbook';
import InventoryEditor from '../../components/InventoryEditor';
import CharacterCrafting from '../../components/CharacterCrafting';
import MultiSelectWithOther from '../../components/MultiSelectWithOther';
import CosmicInfluenceStatus from '../../components/CosmicInfluenceStatus';
import { calculateCombatStats } from '../../utils/rulesEngine';
import { DEFAULT_RULESETS } from '../../data/ruleset_definitions/index';

// --- LOGIQUE DND5 : COMPÉTENCES ---
const DND_SKILLS = [
  { key: 'acrobatics', label: 'Acrobaties', attr: 'dex' },
  { key: 'animal_handling', label: 'Dressage', attr: 'wis' },
  { key: 'arcana', label: 'Arcanes', attr: 'int' },
  { key: 'athletics', label: 'Athlétisme', attr: 'str' },
  { key: 'deception', label: 'Tromperie', attr: 'cha' },
  { key: 'history', label: 'Histoire', attr: 'int' },
  { key: 'insight', label: 'Perspicacité', attr: 'wis' },
  { key: 'intimidation', label: 'Intimidation', attr: 'cha' },
  { key: 'investigation', label: 'Investigation', attr: 'int' },
  { key: 'medicine', label: 'Médecine', attr: 'wis' },
  { key: 'nature', label: 'Nature', attr: 'int' },
  { key: 'perception', label: 'Perception', attr: 'wis' },
  { key: 'performance', label: 'Représentation', attr: 'cha' },
  { key: 'persuasion', label: 'Persuasion', attr: 'cha' },
  { key: 'religion', label: 'Religion', attr: 'int' },
  { key: 'sleight_of_hand', label: 'Escamotage', attr: 'dex' },
  { key: 'stealth', label: 'Discrétion', attr: 'dex' },
  { key: 'survival', label: 'Survie', attr: 'wis' }
];

// --- ÉDITEUR TACTIQUE : STATS & COMBAT ---
const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const derived = calculateCombatStats(currentRulesetId, value || {}, formData.level);

  const handleAttrChange = (key, val) => {
    const mergedData = { ...(value || {}), [key]: val };
    mergedData.skills = value?.skills || {};
    const newDerived = calculateCombatStats(currentRulesetId, mergedData, formData.level);
    onChange({ ...mergedData, ...newDerived });
  };

  const stats = [
    {k:'str', l:'FOR'}, {k:'dex', l:'DEX'}, {k:'con', l:'CON'},
    {k:'int', l:'INT'}, {k:'wis', l:'SAG'}, {k:'cha', l:'CHA'}
  ];

  const baseAc = derived.ac || 10;
  const acOverride = value?.ac_override || 0;
  const displayAc = baseAc + acOverride;

  const baseInit = parseInt(derived.init || 0);
  const initOverride = value?.init_override || 0;
  const displayInit = baseInit + initOverride;

  const baseProf = parseInt(String(derived.prof || '+2').replace('+', ''));
  const profOverride = value?.prof_override || 0;
  const displayProf = baseProf + profOverride;

  const StatWidget = ({ label, val, onUpdate, color, bg, border, prefix }) => (
    <div className={`p-4 rounded-2xl border ${border || 'border-white/5'} ${bg || 'bg-black/20'} text-center shadow-inner flex flex-col items-center group transition-all hover:border-[#2DD4BF]/20`}>
       <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] mb-3 group-hover:text-[#2DD4BF] transition-colors">{label}</span>
       <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[40px]">
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val - 1); }} className="px-4 h-full hover:bg-white/5 text-silver font-black transition-colors">-</button>
          <input type="text" value={`${prefix && val > 0 ? '+' : ''}${val}`} readOnly className={`w-full bg-transparent text-center ${color} font-black text-sm outline-none`} />
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val + 1); }} className="px-4 h-full hover:bg-white/5 text-silver font-black transition-colors">+</button>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => {
          const score = value?.[s.k] || 10;
          const mod = Math.floor((score - 10) / 2);
          const formattedMod = mod >= 0 ? `+${mod}` : `${mod}`;
          return (
            <div key={s.k} className="bg-black/20 p-4 rounded-[1.5rem] border border-white/5 text-center shadow-inner flex flex-col items-center group hover:border-[#2DD4BF]/30 transition-all">
               <span className="text-[10px] font-black uppercase text-silver/40 tracking-widest mb-3">{s.l}</span>
               <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[40px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, Math.max(1, score - 1)); }} className="px-3 h-full hover:bg-white/5 text-silver font-black">-</button>
                  <input type="number" value={score} onChange={(e) => handleAttrChange(s.k, parseInt(e.target.value)||0)} className="w-full bg-transparent text-center text-white font-black text-sm outline-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, score + 1); }} className="px-3 h-full hover:bg-white/5 text-silver font-black">+</button>
               </div>
               <div className="mt-3 w-full bg-[#2DD4BF]/10 py-1 rounded-lg border border-[#2DD4BF]/20 shadow-inner group-hover:bg-[#2DD4BF]/20 transition-all">
                 <span className="text-[10px] font-black text-[#2DD4BF]">MOD {formattedMod}</span>
               </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-6 border-t border-white/5">
        <StatWidget label="PV Actuels" val={value?.hp ?? 10} onUpdate={v => handleAttrChange('hp', v)} color="text-green-400" bg="bg-green-500/5" border="border-green-500/20" />
        <StatWidget label="PV Max" val={value?.hp_max ?? 10} onUpdate={v => handleAttrChange('hp_max', Math.max(1, v))} color="text-green-500" />
        <StatWidget label="PV Temp" val={value?.temp_hp ?? 0} onUpdate={v => handleAttrChange('temp_hp', Math.max(0, v))} color="text-cyan-400" />
        <StatWidget label="Armure (CA)" val={displayAc} onUpdate={v => handleAttrChange('ac_override', v - baseAc)} color="text-amber-400" />
        <StatWidget label="Initiative" val={displayInit} onUpdate={v => handleAttrChange('init_override', v - baseInit)} color="text-white" prefix={true} />
        <StatWidget label="Maîtrise" val={displayProf} onUpdate={v => handleAttrChange('prof_override', v - baseProf)} color="text-teal-400" prefix={true} />
      </div>
    </div>
  );
};

// --- CONFIGURATION DES ONGLETS ---
export const identityTab = {
  id: 'identity',
  label: 'Système & Identité',
  icon: User,
  columns: 3, 
  fields: [
    { name: 'image_url', label: 'Portrait du Héros', type: 'image', bucket: 'portraits' },
    { name: 'name', label: 'Nom de la Légende', type: 'text', required: true, placeholder: 'Nom...' },
    { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
    { name: 'character_type', label: 'Type', type: 'custom', component: (p) => <MultiSelectWithOther {...p} options={['PJ', 'PNJ', 'Boss']} /> },
    { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
    { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
    { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
    { name: 'subclass_id', label: 'Archétype', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
    { name: 'alignment', label: 'Alignement', type: 'custom', component: (p) => <MultiSelectWithOther {...p} options={['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre Absolu', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais']} /> },
    { name: 'sex', label: 'Genre', type: 'custom', component: (p) => <MultiSelectWithOther {...p} options={['Masculin', 'Féminin', 'Non-binaire']} /> },
  ]
};

export const statsTab = {
  id: 'stats',
  label: 'Stats & Compétences',
  icon: Shield,
  fields: [
    { 
      name: 'health_custom', 
      isVirtual: true, 
      label: 'Survie & Passif', 
      type: 'custom', 
      render: (_, item) => {
        const stats = calculateCombatStats(item.ruleset_id || 'dnd5', item.data || {}, item.level);
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/20 p-5 rounded-2xl border border-[#2DD4BF]/20 text-center flex flex-col items-center shadow-inner">
              <span className="text-[9px] text-[#2DD4BF]/60 font-black uppercase tracking-[0.2em] mb-2">Perception Passive</span>
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-[#2DD4BF]/40" />
                <span className="text-[#2DD4BF] font-black text-2xl">{stats.passive_perception || 10}</span>
              </div>
            </div>
            <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-center shadow-inner">
              <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] mb-2 block">Dés de Vie</span>
              <div className="text-white font-black text-2xl flex items-center justify-center gap-2">
                <Activity size={16} className="text-red-500/50" />
                {item.data?.hit_dice_spent || 0} / {stats.hit_dice_max || '1d8'}
              </div>
            </div>
            <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-center shadow-inner">
              <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] mb-2 block">Jets de Mort</span>
              <div className="flex justify-center gap-4 mt-1">
                <span className="text-lg text-green-400 font-black">V: {item.data?.death_saves?.successes || 0}</span>
                <span className="text-lg text-red-400 font-black">X: {item.data?.death_saves?.failures || 0}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    { name: 'data', label: 'Terminal de Statistiques', type: 'custom', component: ConnectedStatsEditor },
    { 
      name: 'skills_custom', 
      isVirtual: true, 
      label: 'Compétences', 
      type: 'custom', 
      component: ({ formData, onFullChange }) => {
        const d = formData.data || {};
        const derived = calculateCombatStats(formData.ruleset_id || 'dnd5', d, formData.level);
        const totalProf = parseInt(String(derived.prof || '+2').replace('+', '')) + (d.prof_override || 0);

        return (
            <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 mt-8 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase text-[#2DD4BF] tracking-[0.3em] mb-8 border-b border-[#2DD4BF]/20 pb-3 ml-1 flex items-center gap-3">
                <Crosshair size={16} /> Grille des Compétences
              </h4>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {DND_SKILLS.map(sk => {
                   const isProficient = d.skills?.[sk.key] || false;
                   const mod = Math.floor(((d[sk.attr] || 10) - 10) / 2);
                   const total = mod + (isProficient ? totalProf : 0);
                   return (
                     <label key={sk.key} className="flex items-center space-x-4 cursor-pointer group p-3 rounded-2xl bg-black/40 hover:bg-[#2DD4BF]/5 transition-all border border-white/5 hover:border-[#2DD4BF]/30">
                        <div className="relative">
                          <input type="checkbox" checked={isProficient} onChange={(e) => { const s = {...(d.skills||{})}; s[sk.key] = e.target.checked; onFullChange({...formData, data: {...d, skills: s}}); }} className="peer sr-only" />
                          <div className="w-6 h-6 rounded-lg border border-white/10 bg-black/50 peer-checked:bg-[#2DD4BF] peer-checked:border-[#2DD4BF] transition-all flex items-center justify-center shadow-inner">
                            <Check size={14} className="text-black opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-black uppercase text-silver group-hover:text-white transition-colors">{sk.label}</span>
                          <span className="text-[9px] font-bold text-silver/30 ml-2">({sk.attr.toUpperCase()})</span>
                        </div>
                        <div className={`text-sm font-black ${total >= 0 ? 'text-[#2DD4BF]' : 'text-red-400'}`}>{total >= 0 ? '+'+total : total}</div>
                     </label>
                   );
                })}
              </div>
            </div>
        );
      }
    }
  ]
};

export const combatTab = {
  id: 'combat',
  label: 'Arsenal & Maîtrises',
  icon: Sword,
  fields: [
    { 
      name: 'arsenal_data', 
      isVirtual: true,
      label: 'Arsenal Interactif', 
      type: 'custom', 
      render: (_, item) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(item.data?.arsenal || []).map((w, i) => (
            <div key={i} className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 group-hover:bg-amber-500/10">
                  <Sword size={18} className="text-amber-500/60 group-hover:text-amber-500" />
                </div>
                <span className="text-white text-sm font-black uppercase tracking-tight">{w.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-silver/30 uppercase">ATK</span>
                   <span className="text-amber-400 font-black text-lg">{w.stats?.atk || '+0'}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-silver/30 uppercase">DMG</span>
                   <span className="text-white font-black text-lg">{w.stats?.dmg || '1d4'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
      component: ({ formData, onFullChange }) => (
        <ArsenalEditor 
          value={formData.data?.arsenal || []} 
          onChange={(newArsenal) => onFullChange({ ...formData, data: { ...formData.data, arsenal: newArsenal } })} 
          formData={formData} 
        />
      )
    }
  ]
};

export const magicTab = {
  id: 'magic',
  label: 'Grimoire Arcanique',
  icon: Sparkles,
  fields: [
    { 
      name: 'magic_editor', 
      isVirtual: true,
      label: 'Gestion des Sorts', 
      type: 'custom', 
      render: (_, item) => {
          const spells = item.data?.spells || {};
          const levels = Object.keys(spells).sort();
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {[1,2,3,4,5,6,7,8,9].map(lvl => {
                   const slot = item.data?.spell_slots?.[lvl];
                   if(!slot || slot.total === 0) return null;
                   return (
                     <div key={lvl} className="p-3 rounded-2xl bg-purple-900/20 border border-purple-500/30 flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase text-silver/60">Niv {lvl}</span>
                        <span className="text-sm font-black text-purple-300">{slot.total - (slot.spent||0)} / {slot.total}</span>
                     </div>
                   );
                })}
              </div>
              <div className="space-y-4">
                {levels.map(lvl => (
                  <div key={lvl} className="bg-black/20 p-5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-purple-400 block mb-3 uppercase tracking-widest border-b border-purple-500/20 pb-1">Cercle {lvl}</span>
                    <div className="flex flex-wrap gap-2">
                      {spells[lvl].map((sp, i) => (
                        <span key={i} className="bg-black/40 text-silver text-xs font-bold px-3 py-1.5 rounded-lg border border-white/5">{typeof sp === 'string' ? sp : sp.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
      },
      component: ({ formData, onFullChange }) => (
        <CharacterSpellbook character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
      )
    }
  ]
};

export const inventoryTab = {
  id: 'inventory',
  label: 'Inventaire & Bourse',
  icon: Backpack,
  fields: [
    {
      name: 'money_custom',
      isVirtual: true,
      label: 'Richesses',
      type: 'custom',
      render: (_, item) => (
        <div className="grid grid-cols-5 gap-2 mb-6">
          {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
             const labels = { pc: 'Cu', pa: 'Ag', pe: 'El', po: 'Or', pp: 'Pl' };
             const colors = { pc: 'text-orange-400', pa: 'text-zinc-400', pe: 'text-cyan-400', po: 'text-yellow-400', pp: 'text-indigo-200' };
             return (
               <div key={coin} className="bg-black/40 p-3 rounded-xl border border-white/5 text-center shadow-inner">
                 <span className="text-[8px] uppercase font-black text-silver/40 block">{labels[coin]}</span>
                 <span className={`text-sm font-black ${colors[coin]}`}>{item.data?.[`money_${coin}`] || 0}</span>
               </div>
             );
          })}
        </div>
      ),
      component: ({ formData, onFullChange }) => (
        <div className="grid grid-cols-5 gap-3 mb-8 bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => (
            <div key={coin} className="flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase text-silver/40 text-center">{coin.toUpperCase()}</span>
              <input type="number" value={formData.data?.[`money_${coin}`] || 0} onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 text-center text-lg font-black outline-none focus:border-[#2DD4BF]/50" />
            </div>
          ))}
        </div>
      )
    },
    { 
      name: 'inventory_data', 
      isVirtual: true,
      label: 'Sac à dos', 
      type: 'custom', 
      component: ({ formData, onFullChange }) => (
        <InventoryEditor 
          value={formData.data?.inventory || []} 
          onChange={(newInv) => onFullChange({ ...formData, data: { ...formData.data, inventory: newInv } })} 
          formData={formData}
        />
      ) 
    }
  ]
};