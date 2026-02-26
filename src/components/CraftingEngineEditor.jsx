// src/components/CraftingEngineEditor.jsx
import React, { useState, useEffect } from 'react';
import { 
  Hammer, Beaker, Leaf, Gem, Sparkles, Plus, Minus, Trash2, 
  Clock, Target, CheckCircle, XCircle, Scroll, Book
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CraftingEngineEditor({ value = {}, onChange }) {
  const craftingData = value.crafting || {
    ingredients: [],
    steps: [],
    tools: '',
    base_dc: 10,
    critical_success: '',
    critical_failure: ''
  };

  // --- ÉTATS POUR LES DONNÉES DYNAMIQUES ---
  const [dbItems, setDbItems] = useState({ 
    minerals: [], 
    plants: [], 
    materials: [],
    spells: [] 
  });
  const [loading, setLoading] = useState(true);

  // État local pour le filtrage des sorts lors de la sélection
  const [spellFilters, setSpellFilters] = useState({}); // { ingredientIndex: { type: '', level: '' } }

  useEffect(() => {
    async function fetchData() {
      try {
        const [mineralsRes, plantsRes, materialsRes, spellsRes] = await Promise.all([
          supabase.from('minerals').select('id, name').order('name'),
          supabase.from('plants').select('id, name').order('name'),
          supabase.from('crafting_materials').select('id, name').order('name'),
          supabase.from('spells').select('id, name, type, level').order('level').order('name')
        ]);
        
        setDbItems({
          minerals: mineralsRes.data || [],
          plants: plantsRes.data || [],
          materials: materialsRes.data || [],
          spells: spellsRes.data || []
        });
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- LOGIQUE DE FILTRAGE DES SORTS ---
  const getAvailableSpellTypes = () => [...new Set(dbItems.spells.map(s => s.type))].sort();
  const getAvailableLevelsForType = (type) => {
    if (!type) return [];
    return [...new Set(dbItems.spells.filter(s => s.type === type).map(s => s.level))].sort((a, b) => a - b);
  };
  const getFilteredSpells = (type, level) => {
    return dbItems.spells.filter(s => s.type === type && s.level === parseInt(level));
  };

  // --- FONCTIONS DE MISE À JOUR ---
  const updateCrafting = (newData) => {
    onChange({ ...value, crafting: { ...craftingData, ...newData } });
  };

  const addIngredient = () => {
    const newIngredients = [...craftingData.ingredients, { type: 'material', name: '', quantity: '1', spellLevel: '', spellType: '' }];
    updateCrafting({ ingredients: newIngredients });
  };

  const updateIngredient = (index, field, val) => {
    const newIngredients = [...craftingData.ingredients];
    newIngredients[index][field] = val;
    updateCrafting({ ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    const newIngredients = craftingData.ingredients.filter((_, i) => i !== index);
    updateCrafting({ ingredients: newIngredients });
  };

  const addStep = () => {
    const newSteps = [...craftingData.steps, { title: 'Nouvelle étape', duration: '1 heure', dc_modifier: '+0', description: '' }];
    updateCrafting({ steps: newSteps });
  };

  const updateStep = (index, field, val) => {
    const newSteps = [...craftingData.steps];
    newSteps[index][field] = val;
    updateCrafting({ steps: newSteps });
  };

  if (loading) return <div className="p-8 text-center text-silver animate-pulse uppercase tracking-widest text-xs">Chargement du Grimoire et de la Forge...</div>;

  return (
    <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-amber-500/20 shadow-2xl space-y-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shadow-lg shadow-amber-500/10">
          <Hammer size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-widest uppercase">Moteur d'Artisanat & Magie</h3>
          <p className="text-[10px] text-silver/50 font-bold uppercase tracking-wider">Concevez le processus de création et les prérequis</p>
        </div>
      </div>

      {/* SECTION 1 : COMPOSANTS & SORTS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Beaker size={14} /> Ingrédients & Incantations
          </h4>
          <button type="button" onClick={addIngredient} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl border border-amber-500/20 transition-all">
            <Plus size={14} /> Ajouter
          </button>
        </div>
        
        <div className="space-y-4">
          {craftingData.ingredients.map((ing, idx) => (
            <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-3 items-center">
                {/* TYPE DE COMPOSANT */}
                <select 
                  value={ing.type} onChange={(e) => updateIngredient(idx, 'type', e.target.value)}
                  className="bg-[#151725] text-[10px] font-black uppercase tracking-widest text-teal-400 border border-white/10 rounded-xl p-2.5 outline-none focus:border-teal-500/50"
                >
                  <option value="material">Matériau</option>
                  <option value="mineral">Minéral</option>
                  <option value="plant">Plante</option>
                  <option value="spell">Sort / Rituel</option>
                  <option value="other">Autre</option>
                </select>

                {/* SÉLECTION DYNAMIQUE SELON LE TYPE */}
                {ing.type === 'spell' ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* École de Magie */}
                    <select 
                      value={ing.spellType || ''} 
                      onChange={(e) => {
                        updateIngredient(idx, 'spellType', e.target.value);
                        updateIngredient(idx, 'spellLevel', '');
                        updateIngredient(idx, 'name', '');
                      }}
                      className="bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-purple-500/50"
                    >
                      <option value="">École...</option>
                      {getAvailableSpellTypes().map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    {/* Niveau */}
                    <select 
                      value={ing.spellLevel || ''} 
                      onChange={(e) => {
                        updateIngredient(idx, 'spellLevel', e.target.value);
                        updateIngredient(idx, 'name', '');
                      }}
                      className="bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-purple-500/50"
                      disabled={!ing.spellType}
                    >
                      <option value="">Niveau...</option>
                      {getAvailableLevelsForType(ing.spellType).map(l => (
                        <option key={l} value={l}>{l === 0 ? 'Cantrip (0)' : `Niveau ${l}`}</option>
                      ))}
                    </select>

                    {/* Nom du Sort */}
                    <select 
                      value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      className="bg-[#151725] text-xs font-bold text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-purple-500/50"
                      disabled={!ing.spellLevel}
                    >
                      <option value="">Sélectionner le sort...</option>
                      {getFilteredSpells(ing.spellType, ing.spellLevel).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                ) : ing.type === 'other' ? (
                  <input 
                    type="text" value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                    placeholder="Nom du composant..." className="flex-1 bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-amber-500/50"
                  />
                ) : (
                  <select 
                    value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                    className="flex-1 bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-2.5 outline-none focus:border-amber-500/50 font-bold"
                  >
                    <option value="">-- Choisir dans la base --</option>
                    {ing.type === 'mineral' && dbItems.minerals.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                    {ing.type === 'plant' && dbItems.plants.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                    {ing.type === 'material' && dbItems.materials.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                  </select>
                )}

                <input 
                  type="text" value={ing.quantity} onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                  placeholder="Qté" className="w-20 bg-black/40 text-center text-xs font-black text-amber-400 border border-white/10 rounded-xl p-2.5 outline-none"
                />
                
                <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {craftingData.ingredients.length === 0 && (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-8 text-center">
              <p className="text-xs text-silver/30 font-bold uppercase tracking-widest">Aucun composant ou sort requis pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2 : CONDITIONS TECHNIQUES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-[10px] font-black text-silver uppercase tracking-widest flex items-center gap-2">
            <Hammer size={12}/> Outils & Difficulté
          </h4>
          <div>
            <label className="text-[9px] font-black uppercase text-silver/40 block mb-1.5 ml-1">Outils requis</label>
            <input type="text" value={craftingData.tools || ''} onChange={(e) => updateCrafting({ tools: e.target.value })} placeholder="Ex: Laboratoire d'alchimie..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500/50 outline-none" />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-silver/40 block mb-1.5 ml-1">Degré de Difficulté (DD) de Base</label>
            <input type="number" value={craftingData.base_dc || 10} onChange={(e) => updateCrafting({ base_dc: parseInt(e.target.value) || 10 })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500/50 outline-none" />
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <h4 className="text-[10px] font-black text-silver uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12}/> Conséquences Critiques
          </h4>
          <div>
            <label className="text-[9px] font-black uppercase text-green-400/60 block mb-1.5 ml-1 italic">Réussite Exceptionnelle</label>
            <textarea value={craftingData.critical_success || ''} onChange={(e) => updateCrafting({ critical_success: e.target.value })} placeholder="Ex: Bonus de +1 magique..." rows="1" className="w-full bg-black/40 border border-green-500/20 rounded-xl p-3 text-xs text-white focus:border-green-500/50 outline-none" />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-red-400/60 block mb-1.5 ml-1 italic">Échec Désastreux</label>
            <textarea value={craftingData.critical_failure || ''} onChange={(e) => updateCrafting({ critical_failure: e.target.value })} placeholder="Ex: Ingrédients perdus et explosion..." rows="1" className="w-full bg-black/40 border border-red-500/20 rounded-xl p-3 text-xs text-white focus:border-red-500/50 outline-none" />
          </div>
        </div>
      </section>

      {/* SECTION 3 : ÉTAPES DE FABRICATION */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock size={14} /> Étapes du Grand Œuvre
          </h4>
          <button type="button" onClick={addStep} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl border border-amber-500/20 transition-all">
            <Plus size={14} /> Ajouter une étape
          </button>
        </div>

        <div className="space-y-4">
          {craftingData.steps.map((step, idx) => (
            <div key={idx} className="bg-black/40 p-6 rounded-[1.5rem] border border-white/5 relative group transition-all hover:border-amber-500/20">
              <button type="button" onClick={() => removeStep(idx)} className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
              
              <div className="flex items-center gap-4 mb-5 pr-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs border border-amber-500/30 shadow-lg shadow-amber-500/10">
                  {idx + 1}
                </div>
                <input 
                  type="text" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)}
                  placeholder="Intitulé de l'étape..." className="flex-1 bg-transparent text-white font-bold text-base border-b border-white/10 focus:border-amber-500/50 outline-none pb-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-silver/40 mb-1.5 block ml-1">Durée requise</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-3 text-silver/30" />
                    <input type="text" value={step.duration} onChange={(e) => updateStep(idx, 'duration', e.target.value)} placeholder="Ex: 2 heures" className="w-full bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-3 pl-10 outline-none focus:border-amber-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-silver/40 mb-1.5 block ml-1">Modificateur DD</label>
                  <div className="relative">
                    <Target size={14} className="absolute left-3 top-3 text-silver/30" />
                    <input type="text" value={step.dc_modifier} onChange={(e) => updateStep(idx, 'dc_modifier', e.target.value)} placeholder="Ex: +2 (Difficile)" className="w-full bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-3 pl-10 outline-none focus:border-amber-500/50" />
                  </div>
                </div>
              </div>

              <textarea 
                value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)}
                placeholder="Décrivez précisément les gestes et les précautions à prendre..." rows="2" className="w-full bg-[#151725] text-xs text-silver/70 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500/50 italic leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}