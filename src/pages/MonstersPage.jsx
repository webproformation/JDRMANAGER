// src/pages/MonstersPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Skull, Info, Swords, Heart, TreePine, Scroll, ImageIcon, Shield, Plus, Minus, Zap, Target, Sword, ChevronDown, Skull as SkullIcon } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import VTTDialog from '../components/VTTDialog'; // Import du dialogue Prestige
import { supabase } from '../lib/supabase';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import { DEFAULT_RULESETS } from '../data/rulesets';
import { calculateCombatStats } from '../utils/rulesEngine';

// --- COMPOSANT INTERNE : LE SÉLECTEUR GLAMOUR (VTT PREMIUM) ---
const VTTSelectLocal = ({ value, options = [], onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value || opt.value == value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`vtt-select flex items-center justify-between cursor-pointer transition-all min-h-[38px] py-1.5 px-3 ${
          isOpen ? 'border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : ''
        }`}
      >
        <span className={`truncate text-[11px] font-bold tracking-wider ${value ? 'text-white' : 'text-silver/30'}`}>
          {selectedOption ? selectedOption.label : (placeholder || 'Choisir...')}
        </span>
        <span className="text-teal-500 transition-transform duration-300">
          <ChevronDown size={14} className={`${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-[200] w-full mt-1 bg-[#0f111a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:bg-teal-500/10 hover:text-teal-400 border-b border-white/5 last:border-0 ${
                  value === opt.value ? 'bg-teal-500/20 text-teal-300' : 'text-silver/60'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

const monstersConfig = {
  entityName: 'le monstre',
  tableName: 'monsters',
  title: 'Monstres',
  getHeaderIcon: () => Skull,
  getHeaderColor: () => 'from-red-600/30 via-orange-600/20 to-yellow-600/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      columns: 3,
      fields: [
        { name: 'image_url', label: 'Image principale', type: 'image' },
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
          name: 'name',
          label: 'Nom du monstre',
          type: 'text',
          required: true,
          placeholder: 'Ex: Dragon rouge, Gobelin, Liche...'
        },
        {
          name: 'subtitle',
          label: 'Titre ou surnom',
          type: 'text',
          placeholder: 'Ex: Fléau des montagnes, Terreur des forêts...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'type',
          label: 'Type de créature',
          type: 'text',
          placeholder: 'Ex: Aberration, Mort-vivant...'
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'text',
          placeholder: 'Ex: Gigantesque, Moyen...'
        },
        {
          name: 'alignment',
          label: 'Alignement',
          type: 'select',
          options: [
            { value: 'LG', label: 'Loyal Bon' },
            { value: 'NG', label: 'Neutre Bon' },
            { value: 'CG', label: 'Chaotique Bon' },
            { value: 'LN', label: 'Loyal Neutre' },
            { value: 'N', label: 'Neutre' },
            { value: 'CN', label: 'Chaotique Neutre' },
            { value: 'LE', label: 'Loyal Mauvais' },
            { value: 'NE', label: 'Neutre Mauvais' },
            { value: 'CE', label: 'Chaotique Mauvais' },
            { value: 'unaligned', label: 'Non aligné' }
          ]
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, comportement général...'
        },
        {
          name: 'dynamic_monster_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, item, onChange }) => {
            const data = formData || item || {};
            return (
              <RulesetDynamicFields 
                rulesetId={data.ruleset_id || 'dnd5'} 
                entityType="monster" 
                formData={data} 
                onChange={onChange} 
              />
            );
          }
        }
      ]
    },
    {
      id: 'combat',
      label: 'Statistiques de combat',
      icon: Swords,
      columns: 3,
      fields: [
        {
          name: 'stats',
          label: 'Caractéristiques Principales',
          type: 'stats-editor',
          component: ConnectedStatsEditor,
          fullWidth: true,
          isVirtual: true
        },
        {
          name: 'armor_class',
          label: "Classe d'armure (CA)",
          type: 'number',
          required: true,
          placeholder: '15'
        },
        {
          name: 'hit_points',
          label: 'Points de vie',
          type: 'text',
          required: true,
          placeholder: 'Ex: 45 (6d8+18)'
        },
        {
          name: 'speed',
          label: 'Vitesse',
          type: 'text',
          placeholder: 'Ex: 9m, vol 18m'
        },
        {
          name: 'challenge_rating',
          label: 'Facteur de puissance',
          type: 'text',
          placeholder: 'Ex: 5 (1800 XP)'
        },
        {
          name: 'abilities',
          label: 'Capacités & Traits',
          type: 'textarea',
          rows: 5,
          fullWidth: false,
          placeholder: 'Traits spéciaux, résistances, immunités...'
        },
        {
          name: 'actions',
          label: 'Actions',
          type: 'textarea',
          rows: 5,
          fullWidth: false,
          placeholder: 'Attaques, actions spéciales...'
        },
        {
          name: 'legendary_actions',
          label: 'Actions légendaires',
          type: 'textarea',
          rows: 5,
          fullWidth: false,
          placeholder: 'Actions légendaires (pour créatures puissantes)'
        }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie & Comportement',
      icon: TreePine,
      columns: 3,
      fields: [
        {
          name: 'habitat_description',
          label: 'Habitat',
          type: 'textarea',
          rows: 5,
          placeholder: 'Environnement préféré, territoires...'
        },
        {
          name: 'behavior_patterns',
          label: 'Schémas de comportement',
          type: 'textarea',
          rows: 5,
          placeholder: 'Agressivité, intelligence, tactiques...'
        },
        {
          name: 'social_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 5,
          placeholder: 'Solitaire, meute, colonie...'
        },
        {
          name: 'diet',
          label: 'Régime alimentaire',
          type: 'text',
          placeholder: 'Ex: Carnivore, herbivore, omnivore...'
        },
        {
          name: 'lifespan',
          label: 'Durée de vie',
          type: 'text',
          placeholder: 'Ex: 50 ans, immortel...'
        }
      ]
    },
    {
      id: 'lore',
      label: 'Histoire & Légendes',
      icon: Scroll,
      columns: 3,
      fields: [
        {
          name: 'lore',
          label: 'Histoire et légendes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Mythes, légendes, récits historiques...'
        },
        {
          name: 'variants',
          label: 'Variantes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Sous-espèces, variantes régionales...'
        },
        {
          name: 'treasure_typical',
          label: 'Trésor typique',
          type: 'textarea',
          rows: 5,
          placeholder: 'Butin habituel, objets gardés...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'monster_images',
          label: 'Images du monstre',
          type: 'images',
          bucket: 'images',
          render: () => null,
          categories: [
            { id: 'full', label: 'Corps entier' },
            { id: 'action', label: 'En action' },
            { id: 'lair', label: 'Repaire' },
            { id: 'variants', label: 'Variantes' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Tactiques MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'encounter_tips',
          label: 'Conseils de rencontre',
          type: 'textarea',
          rows: 5,
          placeholder: 'Comment utiliser cette créature efficacement...'
        },
        {
          name: 'gm_tactics',
          label: 'Tactiques de combat',
          type: 'textarea',
          rows: 5,
          placeholder: 'Stratégies, pièges, comportement en combat...'
        },
        {
          name: 'notes',
          label: 'Notes MJ',
          type: 'textarea',
          rows: 5
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

  // ÉTAT POUR LE DIALOGUE DE SUPPRESSION PERSO
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const handleView = (item) => setSelectedItem(item);
  
  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
  };

  // LOGIQUE DE SUPPRESSION PRESTIGE
  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    try {
      const { error } = await supabase.from('monsters').delete().eq('id', item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur technique lors de la suppression.");
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Exterminer le Monstre"
        message={`Voulez-vous vraiment effacer ${deleteConfirm.item?.name} du bestiaire ? Cette créature disparaîtra de toutes vos rencontres prévues.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="monsters"
        title="Monstres"
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => openDeleteDialog(selectedItem)} // Utilisation du VTTDialog
        item={selectedItem}
        config={monstersConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={monstersConfig}
      />
    </>
  );
}