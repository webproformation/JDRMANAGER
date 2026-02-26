import { useState } from 'react';
import { Globe, Info, Map, Sparkles, Zap, Image as ImageIcon, Shield, BookOpen, Users, Cloud, Clock } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import WorldClockControl from '../components/WorldClockControl'; 
import CalendarConfigEditor from '../components/CalendarConfigEditor';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // L'injecteur dynamique
import { DEFAULT_RULESETS } from '../data/rulesets'; // Les définitions de systèmes

// Configuration complète pour les Mondes
const worldsConfig = {
  entityName: 'le monde',
  tableName: 'worlds',
  title: 'Mondes',
  getHeaderIcon: () => Globe,
  getHeaderColor: () => 'from-blue-500/30 via-purple-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // DÉFINITION DU SYSTÈME MAÎTRE DU MONDE
          label: 'Système de Règles Majeur',
          type: 'select',
          required: true,
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_rules', // INJECTEUR DYNAMIQUE DES CHAMPS SYSTÈME
          label: 'Configuration du Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="world" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du monde',
          type: 'text',
          required: true,
          placeholder: 'Ex: Terrae, Aethel, Khorval...'
        },
        {
          name: 'image_url',
          label: 'Image principale',
          type: 'image',
          description: 'Carte ou représentation visuelle du monde'
        },
        {
          name: 'subtitle',
          label: 'Sous-titre / Surnom',
          type: 'text',
          placeholder: 'Ex: Le Monde Brisé, Terre des Anciens...'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Histoire, cosmologie, caractéristiques principales...'
        },
        {
          name: 'creation_myth',
          label: 'Mythe de création',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment ce monde a-t-il été créé selon les légendes ?'
        },
        {
          name: 'age',
          label: 'Âge du monde',
          type: 'text',
          placeholder: 'Ex: 10 000 ans, Millénaire, Éternel...'
        }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie & Climat',
      icon: Map,
      fields: [
        {
          name: 'size',
          label: 'Taille',
          type: 'select',
          options: [
            { value: 'small', label: 'Petit (comme la Lune)' },
            { value: 'earth_like', label: 'Terrestre (comme la Terre)' },
            { value: 'large', label: 'Grand (comme Jupiter)' },
            { value: 'continent', label: 'Continent unique' },
            { value: 'archipelago', label: 'Archipel' },
            { value: 'infinite', label: 'Plan infini' }
          ]
        },
        {
          name: 'shape',
          label: 'Forme',
          type: 'select',
          options: [
            { value: 'sphere', label: 'Sphérique' },
            { value: 'flat', label: 'Plate' },
            { value: 'disc', label: 'Disque' },
            { value: 'cylinder', label: 'Cylindrique' },
            { value: 'irregular', label: 'Irrégulière' },
            { value: 'floating_islands', label: 'Îles flottantes' }
          ]
        },
        {
          name: 'climate',
          label: 'Climat général',
          type: 'select',
          options: [
            { value: 'tropical', label: 'Tropical' },
            { value: 'temperate', label: 'Tempéré' },
            { value: 'arctic', label: 'Arctique' },
            { value: 'desert', label: 'Désertique' },
            { value: 'varied', label: 'Varié' },
            { value: 'extreme', label: 'Extrême' },
            { value: 'magical', label: 'Magique/Instable' }
          ]
        },
        {
          name: 'terrain_types',
          label: 'Types de terrains',
          type: 'textarea',
          rows: 3,
          placeholder: 'Ex: Montagnes, forêts, déserts, marais, toundra...'
        },
        {
          name: 'natural_wonders',
          label: 'Merveilles naturelles',
          type: 'textarea',
          rows: 3,
          placeholder: 'Lieux extraordinaires, phénomènes naturels uniques...'
        },
        {
          name: 'natural_disasters',
          label: 'Catastrophes naturelles',
          type: 'textarea',
          rows: 2,
          placeholder: 'Tempêtes magiques, tremblements de terre, éruptions...'
        }
      ]
    },
    {
      id: 'magic',
      label: 'Magie, Cosmologie & Calendrier',
      icon: Sparkles,
      fields: [
        {
          name: 'calendar_config', // CONSERVÉ : MOTEUR DE CALENDRIER
          label: 'Configuration du Temps Mondial',
          type: 'custom',
          component: CalendarConfigEditor
        },
        {
          name: 'magic_level',
          label: 'Niveau de magie',
          type: 'select',
          required: true,
          options: [
            { value: 'none', label: 'Aucune magie' },
            { value: 'low', label: 'Magie rare et mystérieuse' },
            { value: 'medium', label: 'Magie courante' },
            { value: 'high', label: 'Magie omniprésente' },
            { value: 'very_high', label: 'Monde hautement magique' },
            { value: 'wild_magic', label: 'Magie sauvage/instable' }
          ]
        },
        {
          name: 'magic_source',
          label: 'Source de la magie',
          type: 'textarea',
          rows: 3,
          placeholder: 'D\'où vient la magie ? Ley lines, dieux, énergie cosmique...'
        },
        {
          name: 'magic_schools',
          label: 'Écoles de magie',
          type: 'textarea',
          rows: 3,
          placeholder: 'Traditions magiques, types de magie pratiqués...'
        },
        {
          name: 'planar_connections',
          label: 'Connexions planaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Plans d\'existence connectés, portails, rifts...'
        },
        {
          name: 'cosmology',
          label: 'Cosmologie',
          type: 'textarea',
          rows: 4,
          placeholder: 'Structure de l\'univers, plans d\'existence, monde des morts...'
        },
        {
          name: 'magical_phenomena',
          label: 'Phénomènes magiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Aurores magiques, zones de magie morte, tempêtes éthérées...'
        }
      ]
    },
    {
      id: 'civilization',
      label: 'Civilisation & Technologie',
      icon: Users,
      fields: [
        {
          name: 'technology_level',
          label: 'Niveau technologique',
          type: 'select',
          options: [
            { value: 'stone_age', label: 'Âge de pierre' },
            { value: 'bronze_age', label: 'Âge du bronze' },
            { value: 'iron_age', label: 'Âge du fer' },
            { value: 'medieval', label: 'Médiéval' },
            { value: 'renaissance', label: 'Renaissance' },
            { value: 'industrial', label: 'Industriel' },
            { value: 'modern', label: 'Moderne' },
            { value: 'futuristic', label: 'Futuriste' },
            { value: 'mixed', label: 'Mixte' },
            { value: 'magitech', label: 'Magitech' }
          ]
        },
        {
          name: 'population',
          label: 'Population totale',
          type: 'text',
          placeholder: 'Ex: 10 millions, Inconnue...'
        },
        {
          name: 'dominant_races',
          label: 'Races dominantes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Humains, Elfes, Nains, Dragons...'
        },
        {
          name: 'major_civilizations',
          label: 'Civilisations majeures',
          type: 'textarea',
          rows: 3,
          placeholder: 'Empires, royaumes, fédérations...'
        },
        {
          name: 'languages',
          label: 'Langages principaux',
          type: 'textarea',
          rows: 2,
          placeholder: 'Commun, Elfique, Draconique...'
        },
        {
          name: 'currencies',
          label: 'Monnaies',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pièces d\'or, cristaux, système d\'échange...'
        },
        {
          name: 'trade_routes',
          label: 'Routes commerciales',
          type: 'textarea',
          rows: 2,
          placeholder: 'Routes maritimes, caravanes, portails commerciaux...'
        }
      ]
    },
    {
      id: 'history',
      label: 'Histoire & Chronologie',
      icon: BookOpen,
      fields: [
        {
          name: 'time_engine', // CONSERVÉ : HORLOGE INTERACTIVE
          label: 'Contrôle de l\'Horloge Mondiale',
          type: 'custom',
          component: ({ formData, onUpdate }) => <WorldClockControl world={formData} onUpdate={onUpdate} />
        },
        {
          name: 'current_era',
          label: 'Ère actuelle',
          type: 'text',
          placeholder: 'Ex: Ère du Dragon, Quatrième Âge...'
        },
        {
          name: 'major_historical_events',
          label: 'Événements historiques majeurs',
          type: 'textarea',
          rows: 5,
          placeholder: 'Guerres, cataclysmes, fondations d\'empires...'
        },
        {
          name: 'ancient_civilizations',
          label: 'Civilisations anciennes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Empires disparus, races éteintes...'
        },
        {
          name: 'prophecies',
          label: 'Prophéties et légendes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Prophéties connues, légendes importantes...'
        },
        {
          name: 'current_conflicts',
          label: 'Conflits actuels',
          type: 'textarea',
          rows: 3,
          placeholder: 'Guerres en cours, tensions politiques...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'world_images',
          label: 'Images du monde',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'maps', label: 'Cartes' },
            { id: 'landscapes', label: 'Paysages' },
            { id: 'cities', label: 'Cités' },
            { id: 'landmarks', label: 'Monuments' }
          ]
        }
      ]
    },
    {
      id: 'gm', // HARMONISÉ EN 'gm' POUR LA SÉCURITÉ MJ
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'gm_secrets',
          label: 'Secrets du monde',
          type: 'textarea',
          rows: 4,
          placeholder: 'Vérités cachées, complots, informations secrètes...'
        },
        {
          name: 'gm_plot_hooks',
          label: 'Accroches d\'aventure',
          type: 'textarea',
          rows: 4,
          placeholder: 'Idées de quêtes, scénarios possibles...'
        },
        {
          name: 'gm_future_events',
          label: 'Événements futurs',
          type: 'textarea',
          rows: 3,
          placeholder: 'Ce qui va arriver, plans à long terme...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 4,
          placeholder: 'Règles spéciales, particularités, rappels...'
        }
      ]
    }
  ]
};

export default function WorldsPage() {
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
    if (!selectedItem || !window.confirm('Êtes-vous sûr de vouloir supprimer ce monde ?')) return;

    const { supabase } = await import('../lib/supabase');
    await supabase.from('worlds').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="worlds"
        title="Mondes"
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
        config={worldsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={worldsConfig}
      />
    </>
  );
}