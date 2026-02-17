import { 
  Shield, Sword, Heart, Zap, Brain, Eye, Activity, Feather, 
  Ghost, BookOpen, Smile, Scale, Star, Hand, Crown, 
  Music, HeartPulse, Flame, Target, Footprints, Hammer, Crosshair, Skull, Sparkles, Wand2
} from 'lucide-react';

export const DEFAULT_RULESETS = {
  
  // ==================================================================================
  // DUNGEONS & DRAGONS 5E (SYSTÈME DIVIN)
  // ==================================================================================
  'dnd5': {
    id: 'dnd5',
    name: 'Dungeons & Dragons 5e',
    groups: [
      {
        id: 'attributes',
        label: 'Caractéristiques',
        layout: 'grid-3',
        fields: [
          { key: 'str', label: 'Force', type: 'number', icon: Sword, derived: true },
          { key: 'dex', label: 'Dextérité', type: 'number', icon: Feather, derived: true },
          { key: 'con', label: 'Constitution', type: 'number', icon: Heart, derived: true },
          { key: 'int', label: 'Intelligence', type: 'number', icon: Brain, derived: true },
          { key: 'wis', label: 'Sagesse', type: 'number', icon: Eye, derived: true },
          { key: 'cha', label: 'Charisme', type: 'number', icon: Crown, derived: true }
        ]
      },
      {
        id: 'vitals',
        label: 'Signes Vitaux (Calcul automatique)',
        layout: 'grid-4',
        fields: [
          { key: 'hp', label: 'Points de Vie', type: 'progress', max: 100, theme: 'red', derived: true },
          { key: 'ac', label: 'Armure (CA)', type: 'number', icon: Shield, derived: true },
          { key: 'init', label: 'Initiative', type: 'number', prefix: '+', derived: true },
          { key: 'prof', label: 'Maîtrise', type: 'number', prefix: '+', icon: Star, derived: true }
        ]
      },
      {
        id: 'progression',
        label: 'Capacités & Talents (Interactif)',
        layout: 'grid-2',
        fields: [
          { 
            key: 'class_features', 
            label: 'Capacités de Classe', 
            type: 'relation-list', 
            table: 'class_features', 
            filterBy: 'class_id', // Filtre auto selon la classe du perso
            icon: Shield 
          },
          { 
            key: 'talents', 
            label: 'Talents & Dons', 
            type: 'relation-list', 
            table: 'talents',
            icon: Star 
          }
        ]
      },
      {
        id: 'magic_stats',
        label: 'Potentiel Magique',
        layout: 'grid-2',
        fields: [
          { key: 'spell_slots', label: 'Emplacements de Sorts', type: 'textarea', icon: Sparkles, derived: true },
          { 
            key: 'spells', 
            label: 'Sorts Connus (Grimoire)', 
            type: 'relation-list', 
            table: 'spells', 
            filterBy: 'class_id', // Ne montre que les sorts de sa classe
            icon: Wand2 
          }
        ]
      },
      {
        id: 'skills',
        label: 'Compétences',
        layout: 'grid-4',
        fields: [
          { key: 'acrobatics', label: 'Acrobatie', type: 'check_number', parentStat: 'dex' },
          { key: 'animal', label: 'Dressage', type: 'check_number', parentStat: 'wis' },
          { key: 'arcana', label: 'Arcanes', type: 'check_number', parentStat: 'int' },
          { key: 'athletics', label: 'Athlétisme', type: 'check_number', parentStat: 'str' },
          { key: 'deception', label: 'Tromperie', type: 'check_number', parentStat: 'cha' },
          { key: 'history', label: 'Histoire', type: 'check_number', parentStat: 'int' },
          { key: 'insight', label: 'Perspicacité', type: 'check_number', parentStat: 'wis' },
          { key: 'intimidation', label: 'Intimidation', type: 'check_number', parentStat: 'cha' },
          { key: 'investigation', label: 'Investigation', type: 'check_number', parentStat: 'int' },
          { key: 'medicine', label: 'Médecine', type: 'check_number', parentStat: 'wis' },
          { key: 'nature', label: 'Nature', type: 'check_number', parentStat: 'int' },
          { key: 'perception', label: 'Perception', type: 'check_number', parentStat: 'wis' },
          { key: 'performance', label: 'Représentation', type: 'check_number', parentStat: 'cha' },
          { key: 'persuasion', label: 'Persuasion', type: 'check_number', parentStat: 'cha' },
          { key: 'religion', label: 'Religion', type: 'check_number', parentStat: 'int' },
          { key: 'sleight', label: 'Escamotage', type: 'check_number', parentStat: 'dex' },
          { key: 'stealth', label: 'Discrétion', type: 'check_number', parentStat: 'dex' },
          { key: 'survival', label: 'Survie', type: 'check_number', parentStat: 'wis' }
        ]
      }
    ]
  },

  // ==================================================================================
  // APPEL DE CTHULHU 7E
  // ==================================================================================
  'cthulhu': {
    id: 'cthulhu',
    name: 'L\'Appel de Cthulhu 7e',
    groups: [
      {
        id: 'characteristics',
        label: 'Caractéristiques',
        layout: 'grid-3',
        fields: [
          { key: 'str', label: 'Force (FOR)', type: 'number', icon: Sword, derived: true },
          { key: 'con', label: 'Constitution (CON)', type: 'number', icon: Heart, derived: true },
          { key: 'siz', label: 'Taille (TAI)', type: 'number', icon: Scale, derived: true },
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
      },
      {
        id: 'skills',
        label: 'Compétences (%)',
        layout: 'grid-4',
        fields: [
          { key: 'spot_hidden', label: 'Trouver Obj.', type: 'check_number', suffix: '%' },
          { key: 'listen', label: 'Écouter', type: 'check_number', suffix: '%' },
          { key: 'library', label: 'Bibliothèque', type: 'check_number', suffix: '%' },
          { key: 'psychology', label: 'Psychologie', type: 'check_number', suffix: '%' },
          { key: 'fighting', label: 'Corps à corps', type: 'check_number', suffix: '%' },
          { key: 'firearms', label: 'Armes à feu', type: 'check_number', suffix: '%' },
          { key: 'stealth', label: 'Discrétion', type: 'check_number', suffix: '%' },
          { key: 'mythos', label: 'Mythe', type: 'check_number', suffix: '%', color: 'text-purple-400' }
        ]
      }
    ]
  },

  // ==================================================================================
  // ROLEMASTER (FRP)
  // ==================================================================================
  'rolemaster': {
    id: 'rolemaster',
    name: 'Rolemaster (FRP)',
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
      },
      {
        id: 'status',
        label: 'État Vital',
        layout: 'grid-4',
        fields: [
          { key: 'hits', label: 'Points de Coups', type: 'progress', max: 150, theme: 'red' },
          { key: 'pp', label: 'Points de Pouvoir', type: 'progress', max: 50, theme: 'blue' }
        ]
      }
    ]
  },

  // ==================================================================================
  // RÊVE DE DRAGON
  // ==================================================================================
  'rdd': {
    id: 'rdd',
    name: 'Rêve de Dragon',
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
      },
      {
        id: 'sante',
        label: 'Santé & Moral',
        layout: 'grid-4',
        fields: [
          { key: 'endurance', label: 'Endurance', type: 'progress', max: 30, theme: 'red' },
          { key: 'seuil', label: 'Seuil Blessure', type: 'number', icon: Shield },
          { key: 'moral', label: 'Moral', type: 'progress', max: 20, theme: 'blue' }
        ]
      }
    ]
  },

  // ==================================================================================
  // RUNEQUEST
  // ==================================================================================
  'runequest': {
    id: 'runequest',
    name: 'RuneQuest',
    groups: [
      {
        id: 'runes',
        label: 'Caractéristiques',
        layout: 'grid-3',
        fields: [
          { key: 'str', label: 'STR (Force)', type: 'number', icon: Sword, derived: true },
          { key: 'con', label: 'CON (Constit.)', type: 'number', icon: Heart, derived: true },
          { key: 'siz', label: 'SIZ (Taille)', type: 'number', icon: Scale, derived: true },
          { key: 'dex', label: 'DEX (Dextérité)', type: 'number', icon: Feather, derived: true },
          { key: 'int', label: 'INT (Intellig.)', type: 'number', icon: Brain, derived: true },
          { key: 'pow', label: 'POW (Pouvoir)', type: 'number', icon: Zap, derived: true },
          { key: 'cha', label: 'CHA (Charisme)', type: 'number', icon: Crown, derived: true }
        ]
      },
      {
        id: 'status',
        label: 'État',
        layout: 'grid-4',
        fields: [
          { key: 'hp', label: 'HP Global', type: 'progress', max: 20, theme: 'red' },
          { key: 'mp', label: 'Magic Points', type: 'progress', max: 20, theme: 'blue' }
        ]
      }
    ]
  }
};