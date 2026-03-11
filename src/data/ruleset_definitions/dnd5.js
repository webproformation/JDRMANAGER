// src/data/ruleset_definitions/dnd5.js
import { 
  Shield, Sword, Heart, Brain, Eye, Feather, Star, Crown, 
  Zap, Activity, Ghost, BookOpen, Smile, Scale, Hand, 
  Music, HeartPulse, Flame, Target, Footprints, Hammer, Crosshair, Skull, Sparkles, Wand2
} from 'lucide-react';

export const dnd5 = {
  id: 'dnd5',
  name: 'Dungeons & Dragons 5e',
  color: 'text-red-500',

  // --- CONFIGURATION DE LA MAGIE ---
  magicConfig: {
    type: 'slots', 
    hasPreparation: true, 
    hasRituals: true, 
    hasConcentration: true, 
    castingStats: ['int', 'wis', 'cha'],
    saveDCBase: 8,
    componentTags: ['V', 'S', 'M']
  },

  // --- CHAMPS POUR LES MONDES (WorldPage) ---
  worldFields: [
    { 
      name: 'planar_structure', 
      label: 'Structure Planaire', 
      type: 'select', 
      options: [
        {value:'great_wheel', label:'Grande Roue (Cosmologie Classique)'}, 
        {value:'world_tree', label:'Arbre-Monde (Cosmologie Nordique)'}, 
        {value:'echoes', label:'Féerie et Ombre (Plans Échos)'},
        {value:'custom_spheres', label:'Sphères de Cristal / Multivers Custom'}
      ] 
    },
    { 
      name: 'weave_state', 
      label: 'État de la Trame Magique', 
      type: 'select',
      options: [
        {value:'stable', label:'Stable / Harmonieuse'},
        {value:'frayed', label:'Effilochée / Fragile'},
        {value:'dead', label:'Magie Morte'},
        {value:'wild', label:'Magie Sauvage (Chaos)'},
        {value:'corrupted', label:'Corrompue (Nécrotique/Abyssale)'}
      ]
    }
  ],

  // --- CHAMPS POUR LES CONTINENTS / RÉGIONS (geoFields) ---
  geoFields: [
    { 
      name: 'planar_convergence', 
      label: 'Convergence Planaire Majeure', 
      type: 'select',
      options: [
        { value: 'none', label: 'Aucune (Plan Matériel pur)' },
        { value: 'fey', label: 'Féerie (Nature exacerbée, Illusions)' },
        { value: 'shadow', label: 'Ombre (Nécrotique, Désespoir)' },
        { value: 'elemental_fire', label: 'Élémentaire de Feu (Chaleur, Volcans)' },
        { value: 'elemental_ice', label: 'Élémentaire de Glace (Froid extrême)' },
        { value: 'celestial', label: 'Céleste (Lumière, Ordre divin)' },
        { value: 'fiendish', label: 'Infernale/Abyssale (Corruption, Mal)' },
        { value: 'far_realm', label: 'Royaume Lointain (Folie, Aberrations)' }
      ]
    },
    { 
      name: 'magic_resonance', 
      label: 'Niveau de Magie locale', 
      type: 'select', 
      options: [
        {value:'null', label:'Magie Morte / Absente'},
        {value:'low', label:'Basse Magie (Très rare)'},
        {value:'standard', label:'Magie Standard (Fantasy classique)'},
        {value:'high', label:'Haute Magie (Omniprésente/Industrielle)'},
        {value:'wild', label:'Magie Sauvage (Imprévisible)'}
      ]
    },
    { 
      name: 'faction_influence', 
      label: 'Influence des Guildes/Factions', 
      type: 'select', 
      options: [
        {value:'none', label:'Nulle (Terre sauvage/Indépendante)'},
        {value:'low', label:'Présence Mineure'},
        {value:'moderate', label:'Commerce Actif & Politique'},
        {value:'high', label:'Contrôle Économique Majeur'},
        {value:'dominant', label:'Monopole Absolu'}
      ]
    },
    { 
      name: 'alignment_tendency', 
      label: 'Tendance d\'Alignement', 
      type: 'select',
      options: [
        {value:'LG', label:'Loyal Bon'}, {value:'NG', label:'Neutre Bon'}, {value:'CG', label:'Chaotique Bon'},
        {value:'LN', label:'Loyal Neutre'}, {value:'N', label:'Neutre Strict'}, {value:'CN', label:'Chaotique Neutre'},
        {value:'LE', label:'Loyal Mauvais'}, {value:'NE', label:'Neutre Mauvais'}, {value:'CE', label:'Chaotique Mauvais'}
      ]
    }
  ],

  // --- CHAMPS POUR LES RÉGIONS LOCALES ---
  regionFields: [
    { name: 'wild_magic_chance', label: 'Risque de Magie Sauvage (%)', type: 'number' },
    { name: 'travel_difficulty', label: 'Difficulté de Voyage (DD)', type: 'number' }
  ],

  // --- CHAMPS POUR LES NATIONS ---
  nationFields: [
    { name: 'government_type', label: 'Type de Gouvernement', type: 'text', placeholder: 'Monarchie, Théocratie, Oligarchie...' },
    { name: 'military_strength', label: 'Puissance Militaire', type: 'select', options: [{value:'weak', label:'Faible / Milice'}, {value:'average', label:'Moyenne / Armée Régulière'}, {value:'strong', label:'Puissante / Impériale'}] }
  ],

  // --- CHAMPS POUR LES CITÉS ---
  cityFields: [
    { name: 'wealth_level', label: 'Niveau de Richesse', type: 'select', options: [{value:'poor', label:'Pauvre'}, {value:'modest', label:'Modeste'}, {value:'wealthy', label:'Riche'}] },
    { name: 'law_enforcement', label: 'Force de l\'Ordre', type: 'text', placeholder: 'Garde urbaine, Milice, Mercenaires...' }
  ],

  // --- AUTRES ENTITÉS ---
  deityFields: [
    { name: 'alignment', label: 'Alignement Divin', type: 'text', placeholder: 'Ex: Loyal Mauvais, Neutre Strict...' },
    { name: 'domains', label: 'Domaines d\'Influence', type: 'text', placeholder: 'Ex: Vie, Tempête, Forge...' }
  ],

  raceFields: [
    { name: 'size_cat', label: 'Catégorie de Taille', type: 'select', options: [{value:'small', label:'Petite (0.6m - 1.2m)'}, {value:'medium', label:'Moyenne (1.2m - 2.1m)'}, {value:'large', label:'Grande (2.1m - 3m)'}] },
    { name: 'speed_m', label: 'Vitesse de marche (m)', type: 'number', placeholder: '9' }
  ],

  classFields: [
    { name: 'hit_die', label: 'Dé de Vie', type: 'select', options: [{value:'d6', label:'d6'}, {value:'d8', label:'d8'}, {value:'d10', label:'d10'}, {value:'d12', label:'d12'}] }
  ],

  monsterFields: [
    { 
      name: 'cr', 
      label: 'Indice de Dangerosité (CR)', 
      type: 'select', 
      options: [
        {value:'0', label:'0 (10 XP)'}, {value:'1/8', label:'1/8 (25 XP)'}, {value:'1/4', label:'1/4 (50 XP)'}, {value:'1/2', label:'1/2 (100 XP)'},
        {value:'1', label:'1 (200 XP)'}, {value:'2', label:'2 (450 XP)'}, {value:'3', label:'3 (700 XP)'}, {value:'5', label:'5 (1,800 XP)'},
        {value:'10', label:'10 (5,900 XP)'}, {value:'20', label:'20 (25,000 XP)'}, {value:'30', label:'30 (155,000 XP)'}
      ]
    },
    { 
      name: 'monster_type', 
      label: 'Type de Créature', 
      type: 'select',
      options: [
        {value:'aberration', label:'Aberration'}, {value:'beast', label:'Bête'}, {value:'celestial', label:'Céleste'},
        {value:'construct', label:'Artificiel (Créature)'}, {value:'dragon', label:'Dragon'}, {value:'elemental', label:'Élémentaire'},
        {value:'fey', label:'Fée'}, {value:'fiend', label:'Félon / Démon'}, {value:'giant', label:'Géant'},
        {value:'humanoid', label:'Humanoïde'}, {value:'monstrosity', label:'Monstruosité'}, {value:'undead', label:'Mort-vivant'}
      ]
    }
  ],

  celestialFields: [
    { name: 'astral_domain', label: 'Domaine Astral', type: 'text', placeholder: 'Ex: Plan de l\'Ombre, Célestia...' }
  ],

  itemFields: [
    { name: 'attunement', label: 'Harmonisation requise', type: 'select', options: [{value:'yes', label:'Oui'}, {value:'no', label:'Non'}] }
  ],

  // --- GROUPES DE STATISTIQUES PERSONNAGES ---
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
      label: 'Signes Vitaux',
      layout: 'grid-4',
      fields: [
        { key: 'hp', label: 'Points de Vie', type: 'progress', max: 100, theme: 'red', derived: true },
        { key: 'ac', label: 'Armure (CA)', type: 'number', icon: Shield, derived: true },
        { key: 'init', label: 'Initiative', type: 'number', derived: true }, 
        { key: 'prof', label: 'Maîtrise', type: 'number', icon: Star, derived: true } 
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
};