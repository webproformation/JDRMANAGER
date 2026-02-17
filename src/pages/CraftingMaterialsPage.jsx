import { useState } from 'react';
import { Hammer, Info, MapPin, DollarSign, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const craftingMaterialsConfig = {
  entityName: 'le matériau',
  tableName: 'crafting_materials',
  title: 'Matériaux de Fabrication',
  getHeaderIcon: () => Hammer,
  getHeaderColor: () => 'from-slate-600/30 via-gray-500/20 to-zinc-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du matériau',
          type: 'text',
          required: true,
          placeholder: 'Ex: Cuir tanné, Acier trempé, Essence lunaire...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Métal, Cuir, Tissu, Composant magique...'
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
          rows: 4,
          placeholder: 'Apparence, texture, propriétés physiques...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Info,
      fields: [
        {
          name: 'quality',
          label: 'Qualité',
          type: 'select',
          options: [
            { value: 'poor', label: 'Médiocre' },
            { value: 'common', label: 'Commune' },
            { value: 'good', label: 'Bonne' },
            { value: 'excellent', label: 'Excellente' },
            { value: 'masterwork', label: 'Chef-d\'œuvre' }
          ]
        },
        {
          name: 'properties',
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Résistance, conductivité magique, durabilité...'
        },
        {
          name: 'uses',
          label: 'Utilisations',
          type: 'textarea',
          rows: 3,
          placeholder: 'Forge d\'armes, création de potions, enchantement...'
        }
      ]
    },
    {
      id: 'source',
      label: 'Source & Récolte',
      icon: MapPin,
      fields: [
        {
          name: 'source',
          label: 'Source',
          type: 'textarea',
          rows: 3,
          placeholder: 'Où et comment obtenir ce matériau...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        {
          name: 'harvesting',
          label: 'Méthode de récolte',
          type: 'textarea',
          rows: 2,
          placeholder: 'Extraction, chasse, cueillette...'
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
          placeholder: 'Ex: 10 po/kg, 50 po/unité...'
        },
        {
          name: 'availability',
          label: 'Disponibilité',
          type: 'text',
          placeholder: 'Marchés, guildes artisanales...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'material_images',
          label: 'Images du matériau',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'Brut' },
            { id: 'processed', label: 'Traité' },
            { id: 'crafted', label: 'Travaillé' }
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

export default function CraftingMaterialsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="crafting_materials"
        title="Matériaux de Fabrication"
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
          await supabase.from('crafting_materials').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={craftingMaterialsConfig}
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
        config={craftingMaterialsConfig}
      />
    </>
  );
}
