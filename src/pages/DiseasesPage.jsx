import { useState } from 'react';
import { Activity, Info, AlertTriangle, HeartPulse, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const diseasesConfig = {
  entityName: 'la maladie',
  tableName: 'diseases',
  title: 'Maladies',
  getHeaderIcon: () => Activity,
  getHeaderColor: () => 'from-green-600/30 via-lime-500/20 to-emerald-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la maladie',
          type: 'text',
          required: true,
          placeholder: 'Ex: Fièvre des marais, Peste noire...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Bactérienne, virale, magique, maudite...'
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
          rows: 4,
          placeholder: 'Origine, historique, zones affectées...'
        }
      ]
    },
    {
      id: 'transmission',
      label: 'Transmission & Incubation',
      icon: AlertTriangle,
      fields: [
        {
          name: 'transmission',
          label: 'Mode de transmission',
          type: 'textarea',
          rows: 3,
          placeholder: 'Contact, air, eau, morsure...'
        },
        {
          name: 'contagion',
          label: 'Contagiosité',
          type: 'select',
          options: [
            { value: 'none', label: 'Non contagieuse' },
            { value: 'low', label: 'Faible' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'high', label: 'Élevée' },
            { value: 'extreme', label: 'Extrême' }
          ]
        },
        {
          name: 'incubation',
          label: 'Période d\'incubation',
          type: 'text',
          placeholder: '1 jour, 1 semaine, 1 mois...'
        }
      ]
    },
    {
      id: 'symptoms',
      label: 'Symptômes & Effets',
      icon: HeartPulse,
      fields: [
        {
          name: 'symptoms',
          label: 'Symptômes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Symptômes visibles, effets physiques et mentaux...'
        },
        {
          name: 'stages',
          label: 'Stades de progression',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment la maladie évolue...'
        },
        {
          name: 'lethality',
          label: 'Létalité',
          type: 'select',
          options: [
            { value: 'none', label: 'Non létale' },
            { value: 'low', label: 'Faible' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'high', label: 'Élevée' },
            { value: 'certain', label: 'Mortelle' }
          ]
        }
      ]
    },
    {
      id: 'treatment',
      label: 'Traitement & Guérison',
      icon: HeartPulse,
      fields: [
        {
          name: 'treatment',
          label: 'Traitement',
          type: 'textarea',
          rows: 4,
          placeholder: 'Remèdes, potions, sorts, soins...'
        },
        {
          name: 'cure',
          label: 'Guérison',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment guérir complètement...'
        },
        {
          name: 'immunity',
          label: 'Immunité',
          type: 'textarea',
          rows: 2,
          placeholder: 'Qui est naturellement immunisé...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'disease_images',
          label: 'Images de la maladie',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'symptoms', label: 'Symptômes' },
            { id: 'remedies', label: 'Remèdes' },
            { id: 'affected', label: 'Personnes affectées' }
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
          name: 'plot_usage',
          label: 'Utilisation narrative',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment utiliser cette maladie dans l\'histoire...'
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

export default function DiseasesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="diseases"
        title="Maladies"
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
          await supabase.from('diseases').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={diseasesConfig}
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
        config={diseasesConfig}
      />
    </>
  );
}
