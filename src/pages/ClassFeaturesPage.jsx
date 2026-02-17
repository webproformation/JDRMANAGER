import { useState } from 'react';
import { Zap, Info, Target, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const classFeaturesConfig = {
  entityName: 'la capacité de classe',
  tableName: 'class_features',
  title: 'Capacités de Classe',
  getHeaderIcon: () => Zap,
  getHeaderColor: () => 'from-yellow-600/30 via-amber-500/20 to-orange-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la capacité',
          type: 'text',
          required: true,
          placeholder: 'Ex: Second souffle, Rage, Sort mineur...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Capacité passive, Capacité active, Bonus...'
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
          label: 'Image de la capacité',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 6,
          placeholder: 'Effet, fonctionnement, conditions...'
        }
      ]
    },
    {
      id: 'requirements',
      label: 'Prérequis & Niveau',
      icon: Target,
      fields: [
        {
          name: 'class_relation',
          label: 'Classe associée',
          type: 'relation',
          table: 'characterclasses',
          placeholder: 'Sélectionner une classe'
        },
        {
          name: 'level',
          label: 'Niveau requis',
          type: 'number',
          placeholder: '1-20'
        },
        {
          name: 'prerequisites',
          label: 'Autres prérequis',
          type: 'textarea',
          rows: 2,
          placeholder: 'Caractéristiques minimales, autres capacités...'
        }
      ]
    },
    {
      id: 'mechanics',
      label: 'Mécanique de jeu',
      icon: Info,
      fields: [
        {
          name: 'activation',
          label: 'Activation',
          type: 'select',
          options: [
            { value: 'action', label: 'Action' },
            { value: 'bonus_action', label: 'Action bonus' },
            { value: 'reaction', label: 'Réaction' },
            { value: 'passive', label: 'Passive' },
            { value: 'special', label: 'Spéciale' }
          ]
        },
        {
          name: 'uses_per_rest',
          label: 'Utilisations',
          type: 'text',
          placeholder: 'Ex: 1/repos court, 3/repos long, illimité...'
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Instantané, 1 minute, 1 heure, permanent...'
        },
        {
          name: 'range',
          label: 'Portée',
          type: 'text',
          placeholder: 'Personnelle, Contact, 30 pieds...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets détaillés',
      icon: Zap,
      fields: [
        {
          name: 'mechanical_effect',
          label: 'Effet mécanique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Bonus, dégâts, effets de statut...'
        },
        {
          name: 'scaling',
          label: 'Amélioration par niveau',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment la capacité évolue aux niveaux supérieurs...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'feature_images',
          label: 'Images de la capacité',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'icons', label: 'Icônes' },
            { id: 'action', label: 'En action' }
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
          placeholder: 'Puissance, interactions problématiques...'
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

export default function ClassFeaturesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="class_features"
        title="Capacités de Classe"
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
          await supabase.from('class_features').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={classFeaturesConfig}
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
        config={classFeaturesConfig}
      />
    </>
  );
}
