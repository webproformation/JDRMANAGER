import { useState } from 'react';
import { Users, Info, User, Landmark, BookOpen, Sparkles, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const racesConfig = {
  entityName: 'la race',
  tableName: 'races',
  title: 'Races',
  getHeaderIcon: () => Users,
  getHeaderColor: () => 'from-amber-500/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la race',
          type: 'text',
          required: true,
          placeholder: 'Ex: Elfes, Nains, Humains...'
        },
        {
          name: 'subtitle',
          label: 'Surnom ou appellation commune',
          type: 'text',
          placeholder: 'Ex: Enfants des étoiles, Peuple de la montagne...'
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
          description: 'Portrait représentatif de la race'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Description générale de la race, son histoire, sa place dans le monde...'
        }
      ]
    },
    {
      id: 'physical',
      label: 'Traits physiques',
      icon: User,
      fields: [
        {
          name: 'size',
          label: 'Catégorie de taille',
          type: 'select',
          required: true,
          options: [
            { value: 'Très Petit', label: 'Très Petit (TP)' },
            { value: 'Petit', label: 'Petit (P)' },
            { value: 'Moyen', label: 'Moyen (M)' },
            { value: 'Grand', label: 'Grand (G)' },
            { value: 'Très Grand', label: 'Très Grand (TG)' }
          ]
        },
        {
          name: 'height_range',
          label: 'Gamme de taille',
          type: 'text',
          placeholder: 'Ex: 1,50m à 1,80m'
        },
        {
          name: 'weight_range',
          label: 'Gamme de poids',
          type: 'text',
          placeholder: 'Ex: 50 à 80 kg'
        },
        {
          name: 'lifespan',
          label: 'Durée de vie',
          type: 'text',
          placeholder: 'Ex: 80 ans, 750 ans, éternelle...'
        },
        {
          name: 'age',
          label: 'Âge & Maturité',
          type: 'text',
          placeholder: 'Ex: Maturité à 20 ans, vieillesse à 60 ans...',
          required: true
        },
        {
          name: 'physical_description',
          label: 'Description physique détaillée',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, traits distinctifs, variations physiques, dimorphisme sexuel...'
        },
        {
          name: 'speed',
          label: 'Vitesse de déplacement',
          type: 'text',
          placeholder: 'Ex: 9 mètres (30 pieds)',
          required: true
        }
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Société',
      icon: Landmark,
      fields: [
        {
          name: 'alignment',
          label: 'Alignement typique',
          type: 'text',
          placeholder: 'Tendances morales et philosophiques courantes...'
        },
        {
          name: 'cultural_traits',
          label: 'Traits culturels',
          type: 'textarea',
          rows: 4,
          placeholder: 'Valeurs, traditions, coutumes, art, musique...'
        },
        {
          name: 'society_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Organisation sociale, hiérarchie, gouvernement, classes...'
        },
        {
          name: 'naming_conventions',
          label: 'Conventions de nommage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment sont nommés les individus, noms de famille, titres...'
        },
        {
          name: 'religion_practices',
          label: 'Pratiques religieuses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Divinités vénérées, rituels, croyances spirituelles...'
        },
        {
          name: 'languages',
          label: 'Langues parlées',
          type: 'text',
          placeholder: 'Ex: Commun, Elfique, Nain...',
          required: true
        }
      ]
    },
    {
      id: 'homeland',
      label: 'Territoires & Relations',
      icon: BookOpen,
      fields: [
        {
          name: 'homeland',
          label: "Terre d'origine",
          type: 'textarea',
          rows: 3,
          placeholder: 'Région, continent, environnement d\'origine de la race...'
        },
        {
          name: 'settlements',
          label: 'Colonies & Établissements',
          type: 'textarea',
          rows: 3,
          placeholder: 'Types de cités, villages, style architectural typique...'
        },
        {
          name: 'relations_with_other_races',
          label: 'Relations avec les autres races',
          type: 'textarea',
          rows: 5,
          placeholder: 'Alliés, ennemis, tensions, échanges commerciaux et culturels...'
        },
        {
          name: 'famous_members',
          label: 'Membres célèbres',
          type: 'textarea',
          rows: 3,
          placeholder: 'Héros, leaders, personnages historiques de cette race...'
        }
      ]
    },
    {
      id: 'abilities',
      label: 'Capacités & Traits',
      icon: Sparkles,
      fields: [
        {
          name: 'ability_score_increase',
          label: 'Augmentation de caractéristiques',
          type: 'text',
          placeholder: 'Ex: +2 Dextérité, +1 Intelligence',
          required: true
        },
        {
          name: 'traits',
          label: 'Traits raciaux',
          type: 'textarea',
          rows: 6,
          placeholder: 'Vision dans le noir, résistances, compétences naturelles, sorts innés...',
          required: true
        },
        {
          name: 'racial_abilities',
          label: 'Capacités raciales spéciales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Pouvoirs innés, capacités magiques, talents naturels...'
        },
        {
          name: 'subraces',
          label: 'Sous-races & Variantes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Différentes ethnies, variantes régionales, leurs traits distinctifs...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'race_images',
          label: 'Images de la race',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'portraits', label: 'Portraits' },
            { id: 'variants', label: 'Variantes' },
            { id: 'culture', label: 'Culture & Vie' },
            { id: 'homeland', label: "Terres d'origine" }
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
          name: 'gm_secrets_race',
          label: 'Secrets raciaux',
          type: 'textarea',
          rows: 4,
          placeholder: 'Origines secrètes, pouvoirs cachés, complots raciaux...'
        }
      ]
    }
  ]
};

export default function RacesPage() {
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
    if (!selectedItem || !confirm('Êtes-vous sûr de vouloir supprimer cette race ?')) return;

    const { supabase } = await import('../lib/supabase');
    await supabase.from('races').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="races"
        title="Races"
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
        config={racesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={racesConfig}
      />
    </>
  );
}
