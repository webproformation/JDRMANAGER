import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Plus, Search, ImageOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EntityList({ 
  tableName, 
  title, 
  icon: Icon,
  onView, 
  onEdit, 
  onCreate, 
  onDelete, 
  items: propItems 
}) {
  const [localItems, setLocalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setLocalItems(data || []);
    } catch (err) {
      console.error("Erreur chargement liste:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = localItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.title && item.title.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-6 space-y-6 w-full max-w-[1920px] mx-auto">
      
      {/* --- BARRE D'OUTILS (Conteneur Restauré) --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#1a1d2d] p-4 rounded-xl border border-white/5 shadow-lg">
        
        {/* Recherche (Fond éclairci) */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/50" size={20} />
          <input 
            type="text" 
            placeholder={`Rechercher...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Changement ici : bg-[#252a40] pour éclaircir le champ par rapport au fond
            className="w-full bg-[#252a40] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all outline-none placeholder-silver/30 shadow-inner"
          />
        </div>

        {/* Bouton Créer */}
        {onCreate && (
          <button 
            onClick={onCreate}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-900/20 hover:scale-105 transition-all font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            Créer
          </button>
        )}
      </div>

      {/* --- GRILLE DES CARTES --- */}
      {loading ? (
        <div className="text-center py-20 text-silver/50 animate-pulse flex flex-col items-center">
           <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mb-4"/>
           Chargement des archives...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-silver/30 italic border-2 border-dashed border-white/5 rounded-xl bg-[#1a1d2d]/50">
          Aucun élément trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-[#1a1d2d] rounded-xl overflow-hidden border border-white/5 hover:border-teal-500/30 shadow-lg hover:shadow-cyan-900/20 transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in-95"
            >
              
              {/* --- ZONE IMAGE --- */}
              <div 
                onClick={() => onView && onView(item)}
                className="relative h-48 overflow-hidden cursor-pointer bg-[#151725]"
              >
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/10 group-hover:text-teal-500/20 transition-colors">
                    {Icon ? <Icon size={48} /> : <ImageOff size={48} />}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d2d] via-transparent to-transparent opacity-60" />
                
                {item.title && (
                  <div className="absolute bottom-2 left-4 right-4">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest drop-shadow-md bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                      {item.title}
                    </span>
                  </div>
                )}
              </div>

              {/* --- CONTENU --- */}
              <div className="p-5 flex-1 flex flex-col relative">
                
                {/* TITRE (Sans Serif) */}
                <h3 
                  onClick={() => onView && onView(item)}
                  className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-teal-400 transition-colors line-clamp-1"
                  title={item.name}
                >
                  {item.name}
                </h3>
                
                <p className="text-silver/60 text-sm line-clamp-3 mb-4 flex-1">
                  {item.description || <span className="italic opacity-50">Aucune description disponible.</span>}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                  <button 
                    onClick={() => onView && onView(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-teal-500/10 text-silver hover:text-teal-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-transparent hover:border-teal-500/20"
                  >
                    <Eye size={14} />
                    Voir
                  </button>

                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-silver/50 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                    >
                      <Edit size={16} />
                    </button>
                  )}

                  {onDelete && (
                    <button 
                      onClick={() => onDelete(item)}
                      className="p-2 text-silver/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
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