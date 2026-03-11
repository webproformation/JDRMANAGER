// src/data/rulesets/rdd.js
import { Shield, Sword, Heart, Brain, Eye, Activity, Smile, Star, Zap, Hand, Music, Scale } from 'lucide-react';

export const rdd = {
  id: 'rdd',
  name: 'Rêve de Dragon',
  color: 'text-blue-400',
  magicConfig: {
    type: 'points',
    resourceKey: 'reve',
    hasPreparation: true, 
    castingStats: ['intellect', 'reve']
  },
  worldFields: [
    { name: 'dream_stability', label: 'Stabilité du Rêve', type: 'select', options: [{value:'clear', label:'Rêve Clair'}, {value:'grey', label:'Gris-Rêve'}, {value:'nightmare', label:'Cauchemar'}] }
  ],
  geoFields: [
    { 
      name: 'grey_dream_intensity', 
      label: 'Intensité du Gris-Rêve local', 
      type: 'select', 
      options: [
        {value:'none', label:'Aucune'},
        {value:'low', label:'Légère'},
        {value:'moderate', label:'Modérée'},
        {value:'strong', label:'Forte'}
      ] 
    }
  ],
  deityFields: [
    { name: 'dream_level', label: 'Niveau d\'Existence Onirique', type: 'number' }
  ],
  raceFields: [
    { name: 'reve_bonus', label: 'Bonus de Rêve Inné', type: 'number' }
  ],
  classFields: [
    { name: 'skill_domain', label: 'Domaine de Compétence', type: 'text' }
  ],
  monsterFields: [
    { name: 'breath', label: 'Souffle de Dragon', type: 'number' }
  ],
  celestialFields: [
    { name: 'dream_tide', label: 'Influence sur les Marées de Rêve', type: 'text' }
  ],
  itemFields: [
    { name: 'oniric_weight', label: 'Poids Onirique', type: 'number' }
  ],
  groups: [
    {
      id: 'attributes',
      label: 'Caractéristiques',
      layout: 'grid-3',
      fields: [
        { key: 'taille', label: 'Taille', type: 'number', icon: Scale, derived: true },
        { key: 'apparence', label: 'Apparence', type: 'number', icon: Smile },
        { key: 'constitution', label: 'Constitution', type: 'number', icon: Heart },
        { key: 'force', label: 'Force', type: 'number', icon: Sword, derived: true },
        { key: 'agilite', label: 'Agilité', type: 'number', icon: Activity, derived: true },
        { key: 'dexterite', label: 'Dextérité', type: 'number', icon: Hand },
        { key: 'vue', label: 'Vue', type: 'number', icon: Eye },
        { key: 'ouie', label: 'Ouïe', type: 'number', icon: Music },
        { key: 'volonte', label: 'Volonté', type: 'number', icon: Shield },
        { key: 'intellect', label: 'Intellect', type: 'number', icon: Brain },
        { key: 'reve', label: 'Rêve', type: 'number', icon: Star, theme: 'purple', derived: true },
        { key: 'chance', label: 'Chance', type: 'number', icon: Zap, theme: 'yellow', derived: true }
      ]
    }
  ]
};