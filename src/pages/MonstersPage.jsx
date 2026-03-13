import { useState } from 'react';
import { Skull, Info, Swords, Heart, TreePine, Scroll, ImageIcon, Shield, Plus, Minus, Zap, Target, Sword, Globe, Sparkles } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import VTTDialog from '../components/VTTDialog';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
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
    <DynamicStatsEditor 
      ruleset={currentRuleset} 
      data={value || {}} 
      onChange={handleStatsChange} 
    />
  );
};

// --- CONFIGURATION PRESTIGE V4.2 - MONSTRES ---
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
      fields: [
        { name: 'image_url', label: 'Illustration du Monstre', type: 'image' },
        {
          name: 'name',
          label: 'Nom de la Créature',
          type: 'text',
          required: true,
          placeholder: 'Ex: Dragon Rouge Adulte, Beholder...'
        },
        {
          name: 'subtitle',
          label: 'Titre ou Épithète',
          type: 'text',
          placeholder: 'Ex: Le Fléau des Cieux...'
        },
        {
          name: 'ruleset_id',
          label: 'Système de Référence',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'world_id',
          label: 'Ancrage Multiversel',
          type: 'relation',
          table: 'worlds',
          isVirtual: true // Géré par world_links V4.2
        },
        {
          name: 'type',
          label: 'Type de Créature',
          type: 'text',
          placeholder: 'Ex: Dragon, Aberration...'
        },
        {
          name: 'size',
          label: 'Catégorie de Taille',
          type: 'text',
          placeholder: 'Ex: Gigantesque, Grand...'
        },
        {
          name: 'alignment',
          label: 'Alignement Typique',
          type: 'text',
          placeholder: 'Ex: Chaotique Mauvais...'
        },
        {
          name: 'description',
          label: 'Description Fondamentale',
          type: 'textarea',
          rows: 5,
          fullWidth: true,
          placeholder: 'Apparence, aura, présence physique...'
        }
      ]
    },
    {
      id: 'combat',
      label: 'Combat & VTT',
      icon: Swords,
      fields: [
        {
          name: 'stats',
          label: 'Bloc de Caractéristiques',
          type: 'stats-editor',
          component: ConnectedStatsEditor,
          fullWidth: true,
          isVirtual: true
        },
        {
          name: 'dynamic_monster_fields', 
          label: 'Propriétés Spécifiques au Système',
          type: 'custom',
          isVirtual: true,
          fullWidth: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="monster" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'armor_class',
          label: "Classe d'Armure",
          type: 'number',
          placeholder: '15'
        },
        {
          name: 'hit_points',
          label: 'Points de Vie',
          type: 'text',
          placeholder: 'Ex: 136 (13d10 + 65)'
        },
        {
          name: 'challenge_rating',
          label: 'Indice de Dangerosité (CR)',
          type: 'text',
          placeholder: 'Ex: 12 (8,400 XP)'
        },
        {
          name: 'abilities',
          label: 'Traits & Capacités Passives',
          type: 'textarea',
          rows: 5,
          placeholder: 'Résistance magique, Odorat fin...'
        },
        {
          name: 'actions',
          label: 'Actions d\'Attaque',
          type: 'textarea',
          rows: 5,
          placeholder: 'Multi-attaque, Souffle, Griffes...'
        },
        {
          name: 'legendary_actions',
          label: 'Actions Légendaires / de Repaire',
          type: 'textarea',
          rows: 4,
          placeholder: 'Actions hors tour du monstre...'
        }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie',
      icon: TreePine,
      fields: [
        {
          name: 'habitat_description',
          label: 'Biotope & Territoire',
          type: 'text',
          placeholder: 'Ex: Volcans actifs, Ruines anciennes...'
        },
        {
          name: 'diet',
          label: 'Régime Alimentaire',
          type: 'text',
          placeholder: 'Ex: Carnivore strict...'
        },
        {
          name: 'behavior_patterns',
          label: 'Comportement & Instincts',
          type: 'textarea',
          rows: 4,
          placeholder: 'Tactiques de chasse, agressivité...'
        },
        {
          name: 'social_structure',
          label: 'Structure Sociale',
          type: 'text',
          placeholder: 'Ex: Solitaire, Meute de 4-12 individus...'
        }
      ]
    },
    {
      id: 'lore',
      label: 'Légendes',
      icon: Scroll,
      fields: [
        {
          name: 'lore',
          label: 'Mythes & Histoire',
          type: 'textarea',
          rows: 6,
          placeholder: 'Récits anciens et croyances populaires...'
        },
        {
          name: 'treasure_typical',
          label: 'Butin Typique',
          type: 'textarea',
          rows: 3,
          placeholder: 'Type de trésors conservés...'
        }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        {
          name: 'monster_images',
          label: 'Archives Visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'full', label: 'Spécimen' },
            { id: 'lair', label: 'Repaire' },
            { id: 'action', label: 'Combat' }
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
          name: 'gm_tactics',
          label: 'Guide de Maîtrise Tactique',
          type: 'textarea',
          rows: 5,
          placeholder: 'Comment jouer ce monstre pour terroriser vos PJ...'
        },
        {
          name: 'encounter_tips',
          label: 'Accroches de Rencontre',
          type: 'textarea',
          rows: 3,
          placeholder: 'Idées de scénarios...'
        },
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

export default function MonstersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('monsters').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <>
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Exterminer la Créature"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="monsters"
        title="Bestiaire"
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={() => { setEditingItem(null); setShowForm(true); }}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={monstersConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={monstersConfig}
      />
    </>
  );
}