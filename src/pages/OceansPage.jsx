import React, { useState } from 'react';
import { Waves, Info, Ship, Fish, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes
import { supabase } from '../lib/supabase';

const oceansConfig = {
  entityName: "l'océan",
  tableName: 'oceans',
  title: 'Océans & Mers',
  getHeaderIcon: () => Waves,
  getHeaderColor: () => 'from-blue-800/40 via-cyan-700/30 to-teal-600/20',

  tabs: [
    {
      id: 'general',
      label: 'Général',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_geo_fields', // INJECTEUR DYNAMIQUE (Utilise la clé geo pour les océans)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="geo" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        { name: 'name', label: 'Nom', type: 'text', required: true, placeholder: 'Ex: Mer des Ombres, Océan infini...' },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds', placeholder: 'Sélectionner un monde' },
        { name: 'image_url', label: 'Image', type: 'image', bucket: 'images' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 4, placeholder: 'Apparence, couleur des eaux, marées...' },
        { name: 'type', label: 'Type', type: 'select', options: [
            { value: 'ocean', label: 'Océan' },
            { value: 'sea', label: 'Mer' },
            { value: 'lake', label: 'Grand Lac' },
            { value: 'bay', label: 'Baie' }
        ]}
      ]
    },
    {
      id: 'navigation',
      label: 'Navigation & Vie',
      icon: Ship,
      fields: [
        { name: 'currents', label: 'Courants & Vents', type: 'textarea', rows: 3, placeholder: 'Courants dangereux, routes commerciales sûres...' },
        { name: 'depth', label: 'Profondeur moyenne', type: 'text', placeholder: 'Ex: Abyssal, Peu profond...' },
        { name: 'dangers', label: 'Dangers', type: 'textarea', rows: 3, placeholder: 'Récifs, tempêtes magiques, brumes...' }
      ]
    },
    {
      id: 'ecosystem',
      label: 'Écosystème',
      icon: Fish,
      fields: [
        { name: 'marine_life', label: 'Faune marine', type: 'textarea', rows: 4, placeholder: 'Créatures communes, monstres marins légendaires...' },
        { name: 'resources', label: 'Ressources', type: 'textarea', rows: 3, placeholder: 'Perles, poissons, algues rares, épaves...' }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        {
          name: 'ocean_images',
          label: 'Images',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'surface', label: 'Surface' },
            { id: 'underwater', label: 'Sous-marin' },
            { id: 'maps', label: 'Cartes marines' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ (CONSERVÉ)
      label: 'MJ',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Notes Secrètes', type: 'textarea', rows: 6 },
        { name: 'gm_secret_plots', label: 'Secrets des profondeurs', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function OceansPage() {
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
    if (!confirm(`Supprimer ${item.name} ?`)) return;
    const { error } = await supabase.from('oceans').delete().eq('id', item.id);
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
        tableName="oceans"
        title="Océans & Mers"
        icon={Waves}
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        config={oceansConfig}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => handleDelete(selectedItem)}
      />

      <EnhancedEntityForm
        isOpen={isCreating}
        onClose={() => { setIsCreating(false); setEditingItem(null); }}
        item={editingItem}
        config={oceansConfig}
        onSuccess={handleSuccess}
      />
    </>
  );
}