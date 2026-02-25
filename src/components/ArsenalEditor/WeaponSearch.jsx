import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
        .limit(5);
      
      const weapons = (data || []).filter(item => item.data?.type === 'weapon');
      setSearchResults(weapons);
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
          placeholder="Ajouter une arme (ex: Épée longue, Arc...)" 
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
              className="w-full text-left px-4 py-3 hover:bg-teal-500/10 hover:text-teal-400 text-silver text-sm transition-colors flex items-center justify-between group"
            >
              <span>{item.name}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16}/></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}