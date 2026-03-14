import { useState, useEffect } from 'react';
import { Flame, Info, Users, Target, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 

const sectsConfig = {
  entityName: 'la secte',
  tableName: 'sects',
  title: 'Sectes & Cultes',
  getHeaderIcon: () => Flame,
  getHeaderColor: () => 'from-red-600/30 via-rose-500/20 to-pink-500/30',

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
          name: 'dynamic_sect_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="geo" // Les organisations utilisent le moteur geo pour la structure
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la secte',
          type: 'text',
          required: true,
          placeholder: 'Ex: Culte du Soleil Noir, Cercle de l\'Ombre...'
        },
        {
          name: 'subtitle',
          label: 'Devise ou surnom',
          type: 'text',
          placeholder: 'Ex: Les Illuminés, Les Gardiens...'
        },
        {
          name: 'world_id',
          label: 'Monde d\'influence',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'image_url',
          label: 'Symbole de la secte',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Histoire, origine et présence physique...'
        }
      ]
    },
    {
      id: 'beliefs',
      label: 'Croyances & Dogmes',
      icon: Info,
      fields: [
        {
          name: 'beliefs',
          label: 'Croyances',
          type: 'textarea',
          rows: 5,
          placeholder: 'Doctrines, enseignements secrets, prophéties...'
        },
        {
          name: 'rituals',
          label: 'Rituels',
          type: 'textarea',
          rows: 4,
          placeholder: 'Cérémonies, sacrifices, pratiques quotidiennes...'
        },
        {
          name: 'deity_relation',
          label: 'Divinité vénérée',
          type: 'relation',
          table: 'deities',
          placeholder: 'Sélectionner une divinité (optionnel)'
        }
      ]
    },
    {
      id: 'structure',
      label: 'Organisation',
      icon: Users,
      fields: [
        {
          name: 'hierarchy',
          label: 'Hiérarchie',
          type: 'textarea',
          rows: 4,
          placeholder: 'Grande prêtresse, initiés, fidèles...'
        },
        {
          name: 'membership',
          label: 'Adhésion',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment rejoindre, épreuves, rituels d\'initiation...'
        },
        {
          name: 'members_count',
          label: 'Nombre de membres',
          type: 'text',
          placeholder: 'Ex: 50, plusieurs centaines...'
        }
      ]
    },
    {
      id: 'activities',
      label: 'Activités & Objectifs',
      icon: Target,
      fields: [
        {
          name: 'goals',
          label: 'Objectifs',
          type: 'textarea',
          rows: 4,
          placeholder: 'Buts ultimes, plans à court et long terme...'
        },
        {
          name: 'activities',
          label: 'Activités publiques/secrètes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Recrutement, rituels, complots...'
        },
        {
          name: 'reputation',
          label: 'Réputation mondiale',
          type: 'select',
          options: [
            { value: 'unknown', label: 'Inconnue' },
            { value: 'suspicious', label: 'Suspecte' },
            { value: 'feared', label: 'Crainte' },
            { value: 'hunted', label: 'Pourchassée' }
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
          name: 'sect_images',
          label: 'Iconographie de la secte',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'symbols', label: 'Symboles' },
            { id: 'rituals', label: 'Rituels' },
            { id: 'members', label: 'Membres' }
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
          name: 'secrets',
          label: 'Vérités cachées (Secrets)',
          type: 'textarea',
          rows: 4,
          placeholder: 'Vrais objectifs, manipulations, corruption...'
        },
        {
          name: 'hooks',
          label: 'Accroches de quête',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment intégrer la secte à votre campagne...'
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

export default function SectsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('sects').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('sects').delete().eq('id', deleteConfirm.item.id);
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
        title="Dissoudre le Culte"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des annales ? Ses adeptes et ses complots seront oubliés.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="sects"
        title="Sectes"
        icon={Flame}
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
        config={sectsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={sectsConfig}
      />
    </div>
  );
}