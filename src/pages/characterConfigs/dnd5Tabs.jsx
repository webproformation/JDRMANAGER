// src/pages/characterConfigs/dnd5Tabs.jsx
import React from 'react';
import { Shield, Sword, Award, Check, Sparkles, Hammer, Backpack } from 'lucide-react';
import ArsenalEditor from '../../components/ArsenalEditor'; 
import CharacterFeaturesEditor from '../../components/CharacterFeaturesEditor';
import CharacterSpellbook from '../../components/CharacterSpellbook';
import InventoryEditor from '../../components/InventoryEditor';
import CharacterCrafting from '../../components/CharacterCrafting';
import { calculateCombatStats } from '../../utils/rulesEngine';

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
    <div className={`p-3 rounded-2xl border ${border || 'border-white/5'} ${bg || 'bg-[#151725]'} text-center shadow-inner flex flex-col items-center`}>
       <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-2 truncate w-full">{label}</span>
       <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[36px]">
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val - 1); }} className="px-3 h-full hover:bg-white/10 text-silver font-black transition-colors">-</button>
          <input type="text" value={`${prefix && val > 0 ? '+' : ''}${val}`} readOnly className={`w-full bg-transparent text-center ${color} font-black text-sm outline-none`} />
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val + 1); }} className="px-3 h-full hover:bg-white/10 text-silver font-black transition-colors">+</button>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => {
          const score = value?.[s.k] || 10;
          const mod = Math.floor((score - 10) / 2);
          const formattedMod = mod >= 0 ? `+${mod}` : `${mod}`;
          return (
            <div key={s.k} className="bg-[#151725] p-3 rounded-2xl border border-white/5 text-center shadow-inner flex flex-col items-center relative overflow-hidden">
               <span className="text-[10px] font-black uppercase text-silver/60 tracking-widest mb-2">{s.l}</span>
               <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[36px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, Math.max(1, score - 1)); }} className="px-3 h-full hover:bg-white/10 text-silver font-black transition-colors flex items-center justify-center">-</button>
                  <input type="number" value={score} onChange={(e) => handleAttrChange(s.k, parseInt(e.target.value)||0)} className="w-full bg-transparent text-center text-white font-black text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, score + 1); }} className="px-3 h-full hover:bg-white/10 text-silver font-black transition-colors flex items-center justify-center">+</button>
               </div>
               <span className="text-[10px] font-bold text-teal-400 mt-2 bg-teal-900/20 px-2 py-0.5 rounded-md border border-teal-500/20 shadow-inner">Mod {formattedMod}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
        <StatWidget label="PV Actuels" val={value?.hp ?? 10} onUpdate={v => handleAttrChange('hp', v)} color="text-green-400" bg="bg-green-500/10" border="border-green-500/30" />
        <StatWidget label="PV Max" val={value?.hp_max ?? 10} onUpdate={v => handleAttrChange('hp_max', Math.max(1, v))} color="text-green-500" />
        <StatWidget label="PV Temp" val={value?.temp_hp ?? 0} onUpdate={v => handleAttrChange('temp_hp', Math.max(0, v))} color="text-cyan-400" />
        
        <StatWidget label="Armure (CA)" val={displayAc} onUpdate={v => handleAttrChange('ac_override', v - baseAc)} color="text-amber-400" />
        <StatWidget label="Initiative" val={displayInit} onUpdate={v => handleAttrChange('init_override', v - baseInit)} color="text-white" prefix={true} />
        <StatWidget label="Maîtrise" val={displayProf} onUpdate={v => handleAttrChange('prof_override', v - baseProf)} color="text-teal-400" prefix={true} />
      </div>
    </div>
  );
};

