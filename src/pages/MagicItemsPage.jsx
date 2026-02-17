import { useState } from 'react';
import { Wand2, Info, Sparkles, DollarSign, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const magicItemsConfig = {
  entityName: "l'objet magique",
  tableName: 'magic_items',
  title: 'Objets Magiques',
  getHeaderIcon: () => Wand2,
  getHeaderColor: () => 'from-purple-600/30 via-violet-500/20 to-indigo-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: "Nom de l'objet magique",
          type: 'text',
          required: true,
          placeholder: 'Ex: Anneau de protection, Bâton de feu...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Anneau, Bâton, Armure, Arme...'
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
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          required: true,
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' },
            { value: 'artifact', label: 'Artefact' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, aura magique...'
        }
      ]
    },
    {
      id: 'magic',
      label: 'Propriétés magiques',
      icon: Sparkles,
      fields: [
        {
          name: 'attunement',
          label: 'Harmonisation requise',
          type: 'select',
          options: [
            { value: 'yes', label: 'Oui' },
            { value: 'no', label: 'Non' }
          ]
        },
        {
          name: 'magical_properties',
          label: 'Propriétés magiques',
          type: 'textarea',
          rows: 5,
          placeholder: 'Pouvoirs, effets, capacités...'
        },
        {
          name: 'charges',
          label: 'Charges',
          type: 'text',
          placeholder: 'Ex: 3 charges/jour, 10 charges...'
        },
        {
          name: 'activation',
          label: 'Activation',
          type: 'textarea',
          rows: 2,
          placeholder: 'Comment activer les pouvoirs...'
        }
      ]
    },
    {
      id: 'value',
      label: 'Valeur',
      icon: DollarSign,
      fields: [
        {
          name: 'value',
          label: 'Valeur estimée',
          type: 'text',
          placeholder: 'Ex: 5000 po, Inestimable...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'magic_item_images',
          label: "Images de l'objet",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'main', label: 'Principal' },
            { id: 'active', label: 'Activé' },
            { id: 'details', label: 'Détails' }
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
          placeholder: 'Origine, créateur, légendes...'
        },
        {
          name: 'curse',
          label: 'Malédiction',
          type: 'textarea',
          rows: 2,
          placeholder: 'Effets négatifs cachés...'
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function MagicItemsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="magic_items"
        title="Objets Magiques"
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
          await supabase.from('magic_items').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={magicItemsConfig}
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
        config={magicItemsConfig}
      />
    </>
  );
}
