import React from 'react';
import { 
  Sparkles, Hammer, Backpack, Coins, FlaskConical, 
  ScrollText, Zap, Weight, ChevronRight, Package 
} from 'lucide-react';
import CharacterSpellbook from '../../components/CharacterSpellbook';
import InventoryEditor from '../../components/InventoryEditor';
import CharacterCrafting from '../../components/CharacterCrafting';

/**
 * TabMagicInventory - Standard PRESTIGE 4.3.6
 * Gestion des flux magiques, de l'artisanat et des richesses matérielles.
 */

// --- 1. GRIMOIRE ARCANIQUE ---
export const magicTab = {
  id: 'magic',
  label: 'Grimoire & Sorts',
  icon: Sparkles,
  fields: [
    { 
      name: 'magic_editor', 
      isVirtual: true,
      label: 'Grimoire Tactique', 
      type: 'custom', 
      render: (_, item) => {
          const spells = item.data?.spells || {};
          const levels = Object.keys(spells).sort();
          
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Affichage des Emplacements (VTT Ready) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[1,2,3,4,5,6,7,8,9].map(lvl => {
                   const slot = item.data?.spell_slots?.[lvl];
                   if(!slot || slot.total === 0) return null;
                   const isCritical = (slot.total - (slot.spent||0)) === 0;
                   return (
                     <div key={lvl} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 shadow-inner transition-all ${isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-purple-900/20 border-purple-500/30'}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest text-silver/60">Niveau {lvl}</span>
                        <span className={`text-sm font-black ${isCritical ? 'text-red-400' : 'text-purple-300'}`}>
                          {slot.total - (slot.spent||0)} / {slot.total}
                        </span>
                     </div>
                   );
                })}
              </div>

              {/* Liste des Sorts par Cercle */}
              {levels.length === 0 ? (
                 <div className="p-12 text-center border border-dashed border-white/5 rounded-[2.5rem]">
                    <Zap size={32} className="mx-auto text-silver/20 mb-4" />
                    <p className="text-silver/40 text-[10px] font-black uppercase tracking-widest">Aucune résonance magique détectée.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {levels.map(lvl => (
                    <div key={lvl} className="bg-black/20 p-6 rounded-[2rem] border border-white/5 group hover:border-purple-500/30 transition-all">
                      <div className="flex items-center gap-3 mb-5">
                        <ScrollText size={16} className="text-purple-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                          {lvl === '0' ? 'Tours de magie' : `Cercle de Sorts : Niveau ${lvl}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {spells[lvl].map((sp, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/5 hover:bg-purple-500/20 text-silver hover:text-white px-4 py-2 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all cursor-default group/spell">
                            <span className="text-xs font-bold">{typeof sp === 'string' ? sp : sp.name}</span>
                            <ChevronRight size={12} className="opacity-0 group-hover/spell:opacity-100 transition-all" />
                          </div>
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

// --- 2. ARTISANAT & ALCHIMIE ---
export const craftingTab = {
  id: 'crafting',
  label: 'Artisanat',
  icon: Hammer,
  fields: [
    { 
      name: 'crafting_bench', 
      isVirtual: true,
      label: 'Atelier de Forge', 
      type: 'custom', 
      render: () => (
        <div className="flex flex-col items-center justify-center p-16 bg-black/20 rounded-[3rem] border border-dashed border-white/5">
          <div className="p-5 bg-[#2DD4BF]/10 rounded-full mb-6 border border-[#2DD4BF]/20 animate-pulse-slow">
            <Hammer size={40} className="text-[#2DD4BF]" />
          </div>
          <p className="text-silver/40 text-[10px] font-black uppercase tracking-[0.3em] text-center max-w-xs leading-relaxed">
            L'établi de fabrication nécessite une interaction directe.<br/>Passez en mode <span className="text-[#2DD4BF]">Édition</span> pour forger.
          </p>
        </div>
      ),
      component: ({ formData, onFullChange }) => (
        <CharacterCrafting character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
      )
    }
  ]
};

// --- 3. INVENTAIRE & BOURSE ---
export const inventoryTab = {
  id: 'inventory',
  label: 'Inventaire',
  icon: Backpack,
  fields: [
    {
      name: 'money_custom',
      isVirtual: true,
      label: 'Richesses',
      type: 'custom',
      render: (_, item) => (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
             const colors = { pc: 'text-orange-500 bg-orange-500/5 border-orange-500/20', pa: 'text-zinc-300 bg-zinc-300/5 border-zinc-300/20', pe: 'text-cyan-400 bg-cyan-400/5 border-cyan-400/20', po: 'text-yellow-500 bg-yellow-500/5 border-yellow-500/20', pp: 'text-indigo-200 bg-indigo-200/5 border-indigo-200/20' };
             const labels = { pc: 'Cuivre', pa: 'Argent', pe: 'Électrum', po: 'Or', pp: 'Platine' };
             return (
               <div key={coin} className={`px-4 py-4 rounded-2xl border ${colors[coin]} flex flex-col items-center gap-1 shadow-inner hover:scale-105 transition-transform group`}>
                 <span className="text-[8px] uppercase font-black tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{labels[coin]}</span>
                 <span className="text-xl font-black">{item.data?.[`money_${coin}`] || 0}</span>
               </div>
             );
          })}
        </div>
      ),
      component: ({ formData, onFullChange }) => (
        <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Coins size={20} className="text-[#2DD4BF]" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Gestion de la Bourse</h4>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {['pc', 'pa', 'pe', 'po', 'pp'].map(coin => {
              const labels = { pc: 'Cuivre', pa: 'Argent', pe: 'Électrum', po: 'Or', pp: 'Platine' };
              const coinColors = { pc: 'text-orange-400', pa: 'text-zinc-400', pe: 'text-cyan-400', po: 'text-yellow-400', pp: 'text-indigo-300' };
              return (
                <div key={coin} className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase text-silver/40 text-center">{labels[coin]}</span>
                  <input 
                    type="number" 
                    value={formData.data?.[`money_${coin}`] || 0} 
                    onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                    className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 text-center text-lg font-black outline-none focus:border-[#2DD4BF]/50 transition-colors ${coinColors[coin]}`} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      )
    },
    { 
      name: 'inventory_data', 
      isVirtual: true,
      label: 'Sac à dos', 
      type: 'custom', 
      render: (_, item) => {
        const items = item.data?.inventory || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-bottom-4 duration-700">
            {items.length > 0 ? items.map((inv, i) => (
              <div key={i} className="flex flex-col bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-[#2DD4BF]/30 transition-all group shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-[#2DD4BF]/10 group-hover:border-[#2DD4BF]/20 transition-colors">
                      <Package size={16} className="text-silver group-hover:text-[#2DD4BF]" />
                    </div>
                    <span className="text-white text-sm font-black uppercase tracking-tight leading-tight">{inv.name}</span>
                  </div>
                  <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] font-black text-[10px] px-2 py-1 rounded-md border border-[#2DD4BF]/20">x{inv.quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
                   <div className="flex items-center gap-1.5 text-silver/40">
                      <Weight size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{inv.weight || '0.0'} kg</span>
                   </div>
                   <span className="text-[9px] font-black text-silver/20 uppercase tracking-tighter italic">Equipement standard</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-16 flex flex-col items-center border border-dashed border-white/5 rounded-[3rem] bg-black/10">
                <Backpack size={48} className="text-white/5 mb-4" />
                <p className="text-silver/20 text-[10px] font-black uppercase tracking-[0.4em]">Le sac à dos est vide.</p>
              </div>
            )}
          </div>
        );
      },
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