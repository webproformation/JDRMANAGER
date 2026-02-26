// src/pages/MonstersPage.jsx
import React, { useState } from 'react';
import { Skull, Info, Swords, Heart, TreePine, Scroll, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { supabase } from '../lib/supabase';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import { DEFAULT_RULESETS } from '../data/rulesets';
import { calculateCombatStats } from '../utils/rulesEngine';

// --- WRAPPER POUR L'ÉDITEUR DE STATS ---
const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  // Utilise le ruleset_id du formulaire ou dnd5 par défaut
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5']; 
  
  const handleStatsChange = (newStats) => {
    // Calcul automatique (ex: Initiative basée sur la Dextérité)
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
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_monster_fields', // INJECTEUR DYNAMIQUE (AJOUTÉ)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="monster" 
              formData={formData} 
              onChange={onChange} 
            />
          )
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
          name: 'image_url',
          label: 'Image principale',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Apparence, comportement général...'
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'select',
          required: true,
          options: [
            { value: 'Minuscule', label: 'Minuscule' },
            { value: 'Très Petit', label: 'Très Petit' },
            { value: 'Petit', label: 'Petit' },
            { value: 'Moyen', label: 'Moyen' },
            { value: 'Grand', label: 'Grand' },
            { value: 'Très Grand', label: 'Très Grand' },
            { value: 'Gigantesque', label: 'Gigantesque' }
          ]
        },
        {
          name: 'type',
          label: 'Type de créature',
          type: 'select',
          options: [
            { value: 'aberration', label: 'Aberration' },
            { value: 'beast', label: 'Bête' },
            { value: 'celestial', label: 'Céleste' },
            { value: 'construct', label: 'Créature artificielle' },
            { value: 'dragon', label: 'Dragon' },
            { value: 'elemental', label: 'Élémentaire' },
            { value: 'fey', label: 'Fée' },
            { value: 'fiend', label: 'Fiélon' },
            { value: 'giant', label: 'Géant' },
            { value: 'humanoid', label: 'Humanoïde' },
            { value: 'monstrosity', label: 'Monstruosité' },
            { value: 'ooze', label: 'Vase' },
            { value: 'plant', label: 'Plante' },
            { value: 'undead', label: 'Mort-vivant' }
          ]
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
        }
      ]
    },
    {
      id: 'combat',
      label: 'Statistiques de combat',
      icon: Swords,
      fields: [
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
          name: 'stats',
          label: 'Caractéristiques Principales',
          type: 'stats-editor',
          component: ConnectedStatsEditor
        },
        {
          name: 'abilities',
          label: 'Capacités & Traits',
          type: 'textarea',
          rows: 5,
          placeholder: 'Traits spéciaux, résistances, immunités...'
        },
        {
          name: 'actions',
          label: 'Actions',
          type: 'textarea',
          rows: 4,
          placeholder: 'Attaques, actions spéciales...'
        },
        {
          name: 'legendary_actions',
          label: 'Actions légendaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Actions légendaires (pour créatures puissantes)'
        }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie & Comportement',
      icon: TreePine,
      fields: [
        {
          name: 'habitat_description',
          label: 'Habitat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Environnement préféré, territoires...'
        },
        {
          name: 'behavior_patterns',
          label: 'Schémas de comportement',
          type: 'textarea',
          rows: 4,
          placeholder: 'Agressivité, intelligence, tactiques...'
        },
        {
          name: 'diet',
          label: 'Régime alimentaire',
          type: 'text',
          placeholder: 'Ex: Carnivore, herbivore, omnivore...'
        },
        {
          name: 'social_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 3,
          placeholder: 'Solitaire, meute, colonie...'
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
          rows: 3,
          placeholder: 'Sous-espèces, variantes régionales...'
        },
        {
          name: 'treasure_typical',
          label: 'Trésor typique',
          type: 'textarea',
          rows: 3,
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
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ
      label: 'Tactiques MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'encounter_tips',
          label: 'Conseils de rencontre',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment utiliser cette créature efficacement...'
        },
        {
          name: 'gm_tactics',
          label: 'Tactiques de combat',
          type: 'textarea',
          rows: 4,
          placeholder: 'Stratégies, pièges, comportement en combat...'
        },
        {
          name: 'notes',
          label: 'Notes MJ',
          type: 'textarea',
          rows: 3
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
  const handleDelete = async () => {
    if (!selectedItem || !window.confirm('Supprimer ce monstre ?')) return;
    try {
      const { error } = await supabase.from('monsters').delete().eq('id', selectedItem.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <>
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
        onDelete={handleDelete}
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