// src/pages/CharactersConfig.jsx
import React from 'react';
import { 
  User, Shield, Sword, Scroll, Crown, Skull, Backpack, 
  Sparkles, Hammer, Award
} from 'lucide-react';
import { DEFAULT_RULESETS } from '../data/rulesets';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import ArsenalEditor from '../components/ArsenalEditor'; 
import CharacterSpellbook from '../components/CharacterSpellbook';
import InventoryEditor from '../components/InventoryEditor';
import CharacterCrafting from '../components/CharacterCrafting';
import CosmicInfluenceStatus from '../components/CosmicInfluenceStatus';
import CharacterFeaturesEditor from '../components/CharacterFeaturesEditor';
import { calculateCombatStats } from '../utils/rulesEngine';

const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5'];
  
  const handleStatsChange = (newStats) => {
    const mergedData = { ...(value || {}), ...newStats };
    const derived = calculateCombatStats(currentRulesetId, mergedData, formData.level);
    onChange({ ...mergedData, ...derived });
  };
  
  return <DynamicStatsEditor ruleset={currentRuleset} data={value || {}} onChange={handleStatsChange} />;
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

export const charactersConfig = {
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
          render: (_, item) => <span className="text-silver italic text-xs">Propriétés dynamiques enregistrées.</span>,
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
          render: (_, item) => {
            const sizes = { small: 'Petite (P)', medium: 'Moyenne (M)', large: 'Grande (G)' };
            return <span className="text-white font-bold">{sizes[item.data?.size_cat || 'medium']}</span>;
          },
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
          render: (_, item) => <CosmicInfluenceStatus character={item} />, 
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
          render: (_, item) => {
            const stats = calculateCombatStats(item.ruleset_id || 'dnd5', item.data || {}, item.level);
            return (
              <div className="flex gap-4">
                <div className="bg-black/40 p-3 rounded-xl border border-teal-500/30 text-center flex-1">
                  <div className="text-[10px] text-teal-500/60 uppercase tracking-widest">Perception</div>
                  <div className="text-teal-400 font-black text-xl">👁️ {stats.passive_perception || 10}</div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center flex-1">
                  <div className="text-[10px] text-silver/60 uppercase tracking-widest">Dés de Vie</div>
                  <div className="text-white font-bold text-xl">{item.data?.hit_dice_spent || 0} / {stats.hit_dice_max || '1d8'}</div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center flex-1">
                  <div className="text-[10px] text-silver/60 uppercase tracking-widest">Jets de Mort</div>
                  <div className="flex justify-center gap-2 mt-1">
                    <span className="text-xs text-green-400 font-bold">V: {item.data?.death_saves?.successes || 0}</span>
                    <span className="text-xs text-red-400 font-bold">X: {item.data?.death_saves?.failures || 0}</span>
                  </div>
                </div>
              </div>
            );
          },
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
        { 
          name: 'data', 
          label: 'Fiche Technique Interactive', 
          type: 'custom', 
          render: (val, item) => {
            const d = item.data || {};
            const stats = [
              {k:'str', l:'FOR'}, {k:'dex', l:'DEX'}, {k:'con', l:'CON'},
              {k:'int', l:'INT'}, {k:'wis', l:'SAG'}, {k:'cha', l:'CHA'}
            ];
            return (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {stats.map(s => {
                   const mod = Math.floor(((d[s.k] || 10) - 10) / 2);
                   return (
                    <div key={s.k} className="bg-[#151725] border border-white/5 rounded-xl p-3 text-center shadow-inner">
                      <div className="text-[10px] text-silver/60 font-black uppercase">{s.l}</div>
                      <div className="text-2xl text-white font-black">{d[s.k] || 10}</div>
                      <div className="text-[10px] text-silver/40">{mod >= 0 ? '+'+mod : mod}</div>
                    </div>
                   )
                })}
              </div>
            );
          },
          component: ConnectedStatsEditor 
        },
        { 
          name: 'skills_custom', 
          isVirtual: true, 
          label: 'Les 18 Compétences', 
          type: 'custom', 
          render: (_, item) => {
            const profSkills = DND_SKILLS.filter(sk => item.data?.skills?.[sk.key]);
            return (
               <div className="flex flex-wrap gap-2">
                  {profSkills.length > 0 ? profSkills.map(sk => <span key={sk.key} className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded-lg border border-teal-500/30">{sk.label}</span>) : <span className="text-silver/40 text-xs italic">Aucune maîtrise enregistrée</span>}
               </div>
            );
          },
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
          render: (_, item) => {
            const profs = [];
            if(item.data?.prof_armor_light) profs.push("Armure Légère");
            if(item.data?.prof_armor_medium) profs.push("Intermédiaire");
            if(item.data?.prof_armor_heavy) profs.push("Lourde");
            if(item.data?.prof_armor_shields) profs.push("Boucliers");
            return <div className="text-sm text-amber-400 font-bold">{profs.length > 0 ? profs.join(", ") : "Aucune maîtrise d'armure"}</div>;
          },
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
          render: (_, item) => (
            <div className="space-y-2">
              {(item.data?.arsenal || []).length > 0 ? (item.data.arsenal).map((w, i) => (
                <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                  <span className="text-white text-sm font-bold">{w.name}</span>
                  <div className="flex gap-3">
                    <span className="text-amber-400 font-black">{w.stats?.atk}</span>
                    <span className="text-silver">{w.stats?.dmg}</span>
                  </div>
                </div>
              )) : <span className="text-silver/40 text-xs italic">Armurerie vide</span>}
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
    },
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
          render: (_, item) => {
             const f = item.data?.dynamic_features || { traits: [], proficiencies: [], class_features: [] };
             return (
               <div className="space-y-6">
                 <div>
                   <h5 className="text-xs text-purple-400 font-black mb-2 uppercase tracking-widest border-b border-purple-500/20 pb-1">Capacités de Classe</h5>
                   <ul className="text-sm text-silver space-y-2">{f.class_features.map((t,i) => <li key={i} className="bg-black/40 p-2 rounded-lg border border-white/5"><strong className="text-white">{t.name}</strong> <span className="text-[10px] text-silver/60 block">{t.desc}</span></li>)}</ul>
                 </div>
               </div>
             );
          },
          component: ({ formData, onFullChange }) => (
            <CharacterFeaturesEditor 
              character={formData} 
              onChange={(newData) => onFullChange({ ...formData, data: newData })} 
            />
          )
        },
        { 
          name: 'racial_traits_custom', 
          isVirtual: true,
          label: 'Traits Raciaux & Dons', 
          type: 'custom', 
          render: (_, item) => (
            <div className="space-y-4">
              <div>
                <strong className="text-xs text-amber-400 font-black uppercase tracking-widest block mb-1">Traits Raciaux</strong>
                <div className="whitespace-pre-wrap text-sm text-silver bg-black/40 p-3 rounded-xl border border-white/5">{item.data?.racial_traits || 'Aucun'}</div>
              </div>
              <div>
                <strong className="text-xs text-amber-400 font-black uppercase tracking-widest block mb-1">Dons (Feats)</strong>
                <div className="whitespace-pre-wrap text-sm text-silver bg-black/40 p-3 rounded-xl border border-white/5">{item.data?.feats || 'Aucun'}</div>
              </div>
            </div>
          ),
          component: ({ formData, onFullChange }) => (
            <div className="flex flex-col w-full mb-4 space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-silver/40 mb-1 tracking-widest block">Traits Raciaux</label>
                <textarea 
                  value={formData.data?.racial_traits || ''}
                  onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, racial_traits: e.target.value } })}
                  placeholder="Ex: Vision dans le noir, Ascendance féerique..."
                  className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50 min-h-[80px] resize-y"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-silver/40 mb-1 tracking-widest block">Dons (Feats)</label>
                <textarea 
                  value={formData.data?.feats || ''}
                  onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, feats: e.target.value } })}
                  placeholder="Ex: Mage de guerre, Chanceux..."
                  className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50 min-h-[80px] resize-y"
                />
              </div>
            </div>
          )
        },
        { 
          name: 'proficiencies_custom', 
          isVirtual: true,
          label: 'Entraînement & Maîtrises', 
          type: 'custom', 
          render: (_, item) => (
            <div className="space-y-4">
              <div>
                <strong className="text-xs text-blue-400 font-black uppercase tracking-widest block mb-1">Armes</strong>
                <div className="text-sm text-silver bg-black/40 p-3 rounded-xl border border-white/5">{item.data?.proficiencies || 'Aucune'}</div>
              </div>
              <div>
                <strong className="text-xs text-blue-400 font-black uppercase tracking-widest block mb-1">Outils</strong>
                <div className="text-sm text-silver bg-black/40 p-3 rounded-xl border border-white/5">{item.data?.tool_proficiencies || 'Aucun'}</div>
              </div>
              <div>
                <strong className="text-xs text-blue-400 font-black uppercase tracking-widest block mb-1">Langues</strong>
                <div className="text-sm text-silver bg-black/40 p-3 rounded-xl border border-white/5">{item.data?.languages || 'Commun'}</div>
              </div>
            </div>
          ),
          component: ({ formData, onFullChange }) => (
            <div className="flex flex-col w-full mb-4 space-y-3">
              <div>
                <label className="text-[10px] font-black uppercase text-silver/40 mb-1 tracking-widest block">Armes Maîtrisées</label>
                <textarea 
                  value={formData.data?.proficiencies || ''}
                  onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, proficiencies: e.target.value } })}
                  placeholder="Ex: Armes courantes, Épées longues..."
                  className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50 min-h-[60px] resize-y"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-silver/40 mb-1 tracking-widest block">Outils Maîtrisés</label>
                <textarea 
                  value={formData.data?.tool_proficiencies || ''}
                  onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, tool_proficiencies: e.target.value } })}
                  placeholder="Ex: Outils de voleur, Kit de forgeron..."
                  className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50 min-h-[60px] resize-y"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-silver/40 mb-1 tracking-widest block">Langues</label>
                <input 
                  type="text" 
                  value={formData.data?.languages || ''}
                  onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, languages: e.target.value } })}
                  placeholder="Langues maîtrisées (Ex: Commun, Elfique...)"
                  className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50"
                />
              </div>
            </div>
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
          render: (_, item) => (
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5,6,7,8,9].map(lvl => {
                 const slot = item.data?.spell_slots?.[lvl];
                 if(!slot || slot.total === 0) return null;
                 return <span key={lvl} className="bg-purple-900/40 text-purple-300 text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 shadow-inner">Niv {lvl}: <strong>{slot.total - (slot.spent||0)}</strong>/{slot.total} restants</span>
              })}
            </div>
          ),
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
          label: 'Grimoire Complet', 
          type: 'custom', 
          render: (_, item) => {
             const spells = item.data?.spells || {};
             const levels = Object.keys(spells).sort();
             if (levels.length === 0) return <span className="text-silver/40 text-sm italic">Aucun sort connu.</span>;
             return (
               <div className="space-y-4">
                 {levels.map(lvl => (
                   <div key={lvl} className="bg-[#151725] p-4 rounded-xl border border-white/5">
                     <span className="text-[10px] font-black text-purple-400 block mb-3 uppercase tracking-widest border-b border-purple-500/20 pb-1">Niveau {lvl === '0' ? 'Tours de magie' : lvl}</span>
                     <div className="flex flex-wrap gap-2">
                       {spells[lvl].map((sp, i) => (
                         <span key={i} className="bg-black/40 text-silver text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 hover:border-purple-500 transition-colors cursor-default">{typeof sp === 'string' ? sp : sp.name}</span>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             );
          },
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
          render: () => <div className="text-center text-silver/40 text-sm italic py-8 bg-black/40 rounded-xl border border-white/5">L'établi d'artisanat est uniquement accessible en mode Édition.</div>,
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
          render: (_, item) => (
            <div className="flex flex-wrap gap-3">
              {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
                 const colors = { pc: 'text-orange-400 border-orange-500/30', pa: 'text-zinc-400 border-zinc-400/30', pe: 'text-blue-300 border-blue-400/30', po: 'text-yellow-400 border-yellow-500/30', pp: 'text-slate-200 border-slate-500/30' };
                 const labels = { pc: 'Cuivre', pa: 'Argent', pe: 'Électrum', po: 'Or', pp: 'Platine' };
                 return (
                   <div key={coin} className={`bg-black/40 px-4 py-3 rounded-xl border ${colors[coin]} flex items-center gap-3 shadow-inner`}>
                     <span className="text-[10px] uppercase font-black tracking-widest text-silver/60">{labels[coin]}</span>
                     <span className={`text-lg font-black ${colors[coin].split(' ')[0]}`}>{item.data?.[`money_${coin}`] || 0}</span>
                   </div>
                 );
              })}
            </div>
          ),
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
          render: (_, item) => (
             <ul className="text-sm text-silver space-y-2">
               {(item.data?.inventory || []).length > 0 ? (item.data.inventory).map((inv, i) => (
                 <li key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <span className="bg-white/10 text-white font-bold text-xs px-2 py-1 rounded">x{inv.quantity}</span>
                     <span className="text-white font-bold">{inv.name}</span>
                   </div>
                   <span className="text-silver/60 text-xs">{inv.weight}</span>
                 </li>
               )) : <span className="text-silver/40 text-xs italic">Sac à dos vide</span>}
             </ul>
          ),
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