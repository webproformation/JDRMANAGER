import { useState } from 'react';
import { Star, Info, Orbit, Sparkles, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const celestialBodiesConfig = {
  entityName: 'le corps céleste',
  tableName: 'celestial_bodies',
  title: 'Corps Célestes',
  getHeaderIcon: () => Star,
  getHeaderColor: () => 'from-blue-600/30 via-cyan-500/20 to-sky-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du corps céleste',
          type: 'text',
          required: true,
          placeholder: 'Ex: Solara, Lune d\'Argent...'
        },
        {
          name: 'subtitle',
          label: 'Autre nom ou titre',
          type: 'text',
          placeholder: 'Ex: L\'Œil du Ciel, Grande Étoile...'
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
          name: 'body_type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'planet', label: 'Planète' },
            { value: 'moon', label: 'Lune' },
            { value: 'star', label: 'Étoile' },
            { value: 'comet', label: 'Comète' },
            { value: 'constellation', label: 'Constellation' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, caractéristiques visibles...'
        }
      ]
    },
    {
      id: 'physical',
      label: 'Caractéristiques physiques',
      icon: Orbit,
      fields: [
        {
          name: 'color',
          label: 'Couleur',
          type: 'text',
          placeholder: 'Rouge, argentée, dorée, bleue...'
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'text',
          placeholder: 'Petite, moyenne, grande, gigantesque...'
        },
        {
          name: 'brightness',
          label: 'Luminosité',
          type: 'text',
          placeholder: 'Très brillant, faible, variable...'
        },
        {
          name: 'orbital_period',
          label: 'Période orbitale',
          type: 'text',
          placeholder: '28 jours, 365 jours, aucune...'
        },
        {
          name: 'phases',
          label: 'Phases',
          type: 'textarea',
          rows: 3,
          placeholder: 'Phases de la lune, cycles, changements...'
        }
      ]
    },
    {
      id: 'influence',
      label: 'Influences & Effets',
      icon: Sparkles,
      fields: [
        {
          name: 'astrological_influence',
          label: 'Influence astrologique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Effets sur la magie, marées, comportements...'
        },
        {
          name: 'magical_properties',
          label: 'Propriétés magiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Amplification magique sous certaines phases...'
        },
        {
          name: 'cultural_significance',
          label: 'Importance culturelle',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rôle dans les mythes, religions, calendriers...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'celestial_images',
          label: 'Images du corps céleste',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'full', label: 'Vue complète' },
            { id: 'phases', label: 'Phases' },
            { id: 'sky', label: 'Dans le ciel' },
            { id: 'effects', label: 'Effets' }
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
          name: 'lore',
          label: 'Histoire & Légendes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mythes, légendes, prophéties...'
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

export default function CelestialBodiesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="celestial_bodies"
        title="Corps Célestes"
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
          if (!selectedItem || !confirm('Supprimer ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('celestial_bodies').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={celestialBodiesConfig}
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
        config={celestialBodiesConfig}
      />
    </>
  );
}
