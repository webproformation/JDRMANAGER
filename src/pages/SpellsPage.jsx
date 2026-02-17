import { useState } from 'react';
import { Sparkles, Info, Wand2, Book, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const spellsConfig = {
  entityName: 'le sort',
  tableName: 'spells',
  title: 'Sorts',
  getHeaderIcon: () => Sparkles,
  getHeaderColor: () => 'from-purple-600/30 via-fuchsia-500/20 to-pink-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du sort',
          type: 'text',
          required: true,
          placeholder: 'Ex: Boule de feu, Bouclier, Invisibilité...'
        },
        {
          name: 'subtitle',
          label: 'École de magie',
          type: 'text',
          placeholder: 'Évocation, Abjuration, Illusion...'
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
          label: 'Image du sort',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 6,
          placeholder: 'Effet visuel et mécanique du sort...'
        }
      ]
    },
    {
      id: 'mechanics',
      label: 'Mécanique',
      icon: Wand2,
      fields: [
        {
          name: 'level',
          label: 'Niveau',
          type: 'select',
          options: [
            { value: '0', label: 'Sort mineur' },
            { value: '1', label: 'Niveau 1' },
            { value: '2', label: 'Niveau 2' },
            { value: '3', label: 'Niveau 3' },
            { value: '4', label: 'Niveau 4' },
            { value: '5', label: 'Niveau 5' },
            { value: '6', label: 'Niveau 6' },
            { value: '7', label: 'Niveau 7' },
            { value: '8', label: 'Niveau 8' },
            { value: '9', label: 'Niveau 9' }
          ]
        },
        {
          name: 'casting_time',
          label: 'Temps d\'incantation',
          type: 'text',
          placeholder: '1 action, 1 action bonus, 1 minute...'
        },
        {
          name: 'range',
          label: 'Portée',
          type: 'text',
          placeholder: 'Personnelle, Contact, 30 pieds, 1 mile...'
        },
        {
          name: 'components',
          label: 'Composantes',
          type: 'text',
          placeholder: 'V, S, M (description des composantes matérielles)...'
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Instantané, 1 minute, Concentration jusqu\'à 1 heure...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets',
      icon: Sparkles,
      fields: [
        {
          name: 'effect',
          label: 'Effet',
          type: 'textarea',
          rows: 6,
          placeholder: 'Description détaillée des effets mécaniques...'
        },
        {
          name: 'at_higher_levels',
          label: 'Aux niveaux supérieurs',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment le sort évolue avec des emplacements supérieurs...'
        },
        {
          name: 'saving_throw',
          label: 'Jet de sauvegarde',
          type: 'text',
          placeholder: 'Dextérité, Sagesse, Constitution...'
        }
      ]
    },
    {
      id: 'availability',
      label: 'Disponibilité',
      icon: Book,
      fields: [
        {
          name: 'classes',
          label: 'Classes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Mage, Ensorceleur, Clerc...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'spell_images',
          label: 'Images du sort',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'casting', label: 'Incantation' },
            { id: 'effect', label: 'Effet' },
            { id: 'components', label: 'Composantes' }
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
          name: 'balance_notes',
          label: 'Notes d\'équilibrage',
          type: 'textarea',
          rows: 2,
          placeholder: 'Puissance, combos problématiques...'
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 2
        }
      ]
    }
  ]
};

export default function SpellsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="spells"
        title="Sorts"
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
          await supabase.from('spells').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={spellsConfig}
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
        config={spellsConfig}
      />
    </>
  );
}
