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
        // CORRECTION DE LA TABLE : 'crafting_materials' au lieu de 'materials'
        const [mineralsRes, plantsRes, materialsRes, spellsRes] = await Promise.all([
          supabase.from('minerals').select('id, name').order('name'),
          supabase.from('plants').select('id, name').order('name'),
          supabase.from('crafting_materials').select('id, name').order('name'),
          supabase.from('spells').select('id, name, level, school').order('name')
        ]);

        setDbItems({
          minerals: mineralsRes.data || [],
          plants: plantsRes.data || [],
          materials: materialsRes.data || [],
          spells: spellsRes.data || []
        });
      } catch (error) {
        console.error("Erreur lors du chargement des bases d'ingrédients:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateCrafting = (updates) => {
    onChange({ ...value, crafting: { ...craftingData, ...updates } });
  };

  // --- GESTION DES INGRÉDIENTS ---
  const addIngredient = () => {
    const newIngredients = [...craftingData.ingredients, { type: 'mineral', id: '', name: '', quantity: 1 }];
    updateCrafting({ ingredients: newIngredients });
  };

  const removeIngredient = (index) => {
    const newIngredients = [...craftingData.ingredients];
    newIngredients.splice(index, 1);
    updateCrafting({ ingredients: newIngredients });
  };

  const updateIngredient = (index, field, val) => {
    const newIngredients = [...craftingData.ingredients];
    
    if (field === 'type') {
      newIngredients[index] = { type: val, id: '', name: '', quantity: 1 };
    } else if (field === 'id') {
      newIngredients[index].id = val;
      const listToSearch = dbItems[newIngredients[index].type + 's'] || dbItems[newIngredients[index].type] || [];
      const found = listToSearch.find(i => i.id === val);
      newIngredients[index].name = found ? found.name : '';
    } else {
      newIngredients[index][field] = val;
    }
    
    updateCrafting({ ingredients: newIngredients });
  };

  // --- GESTION DES ÉTAPES ---
  const addStep = () => {
    const newSteps = [...craftingData.steps, { description: '', duration: '', dc_modifier: '' }];
    updateCrafting({ steps: newSteps });
  };

  const removeStep = (index) => {
    const newSteps = [...craftingData.steps];
    newSteps.splice(index, 1);
    updateCrafting({ steps: newSteps });
  };

  const updateStep = (index, field, val) => {
    const newSteps = [...craftingData.steps];
    newSteps[index][field] = val;
    updateCrafting({ steps: newSteps });
  };

  if (loading) {
    return <div className="p-8 text-center text-silver/50 italic text-sm animate-pulse">Chargement de l'encyclopédie des matériaux...</div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER MOTEUR */}
      <div className="bg-gradient-to-r from-[#1a1d2d] to-[#151725] p-6 rounded-2xl border border-amber-500/20 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Hammer size={24} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Moteur d'Artisanat</h3>
            <p className="text-[10px] text-silver/60 uppercase tracking-widest mt-1">Configurez la recette et les règles de création</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE : INGRÉDIENTS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-6 shadow-inner">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Beaker size={16} /> Ingrédients Requis
              </h4>
              <button 
                type="button" onClick={addIngredient}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 p-2 rounded-xl transition-all border border-amber-500/20 flex items-center gap-2 text-[10px] font-black uppercase"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            {craftingData.ingredients.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl text-silver/30 text-xs italic">
                Aucun ingrédient défini.
              </div>
            ) : (
              <div className="space-y-3">
                {craftingData.ingredients.map((ing, idx) => (
                  <div key={idx} className="bg-[#151725] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center group hover:border-amber-500/30 transition-all">
                    
                    <div className="flex-1 w-full flex items-center gap-3">
                      {/* TYPE D'INGRÉDIENT */}
                      <select 
                        value={ing.type} 
                        onChange={(e) => updateIngredient(idx, 'type', e.target.value)}
                        className="bg-black/40 text-silver text-[10px] font-black uppercase tracking-wider border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
                      >
                        <option value="mineral">Minéral</option>
                        <option value="plant">Plante</option>
                        <option value="material">Matériau</option>
                        <option value="spell">Sortilège</option>
                      </select>

                      {/* CHOIX DE L'ÉLÉMENT DANS LA DB */}
                      <select 
                        value={ing.id} 
                        onChange={(e) => updateIngredient(idx, 'id', e.target.value)}
                        className="flex-1 bg-black/40 text-white text-xs font-bold border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
                      >
                        <option value="">-- Sélectionner --</option>
                        {(dbItems[ing.type + 's'] || dbItems[ing.type] || []).map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} {ing.type === 'spell' && item.level !== undefined ? `(Niv.${item.level})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <div className="bg-black/40 border border-white/10 rounded-xl flex items-center p-1">
                        <button type="button" onClick={() => updateIngredient(idx, 'quantity', Math.max(1, ing.quantity - 1))} className="w-7 h-7 flex items-center justify-center text-silver/50 hover:text-white transition-colors">-</button>
                        <span className="text-xs font-black text-white w-8 text-center">{ing.quantity}</span>
                        <button type="button" onClick={() => updateIngredient(idx, 'quantity', ing.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-silver/50 hover:text-white transition-colors">+</button>
                      </div>
                      <button type="button" onClick={() => removeIngredient(idx)} className="p-2.5 text-silver/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PARAMÈTRES GLOBAUX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-6 shadow-inner">
               <label className="text-[10px] font-black uppercase text-silver/40 mb-3 flex items-center gap-2"><Hammer size={12}/> Outils Requis</label>
               <input type="text" value={craftingData.tools} onChange={(e) => updateCrafting({ tools: e.target.value })} placeholder="Ex: Matériel d'alchimiste..." className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-xl p-3 outline-none focus:border-amber-500/50 transition-all" />
            </div>
            <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-6 shadow-inner">
               <label className="text-[10px] font-black uppercase text-silver/40 mb-3 flex items-center gap-2"><Target size={12}/> Difficulté de Base (DD)</label>
               <input type="number" value={craftingData.base_dc} onChange={(e) => updateCrafting({ base_dc: parseInt(e.target.value) || 10 })} className="w-full bg-[#151725] text-xl font-black text-center text-white border border-white/10 rounded-xl p-2 outline-none focus:border-amber-500/50 transition-all [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : ÉTAPES & RÉSULTATS */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0f111a] border border-white/5 rounded-[2rem] p-6 shadow-inner">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                <Scroll size={16} /> Étapes de Fab.
              </h4>
              <button type="button" onClick={addStep} className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 p-2 rounded-xl transition-all border border-teal-500/20 flex items-center gap-2 text-[10px] font-black uppercase">
                <Plus size={14} /> Ajouter
              </button>
            </div>

            {craftingData.steps.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl text-silver/30 text-xs italic">
                Aucune étape définie.
              </div>
            ) : (
              <div className="space-y-4">
                {craftingData.steps.map((step, idx) => (
                  <div key={idx} className="relative bg-[#1a1d2d] border border-white/5 rounded-2xl p-4 pl-10 group">
                    <div className="absolute left-3 top-4 w-5 h-5 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-[10px] font-black border border-teal-500/30">
                      {idx + 1}
                    </div>
                    <button type="button" onClick={() => removeStep(idx)} className="absolute right-3 top-3 p-1.5 text-silver/20 hover:text-red-400 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={12} />
                    </button>

                    <div className="space-y-3 mt-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black uppercase text-silver/40 mb-1.5 block ml-1">Durée</label>
                          <div className="relative">
                            <Clock size={14} className="absolute left-3 top-3 text-silver/30" />
                            <input type="text" value={step.duration} onChange={(e) => updateStep(idx, 'duration', e.target.value)} placeholder="Ex: 2 heures" className="w-full bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-3 pl-10 outline-none focus:border-teal-500/50" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase text-silver/40 mb-1.5 block ml-1">Modificateur DD</label>
                          <div className="relative">
                            <Target size={14} className="absolute left-3 top-3 text-silver/30" />
                            <input type="text" value={step.dc_modifier} onChange={(e) => updateStep(idx, 'dc_modifier', e.target.value)} placeholder="Ex: +2 (Difficile)" className="w-full bg-[#151725] text-xs text-white border border-white/10 rounded-xl p-3 pl-10 outline-none focus:border-teal-500/50" />
                          </div>
                        </div>
                      </div>

                      <textarea 
                        value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)}
                        placeholder="Décrivez l'action requise..." rows="2" className="w-full bg-[#151725] text-xs text-silver/70 border border-white/10 rounded-xl p-3 outline-none focus:border-teal-500/50 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-green-900/10 border border-green-500/20 rounded-[2rem] p-5 relative overflow-hidden">
              <CheckCircle size={80} className="absolute -right-4 -top-4 text-green-500/5 rotate-12" />
              <label className="text-[10px] font-black uppercase text-green-400 mb-3 flex items-center gap-2 relative z-10"><Sparkles size={12}/> Succès Critique</label>
              <textarea value={craftingData.critical_success} onChange={(e) => updateCrafting({ critical_success: e.target.value })} placeholder="Bonus si le jet dépasse largement le DD..." rows="2" className="w-full bg-black/40 text-xs text-white border border-green-500/10 rounded-xl p-3 outline-none focus:border-green-500/50 relative z-10 resize-none" />
            </div>
            
            <div className="bg-red-900/10 border border-red-500/20 rounded-[2rem] p-5 relative overflow-hidden">
              <XCircle size={80} className="absolute -right-4 -top-4 text-red-500/5 rotate-12" />
              <label className="text-[10px] font-black uppercase text-red-400 mb-3 flex items-center gap-2 relative z-10"><XCircle size={12}/> Échec Critique</label>
              <textarea value={craftingData.critical_failure} onChange={(e) => updateCrafting({ critical_failure: e.target.value })} placeholder="Conséquence dramatique (Explosion, perte de composants)..." rows="2" className="w-full bg-black/40 text-xs text-white border border-red-500/10 rounded-xl p-3 outline-none focus:border-red-500/50 relative z-10 resize-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}