import React, { useState } from 'react';
import { 
  Swords, Info, Map, Scroll, Users, 
  Clock, Shield, ImageIcon, PlayCircle 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import { supabase } from '../lib/supabase';

// --- CONFIGURATION : CAMPAGNES ---
const campaignsConfig = {
  entityName: 'la campagne',
  tableName: 'campaigns',
  title: 'Campagnes',
  
  // Icône dynamique selon le statut
  getHeaderIcon: (item) => {
    if (item?.status === 'active') return PlayCircle;
    return Swords;
  },
  
  // Couleur dynamique selon le statut
  getHeaderColor: (item) => {
    switch (item?.status) {
      case 'active': return 'from-green-600/40 via-emerald-500/30 to-teal-500/20'; // Actif = Vert
      case 'paused': return 'from-orange-600/40 via-amber-500/30 to-yellow-500/20'; // Pause = Orange
      case 'completed': return 'from-slate-700/50 via-slate-600/40 to-gray-500/30'; // Fini = Gris
      default: return 'from-indigo-600/40 via-purple-500/30 to-blue-500/20'; // Planning = Violet
    }
  },

  tabs: [
    {
      id: 'general',
      label: 'Général',
      icon: Info,
      fields: [
        { name: 'name', label: 'Nom de la campagne', type: 'text', required: true, placeholder: 'Ex: La Malédiction de Strahd...' },
        { 
          name: 'status', 
          label: 'État actuel', 
          type: 'select', 
          options: [
            { value: 'planning', label: '🛠️ En préparation' },
            { value: 'active', label: '▶️ En cours' },
            { value: 'paused', label: '⏸️ En pause' },
            { value: 'completed', label: '🏁 Terminée' }
          ]
        },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds', placeholder: 'Dans quel univers ?' },
        { name: 'image_url', label: 'Affiche de campagne', type: 'image', bucket: 'images' },
        { name: 'description', label: 'Synopsis', type: 'textarea', rows: 4, placeholder: 'Le pitch de l\'aventure...' },
        { name: 'start_date', label: 'Date de début', type: 'text', placeholder: 'Ex: 12 Janvier 2024 ou "L\'an 450"' }
      ]
    },
    {
      id: 'logistics',
      label: 'Logistique',
      icon: Clock,
      fields: [
        { name: 'session_count', label: 'Nombre de sessions', type: 'number', placeholder: '0' },
        { name: 'next_session', label: 'Prochaine session', type: 'text', placeholder: 'Date ou objectif...' },
        { name: 'players', label: 'Joueurs', type: 'textarea', rows: 3, placeholder: 'Noms des joueurs...' }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        {
          name: 'campaign_images',
          label: 'Souvenirs & Cartes',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'maps', label: 'Cartes de combat' },
            { id: 'moments', label: 'Moments épiques' },
            { id: 'handouts', label: 'Aides de jeu' }
          ]
        }
      ]
    },
    {
      id: 'gm_notes',
      label: 'MJ (Secret)',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Notes de campagne', type: 'textarea', rows: 6, placeholder: 'Trame principale, fils rouges...' },
        { name: 'gm_secret_plots', label: 'Secrets à révéler', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function CampaignsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleView = (item) => setSelectedItem(item);

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(null);
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleSuccess = () => {
    setIsCreating(false);
    setEditingItem(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Supprimer la campagne ${item.name} ?`)) return;
    const { error } = await supabase.from('campaigns').delete().eq('id', item.id);
    if (error) console.error(error);
    else {
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="campaigns"
        title="Campagnes"
        icon={Swords}
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        config={campaignsConfig}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => handleDelete(selectedItem)}
      />

      <EnhancedEntityForm
        isOpen={isCreating}
        onClose={() => { setIsCreating(false); setEditingItem(null); }}
        item={editingItem}
        config={campaignsConfig}
        onSuccess={handleSuccess}
      />
    </>
  );
}