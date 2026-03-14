import { useState, useEffect } from 'react';
import { Mountain, Info, Map, Leaf, Users, BookOpen, Image as ImageIcon, Shield, Layers, History } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import MultiRelationSelector from '../components/MultiRelationSelector';
import EntityChildCards from '../components/EntityChildCards';
import VTTDialog from '../components/VTTDialog'; 
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
      id: 'history',
      label: 'Histoire',
      icon: History,
      fields: [
        { 
          name: 'historical_chronicle', 
          label: 'Chronique des Temps', 
          type: 'world_history_editor',
          entityType: 'continent', 
          isVirtual: true 
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

export default function ContinentsPage({ activeRuleset, activeWorldId }) {
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
          cleanURL();
        }
      };
      fetchItemFromUrl();
    }
  }, []);

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  const handleView = (item) => setSelectedItem(item);
  
  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedItem(null);
    setShowForm(true);
  };
  
  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Auto-remplissage du ruleset ET du monde actif [cite: 2026-03-11]
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };
  
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const openDeleteDialog = (item) => setDeleteConfirm({ isOpen: true, item });

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;
    await supabase.from('continents').delete().eq('id', item.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
    setDeleteConfirm({ isOpen: false, item: null });
    cleanURL();
  };

  return (
    // CORRECTIF V4.3 : Padding-bottom pour la navigation mobile, h-full pour le scroll
    <div className="pb-24 md:pb-0 h-full">
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Effacer le Continent"
        message={`Souhaitez-vous vraiment supprimer définitivement ${deleteConfirm.item?.name} ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="continents"
        title="Continents"
        icon={Mountain} 
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => { setSelectedItem(null); cleanURL(); }}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem}
        config={continentsConfig}
      />
      
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
          cleanURL();
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={continentsConfig}
      />
    </div>
  );
}