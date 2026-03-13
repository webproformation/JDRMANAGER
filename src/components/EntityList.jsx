import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, HelpCircle } from 'lucide-react'; 
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect'; 

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

  // Écouter les changements externes de monde (ex: si on change de monde ailleurs)
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

  // --- ACTION DE MÉMORISATION DU MONDE ---
  const handleWorldChange = (newWorldId) => {
    setSelectedWorld(newWorldId);
    localStorage.setItem('activeWorldId', newWorldId);
    // On diffuse l'information à toute l'application (Navigation, etc.)
    window.dispatchEvent(new Event('worldChanged'));
  };

  const handleTriggerDelete = (item) => {
    setDialog({
      isOpen: true,
      title: 'Suppression définitive',
      message: `Voulez-vous vraiment effacer "${item.name}" ?`,
      onConfirm: () => onDelete(item)
    });
  };

  let filteredItems = localItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchLower)) || (item.title && item.title.toLowerCase().includes(searchLower));
    
    // Si on est sur la page des Mondes, on n'applique pas le filtre de monde
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

  return (
    <div className="p-4 pt-20 md:p-8 md:pt-8 space-y-6 w-full max-w-[1920px] mx-auto bg-transparent">
      <VTTDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />
      
      {title && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 mb-2 border-b border-white/5 pb-4 animate-in fade-in duration-500">
          <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl border border-[#2DD4BF]/20 shadow-lg shadow-[#2DD4BF]/5 shrink-0">
            <Icon size={28} className="text-[#2DD4BF]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase drop-shadow-md flex flex-wrap items-center">
              <span>{title}</span>
              {currentWorld && (
                <>
                  <span className="text-white/20 mx-2 md:mx-3 font-light">|</span>
                  <span className="text-[#2DD4BF] drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                    {currentWorld.name}
                  </span>
                </>
              )}
            </h1>
            <p className="text-silver/60 text-[9px] md:text-[10px] font-black tracking-[0.2em] mt-1 md:mt-0.5 uppercase">
              Archives du Multivers
            </p>
          </div>
        </div>
      )}
      
      <div className="bg-vtt-card-bg p-4 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-96 flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2DD4BF]/40" size={18} />
            <input 
              type="text" 
              placeholder={`Rechercher dans les archives...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none text-sm font-bold shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
            {tableName !== 'worlds' && worlds.length > 0 && (
              <div className="w-full sm:w-48 flex-grow">
                <VTTSelect 
                  value={selectedWorld} 
                  options={worldOptions} 
                  onChange={handleWorldChange} // APPEL DE LA MÉMORISATION
                  placeholder="Filtrer par monde"
                />
              </div>
            )}

            <div className="w-full sm:w-36 flex-grow">
              <VTTSelect 
                value={sortOption} 
                options={sortOptions} 
                onChange={setSortOption} 
              />
            </div>

            {onCreate && (
              <button 
                onClick={onCreate}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-xl shadow-lg transition-all font-black uppercase tracking-[0.2em] text-[10px] h-[38px] flex-shrink-0"
              >
                <Plus size={18} /> Créer
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 flex flex-col items-center">
           <div className="w-10 h-10 border-2 border-[#2DD4BF]/10 border-t-[#2DD4BF] rounded-full animate-spin mb-4"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-vtt-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-[#2DD4BF]/30 shadow-2xl transition-all duration-300 flex flex-col h-full">
              <div onClick={() => onView && onView(item)} className="relative h-52 overflow-hidden cursor-pointer bg-black/10">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    <Icon size={56} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-vtt-card-bg via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 onClick={() => onView && onView(item)} className="text-xl md:text-2xl font-bold text-soft-white mb-2 cursor-pointer hover:text-[#2DD4BF] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-silver/60 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {item.description || "Aucune description enregistrée."}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                  <button onClick={() => onView && onView(item)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-[#2DD4BF]/10 text-silver hover:text-[#2DD4BF] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Eye size={14} /> Consulter
                  </button>
                  {onEdit && (
                    <button onClick={() => onEdit(item)} className="p-2.5 text-white/20 hover:text-[#2DD4BF] hover:bg-white/5 rounded-xl transition-all">
                      <Edit size={16} />
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