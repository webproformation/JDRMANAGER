import React, { useState, useEffect } from 'react';
import { 
  Swords, Info, Map, Scroll, Users, 
  Clock, Shield, ImageIcon, PlayCircle, AlertCircle 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';

// --- CONFIGURATION PRESTIGE : CAMPAGNES ---
const campaignsConfig = {
  entityName: 'la campagne',
  tableName: 'campaigns',
  title: 'Registre des Épopées',
  
  // Icône dynamique selon le statut
  getHeaderIcon: (item) => {
    if (item?.status === 'active') return PlayCircle;
    return Swords;
  },
  
  // Couleur dynamique selon le statut
  getHeaderColor: (item) => {
    switch (item?.status) {
      case 'active': return 'from-green-600/40 via-emerald-500/30 to-teal-500/20';
      case 'paused': return 'from-orange-600/40 via-amber-500/30 to-yellow-500/20';
      case 'completed': return 'from-slate-700/50 via-slate-600/40 to-gray-500/30';
      default: return 'from-indigo-600/40 via-purple-500/30 to-blue-500/20';
    }
  },

  tabs: [
    {
      id: 'general',
      label: 'Synopsis',
      icon: Info,
      fields: [
        { name: 'name', label: 'Nom de la campagne', type: 'text', required: true, placeholder: 'Ex: La Malédiction de Strahd...' },
        { 
          name: 'status', 
          label: 'État d\'avancement', 
          type: 'select', 
          options: [
            { value: 'planning', label: '🛠️ En préparation' },
            { value: 'active', label: '▶️ En cours' },
            { value: 'paused', label: '⏸️ En pause' },
            { value: 'completed', label: '🏁 Terminée' }
          ]
        },
        { name: 'world_id', label: 'Monde lié', type: 'relation', table: 'worlds', placeholder: 'Dans quel univers ?' },
        { name: 'image_url', label: 'Affiche / Illustration', type: 'image', bucket: 'images' },
        { name: 'description', label: 'Synopsis & Enjeux', type: 'textarea', rows: 4, placeholder: 'Le pitch de l\'aventure...' },
        { name: 'start_date', label: 'Date de début', type: 'text', placeholder: 'Ex: 12 Janvier 2024 ou "L\'an 450"' }
      ]
    },
    {
      id: 'logistics',
      label: 'Logistique',
      icon: Clock,
      fields: [
        { name: 'session_count', label: 'Nombre de sessions', type: 'number', placeholder: '0' },
        { name: 'next_session', label: 'Prochaine session', type: 'text', placeholder: 'Date ou objectif de séance...' },
        { name: 'players', label: 'Compagnons (Joueurs)', type: 'textarea', rows: 3, placeholder: 'Noms des joueurs participant...' }
      ]
    },
    {
      id: 'gallery',
      label: 'Archives Visuelles',
      icon: ImageIcon,
      fields: [
        {
          name: 'campaign_images',
          label: 'Cartographie & Souvenirs',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'maps', label: 'Cartes' },
            { id: 'moments', label: 'Illustrations' },
            { id: 'handouts', label: 'Aides de Jeu' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Trame de Campagne', type: 'textarea', rows: 6, placeholder: 'Fils rouges et arcs narratifs...' },
        { name: 'gm_secret_plots', label: 'Secrets & Révélations', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function CampaignsPage({ activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  // --- PROTOCOLE DE ROUTAGE VERCEL ---
  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowForm(false);
    setEditingItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus monde
    setEditingItem({ 
      world_id: activeWorldId !== 'all' ? activeWorldId : null,
      status: 'planning',
      session_count: 0
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      {/* DIALOGUE DE SUPPRESSION PRESTIGE */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Clore les Chroniques"
        message={`Souhaitez-vous vraiment effacer ${deleteConfirm.item?.name} ? Tous les récits et exploits de cette épopée seront perdus dans l'oubli.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="campaigns"
        title="Campagnes"
        icon={Swords}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={campaignsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={campaignsConfig}
      />
    </div>
  );
}