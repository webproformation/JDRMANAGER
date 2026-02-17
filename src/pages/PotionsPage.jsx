import { useState } from 'react';
import { FlaskConical, Info, Beaker, DollarSign, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const potionsConfig = {
  entityName: 'la potion',
  tableName: 'potions',
  title: 'Potions',
  getHeaderIcon: () => FlaskConical,
  getHeaderColor: () => 'from-emerald-600/30 via-teal-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la potion',
          type: 'text',
          required: true,
          placeholder: 'Ex: Potion de guérison, Élixir de force...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Potion, Élixir, Philtre...'
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
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, couleur, odeur, consistance...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets',
      icon: Beaker,
      fields: [
        {
          name: 'effects',
          label: 'Effets',
          type: 'textarea',
          rows: 5,
          placeholder: 'Effets principaux, durée, puissance...'
        },
        {
          name: 'side_effects',
          label: 'Effets secondaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Effets indésirables, risques...'
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Ex: 1 heure, instantané, permanent...'
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Fabrication',
      icon: Beaker,
      fields: [
        {
          name: 'ingredients',
          label: 'Ingrédients',
          type: 'textarea',
          rows: 4,
          placeholder: 'Liste des ingrédients nécessaires...'
        },
        {
          name: 'recipe',
          label: 'Recette',
          type: 'textarea',
          rows: 4,
          placeholder: 'Processus de fabrication...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
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
          label: 'Valeur',
          type: 'text',
          placeholder: 'Ex: 50 po, 100 po...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'potion_images',
          label: 'Images de la potion',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'bottle', label: 'Fiole' },
            { id: 'liquid', label: 'Liquide' },
            { id: 'ingredients', label: 'Ingrédients' }
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

export default function PotionsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="potions"
        title="Potions"
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
          await supabase.from('potions').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={potionsConfig}
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
        config={potionsConfig}
      />
    </>
  );
}
