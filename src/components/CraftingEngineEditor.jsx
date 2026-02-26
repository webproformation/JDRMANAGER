// src/components/CraftingEngineEditor.jsx
import React, { useState, useEffect } from 'react';
import { 
  Hammer, Beaker, Leaf, Gem, Sparkles, Plus, Minus, Trash2, 
  Clock, Target, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CraftingEngineEditor({ value = {}, onChange }) {
  // On stocke tout dans une clé "crafting" à l'intérieur de la colonne "data"
  const craftingData = value.crafting || {
    ingredients: [],
    steps: [],
    tools: '',
    base_dc: 10,
    critical_success: '',
    critical_failure: ''
  };

  // --- ÉTATS POUR LES LISTES DÉROULANTES DYNAMIQUES ---
  const [dbItems, setDbItems] = useState({ minerals: [], plants: [], materials: [] });
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    async function fetchDbItems() {
      try {
        const [mineralsRes, plantsRes, materialsRes] = await Promise.all([
          supabase.from('minerals').select('id, name').order('name'),
          supabase.from('plants').select('id, name').order('name'),
          supabase.from('crafting_materials').select('id, name').order('name')
        ]);
        
        setDbItems({
          minerals: mineralsRes.data || [],
          plants: plantsRes.data || [],
          materials: materialsRes.data || []
        });
      } catch (err) {
        console.error("Erreur de chargement des composants:", err);
      } finally {
        setLoadingDb(false);
      }
    }
    fetchDbItems();
  }, []);

  // --- FONCTIONS DE MISE À JOUR ---
  const updateCrafting = (newData) => {
    onChange({ ...value, crafting: { ...craftingData, ...newData } });
  };

  const addIngredient = () => {
    const newIngredients = [...craftingData.ingredients, { type: 'material', name: '', quantity: '1' }];
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

  const removeStep = (index) => {
    const newSteps = craftingData.steps.filter((_, i) => i !== index);
    updateCrafting({ steps: newSteps });
  };

  // --- RENDU UI ---
  return (
    <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-amber-500/20 shadow-2xl space-y-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
          <Hammer size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-widest uppercase">Moteur d'Artisanat</h3>
          <p className="text-xs text-silver/50">Concevez le processus de fabrication étape par étape.</p>
        </div>
      </div>

      {/* SECTION 1 : INGRÉDIENTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Beaker size={16} /> Composants Requis
          </h4>
          <button type="button" onClick={addIngredient} className="text-xs flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={14} /> Ajouter un composant
          </button>
        </div>
        
        <div className="space-y-3">
          {craftingData.ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5">
              <select 
                value={ing.type} onChange={(e) => updateIngredient(idx, 'type', e.target.value)}
                className="bg-[#151725] text-xs font-bold text-silver border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50"
              >
                <option value="material">Matériau</option>
                <option value="mineral">Minéral</option>
                <option value="plant">Plante</option>
                <option value="spell">Sort / Rituel (Texte)</option>
                <option value="other">Autre (Texte)</option>
              </select>

              {(ing.type === 'spell' || ing.type === 'other') ? (
                <input 
                  type="text" value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  placeholder="Nom du sort ou composant..." className="flex-1 bg-[#151725] text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50"
                />
              ) : (
                <select 
                  value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  className="flex-1 bg-[#151725] text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50"
                >
                  <option value="">-- Sélectionner dans la base --</option>
                  {ing.type === 'mineral' && dbItems.minerals.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                  {ing.type === 'plant' && dbItems.plants.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                  {ing.type === 'material' && dbItems.materials.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                </select>
              )}

              <input 
                type="text" value={ing.quantity} onChange={(e) => updateIngredient(idx, 'quantity', e.target.value)}
                placeholder="Qté" className="w-20 bg-[#151725] text-center text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50"
              />
              <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {craftingData.ingredients.length === 0 && <p className="text-xs text-silver/40 italic">Aucun composant requis.</p>}
        </div>
      </section>

      {/* SECTION 2 : CONDITIONS ET RÉSULTATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-silver block mb-2 flex items-center gap-2"><Hammer size={12}/> Outils requis</label>
          <input type="text" value={craftingData.tools || ''} onChange={(e) => updateCrafting({ tools: e.target.value })} placeholder="Ex: Kit d'alchimiste, Enclume..." className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500/50 outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-silver block mb-2 flex items-center gap-2"><Target size={12}/> Difficulté de Base (DD)</label>
          <input type="number" value={craftingData.base_dc || 10} onChange={(e) => updateCrafting({ base_dc: parseInt(e.target.value) || 10 })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-amber-500/50 outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 flex items-center gap-2"><CheckCircle size={12}/> Réussite Critique</label>
          <textarea value={craftingData.critical_success || ''} onChange={(e) => updateCrafting({ critical_success: e.target.value })} placeholder="Ex: Produit x2, ou objet de qualité chef-d'œuvre..." rows="2" className="w-full bg-black/40 border border-green-500/30 rounded-lg p-3 text-sm text-white focus:border-green-500/80 outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-red-400 block mb-2 flex items-center gap-2"><XCircle size={12}/> Échec Critique</label>
          <textarea value={craftingData.critical_failure || ''} onChange={(e) => updateCrafting({ critical_failure: e.target.value })} placeholder="Ex: Explosion, composants détruits..." rows="2" className="w-full bg-black/40 border border-red-500/30 rounded-lg p-3 text-sm text-white focus:border-red-500/80 outline-none" />
        </div>
      </section>

      {/* SECTION 3 : ÉTAPES DE FABRICATION */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} /> Étapes du processus
          </h4>
          <button type="button" onClick={addStep} className="text-xs flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={14} /> Ajouter une étape
          </button>
        </div>

        <div className="space-y-4">
          {craftingData.steps.map((step, idx) => (
            <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-white/5 relative group">
              <button type="button" onClick={() => removeStep(idx)} className="absolute top-3 right-3 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all">
                <Trash2 size={16} />
              </button>
              
              <div className="flex items-center gap-4 mb-4 pr-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/30">
                  {idx + 1}
                </div>
                <input 
                  type="text" value={step.title} onChange={(e) => updateStep(idx, 'title', e.target.value)}
                  placeholder="Nom de l'étape (ex: Préparation du métal)" className="flex-1 bg-transparent text-white font-bold text-lg border-b border-white/10 focus:border-amber-500/50 outline-none pb-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-silver mb-1 block">Durée</label>
                  <input type="text" value={step.duration} onChange={(e) => updateStep(idx, 'duration', e.target.value)} placeholder="Ex: 2 heures" className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-silver mb-1 block">Modificateur DD (optionnel)</label>
                  <input type="text" value={step.dc_modifier} onChange={(e) => updateStep(idx, 'dc_modifier', e.target.value)} placeholder="Ex: +2, -5..." className="w-full bg-[#151725] text-sm text-white border border-white/10 rounded-lg p-2 outline-none focus:border-amber-500/50" />
                </div>
              </div>

              <textarea 
                value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)}
                placeholder="Description de l'action à accomplir..." rows="2" className="w-full bg-[#151725] text-sm text-silver border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500/50"
              />
            </div>
          ))}
          {craftingData.steps.length === 0 && <p className="text-xs text-silver/40 italic">Ajoutez des étapes pour définir le temps et les actions nécessaires.</p>}
        </div>
      </section>

    </div>
  );
}