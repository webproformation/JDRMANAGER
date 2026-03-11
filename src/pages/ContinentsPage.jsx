import { useState, useEffect } from 'react';
import { Mountain, Info, Map, Leaf, Users, BookOpen, Image as ImageIcon, Shield, Layers } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import MultiRelationSelector from '../components/MultiRelationSelector';
import EntityChildCards from '../components/EntityChildCards';
import VTTDialog from '../components/VTTDialog'; // Import du dialogue Prestige
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

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
                key={data.ruleset_id || 'dnd5'} 
                rulesetId={data.ruleset_id} 
                entityType="geo" 
                formData={data} 
                setFormData={props.setFormData} 
                onChange={props.onChange} 
                readOnly={props.readOnly}
              />
            );
          }
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
          type: 'custom',
          component: (props) => <MultiSelectWithOther {...props} options={['Tropical', 'Tempéré', 'Arctique', 'Désertique', 'Méditerranéen', 'Varié']} />
        },
        {
          name: 'terrain_description',
          label: 'Description du terrain',
          type: 'custom',
          component: (props) => <MultiSelectWithOther {...props} options={['Toundra', 'Taïga', 'Forêts tempérées', 'Jungles', 'Plaines', 'Steppes', 'Savanes', 'Déserts de sable', 'Montagnes rocheuses', 'Volcans', 'Marais']} />
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
          type: 'custom',
          component: (props) => <MultiSelectWithOther {...props} options={['Or', 'Argent', 'Fer', 'Cuivre', 'Acier', 'Mithral', 'Adamantium', 'Bois précieux', 'Épices', 'Cristaux magiques', 'Bétail', 'Céréales']} />
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
          type: 'custom',
          component: (props) => <MultiSelectWithOther {...props} options={['Très Faible (Sauvage)', 'Faible (Éparse)', 'Moyenne', 'Forte', 'Très Forte (Surpeuplé)']} />
        },
        {
          name: 'cultures',
          label: 'Cultures présentes',
          type: 'custom',
          component: (props) => <MultiSelectWithOther {...props} options={['Tribale', 'Nomade', 'Féodale', 'Marchande', 'Impériale', 'Théocratique', 'Barbare']} />
        },
        {
          name: 'languages_spoken',
          label: 'Langues parlées',
          type: 'custom',
          component: (props) => <MultiRelationSelector {...props} table="languages" />
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
      id: 'countries',
      label: 'Pays',
      icon: Layers,
      fields: [
        { 
          name: 'continent_countries', 
          label: 'Cartes des Pays', 
          type: 'custom', 
          isVirtual: true, 
          component: (props) => {
            const currentId = props.formData?.id || props.item?.id;
            return (
              <EntityChildCards 
                parentId={currentId} 
                childTable="countries" 
                parentKey="continent_id" 
                childRoute="countries" 
                readOnly={props.readOnly} 
              />
            );
          }
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
      id: 'gm', 
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

  // ÉTAT POUR LE DIALOGUE DE SUPPRESSION PERSO
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view');
    const editId = urlParams.get('edit'); 
    
    if (viewId || editId) {
      const targetId = viewId || editId;
      const fetchItemFromUrl = async () => {
        const { data, error } = await supabase
          .from('continents')
          .select('*')
          .eq('id', targetId)
          .single();
          
        if (data && !error) {
          if (editId) {
             setEditingItem(data);
             setShowForm(true);
          } else {
             setSelectedItem(data); 
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      fetchItemFromUrl();
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

  // LOGIQUE DE SUPPRESSION PRESTIGE
  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    await supabase.from('continents').delete().eq('id', item.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Effacer le Continent"
        message={`Souhaitez-vous vraiment supprimer définitivement ${deleteConfirm.item?.name} ? Les pays et cités rattachés pourraient devenir orphelins.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

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
        onDelete={() => openDeleteDialog(selectedItem)} // Utilisation du VTTDialog
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