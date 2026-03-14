import React from 'react';
import { 
  Shield, Sword, Award, Check, Heart, Zap, 
  Activity, Eye, Crosshair, ChevronRight, Skull 
} from 'lucide-react';
import ArsenalEditor from '../../components/ArsenalEditor'; 
import CharacterFeaturesEditor from '../../components/CharacterFeaturesEditor';
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

// --- L'ÉDITEUR SUR-MESURE (Standard PRESTIGE 4.3.6) ---
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
       <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] mb-3 truncate w-full group-hover:text-[#2DD4BF] transition-colors">{label}</span>
       <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[40px]">
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val - 1); }} className="px-4 h-full hover:bg-white/5 text-silver font-black transition-colors">-</button>
          <input type="text" value={`${prefix && val > 0 ? '+' : ''}${val}`} readOnly className={`w-full bg-transparent text-center ${color} font-black text-sm outline-none`} />
          <button type="button" onClick={(e) => { e.preventDefault(); onUpdate(val + 1); }} className="px-4 h-full hover:bg-white/5 text-silver font-black transition-colors">+</button>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 6 Caractéristiques de base */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => {
          const score = value?.[s.k] || 10;
          const mod = Math.floor((score - 10) / 2);
          const formattedMod = mod >= 0 ? `+${mod}` : `${mod}`;
          return (
            <div key={s.k} className="bg-black/20 p-4 rounded-[1.5rem] border border-white/5 text-center shadow-inner flex flex-col items-center relative overflow-hidden group hover:border-[#2DD4BF]/30 transition-all">
               <span className="text-[10px] font-black uppercase text-silver/40 tracking-widest mb-3">{s.l}</span>
               <div className="flex items-center justify-center w-full bg-black/40 rounded-xl overflow-hidden border border-white/10 h-[40px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, Math.max(1, score - 1)); }} className="px-3 h-full hover:bg-white/5 text-silver font-black">-</button>
                  <input type="number" value={score} onChange={(e) => handleAttrChange(s.k, parseInt(e.target.value)||0)} className="w-full bg-transparent text-center text-white font-black text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleAttrChange(s.k, score + 1); }} className="px-3 h-full hover:bg-white/5 text-silver font-black">+</button>
               </div>
               <div className="mt-3 w-full bg-[#2DD4BF]/10 py-1 rounded-lg border border-[#2DD4BF]/20 shadow-inner group-hover:bg-[#2DD4BF]/20 transition-all">
                 <span className="text-[10px] font-black text-[#2DD4BF]">MOD {formattedMod}</span>
               </div>
            </div>
          );
        })}
      </div>

      {/* Santé & Combativité */}
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
            <div className="bg-black/20 p-5 rounded-2xl border border-[#2DD4BF]/20 text-center flex flex-col justify-center items-center shadow-inner group">
              <span className="text-[9px] text-[#2DD4BF]/60 font-black uppercase tracking-[0.2em] mb-2">Perception Passive</span>
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-[#2DD4BF]/40" />
                <span className="text-[#2DD4BF] font-black text-2xl drop-shadow-md">{stats.passive_perception || 10}</span>
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
              <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] mb-2 block">Sauvegardes de Mort</span>
              <div className="flex justify-center gap-4 mt-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-green-400/50 font-black uppercase">Succès</span>
                  <span className="text-lg text-green-400 font-black">{item.data?.death_saves?.successes || 0}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/5" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-red-400/50 font-black uppercase">Échecs</span>
                  <span className="text-lg text-red-400 font-black">{item.data?.death_saves?.failures || 0}</span>
                </div>
              </div>
            </div>
          </div>
        );
      },
      component: ({ formData, onFullChange }) => {
        const stats = calculateCombatStats(formData.ruleset_id || 'dnd5', formData.data || {}, formData.level);
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-black/20 p-6 rounded-[2rem] border border-[#2DD4BF]/20 text-center shadow-inner flex flex-col justify-center items-center group">
              <span className="text-[9px] text-[#2DD4BF]/60 font-black uppercase tracking-[0.3em] mb-2">Perception Passive</span>
              <span className="text-[#2DD4BF] font-black text-4xl drop-shadow-md">👁️ {stats.passive_perception || 10}</span>
            </div>
            
            <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-inner">
              <label className="text-[9px] text-silver/40 font-black uppercase tracking-[0.3em] mb-4 block text-center">Gestion des Dés de Vie</label>
              <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
                <input type="text" placeholder="Dépensés" value={formData.data?.hit_dice_spent || ''} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_spent: e.target.value } })} className="w-full bg-transparent text-xs text-white border-none text-center font-black outline-none"/>
                <span className="text-white/10 font-black">/</span>
                <input type="text" placeholder="Max" value={formData.data?.hit_dice_max || stats.hit_dice_max} onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, hit_dice_max: e.target.value } })} className="w-full bg-transparent text-xs text-white border-none text-center font-black outline-none"/>
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-inner">
              <label className="text-[9px] text-silver/40 font-black uppercase tracking-[0.3em] mb-4 block text-center">Compteur de Mort</label>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                  <span className="text-[9px] font-black text-green-400 uppercase">Succès</span>
                  <div className="flex gap-2">
                    {[1,2,3].map(num => (
                      <input key={`succ-${num}`} type="checkbox" checked={(formData.data?.death_saves?.successes || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, successes: val}}}); }} className="w-4 h-4 accent-green-500 rounded cursor-pointer" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  <span className="text-[9px] font-black text-red-400 uppercase">Échecs</span>
                  <div className="flex gap-2">
                    {[1,2,3].map(num => (
                      <input key={`fail-${num}`} type="checkbox" checked={(formData.data?.death_saves?.failures || 0) >= num} onChange={(e) => { const val = e.target.checked ? num : num - 1; onFullChange({...formData, data: {...formData.data, death_saves: {...formData.data?.death_saves, failures: val}}}); }} className="w-4 h-4 accent-red-500 rounded cursor-pointer" />
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
      label: 'Registre des Capacités', 
      type: 'custom', 
      component: ConnectedStatsEditor 
    },
    { 
      name: 'skills_custom', 
      isVirtual: true, 
      label: 'Compétences', 
      type: 'custom', 
      render: (_, item) => {
        const d = item.data || {};
        const profSkills = DND_SKILLS.filter(sk => d.skills?.[sk.key]);
        return (
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
              <h4 className="text-[10px] font-black uppercase text-silver/40 tracking-[0.2em] mb-5 border-b border-white/5 pb-2 ml-1">Maîtrises Actives</h4>
              <div className="flex flex-wrap gap-2">
                 {profSkills.length > 0 ? profSkills.map(sk => (
                   <div key={sk.key} className="bg-[#2DD4BF]/5 text-[#2DD4BF] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-[#2DD4BF]/20 shadow-inner flex items-center gap-2">
                     <Check size={12} /> {sk.label}
                   </div>
                 )) : <span className="text-silver/30 text-[10px] font-bold uppercase tracking-widest italic ml-1">Aucune spécialisation.</span>}
              </div>
            </div>
        );
      },
      component: ({ formData, onFullChange }) => {
        const d = formData.data || {};
        const derived = calculateCombatStats(formData.ruleset_id || 'dnd5', d, formData.level);
        const totalProf = parseInt(String(derived.prof || '+2').replace('+', '')) + (d.prof_override || 0);

        return (
            <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 mt-8 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase text-[#2DD4BF] tracking-[0.3em] mb-8 border-b border-[#2DD4BF]/20 pb-3 ml-1 flex items-center gap-3">
                <Crosshair size={16} /> Grille des Compétences (VTT Synchronisée)
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
                        <div className={`text-sm font-black ${total >= 0 ? 'text-[#2DD4BF]' : 'text-red-400'} drop-shadow-md`}>{total >= 0 ? '+'+total : total}</div>
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
  label: 'Arsenal & Combat',
  icon: Sword,
  fields: [
    { 
      name: 'armor_prof_custom', 
      isVirtual: true,
      label: 'Maîtrises Tactiques', 
      type: 'custom', 
      render: (_, item) => {
        const profs = [];
        if(item.data?.prof_armor_light) profs.push("Légère");
        if(item.data?.prof_armor_medium) profs.push("Intermédiaire");
        if(item.data?.prof_armor_heavy) profs.push("Lourde");
        if(item.data?.prof_armor_shields) profs.push("Boucliers");
        return (
          <div className="flex flex-wrap gap-2 mb-6">
            {profs.length > 0 ? profs.map(p => (
              <span key={p} className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-amber-500/20">{p}</span>
            )) : <span className="text-silver/30 text-[10px] font-bold uppercase tracking-widest italic ml-1">Aucune maîtrise d'armure.</span>}
          </div>
        );
      },
      component: ({ formData, onFullChange }) => (
        <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 mb-8 flex flex-wrap gap-6 justify-center shadow-inner">
          {[
            { key: 'prof_armor_light', label: 'Armure Légère' },
            { key: 'prof_armor_medium', label: 'Intermédiaire' },
            { key: 'prof_armor_heavy', label: 'Lourde' },
            { key: 'prof_armor_shields', label: 'Boucliers' }
          ].map(arm => (
            <label key={arm.key} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={formData.data?.[arm.key] || false} onChange={(e) => onFullChange({...formData, data: {...formData.data, [arm.key]: e.target.checked}})} className="w-5 h-5 accent-amber-500 rounded-lg cursor-pointer bg-black/40 border-white/10" />
              <span className="text-[10px] font-black uppercase text-silver group-hover:text-white transition-colors">{arm.label}</span>
            </label>
          ))}
        </div>
      )
    },
    { 
      name: 'arsenal_data', 
      isVirtual: true,
      label: 'Armurerie Interactive', 
      type: 'custom', 
      render: (_, item) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-700">
          {(item.data?.arsenal || []).length > 0 ? (item.data.arsenal).map((w, i) => (
            <div key={i} className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 group-hover:bg-amber-500/10 transition-all">
                  <Sword size={18} className="text-amber-500/60 group-hover:text-amber-500" />
                </div>
                <span className="text-white text-sm font-black uppercase tracking-tight">{w.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-silver/30 uppercase tracking-widest">Attaque</span>
                   <span className="text-amber-400 font-black text-lg drop-shadow-md">{w.stats?.atk || '+0'}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-silver/30 uppercase tracking-widest">Dégâts</span>
                   <span className="text-white font-black text-lg drop-shadow-md">{w.stats?.dmg || '1d4'}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-16 flex flex-col items-center border border-dashed border-white/5 rounded-[3rem] bg-black/10">
              <Skull size={48} className="text-white/5 mb-4" />
              <p className="text-silver/20 text-[10px] font-black uppercase tracking-[0.4em]">Arsenal non répertorié.</p>
            </div>
          )}
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
      label: 'Grimoire des Talents',
      type: 'custom',
      render: (_, item) => {
          const f = item.data?.dynamic_features || { traits: [], proficiencies: [], class_features: [] };
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-700">
              {f.class_features.map((t,i) => (
                <div key={i} className="bg-black/20 p-6 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all group shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
                    <strong className="text-white text-xs font-black uppercase tracking-widest">{t.name}</strong>
                  </div>
                  <p className="text-[11px] text-silver/60 leading-relaxed font-medium">{t.desc}</p>
                </div>
              ))}
              {f.class_features.length === 0 && (
                 <div className="col-span-full py-12 text-center border border-dashed border-white/5 rounded-[2.5rem]">
                   <p className="text-silver/20 text-[10px] font-black uppercase tracking-widest">Aucun talent de classe répertorié.</p>
                 </div>
              )}
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
      label: 'Patrimoine & Dons', 
      type: 'custom', 
      render: (_, item) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-inner">
            <h5 className="text-[9px] font-black text-amber-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Award size={14} /> Traits Raciaux
            </h5>
            <p className="text-xs text-silver/70 leading-relaxed italic whitespace-pre-wrap">{item.data?.racial_traits || 'Aucun trait spécifique.'}</p>
          </div>
          <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 shadow-inner">
            <h5 className="text-[9px] font-black text-[#2DD4BF] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Dons & Prouesses
            </h5>
            <p className="text-xs text-silver/70 leading-relaxed italic whitespace-pre-wrap">{item.data?.feats || 'Aucune spécialisation.'}</p>
          </div>
        </div>
      ),
      component: ({ formData, onFullChange }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-silver/40 tracking-widest ml-1">Traits Raciaux</label>
            <textarea 
              value={formData.data?.racial_traits || ''}
              onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, racial_traits: e.target.value } })}
              placeholder="Ex: Vision dans le noir, Résistance au poison..."
              className="w-full bg-black/40 text-sm text-white border border-white/10 rounded-[1.5rem] p-4 outline-none focus:border-amber-500/50 min-h-[120px] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-silver/40 tracking-widest ml-1">Dons (Feats)</label>
            <textarea 
              value={formData.data?.feats || ''}
              onChange={(e) => onFullChange({ ...formData, data: { ...formData.data, feats: e.target.value } })}
              placeholder="Ex: Mage de guerre, Athlète accompli..."
              className="w-full bg-black/40 text-sm text-white border border-white/10 rounded-[1.5rem] p-4 outline-none focus:border-[#2DD4BF]/50 min-h-[120px] transition-all"
            />
          </div>
        </div>
      )
    }
  ]
};