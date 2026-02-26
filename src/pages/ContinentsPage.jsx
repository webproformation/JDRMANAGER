import { useState } from 'react';
import { Mountain, Info, Map, Leaf, Users, BookOpen, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

const continentsConfig = {
  entityName: 'le continent',
  tableName: 'continents',
  title: 'Continents',
  getHeaderIcon: () => Mountain,
  getHeaderColor: () => 'from-emerald-500/30 via-green-500/20 to-teal-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_geo', // INJECTEUR DYNAMIQUE
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
          label: 'Nom du continent',
          type: 'text',
          required: true,
          placeholder: 'Ex: Valdoria, Terres du Nord...'
        },
        {
          name: 'subtitle',
          label: 'Surnom',
          type: 'text',
          placeholder: 'Ex: Berceau des Anciens, Terre Maudite...'
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
          type: 'image',
          description: 'Carte ou vue du continent'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Vue d\'ensemble du continent...'
        }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie physique',
      icon: Map,
      fields: [
        {
          name: 'area',
          label: 'Superficie',
          type: 'text',
          placeholder: 'Ex: 10 millions de km²'
        },
        {
          name: 'climate',
          label: 'Climat principal',
          type: 'select',
          options: [
            { value: 'tropical', label: 'Tropical' },
            { value: 'temperate', label: 'Tempéré' },
            { value: 'arctic', label: 'Arctique' },
            { value: 'desert', label: 'Désertique' },
            { value: 'mediterranean', label: 'Méditerranéen' },
            { value: 'varied', label: 'Varié' }
          ]
        },
        {
          name: 'terrain_description',
          label: 'Description du terrain',
          type: 'textarea',
          rows: 4,
          placeholder: 'Relief général, types de terrains dominants...'
        },
        {
          name: 'major_rivers',
          label: 'Rivières majeures',
          type: 'textarea',
          rows: 2,
          placeholder: 'Grands fleuves, rivières importantes...'
        },
        {
          name: 'mountain_ranges',
          label: 'Chaînes de montagnes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Massifs montagneux, pics importants...'
        },
        {
          name: 'forests',
          label: 'Forêts',
          type: 'textarea',
          rows: 2,
          placeholder: 'Grandes forêts, zones boisées...'
        },
        {
          name: 'deserts',
          label: 'Déserts',
          type: 'textarea',
          rows: 2,
          placeholder: 'Zones arides, déserts...'
        },
        {
          name: 'resources',
          label: 'Ressources naturelles',
          type: 'textarea',
          rows: 3,
          placeholder: 'Minerais, bois, ressources exploitées...'
        }
      ]
    },
    {
      id: 'nature',
      label: 'Faune & Flore',
      icon: Leaf,
      fields: [
        {
          name: 'fauna',
          label: 'Faune caractéristique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Animaux, créatures typiques de ce continent...'
        },
        {
          name: 'flora',
          label: 'Flore caractéristique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Plantes, arbres, végétation typique...'
        }
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Peuples',
      icon: Users,
      fields: [
        {
          name: 'population',
          label: 'Population totale',
          type: 'text',
          placeholder: 'Ex: 50 millions d\'habitants'
        },
        {
          name: 'cultures',
          label: 'Cultures présentes',
          type: 'textarea',
          rows: 4,
          placeholder: 'Peuples, cultures, civilisations du continent...'
        },
        {
          name: 'languages_spoken',
          label: 'Langues parlées',
          type: 'textarea',
          rows: 2,
          placeholder: 'Principales langues du continent...'
        },
        {
          name: 'religions',
          label: 'Religions pratiquées',
          type: 'textarea',
          rows: 3,
          placeholder: 'Cultes, religions dominantes...'
        }
      ]
    },
    {
      id: 'history',
      label: 'Histoire',
      icon: BookOpen,
      fields: [
        {
          name: 'historical_significance',
          label: 'Importance historique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Place du continent dans l\'histoire du monde...'
        },
        {
          name: 'history',
          label: 'Histoire',
          type: 'textarea',
          rows: 5,
          placeholder: 'Grands événements historiques, ères, civilisations...'
        },
        {
          name: 'legends',
          label: 'Légendes locales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Mythes, légendes associées au continent...'
        },
        {
          name: 'current_events',
          label: 'Événements actuels',
          type: 'textarea',
          rows: 3,
          placeholder: 'Situation actuelle, tensions, développements...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'continent_images',
          label: 'Images du continent',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'maps', label: 'Cartes' },
            { id: 'landscapes', label: 'Paysages' },
            { id: 'landmarks', label: 'Sites remarquables' },
            { id: 'wildlife', label: 'Faune & Flore' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA SÉCURITÉ MJ
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'gm_secrets_continent',
          label: 'Secrets du continent',
          type: 'textarea',
          rows: 4,
          placeholder: 'Mystères, secrets cachés, anciennes civilisations...'
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

export default function ContinentsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleView = (item) => setSelectedItem(item);
  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedItem(null);
    setShowForm(true);
  };
  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
  };
  const handleDelete = async () => {
    if (!selectedItem || !confirm('Supprimer ce continent ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('continents').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="continents"
        title="Continents"
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={handleDelete}
        item={selectedItem}
        config={continentsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={continentsConfig}
      />
    </>
  );
}