import React, { useState, useEffect } from 'react';
import { Globe, X, Plus, Search, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * COMPOSANT MULTIVERSAL RELATION SELECTOR (Standard Prestige V4.2)
 * Permet de lier une entité à plusieurs mondes via la table 'world_links'.
 */
export default function MultiversalRelationSelector({ 
  formData, 
  setFormData, 
  entityType, 
  readOnly = false 
}) {
  const [allWorlds, setAllWorlds] = useState([]);
  const [selectedWorldIds, setSelectedWorldIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const entityId = formData?.id;

  // 1. Chargement initial des mondes et des liens existants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer tous les mondes disponibles
        const { data: worlds } = await supabase.from('worlds').select('id, name').order('name');
        setAllWorlds(worlds || []);

        // Si l'entité existe déjà, récupérer ses liens actuels
        if (entityId) {
          const { data: links } = await supabase
            .from('world_links')
            .select('world_id')
            .eq('entity_id', entityId)
            .eq('entity_type', entityType);
          
          const ids = links?.map(l => l.world_id) || [];
          setSelectedWorldIds(ids);
          
          // Mise à jour du formData parent pour la synchronisation du save
          setFormData(prev => ({ ...prev, _world_links: ids }));
        } else if (formData?._world_links) {
            // Cas d'une création avec des liens déjà en mémoire locale
            setSelectedWorldIds(formData._world_links);
        }
      } catch (error) {
        console.error("Erreur MultiversalSelector:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [entityId, entityType]);

  // 2. Gestion de l'ajout/suppression locale
  const toggleWorld = (worldId) => {
    if (readOnly) return;
    
    setSelectedWorldIds(prev => {
      const newIds = prev.includes(worldId) 
        ? prev.filter(id => id !== worldId) 
        : [...prev, worldId];
      
      // On injecte dans le formData avec un préfixe '_' pour indiquer un champ virtuel à traiter au save
      setFormData(current => ({ ...current, _world_links: newIds }));
      return newIds;
    });
  };

  if (loading) return <div className="animate-pulse h-10 bg-white/5 rounded-xl" />;

  const activeWorlds = allWorlds.filter(w => selectedWorldIds.includes(w.id));
  const availableWorlds = allWorlds.filter(w => !selectedWorldIds.includes(w.id));

  return (
    <div className="space-y-3">
      {/* AFFICHAGE DES MONDES LIÉS (CHIPS) */}
      <div className="flex flex-wrap gap-2">
        {activeWorlds.length > 0 ? (
          activeWorlds.map(world => (
            <div 
              key={world.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 rounded-full animate-in zoom-in duration-300"
            >
              <Globe size={12} className="text-[#2DD4BF]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tight">{world.name}</span>
              {!readOnly && (
                <button 
                  onClick={() => toggleWorld(world.id)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-silver/40 text-[10px] italic py-2">
            Non rattaché à un monde spécifique (Entité Universelle)
          </div>
        )}

        {/* BOUTON D'AJOUT */}
        {!readOnly && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-[#2DD4BF]/50 transition-all text-silver hover:text-[#2DD4BF]"
            >
              <Plus size={14} />
              <span className="text-[10px] font-black uppercase">Lier à un monde</span>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)} 
                />
                <div className="absolute top-full left-0 mt-2 w-64 max-h-60 overflow-y-auto bg-[#1B2A3F] border border-white/10 rounded-xl shadow-2xl z-20 backdrop-blur-xl scrollbar-thin">
                  <div className="p-2 space-y-1">
                    {availableWorlds.length > 0 ? (
                      availableWorlds.map(world => (
                        <button
                          key={world.id}
                          onClick={() => { toggleWorld(world.id); setShowDropdown(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2DD4BF]/10 text-silver hover:text-white text-xs transition-colors flex items-center justify-between group"
                        >
                          {world.name}
                          <Check size={14} className="opacity-0 group-hover:opacity-100 text-[#2DD4BF]" />
                        </button>
                      ))
                    ) : (
                      <div className="text-[10px] text-center py-4 text-silver/40">Tous les mondes sont liés</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-[9px] text-silver/40 uppercase tracking-widest leading-relaxed">
        {readOnly 
          ? "Présence de l'entité à travers le Multivers." 
          : "Sélectionnez les mondes où cette entité se manifeste."}
      </p>
    </div>
  );
}