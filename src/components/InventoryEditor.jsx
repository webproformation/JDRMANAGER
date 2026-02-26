// src/components/InventoryEditor.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Trash2, Info, Backpack, Scale, Package, 
  Beaker, Shield, Coins, User, Briefcase, Archive, EyeOff, Sword, PawPrint, Users, CarFront
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateEntityValue } from '../utils/rulesEngine';

const BASE_LOCATIONS = [
  { id: 'equipped', label: 'Équipé (Sur soi)', icon: User, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  { id: 'backpack', label: 'Sac à dos', icon: Backpack, color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
  { id: 'satchel', label: 'Saccoche', icon: Briefcase, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
  { id: 'pocket', label: 'Poches', icon: Archive, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  { id: 'hidden', label: 'Caché', icon: EyeOff, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' }
];

export default function InventoryEditor({ value = [], onChange, formData }) {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gear"); 
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchAllDatabases() {
      const fetchSafe = async (tableName, query) => {
        try {
          const { data, error } = await query;
          if (error) return [];
          return data || [];
        } catch { 
          return []; 
        }
      };

      const [items, monsters, characters, vehicles] = await Promise.all([
        fetchSafe('items', supabase.from('items').select('*')),
        fetchSafe('monsters', supabase.from('monsters').select('*')),
        fetchSafe('characters', supabase.from('characters').select('*').eq('character_type', 'PNJ')),
        fetchSafe('vehicles', supabase.from('vehicles').select('*'))
      ]);

      const normItems = items.map(i => ({...i, entityType: 'item'}));
      
      // LE SUPER DÉTECTEUR D'ANIMAUX (Type + Nom)
      const normMonsters = monsters.map(m => {
        const mType = (m.data?.monster_type || m.data?.type || '').toLowerCase();
        const mName = (m.name || '').toLowerCase();

        const isAnimal = 
          // 1. Recherche par Type déclaré
          mType.includes('bête') || mType.includes('bete') || mType.includes('beast') || 
          mType.includes('animal') || mType.includes('animaux') || 
          mType.includes('monture') || mType.includes('mount') || mType.includes('faune') ||
          // 2. Recherche automatique par Nom (Le filet de sécurité)
          mName.includes('cheval') || mName.includes('loup') || mName.includes('chien') || 
          mName.includes('ours') || mName.includes('poney') || mName.includes('mule') || 
          mName.includes('chameau') || mName.includes('tigre') || mName.includes('lion') ||
          mName.includes('panthère') || mName.includes('aigle') || mName.includes('faucon') ||
          mName.includes('corbeau') || mName.includes('rat') || mName.includes('chat') ||
          mName.includes('sanglier') || mName.includes('araignée') || mName.includes('serpent') ||
          mName.includes('dromadaire') || mName.includes('destrier');

        const assignedType = isAnimal ? 'animal' : 'monster';

        return {
          ...m, 
          entityType: assignedType, 
          data: { ...m.data, type: assignedType, cost: calculateEntityValue(assignedType, m.data, m.data?.cr) }
        };
      });

      const normNPCs = characters.map(c => ({
        ...c, 
        entityType: 'npc', 
        data: { ...c.data, type: 'npc', cost: calculateEntityValue('npc', c.data, c.level) }
      }));
      
      const normVehicles = vehicles.map(v => ({
        ...v, 
        entityType: 'vehicle', 
        data: { ...v.data, type: 'vehicle', cost: v.data?.cost || calculateEntityValue('vehicle', v.data, 1) }
      }));

      setAllItems([...normItems, ...normMonsters, ...normNPCs, ...normVehicles]);
      setLoading(false);
    }
    fetchAllDatabases();
  }, []);

  const dynamicLocations = useMemo(() => {
    const companions = value.filter(i => ['npc', 'monster', 'vehicle', 'mount', 'animal'].includes((i.type || '').toLowerCase()));
    
    return companions.map(comp => {
      let IconToUse = PawPrint;
      if (comp.type === 'vehicle') IconToUse = CarFront;
      if (comp.type === 'npc') IconToUse = Users;

      return {
        id: comp.id, 
        label: `${comp.name} ${comp.quantity > 1 ? `(x${comp.quantity})` : ''}`,
        icon: IconToUse,
        color: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bg: 'bg-emerald-500/10'
      };
    });
  }, [value]);

  const ALL_LOCATIONS = [...BASE_LOCATIONS, ...dynamicLocations];

  const handleAddItem = (item) => {
    const itemType = item.entityType === 'item' ? (item.item_type || item.data?.type || 'misc') : item.entityType;
    const newEntry = {
      id: item.id,
      name: item.name,
      description: item.description,
      weight: item.data?.weight || item.weight || 0,
      type: itemType,
      cost: item.data?.cost || item.cost,
      base_data: item.data || {}, 
      quantity: 1,
      location: 'backpack',
      subLocation: '' 
    };
    onChange([...value, newEntry]);
  };

  const removeItem = (index) => {
    const itemToRemove = value[index];
    const newValue = [...value];
    if (['npc', 'monster', 'vehicle', 'mount', 'animal'].includes((itemToRemove.type || '').toLowerCase())) {
      newValue.forEach(i => {
        if (i.location === itemToRemove.id) i.location = 'backpack';
      });
    }
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateField = (index, field, val) => {
    const newValue = [...value];
    if (field === 'quantity') {
      if (val < 1) return;
      newValue[index].quantity = val;
    } else {
      newValue[index][field] = val;
    }
    onChange(newValue);
  };

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      const itemType = (item.entityType === 'item' ? (item.item_type || item.data?.type || 'misc') : item.entityType).toLowerCase();

      if (activeTab === "armor") return itemType.includes('armor') || itemType.includes('armure') || itemType.includes('shield') || itemType.includes('clothing') || itemType.includes('vêtement');
      if (activeTab === "weapon") return itemType.includes('weapon') || itemType.includes('arme');
      if (activeTab === "potion") return itemType.includes('potion') || itemType.includes('consumable') || itemType.includes('consommable');
      if (activeTab === "gear") return itemType.includes('gear') || itemType.includes('équipement') || itemType.includes('equipement');
      if (activeTab === "companion") return itemType.includes('npc') || itemType.includes('pnj') || itemType.includes('monster') || itemType.includes('monstre') || itemType.includes('vehicle') || itemType.includes('vehicule') || itemType.includes('animal') || itemType.includes('mount') || itemType.includes('bête') || itemType.includes('bete');
      
      return itemType.includes(activeTab) || itemType === 'misc' || itemType === 'divers';
    });
  }, [allItems, searchTerm, activeTab]);

  // SOUS-GROUPEMENT POUR L'AFFICHAGE DU CATALOGUE
  const groupedItems = useMemo(() => {
    const groups = {
      npc: { title: 'PNJ & Mercenaires', items: [] },
      animal: { title: 'Animaux & Montures', items: [] },
      vehicle: { title: 'Véhicules', items: [] },
      monster: { title: 'Monstres', items: [] },
      weapon: { title: 'Armes', items: [] },
      armor: { title: 'Armures & Tenues', items: [] },
      potion: { title: 'Potions & Consommables', items: [] },
      gear: { title: 'Équipement Standard', items: [] },
      misc: { title: 'Objets Divers', items: [] }
    };

    filteredItems.forEach(item => {
       const type = (item.entityType === 'item' ? (item.item_type || item.data?.type || 'misc') : item.entityType).toLowerCase();

       if (type.includes('npc') || type.includes('pnj')) groups.npc.items.push(item);
       else if (type.includes('animal') || type.includes('mount') || type.includes('bête') || type.includes('bete') || type.includes('beast')) groups.animal.items.push(item);
       else if (type.includes('vehicle') || type.includes('vehicule')) groups.vehicle.items.push(item);
       else if (type.includes('monster') || type.includes('monstre')) groups.monster.items.push(item);
       else if (type.includes('weapon') || type.includes('arme')) groups.weapon.items.push(item);
       else if (type.includes('armor') || type.includes('armure') || type.includes('shield') || type.includes('bouclier') || type.includes('clothing') || type.includes('vêtement')) groups.armor.items.push(item);
       else if (type.includes('potion') || type.includes('consumable') || type.includes('consommable')) groups.potion.items.push(item);
       else if (type.includes('gear') || type.includes('équipement') || type.includes('equipement')) groups.gear.items.push(item);
       else groups.misc.items.push(item);
    });

    return groups;
  }, [filteredItems]);

  const groupOrder = ['npc', 'animal', 'vehicle', 'monster', 'weapon', 'armor', 'potion', 'gear', 'misc'];

  const totalCharacterWeight = value
    .filter(item => BASE_LOCATIONS.some(loc => loc.id === item.location))
    .reduce((acc, item) => acc + (parseFloat(item.weight || 0) * item.quantity), 0);

  const maxCapacity = formData?.data?.max_weight || 100;
  const isOverloaded = totalCharacterWeight > maxCapacity;

  if (loading) return <div className="p-12 text-center text-silver/20 animate-pulse uppercase font-black tracking-widest text-xs">Fouille du monde et des archives...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- SECTION 1 : GESTION DES CONTENEURS --- */}
      <div className="bg-[#151725] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-6">
          <h4 className="text-sm font-black uppercase text-white flex items-center gap-3 tracking-widest">
            <Backpack size={18} className="text-cyan-400"/> Gestion de l'Inventaire
          </h4>
          <div className={`text-[10px] font-black uppercase flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            isOverloaded ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/40 text-silver/50 border-white/5'
          }`}>
            <Scale size={12} className={isOverloaded ? 'text-red-400' : 'text-cyan-400'}/> 
            Charge du Héros : <span className={isOverloaded ? 'text-red-300 font-bold' : 'text-white'}>{totalCharacterWeight.toFixed(1)} / {maxCapacity} kg</span>
          </div>
        </div>

        {(!value || value.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-silver/30 text-xs font-bold uppercase tracking-widest bg-black/20">
            Le personnage ne porte rien.
          </div>
        ) : (
          <div className="space-y-6">
            {ALL_LOCATIONS.map(loc => {
              const groupItems = value.map((item, originalIndex) => ({ ...item, originalIndex })).filter(item => (item.location || 'backpack') === loc.id);
              if (groupItems.length === 0 && !dynamicLocations.find(d => d.id === loc.id)) return null;

              const groupWeight = groupItems.reduce((acc, item) => acc + (parseFloat(item.weight || 0) * item.quantity), 0);

              return (
                <div key={loc.id} className={`bg-[#0f111a] border ${loc.border} rounded-[2rem] p-5 shadow-inner transition-all hover:border-opacity-50`}>
                  <div className={`flex justify-between items-center border-b ${loc.border} pb-3 mb-4`}>
                    <h4 className={`text-xs font-black uppercase flex items-center gap-2 tracking-widest ${loc.color}`}>
                      <loc.icon size={16}/> {loc.label}
                    </h4>
                    <div className="text-[9px] font-black text-silver/50 uppercase bg-black/40 px-2 py-1 rounded border border-white/5">
                      Poids : <span className="text-white">{groupWeight.toFixed(1)} kg</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {groupItems.map(item => {
                      const typeLower = (item.type || '').toLowerCase();
                      const isCombatActive = item.location === 'equipped' && (
                        typeLower.includes('weapon') || typeLower.includes('arme') || 
                        typeLower.includes('armor') || typeLower.includes('armure') || typeLower.includes('shield') || typeLower.includes('bouclier')
                      );

                      return (
                        <div key={item.originalIndex} className="bg-[#1a1d2d] border border-white/5 rounded-2xl p-3 flex items-center justify-between group hover:border-white/20 transition-all shadow-lg">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="font-bold text-white text-sm truncate flex items-center gap-2">
                              {item.name}
                              {isCombatActive && (
                                <span className="bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full text-[8px] tracking-widest uppercase">Actif en Combat</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <select value={item.location || 'backpack'} onChange={(e) => updateField(item.originalIndex, 'location', e.target.value)} className={`bg-black/60 border ${loc.border} rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer ${loc.color}`}>
                                {ALL_LOCATIONS.map(l => <option key={l.id} value={l.id} className="text-silver">{l.label}</option>)}
                              </select>
                              <input type="text" placeholder="Détail (ex: Main...)" value={item.subLocation || ''} onChange={(e) => updateField(item.originalIndex, 'subLocation', e.target.value)} className="bg-transparent border-b border-white/10 focus:border-cyan-500 text-[10px] text-white font-bold outline-none w-32 placeholder-silver/30 pb-0.5 transition-colors"/>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                              <button type="button" onClick={() => updateField(item.originalIndex, 'quantity', item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-black text-lg">-</button>
                              <span className="text-xs font-black text-white w-6 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateField(item.originalIndex, 'quantity', item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 transition-all font-black text-lg">+</button>
                            </div>
                            <div className="flex flex-col items-center min-w-[45px] bg-black/40 py-1.5 px-2 rounded-xl border border-white/5">
                              <span className="text-[8px] uppercase font-black text-silver/40 mb-0.5">Poids</span>
                              <span className="text-xs font-black text-cyan-400">{(parseFloat(item.weight || 0) * item.quantity).toFixed(1)}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(item.originalIndex)} className="p-2.5 text-silver/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shadow-inner" title="Jeter"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- SECTION 2 : RECHERCHE ET CATALOGUE --- */}
      <div className="bg-[#0f111a] p-6 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-silver/30 group-focus-within:text-cyan-400 transition-colors" size={18}/>
          <input 
            type="text" 
            placeholder="Rechercher équipement, armure, mercenaires, animaux, véhicules..."
            className="w-full bg-[#151725] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all placeholder:font-normal placeholder:text-silver/20"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'gear', label: 'Équipement', icon: Backpack },
            { id: 'armor', label: 'Tenues / Armures', icon: Shield },
            { id: 'weapon', label: 'Armes', icon: Sword },
            { id: 'potion', label: 'Potions', icon: Beaker },
            { id: 'companion', label: 'Troupe & Véhicules', icon: Users },
            { id: 'misc', label: 'Divers', icon: Coins }
          ].map(t => (
            <button
              key={t.id} 
              type="button" 
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                activeTab === t.id 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-105' 
                  : 'bg-[#151725] text-silver/40 border border-white/5 hover:bg-white/5 hover:text-silver'
              }`}
            >
              <t.icon size={14}/> {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {groupOrder.map(groupKey => {
            const group = groupedItems[groupKey];
            if (group.items.length === 0) return null;

            return (
              <div key={groupKey} className="space-y-4">
                <h3 className="text-lg font-black text-white border-b border-white/10 pb-2 uppercase tracking-widest pl-2">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map(item => {
                    const isExpanded = expandedItem === item.id;
                    const cost = item.data?.cost || item.cost;
                    
                    return (
                      <div key={item.id} className="bg-[#151725] border border-white/5 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="p-4 flex items-center gap-4 relative">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-[13px] font-black text-white truncate uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                              {item.name}
                            </h5>
                            <div className="text-[9px] font-black text-silver/40 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                              <span className="bg-black/40 border border-white/5 px-2 py-0.5 rounded text-cyan-200">
                                {item.data?.weight || item.weight || 0} kg
                              </span>
                              {cost && (
                                <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                  {cost}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setExpandedItem(isExpanded ? null : item.id)} className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-white/10 text-white' : 'text-silver/20 hover:bg-white/5 hover:text-white bg-black/20'}`} title="Détails">
                              <Info size={18}/>
                            </button>
                            <button type="button" onClick={() => handleAddItem(item)} className="p-2.5 rounded-xl transition-all text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 hover:scale-110 active:scale-95" title="Recruter / Prendre">
                              <Plus size={18} strokeWidth={3}/>
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-black/40 p-5 border-t border-white/5 text-xs text-silver space-y-3">
                            <p className="leading-relaxed border-l-2 border-cyan-500/50 pl-3">
                              {item.description || 'Aucune description disponible.'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-silver/20 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
              Aucun élément trouvé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}