// src/components/CharacterFeaturesEditor.jsx
import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, RefreshCw, Shield, Award, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CharacterFeaturesEditor({ character, onChange }) {
  const [loading, setLoading] = useState(false);
  const [newProf, setNewProf] = useState('');
  const [newTrait, setNewTrait] = useState({ name: '', desc: '' });
  const [newFeat, setNewFeat] = useState({ name: '', desc: '' });

  // Initialisation sécurisée
  const features = character.data?.dynamic_features || { traits: [], proficiencies: [], class_features: [] };

  // Fonction centrale qui met à jour l'interface ET les champs textes invisibles pour le PDF
  const updateFeatures = (newDynamicFeatures) => {
    const racialStr = newDynamicFeatures.traits.map(t => `• ${t.name}${t.desc ? `\n  ${t.desc}` : ''}`).join('\n\n');
    const profStr = newDynamicFeatures.proficiencies.map(p => `• ${p.name}`).join('\n');
    const featStr = newDynamicFeatures.class_features.map(f => `• ${f.name}${f.desc ? `\n  ${f.desc}` : ''}`).join('\n\n');

    onChange({
      ...character.data,
      dynamic_features: newDynamicFeatures,
      racial_traits: racialStr,       // Pour le PDF
      proficiencies: profStr,         // Pour le PDF
      features: featStr               // Pour le PDF
    });
  };

  // Synchronisation avec la Base de Données
  const syncFromDB = async () => {
    setLoading(true);
    try {
      let newTraits = [...features.traits];
      let newProfs = [...features.proficiencies];
      let newClassFeats = [...features.class_features];

      // 1. Récupération de la Race
      if (character.race_id) {
        const { data: race } = await supabase.from('races').select('*').eq('id', character.race_id).single();
        if (race) {
          if (race.traits && !newTraits.some(t => t.name === 'Traits Raciaux Innés')) {
            newTraits.push({ name: 'Traits Raciaux Innés', desc: race.traits });
          }
          if (race.languages && !newProfs.some(p => p.name.includes(race.languages))) {
            newProfs.push({ name: `Langues : ${race.languages}` });
          }
        }
      }

      // 2. Récupération de la Classe
      if (character.class_id) {
        const { data: cls } = await supabase.from('character_classes').select('*').eq('id', character.class_id).single();
        if (cls) {
          if (cls.weapon_proficiencies && !newProfs.some(p => p.name.includes('Armes :'))) {
            newProfs.push({ name: `Armes : ${cls.weapon_proficiencies}` });
          }
          if (cls.tool_proficiencies && !newProfs.some(p => p.name.includes('Outils :'))) {
            newProfs.push({ name: `Outils : ${cls.tool_proficiencies}` });
          }
        }

        // 3. Capacités de Classe selon le Niveau
        const { data: classFeatures } = await supabase
          .from('class_features')
          .select('*')
          .eq('class_id', character.class_id)
          .lte('level', character.level || 1);

        if (classFeatures) {
          classFeatures.forEach(cf => {
            if (!newClassFeats.some(f => f.name === cf.name)) {
              newClassFeats.push({ name: cf.name, desc: cf.description });
            }
          });
        }
      }

      updateFeatures({ traits: newTraits, proficiencies: newProfs, class_features: newClassFeats });
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la synchronisation.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* HEADER & BOUTON SYNC */}
      <div className="bg-gradient-to-r from-teal-900/40 to-blue-900/20 border border-teal-500/30 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-white font-black uppercase tracking-widest flex items-center gap-2">
            <Award className="text-teal-400" /> Registre des Capacités
          </h3>
          <p className="text-[10px] text-silver/60 uppercase tracking-widest mt-1">Gérez les dons, maîtrises et capacités de classe de façon dynamique.</p>
        </div>
        <button 
          onClick={syncFromDB} 
          disabled={loading}
          className="bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 px-4 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg border border-teal-500/30 whitespace-nowrap"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? 'Consultation...' : 'Synchroniser avec la BDD'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE 1 : MAÎTRISES & LANGUES */}
        <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-5 shadow-inner flex flex-col">
          <h4 className="text-xs font-black text-silver uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <Shield size={14} className="text-blue-400"/> Maîtrises & Langues
          </h4>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {features.proficiencies.map((prof, idx) => (
              <div key={idx} className="bg-[#151725] border border-white/5 rounded-xl p-3 flex justify-between items-center group">
                <span className="text-xs text-white font-bold">{prof.name}</span>
                <button onClick={() => { const n = [...features.proficiencies]; n.splice(idx,1); updateFeatures({...features, proficiencies: n}); }} className="text-silver/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14}/></button>
              </div>
            ))}
            {features.proficiencies.length === 0 && <p className="text-[10px] text-center text-silver/40 uppercase italic py-4">Aucune maîtrise enregistrée</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="Ajouter (ex: Outils de voleur)" value={newProf} onChange={e=>setNewProf(e.target.value)} className="flex-1 bg-black/40 text-xs text-white border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500" />
            <button onClick={() => { if(newProf){ updateFeatures({...features, proficiencies: [...features.proficiencies, {name: newProf}]}); setNewProf(''); } }} className="bg-blue-500/20 text-blue-400 p-2 rounded-lg hover:bg-blue-500/40 transition-all"><Plus size={16}/></button>
          </div>
        </div>

        {/* COLONNE 2 : TRAITS RACIAUX & DONS */}
        <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-5 shadow-inner flex flex-col">
          <h4 className="text-xs font-black text-silver uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <Sparkles size={14} className="text-amber-400"/> Traits Raciaux & Dons
          </h4>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {features.traits.map((trait, idx) => (
              <div key={idx} className="bg-[#151725] border border-white/5 rounded-xl p-3 group relative">
                <button onClick={() => { const n = [...features.traits]; n.splice(idx,1); updateFeatures({...features, traits: n}); }} className="absolute top-3 right-3 text-silver/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-[#151725] pl-2"><Trash2 size={14}/></button>
                <h5 className="text-xs text-amber-400 font-black mb-1 pr-6">{trait.name}</h5>
                <p className="text-[10px] text-silver/70 leading-relaxed whitespace-pre-wrap">{trait.desc}</p>
              </div>
            ))}
            {features.traits.length === 0 && <p className="text-[10px] text-center text-silver/40 uppercase italic py-4">Aucun trait enregistré</p>}
          </div>
          <div className="mt-4 flex flex-col gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
            <input type="text" placeholder="Nom du Don ou Trait" value={newTrait.name} onChange={e=>setNewTrait({...newTrait, name: e.target.value})} className="bg-transparent text-xs text-white border-b border-white/10 pb-1 outline-none focus:border-amber-500 font-bold" />
            <div className="flex gap-2">
              <input type="text" placeholder="Description courte..." value={newTrait.desc} onChange={e=>setNewTrait({...newTrait, desc: e.target.value})} className="flex-1 bg-transparent text-[10px] text-silver outline-none" />
              <button onClick={() => { if(newTrait.name){ updateFeatures({...features, traits: [...features.traits, newTrait]}); setNewTrait({name:'', desc:''}); } }} className="bg-amber-500/20 text-amber-400 p-1.5 rounded-lg hover:bg-amber-500/40 transition-all"><Plus size={14}/></button>
            </div>
          </div>
        </div>

        {/* COLONNE 3 : CAPACITÉS DE CLASSE */}
        <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-5 shadow-inner flex flex-col">
          <h4 className="text-xs font-black text-silver uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <BookOpen size={14} className="text-purple-400"/> Capacités de Classe
          </h4>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {features.class_features.map((feat, idx) => (
              <div key={idx} className="bg-[#151725] border border-white/5 rounded-xl p-3 group relative">
                <button onClick={() => { const n = [...features.class_features]; n.splice(idx,1); updateFeatures({...features, class_features: n}); }} className="absolute top-3 right-3 text-silver/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-[#151725] pl-2"><Trash2 size={14}/></button>
                <h5 className="text-xs text-purple-400 font-black mb-1 pr-6">{feat.name}</h5>
                <p className="text-[10px] text-silver/70 leading-relaxed whitespace-pre-wrap">{feat.desc}</p>
              </div>
            ))}
            {features.class_features.length === 0 && <p className="text-[10px] text-center text-silver/40 uppercase italic py-4">Aucune capacité enregistrée</p>}
          </div>
          <div className="mt-4 flex flex-col gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
            <input type="text" placeholder="Nom de la capacité" value={newFeat.name} onChange={e=>setNewFeat({...newFeat, name: e.target.value})} className="bg-transparent text-xs text-white border-b border-white/10 pb-1 outline-none focus:border-purple-500 font-bold" />
            <div className="flex gap-2">
              <input type="text" placeholder="Description courte..." value={newFeat.desc} onChange={e=>setNewFeat({...newFeat, desc: e.target.value})} className="flex-1 bg-transparent text-[10px] text-silver outline-none" />
              <button onClick={() => { if(newFeat.name){ updateFeatures({...features, class_features: [...features.class_features, newFeat]}); setNewFeat({name:'', desc:''}); } }} className="bg-purple-500/20 text-purple-400 p-1.5 rounded-lg hover:bg-purple-500/40 transition-all"><Plus size={14}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}