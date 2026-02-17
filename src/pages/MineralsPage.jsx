import { useState } from 'react';
import { Gem, Info, MapPin, Hammer, DollarSign, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const mineralsConfig = {
  entityName: 'le minéral',
  tableName: 'minerals',
  title: 'Minéraux',
  getHeaderIcon: () => Gem,
  getHeaderColor: () => 'from-violet-600/30 via-purple-500/20 to-fuchsia-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du minéral',
          type: 'text',
          required: true,
          placeholder: 'Nom du minéral ou de la pierre'
        },
        {
          name: 'subtitle',
          label: 'Nom alternatif ou surnom',
          type: 'text',
          placeholder: 'Ex: Pierre de lune, Cristal éternel...'
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
            { value: 'metal', label: 'Métal' },
            { value: 'gemstone', label: 'Pierre précieuse' },
            { value: 'crystal', label: 'Cristal' },
            { value: 'ore', label: 'Minerai' },
            { value: 'magical', label: 'Minéral magique' }
          ]
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          required: true,
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        {
          name: 'description',
          label: 'Description & Apparence',
          type: 'textarea',
          rows: 5,
          placeholder: 'Couleur, éclat, transparence, forme cristalline...'
        },
        {
          name: 'appearance',
          label: 'Aspect visuel',
          type: 'text',
          placeholder: 'Bleu azur, translucide avec veines dorées...'
        }
      ]
    },
    {
      id: 'location',
      label: 'Localisation & Formation',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Localisation',
          type: 'text',
          placeholder: 'Montagnes, grottes profondes, volcans, rivières...'
        },
        {
          name: 'formation',
          label: 'Formation géologique',
          type: 'text',
          placeholder: 'Activité volcanique, dépôts sédimentaires...'
        },
        {
          name: 'depth',
          label: 'Profondeur typique',
          type: 'text',
          placeholder: 'Surface, 50m de profondeur, grottes profondes...'
        },
        {
          name: 'associated_minerals',
          label: 'Minéraux associés',
          type: 'textarea',
          rows: 2,
          placeholder: 'Autres minéraux trouvés dans les mêmes gisements...'
        }
      ]
    },
    {
      id: 'extraction',
      label: 'Extraction & Traitement',
      icon: Hammer,
      fields: [
        {
          name: 'extraction_method',
          label: "Méthode d'extraction",
          type: 'textarea',
          rows: 3,
          placeholder: 'Minage, tamisage, collecte en surface...'
        },
        {
          name: 'extraction_difficulty',
          label: "Difficulté d'extraction",
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
        },
        {
          name: 'processing',
          label: 'Traitement requis',
          type: 'textarea',
          rows: 3,
          placeholder: 'Raffinage, taille, polissage, fusion...'
        },
        {
          name: 'tools_required',
          label: 'Outils nécessaires',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pics, marteaux, fours, outils spéciaux...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Info,
      fields: [
        {
          name: 'hardness',
          label: 'Dureté',
          type: 'text',
          placeholder: 'Échelle de Mohs : 1-10'
        },
        {
          name: 'weight',
          label: 'Poids par unité',
          type: 'text',
          placeholder: '0.5 kg, 2 kg...'
        },
        {
          name: 'properties',
          label: 'Propriétés physiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Conductivité, résistance, malléabilité...'
        },
        {
          name: 'magical_properties',
          label: 'Propriétés magiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Amplification magique, protection, channeling...'
        },
        {
          name: 'special_properties',
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 2,
          placeholder: 'Luminescence, radioactivité, réactivité...'
        },
        {
          name: 'dangers',
          label: 'Dangers & Précautions',
          type: 'textarea',
          rows: 2,
          placeholder: 'Radioactif, toxique, instable...'
        }
      ]
    },
    {
      id: 'uses',
      label: 'Utilisations & Valeur',
      icon: DollarSign,
      fields: [
        {
          name: 'uses',
          label: 'Utilisations',
          type: 'textarea',
          rows: 4,
          placeholder: 'Forge d\'armes, bijouterie, alchimie, enchantements...'
        },
        {
          name: 'crafting_uses',
          label: 'Utilisation en artisanat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Objets magiques, armures, armes, bijoux...'
        },
        {
          name: 'market_value',
          label: 'Valeur marchande',
          type: 'text',
          placeholder: '10 po, 100 po, 1000 po...'
        },
        {
          name: 'value_factors',
          label: 'Facteurs de valeur',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pureté, taille, qualité, rareté locale...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'mineral_images',
          label: 'Images du minéral',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'Brut' },
            { id: 'cut', label: 'Taillé' },
            { id: 'deposit', label: 'Gisement' },
            { id: 'uses', label: 'Utilisations' }
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
          name: 'lore',
          label: 'Histoire & Légendes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mythes, légendes, découvertes historiques...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Informations supplémentaires...'
        }
      ]
    }
  ]
};

export default function MineralsPage() {
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
    if (!selectedItem || !confirm('Supprimer ce minéral ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('minerals').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="minerals"
        title="Minéraux"
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
        config={mineralsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={mineralsConfig}
      />
    </>
  );
}
