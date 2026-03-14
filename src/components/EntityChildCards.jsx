import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, ExternalLink, Map, Plus, Trash2, Edit } from 'lucide-react';

export default function EntityChildCards({ parentId, childTable, parentKey, childRoute, readOnly = true }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction de chargement séparée pour pouvoir la rappeler après un ajout/suppression
  const fetchChildren = async () => {
    if (!parentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(childTable)
      .select('id, name, subtitle, image_url')
      .eq(parentKey, parentId)
      .order('name', { ascending: true });
    
    if (!error && data) setChildren(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChildren();
  }, [parentId, childTable, parentKey]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-500" size={32} /></div>;
  
  if (!parentId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#151725]/50 border border-white/10 rounded-2xl">
        <span className="text-silver/50 text-sm font-bold uppercase tracking-widest text-center">
          Veuillez d'abord sauvegarder cette entité pour y lier des éléments.
        </span>
      </div>
    );
  }

  // --- CORRECTIF VERCEL : Navigation via Événement Custom au lieu de location.href ---
  // Cela évite de recharger la page et de causer des erreurs 404 sur les hébergements statiques.
  const handleNav = (id) => {
    const route = `/${childRoute || childTable}?view=${id}`;
    window.dispatchEvent(new CustomEvent('navigate', { detail: route }));
  };

  const handleEditNav = (e, id) => {
    e.stopPropagation(); // Essentiel : Empêche le clic de se propager à la carte globale
    const route = `/${childRoute || childTable}?edit=${id}`;
    window.dispatchEvent(new CustomEvent('navigate', { detail: route }));
  };

  // AJOUT RAPIDE
  const handleAdd = async () => {
    const name = window.prompt(`Nom du nouvel élément ?`);
    if (!name || name.trim() === '') return;
    setLoading(true);
    await supabase.from(childTable).insert({ [parentKey]: parentId, name: name.trim() });
    await fetchChildren();
  };

  // SUPPRESSION RAPIDE
  const handleDelete = async (e, id, name) => {
    e.stopPropagation(); // Empêche de déclencher la navigation en même temps
    if (!window.confirm(`Voulez-vous vraiment supprimer "${name}" de manière permanente ?`)) return;
    setLoading(true);
    await supabase.from(childTable).delete().eq('id', id);
    await fetchChildren();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* BOUTON D'AJOUT (Uniquement visible en mode Édition) */}
      {!readOnly && (
        <div 
          onClick={handleAdd}
          className="relative flex flex-col items-center justify-center h-56 rounded-[2rem] border-2 border-dashed border-white/20 hover:border-teal-500 hover:bg-teal-500/10 cursor-pointer transition-all group shadow-inner"
        >
          <Plus size={40} className="text-white/20 group-hover:text-teal-400 mb-3 transition-colors" />
          <span className="text-white/40 group-hover:text-teal-400 font-bold uppercase tracking-widest text-xs transition-colors">Ajouter rapide</span>
        </div>
      )}

      {/* LISTE DES CARTES */}
      {children.map(child => (
        <div 
          key={child.id} 
          onClick={() => handleNav(child.id)}
          className="relative block h-56 rounded-[2rem] overflow-hidden group border border-white/10 hover:border-teal-500/50 cursor-pointer shadow-xl transition-all"
        >
          {child.image_url ? (
            <img src={child.image_url} alt={child.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-[#151725] flex items-center justify-center">
              <span className="text-silver/20 text-[10px] uppercase tracking-widest">Sans image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
          
          {/* ZONE D'ACTIONS EN HAUT À DROITE */}
          <div className="absolute top-4 right-4 flex gap-2">
            {!readOnly && (
              <>
                <button 
                  onClick={(e) => handleEditNav(e, child.id)}
                  className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-teal-400 hover:bg-teal-500/20 transition-all border border-white/10 shadow-lg"
                  title="Modifier directement"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, child.id, child.name)}
                  className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all shadow-lg"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleNav(child.id); }}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/50 group-hover:text-teal-400 group-hover:bg-teal-500/20 transition-all border border-white/10"
              title="Voir les détails"
            >
              <ExternalLink size={16} />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-xl font-black text-white uppercase tracking-wider truncate">{child.name}</h4>
            {child.subtitle && <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mt-1 truncate">{child.subtitle}</p>}
          </div>
        </div>
      ))}
      
      {children.length === 0 && readOnly && (
        <div className="col-span-full flex flex-col items-center justify-center p-12 bg-[#151725]/50 border border-white/10 rounded-3xl">
          <Map size={32} className="text-silver/20 mb-3" />
          <span className="text-silver/40 text-[13px] uppercase tracking-widest font-bold">Aucune entité trouvée</span>
        </div>
      )}
    </div>
  );
}