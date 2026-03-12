import { useState, useEffect } from 'react';
import { 
  Star, 
  Info, 
  Orbit, 
  Sparkles, 
  ImageIcon, 
  Shield, 
  Plus, 
  Minus, 
  Search, 
  ExternalLink, 
  Trash,
  ChevronRight,
  Settings
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import MultiRelationSelector from '../components/MultiRelationSelector';
import EntityChildCards from '../components/EntityChildCards';
import VTTDialog from '../components/VTTDialog'; 
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; // Définitions des systèmes
import { supabase } from '../lib/supabase';

// IMPORT DES LAYOUTS SPÉCIFIQUES POUR LE STANDARD PRESTIGE 3.0
import CelestialBodiesLayout from '../components/EnhancedEntityDetail/layouts/CelestialBodiesLayout';
import CelestialBodiesForm from '../components/EnhancedEntityForm/layouts/CelestialBodiesForm';

// ============================================================================
// COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (CORPS CÉLESTES)
// ============================================================================
/**
 * CelestialMechanicsEditor - Gère les influences magiques et effets globaux
 * Intègre désormais MultiSelectWithOther pour la standardisation [cite: 2026-03-12]
 */
const CelestialMechanicsEditor = ({ value = {}, onChange, readOnly = false }) => {
  const data = value || {};
  const magicModifiers = data.magicModifiers || { healing: 0, damage: 0, necromancy: 0, illusion: 0 };

  // Suggestions pour la cohérence du moteur environnemental [cite: 2026-03-12]
  const effectOptions = [
    'Vision nocturne doublée', 
    'Fatigue magique (+1)', 
    'Rage de sang (Bonus Attaque)', 
    'Aura de terreur pure', 
    'Régénération accélérée', 
    'Chance du voyageur astral', 
    'Malédiction de l\'ombre'
  ];
  
  const conditionOptions = [
    'Pleine lune', 
    'Zénith céleste', 
    'Éclipse totale', 
    'Alignement planétaire', 
    'Nouvelle lune', 
    'Périgée (Astre au plus proche)', 
    'Conjonction majeure'
  ];

  const updateField = (field, val) => {
    if (readOnly) return;
    onChange({ ...data, [field]: val });
  };

  const updateModifier = (school, amount) => {
    if (readOnly) return;
    const newValue = (magicModifiers[school] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) {
      onChange({ 
        ...data, 
        magicModifiers: { ...magicModifiers, [school]: newValue } 
      });
    }
  };

  const schoolLabels = { 
    healing: 'Soin / Vie', 
    damage: 'Évocation / Dégâts', 
    necromancy: 'Nécromancie / Mort', 
    illusion: 'Illusion / Esprit' 
  };

  return (
    <div className="bg-[#151725] rounded-[2.5rem] p-10 border border-white/5 shadow-inner mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-400">
          <Settings size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-white">Moteur de Flux Magiques</h4>
          <p className="text-[10px] text-silver/40 uppercase font-bold tracking-tight">Suggestions automatiques et modificateurs de dés [cite: 2026-03-12]</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60 ml-1">Effet d'Environnement Global</label>
          <MultiSelectWithOther 
            value={data.global_effect || ''} 
            onChange={(val) => updateField('global_effect', val)}
            options={effectOptions}
            readOnly={readOnly}
            placeholder="Sélectionner ou saisir un effet..."
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60 ml-1">Condition de déclenchement</label>
          <MultiSelectWithOther 
            value={data.trigger_condition || ''} 
            onChange={(val) => updateField('trigger_condition', val)}
            options={conditionOptions}
            readOnly={readOnly}
            placeholder="Condition temporelle..."
          />
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60 block mb-6 text-center">
          Modificateurs de Puissance par École (Dés de bonus/malus)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(schoolLabels).map(([key, label]) => {
            const val = magicModifiers[key] || 0;
            return (
              <div key={key} className="bg-black/60 rounded-[2rem] p-6 border border-white/5 flex flex-col items-center gap-4 group hover:border-teal-500/30 transition-all">
                <span className="text-[9px] font-black uppercase tracking-widest text-silver/60 group-hover:text-teal-400 transition-colors">{label}</span>
                <div className="flex items-center gap-5">
                  {!readOnly && (
                    <button 
                      type="button" 
                      onClick={() => updateModifier(key, -1)} 
                      className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-xl transition-all active:scale-90"
                    >
                      <Minus size={16}/>
                    </button>
                  )}
                  <span className={`text-2xl font-black w-10 text-center drop-shadow-md ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>
                    {val > 0 ? `+${val}` : val}
                  </span>
                  {!readOnly && (
                    <button 
                      type="button" 
                      onClick={() => updateModifier(key, 1)} 
                      className="w-10 h-10 flex items-center justify-center bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-xl transition-all active:scale-90"
                    >
                      <Plus size={16}/>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CONFIGURATION DE L'ENTITÉ (PRESTIGE 3.0)
// ============================================================================
const celestialBodiesConfig = {
  entityName: 'le corps céleste',
  tableName: 'celestial_bodies',
  title: 'Corps Célestes',
  getHeaderIcon: () => Star,
  getHeaderColor: () => 'from-indigo-600/30 via-blue-500/20 to-cyan-500/30',

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
          name: 'dynamic_celestial', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => {
            const data = props.formData || props.item;
            if (!data) return null;
            return (
              <RulesetDynamicFields 
                key={data.ruleset_id || 'celestial-init'}
                rulesetId={data.ruleset_id || 'dnd5'} 
                entityType="celestial" 
                formData={data} 
                setFormData={props.setFormData}
                onChange={props.onChange} 
                readOnly={props.readOnly}
              />
            );
          }
        },
        { name: 'name', label: 'Nom de l\'astre', type: 'text', required: true, placeholder: 'Ex: Solinari, Lunitari, Nuitari...' },
        { name: 'subtitle', label: 'Autre nom ou titre', type: 'text', placeholder: 'Ex: La Dame Blanche, L\'Œil Sombre...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', placeholder: 'Sélectionner un monde' },
        { name: 'image_url', label: 'Image principale (Visualisation)', type: 'image' },
        {
          name: 'body_type',
          label: 'Nature de l\'Astre',
          type: 'select',
          options: [
            { value: 'planet', label: 'Planète' },
            { value: 'moon', label: 'Lune' },
            { value: 'star', label: 'Étoile' },
            { value: 'comet', label: 'Comète' },
            { value: 'constellation', label: 'Constellation' }
          ]
        },
        { name: 'description', label: 'Description générale', type: 'textarea', rows: 6, placeholder: 'Apparence dans le ciel, couleurs, aura...' }
      ]
    },
    {
      id: 'physical',
      label: 'Caractéristiques physiques',
      icon: Orbit,
      fields: [
        { 
          name: 'color', 
          label: 'Couleur prédominante', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Argenté', 'Rouge rubis', 'Noir d\'ébène', 'Doré', 'Bleu saphir', 'Vert émeraude', 'Violet nébuleux', 'Blanc nacré']} />
        },
        { 
          name: 'size', 
          label: 'Taille apparente', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Minuscule', 'Petite', 'Moyenne', 'Grande', 'Gigantesque', 'Stellaire', 'Planétaire']} />
        },
        { 
          name: 'brightness', 
          label: 'Luminosité moyenne', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Éclatante', 'Variable', 'Faible', 'Aveuglante', 'Invisible (Mages)', 'Lueur douce']} />
        },
        { name: 'orbital_period', label: 'Période orbitale / Cycle', type: 'text', placeholder: 'Ex: 28 jours, 12 ans...' },
        { name: 'phases', label: 'Détail des Phases', type: 'textarea', rows: 4, placeholder: 'Description du cycle de changement...' }
      ]
    },
    {
      id: 'influence',
      label: 'Influences & Effets',
      icon: Sparkles,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: CelestialMechanicsEditor
        },
        { name: 'astrological_influence', label: 'Influence astrologique', type: 'textarea', rows: 4, placeholder: 'Effets sur les marées, les prophéties...' },
        { 
          name: 'magical_properties', 
          label: 'Propriétés magiques', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Amplification magique', 'Foyer Arcanique', 'Drain de Mana', 'Portail Planaire', 'Vision prophétique', 'Bonus de Soin', 'Boost de Dégâts']} />
        },
        { 
          name: 'cultural_significance', 
          label: 'Importance culturelle', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Divinité incarnée', 'Symbole de Mort', 'Guide des voyageurs', 'Oracle des marées', 'Présage de guerre', 'Foyer des âmes']} />
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        { 
          name: 'celestial_images', 
          label: 'Images de l\'astre', 
          type: 'images', 
          bucket: 'images', 
          categories: [
            { id: 'full', label: 'Vue complète' }, 
            { id: 'phases', label: 'Phases' }, 
            { id: 'sky', label: 'Dans le ciel' },
            { id: 'lore', label: 'Iconographie ancienne' }
          ] 
        }
      ]
    },
    {
      id: 'gm',
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        { name: 'lore', label: 'Histoire cachée & Mythes', type: 'textarea', rows: 5, placeholder: 'Vérités antiques connues du MJ...' },
        { name: 'notes', label: 'Notes privées', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

const listFilters = [
  { key: 'world_id', label: 'Monde', type: 'relation', relationTable: 'worlds' },
  { key: 'body_type', label: 'Type', type: 'select', options: [
    { value: 'planet', label: 'Planète' },
    { value: 'moon', label: 'Lune' },
    { value: 'star', label: 'Étoile' }
  ]}
];

// ============================================================================
// COMPOSANT PAGE PRINCIPAL (LOGIQUE DE GESTION)
// ============================================================================
export default function CelestialBodiesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  // --- LOGIQUE DE DEEP LINKING ET URL CLEANING ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewId = urlParams.get('view');
    const editId = urlParams.get('edit');
    if (viewId || editId) {
      const targetId = viewId || editId;
      const fetchItem = async () => {
        const { data } = await supabase.from('celestial_bodies').select('*').eq('id', targetId).single();
        if (data) { 
          if (editId) { setEditingItem(data); setShowForm(true); } 
          else { setSelectedItem(data); }
        }
      };
      fetchItem();
    }
  }, []);

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view');
    url.searchParams.delete('edit');
    window.history.replaceState({}, '', url);
  };

  const handleSuccess = () => {
    setRefreshKey(p => p + 1);
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

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;
    try {
      await supabase.from('celestial_bodies').delete().eq('id', item.id);
      setSelectedItem(null);
      setRefreshKey(p => p + 1);
    } catch (err) {
      console.error("Erreur de suppression:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PRESTIGE */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Désintégrer l'Astre"
        message={`Voulez-vous rayer ${deleteConfirm.item?.name} de la voûte céleste ? Tous les secrets et influences liés s'évanouiront dans le vide spatial.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      {/* LISTE PRINCIPALE DES ARCHIVES */}
      <EntityList
        key={refreshKey}
        tableName="celestial_bodies"
        title="Corps Célestes"
        icon={Star}
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
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
        filters={listFilters}
      />

      {/* MODAL DE DÉTAILS PRESTIGE */}
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { 
          setEditingItem(selectedItem); 
          setSelectedItem(null); 
          setShowForm(true); 
        }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={celestialBodiesConfig}
        customLayout={CelestialBodiesLayout}
      />

      {/* MODAL DE FORMULAIRE PRESTIGE */}
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={celestialBodiesConfig}
        customForm={CelestialBodiesForm}
      />
    </>
  );
}