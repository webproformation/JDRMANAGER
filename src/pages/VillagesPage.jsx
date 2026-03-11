import { useState, useEffect } from 'react';
import { Home, Info, Map, Users, Building, ImageIcon, Shield, DollarSign } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther'; 
import VTTDialog from '../components/VTTDialog'; // Import du dialogue Prestige
import VillageLayout from '../components/EnhancedEntityDetail/layouts/VillageLayout'; 
import VillageForm from '../components/EnhancedEntityForm/layouts/VillageForm';     
import { DEFAULT_RULESETS } from '../data/rulesets'; 
import { supabase } from '../lib/supabase';

const villagesConfig = {
  entityName: 'le village',
  tableName: 'villages',
  title: 'Villages',
  getHeaderIcon: () => Home,
  getHeaderColor: () => 'from-green-600/30 via-teal-500/20 to-emerald-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_geo', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => {
            const data = props.formData || props.item;
            if (!data) return null;
            return (
              <RulesetDynamicFields 
                rulesetId={data.ruleset_id} 
                entityType="geo" 
                formData={data} 
                onChange={props.onChange} 
                readOnly={props.readOnly}
                setFormData={props.setFormData}
              />
            );
          }
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
          type: 'image'
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
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Map,
      fields: [
        {
          name: 'area',
          label: 'Taille',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Hameau (quelques feux)', 'Petit village', 'Gros bourg rural', 'Village fortifié', 'Halte isolée de caravanes']} 
            />
          )
        },
        {
          name: 'exact_location',
          label: 'Emplacement exact',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Près d\'une rivière', 'Dans une clairière', 'Flanc de montagne', 'Bord de mer', 'Carrefour de routes', 'Au fond d\'une vallée']} 
            />
          )
        },
        {
          name: 'founded',
          label: 'Date de fondation',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Ère Antique', 'Avant la dernière guerre', 'Fondation récente (< 50 ans)', 'Âge d\'Or des Fondateurs']} 
            />
          )
        },
        {
          name: 'architecture',
          label: 'Style architectural',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Chaumières en bois', 'Maisons de pierre sèche', 'Style rustique', 'Habitations troglodytes', 'Architecture sur pilotis']} 
            />
          )
        },
        {
          name: 'water_supply',
          label: 'Approvisionnement en eau',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Puits communal', 'Rivière adjacente', 'Source sacrée', 'Citerne de pluie', 'Ruisseau de montagne']} 
            />
          )
        },
        {
          name: 'sanitation',
          label: 'Assainissement',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Inexistant', 'Canaux à ciel ouvert', 'Fosses sceptiques', 'Ruisseau évacuateur']} 
            />
          )
        }
      ]
    },
    {
      id: 'places',
      label: 'Lieux & Quartiers',
      icon: Building,
      fields: [
        {
          name: 'landmarks',
          label: 'Points remarquables',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Vieux chêne central', 'Grand puits', 'Statue locale', 'Moulin à vent/eau', 'Ruines du vieux fort', 'Le grand pont']} 
            />
          )
        },
        {
          name: 'temples',
          label: 'Temples & Sanctuaires',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Petite chapelle', 'Autel de la moisson', 'Temple du Dieu-Père', 'Cercle de pierres', 'Oratoire de quartier']} 
            />
          )
        },
        {
          name: 'guildhalls',
          label: 'Halls de guildes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Halle des agriculteurs', 'Forge communale', 'Cercle des chasseurs', 'Maison des tisserands']} 
            />
          )
        },
        {
          name: 'markets',
          label: 'Marchés',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Marché hebdomadaire', 'Foire saisonnière', 'Commerce direct chez l\'habitant']} 
            />
          )
        },
        {
          name: 'taverns_inns',
          label: 'Auberges & Tavernes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['L\'Auberge du Voyageur', 'Le Repos du Laboureur', 'La Chope de Bois', 'Le Gîte Communal']} 
            />
          )
        }
      ]
    },
    {
      id: 'society',
      label: 'Société & Habitants',
      icon: Users,
      fields: [
        {
          name: 'demographics',
          label: 'Habitants (Groupes)',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Agriculteurs', 'Pêcheurs', 'Bûcherons', 'Artisans ruraux', 'Réfugiés de guerre', 'Familles fondatrices']} 
            />
          )
        },
        {
          name: 'population',
          label: 'Population (Nombre)',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Moins de 50 habitants', '50 à 200 habitants', '200 à 500 habitants', 'Hameau isolé']} 
            />
          )
        },
        {
          name: 'government',
          label: 'Type de gouvernement',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Conseil des anciens', 'Maire', 'Chef de village', 'Seigneur local', 'Théocratie villageoise']} 
            />
          )
        },
        {
          name: 'social_classes',
          label: 'Classes sociales',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Propriétaires terriens / Ouvriers', 'Système féodal direct', 'Égalitarisme rural']} 
            />
          )
        },
        {
          name: 'crime_rate',
          label: 'Criminalité',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Nulle (tout le monde se connaît)', 'Bagarres de taverne', 'Vols de bétail fréquents', 'Infiltré par des bandits']} 
            />
          )
        },
        {
          name: 'factions',
          label: 'Factions',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['La famille dominante', 'Le clergé local', 'La milice villageoise', 'Les anciens']} 
            />
          )
        }
      ]
    },
    {
      id: 'economy_tab',
      label: 'Économie & Butins',
      icon: DollarSign,
      fields: [
        {
          name: 'economy',
          label: 'Économie générale',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Agriculture', 'Pêche', 'Artisanat rural', 'Élevage', 'Exploitation forestière']} 
            />
          )
        },
        {
          name: 'treasures',
          label: 'Trésors potentiels',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Héritage familial', 'Relique religieuse', 'Cache de bandits', 'Trésor enterré', 'Stock de matières premières']} 
            />
          )
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
          render: () => null,
          categories: [
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'buildings', label: 'Bâtiments' },
            { id: 'people', label: 'Habitants' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'dangers',
          label: 'Dangers locaux',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Loups affamés', 'Bandits de grand chemin', 'Inondations fréquentes', 'Culte occulte caché', 'Créatures de la forêt']} 
            />
          )
        },
        {
          name: 'gm_secrets_village',
          label: 'Secrets du village',
          type: 'textarea',
          rows: 4
        },
        {
          name: 'history',
          label: 'Histoire',
          type: 'textarea',
          rows: 3
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

  // ÉTAT POUR LE DIALOGUE DE SUPPRESSION PERSO
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  // --- LOGIQUE DE DEEP LINKING NATIVE ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase
          .from('villages')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data && !error) {
          if (viewId) {
            setSelectedItem(data);
          } else {
            setEditingItem(data);
            setShowForm(true);
          }
        }
      };
      fetchInitialItem();
    }
  }, []);

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view');
    url.searchParams.delete('edit');
    window.history.replaceState({}, '', url);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowForm(false);
    setEditingItem(null);
    cleanURL();
  };

  // LOGIQUE DE SUPPRESSION PRESTIGE
  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    const { error } = await supabase.from('villages').delete().eq('id', item.id);
    if (!error) {
      handleClose();
      setRefreshKey(prev => prev + 1);
    } else {
      console.error("Erreur de suppression :", error);
    }
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Rayer le Village"
        message={`Voulez-vous vraiment effacer ${deleteConfirm.item?.name} ? Les quelques âmes qui y vivent seront oubliées par l'Histoire.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="villages"
        title="Villages"
        icon={Home} // RÉPARÉ : Ajout de l'icône obligatoire
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
        onDelete={openDeleteDialog}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => {
          setEditingItem(selectedItem);
          setSelectedItem(null);
          setShowForm(true);
        }}
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem}
        config={villagesConfig}
        customLayout={VillageLayout}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={villagesConfig}
        customForm={VillageForm}
      />
    </>
  );
}