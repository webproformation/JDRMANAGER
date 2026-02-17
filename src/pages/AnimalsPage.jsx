import { useState } from 'react';
import { PawPrint, Info, Heart, MapPin, Sparkles, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const animalsConfig = {
  entityName: "l'animal",
  tableName: 'animals',
  title: 'Animaux',
  getHeaderIcon: () => PawPrint,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: "Nom de l'animal",
          type: 'text',
          required: true,
          placeholder: 'Ex: Loup des neiges, Aigle royal...'
        },
        {
          name: 'subtitle',
          label: 'Nom scientifique ou surnom',
          type: 'text',
          placeholder: 'Ex: Canis lupus nivalis, Chasseur silencieux...'
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
            { value: 'mammal', label: 'Mammifère' },
            { value: 'bird', label: 'Oiseau' },
            { value: 'reptile', label: 'Reptile' },
            { value: 'amphibian', label: 'Amphibien' },
            { value: 'fish', label: 'Poisson' },
            { value: 'insect', label: 'Insecte' },
            { value: 'magical', label: 'Créature magique' }
          ]
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'select',
          required: true,
          options: [
            { value: 'Minuscule', label: 'Minuscule' },
            { value: 'Très Petit', label: 'Très Petit' },
            { value: 'Petit', label: 'Petit' },
            { value: 'Moyen', label: 'Moyen' },
            { value: 'Grand', label: 'Grand' },
            { value: 'Très Grand', label: 'Très Grand' },
            { value: 'Gigantesque', label: 'Gigantesque' }
          ]
        },
        {
          name: 'description',
          label: 'Description physique',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, traits distinctifs, coloration...'
        }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Habitat naturel',
          type: 'text',
          placeholder: 'Forêt, montagne, désert, marais, océan...'
        },
        {
          name: 'habitat_description',
          label: 'Description de l\'habitat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Environnement préféré, conditions de vie...'
        },
        {
          name: 'diet',
          label: 'Régime alimentaire',
          type: 'select',
          options: [
            { value: 'carnivore', label: 'Carnivore' },
            { value: 'herbivore', label: 'Herbivore' },
            { value: 'omnivore', label: 'Omnivore' },
            { value: 'insectivore', label: 'Insectivore' }
          ]
        },
        {
          name: 'diet_details',
          label: 'Détails alimentaires',
          type: 'textarea',
          rows: 2,
          placeholder: 'Proies préférées, plantes consommées...'
        },
        {
          name: 'lifespan',
          label: 'Durée de vie',
          type: 'text',
          placeholder: 'Ex: 5-10 ans, 50 ans...'
        },
        {
          name: 'reproduction',
          label: 'Reproduction',
          type: 'textarea',
          rows: 2,
          placeholder: 'Saison, portée, gestation...'
        }
      ]
    },
    {
      id: 'behavior',
      label: 'Comportement',
      icon: Heart,
      fields: [
        {
          name: 'behavior',
          label: 'Comportement général',
          type: 'textarea',
          rows: 4,
          placeholder: 'Agressif, territorial, pacifique, grégaire, solitaire...'
        },
        {
          name: 'social_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 3,
          placeholder: 'Solitaire, meute, troupeau, colonie...'
        },
        {
          name: 'intelligence',
          label: 'Intelligence',
          type: 'text',
          placeholder: 'Ex: Rudimentaire, moyenne, élevée...'
        },
        {
          name: 'temperament',
          label: 'Tempérament',
          type: 'text',
          placeholder: 'Ex: Docile, agressif, craintif, curieux...'
        }
      ]
    },
    {
      id: 'uses',
      label: 'Utilisations',
      icon: Sparkles,
      fields: [
        {
          name: 'domesticable',
          label: 'Domestication',
          type: 'select',
          options: [
            { value: 'yes', label: 'Domesticable' },
            { value: 'no', label: 'Non domesticable' },
            { value: 'difficult', label: 'Difficile' }
          ]
        },
        {
          name: 'rideable',
          label: 'Peut servir de monture',
          type: 'select',
          options: [
            { value: 'yes', label: 'Oui' },
            { value: 'no', label: 'Non' }
          ]
        },
        {
          name: 'uses',
          label: 'Utilisations & Ressources',
          type: 'textarea',
          rows: 4,
          placeholder: 'Monture, viande, fourrure, gardien, compagnon, ingrédients...'
        },
        {
          name: 'special_abilities',
          label: 'Capacités spéciales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Vol, vision nocturne, venin, carapace...'
        },
        {
          name: 'training_difficulty',
          label: 'Difficulté de dressage',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
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
          name: 'animal_images',
          label: "Images de l'animal",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'adult', label: 'Adulte' },
            { id: 'young', label: 'Jeune' },
            { id: 'habitat', label: 'Dans son habitat' },
            { id: 'variants', label: 'Variantes' }
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
          label: 'Notes & Écologie',
          type: 'textarea',
          rows: 4,
          placeholder: 'Rôle dans l\'écosystème, informations additionnelles...'
        }
      ]
    }
  ]
};

export default function AnimalsPage() {
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
    if (!selectedItem || !confirm('Supprimer cet animal ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('animals').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="animals"
        title="Animaux"
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
        config={animalsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={animalsConfig}
      />
    </>
  );
}
