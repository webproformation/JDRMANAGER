import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, ImageOff, HelpCircle } from 'lucide-react'; // Ajout HelpCircle pour fallback
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect'; // IMPORT DU COMPOSANT PREMIUM

export default function EntityList({ 
  tableName, 
  title, 
  icon: Icon = HelpCircle, // PROTECTION PRESTIGE : Icône par défaut si undefined [cite: 2026-03-12]
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
  const [selectedWorld, setSelectedWorld] = useState('all');
  const [sortOption, setSortOption] = useState('az');
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

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

  const handleTriggerDelete = (item) => {
    setDialog({
      isOpen: true,
      title: 'Suppression définitive',
      message: `Voulez-vous vraiment effacer "${item.name}" ? Cette action est irréversible dans les archives du moteur.`,
      onConfirm: () => onDelete(item)
    });
  };

  let filteredItems = localItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (item.name && item.name.toLowerCase().includes(searchLower)) || (item.title && item.title.toLowerCase().includes(searchLower));
    const matchesWorld = selectedWorld === 'all' || item.world_id === selectedWorld;
    return matchesSearch && matchesWorld;
  });

  if (sortOption === 'az') filteredItems.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
  if (sortOption === 'newest') filteredItems.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  // Préparation des options pour VTTSelect
  const worldOptions = [
    { value: 'all', label: 'Tous les mondes' },
    ...worlds.map(w => ({ value: w.id, label: w.name }))
  ];

  const sortOptions = [
    { value: 'az', label: 'Ordre A-Z' },
    { value: 'newest', label: 'Plus récents' }
  ];

  return (
    <div className="p-6 space-y-6 w-full max-w-[1920px] mx-auto bg-transparent">
      <VTTDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />
      
      <div className="bg-vtt-card-bg p-4 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96 flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2DD4BF]/40" size={18} />
            <input 
              type="text" 
              placeholder={`Rechercher dans les archives...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none text-sm font-bold shadow-inner"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto items-center">
            {/* SÉLECTEUR DE MONDES PREMIUM */}
            {tableName !== 'worlds' && worlds.length > 0 && (
              <div className="w-48">
                <VTTSelect 
                  value={selectedWorld} 
                  options={worldOptions} 
                  onChange={setSelectedWorld} 
                  placeholder="Filtrer par monde"
                />
              </div>
            )}

            {/* SÉLECTEUR DE TRI PREMIUM */}
            <div className="w-36">
              <VTTSelect 
                value={sortOption} 
                options={sortOptions} 
                onChange={setSortOption} 
              />
            </div>

            {onCreate && (
              <button 
                onClick={onCreate}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-xl shadow-lg transition-all font-black uppercase tracking-[0.2em] text-[10px] h-[38px]"
              >
                <Plus size={18} /> Créer
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#2DD4BF]/40 animate-pulse flex flex-col items-center">
           <div className="w-10 h-10 border-2 border-[#2DD4BF]/10 border-t-[#2DD4BF] rounded-full animate-spin mb-4"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-vtt-card-bg rounded-2xl overflow-hidden border border-white/5 hover:border-[#2DD4BF]/30 shadow-2xl transition-all duration-300 flex flex-col h-full">
              <div onClick={() => onView && onView(item)} className="relative h-52 overflow-hidden cursor-pointer bg-black/10">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/5">
                    {/* SÉCURITÉ : Appel de Icon avec vérification implicite via le default prop */}
                    <Icon size={56} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-vtt-card-bg via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 onClick={() => onView && onView(item)} className="text-2xl font-bold text-soft-white mb-2 cursor-pointer hover:text-[#2DD4BF] transition-colors line-clamp-1" title={item.name}>
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
                  {onDelete && (
                    <button onClick={() => handleTriggerDelete(item)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all">
                      <Trash2 size={16} />
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