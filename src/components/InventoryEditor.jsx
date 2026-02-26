import React, { useState, useEffect } from 'react';
import { Search, Trash2, Plus, Backpack, Scale } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function InventoryEditor({ value = [], onChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchItems = async () => {
      setIsSearching(true);
      const { data } = await supabase
        .from('items')
        .select('id, name, data, description')
        .ilike('name', `%${searchTerm}%`)
        .limit(8);
      
      // Exclure les armes et armures car elles vont dans l'arsenal
      const standardItems = (data || []).filter(item => 
        item.data?.type !== 'weapon' && item.data?.type !== 'armor'
      );
      setSearchResults(standardItems);
      setIsSearching(false);
    };
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const addItem = (item) => {
    const newEntry = {
      id: item.id,
      name: item.name,
      description: item.description,
      weight: item.data?.weight || 0,
      quantity: 1
    };
    const newValue = Array.isArray(value) ? [...value, newEntry] : [newEntry];
    onChange(newValue);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeItem = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const updateQuantity = (index, newQty) => {
    const newValue = [...value];
    newValue[index].quantity = Math.max(1, newQty);
    onChange(newValue);
  };

  const totalWeight = value.reduce((acc, item) => acc + (parseFloat(item.weight) * item.quantity), 0);

  return (
    <div className="space-y-4">
      {/* Barre de Recherche */}
      <div className="relative">
        <div className="flex items-center bg-[#151725] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <Search size={16} className="text-silver/50 mr-3" />
          <input 
            type="text" placeholder="Ajouter un objet, outil, potion..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-silver/30"
          />
          {isSearching && <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d2d] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
            {searchResults.map(item => (
              <button
                key={item.id} type="button" onClick={() => addItem(item)}
                className="w-full text-left px-5 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 text-silver transition-colors flex items-center justify-between border-b border-white/5 last:border-0 group"
              >
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-400">{item.name}</div>
                  <div className="text-[10px] text-silver/40 truncate w-48">{item.description || 'Aucune description'}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-silver/30">{item.data?.weight || 0} kg</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/20 p-1.5 rounded-lg text-cyan-400"><Plus size={14}/></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Liste */}
      <div className="flex justify-between items-end border-b border-white/5 pb-2">
        <h4 className="text-[10px] font-black uppercase text-silver/40 flex items-center gap-2"><Backpack size={12}/> Contenu du sac</h4>
        <div className="text-[10px] font-black text-cyan-400 uppercase flex items-center gap-1"><Scale size={12}/> Poids Total : {totalWeight.toFixed(1)} kg</div>
      </div>

      {/* Liste de l'inventaire */}
      {(!value || value.length === 0) ? (
        <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl text-silver/20 text-xs italic">
          Le sac est vide.
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {value.map((item, idx) => (
            <div key={idx} className="bg-[#1a1d2d] border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
              <div className="flex-1 min-w-0 pr-4">
                <div className="font-bold text-white text-sm truncate">{item.name}</div>
                <div className="text-[10px] text-silver/40 truncate">{item.description}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] uppercase font-black text-silver/30 mb-1">Qté</span>
                  <input 
                    type="number" min="1" value={item.quantity} 
                    onChange={(e) => updateQuantity(idx, parseInt(e.target.value))}
                    className="w-12 bg-black/40 text-center font-bold text-white rounded p-1 outline-none border border-white/5 focus:border-cyan-500/50 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex flex-col items-center min-w-[40px]">
                  <span className="text-[8px] uppercase font-black text-silver/30 mb-1">Poids</span>
                  <span className="text-xs font-bold text-cyan-200">{(parseFloat(item.weight) * item.quantity).toFixed(1)}</span>
                </div>
                <button type="button" onClick={() => removeItem(idx)} className="p-2 text-silver/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-4">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}