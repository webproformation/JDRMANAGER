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
  { key: 'athletics', label: 'Athlétisme', attr: 'str' },
  { key: 'acrobatics', label: 'Acrobaties', attr: 'dex' },
  { key: 'sleight_of_hand', label: 'Escamotage', attr: 'dex' },
  { key: 'stealth', label: 'Discrétion', attr: 'dex' },
  { key: 'arcana', label: 'Arcanes', attr: 'int' },
  { key: 'history', label: 'Histoire', attr: 'int' },
  { key: 'investigation', label: 'Investigation', attr: 'int' },
  { key: 'nature', label: 'Nature', attr: 'int' },
  { key: 'religion', label: 'Religion', attr: 'int' },
  { key: 'animal_handling', label: 'Dressage', attr: 'wis' },
  { key: 'insight', label: 'Perspicacité', attr: 'wis' },
  { key: 'medicine', label: 'Médecine', attr: 'wis' },
  { key: 'perception', label: 'Perception', attr: 'wis' },
  { key: 'survival', label: 'Survie', attr: 'wis' },
  { key: 'deception', label: 'Tromperie', attr: 'cha' },
  { key: 'intimidation', label: 'Intimidation', attr: 'cha' },
  { key: 'performance', label: 'Représentation', attr: 'cha' },
  { key: 'persuasion', label: 'Persuasion', attr: 'cha' }
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
          fullWidth: true,
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
        { name: 'image_url', label: 'Portrait', type: 'image', fullWidth: true }
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
          fullWidth: true,
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
          label: 'État Vital & Survie', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => {
            const stats = calculateCombatStats(item.ruleset_id || 'dnd5', item.data || {}, item.level);
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-teal-500/30 text-center flex-1">
                  <div className="text-[10px] text-teal-500/60 uppercase tracking-widest mb-1">Perception Passive</div>
                  <div className="text-teal-400 font-black text-2xl">👁️ {stats.passive_perception || 10}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center flex-1">
                  <div className="text-[10px] text-silver/60 uppercase tracking-widest mb-1">Dés de Vie</div>
                  <div className="text-white font-bold text-2xl">{item.data?.hit_dice_spent || 0} / {stats.hit_dice_max || '1d8'}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center flex-1">
                  <div className="text-[10px] text-silver/60 uppercase tracking-widest mb-1">Jets de Mort</div>
                  <div className="flex justify-center gap-3 mt-1">
                    <span className="text-xs text-green-400 font-black uppercase">V: {item.data?.death_saves?.successes || 0}</span>
                    <span className="text-xs text-red-400 font-black uppercase">X: {item.data?.death_saves?.failures || 0}</span>
                  </div>
                </div>
              </div>
            );
          },
          component: ({ formData, onFullChange }) => {
            const currentPerception = calculateCombatStats(formData.ruleset_id || 'dnd5', formData.data || {}, formData.level).passive_perception || 10;
            const autoHitDice = calculateCombatStats(formData.ruleset_id || 'dnd5', formData.data || {}, formData.level).hit_dice_max || '1d8';
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-black/40 p-6 rounded-2xl border border-teal-500/30 text-center flex flex-col justify-center">
                  <span className="text-[10px] text-teal-500/60 font-black uppercase tracking-widest mb-1">Perception Passive</span>
                  <span className="text-teal-400 font-black text-3xl">👁️ {currentPerception}</span>
                </div>
                
                <div className="bg-[#151725] p-6 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-3 block">Dés de Vie</span>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Dépensés" value={formData.data?.hit_dice_spent || ''} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_spent: e.target.value } })} className="w-full bg-black/40 text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500 text-center font-bold"/>
                    <span className="text-silver/40 py-3 font-black">/</span>
                    <input type="text" placeholder="Max" value={formData.data?.hit_dice_max || autoHitDice} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_max: e.target.value } })} className="w-full bg-black/40 text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500 text-center font-bold"/>
                  </div>
                </div>

                <div className="bg-[#151725] p-6 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-3 block text-center">Sauvegardes de Mort</span>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                      <span className="text-[10px] font-black text-green-400 uppercase">Succès</span>
                      <div className="flex gap-2">
                        {[1,2,3].map(num => (
                          <input key={`succ-${num}`} type="checkbox" checked={(formData.data?.death_saves?.successes || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, successes: val}}}); }} className="w-5 h-5 accent-green-500 rounded cursor-pointer" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                      <span className="text-[10px] font-black text-red-400 uppercase">Échecs</span>
                      <div className="flex gap-2">
                        {[1,2,3].map(num => (
                          <input key={`fail-${num}`} type="checkbox" checked={(formData.data?.death_saves?.failures || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, failures: val}}}); }} className="w-5 h-5 accent-red-500 rounded cursor-pointer" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        },
        { 
          name: 'data', 
          label: 'Attributs Primaires', 
          type: 'custom', 
          fullWidth: true,
          render: (val, item) => {
            const d = item.data || {};
            const stats = [
              {k:'str', l:'FOR'}, {k:'dex', l:'DEX'}, {k:'con', l:'CON'},
              {k:'int', l:'INT'}, {k:'wis', l:'SAG'}, {k:'cha', l:'CHA'}
            ];
            return (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {stats.map(s => {
                   const mod = Math.floor(((d[s.k] || 10) - 10) / 2);
                   return (
                    <div key={s.k} className="bg-[#151725] border border-white/5 rounded-2xl p-4 text-center shadow-inner">
                      <div className="text-[10px] text-silver/60 font-black uppercase mb-1">{s.l}</div>
                      <div className="text-3xl text-white font-black">{d[s.k] || 10}</div>
                      <div className="text-[10px] text-teal-400 font-bold">{mod >= 0 ? '+'+mod : mod}</div>
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
          label: 'Compétences & Maîtrises', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => {
            const d = item.data || {};
            const profBonus = Math.floor(((item.level || 1) - 1) / 4) + 2;

            return (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                  {DND_SKILLS.map(sk => {
                    const isProf = d.skills?.[sk.key];
                    const attrMod = Math.floor(((d[sk.attr] || 10) - 10) / 2);
                    const bonus = attrMod + (isProf ? profBonus : 0);

                    return (
                      <div key={sk.key} className={`p-3 rounded-xl border text-center transition-all ${isProf ? 'bg-teal-500/10 border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]' : 'bg-black/20 border-white/5 opacity-60'}`}>
                        <div className="text-[9px] font-black text-silver/50 uppercase tracking-tighter mb-1 truncate" title={sk.label}>{sk.label}</div>
                        <div className={`text-xl font-black ${isProf ? 'text-teal-400' : 'text-white'}`}>{bonus >= 0 ? '+'+bonus : bonus}</div>
                        {isProf && <div className="text-[8px] font-black text-teal-500 uppercase mt-1">Maîtrisé</div>}
                      </div>
                    );
                  })}
               </div>
            );
          },
          component: ({ formData, onFullChange }) => {
            const d = formData.data || {};
            const profBonus = Math.floor(((formData.level || 1) - 1) / 4) + 2;

            return (
              <div className="bg-[#151725] p-8 rounded-[2rem] border border-white/5 mt-4 shadow-inner">
                <label className="text-[10px] font-black uppercase text-teal-500/60 mb-6 block tracking-widest border-b border-white/10 pb-4">Tableau des Compétences (Cocher pour Maîtrise)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DND_SKILLS.map(sk => {
                    const isProf = d.skills?.[sk.key] || false;
                    const attrMod = Math.floor(((d[sk.attr] || 10) - 10) / 2);
                    const bonus = attrMod + (isProf ? profBonus : 0);

                    return (
                      <label key={sk.key} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${isProf ? 'bg-teal-500/5 border-teal-500/30' : 'bg-black/40 border-white/5'}`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="checkbox" 
                            checked={isProf} 
                            onChange={(e) => {
                               const newSkills = { ...(d.skills || {}) };
                               newSkills[sk.key] = e.target.checked;
                               onFullChange({...formData, data: {...d, skills: newSkills}});
                            }}
                            className="w-5 h-5 accent-teal-500 rounded"
                          />
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase ${isProf ? 'text-white' : 'text-silver/40'}`}>{sk.label}</span>
                            <span className="text-[9px] text-silver/20 font-bold uppercase">{sk.attr}</span>
                          </div>
                        </div>
                        <span className={`text-xl font-black ${isProf ? 'text-teal-400' : 'text-silver/20'}`}>{bonus >= 0 ? '+'+bonus : bonus}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          }
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
          fullWidth: true,
          render: (_, item) => {
            const profs = new Set();
            if(item.data?.prof_armor_light) profs.add("Armure Légère");
            if(item.data?.prof_armor_medium) profs.add("Intermédiaire");
            if(item.data?.prof_armor_heavy) profs.add("Lourde");
            if(item.data?.prof_armor_shields) profs.add("Boucliers");
            
            const feats = Array.isArray(item.data?.feats) ? item.data.feats : [];
            feats.forEach(f => {
               if (f.data?.proficiencies?.armor) {
                   f.data.proficiencies.armor.forEach(a => {
                       if (a === 'light') profs.add("Armure Légère");
                       if (a === 'medium') profs.add("Intermédiaire");
                       if (a === 'heavy') profs.add("Lourde");
                       if (a === 'shield') profs.add("Boucliers");
                   });
               }
            });

            return <div className="text-sm text-amber-400 font-bold">{profs.size > 0 ? Array.from(profs).join(", ") : "Aucune maîtrise d'armure"}</div>;
          },
          component: ({ formData, onFullChange }) => (
            <div className="bg-[#151725] p-6 rounded-[2rem] border border-white/5 mb-4 flex flex-wrap gap-8 justify-center shadow-inner">
              {[
                { key: 'prof_armor_light', label: 'Armure Légère' },
                { key: 'prof_armor_medium', label: 'Intermédiaire' },
                { key: 'prof_armor_heavy', label: 'Lourde' },
                { key: 'prof_armor_shields', label: 'Boucliers' }
              ].map(arm => (
                <label key={arm.key} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={formData.data?.[arm.key] || false} onChange={(e) => onFullChange({...formData, data: {...formData.data, [arm.key]: e.target.checked}})} className="w-5 h-5 accent-amber-500 rounded cursor-pointer" />
                  <span className="text-[10px] font-black uppercase text-silver/60 group-hover:text-white transition-colors">{arm.label}</span>
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
          fullWidth: true,
          render: (_, item) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(item.data?.arsenal || []).length > 0 ? (item.data.arsenal).map((w, i) => (
                <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-white text-sm font-bold uppercase tracking-tight">{w.name}</span>
                  <div className="flex gap-4">
                    <span className="text-amber-400 font-black text-lg">{w.stats?.atk}</span>
                    <span className="text-silver font-bold uppercase text-xs">{w.stats?.dmg}</span>
                  </div>
                </div>
              )) : <span className="text-silver/40 text-xs italic p-4 text-center block w-full border border-dashed border-white/10 rounded-2xl">Armurerie vide</span>}
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
          label: 'Capacités de Classe',
          type: 'custom',
          fullWidth: true,
          render: (_, item) => {
             const f = item.data?.dynamic_features || { traits: [], proficiencies: [], class_features: [] };
             return (
               <div className="space-y-4">
                  {f.class_features.map((t,i) => (
                    <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                      <strong className="text-white text-sm font-bold uppercase tracking-widest">{t.name}</strong> 
                      <span className="text-[10px] text-silver/60 block mt-2 leading-relaxed">{t.desc}</span>
                    </div>
                  ))}
                  {f.class_features.length === 0 && <span className="text-silver/40 italic">Aucune capacité active.</span>}
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
          label: 'Traits & Dons', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => {
            const feats = Array.isArray(item.data?.feats) ? item.data.feats : [];
            const manualFeats = item.data?.feats_notes || (typeof item.data?.feats === 'string' ? item.data.feats : '');
            const resistances = new Set();
            const advantages = new Set();

            feats.forEach(f => {
              if (f.data?.resistances) f.data.resistances.forEach(r => resistances.add(r));
              if (f.data?.advantages?.saving_throws) f.data.advantages.saving_throws.forEach(st => advantages.add(`Sauvegarde (${st})`));
            });

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] border-b border-white/10 pb-2">Héritage Racial</h5>
                  <div className="whitespace-pre-wrap text-sm text-silver leading-relaxed italic">{item.data?.racial_traits || 'Aucun trait racial particulier.'}</div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em] border-b border-white/10 pb-2">Dons Majeurs</h5>
                  <div className="flex flex-wrap gap-2">
                    {feats.map((f, i) => (
                      <span key={i} className="bg-cyan-900/40 text-cyan-300 border border-cyan-500/20 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg" title={f.description}>{f.name}</span>
                    ))}
                    {feats.length === 0 && <span className="text-silver/40 text-xs italic">Aucun don systémique.</span>}
                  </div>
                  {(resistances.size > 0 || advantages.size > 0) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                       {Array.from(resistances).map(r => <span key={r} className="text-[8px] font-black uppercase bg-red-900/40 text-red-300 px-2 py-1 rounded-lg border border-red-500/20">🛡️ Rés: {r.replace(/_/g, ' ')}</span>)}
                       {Array.from(advantages).map(a => <span key={a} className="text-[8px] font-black uppercase bg-green-900/40 text-green-300 px-2 py-1 rounded-lg border border-green-500/20">⭐ Av: {a}</span>)}
                    </div>
                  )}
                </div>
              </div>
            );
          },
          component: ({ formData, onFullChange }) => {
            const feats = Array.isArray(formData.data?.feats) ? formData.data.feats : [];
            return (
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-silver/40 mb-2 block tracking-widest">Traits Raciaux (Texte libre)</label>
                  <textarea 
                    value={formData.data?.racial_traits || ''}
                    onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, racial_traits: e.target.value } })}
                    className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-[2rem] p-6 outline-none focus:border-teal-500/50 min-h-[120px] shadow-inner"
                  />
                </div>
                <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
                  <label className="text-[10px] font-black uppercase text-teal-400 mb-6 block tracking-widest">Récapitulatif des Dons Automatisés</label>
                  {feats.length > 0 ? (
                     <div className="flex flex-wrap gap-3">
                       {feats.map((f, i) => (
                          <div key={i} className="bg-[#151725] border border-teal-500/20 px-4 py-2 rounded-2xl flex items-center gap-4">
                            <span className="text-[10px] font-black text-white uppercase">{f.name}</span>
                            <button type="button" onClick={() => {
                                const newFeats = [...feats];
                                newFeats.splice(i, 1);
                                onFullChange({...formData, data: {...formData.data, feats: newFeats}});
                            }} className="text-red-400 hover:text-red-300 font-black text-lg">×</button>
                          </div>
                       ))}
                     </div>
                  ) : <div className="text-xs text-silver/40 italic">Aucun don sélectionné via la montée de niveau.</div>}
                </div>
              </div>
            );
          }
        },
        { 
          name: 'proficiencies_custom', 
          isVirtual: true,
          label: 'Maîtrises & Langages', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <strong className="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-2">Maîtrise d'Armes</strong>
                <div className="text-xs text-silver leading-relaxed">{item.data?.proficiencies || '—'}</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <strong className="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-2">Outils & Autres</strong>
                <div className="text-xs text-silver leading-relaxed">{item.data?.tool_proficiencies || '—'}</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <strong className="text-[10px] text-blue-400 font-black uppercase tracking-widest block mb-2">Langues Connues</strong>
                <div className="text-xs text-silver leading-relaxed">{item.data?.languages || 'Commun'}</div>
              </div>
            </div>
          ),
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea 
                value={formData.data?.proficiencies || ''}
                onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, proficiencies: e.target.value } })}
                placeholder="Maîtrises d'armes..."
                className="bg-[#151725] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none min-h-[100px]"
              />
              <textarea 
                value={formData.data?.tool_proficiencies || ''}
                onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, tool_proficiencies: e.target.value } })}
                placeholder="Maîtrises d'outils..."
                className="bg-[#151725] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none min-h-[100px]"
              />
              <input 
                type="text" 
                value={formData.data?.languages || ''}
                onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, languages: e.target.value } })}
                placeholder="Langues maîtrisées..."
                className="bg-[#151725] border border-white/10 rounded-2xl p-4 text-sm text-white outline-none md:col-span-2"
              />
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
          label: 'Suivi des Sorts', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => (
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5,6,7,8,9].map(lvl => {
                 const slot = item.data?.spell_slots?.[lvl];
                 if(!slot || slot.total === 0) return null;
                 return <span key={lvl} className="bg-purple-900/40 text-purple-300 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-purple-500/20 shadow-inner">Niv {lvl}: <strong>{slot.total - (slot.spent||0)}</strong> / {slot.total}</span>
              })}
            </div>
          ),
          component: ({ formData, onFullChange }) => (
            <div className="bg-[#151725] p-6 rounded-[2rem] border border-white/5 mb-6 shadow-inner">
               <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
                 {[1,2,3,4,5,6,7,8,9].map(lvl => (
                    <div key={lvl} className="bg-black/40 border border-purple-500/20 rounded-2xl p-3 flex flex-col items-center">
                       <span className="text-[10px] text-purple-400 font-black mb-2 uppercase">Niv {lvl}</span>
                       <div className="flex flex-col gap-2 w-full">
                         <input type="number" placeholder="Tot" value={formData.data?.spell_slots?.[lvl]?.total || ''} onChange={(e) => { const val = parseInt(e.target.value) || 0; const newSlots = {...(formData.data?.spell_slots || {})}; if(!newSlots[lvl]) newSlots[lvl] = {total: 0, spent: 0}; newSlots[lvl].total = val; onFullChange({...formData, data: {...formData.data, spell_slots: newSlots}}); }} className="w-full bg-purple-500/10 border border-transparent text-center text-xs text-white rounded-lg outline-none focus:border-purple-500 py-1" />
                         <input type="number" placeholder="Dép" value={formData.data?.spell_slots?.[lvl]?.spent || ''} onChange={(e) => { const val = parseInt(e.target.value) || 0; const newSlots = {...(formData.data?.spell_slots || {})}; if(!newSlots[lvl]) newSlots[lvl] = {total: 0, spent: 0}; newSlots[lvl].spent = val; onFullChange({...formData, data: {...formData.data, spell_slots: newSlots}}); }} className="w-full bg-red-500/10 border border-transparent text-center text-xs text-red-300 rounded-lg outline-none focus:border-red-500 py-1" />
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
          label: 'Registre des Sorts', 
          type: 'custom', 
          fullWidth: true,
          render: (_, item) => {
             const spells = item.data?.spells || {};
             const levels = Object.keys(spells).sort();
             if (levels.length === 0) return <div className="p-8 text-center text-silver/20 border border-dashed border-white/10 rounded-3xl italic">Grimoire vide.</div>;
             return (
               <div className="space-y-6">
                 {levels.map(lvl => (
                   <div key={lvl} className="bg-[#151725] p-6 rounded-[2rem] border border-white/5 shadow-inner">
                     <span className="text-[10px] font-black text-purple-400 block mb-4 uppercase tracking-widest border-b border-purple-500/20 pb-2">Niveau {lvl === '0' ? 'Tours de magie' : lvl}</span>
                     <div className="flex flex-wrap gap-2">
                       {spells[lvl].map((sp, i) => (
                         <span key={i} className="bg-black/40 text-silver text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-white/10">{typeof sp === 'string' ? sp : sp.name}</span>
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
          fullWidth: true,
          render: () => <div className="text-center text-silver/40 text-sm italic py-12 bg-black/40 rounded-[2rem] border border-dashed border-white/10">Consulter l'artisanat via le mode Édition.</div>,
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
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...', fullWidth: true },
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
          fullWidth: true,
          render: (_, item) => (
            <div className="flex flex-wrap gap-4">
              {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
                 const colors = { pc: 'text-orange-400 border-orange-500/20', pa: 'text-zinc-400 border-zinc-400/20', pe: 'text-blue-300 border-blue-400/20', po: 'text-yellow-400 border-yellow-500/30', pp: 'text-slate-200 border-slate-500/20' };
                 const labels = { pc: 'Cuivre', pa: 'Argent', pe: 'Électrum', po: 'Or', pp: 'Platine' };
                 return (
                   <div key={coin} className={`bg-black/40 px-6 py-4 rounded-2xl border ${colors[coin]} flex items-center gap-4 shadow-inner`}>
                     <span className="text-[10px] uppercase font-black tracking-widest text-silver/50">{labels[coin]}</span>
                     <span className={`text-2xl font-black ${colors[coin].split(' ')[0]}`}>{item.data?.[`money_${coin}`] || 0}</span>
                   </div>
                 );
              })}
            </div>
          ),
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-5 gap-4 mb-10 bg-[#0f111a] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
              {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
                const colors = { pc: 'text-orange-400 border-orange-500/30', pa: 'text-zinc-400 border-zinc-400/30', pe: 'text-blue-300 border-blue-400/30', po: 'text-yellow-400 border-yellow-500/40', pp: 'text-slate-200 border-slate-500/30' };
                const labels = { pc: 'Cu', pa: 'Ag', pe: 'El', po: 'Or', pp: 'Pl' };
                return (
                  <div key={coin} className={`bg-black/40 p-4 rounded-2xl border ${colors[coin]} text-center`}>
                    <span className="text-[10px] font-black uppercase mb-2 block text-silver/60">{labels[coin]}</span>
                    <input 
                      type="number" 
                      value={formData.data?.[`money_${coin}`] || 0} 
                      onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                      className={`w-full bg-transparent text-center text-2xl font-black outline-none [&::-webkit-inner-spin-button]:appearance-none ${colors[coin].split(' ')[0]}`} 
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
          fullWidth: true,
          render: (_, item) => (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {(item.data?.inventory || []).length > 0 ? (item.data.inventory).map((inv, i) => (
                 <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                   <div className="flex items-center gap-4">
                     <span className="bg-white/5 text-white font-black text-[10px] px-3 py-1.5 rounded-lg border border-white/10 uppercase">x{inv.quantity}</span>
                     <span className="text-white text-sm font-bold uppercase tracking-tight">{inv.name}</span>
                   </div>
                   <span className="text-silver/40 text-[10px] font-black uppercase">{inv.weight || '—'}</span>
                 </div>
               )) : <span className="text-silver/40 text-xs italic p-4 text-center block w-full border border-dashed border-white/10 rounded-2xl">Sac à dos vide</span>}
             </div>
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
        { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...', fullWidth: true }
      ]
    }
  ]
};