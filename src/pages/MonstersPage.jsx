import { useState, useEffect } from 'react';
import { 
  Skull, Info, Swords, Heart, TreePine, Scroll, ImageIcon, 
  Shield, Plus, Minus, Zap, Target, Sword, Globe, Sparkles,
  ChevronRight, BoxSelect, Scaling, ZapOff
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index';
import { calculateCombatStats } from '../utils/rulesEngine';

// --- WRAPPER POUR L'ÉDITEUR DE STATS ---
const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5']; 
  
  const handleStatsChange = (newStats) => {
    const derived = calculateCombatStats(currentRulesetId, newStats, 1); 
    onChange({ ...newStats, ...derived });
  };

  return (
    <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 shadow-inner mb-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-500/10 rounded-2xl text-red-400 animate-pulse-slow">
          <Zap size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Moteur de Puissance VTT</h4>
          <p className="text-[9px] text-silver/40 font-bold uppercase tracking-widest text-center">Calcul automatique des modificateurs</p>
        </div>
      </div>
      <DynamicStatsEditor 
        ruleset={currentRuleset} 
        data={value || {}} 
        onChange={handleStatsChange} 
      />
    </div>
  );
};

// --- CONFIGURATION PRESTIGE V4.3.6 - MONSTRES ---
const monstersConfig = {
  entityName: 'le monstre',
  tableName: 'monsters',
  title: 'Bestiaire Omniversel',
  getHeaderIcon: () => Skull,
  getHeaderColor: () => 'from-red-600/30 via-orange-600/20 to-yellow-600/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité Lore',
      icon: Info,
      columns: 3, // Standard PRESTIGE 2.0
      fields: [
        // COL 1
        { name: 'image_url', label: 'Illustration du Spécimen', type: 'image', bucket: 'bestiary' },
        
        // COL 2
        { name: 'name', label: 'Désignation', type: 'text', required: true, placeholder: 'Ex: Dragon Rouge...' },
        { name: 'ruleset_id', label: 'Système Source', type: 'select', options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { 
          name: 'type', 
          label: 'Classification Biologique', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Dragon', 'Mort-vivant', 'Aberration', 'Céleste', 'Bête', 'Élémentaire', 'Humanoïde', 'Monstruosité', 'Plante']} />
        },
        
        // COL 3
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds' },
        { 
          name: 'size', 
          label: 'Échelle (Taille)', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Minuscule', 'Petite', 'Moyenne', 'Grande', 'Très Grande', 'Gigantesque', 'Colossale']} />
        },
        { 
          name: 'alignment', 
          label: 'Nature (Alignement)', 
          type: 'custom',
          component: (p) => <MultiSelectWithOther {...p} options={['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre Absolu', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais', 'Sans Alignement']} />
        },
        
        { name: 'subtitle', label: 'Titre / Épithète', type: 'text', placeholder: 'Ex: Le Dévoreur de Mondes...' },
        { name: 'description', label: 'Description Narrative', type: 'textarea', rows: 5, fullWidth: true }
      ]
    },
    {
      id: 'combat',
      label: 'Combat & VTT',
      icon: Swords,
      fields: [
        { name: 'stats', label: 'Bloc de Caractéristiques', type: 'custom', isVirtual: true, fullWidth: true, component: ConnectedStatsEditor },
        {
          name: 'dynamic_monster_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          fullWidth: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields rulesetId={formData.ruleset_id || 'dnd5'} entityType="monster" formData={formData} onChange={onChange} />
          )
        },
        { name: 'armor_class', label: "CA", type: 'number', placeholder: '15' },
        { name: 'hit_points', label: 'PV', type: 'text', placeholder: 'Ex: 136 (13d10 + 65)' },
        { name: 'challenge_rating', label: 'Indice (CR)', type: 'text', placeholder: 'Ex: 12 (8,400 XP)' },
        { name: 'abilities', label: 'Traits Passifs', type: 'textarea', rows: 5, placeholder: 'Résistance magique...' },
        { name: 'actions', label: 'Actions d\'Attaque', type: 'textarea', rows: 5, placeholder: 'Griffes, Morsure...' },
        { name: 'legendary_actions', label: 'Actions Légendaires', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie',
      icon: TreePine,
      fields: [
        { name: 'habitat_description', label: 'Biotope', type: 'text', placeholder: 'Ex: Ruines, Grottes...' },
        { name: 'diet', label: 'Régime', type: 'text' },
        { name: 'social_structure', label: 'Société', type: 'text', placeholder: 'Ex: Solitaire, Meute...' },
        { name: 'behavior_patterns', label: 'Comportement', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        { name: 'monster_images', label: 'Iconographie', type: 'images', bucket: 'images', categories: [{ id: 'full', label: 'Spécimen' }, { id: 'lair', label: 'Repaire' }, { id: 'action', label: 'Combat' }] }
      ]
    },
    {
      id: 'gm',
      label: 'Secrets MJ',
      icon: Shield,
      fields: [
        { name: 'gm_tactics', label: 'Tactiques de Combat', type: 'textarea', rows: 5, placeholder: 'Comment terroriser les PJ...' },
        { name: 'encounter_tips', label: 'Accroches', type: 'textarea', rows: 3 },
        { name: 'notes', label: 'Notes Confidentielles', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function MonstersPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('monsters').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('monsters').delete().eq('id', deleteConfirm.item.id);
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
        title="Exterminer la Créature"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des registres ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="monsters"
        title="Bestiaire"
        icon={Skull}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => { setSelectedItem(null); cleanURL(); }}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={monstersConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={monstersConfig}
      />
    </div>
  );
}