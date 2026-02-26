import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // CORRIGÉ : Double remontée (../../) pour trouver le dossier lib

export default function WeaponSearch({ onAddWeapon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchWeapons = async () => {
      setIsSearching(true);
      const { data } = await supabase
        .from('items')
        .select('id, name, data')
        .ilike('name', `%${searchTerm}%`)
        .limit(8); // Limite augmentée
      
      // FILTRE CORRIGÉ : On inclut les armes, armures et boucliers
      const equipment = (data || []).filter(item => 
        item.data?.type === 'weapon' || item.data?.type === 'armor' || item.data?.type === 'shield'
      );
      
      setSearchResults(equipment);
      setIsSearching(false);
    };
    const timeout = setTimeout(fetchWeapons, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleAdd = (weapon) => {
    onAddWeapon(weapon);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-[#151725] border border-white/10 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
        <Search size={16} className="text-silver/50 mr-2" />
        <input 
          type="text" 
          placeholder="Ajouter (ex: Épée longue, Cotte de mailles...)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-silver/30"
        />
        {isSearching && <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1d2d] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          {searchResults.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAdd(item)}
              className="w-full text-left px-4 py-3 hover:bg-teal-500/10 hover:text-teal-400 text-silver text-sm transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
            >
              <span className="flex flex-col">
                <span className="font-bold text-white">{item.name}</span>
                <span className="text-[9px] text-silver/50 uppercase">{item.data?.type === 'weapon' ? 'Arme' : 'Armure/Bouclier'}</span>
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-500/20 p-1 rounded-md text-teal-400"><Plus size={14}/></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}