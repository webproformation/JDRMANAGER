// src/components/CharacterCrafting.jsx
import React, { useState, useEffect } from 'react';
import { Hammer, Beaker, Sparkles, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CharacterCrafting({ character, onChange }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const inventory = character.data?.inventory || [];

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const [itemsRes, potionsRes, magicRes] = await Promise.all([
          supabase.from('items').select('*').or(`world_id.eq.${character.world_id},world_id.is.null`),
          supabase.from('potions').select('*').or(`world_id.eq.${character.world_id},world_id.is.null`),
          supabase.from('magic_items').select('*').or(`world_id.eq.${character.world_id},world_id.is.null`)
        ]);

        const allThings = [...(itemsRes.data||[]), ...(potionsRes.data||[]), ...(magicRes.data||[])];
        
        const craftables = allThings.filter(obj => 
          obj.data?.crafting?.ingredients && obj.data.crafting.ingredients.length > 0
        );
        
        setRecipes(craftables);
      } catch (err) {
        console.error("Erreur de chargement des recettes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [character.world_id]);

  const canCraft = (recipe) => {
    const ingredients = recipe.data.crafting.ingredients;
    for (let ing of ingredients) {
      const inInv = inventory.find(i => i.id === ing.id);
      if (!inInv || inInv.quantity < ing.quantity) return false;
    }
    return true;
  };

  const handleCraft = (recipe) => {
    let newInv = [...inventory];
    
    recipe.data.crafting.ingredients.forEach(ing => {
      const idx = newInv.findIndex(i => i.id === ing.id);
      if (idx !== -1) {
        newInv[idx].quantity -= ing.quantity;
        if (newInv[idx].quantity <= 0) newInv.splice(idx, 1);
      }
    });

    const existingItemIdx = newInv.findIndex(i => i.id === recipe.id);
    if (existingItemIdx !== -1) {
      newInv[existingItemIdx].quantity += 1;
    } else {
      newInv.push({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        weight: recipe.data?.weight || recipe.weight || 0,
        type: recipe.item_type || recipe.data?.type || 'misc',
        base_data: recipe.data || {},
        quantity: 1,
        location: 'backpack',
        subLocation: ''
      });
    }

    onChange({ ...character.data, inventory: newInv });
    alert(`⚡ Forge réussie ! ${recipe.name} a été ajouté à votre sac à dos.`);
  };

  if (loading) return <div className="p-8 text-center text-silver/20 animate-pulse text-xs uppercase tracking-widest font-black">Allumage de la forge...</div>;

  if (recipes.length === 0) return (
    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
      <Hammer size={48} className="mx-auto text-silver/10 mb-4" />
      <p className="text-[10px] text-silver/30 font-black uppercase tracking-widest">Aucune recette connue dans ce monde.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => {
          const craftable = canCraft(recipe);
          return (
            <div key={recipe.id} className={`bg-[#0f111a] border rounded-[2rem] p-6 shadow-xl transition-all ${craftable ? 'border-teal-500/30 shadow-teal-500/10' : 'border-white/5 opacity-80'}`}>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${craftable ? 'bg-teal-500/10 text-teal-400' : 'bg-white/5 text-silver/40'}`}>
                    {recipe.type?.includes('potion') ? <Beaker size={24}/> : <Hammer size={24}/>}
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm">{recipe.name}</h4>
                    <span className="text-[9px] font-black text-silver/40 uppercase tracking-wider">DD: {recipe.data.crafting.base_dc || 10}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleCraft(recipe)}
                  disabled={!craftable}
                  className={`px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all flex items-center gap-2 ${
                    craftable 
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:scale-105 active:scale-95' 
                    : 'bg-black/50 text-silver/30 cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={14} /> Fabriquer
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black uppercase text-silver/50 tracking-widest">Ingrédients Requis</h5>
                {recipe.data.crafting.ingredients.map((ing, idx) => {
                  const inInv = inventory.find(i => i.id === ing.id);
                  const hasEnough = inInv && inInv.quantity >= ing.quantity;
                  return (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border ${hasEnough ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/5 border-red-500/10 text-red-300/70'}`}>
                      <div className="flex items-center gap-3 text-xs font-bold">
                        {hasEnough ? <Check size={14}/> : <X size={14}/>} {ing.name}
                      </div>
                      <div className="text-[10px] font-black uppercase">
                        {inInv?.quantity || 0} / {ing.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}