import { useState, useEffect } from 'react';
import { Waves, Info, Compass, Shield, Anchor, Map, ImageIcon, Skull, Thermometer, Eye, Droplets } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog'; 
import OceanLayout from '../components/EnhancedEntityDetail/layouts/OceanLayout'; 
import OceanForm from '../components/EnhancedEntityForm/layouts/OceanForm';     
import { DEFAULT_RULESETS } from '../data/rulesets';
import { supabase } from '../lib/supabase';

const oceansConfig = {
  entityName: "l'océan",
  tableName: 'oceans',
  title: 'Océans & Mers',
  getHeaderIcon: () => Waves,
  getHeaderColor: () => 'from-blue-600/30 via-cyan-500/20 to-indigo-500/30',

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
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
  name: 'dynamic_geo', 
  label: 'Propriétés Système',
  type: 'custom',
  isVirtual: true, // CETTE LIGNE EST INDISPENSABLE
  component: (props) => {
    const data = props.formData || props.item;
    return data ? (
      <RulesetDynamicFields 
        rulesetId={data.ruleset_id || 'dnd5'} 
        entityType="geo" 
        formData={data} 
        onChange={props.onChange} 
        readOnly={props.readOnly} 
        setFormData={props.setFormData} 
      />
    ) : null;
  }
},
        { name: 'name', label: "Nom de l'océan", type: 'text', required: true },
        { name: 'subtitle', label: 'Titre ou Surnom', type: 'text', placeholder: "Ex: La Mer de Corail, L'Étendue Infinie..." },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds' },
        { name: 'image_url', label: 'Image principale', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'environment',
      label: 'Environnement Marin',
      icon: Droplets,
      fields: [
        {
          name: 'area',
          label: 'Étendue',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Mer fermée', 'Bassin océanique majeur', 'Étendue planétaire', 'Archipel complexe', 'Détroit stratégique']} />
          )
        },
        {
          name: 'depth',
          label: 'Profondeur moyenne',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Eaux peu profondes (Plateau)', 'Profondeur moyenne (2km-4km)', 'Fosses abyssales (>6km)', 'Profondeur variable', 'Inconnue / Abysses inexplorées']} />
          )
        },
        {
          name: 'water_temp',
          label: "Température de l'eau",
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Glaciale (Icebergs)', 'Froide', 'Tempérée', 'Tropicale / Chaude', 'Bouillante (Volcanisme sous-marin)']} />
          )
        },
        {
          name: 'visibility',
          label: 'Visibilité / Clarté',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Eaux cristallines', 'Eaux troubles', 'Brume de surface permanente', 'Obscurité totale (Abysses)', 'Luminescence magique']} />
          )
        }
      ]
    },
    {
      id: 'navigation',
      label: 'Navigation & Flux',
      icon: Anchor,
      fields: [
        {
          name: 'currents',
          label: 'Courants Marins',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Courants réguliers', 'Flux violent / Tourbillons', 'Accélérateurs de voyage', 'Calme plat (Pot au noir)', 'Courants magiques changeants']} />
          )
        },
        {
          name: 'routes',
          label: 'Routes Maritimes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Route commerciale majeure', 'Passage de contrebande', 'Ancienne route oubliée', 'Zone de migration (Baleines/Monstres)', 'Infranchissable']} />
          )
        },
        {
          name: 'resources',
          label: 'Ressources & Intérêt',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Zone de pêche riche', 'Récifs de perles / Corail', 'Épaves historiques', 'Cristaux sous-marins', 'Nodules polymétalliques']} />
          )
        }
      ]
    },
    {
      id: 'hazards_tab',
      label: 'Dangers & Menaces',
      icon: Skull,
      fields: [
        {
          name: 'hazards',
          label: 'Dangers répertoriés',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Tempêtes imprévisibles', 'Récifs affleurants', 'Monstres marins (Kraken/Léviathan)', 'Piraterie intense', 'Malédiction maritime', 'Zone de naufrages']} />
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
          name: 'ocean_images',
          label: "Images de l'océan",
          type: 'images',
          bucket: 'images',
          render: () => null,
          categories: [
            { id: 'surface', label: 'Surface' },
            { id: 'underwater', label: 'Fonds Marins' },
            { id: 'maps', label: 'Cartes Maritimes' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'gm_secrets_ocean', label: 'Secrets des profondeurs', type: 'textarea', rows: 4 },
        { name: 'notes', label: 'Notes diverses', type: 'textarea', rows: 3 }
      ]
    }
  ]
};

export default function OceansPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('oceans').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
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

  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    const { error } = await supabase.from('oceans').delete().eq('id', item.id);
    if (!error) {
      handleClose();
      setRefreshKey(prev => prev + 1);
    }
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Engloutir l'Océan"
        message={`Souhaitez-vous vraiment effacer ${deleteConfirm.item?.name} ? Cette étendue d'eau et ses secrets disparaîtront à jamais.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList 
        key={refreshKey} 
        tableName="oceans" 
        title="Océans & Mers" 
        icon={Waves} // RÉTABLI : Pour éviter le crash undefined
        onView={setSelectedItem} 
        onEdit={(item) => { setEditingItem(item); setShowForm(true); }} 
        onCreate={() => { setEditingItem(null); setShowForm(true); }} 
        onDelete={openDeleteDialog}
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={handleClose} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }} 
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem} 
        config={oceansConfig} 
        customLayout={OceanLayout} 
      />

      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
        item={editingItem} 
        config={oceansConfig} 
        customForm={OceanForm} 
      />
    </>
  );
}