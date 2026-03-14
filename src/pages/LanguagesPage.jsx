import { useState, useEffect } from 'react';
import { Languages, Info, BookText, Users, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

const languagesConfig = {
  entityName: 'le langage',
  tableName: 'languages',
  title: 'Langages & Dialectes',
  getHeaderIcon: () => Languages,
  getHeaderColor: () => 'from-teal-600/30 via-cyan-500/20 to-sky-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
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
          name: 'dynamic_geo_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="geo" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du langage',
          type: 'text',
          required: true,
          placeholder: 'Ex: Commun, Elfique, Draconique...'
        },
        {
          name: 'subtitle',
          label: 'Nom natif',
          type: 'text',
          placeholder: 'Nom du langage dans sa propre langue'
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
          label: 'Système d\'écriture / Alphabet',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 4,
          placeholder: 'Origines, évolution historique, caractéristiques...'
        }
      ]
    },
    {
      id: 'writing',
      label: 'Écriture & Phonétique',
      icon: BookText,
      fields: [
        {
          name: 'script',
          label: 'Système d\'écriture',
          type: 'text',
          placeholder: 'Alphabet, Idéogrammes, Runes...'
        },
        {
          name: 'phonetics',
          label: 'Phonétique',
          type: 'textarea',
          rows: 3,
          placeholder: 'Sons caractéristiques, prononciation...'
        },
        {
          name: 'grammar',
          label: 'Structure grammaticale',
          type: 'textarea',
          rows: 3,
          placeholder: 'Construction des phrases, règles principales...'
        },
        {
          name: 'vocabulary_examples',
          label: 'Lexique & Exemples',
          type: 'textarea',
          rows: 4,
          placeholder: 'Mots et phrases courantes...'
        }
      ]
    },
    {
      id: 'speakers',
      label: 'Locuteurs',
      icon: Users,
      fields: [
        {
          name: 'speakers',
          label: 'Utilisateurs principaux',
          type: 'textarea',
          rows: 3,
          placeholder: 'Races, peuples, régions...'
        },
        {
          name: 'rarity',
          label: 'Fréquence d\'usage',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'exotic', label: 'Exotique' },
            { value: 'secret', label: 'Secret' }
          ]
        },
        {
          name: 'dialects',
          label: 'Variantes & Dialectes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Variations régionales...'
        }
      ]
    },
    {
      id: 'cultural',
      label: 'Aspects culturels',
      icon: Info,
      fields: [
        {
          name: 'cultural_significance',
          label: 'Importance culturelle',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rôle social, traditions liées...'
        },
        {
          name: 'related_languages',
          label: 'Langages parents',
          type: 'textarea',
          rows: 2,
          placeholder: 'Langues mères, influences...'
        },
        {
          name: 'learning_difficulty',
          label: 'Difficulté d\'apprentissage',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
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
          name: 'language_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'script', label: 'Écriture' },
            { id: 'examples', label: 'Exemples' },
            { id: 'historical', label: 'Documents' }
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
          name: 'secret_uses',
          label: 'Codes & Usages occultes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Sorts, rituels, messages cryptés...'
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

export default function LanguagesPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('languages').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('languages').delete().eq('id', deleteConfirm.item.id);
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
        title="Oublier le Langage"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} ? Les textes anciens deviendront indéchiffrables.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="languages"
        title="Langages"
        icon={Languages}
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
        config={languagesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={languagesConfig}
      />
    </div>
  );
}