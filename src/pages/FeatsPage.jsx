import { useState, useEffect } from 'react';
import { Award, Info, Sparkles, Shield, ImageIcon, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

const featsConfig = {
  entityName: 'le don',
  tableName: 'feats',
  title: 'Dons & Capacités',
  getHeaderIcon: () => Award,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité du Don',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_feat_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="feat" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du don',
          type: 'text',
          required: true,
          placeholder: 'Ex: Tireur d\'élite, Chanceux...'
        },
        {
          name: 'world_id',
          label: 'Monde d\'origine',
          type: 'relation',
          table: 'worlds'
        },
        {
          name: 'prerequisite',
          label: 'Prérequis',
          type: 'text',
          placeholder: 'Ex: Force 13+, Maîtrise des armures...'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 4,
          placeholder: 'Origine et lore du don...'
        }
      ]
    },
    {
      id: 'mechanics',
      label: 'Mécaniques & Règles',
      icon: Sparkles,
      fields: [
        {
          name: 'benefits',
          label: 'Effets de Jeu (VTT)',
          type: 'textarea',
          rows: 6,
          placeholder: 'Détaillez les bonus, avantages et mécaniques de jeu...'
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'notes',
          label: 'Notes MJ Confidentielles',
          type: 'textarea',
          rows: 4
        }
      ]
    }
  ]
};

export default function FeatsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('feats').select('*').eq('id', id).single();
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
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('feats').delete().eq('id', deleteConfirm.item.id);
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
        title="Oublier le Don"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des grimoires de capacités ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="feats"
        title="Dons & Talents"
        icon={Award}
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
        config={featsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={featsConfig}
      />
    </div>
  );
}