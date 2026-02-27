// src/pages/CharactersPage.jsx
import React, { useState } from 'react';
import { 
  User, Shield, Sword, Scroll, Crown, Skull, Backpack, 
  Sparkles, Hammer, AlertTriangle, ArrowUpCircle, ArrowRight, Heart, CheckCircle, Star, Award
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import ArsenalEditor from '../components/ArsenalEditor'; 
import CharacterSpellbook from '../components/CharacterSpellbook';
import InventoryEditor from '../components/InventoryEditor';
import { calculateCombatStats, getLevelUpBenefits } from '../utils/rulesEngine';

import { generatePDF, runSmokeTestPDF } from '../utils/pdfGenerator/index'; 
import CharacterCrafting from '../components/CharacterCrafting';
import CosmicInfluenceStatus from '../components/CosmicInfluenceStatus';
import CharacterFeaturesEditor from '../components/CharacterFeaturesEditor';

// --- LE WIZARD DE MONTÉE DE NIVEAU ---
const LevelUpWizard = ({ character, onClose, onSuccess }) => {
  const [saving, setSaving] = useState(false);
  const newLevel = (character.level || 1) + 1;
  const hpRoll = Math.floor(Math.random() * 8) + 1; 
  const conMod = Math.floor(((character.data?.con || 10) - 10) / 2);
  const newHpMax = (character.data?.hp_max || character.data?.hp || 10) + hpRoll + conMod;

  const className = character.class_id || character.class_name || 'Guerrier'; 
  const benefits = getLevelUpBenefits(className, newLevel);

  const confirmLevelUp = async () => {
    setSaving(true);
    const derived = calculateCombatStats(character.ruleset_id || 'dnd5', character.data, newLevel);
    const autoMaxHitDice = derived.hit_dice_max || `${newLevel}d8`;

    const updatedData = { ...character.data, hp: newHpMax, hp_max: newHpMax, hit_dice_max: autoMaxHitDice };
    
    // Ajout automatique des nouvelles capacités de classe dans le nouveau gestionnaire
    const newDynamicFeatures = updatedData.dynamic_features ? JSON.parse(JSON.stringify(updatedData.dynamic_features)) : { traits: [], proficiencies: [], class_features: [] };
    
    benefits.filter(b => b.includes('Capacité')).forEach(b => {
       const featName = b.split(' : ')[1] || b;
       if (!newDynamicFeatures.class_features.some(f => f.name === featName)) {
           newDynamicFeatures.class_features.push({ name: featName, desc: "Acquis au niveau " + newLevel });
       }
    });
    
    updatedData.dynamic_features = newDynamicFeatures;
    updatedData.features = newDynamicFeatures.class_features.map(f => `• ${f.name}${f.desc ? `\n  ${f.desc}` : ''}`).join('\n\n');
    
    await supabase.from('characters').update({ 
      level: newLevel, 
      data: updatedData 
    }).eq('id', character.id);
    
    setSaving(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#0f111a] border border-amber-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in-95 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/20 to-transparent" />
        <div className="absolute -top-24 -right-24 text-amber-500/10 rotate-12"><Star size={250} /></div>

        <div className="relative p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
             <ArrowUpCircle size={40} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">ASCENSION</h2>
          <p className="text-amber-500 font-bold uppercase tracking-[0.3em] mb-10 text-xs">
            {character.name} atteint le Niveau {newLevel}
          </p>

          <div className="w-full bg-[#151725] border border-white/5 rounded-[2rem] p-8 text-left space-y-6 shadow-inner">
             <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl"><Heart size={24}/></div>
                <div>
                   <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest">Points de Vie Maximum</h4>
                   <div className="text-2xl font-black text-white flex items-center gap-3 mt-1">
                      Anciens: <span className="text-silver">{character.data?.hp || 10}</span> 
                      <ArrowRight size={16} className="text-amber-500" /> 
                      Nouveaux: <span className="text-green-400">{newHpMax}</span>
                   </div>
                   <p className="text-[10px] text-silver/40 mt-1">Jet de dés ({hpRoll}) + Mod. Constitution ({conMod >= 0 ? '+'+conMod : conMod})</p>
                </div>
             </div>

             <div>
               <h4 className="text-xs font-black uppercase text-silver/60 tracking-widest mb-4">Nouvelles Capacités Acquises</h4>
               <ul className="space-y-3">
                 {benefits.map((ben, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-silver font-medium bg-black/40 p-3 rounded-xl border border-white/5">
                     <CheckCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                     {ben}
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          <div className="flex gap-4 mt-10 w-full">
            <button onClick={onClose} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-silver rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              Remettre à plus tard
            </button>
            <button disabled={saving} onClick={confirmLevelUp} className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? 'Incantation...' : 'Confirmer l\'Ascension'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5'];
  
  const handleStatsChange = (newStats) => {
    const derived = calculateCombatStats(currentRulesetId, newStats, formData.level);
    onChange({ ...newStats, ...derived });
  };
  return <DynamicStatsEditor ruleset={currentRuleset} data={value} onChange={handleStatsChange} />;
};

const DND_SKILLS = [
  { key: 'acrobatics', label: 'Acrobaties' }, { key: 'animal_handling', label: 'Dressage' },
  { key: 'arcana', label: 'Arcanes' }, { key: 'athletics', label: 'Athlétisme' },
  { key: 'deception', label: 'Tromperie' }, { key: 'history', label: 'Histoire' },
  { key: 'insight', label: 'Perspicacité' }, { key: 'intimidation', label: 'Intimidation' },
  { key: 'investigation', label: 'Investigation' }, { key: 'medicine', label: 'Médecine' },
  { key: 'nature', label: 'Nature' }, { key: 'perception', label: 'Perception' },
  { key: 'performance', label: 'Représentation' }, { key: 'persuasion', label: 'Persuasion' },
  { key: 'religion', label: 'Religion' }, { key: 'sleight_of_hand', label: 'Escamotage' },
  { key: 'stealth', label: 'Discrétion' }, { key: 'survival', label: 'Survie' }
];

const charactersConfig = {
  entityName: 'le personnage',
  tableName: 'characters',
  title: 'Forge des Héros',
  getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
  getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),

  tabs: [
    {
      id: 'identity',
      label: 'Système & Identité',
      icon: User,
      fields: [
        { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { 
          name: 'dynamic_character_fields', 
          isVirtual: true,
          label: 'Détails Système',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <RulesetDynamicFields rulesetId={formData.ruleset_id} entityType="race" formData={formData} onChange={onFullChange} />
          )
        },
        { name: 'name', label: 'Nom du Héros', type: 'text', required: true, placeholder: 'Nom...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
        { name: 'character_type', label: 'Type', type: 'select', options: [{ value: 'PJ', label: 'PJ' }, { value: 'PNJ', label: 'PNJ' }] },
        { name: 'alignment', label: 'Alignement', type: 'text', placeholder: 'Ex: Loyal Bon' },
        { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },
        { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
        { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
        { name: 'subclass_id', label: 'Archétype (Sous-Classe)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
        { name: 'level', label: 'Niveau', type: 'number', required: true },
        { 
          name: 'size_cat_custom', 
          isVirtual: true,
          label: 'Taille (Encombrement)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <div className="flex flex-col w-full mb-4">
              <label className="text-[10px] font-black uppercase text-silver/40 mb-2 tracking-widest">Taille (Catégorie)</label>
              <select 
                value={formData.data?.size_cat || 'medium'}
                onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, size_cat: e.target.value } })}
                className="bg-[#151725] text-white text-sm font-bold border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50"
              >
                <option value="small">Petite (P)</option>
                <option value="medium">Moyenne (M)</option>
                <option value="large">Grande (G)</option>
              </select>
            </div>
          )
        },
        { name: 'image_url', label: 'Portrait', type: 'image' }
      ]
    },
    {
      id: 'cosmic',
      label: 'Destin & Astres',
      icon: Sparkles,
      fields: [
        { name: 'birth_date', label: 'Date de Naissance', type: 'text', placeholder: 'Ex: 14-03-1284' },
        { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
        { 
          name: 'cosmic_status', 
          isVirtual: true,
          label: 'Influence des Astres', 
          type: 'custom', 
          component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
        }
      ]
    },
    {
      id: 'stats',
      label: 'Caractéristiques & Compétences',
      icon: Shield,
      fields: [
        { 
          name: 'health_custom', 
          isVirtual: true, 
          label: 'Survie', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => {
            const currentPerception = calculateCombatStats(formData.ruleset_id || 'dnd5', formData.data || {}, formData.level).passive_perception || 10;
            const autoHitDice = calculateCombatStats(formData.ruleset_id || 'dnd5', formData.data || {}, formData.level).hit_dice_max || '1d8';
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-black/40 p-4 rounded-xl border border-teal-500/30 text-center shadow-inner flex flex-col justify-center">
                  <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest mb-1">Perception Passive</span>
                  <span className="text-teal-400 font-black text-2xl">👁️ {currentPerception}</span>
                </div>
                
                <div className="bg-[#151725] p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-2 block">Dés de Vie</span>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Dépensés" value={formData.data?.hit_dice_spent || ''} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_spent: e.target.value } })} className="w-full bg-black/40 text-xs text-white border border-white/10 rounded-lg p-2 outline-none focus:border-teal-500"/>
                    <span className="text-silver/40 py-2">/</span>
                    <input type="text" placeholder="Max" value={formData.data?.hit_dice_max || autoHitDice} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_max: e.target.value } })} className="w-full bg-black/40 text-xs text-white border border-white/10 rounded-lg p-2 outline-none focus:border-teal-500"/>
                  </div>
                </div>

                <div className="bg-[#151725] p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-2 block">Jets contre la Mort</span>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-green-400">Succès</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(num => (
                        <input key={`succ-${num}`} type="checkbox" checked={(formData.data?.death_saves?.successes || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, successes: val}}}); }} className="w-3.5 h-3.5 accent-green-500 rounded cursor-pointer" />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-red-400">Échecs</span>
                    <div className="flex gap-1">
                      {[1,2,3].map(num => (
                        <input key={`fail-${num}`} type="checkbox" checked={(formData.data?.death_saves?.failures || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, failures: val}}}); }} className="w-3.5 h-3.5 accent-red-500 rounded cursor-pointer" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        },
        { name: 'data', label: 'Fiche Technique Interactive', type: 'custom', component: ConnectedStatsEditor },
        { 
          name: 'skills_custom', 
          isVirtual: true, 
          label: 'Les 18 Compétences', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <div className="bg-[#151725] p-6 rounded-xl border border-white/5 mt-4">
               <label className="text-[10px] font-black uppercase text-silver/40 mb-4 block tracking-widest border-b border-white/10 pb-2">Maîtrise des Compétences</label>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                 {DND_SKILLS.map(sk => (
                   <label key={sk.key} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.data?.skills?.[sk.key] || false}
                        onChange={(e) => {
                           const newSkills = { ...(formData.data?.skills || {}) };
                           newSkills[sk.key] = e.target.checked;
                           onFullChange({...formData, data: {...formData.data, skills: newSkills}});
                        }}
                        className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                      />
                      <span className="text-xs text-white font-bold group-hover:text-teal-400 transition-colors">{sk.label}</span>
                   </label>
                 ))}
               </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'combat',
      label: 'Combat & Arsenal',
      icon: Sword,
      fields: [
        { 
          name: 'armor_prof_custom', 
          isVirtual: true,
          label: 'Maîtrises d\'Armures', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <div className="bg-[#151725] p-4 rounded-xl border border-white/5 mb-4 flex flex-wrap gap-6 justify-center">
              {[
                { key: 'prof_armor_light', label: 'Armure Légère' },
                { key: 'prof_armor_medium', label: 'Intermédiaire' },
                { key: 'prof_armor_heavy', label: 'Lourde' },
                { key: 'prof_armor_shields', label: 'Boucliers' }
              ].map(arm => (
                <label key={arm.key} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={formData.data?.[arm.key] || false} onChange={(e) => onFullChange({...formData, data: {...formData.data, [arm.key]: e.target.checked}})} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" />
                  <span className="text-xs text-silver group-hover:text-white transition-colors">{arm.label}</span>
                </label>
              ))}
            </div>
          )
        },
        { 
          name: 'arsenal_data', 
          isVirtual: true,
          label: 'Arsenal & Équipement', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <ArsenalEditor 
              value={formData.data?.arsenal || []} 
              onChange={(newArsenal) => onFullChange({ ...formData, data: { ...formData.data, arsenal: newArsenal } })} 
              formData={formData} 
            />
          )
        }
      ]
    },
    // --- NOUVEL ONGLET : CAPACITÉS & DONS ---
    {
      id: 'abilities',
      label: 'Capacités & Traits',
      icon: Award,
      fields: [
        {
          name: 'features_editor',
          isVirtual: true,
          label: 'Gestionnaire de Capacités',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <CharacterFeaturesEditor 
              character={formData} 
              onChange={(newData) => onFullChange({ ...formData, data: newData })} 
            />
          )
        }
      ]
    },
    {
      id: 'magic',
      label: 'Grimoire Arcanique',
      icon: Sparkles,
      fields: [
        { 
          name: 'spell_slots_custom', 
          isVirtual: true,
          label: 'Emplacements de Sorts (Niv 1 à 9)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <div className="bg-[#151725] p-4 rounded-xl border border-white/5 mb-6 shadow-inner">
               <label className="text-[10px] font-black uppercase text-silver/40 mb-3 block tracking-widest border-b border-white/10 pb-2">Suivi des Emplacements</label>
               <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
                 {[1,2,3,4,5,6,7,8,9].map(lvl => (
                    <div key={lvl} className="bg-black/40 border border-purple-500/20 rounded-lg p-2 flex flex-col items-center">
                       <span className="text-[9px] text-purple-400 font-black mb-1">Niv {lvl}</span>
                       <div className="w-full space-y-1">
                         <input type="number" placeholder="Tot" value={formData.data?.spell_slots?.[lvl]?.total || ''} onChange={(e) => { const val = parseInt(e.target.value) || 0; const newSlots = {...(formData.data?.spell_slots || {})}; if(!newSlots[lvl]) newSlots[lvl] = {total: 0, spent: 0}; newSlots[lvl].total = val; onFullChange({...formData, data: {...formData.data, spell_slots: newSlots}}); }} className="w-full bg-purple-500/10 border border-transparent text-center text-xs text-white rounded outline-none focus:border-purple-500 py-0.5" title="Total" />
                         <input type="number" placeholder="Dép" value={formData.data?.spell_slots?.[lvl]?.spent || ''} onChange={(e) => { const val = parseInt(e.target.value) || 0; const newSlots = {...(formData.data?.spell_slots || {})}; if(!newSlots[lvl]) newSlots[lvl] = {total: 0, spent: 0}; newSlots[lvl].spent = val; onFullChange({...formData, data: {...formData.data, spell_slots: newSlots}}); }} className="w-full bg-red-500/10 border border-transparent text-center text-xs text-red-300 rounded outline-none focus:border-red-500 py-0.5" title="Dépensés" />
                       </div>
                    </div>
                 ))}
               </div>
            </div>
          )
        },
        { 
          name: 'magic_editor', 
          isVirtual: true,
          label: 'Grimoire Complet (Le PDF est branché dessus !)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterSpellbook character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
          )
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Artisanat & Alchimie',
      icon: Hammer,
      fields: [
        { 
          name: 'crafting_bench', 
          isVirtual: true,
          label: 'Établi de Fabrication', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterCrafting character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
          )
        }
      ]
    },
    {
      id: 'bio',
      label: 'Biographie & Histoire',
      icon: Scroll,
      fields: [
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...' },
        { name: 'personality', label: 'Traits de Personnalité', type: 'textarea', rows: 3, placeholder: 'Caractère...' },
        { name: 'description', label: 'Apparence Physique', type: 'textarea', rows: 3, placeholder: 'Traits distinctifs...' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: Backpack,
      fields: [
        {
          name: 'money_custom',
          isVirtual: true,
          label: 'Bourse & Richesses',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-5 gap-3 mb-8 bg-[#0f111a] p-6 rounded-[2rem] border border-white/5">
              {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
                const colors = { pc: 'text-orange-400 border-orange-500/30', pa: 'text-zinc-400 border-zinc-400/30', pe: 'text-blue-300 border-blue-400/30', po: 'text-yellow-400 border-yellow-500/30', pp: 'text-slate-200 border-slate-500/30' };
                const labels = { pc: 'Cuivre', pa: 'Argent', pe: 'Électrum', po: 'Or', pp: 'Platine' };
                return (
                  <div key={coin} className={`bg-black/40 p-3 rounded-2xl border ${colors[coin]} text-center`}>
                    <span className="text-[9px] font-black uppercase mb-1 block text-silver/60">{labels[coin]}</span>
                    <input 
                      type="number" 
                      value={formData.data?.[`money_${coin}`] || 0} 
                      onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                      className={`w-full bg-transparent text-center text-lg font-black outline-none [&::-webkit-inner-spin-button]:appearance-none ${colors[coin].split(' ')[0]}`} 
                    />
                  </div>
                );
              })}
            </div>
          )
        },
        { 
          name: 'inventory_data', 
          isVirtual: true,
          label: 'Sac à dos (Équipement BD)', 
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
    },
    {
      id: 'gm',
      label: 'MJ (Secret)',
      icon: Skull,
      fields: [
        { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...' }
      ]
    }
  ]
};

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  const handleLevelUpClick = (char) => {
    setLevelUpChar(char);
    setShowLevelUp(true);
  };

  return (
    <>
      <div className="max-w-[1920px] mx-auto px-6 pt-6 flex justify-end">
        <button 
          onClick={runSmokeTestPDF}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all hover:scale-105"
        >
          <AlertTriangle size={16} /> Smoke Test PDF
        </button>
      </div>

      <EntityList 
        key={refreshKey} 
        tableName="characters" 
        title="Forge des Personnages" 
        icon={User} 
        onView={(it) => setSelectedItem(it)} 
        onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={async (it) => { 
          if (confirm(`Supprimer ${it.name}?`)) { 
            await supabase.from('characters').delete().eq('id', it.id); 
            setRefreshKey(k => k + 1); 
          }
        }} 
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={getAugmentedItem(selectedItem)} 
        config={charactersConfig} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} 
        onLevelUp={() => handleLevelUpClick(selectedItem)}
        onExportPDF={() => generatePDF(selectedItem)}
      />
      
      <EnhancedEntityForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        item={editingItem} 
        config={charactersConfig} 
        onSuccess={() => setRefreshKey(k => k + 1)} 
      />

      {showLevelUp && levelUpChar && (
        <LevelUpWizard 
          character={levelUpChar}
          onClose={() => setShowLevelUp(false)}
          onSuccess={() => {
            setShowLevelUp(false);
            setRefreshKey(k => k + 1);
            setSelectedItem(null); 
          }}
        />
      )}
    </>
  );
}