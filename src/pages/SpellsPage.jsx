import { useState, useEffect } from 'react';
import { Sparkles, Info, Wand2, Book, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index';

const spellsConfig = {
  entityName: 'le sort',
  tableName: 'spells',
  title: 'Sorts & Arcanes',
  getHeaderIcon: () => Sparkles,
  getHeaderColor: () => 'from-purple-600/30 via-fuchsia-500/20 to-pink-500/30',

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
          name: 'dynamic_spell_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="spell" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du sort',
          type: 'text',
          required: true,
          placeholder: 'Ex: Boule de feu, Bouclier, Invisibilité...'
        },
        {
          name: 'subtitle',
          label: 'École de magie',
          type: 'text',
          placeholder: 'Évocation, Abjuration, Illusion...'
        },
        {
          name: 'world_id',
          label: 'Monde d\'origine',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'image_url',
          label: 'Image du sort',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 6,
          placeholder: 'Effet visuel et ambiance du sort...'
        }
      ]
    },
    {
      id: 'mechanics',
      label: 'Mécanique',
      icon: Wand2,
      fields: [
        {
          name: 'level',
          label: 'Niveau du sort',
          type: 'select',
          options: [
            { value: '0', label: 'Sort mineur' },
            { value: '1', label: 'Niveau 1' },
            { value: '2', label: 'Niveau 2' },
            { value: '3', label: 'Niveau 3' },
            { value: '4', label: 'Niveau 4' },
            { value: '5', label: 'Niveau 5' },
            { value: '6', label: 'Niveau 6' },
            { value: '7', label: 'Niveau 7' },
            { value: '8', label: 'Niveau 8' },
            { value: '9', label: 'Niveau 9' }
          ]
        },
        {
          name: 'casting_time',
          label: 'Temps d\'incantation',
          type: 'text',
          placeholder: '1 action, 1 action bonus, 1 minute...'
        },
        {
          name: 'range',
          label: 'Portée',
          type: 'text',
          placeholder: 'Personnelle, Contact, 30 pieds, 1 mile...'
        },
        {
          name: 'components',
          label: 'Composantes',
          type: 'text',
          placeholder: 'V, S, M (description des composantes matérielles)...'
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Instantané, 1 minute, Concentration jusqu\'à 1 heure...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets Arcaniques',
      icon: Sparkles,
      fields: [
        {
          name: 'effect',
          label: 'Effet mécanique détaillé',
          type: 'textarea',
          rows: 6,
          placeholder: 'Description détaillée des effets mécaniques...'
        },
        {
          name: 'at_higher_levels',
          label: 'Aux niveaux supérieurs',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment le sort évolue avec des emplacements supérieurs...'
        },
        {
          name: 'saving_throw',
          label: 'Jet de sauvegarde',
          type: 'text',
          placeholder: 'Dextérité, Sagesse, Constitution...'
        }
      ]
    },
    {
      id: 'availability',
      label: 'Apprentissage',
      icon: Book,
      fields: [
        {
          name: 'classes',
          label: 'Classes autorisées',
          type: 'textarea',
          rows: 2,
          placeholder: 'Mage, Ensorceleur, Clerc...'
        },
        {
          name: 'rarity',
          label: 'Rareté du sort',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'spell_images',
          label: 'Visualisation du sort',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'casting', label: 'Incantation' },
            { id: 'effect', label: 'Effet' },
            { id: 'components', label: 'Composantes' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Secrets MJ',
      icon: Shield,
      fields: [
        {
          name: 'balance_notes',
          label: 'Notes d\'équilibrage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Puissance, combos problématiques...'
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

export default function SpellsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('spells').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('spells').delete().eq('id', deleteConfirm.item.id);
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
        title="Bannir le Sort"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} du grimoire universel ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="spells"
        title="Sorts"
        icon={Sparkles}
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
        config={spellsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={spellsConfig}
      />
    </div>
  );
}