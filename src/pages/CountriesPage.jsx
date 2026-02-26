import { useState } from 'react';
import { Flag, Info, Map, Scale, DollarSign, Palette, BookOpen, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

const countriesConfig = {
  entityName: 'le pays',
  tableName: 'countries',
  title: 'Pays',
  getHeaderIcon: () => Flag,
  getHeaderColor: () => 'from-red-500/30 via-blue-500/20 to-green-500/30',

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
          name: 'dynamic_geo', // INJECTEUR DYNAMIQUE (AJOUTÉ)
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
          label: 'Nom du pays',
          type: 'text',
          required: true,
          placeholder: 'Ex: Royaume d\'Avalon, République de Lumière...'
        },
        {
          name: 'subtitle',
          label: 'Devise ou surnom',
          type: 'text',
          placeholder: 'Ex: La Terre des Mille Lacs, Cœur de l\'Empire...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'continent_id',
          label: 'Continent',
          type: 'relation',
          table: 'continents',
          filterBy: 'world_id',
          filterValue: 'world_id',
          placeholder: 'Sélectionner un continent'
        },
        {
          name: 'ocean_id',
          label: 'Océan/Mer',
          type: 'relation',
          table: 'oceans',
          filterBy: 'world_id',
          filterValue: 'world_id',
          placeholder: 'Sélectionner un océan/mer (si côtier)'
        },
        {
          name: 'image_url',
          label: 'Image principale',
          type: 'image',
          description: 'Drapeau, carte ou paysage emblématique'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Description générale du pays, son identité, son importance...'
        }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie & Territoire',
      icon: Map,
      fields: [
        {
          name: 'area',
          label: 'Superficie',
          type: 'text',
          placeholder: 'Ex: 500 000 km², immense, petit...'
        },
        {
          name: 'terrain',
          label: 'Terrain principal',
          type: 'text',
          placeholder: 'Ex: Montagneux, plaines, forêts...'
        },
        {
          name: 'climate_description',
          label: 'Description du climat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Climat général, saisons, phénomènes météorologiques...'
        },
        {
          name: 'capital',
          label: 'Capitale',
          type: 'text',
          placeholder: 'Nom de la capitale'
        },
        {
          name: 'population',
          label: 'Population',
          type: 'text',
          placeholder: 'Ex: 5 millions d\'habitants'
        }
      ]
    },
    {
      id: 'politics',
      label: 'Politique & Gouvernement',
      icon: Scale,
      fields: [
        {
          name: 'government_type',
          label: 'Type de gouvernement',
          type: 'text',
          placeholder: 'Monarchie, république, théocratie, empire...'
        },
        {
          name: 'government_structure',
          label: 'Structure gouvernementale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Organisation du pouvoir, institutions, conseil...'
        },
        {
          name: 'ruler',
          label: 'Dirigeant actuel',
          type: 'text',
          placeholder: 'Nom et titre du chef d\'État'
        },
        {
          name: 'laws',
          label: 'Lois importantes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Code pénal, droits, restrictions, lois particulières...'
        },
        {
          name: 'military_strength',
          label: 'Force militaire',
          type: 'text',
          placeholder: 'Ex: Armée de 50 000 soldats, faible, puissante...'
        },
        {
          name: 'military_structure',
          label: 'Structure militaire',
          type: 'textarea',
          rows: 3,
          placeholder: 'Organisation de l\'armée, légions, flottes, garnisons...'
        },
        {
          name: 'alliances',
          label: 'Alliances',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pays alliés, traités, pactes...'
        },
        {
          name: 'enemies',
          label: 'Ennemis',
          type: 'textarea',
          rows: 2,
          placeholder: 'Rivaux, ennemis déclarés, tensions...'
        }
      ]
    },
    {
      id: 'economy',
      label: 'Économie & Commerce',
      icon: DollarSign,
      fields: [
        {
          name: 'economy',
          label: 'Économie générale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Type d\'économie, richesse, secteurs principaux...'
        },
        {
          name: 'currency',
          label: 'Monnaie',
          type: 'text',
          placeholder: 'Ex: Couronnes d\'or, pièces de platine...'
        },
        {
          name: 'trade_goods',
          label: 'Biens commerciaux',
          type: 'textarea',
          rows: 3,
          placeholder: 'Produits fabriqués ou cultivés localement...'
        },
        {
          name: 'imports',
          label: 'Importations',
          type: 'textarea',
          rows: 2,
          placeholder: 'Biens importés d\'autres pays...'
        },
        {
          name: 'exports',
          label: 'Exportations',
          type: 'textarea',
          rows: 2,
          placeholder: 'Biens exportés vers d\'autres pays...'
        }
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Société',
      icon: Palette,
      fields: [
        {
          name: 'language',
          label: 'Langues parlées',
          type: 'text',
          placeholder: 'Langue(s) officielle(s) et dialectes'
        },
        {
          name: 'cultural_practices',
          label: 'Pratiques culturelles',
          type: 'textarea',
          rows: 4,
          placeholder: 'Traditions, coutumes, valeurs, codes sociaux...'
        },
        {
          name: 'festivals',
          label: 'Festivals & Célébrations',
          type: 'textarea',
          rows: 3,
          placeholder: 'Fêtes nationales, célébrations religieuses...'
        },
        {
          name: 'cuisine',
          label: 'Cuisine typique',
          type: 'textarea',
          rows: 2,
          placeholder: 'Plats traditionnels, spécialités culinaires...'
        },
        {
          name: 'art_style',
          label: 'Style artistique',
          type: 'textarea',
          rows: 2,
          placeholder: 'Architecture, peinture, sculpture, musique...'
        },
        {
          name: 'education_system',
          label: 'Système éducatif',
          type: 'textarea',
          rows: 3,
          placeholder: 'Organisation de l\'éducation, universités, guildes...'
        }
      ]
    },
    {
      id: 'history',
      label: 'Histoire',
      icon: BookOpen,
      fields: [
        {
          name: 'founding_date',
          label: 'Date de fondation',
          type: 'text',
          placeholder: 'Ex: An 1245, il y a 500 ans...'
        },
        {
          name: 'history',
          label: 'Histoire du pays',
          type: 'textarea',
          rows: 6,
          placeholder: 'Fondation, grands événements, évolution...'
        },
        {
          name: 'major_wars',
          label: 'Guerres majeures',
          type: 'textarea',
          rows: 4,
          placeholder: 'Conflits importants, victoires, défaites...'
        },
        {
          name: 'historical_figures',
          label: 'Figures historiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rois, héros, traîtres, personnages marquants...'
        },
        {
          name: 'relations',
          label: 'Relations diplomatiques actuelles',
          type: 'textarea',
          rows: 3,
          placeholder: 'État des relations avec les pays voisins...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'country_images',
          label: 'Images du pays',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'flag', label: 'Drapeau' },
            { id: 'cities', label: 'Villes' },
            { id: 'landmarks', label: 'Sites remarquables' },
            { id: 'culture', label: 'Culture & Vie' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ (CONSERVÉ)
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'gm_secrets_country',
          label: 'Secrets du pays',
          type: 'textarea',
          rows: 4,
          placeholder: 'Complots, secrets d\'État, vérités cachées...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Notes supplémentaires pour le MJ...'
        }
      ]
    }
  ]
};

const listFilters = [
  { key: 'world_id', label: 'Monde', type: 'relation', relationTable: 'worlds' },
  { key: 'continent_id', label: 'Continent', type: 'relation', relationTable: 'continents' },
  { key: 'ocean_id', label: 'Océan/Mer', type: 'relation', relationTable: 'oceans' }
];

export default function CountriesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleView = (item) => {
    setSelectedItem(item);
  };

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
    if (!selectedItem || !confirm('Êtes-vous sûr de vouloir supprimer ce pays ?')) return;

    const { supabase } = await import('../lib/supabase');
    await supabase.from('countries').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="countries"
        title="Pays"
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
        filters={listFilters}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={handleDelete}
        item={selectedItem}
        config={countriesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={countriesConfig}
      />
    </>
  );
}