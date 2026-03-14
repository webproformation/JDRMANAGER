import { useState, useEffect } from 'react';
import { Zap, Info, Target, ImageIcon, Shield, Sparkles, Clock, Layers } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

const classFeaturesConfig = {
  entityName: 'la capacité',
  tableName: 'class_features',
  title: 'Capacités de Classe',
  getHeaderIcon: () => Zap,
  getHeaderColor: () => 'from-yellow-600/30 via-amber-500/20 to-orange-500/30',

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
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_class_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="class" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la capacité',
          type: 'text',
          required: true,
          placeholder: 'Ex: Second souffle, Rage de berserker...'
        },
        {
          name: 'subtitle',
          label: 'Type de capacité',
          type: 'text',
          placeholder: 'Capacité passive, active, bonus de sous-classe...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds'
        },
        {
          name: 'image_url',
          label: 'Illustration / Icône',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Lore, aspect visuel et fonctionnement général...'
        }
      ]
    },
    {
      id: 'progression',
      label: 'Prérequis',
      icon: Layers,
      fields: [
        {
          name: 'class_relation',
          label: 'Classe parente',
          type: 'relation',
          table: 'character_classes',
          placeholder: 'Sélectionner la classe associée'
        },
        {
          name: 'level',
          label: 'Niveau d\'obtention',
          type: 'number',
          placeholder: '1-20'
        },
        {
          name: 'prerequisites',
          label: 'Conditions requises',
          type: 'textarea',
          rows: 3,
          placeholder: 'Caractéristiques minimales, autres capacités possédées...'
        }
      ]
    },
    {
      id: 'mechanics',
      label: 'Mécaniques VTT',
      icon: Sparkles,
      fields: [
        {
          name: 'activation',
          label: 'Type d\'activation',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Action', 'Action Bonus', 'Réaction', 'Passif', 'Repos Court', 'Repos Long', 'Spécial']} 
            />
          )
        },
        {
          name: 'uses_per_rest',
          label: 'Utilisations & Ressources',
          type: 'text',
          placeholder: 'Ex: 1/repos court, modificateur de SAG / jour...'
        },
        {
          name: 'mechanical_effect',
          label: 'Effet de jeu (Règles)',
          type: 'textarea',
          rows: 5,
          placeholder: 'Détails techniques : bonus aux jets, dégâts, altérations...'
        },
        {
          name: 'range',
          label: 'Portée / Zone d\'effet',
          type: 'text',
          placeholder: 'Personnelle, Contact, Rayon de 9m...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'feature_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'icons', label: 'Icônes de capacité' },
            { id: 'action', label: 'Représentation en action' }
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
          name: 'balance_notes',
          label: 'Équilibrage & Interactions',
          type: 'textarea',
          rows: 3,
          placeholder: 'Points de vigilance sur la puissance ou les synergies...'
        },
        {
          name: 'notes',
          label: 'Notes MJ Confidentielles',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function ClassFeaturesPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('class_features').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('class_features').delete().eq('id', deleteConfirm.item.id);
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
        title="Oublier la Capacité"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des grimoires de classe ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="class_features"
        title="Capacités"
        icon={Zap}
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
        config={classFeaturesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={classFeaturesConfig}
      />
    </div>
  );
}