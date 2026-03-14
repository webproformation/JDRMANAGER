import { useState, useRef, useEffect } from 'react';
import { Globe, Info, Map, Sparkles, Zap, Image as ImageIcon, Shield, BookOpen, Users, Cloud, Clock, Layers } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import WorldClockControl from '../components/WorldClockControl';
import CalendarConfigEditor from '../components/CalendarConfigEditor';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther'; 
import MultiRelationSelector from '../components/MultiRelationSelector'; 
import EntityChildCards from '../components/EntityChildCards'; 
import VTTDialog from '../components/VTTDialog'; 
import WorldLayout from '../components/EnhancedEntityDetail/layouts/WorldLayout';
import WorldForm from '../components/EnhancedEntityForm/layouts/WorldForm'; 
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

const worldsConfig = {
  entityName: 'le monde',
  tableName: 'worlds',
  title: 'Mondes',
  getHeaderIcon: () => Globe,
  getHeaderColor: () => 'from-[#2DD4BF]/20 via-[#583B84]/10 to-[#1B2A3F]/20',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        { name: 'image_url', label: 'Visuel principal', type: 'image' },
        { name: 'name', label: 'Nom du monde', type: 'text', required: true, placeholder: 'Ex: Terrae...' },
        { name: 'subtitle', label: 'Sous-titre / Surnom', type: 'text' },
        {
          name: 'ruleset_id', 
          label: 'Système de Règles global',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_world', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true, 
          component: (props) => {
            const data = props.formData || props.item;
            if (!data) return null; 
            return (
              <RulesetDynamicFields 
                key={data.ruleset_id || 'world-init'} 
                rulesetId={data.ruleset_id} 
                entityType="world"
                formData={data} 
                setFormData={props.setFormData} 
                onChange={props.onChange} 
                readOnly={props.readOnly}
              />
            );
          }
        },
        { name: 'age', label: 'Âge du monde', type: 'text' },
        { name: 'size', label: 'Taille planétaire', type: 'select', options: [
            { value: 'small', label: 'Petit (Lune)' }, 
            { value: 'earth_like', label: 'Terrestre' }, 
            { value: 'large', label: 'Grand (Jupiter)' },
            { value: 'continent', label: 'Continent unique' },
            { value: 'archipelago', label: 'Archipel' },
            { value: 'infinite', label: 'Plan infini' }
        ]},
        { name: 'shape', label: 'Forme du monde', type: 'select', options: [
            { value: 'sphere', label: 'Sphérique' }, 
            { value: 'flat', label: 'Plate' }, 
            { value: 'disc', label: 'Disque' },
            { value: 'cylinder', label: 'Cylindrique' },
            { value: 'irregular', label: 'Irrégulière' },
            { value: 'floating_islands', label: 'Îles flottantes' }
        ]},
        { name: 'description', label: 'Description générale', type: 'textarea', rows: 5 },
        { name: 'creation_myth', label: 'Mythe de création', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'geography',
      label: 'Géographie & Climat',
      icon: Map,
      fields: [
        { name: 'climate', label: 'Climat général', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Tropical', 'Tempéré', 'Arctique', 'Désertique', 'Varié', 'Extrême', 'Instable / Magique']} /> },
        { name: 'terrain_types', label: 'Types de terrains', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Montagnes', 'Forêts Anciennes', 'Plaines', 'Déserts de Sable', 'Océans Profonds', 'Marais', 'Toundra', 'Cavernes Géantes', 'Jungles', 'Terres Désolées']} /> },
        { name: 'natural_wonders', label: 'Merveilles naturelles', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Arbres-Mondes', 'Cratères d\'Énergie', 'Chutes d\'Eau Inversées', 'Cristaux Géants', 'Volcans de Glace', 'Aurores Permanentes', 'Îles Flottantes']} /> },
        { name: 'natural_disasters', label: 'Catastrophes naturelles', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Tempêtes Magiques', 'Tremblements de Terre', 'Éruptions Volcaniques', 'Tsunamis', 'Pluies de Feu', 'Ouragans', 'Éclipses Maudites']} /> }
      ]
    },
    {
      id: 'magic',
      label: 'Magie & Cosmologie',
      icon: Sparkles,
      fields: [
        { name: 'magic_level', label: 'Niveau de magie', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Aucune magie', 'Rare et mystérieuse', 'Courante', 'Omniprésente', 'Hautement magique', 'Magie instable']} /> },
        { name: 'magic_source', label: 'Source de la magie', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Les Dieux', 'La Nature / Les Éléments', 'Le Sang / L\'Héritage', 'Le Tissage / La Trame', 'Les Cristaux', 'Les Astres / Les Lunes', 'Les Démons']} /> },
        { name: 'magic_schools', label: 'Écoles de magie', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Abjuration', 'Divination', 'Enchantement', 'Évocation', 'Illusion', 'Invocation', 'Nécromancie', 'Transmutation', 'Chronromancie']} /> },
        { name: 'planar_connections', label: 'Connexions planaires', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Portails Fixes', 'Failles Aléatoires', 'Rituels Uniquement', 'Inexistantes', 'Alignements Stellaires']} /> },
        { name: 'cosmology', label: 'Cosmologie', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Grande Roue', 'Arbre-Monde', 'Plans Échos', 'Multivers', 'Sphères de Cristal', 'Dimension Isolée']} /> },
        { name: 'magical_phenomena', label: 'Phénomènes magiques', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Aurores de Mana', 'Bêtes Mutantes', 'Zones de Magie Morte', 'Tempêtes d\'Âmes', 'Pluies Cristallines', 'Mirages Temporels']} /> },
        { name: 'calendar_config', label: 'Temps Mondial', type: 'custom', component: CalendarConfigEditor }
      ]
    },
    {
      id: 'civilization',
      label: 'Civilisation & Technologie',
      icon: Users,
      fields: [
        { name: 'technology_level', label: 'Niveau technologique', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Âge de Pierre', 'Âge du Bronze', 'Antiquité', 'Médiéval', 'Renaissance', 'Steampunk', 'Magitech', 'Cyberpunk', 'Futuriste']} /> },
        { name: 'population', label: 'Population totale', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Très Faible', 'Faible', 'Équilibrée', 'Dense', 'Surpeuplée', 'En Déclin', 'Décimée']} /> },
        { name: 'dominant_races', label: 'Races dominantes', type: 'custom', component: (props) => <MultiRelationSelector {...props} table="races" /> },
        { name: 'major_civilizations', label: 'Civilisations majeures', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Empires', 'Royaumes Féodaux', 'Cités-États', 'Tribus Nomades', 'Magocraties', 'Théocraties', 'Républiques Marchandes']} /> },
        { name: 'languages', label: 'Langages principaux', type: 'custom', component: (props) => <MultiRelationSelector {...props} table="languages" /> },
        { name: 'currencies', label: 'Monnaies', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Or', 'Argent', 'Cuivre', 'Platine', 'Électrum', 'Acier', 'Gemmes', 'Troc', 'Âmes']} /> },
        { name: 'trade_routes', label: 'Routes commerciales', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Maritimes', 'Terrestres', 'Fluviales', 'Aériennes', 'Souterraines', 'Portails Magiques']} /> }
      ]
    },
    {
      id: 'history',
      label: 'Histoire & Chronologie',
      icon: BookOpen,
      fields: [
        { name: 'current_era', label: 'Ère actuelle', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Âge des Mythes', 'Âge de la Magie', 'Ère des Mortels', 'Âge Sombre', 'Renaissance', 'Fin des Temps']} /> },
        { 
          name: 'historical_chronicle', 
          label: 'Chronique des Temps', 
          type: 'world_history_editor',
          isVirtual: true 
        },
        { name: 'major_historical_events', label: 'Histoire majeure', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Le Cataclysme', 'Guerres Divines', 'Découverte de la Magie', 'Chute d\'un Empire', 'Fracture Planaire', 'Invasion Démoniaque']} /> },
        { name: 'ancient_civilizations', label: 'Civilisations anciennes', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Précurseurs Inconnus', 'Empire Elfique Antique', 'Nains des Profondeurs', 'Anciens Dieux', 'Créatures Primordiales']} /> },
        { name: 'prophecies', label: 'Prophéties', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Fin du Monde', 'Retour du Messie', 'Réveil du Mal', 'L\'Éclipse Éternelle', 'Chute des Dieux']} /> },
        { name: 'current_conflicts', label: 'Conflits actuels', type: 'custom', component: (props) => <MultiSelectWithOther {...props} options={['Guerre Territoriale', 'Guerre Sainte', 'Rébellion', 'Famine / Fléau', 'Crise Magique', 'Guerre de Succession']} /> },
        { name: 'time_engine', label: 'Horloge', type: 'custom', isVirtual: true, component: WorldClockControl }
      ]
    },
    {
      id: 'continents',
      label: 'Continents',
      icon: Layers,
      fields: [
        { 
          name: 'world_continents', 
          label: 'Cartes des Continents', 
          type: 'custom', 
          isVirtual: true, 
          component: (props) => {
            const currentId = props.formData?.id || props.item?.id;
            return (
              <EntityChildCards 
                parentId={currentId} 
                childTable="continents" 
                parentKey="world_id" 
                childRoute="continents" 
                readOnly={props.readOnly} 
              />
            );
          }
        }
      ]
    },
    { id: 'gallery', label: "Galerie d'images", icon: ImageIcon, fields: [{ name: 'world_images', label: 'Images', type: 'images', bucket: 'images', categories: [{ id: 'maps', label: 'Cartes' }, { id: 'landscapes', label: 'Paysages' }, { id: 'cities', label: 'Cités' }] }] },
    { id: 'gm', label: 'Notes MJ', icon: Shield, fields: [{ name: 'gm_secrets', label: 'Secrets', type: 'textarea', rows: 5 }, { name: 'gm_plot_hooks', label: 'Quêtes', type: 'textarea', rows: 5 }, { name: 'notes', label: 'Notes diverses', type: 'textarea', rows: 5 }] }
  ]
};

export default function WorldsPage({ onWorldSelect, activeWorldId }) {
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
        const { data, error } = await supabase.from('worlds').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) {
            setSelectedItem(data);
            if (onWorldSelect) onWorldSelect(data.id);
          }
          else { setEditingItem(data); setShowForm(true); }
        }
      };
      fetchInitialItem();
    }
  }, []);

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); url.searchParams.delete('edit');
    window.history.replaceState({}, '', url);
  };

  const handleViewWorld = (item) => {
    setSelectedItem(item);
    if (onWorldSelect) {
      onWorldSelect(item.id); 
    }
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

  const openDeleteDialog = (item) => setDeleteConfirm({ isOpen: true, item });

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;
    await supabase.from('worlds').delete().eq('id', item.id);
    handleClose();
    setRefreshKey(prev => prev + 1);
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    // CORRECTIF V4.3 : Suppression du pt-24 (déjà géré par EntityList) 
    // Remplacement par pb-24 pour ne pas cacher le contenu derrière la barre de navigation basse
    <div className="pb-24 md:pb-0 h-full">
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Anéantir le Monde"
        message={`Êtes-vous certain de vouloir détruire ${deleteConfirm.item?.name} ? Toutes les cités, tous les peuples et tous les secrets de ce monde seront effacés à tout jamais.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList 
        key={refreshKey} 
        tableName="worlds" 
        title="Mondes" 
        onView={handleViewWorld} 
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
        config={worldsConfig} 
        customLayout={WorldLayout} 
      />

      <EnhancedEntityForm 
        isOpen={showForm} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
        item={editingItem} 
        config={worldsConfig} 
        customForm={WorldForm} 
      />
    </div>
  );
}