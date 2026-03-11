// src/data/ruleset_definitions/cthulhu.js
import { 
  Shield, Sword, Heart, Zap, Brain, Eye, Smile, BookOpen, Star, Feather 
} from 'lucide-react';

export const cthulhu = {
  id: 'cthulhu',
  name: 'L\'Appel de Cthulhu 7e',
  color: 'text-emerald-500',

  magicConfig: {
    type: 'points',
    resourceKey: 'magic', 
    hasSanityCost: true,
    hasPreparation: false,
    castingStats: ['pow']
  },

  worldFields: [
    { 
      name: 'mythos_exposure', 
      label: 'Exposition au Mythe', 
      type: 'select', 
      options: [
        {value:'low', label:'Occulte voilé'}, 
        {value:'medium', label:'Influences visibles'}, 
        {value:'high', label:'Apocalyptique'}
      ] 
    },
    { 
      name: 'sanity_era', 
      label: 'Époque de Santé Mentale', 
      type: 'text', 
      placeholder: 'Ex: Années 20, Moderne, Gazlight...' 
    }
  ],
  geoFields: [
    { 
      name: 'sanity_drain', 
      label: 'Drain de SAN local', 
      type: 'select', 
      options: [
        {value:'none', label:'Aucun'},
        {value:'1d4', label:'Faible (1d4)'},
        {value:'1d10', label:'Moyen (1d10)'},
        {value:'1d100', label:'Fatal (1d100)'}
      ] 
    },
    { 
      name: 'mythos_relics', 
      label: 'Vestiges du Mythe', 
      type: 'textarea', 
      placeholder: 'Statuettes, manuscrits interdits...' 
    }
  ],
  deityFields: [
    { 
      name: 'sanity_loss', 
      label: 'Perte de SAN (Moyenne)', 
      type: 'text', 
      placeholder: 'Ex: 1d10/1d100' 
    },
    { 
      name: 'mythos_ranking', 
      label: 'Classement du Mythe', 
      type: 'select', 
      options: [
        {value:'outer_god', label:'Dieu Extérieur'}, 
        {value:'elder_god', label:'Dieu Très Ancien'}, 
        {value:'great_old_one', label:'Grand Ancien'}
      ] 
    }
  ],
  raceFields: [
    { name: 'build', label: 'Carrure (Build)', type: 'number', placeholder: '0' }
  ],
  classFields: [
    { name: 'credit_rating', label: 'Niveau de Vie (CR %)', type: 'text', placeholder: 'Ex: 10% - 45%' }
  ],
  monsterFields: [
    { name: 'move', label: 'Mouvement (MOV)', type: 'number' },
    { name: 'armor_points', label: 'Points d\'Armure', type: 'text' }
  ],
  celestialFields: [
    { name: 'cosmic_horror_level', label: 'Degré d\'Horreur Cosmique', type: 'text' }
  ],
  itemFields: [
    { name: 'malfunction', label: 'Seuil d\'enrayage', type: 'number' }
  ],

  groups: [
    {
      id: 'characteristics',
      label: 'Caractéristiques',
      layout: 'grid-3',
      fields: [
        { key: 'str', label: 'Force (FOR)', type: 'number', icon: Sword, derived: true },
        { key: 'con', label: 'Constitution (CON)', type: 'number', icon: Heart, derived: true },
        { key: 'siz', label: 'Taille (TAI)', type: 'number', icon: Star, derived: true },
        { key: 'dex', label: 'Dextérité (DEX)', type: 'number', icon: Feather, derived: true },
        { key: 'app', label: 'Apparence (APP)', type: 'number', icon: Smile, derived: true },
        { key: 'int', label: 'Intelligence (INT)', type: 'number', icon: Brain, derived: true },
        { key: 'pow', label: 'Pouvoir (POU)', type: 'number', icon: Zap, derived: true },
        { key: 'edu', label: 'Éducation (EDU)', type: 'number', icon: BookOpen, derived: true }
      ]
    },
    {
      id: 'mental',
      label: 'État Mental & Physique',
      layout: 'grid-4',
      fields: [
        { key: 'san', label: 'Santé Mentale', type: 'progress', max: 99, theme: 'purple', derived: true },
        { key: 'hp', label: 'Points de Vie', type: 'progress', max: 20, theme: 'red', derived: true },
        { key: 'luck', label: 'Chance', type: 'progress', max: 99, theme: 'yellow', derived: true },
        { key: 'magic', label: 'Points de Magie', type: 'progress', max: 20, theme: 'blue', derived: true }
      ]
    }
  ]
};