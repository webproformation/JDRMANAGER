import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, HelpCircle } from 'lucide-react'; 
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect'; 

/**
 * EntityList - Standard PRESTIGE 4.3.6
 * Gestionnaire de liste universel avec Header adaptatif Mobile/Desktop.
 * Mobile : Alignement droit, Titre XXL multi-ligne, Halo Sarcelle.
 */
export default function EntityList({ 
  tableName, 
  title, 
  icon: Icon = HelpCircle, 
  onView, 
  onEdit, 
  onCreate, 
  onDelete, 
  items: propItems 
}) {
  const [localItems, setLocalItems] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- MÉMOIRE PRESTIGE : Initialisation via le stockage local ---
  const [selectedWorld, setSelectedWorld] = useState(localStorage.getItem('activeWorldId') || 'all');
  const [sortOption, setSortOption] = useState('az');
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    const handleGlobalWorldChange = () => {
      setSelectedWorld(localStorage.getItem('activeWorldId') || 'all');
    };
    window.addEventListener('worldChanged', handleGlobalWorldChange);
    return () => window.removeEventListener('worldChanged', handleGlobalWorldChange);
  }, []);

  useEffect(() => {
    if (tableName !== 'worlds') {
      supabase.from('worlds').select('id, name').then(({data}) => setWorlds(data || []));
    }
    if (propItems) {
      setLocalItems(propItems);
      setLoading(false);
    } else if (tableName) {
      fetchData();
    }
  }, [tableName, propItems]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) throw error;
      setLocalItems(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleWorldChange = (newWorldId) => {
    setSelectedWorld(newWorldId);
    localStorage.setItem('activeWorldId', newWorldId);
    window.dispatchEvent(new Event('worldChanged'));
  };

  let filteredItems = localItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchLower)) || (item.title && item.title.toLowerCase().includes(searchLower));
    if (tableName === 'worlds') return matchesSearch;
    const matchesWorld = selectedWorld === 'all' || item.world_id === selectedWorld;
    return matchesSearch && matchesWorld;
  });

  if (sortOption === 'az') filteredItems.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  if (sortOption === 'newest') filteredItems.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  const worldOptions = [
    { value: 'all', label: 'Tous les mondes' },
    ...worlds.map(w => ({ value: w.id, label: w.name }))
  ];

  const sortOptions = [
    { value: 'az', label: 'Ordre A-Z' },
    { value: 'newest', label: 'Plus récents' }
  ];

  const currentWorld = worlds.find(w => w.id === selectedWorld);
  const showWorldFilter = tableName !== 'worlds' && worlds.length > 0;

  return (
    <div className="p-4 pt-4 md:p-8 md:pt-8 space-y-6 w-full max-w-[1920px] mx-auto bg-transparent">
      <VTTDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />
      
      {/* HEADER PRESTIGE V4.3.6 : TITRE ADAPTATIF ET HALO SARCELLE */}
      {title && (
        <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-6 mb-2 border-b border-white/5 pb-6 animate-in fade-in duration-700">
          
          {/* L'icône de l'entité (En haut à droite sur mobile) */}
          <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl border border-[#2DD4BF]/20 shadow-[0_0_20px_rgba(45,212,191,0.15)] shrink-0 order-first md:order-none transition-transform hover:scale-110">
            <Icon size={28} className="text-[#2DD4BF] drop-shadow-[0_0_5px_#2DD4BF]" />
          </div>

          {/* Bloc Titre XXL : Supporte le passage à la ligne */}
          <div className="flex-1 text-right md:text-left w-full relative">
            <h1 className="text-[28px] xs:text-[32px] md:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_12px_rgba(45,212,191,0.35)] leading-none">
              <span>{title}</span>
              {currentWorld && (
                <span className="text-[#2DD4BF] drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">
                  <span className="hidden md:inline mx-4 text-white/10">|</span>
                  <span className="md:hidden"> • </span>
                  {currentWorld.name}
                </span>
              )}
            </h1>
            <p className="text-silver/50 text-[10px] md:text-[11px] font-black tracking-[0.4em] mt-2 uppercase">
              Archives du Multivers
            </p>
          </div>
        </div>
      )}
      
      {/* PANNEAU DE CONTRÔLE */}
      <div className="bg-vtt-card-bg p-3 md:p-4 rounded-2xl border border-white/5 shadow-xl space-y-3 md:space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 xl:gap-4 justify-between items-center">
          
          {/* Recherche */}
          <div className="relative w-full xl:w-96 flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2DD4BF]/40" size={18} />
            <input 
              type="text" 
              placeholder={`Rechercher...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none text-sm font-bold shadow-inner transition-all placeholder:text-white/20"
            />
          </div>

          {/* Filtres et Bouton Créer */}
          <div className={`grid gap-2 w-full xl:w-auto items-center md:flex md:flex-row ${showWorldFilter ? 'grid-cols-3' : 'grid-cols-2'}`}>
            
            {showWorldFilter && (
              <div className="w-full md:w-48">
                <VTTSelect 
                  value={selectedWorld} 
                  options={worldOptions} 
                  onChange={handleWorldChange}
                  placeholder="Monde"
                />
              </div>
            )}

            <div className="w-full md:w-40">
              <VTTSelect 
                value={sortOption} 
                options={sortOptions} 
                onChange={setSortOption} 
              />
            </div>

            {onCreate && (
              <button 
                onClick={onCreate}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-xl shadow-lg transition-all font-black uppercase tracking-[0.2em] text-[10px] h-[42px] whitespace-nowrap active:scale-95"
              >
                <Plus size={18} /> Créer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GRILLE D'AFFICHAGE */}
      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
           <div className="w-10 h-10 border-2 border-[#2DD4BF]/10 border-t-[#2DD4BF] rounded-full animate-spin mb-4"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-vtt-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-[#2DD4BF]/30 shadow-2xl transition-all duration-300 flex flex-col h-full">
              <div onClick={() => onView && onView(item)} className="relative h-44 md:h-52 overflow-hidden cursor-pointer bg-black/10">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <Icon size={56} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-vtt-card-bg via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <h3 onClick={() => onView && onView(item)} className="text-lg md:text-2xl font-bold text-soft-white mb-1 md:mb-2 cursor-pointer hover:text-[#2DD4BF] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-silver/60 text-[11px] md:text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-1 leading-relaxed">
                  {item.description || "Aucune description enregistrée."}
                </p>

                <div className="flex items-center gap-2 pt-3 md:pt-4 border-t border-white/5 mt-auto">
                  <button onClick={() => onView && onView(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 md:py-2.5 bg-white/5 hover:bg-[#2DD4BF]/10 text-silver hover:text-[#2DD4BF] rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all">
                    <Eye size={14} /> Consulter
                  </button>
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="p-2 md:p-2.5 text-white/20 hover:text-[#2DD4BF] hover:bg-white/5 rounded-xl transition-all">
                      <Edit size={14} md:size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}