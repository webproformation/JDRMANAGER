import { useState } from 'react';
import { Skull, Info, AlertTriangle, Sparkles, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const cursesConfig = {
  entityName: 'la malédiction',
  tableName: 'curses',
  title: 'Malédictions',
  getHeaderIcon: () => Skull,
  getHeaderColor: () => 'from-violet-600/30 via-purple-500/20 to-indigo-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la malédiction',
          type: 'text',
          required: true,
          placeholder: 'Ex: Malédiction du sang, Marque du damné...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Malédiction mineure, majeure, divine...'
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
          label: 'Image',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Origine, apparence, manifestation...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets',
      icon: AlertTriangle,
      fields: [
        {
          name: 'effects',
          label: 'Effets de la malédiction',
          type: 'textarea',
          rows: 6,
          placeholder: 'Effets mécaniques et narratifs...'
        },
        {
          name: 'severity',
          label: 'Gravité',
          type: 'select',
          options: [
            { value: 'minor', label: 'Mineure' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'severe', label: 'Grave' },
            { value: 'lethal', label: 'Mortelle' }
          ]
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Permanent, 1 mois, jusqu\'à dissipation...'
        },
        {
          name: 'progression',
          label: 'Progression',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment la malédiction évolue dans le temps...'
        }
      ]
    },
    {
      id: 'transmission',
      label: 'Transmission & Origine',
      icon: Sparkles,
      fields: [
        {
          name: 'origin',
          label: 'Origine',
          type: 'textarea',
          rows: 3,
          placeholder: 'Qui ou quoi a créé cette malédiction...'
        },
        {
          name: 'transmission',
          label: 'Transmission',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment la malédiction se transmet...'
        },
        {
          name: 'signs',
          label: 'Signes visibles',
          type: 'textarea',
          rows: 2,
          placeholder: 'Marques, symptômes, aura...'
        }
      ]
    },
    {
      id: 'removal',
      label: 'Dissipation',
      icon: Sparkles,
      fields: [
        {
          name: 'removal_method',
          label: 'Méthode de dissipation',
          type: 'textarea',
          rows: 4,
          placeholder: 'Sorts, rituels, quêtes nécessaires...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté de dissipation',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' },
            { value: 'impossible', label: 'Impossible' }
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
          name: 'curse_images',
          label: 'Images de la malédiction',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'marks', label: 'Marques' },
            { id: 'effects', label: 'Effets' },
            { id: 'victims', label: 'Victimes' }
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
          name: 'plot_hooks',
          label: 'Accroches narratives',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment intégrer cette malédiction dans l\'histoire...'
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

export default function CursesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="curses"
        title="Malédictions"
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
          await supabase.from('curses').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={cursesConfig}
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
        config={cursesConfig}
      />
    </>
  );
}
