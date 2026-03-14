import { useState, useEffect } from 'react';
import { 
  Star, Info, Orbit, Sparkles, ImageIcon, Shield, 
  Plus, Minus, Settings, Moon, Sun, Zap
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog'; 
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// IMPORT DES LAYOUTS SPÉCIFIQUES PRESTIGE
import CelestialBodiesLayout from '../components/EnhancedEntityDetail/layouts/CelestialBodiesLayout';
import CelestialBodiesForm from '../components/EnhancedEntityForm/layouts/CelestialBodiesForm';

// ============================================================================
// COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (CORPS CÉLESTES)
// ============================================================================
const CelestialMechanicsEditor = ({ value = {}, onChange, readOnly = false }) => {
  const data = value || {};
  const magicModifiers = data.magicModifiers || { healing: 0, damage: 0, necromancy: 0, illusion: 0 };

  const effectOptions = ['Vision nocturne doublée', 'Fatigue magique (+1)', 'Rage de sang', 'Aura de terreur', 'Régénération accélérée', 'Portail Planaire'];
  const conditionOptions = ['Pleine lune', 'Éclipse totale', 'Alignement planétaire', 'Nouvelle lune', 'Périgée'];

  const updateField = (field, val) => !readOnly && onChange({ ...data, [field]: val });
  const updateModifier = (school, amount) => {
    if (readOnly) return;
    const newValue = (magicModifiers[school] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) {
      onChange({ ...data, magicModifiers: { ...magicModifiers, [school]: newValue } });
    }
  };

  const schoolLabels = { healing: 'Vie', damage: 'Dégâts', necromancy: 'Mort', illusion: 'Esprit' };

  return (
    <div className="bg-black/20 rounded-[2.5rem] p-8 border border-white/5 shadow-inner mb-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl text-[#2DD4BF] animate-pulse-slow">
          <Zap size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white leading-none mb-1">Moteur de Résonance Magique</h4>
          <p className="text-[9px] text-silver/40 font-bold uppercase tracking-widest">Influences environnementales VTT</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] ml-1">Effet Global</label>
          <MultiSelectWithOther 
            value={data.global_effect || ''} 
            onChange={(val) => updateField('global_effect', val)}
            options={effectOptions}
            readOnly={readOnly}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] ml-1">Déclencheur</label>
          <MultiSelectWithOther 
            value={data.trigger_condition || ''} 
            onChange={(val) => updateField('trigger_condition', val)}
            options={conditionOptions}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(schoolLabels).map(([key, label]) => {
            const val = magicModifiers[key] || 0;
            return (
              <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-3 hover:border-[#2DD4BF]/20 transition-all group">
                <span className="text-[9px] font-black uppercase tracking-widest text-silver/40 group-hover:text-[#2DD4BF] transition-colors">{label}</span>
                <div className="flex items-center gap-4">
                  {!readOnly && <button type="button" onClick={() => updateModifier(key, -1)} className="p-1.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-all active:scale-90"><Minus size={14}/></button>}
                  <span className={`text-xl font-black w-8 text-center drop-shadow-md ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                  {!readOnly && <button type="button" onClick={() => updateModifier(key, 1)} className="p-1.5 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-all active:scale-90"><Plus size={14}/></button>}
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
// CONFIGURATION DE L'ENTITÉ
// ============================================================================
const celestialBodiesConfig = {
  entityName: 'le corps céleste',
  tableName: 'celestial_bodies',
  title: 'Archives Célestes',
  getHeaderIcon: () => Star,
  getHeaderColor: () => 'from-indigo-600/30 via-blue-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_celestial', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange, readOnly }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="celestial" 
              formData={formData} 
              onChange={onChange} 
              readOnly={readOnly}
            />
          )
        },
        { name: 'name', label: 'Nom de l\'astre', type: 'text', required: true, placeholder: 'Ex: Solinari...' },
        { name: 'subtitle', label: 'Désignation poétique', type: 'text', placeholder: 'Ex: L\'Œil Sombre...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds' },
        { name: 'image_url', label: 'Illustration céleste', type: 'image' },
        {
          name: 'body_type',
          label: 'Nature de l\'Astre',
          type: 'select',
          options: [
            { value: 'planet', label: 'Planète' }, { value: 'moon', label: 'Lune' },
            { value: 'star', label: 'Étoile' }, { value: 'comet', label: 'Comète' }
          ]
        },
        { name: 'description', label: 'Description visuelle', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'influence',
      label: 'Influences VTT',
      icon: Sparkles,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles',
          type: 'custom',
          isVirtual: true,
          component: CelestialMechanicsEditor
        },
        { name: 'astrological_influence', label: 'Influence narrative & Marées', type: 'textarea', rows: 4 },
        { 
          name: 'magical_properties', 
          label: 'Affinités Arcaniques', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Amplification magique', 'Foyer Arcanique', 'Drain de Mana', 'Portail Planaire']} />
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        { 
          name: 'celestial_images', 
          label: 'Archives visuelles', 
          type: 'images', 
          bucket: 'images', 
          categories: [
            { id: 'full', label: 'Vue complète' }, 
            { id: 'phases', label: 'Phases' }, 
            { id: 'sky', label: 'Dans le ciel' }
          ] 
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'lore', label: 'Secrets Antiques', type: 'textarea', rows: 5 },
        { name: 'notes', label: 'Notes MJ Confidentielles', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function CelestialBodiesPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('celestial_bodies').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

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

  const handleCreate = () => {
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('celestial_bodies').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Désintégrer l'Astre"
        message={`Souhaitez-vous vraiment rayer ${deleteConfirm.item?.name} de la voûte céleste ? Tous les secrets et influences liés s'évanouiront dans le vide.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="celestial_bodies"
        title="Corps Célestes"
        icon={Star}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={celestialBodiesConfig}
        customLayout={CelestialBodiesLayout}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={celestialBodiesConfig}
        customForm={CelestialBodiesForm}
      />
    </div>
  );
}