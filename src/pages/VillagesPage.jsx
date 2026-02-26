import { useState } from 'react';
import { Home, Info, Users, Building, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

const villagesConfig = {
  entityName: 'le village',
  tableName: 'locations',
  title: 'Villages',
  filterCondition: { type: 'village' },
  getHeaderIcon: () => Home,
  getHeaderColor: () => 'from-green-600/30 via-teal-500/20 to-emerald-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_geo_fields', // INJECTEUR DYNAMIQUE (Utilise la clé geo pour les localités)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="geo" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du village',
          type: 'text',
          required: true,
          placeholder: 'Ex: Boisvert, Port-Calme...'
        },
        {
          name: 'subtitle',
          label: 'Surnom ou titre',
          type: 'text',
          placeholder: 'Ex: Le Village des Brumes, Havre de Paix...'
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
            { value: 'village', label: 'Village' }
          ],
          defaultValue: 'village'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence générale, atmosphère, caractéristiques distinctives...'
        }
      ]
    },
    {
      id: 'demographics',
      label: 'Population',
      icon: Users,
      fields: [
        {
          name: 'population',
          label: 'Population',
          type: 'text',
          placeholder: 'Ex: 200 habitants, 50 familles...'
        },
        {
          name: 'races',
          label: 'Races principales',
          type: 'text',
          placeholder: 'Humains, Elfes, Nains...'
        },
        {
          name: 'government',
          label: 'Gouvernement',
          type: 'text',
          placeholder: 'Conseil des anciens, Maire, Chef de village...'
        },
        {
          name: 'notable_figures',
          label: 'Personnages notables',
          type: 'textarea',
          rows: 3,
          placeholder: 'Dirigeants, marchands, sages...'
        }
      ]
    },
    {
      id: 'economy',
      label: 'Économie & Commerce',
      icon: Building,
      fields: [
        {
          name: 'economy',
          label: 'Économie principale',
          type: 'textarea',
          rows: 3,
          placeholder: 'Agriculture, pêche, artisanat, commerce...'
        },
        {
          name: 'resources',
          label: 'Ressources locales',
          type: 'textarea',
          rows: 2,
          placeholder: 'Bois, pierre, minerais, cultures...'
        },
        {
          name: 'trade',
          label: 'Commerce',
          type: 'textarea',
          rows: 2,
          placeholder: 'Produits exportés, importés, routes commerciales...'
        },
        {
          name: 'taverns_inns',
          label: 'Auberges & Tavernes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Noms et descriptions des établissements...'
        }
      ]
    },
    {
      id: 'features',
      label: 'Lieux remarquables',
      icon: Building,
      fields: [
        {
          name: 'landmarks',
          label: 'Points d\'intérêt',
          type: 'textarea',
          rows: 4,
          placeholder: 'Temple, forge, moulin, place du marché...'
        },
        {
          name: 'defenses',
          label: 'Défenses',
          type: 'textarea',
          rows: 2,
          placeholder: 'Palissade, milice, tours de guet...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'village_images',
          label: 'Images du village',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'buildings', label: 'Bâtiments' },
            { id: 'people', label: 'Habitants' },
            { id: 'events', label: 'Événements' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ (CONSERVÉ)
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'history',
          label: 'Histoire',
          type: 'textarea',
          rows: 3,
          placeholder: 'Fondation, événements marquants...'
        },
        {
          name: 'secrets',
          label: 'Secrets',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mystères, complots, dangers cachés...'
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

export default function VillagesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="locations"
        title="Villages"
        filterCondition={{ type: 'village' }}
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
          if (!selectedItem || !confirm('Supprimer ce village ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('locations').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={villagesConfig}
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
        config={villagesConfig}
      />
    </>
  );
}