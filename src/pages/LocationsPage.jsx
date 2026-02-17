import { useState } from 'react';
import { MapPin, Info, Compass, Sparkles, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const locationsConfig = {
  entityName: 'le lieu',
  tableName: 'locations',
  title: 'Lieux',
  getHeaderIcon: () => MapPin,
  getHeaderColor: () => 'from-rose-600/30 via-pink-500/20 to-red-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du lieu',
          type: 'text',
          required: true,
          placeholder: 'Ex: Forêt Sombre, Ruines Anciennes...'
        },
        {
          name: 'subtitle',
          label: 'Surnom',
          type: 'text',
          placeholder: 'Ex: Le Bois Maudit, Tombeau des Rois...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'image_url',
          label: 'Image principale',
          type: 'image'
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'forest', label: 'Forêt' },
            { value: 'mountain', label: 'Montagne' },
            { value: 'cave', label: 'Grotte' },
            { value: 'ruins', label: 'Ruines' },
            { value: 'dungeon', label: 'Donjon' },
            { value: 'temple', label: 'Temple' },
            { value: 'tower', label: 'Tour' },
            { value: 'castle', label: 'Château' },
            { value: 'other', label: 'Autre' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, atmosphère, caractéristiques...'
        }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie',
      icon: Compass,
      fields: [
        {
          name: 'location_description',
          label: 'Emplacement',
          type: 'textarea',
          rows: 3,
          placeholder: 'Où se trouve ce lieu, comment y accéder...'
        },
        {
          name: 'terrain',
          label: 'Terrain',
          type: 'text',
          placeholder: 'Rocheux, forestier, marécageux...'
        },
        {
          name: 'climate',
          label: 'Climat',
          type: 'text',
          placeholder: 'Tempéré, froid, humide, aride...'
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'text',
          placeholder: 'Petit, moyen, vaste, immense...'
        }
      ]
    },
    {
      id: 'features',
      label: 'Caractéristiques',
      icon: Sparkles,
      fields: [
        {
          name: 'features',
          label: 'Points remarquables',
          type: 'textarea',
          rows: 4,
          placeholder: 'Salles, passages, formations naturelles...'
        },
        {
          name: 'inhabitants',
          label: 'Habitants',
          type: 'textarea',
          rows: 3,
          placeholder: 'Créatures, monstres, esprits...'
        },
        {
          name: 'dangers',
          label: 'Dangers',
          type: 'textarea',
          rows: 3,
          placeholder: 'Pièges, créatures hostiles, environnement...'
        },
        {
          name: 'treasures',
          label: 'Trésors',
          type: 'textarea',
          rows: 3,
          placeholder: 'Objets magiques, or, artefacts...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'location_images',
          label: 'Images du lieu',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'exterior', label: 'Extérieur' },
            { id: 'interior', label: 'Intérieur' },
            { id: 'details', label: 'Détails' },
            { id: 'maps', label: 'Cartes' }
          ]
        }
      ]
    },
    {
      id: 'gm_notes',
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'history',
          label: 'Histoire',
          type: 'textarea',
          rows: 3,
          placeholder: 'Origine, événements passés...'
        },
        {
          name: 'secrets',
          label: 'Secrets',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mystères cachés, pièges secrets...'
        },
        {
          name: 'quest_hooks',
          label: 'Accroches de quête',
          type: 'textarea',
          rows: 3,
          placeholder: 'Idées d\'aventures, rumeurs...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function LocationsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="locations"
        title="Lieux"
        onView={setSelectedItem}
        onEdit={(item) => {
          setEditingItem(item);
          setSelectedItem(null);
          setShowForm(true);
        }}
        onCreate={() => {
          setEditingItem(null);
          setShowForm(true);
        }}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => {
          setEditingItem(selectedItem);
          setSelectedItem(null);
          setShowForm(true);
        }}
        onDelete={async () => {
          if (!selectedItem || !confirm('Supprimer ce lieu ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('locations').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={locationsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
          setShowForm(false);
          setEditingItem(null);
        }}
        item={editingItem}
        config={locationsConfig}
      />
    </>
  );
}
