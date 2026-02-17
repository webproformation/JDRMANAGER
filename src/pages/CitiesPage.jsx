import { useState } from 'react';
import { Building2, Info, Map, Users, DollarSign, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const citiesConfig = {
  entityName: 'la cité',
  tableName: 'cities',
  title: 'Cités',
  getHeaderIcon: () => Building2,
  getHeaderColor: () => 'from-slate-500/30 via-gray-500/20 to-zinc-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la cité',
          type: 'text',
          required: true,
          placeholder: 'Ex: Port Royal, Cité d\'Argent...'
        },
        {
          name: 'subtitle',
          label: 'Surnom',
          type: 'text',
          placeholder: 'Ex: La Perle du Nord, Cité des Mille Tours...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'country_id',
          label: 'Pays',
          type: 'relation',
          table: 'countries',
          filterBy: 'world_id',
          filterValue: 'world_id',
          placeholder: 'Sélectionner un pays'
        },
        {
          name: 'image_url',
          label: 'Image principale',
          type: 'image',
          description: 'Vue de la cité'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Ambiance, architecture, caractéristiques principales...'
        }
      ]
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Map,
      fields: [
        {
          name: 'area',
          label: 'Superficie',
          type: 'text',
          placeholder: 'Ex: 25 km²'
        },
        {
          name: 'founded',
          label: 'Date de fondation',
          type: 'text',
          placeholder: 'Ex: An 845, il y a 300 ans...'
        },
        {
          name: 'architecture',
          label: 'Style architectural',
          type: 'textarea',
          rows: 3,
          placeholder: 'Matériaux, styles, particularités architecturales...'
        },
        {
          name: 'defenses',
          label: 'Défenses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Murailles, tours, garnisons, gardes...'
        },
        {
          name: 'water_supply',
          label: 'Approvisionnement en eau',
          type: 'textarea',
          rows: 2,
          placeholder: 'Sources, aqueducs, puits, fontaines...'
        },
        {
          name: 'sanitation',
          label: 'Assainissement',
          type: 'textarea',
          rows: 2,
          placeholder: 'Égouts, gestion des déchets...'
        }
      ]
    },
    {
      id: 'districts',
      label: 'Quartiers & Lieux',
      icon: Building2,
      fields: [
        {
          name: 'districts',
          label: 'Quartiers',
          type: 'textarea',
          rows: 5,
          placeholder: 'Quartier marchand, noble, port, bas-fonds, artisans...'
        },
        {
          name: 'landmarks',
          label: 'Points de repère',
          type: 'textarea',
          rows: 3,
          placeholder: 'Monuments, statues, places célèbres...'
        },
        {
          name: 'temples',
          label: 'Temples & Sanctuaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Lieux de culte, temples majeurs...'
        },
        {
          name: 'guildhalls',
          label: 'Halls de guildes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Sièges des guildes marchandes, artisanales...'
        },
        {
          name: 'markets',
          label: 'Marchés',
          type: 'textarea',
          rows: 2,
          placeholder: 'Grand marché, marchés spécialisés...'
        },
        {
          name: 'inns_taverns',
          label: 'Auberges & Tavernes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Auberges célèbres, tavernes réputées...'
        },
        {
          name: 'notable_locations',
          label: 'Autres lieux notables',
          type: 'textarea',
          rows: 3,
          placeholder: 'Bibliothèques, académies, arènes, théâtres...'
        }
      ]
    },
    {
      id: 'society',
      label: 'Société & Gouvernance',
      icon: Users,
      fields: [
        {
          name: 'population',
          label: 'Population',
          type: 'text',
          placeholder: 'Ex: 50 000 habitants'
        },
        {
          name: 'demographics',
          label: 'Démographie',
          type: 'textarea',
          rows: 3,
          placeholder: 'Répartition des races, ethnies, origines...'
        },
        {
          name: 'government',
          label: 'Type de gouvernement',
          type: 'select',
          options: [
            { value: 'monarchy', label: 'Monarchie' },
            { value: 'democracy', label: 'Démocratie' },
            { value: 'oligarchy', label: 'Oligarchie' },
            { value: 'theocracy', label: 'Théocratie' },
            { value: 'council', label: 'Conseil' },
            { value: 'dictatorship', label: 'Dictature' },
            { value: 'anarchy', label: 'Anarchie' }
          ]
        },
        {
          name: 'social_classes',
          label: 'Classes sociales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Noblesse, marchands, artisans, paysans, esclaves...'
        },
        {
          name: 'crime_rate',
          label: 'Criminalité',
          type: 'text',
          placeholder: 'Ex: Élevée, modérée, faible'
        },
        {
          name: 'factions',
          label: 'Factions',
          type: 'textarea',
          rows: 4,
          placeholder: 'Guildes, organisations criminelles, factions politiques...'
        }
      ]
    },
    {
      id: 'economy',
      label: 'Économie',
      icon: DollarSign,
      fields: [
        {
          name: 'economy',
          label: 'Économie générale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Activités principales, richesse, commerce...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'city_images',
          label: 'Images de la cité',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'aerial', label: 'Vue aérienne' },
            { id: 'districts', label: 'Quartiers' },
            { id: 'landmarks', label: 'Monuments' },
            { id: 'life', label: 'Vie quotidienne' }
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
          name: 'gm_secrets_city',
          label: 'Secrets de la cité',
          type: 'textarea',
          rows: 4,
          placeholder: 'Intrigues, secrets, complots cachés...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Histoire, événements, notes...'
        }
      ]
    }
  ]
};

export default function CitiesPage() {
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
    if (!selectedItem || !confirm('Supprimer cette cité ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('cities').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="cities"
        title="Cités"
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
        config={citiesConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={citiesConfig}
      />
    </>
  );
}
