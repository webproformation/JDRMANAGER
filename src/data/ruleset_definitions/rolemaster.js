// src/data/rulesets/rolemaster.js
import { Shield, Sword, Heart, Brain, Eye, Activity, BookOpen, Crown, Smile, Zap } from 'lucide-react';

export const rolemaster = {
  id: 'rolemaster',
  name: 'Rolemaster (FRP)',
  color: 'text-orange-500',
  magicConfig: {
    type: 'points',
    resourceKey: 'pp',
    castingStats: ['re', 'in', 'em']
  },
  worldFields: [
    { name: 'mana_level', label: 'Niveau de Mana Ambianale', type: 'number', placeholder: 'Ex: 1.0 (Normal)' }
  ],
  geoFields: [
    { name: 'static_action_mod', label: 'Modificateur d\'Action Statique', type: 'number', placeholder: '+5, -10...' }
  ],
  deityFields: [
    { name: 'essence_modifier', label: 'Modificateur d\'Essence', type: 'number' }
  ],
  raceFields: [
    { name: 'soul_stat', label: 'Statistique d\'Âme', type: 'number' }
  ],
  classFields: [
    { name: 'prime_requisite', label: 'Carac. de Prédilection', type: 'text' }
  ],
  monsterFields: [
    { name: 'level_rm', label: 'Niveau (RM)', type: 'number' },
    { name: 'atk_table', label: 'Table d\'Attaque', type: 'text' }
  ],
  celestialFields: [
    { name: 'mana_flare', label: 'Intensité des Éruptions de Mana', type: 'text' }
  ],
  itemFields: [
    { name: 'material_bonus', label: 'Bonus de Matériau', type: 'number' }
  ],
  groups: [
    {
      id: 'stats',
      label: 'Caractéristiques & Bonus',
      layout: 'grid-2',
      fields: [
        { key: 'co', label: 'Constitution (CO)', type: 'number', icon: Heart, derived: true },
        { key: 'ag', label: 'Agilité (AG)', type: 'number', icon: Activity, derived: true },
        { key: 'sd', label: 'Self-Control (SD)', type: 'number', icon: Shield, derived: true },
        { key: 'me', label: 'Mémoire (ME)', type: 'number', icon: BookOpen, derived: true },
        { key: 're', label: 'Raisonnement (RE)', type: 'number', icon: Brain, derived: true },
        { key: 'fo', label: 'Force (FO)', type: 'number', icon: Sword, derived: true },
        { key: 'qu', label: 'Rapidité (QU)', type: 'number', icon: Zap, derived: true },
        { key: 'pr', label: 'Présence (PR)', type: 'number', icon: Crown, derived: true },
        { key: 'in', label: 'Intuition (IN)', type: 'number', icon: Eye, derived: true },
        { key: 'em', label: 'Empathie (EM)', type: 'number', icon: Smile, derived: true }
      ]
    }
  ]
};