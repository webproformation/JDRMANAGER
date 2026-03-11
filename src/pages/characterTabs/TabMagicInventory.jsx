import React from 'react';
import { Sparkles, Hammer, Backpack } from 'lucide-react';
import CharacterSpellbook from '../../components/CharacterSpellbook';
import InventoryEditor from '../../components/InventoryEditor';
import CharacterCrafting from '../../components/CharacterCrafting';

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
      // --- RENDER CONSULTATION (Fusion des emplacements et des sorts) ---
      render: (_, item) => {
         const spells = item.data?.spells || {};
         const levels = Object.keys(spells).sort();
         
         return (
           <div className="space-y-6">
             
             {/* 1. Affichage des Emplacements de Sorts restants */}
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

             {/* 2. Affichage de la Liste des Sorts */}
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
      // --- COMPOSANT D'ÉDITION (Le CharacterSpellbook natif) ---
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