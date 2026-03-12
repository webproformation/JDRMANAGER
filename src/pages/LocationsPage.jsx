import { useState, useEffect } from 'react';
import { 
  MapPin, Info, Compass, Shield, Hammer, ShoppingBag, Bed, 
  ImageIcon, Skull, Gem, Thermometer, Eye, DollarSign 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog'; 
import LocationLayout from '../components/EnhancedEntityDetail/layouts/LocationLayout'; 
import LocationForm from '../components/EnhancedEntityForm/layouts/LocationForm';     
import { DEFAULT_RULESETS } from '../data/rulesets';
import { supabase } from '../lib/supabase';

const locationsConfig = {
  entityName: 'le lieu',
  tableName: 'locations',
  title: 'Autres Lieux',
  getHeaderIcon: () => MapPin,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

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
          isVirtual: true,
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
        { name: 'name', label: 'Nom du lieu', type: 'text', required: true },
        { name: 'subtitle', label: 'Surnom ou Type précis', type: 'text', placeholder: 'Ex: Le Repaire des Ombres...' },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds' },
        { name: 'country_id', label: 'Pays / Région', type: 'relation', table: 'countries', filterBy: 'world_id', filterValue: 'world_id' },
        { name: 'image_url', label: 'Image principale', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'exploration',
      label: 'Cadre & Exploration',
      icon: Compass,
      fields: [
        {
          name: 'location_type',
          label: 'Nature du lieu',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Ruines', 'Grotte / Caverne', 'Avant-poste militaire', 'Tour isolée', 'Temple oublié', 'Repaire de brigands', 'Mine abandonnée', 'Oasis', 'Cercle de pierres']} />
          )
        },
        {
          name: 'accessibility',
          label: 'Accessibilité',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Facile (route)', 'Difficile (piste)', 'Caché / Secret', 'Gardé / Fortifié', 'Magiquement protégé', 'Accès aérien uniquement']} />
          )
        },
        {
          name: 'climate',
          label: 'Climat local',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Tempéré', 'Aride / Désertique', 'Glacial', 'Humide / Tropical', 'Volcanique', 'Magiquement instable']} />
          )
        },
        {
          name: 'visibility',
          label: 'Visibilité',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Visible de loin', 'Dissimulé (Végétation/Relief)', 'Sous-terrain', 'Brume perpétuelle', 'Illusion de camouflage']} />
          )
        },
        {
          name: 'area',
          label: 'Étendue',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Ponctuel (édifice)', 'Petit complexe', 'Vaste réseau', 'S\'étend sur plusieurs niveaux']} />
          )
        }
      ]
    },
    {
      id: 'services',
      label: 'Services & Commerces',
      icon: ShoppingBag,
      fields: [
        {
          name: 'artisans',
          label: 'Artisans présents',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Forgeron itinérant', 'Alchimiste ermite', 'Réparateur de fortune', 'Tailleur de pierre', 'Tisseur / Tanneur', 'Aucun']} />
          )
        },
        {
          name: 'merchants',
          label: 'Marchands / Échanges',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Colporteur', 'Marchand d\'antiquités', 'Receleur (marché noir)', 'Échange de vivres', 'Comptoir de troc', 'Aucun']} />
          )
        },
        {
          name: 'inns_accommodation',
          label: 'Hébergement / Repos',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Campement aménagé', 'Dortoir de garnison', 'Paillasse en commun', 'Chambre d\'hôte rudimentaire', 'Abri naturel sécurisé', 'Aucun']} />
          )
        }
      ]
    },
    {
      id: 'dangers',
      label: 'Dangers & Trésors',
      icon: Skull,
      fields: [
        {
          name: 'danger_level',
          label: 'Niveau de danger',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther {...props} options={['Havre de paix', 'Faible', 'Modéré', 'Élevé', 'Mortel / Zone interdite']} />
          )
        },
        { name: 'encounters', label: 'Rencontres possibles', type: 'textarea', rows: 3 },
        { name: 'treasures', label: 'Butins & Trésors', type: 'textarea', rows: 3 }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'location_images',
          label: 'Images du lieu',
          type: 'images',
          bucket: 'images',
          render: () => null,
          categories: [
            { id: 'interior', label: 'Intérieur' },
            { id: 'exterior', label: 'Extérieur' },
            { id: 'maps', label: 'Plans / Cartes' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'gm_secrets_location', label: 'Secrets du lieu', type: 'textarea', rows: 4 },
        { name: 'notes', label: 'Notes diverses', type: 'textarea', rows: 3 }
      ]
    }
  ]
};

export default function LocationsPage() {
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
          .from('locations')
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

    const { error } = await supabase.from('locations').delete().eq('id', item.id);
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
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ (STANDARD PRESTIGE 3.0) */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Démolir le Lieu"
        message={`Voulez-vous vraiment effacer ${deleteConfirm.item?.name} des chroniques ? Cette action est irréversible.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList 
        key={refreshKey} 
        tableName="locations" 
        title="Autres Lieux" 
        icon={MapPin} // RÉPARÉ : L'icône obligatoire qui stoppait le rendu
        onView={setSelectedItem} 
        onEdit={(item) => { setEditingItem(item); setShowForm(true); }} 
        onCreate={() => { setEditingItem(null); setShowForm(true); }} 
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={handleClose} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }} 
        onDelete={() => openDeleteDialog(selectedItem)} 
        item={selectedItem} 
        config={locationsConfig} 
        customLayout={LocationLayout} 
      />

      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
        item={editingItem} 
        config={locationsConfig} 
        customForm={LocationForm} 
      />
    </>
  );
}