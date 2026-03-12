import { useState, useEffect } from 'react';
import { Building2, Info, Map, Users, DollarSign, ImageIcon, Shield, History, BookOpen } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther'; 
import CityLayout from '../components/EnhancedEntityDetail/layouts/CityLayout'; 
import CityForm from '../components/EnhancedEntityForm/layouts/CityForm';    
import VTTDialog from '../components/VTTDialog'; 
import { DEFAULT_RULESETS } from '../data/rulesets'; 
import { supabase } from '../lib/supabase';

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
                key={data.ruleset_id || 'city-init'}
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
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Moins de 1 km²', '1 à 5 km²', '5 à 15 km²', '15 à 30 km²', 'Mégalopole (> 50 km²)', 'S\'étend sur plusieurs niveaux']} 
            />
          )
        },
        {
          name: 'founded',
          label: 'Date de fondation (Texte)',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Ère Antique', 'Il y a plusieurs siècles', 'Fondation récente (< 50 ans)', 'Époque de la Grande Guerre', 'Âge d\'Or des Fondateurs', 'Inconnue / Perdue dans le temps']} 
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
              options={['Gothique flamboyant', 'Classique médiéval', 'Nain (Pierre taillée brute)', 'Elfe (Organique et élancé)', 'Brutaliste impérial', 'Renaissance tardive', 'Ruines réhabilitées']} 
            />
          )
        },
        {
          name: 'defenses',
          label: 'Défenses',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Hautes murailles de pierre', 'Fossés et ponts-levis', 'Garnison massive', 'Bouclier magique', 'Défense naturelle (Falaise/Mer)', 'Tours de guet enchantées', 'Labyrinthe de rues']} 
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
              options={['Puits locaux', 'Aqueducs antiques', 'Magie de l\'eau', 'Rivière proche', 'Citernes de pluie', 'Sources souterraines']} 
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
              options={['Égouts maçonnés', 'Magie de nettoyage', 'Collecte manuelle', 'Inexistant', 'Canaux à ciel ouvert']} 
            />
          )
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
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Quartier Marchand', 'Bas-fonds / Taudis', 'Cité Haute (Noblesse)', 'Quartier Artisanal', 'Port de commerce', 'Quartier Militaire', 'Quartier Académique', 'Quartier des Temples']} 
            />
          )
        },
        {
          name: 'landmarks',
          label: 'Points de repère',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Grande Place Centrale', 'Statue du Fondateur', 'Tour de l\'Horloge', 'Pont des Soupirs', 'Phare magistral', 'Arbre millénaire', 'Obélisque gravé']} 
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
              options={['Grande Cathédrale', 'Temple du Soleil', 'Sanctuaire de la Nature', 'Autel des Anciens', 'Temple de la Justice', 'Chapelles de quartier', 'Culte occulte caché']} 
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
              options={['Guilde des Marchands', 'Loge des Mages', 'Compagnie des Mercenaires', 'Cercle des Artisans', 'Guilde des Voleurs (Secrète)', 'Halle des Alchimistes']} 
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
              options={['Grand Bazar', 'Marché aux Bestiaux', 'Foire aux Épices', 'Marché Noir', 'Halle aux Poissons', 'Marché des Objets Magiques']} 
            />
          )
        },
        {
          name: 'inns_taverns',
          label: 'Auberges & Tavernes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['L\'Auberge du Repos', 'Le Dragon qui Fume', 'La Chope de Fer', 'Le Repaire du Loup', 'L\'Étoile du Matin', 'Le Coupe-Gorge']} 
            />
          )
        },
        {
          name: 'notable_locations',
          label: 'Autres lieux notables',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Grande Bibliothèque', 'Arène de combat', 'Académie de Magie', 'Bains Publics', 'Archives Royales', 'Observatoire d\'astronomie', 'Jardin Botanique']} 
            />
          )
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
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Petite bourgade (< 5 000)', 'Cité moyenne (5k-20k)', 'Grande cité (20k-70k)', 'Métropole (100k+)', 'Population fluctuante', 'Quasiment déserte']} 
            />
          )
        },
        {
          name: 'demographics',
          label: 'Démographie',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Majorité Humaine', 'Cosmopolite (Toutes races)', 'Majorité Naine', 'Majorité Elfe', 'Fort brassage ethnique', 'Minorités persécutées']} 
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
              options={['Monarchie', 'Démocratie directe', 'Oligarchie marchande', 'Théocratie', 'Conseil des Pairs', 'Dictature', 'Anarchie', 'Magocratie']} 
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
              options={['Aristocratie / Bourgeoisie / Peuple', 'Système de Castes strict', 'Égalitarisme', 'Maîtres et Esclaves', 'Féodalité classique', 'Classes basées sur le mérite']} 
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
              options={['Quasiment nulle', 'Faible', 'Modérée', 'Élevée', 'Critique (Zone de non-droit)']} 
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
              options={['La Garde de la Ville', 'Le Conseil des Marchands', 'Le Culte de l\'Ombre', 'L\'Alliance des Mages', 'Le Syndicat du Crime', 'Les Loyalistes Royaux']} 
            />
          )
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
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Commerce maritime', 'Agriculture de subsistance', 'Exploitation minière', 'Plaque tournante financière', 'Artisanat de luxe', 'Production de guerre', 'Tourisme magique']} 
            />
          )
        }
      ]
    },
    // ==========================================================
    // NOUVEL ONGLET HISTOIRE (Moteur V4.2)
    // ==========================================================
    {
      id: 'history',
      label: 'Histoire & Chronologie',
      icon: History,
      fields: [
        { 
          name: 'historical_chronicle', 
          label: 'Chronique de la Cité', 
          type: 'world_history_editor',
          entityType: 'city', // On lie les événements à l'entité cité
          isVirtual: true     // Composant autonome gérant ses propres sauvegardes
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
      id: 'gm', 
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

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view');
    const editId = urlParams.get('edit');
    if (viewId || editId) {
      const targetId = viewId || editId;
      const fetchItem = async () => {
        const { data } = await supabase.from('cities').select('*').eq('id', targetId).single();
        if (data) { 
          if (editId) { setEditingItem(data); setShowForm(true); } 
          else { setSelectedItem(data); }
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      fetchItem();
    }
  }, []);

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

  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    const { error } = await supabase.from('cities').delete().eq('id', item.id);
    if (!error) {
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    }
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Démolir la Cité"
        message={`Êtes-vous certain de vouloir rayer définitivement ${deleteConfirm.item?.name} de la carte ? Cette action est irréversible.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

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
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem}
        config={citiesConfig}
        customLayout={CityLayout}
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
        customForm={CityForm}
      />
    </>
  );
}