// src/data/rulesets/runequest.js
import { Shield, Sword, Heart, Brain, Feather, Star, Crown, Scale, Zap } from 'lucide-react';

export const runequest = {
  id: 'runequest',
  name: 'RuneQuest',
  color: 'text-cyan-400',
  magicConfig: {
    type: 'points',
    resourceKey: 'mp',
    castingStats: ['pow']
  },
  worldFields: [
    { name: 'mythic_resonance', label: 'Résonance Mythique', type: 'text' }
  ],
  geoFields: [
    { 
      name: 'rune_modifier', 
      label: 'Modificateur de Rune local', 
      type: 'select',
      options: [
        {value:'minor', label:'Mineur (+5%)'},
        {value:'standard', label:'Standard (+10%)'},
        {value:'major', label:'Majeur (+20%)'}
      ]
    }
  ],
  deityFields: [
    { name: 'associated_runes', label: 'Runes Associées', type: 'text', placeholder: 'Ex: Air, Mort, Harmonie...' }
  ],
  raceFields: [
    { name: 'origin_region', label: 'Région d\'origine', type: 'text' }
  ],
  classFields: [
    { name: 'cult_affiliation', label: 'Affiliation Cultuelle', type: 'text' }
  ],
  monsterFields: [
    { name: 'location_hp', label: 'HP par Localisation', type: 'textarea', placeholder: 'Tête, Bras, Jambes...' }
  ],
  celestialFields: [
    { name: 'planetary_rune', label: 'Rune Planétaire Dominante', type: 'text' }
  ],
  itemFields: [
    { name: 'rune_compatibility', label: 'Compatibilité Runique', type: 'text' }
  ],
  groups: [
    {
      id: 'runes',
      label: 'Caractéristiques',
      layout: 'grid-3',
      fields: [
        { key: 'str', label: 'STR (Force)', type: 'number', icon: Sword, derived: true },
        { key: 'con', label: 'CON (Constit.)', type: 'number', icon: Heart, derived: true },
        { key: 'siz', label: 'SIZ (Taille)', type: 'number', icon: Scale, derived: true },
        { key: 'dex', label: 'Dextérité (DEX)', type: 'number', icon: Feather, derived: true },
        { key: 'int', label: 'INT (Intellig.)', type: 'number', icon: Brain, derived: true },
        { key: 'pow', label: 'Pouvoir (POU)', type: 'number', icon: Star, derived: true }, // Remplacé Zap par Star pour varier un peu comme RQ est mystique
        { key: 'cha', label: 'Charisme (CHA)', type: 'number', icon: Crown, derived: true }
      ]
    }
  ]
};