export const statsTab = {
  id: 'stats',
  label: 'Caractéristiques & Compétences',
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
          <div className="flex gap-4">
            <div className="bg-black/40 p-3 rounded-xl border border-teal-500/30 text-center flex-1 shadow-inner">
              <div className="text-[10px] text-teal-500/60 uppercase tracking-widest">Perception</div>
              <div className="text-teal-400 font-black text-xl">👁️ {stats.passive_perception || 10}</div>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center flex-1 shadow-inner">
              <div className="text-[10px] text-silver/60 uppercase tracking-widest">Dés de Vie</div>
              <div className="text-white font-bold text-xl">{item.data?.hit_dice_spent || 0} / {stats.hit_dice_max || '1d8'}</div>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center flex-1 shadow-inner">
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
            
            <div className="bg-[#151725] p-4 rounded-xl border border-white/5 shadow-inner">
              <span className="text-[10px] text-silver/60 font-black uppercase tracking-widest mb-2 block">Dés de Vie</span>
              <div className="flex gap-2">
                <input type="text" placeholder="Dépensés" value={formData.data?.hit_dice_spent || ''} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_spent: e.target.value } })} className="w-full bg-black/40 text-xs text-white border border-white/10 rounded-lg p-2 outline-none focus:border-teal-500 text-center font-bold"/>
                <span className="text-silver/40 py-2">/</span>
                <input type="text" placeholder="Max" value={formData.data?.hit_dice_max || autoHitDice} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_max: e.target.value } })} className="w-full bg-black/40 text-xs text-white border border-white/10 rounded-lg p-2 outline-none focus:border-teal-500 text-center font-bold"/>
              </div>
            </div>

            <div className="bg-[#151725] p-4 rounded-xl border border-white/5 shadow-inner">
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
        const derived = calculateCombatStats(item.ruleset_id || 'dnd5', d, item.level);
        const stats = [
          {k:'str', l:'FOR'}, {k:'dex', l:'DEX'}, {k:'con', l:'CON'},
          {k:'int', l:'INT'}, {k:'wis', l:'SAG'}, {k:'cha', l:'CHA'}
        ];

        const displayAc = (derived.ac || 10) + (d.ac_override || 0);
        const displayInit = parseInt(derived.init || 0) + (d.init_override || 0);
        const displayProf = parseInt(String(derived.prof || '+2').replace('+', '')) + (d.prof_override || 0);
        
        return (
          <div className="space-y-8">
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
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
               <div className="bg-[#151725] border border-green-500/30 rounded-2xl p-3 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">PV Actuels</div>
                  <div className="text-xl text-green-400 font-black mt-1">{d.hp ?? 10}</div>
               </div>
               <div className="bg-[#151725] border border-white/5 rounded-2xl p-3 text-center shadow-inner">
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">PV Max</div>
                  <div className="text-xl text-green-500 font-black mt-1">{d.hp_max ?? 10}</div>
               </div>
               <div className="bg-[#151725] border border-white/5 rounded-2xl p-3 text-center shadow-inner">
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">PV Temp</div>
                  <div className="text-xl text-cyan-400 font-black mt-1">{d.temp_hp ?? 0}</div>
               </div>
               <div className="bg-[#151725] border border-white/5 rounded-2xl p-3 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50"></div>
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">Armure (CA)</div>
                  <div className="text-xl text-amber-400 font-black mt-1">{displayAc}</div>
               </div>
               <div className="bg-[#151725] border border-white/5 rounded-2xl p-3 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">Initiative</div>
                  <div className="text-xl text-white font-black mt-1">{displayInit > 0 ? '+'+displayInit : displayInit}</div>
               </div>
               <div className="bg-[#151725] border border-white/5 rounded-2xl p-3 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50"></div>
                  <div className="text-[9px] text-silver/60 font-black uppercase tracking-widest">Maîtrise</div>
                  <div className="text-xl text-teal-400 font-black mt-1">+{displayProf}</div>
               </div>
            </div>
          </div>
        );
      },
      component: ConnectedStatsEditor 
    },
    { 
      name: 'skills_custom', 
      isVirtual: true, 
      label: 'Compétences', 
      type: 'custom', 
      render: (_, item) => {
        const d = item.data || {};
        const profSkills = DND_SKILLS.filter(sk => d.skills?.[sk.key] || d?.[sk.key]);
        return (
           <div>
              <h4 className="text-[10px] font-black uppercase text-silver/40 tracking-widest mb-3 border-b border-white/10 pb-2">Compétences Maîtrisées</h4>
              <div className="flex flex-wrap gap-2">
                 {profSkills.length > 0 ? profSkills.map(sk => <span key={sk.key} className="bg-teal-900/30 text-teal-300 text-xs px-3 py-1.5 rounded-lg border border-teal-500/30 shadow-inner">{sk.label}</span>) : <span className="text-silver/40 text-xs italic">Aucune maîtrise enregistrée</span>}
              </div>
           </div>
        );
      },
      component: ({ formData, onFullChange }) => {
        const level = formData.level || 1;
        const d = formData.data || {};
        const derived = calculateCombatStats(formData.ruleset_id || 'dnd5', d, level);
        const baseProf = parseInt(String(derived.prof || '+2').replace('+', ''));
        const totalProfBonus = baseProf + (d.prof_override || 0);

        return (
           <div className="bg-[#151725] p-5 rounded-2xl border border-white/5 mt-4 shadow-inner">
              <h4 className="text-[10px] font-black uppercase text-silver/40 tracking-widest mb-4 border-b border-white/10 pb-2">
                Maîtrise des Compétences
              </h4>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {DND_SKILLS.map(sk => {
                   const isProficient = d.skills?.[sk.key] || false;
                   const attrScore = d[sk.attr] || 10;
                   const attrMod = Math.floor((attrScore - 10) / 2);
                   const totalBonus = attrMod + (isProficient ? totalProfBonus : 0);
                   const formattedBonus = totalBonus >= 0 ? `+${totalBonus}` : `${totalBonus}`;

                   return (
                     <label key={sk.key} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                       <div className="relative flex items-center justify-center">
                         <input 
                           type="checkbox" 
                           checked={isProficient}
                           onChange={(e) => {
                              const newSkills = { ...(d.skills || {}) };
                              newSkills[sk.key] = e.target.checked;
                              onFullChange({...formData, data: {...d, skills: newSkills}});
                           }}
                           className="peer sr-only"
                         />
                         <div className="w-5 h-5 rounded border border-white/20 bg-black/50 peer-checked:bg-teal-500 peer-checked:border-teal-400 transition-all flex items-center justify-center">
                           <Check size={14} className="text-black opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" />
                         </div>
                       </div>
                       <div className="flex-1">
                         <span className="text-sm font-medium text-silver group-hover:text-white transition-colors">{sk.label}</span>
                         <span className="ml-2 text-xs font-bold text-teal-500/50 group-hover:text-teal-400 transition-colors">
                           ({formattedBonus})
                         </span>
                       </div>
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
};

export const abilitiesTab = {
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
};

export const magicTab = {
  id: 'magic',
  label: 'Grimoire Arcanique',
  icon: Sparkles,
  fields: [
    { 
      name: 'magic_editor', 
      isVirtual: true,
      label: 'Grimoire & Emplacements', 
      type: 'custom', 
      render: (_, item) => {
         const spells = item.data?.spells || {};
         const levels = Object.keys(spells).sort();
         
         return (
           <div className="space-y-6">
             <div className="flex gap-2 flex-wrap border-b border-white/10 pb-4">
               {[1,2,3,4,5,6,7,8,9].map(lvl => {
                  const slot = item.data?.spell_slots?.[lvl];
                  if(!slot || slot.total === 0) return null;
                  return (
                    <span key={lvl} className="bg-purple-900/40 text-purple-300 text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 shadow-inner">
                      Niv {lvl}: <strong>{slot.total - (slot.spent||0)}</strong>/{slot.total} restants
                    </span>
                  );
               })}
             </div>
             {levels.length === 0 ? (
                <span className="text-silver/40 text-sm italic">Aucun sort connu.</span>
             ) : (
               <div className="space-y-4">
                 {levels.map(lvl => (
                   <div key={lvl} className="bg-[#151725] p-4 rounded-xl border border-white/5">
                     <span className="text-[10px] font-black text-purple-400 block mb-3 uppercase tracking-widest border-b border-purple-500/20 pb-1">
                       Niveau {lvl === '0' ? 'Tours de magie' : lvl}
                     </span>
                     <div className="flex flex-wrap gap-2">
                       {spells[lvl].map((sp, i) => (
                         <span key={i} className="bg-black/40 text-silver text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 hover:border-purple-500 transition-colors cursor-default">
                           {typeof sp === 'string' ? sp : sp.name}
                         </span>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         );
      },
      component: ({ formData, onFullChange }) => (
        <CharacterSpellbook character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
      )
    }
  ]
};

export const craftingTab = {
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
};

export const inventoryTab = {
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
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
           {(item.data?.inventory || []).length > 0 ? (item.data.inventory).map((inv, i) => (
             <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-[1.5rem] border border-white/5 shadow-inner animate-in zoom-in-95 duration-300">
               <div className="flex items-center gap-5">
                 <span className="bg-white/5 text-white font-black text-[11px] px-4 py-2 rounded-xl border border-white/10 uppercase shadow-lg">x{inv.quantity}</span>
                 <span className="text-white text-sm font-black uppercase tracking-tight">{inv.name}</span>
               </div>
               <span className="text-silver/40 text-[10px] font-black uppercase tracking-widest">{inv.weight || '—'}</span>
             </div>
           )) : <div className="col-span-2 text-silver/30 text-xs italic p-12 text-center border border-dashed border-white/5 rounded-[3rem] uppercase tracking-widest font-black">Le sac à dos est vide.</div>}
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
};