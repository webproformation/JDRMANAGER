import { useState } from 'react';
import { Package, Info, DollarSign, Wrench, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const itemsConfig = {
  entityName: "l'objet",
  tableName: 'items',
  title: 'Objets',
  getHeaderIcon: () => Package,
  getHeaderColor: () => 'from-amber-600/30 via-yellow-500/20 to-orange-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: "Nom de l'objet",
          type: 'text',
          required: true,
          placeholder: 'Ex: Épée longue, Corde de chanvre...'
        },
        {
          name: 'subtitle',
          label: 'Type ou catégorie',
          type: 'text',
          placeholder: 'Ex: Arme, Outil, Équipement...'
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
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, matériaux, détails...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Wrench,
      fields: [
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'weapon', label: 'Arme' },
            { value: 'armor', label: 'Armure' },
            { value: 'tool', label: 'Outil' },
            { value: 'clothing', label: 'Vêtement' },
            { value: 'consumable', label: 'Consommable' },
            { value: 'misc', label: 'Divers' }
          ]
        },
        {
          name: 'weight',
          label: 'Poids',
          type: 'text',
          placeholder: 'Ex: 2 kg, 500g...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' }
          ]
        },
        {
          name: 'properties',
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Durabilité, résistance, caractéristiques...'
        }
      ]
    },
    {
      id: 'value',
      label: 'Valeur & Commerce',
      icon: DollarSign,
      fields: [
        {
          name: 'value',
          label: 'Valeur',
          type: 'text',
          placeholder: 'Ex: 50 po, 10 pa...'
        },
        {
          name: 'availability',
          label: 'Disponibilité',
          type: 'text',
          placeholder: 'Courant, rare, sur commande...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'item_images',
          label: "Images de l'objet",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'main', label: 'Principal' },
            { id: 'details', label: 'Détails' },
            { id: 'variants', label: 'Variantes' }
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
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 4
        }
      ]
    }
  ]
};

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="items"
        title="Objets"
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
          await supabase.from('items').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={itemsConfig}
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
        config={itemsConfig}
      />
    </>
  );
}
