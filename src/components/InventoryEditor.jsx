import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Trash2, Info, Backpack, Scale, Package, 
  Beaker, Shield, Coins, User, Briefcase, Archive, EyeOff, Sword 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Définition des emplacements physiques possibles
const LOCATIONS = [
  { id: 'equipped', label: 'Équipé (Sur soi)', icon: User, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  { id: 'backpack', label: 'Sac à dos', icon: Backpack, color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
  { id: 'satchel', label: 'Saccoche', icon: Briefcase, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
  { id: 'pocket', label: 'Poches', icon: Archive, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  { id: 'hidden', label: 'Caché', icon: EyeOff, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' }
];

export default function InventoryEditor({ value = [], onChange }) {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchItems() {
      // On récupère TOUS les objets de la base de données
      const { data, error } = await supabase.from('items').select('*');
      if (!error && data) {
        setAllItems(data);
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  const handleAddItem = (item) => {
    // Récupération intelligente du type
    const itemType = item.item_type || item.data?.type || 'misc';
    
    // Par défaut, un nouvel objet va dans le sac à dos
    const newEntry = {
      id: item.id,
      name: item.name,
      description: item.description,
      weight: item.data?.weight || item.weight || 0,
      type: itemType,
      quantity: 1,
      location: 'backpack',
      subLocation: '' // Permet de préciser "Tête", "Botte gauche", etc.
    };
    onChange([...value, newEntry]);
  };

  const removeItem = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newValue = [...value];
    newValue[index].quantity = newQty;
    onChange(newValue);
  };

  const updateLocation = (index, newLocation) => {
    const newValue = [...value];
    newValue[index].location = newLocation;
    onChange(newValue);
  };

  const updateSubLocation = (index, text) => {
    const newValue = [...value];
    newValue[index].subLocation = text;
    onChange(newValue);
  };

  // Filtrage du catalogue de recherche avec tolérance au français et à l'anglais
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeTab === "all") return true;

      // On normalise le type de l'objet pour la comparaison
      const itemType = (item.item_type || item.data?.type || 'misc').toLowerCase();

      if (activeTab === "armor") {
        return itemType.includes('armor') || itemType.includes('armure') || itemType.includes('shield') || itemType.includes('bouclier') || itemType.includes('clothing') || itemType.includes('vêtement') || itemType.includes('tenue');
      }
      if (activeTab === "weapon") {
        return itemType.includes('weapon') || itemType.includes('arme');
      }
      if (activeTab === "potion") {
        return itemType.includes('potion') || itemType.includes('consumable') || itemType.includes('consommable');
      }
      if (activeTab === "gear") {
        return itemType.includes('gear') || itemType.includes('équipement') || itemType.includes('equipement') || itemType.includes('outil');
      }
      
      return itemType.includes(activeTab) || itemType === 'misc' || itemType === 'divers';
    });
  }, [allItems, searchTerm, activeTab]);

  const totalGlobalWeight = value.reduce((acc, item) => acc + (parseFloat(item.weight) * item.quantity), 0);

  if (loading) return <div className="p-12 text-center text-silver/20 animate-pulse uppercase font-black tracking-widest text-xs">Fouille du catalogue...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* SECTION 1 : GESTION DES CONTENEURS ET EMPLACEMENTS */}
      <div className="bg-[#151725] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-6">
          <h4 className="text-sm font-black uppercase text-white flex items-center gap-3 tracking-widest">
            <Backpack size={18} className="text-cyan-400"/> Gestion de l'Inventaire
          </h4>
          <div className="text-[10px] font-black text-silver/50 uppercase flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <Scale size={12} className="text-cyan-400"/> Charge Totale : <span className="text-white ml-1">{totalGlobalWeight.toFixed(1)} kg</span>
          </div>
        </div>

        {(!value || value.length === 0) ? (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-silver/30 text-xs font-bold uppercase tracking-widest bg-black/20">
            Le personnage ne porte rien.
          </div>
        ) : (
          <div className="space-y-6">
            {LOCATIONS.map(loc => {
              // On groupe les objets par emplacement
              const groupItems = value.map((item, originalIndex) => ({ ...item, originalIndex })).filter(item => (item.location || 'backpack') === loc.id);
              if (groupItems.length === 0) return null;

              const groupWeight = groupItems.reduce((acc, item) => acc + (parseFloat(item.weight) * item.quantity), 0);

              return (
                <div key={loc.id} className={`bg-[#0f111a] border ${loc.border} rounded-[2rem] p-5 shadow-inner transition-all hover:border-opacity-50`}>
                  
                  {/* HEADER DU CONTENEUR */}
                  <div className={`flex justify-between items-center border-b ${loc.border} pb-3 mb-4`}>
                    <h4 className={`text-xs font-black uppercase flex items-center gap-2 tracking-widest ${loc.color}`}>
                      <loc.icon size={16}/> {loc.label}
                    </h4>
                    <div className="text-[9px] font-black text-silver/50 uppercase bg-black/40 px-2 py-1 rounded border border-white/5">
                      Poids : <span className="text-white">{groupWeight.toFixed(1)} kg</span>
                    </div>
                  </div>

                  {/* LISTE DES OBJETS DANS CE CONTENEUR */}
                  <div className="space-y-3">
                    {groupItems.map(item => (
                      <div key={item.originalIndex} className="bg-[#1a1d2d] border border-white/5 rounded-2xl p-3 flex items-center justify-between group hover:border-white/20 transition-all shadow-lg">
                        
                        {/* INFOS & EMPLACEMENT SPÉCIFIQUE */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="font-bold text-white text-sm truncate">{item.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <select
                              value={item.location || 'backpack'}
                              onChange={(e) => updateLocation(item.originalIndex, e.target.value)}
                              className={`bg-black/60 border ${loc.border} rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider outline-none cursor-pointer ${loc.color}`}
                            >
                              {LOCATIONS.map(l => <option key={l.id} value={l.id} className="text-silver">{l.label}</option>)}
                            </select>
                            
                            <input 
                              type="text" 
                              placeholder="Détail (ex: Tête, Main, Botte...)"
                              value={item.subLocation || ''}
                              onChange={(e) => updateSubLocation(item.originalIndex, e.target.value)}
                              className="bg-transparent border-b border-white/10 focus:border-cyan-500 text-[10px] text-white font-bold outline-none w-32 placeholder-silver/30 pb-0.5 transition-colors"
                            />
                          </div>
                        </div>
                        
                        {/* BOUTONS D'ACTION (Quantité VTT + Poids + Supprimer) */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                            <button type="button" onClick={() => updateQuantity(item.originalIndex, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all font-black text-lg">-</button>
                            <span className="text-xs font-black text-white w-6 text-center">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.originalIndex, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 transition-all font-black text-lg">+</button>
                          </div>
                          
                          <div className="flex flex-col items-center min-w-[45px] bg-black/40 py-1.5 px-2 rounded-xl border border-white/5">
                            <span className="text-[8px] uppercase font-black text-silver/40 mb-0.5">Poids</span>
                            <span className="text-xs font-black text-cyan-400">{(parseFloat(item.weight) * item.quantity).toFixed(1)}</span>
                          </div>
                          
                          <button type="button" onClick={() => removeItem(item.originalIndex)} className="p-2.5 text-silver/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all shadow-inner" title="Jeter l'objet">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2 : RECHERCHE ET CATALOGUE DU MONDE */}
      <div className="bg-[#0f111a] p-6 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-silver/30 group-focus-within:text-cyan-400 transition-colors" size={18}/>
          <input 
            type="text" placeholder="Rechercher un objet, arme, armure, vêtement..."
            className="w-full bg-[#151725] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all placeholder:font-normal placeholder:text-silver/20"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { id: 'all', label: 'Tout', icon: Package },
            { id: 'gear', label: 'Équipement', icon: Backpack },
            { id: 'armor', label: 'Tenues / Armures', icon: Shield },
            { id: 'weapon', label: 'Armes', icon: Sword },
            { id: 'potion', label: 'Potions', icon: Beaker },
            { id: 'misc', label: 'Divers', icon: Coins }
          ].map(t => (
            <button
              key={t.id} 
              type="button" 
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-105' : 'bg-[#151725] text-silver/40 border border-white/5 hover:bg-white/5 hover:text-silver'}`}
            >
              <t.icon size={14}/> {t.label}
            </button>
          ))}
        </div>

        {/* L'ASCENSEUR VERTICAL A ÉTÉ RETIRÉ ICI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isExpanded = expandedItem === item.id;
            return (
              <div key={item.id} className="bg-[#151725] border border-white/5 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="p-4 flex items-center gap-4 relative">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[13px] font-black text-white truncate uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </h5>
                    <div className="text-[9px] font-black text-silver/40 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                      <span className="bg-black/40 border border-white/5 px-2 py-0.5 rounded text-cyan-200">{item.data?.weight || item.weight || 0} kg</span>
                      {(item.data?.cost || item.cost) && <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">{item.data?.cost || item.cost}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setExpandedItem(isExpanded ? null : item.id)} className={`p-2.5 rounded-xl transition-all ${isExpanded ? 'bg-white/10 text-white' : 'text-silver/20 hover:bg-white/5 hover:text-white bg-black/20'}`} title="Détails de l'objet">
                      <Info size={18}/>
                    </button>
                    <button type="button" onClick={() => handleAddItem(item)} className="p-2.5 rounded-xl transition-all text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 hover:scale-110 active:scale-95" title="Prendre l'objet">
                      <Plus size={18} strokeWidth={3}/>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-black/40 p-5 border-t border-white/5 text-xs text-silver space-y-3">
                    <p className="leading-relaxed border-l-2 border-cyan-500/50 pl-3 italic">{item.description || 'Aucune description disponible dans les archives.'}</p>
                  </div>
                )}
              </div>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-silver/20 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
              Aucun artefact trouvé dans les archives.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}