import { 
  Shield, Sword, Heart, Zap, Brain, Eye, Activity, Feather, 
  Ghost, BookOpen, Smile, Scale, Star, Hand, Crown, 
  Music, HeartPulse, Flame, Target, Footprints, Hammer, Crosshair, Skull, Sparkles, Wand2
} from 'lucide-react';

export const DEFAULT_RULESETS = {
  
  // ==================================================================================
  // DUNGEONS & DRAGONS 5E
  // ==================================================================================
  'dnd5': {
    id: 'dnd5',
    name: 'Dungeons & Dragons 5e',
    color: 'text-red-500',

    // --- CONFIGURATION MAGIE (AJOUTÉ) ---
    magicConfig: {
      type: 'slots', // Utilise des emplacements de sorts par niveau
      hasPreparation: true, // Mécanique de sorts préparés vs appris
      hasRituals: true, // Support des lancements rituels (+10 min)
      hasConcentration: true, // Alerte si plusieurs sorts à concentration actifs
      castingStats: ['int', 'wis', 'cha'], // Caractéristiques d'incantation possibles
      saveDCBase: 8, // Calcul : 8 + maîtrise + modificateur
      componentTags: ['V', 'S', 'M'] // Verbal, Somatique, Matériel
    },

    worldFields: [
      { name: 'planar_structure', label: 'Structure Planaire', type: 'select', options: [{value:'great_wheel', label:'Grande Roue'}, {value:'world_tree', label:'Arbre-Monde'}, {value:'echoes', label:'Plans Échos'}] },
      { name: 'weave_state', label: 'État de la Trame', type: 'text', placeholder: 'Ex: Stable, Déchirée, zones de magie morte...' }
    ],
    geoFields: [
      { name: 'magic_resonance', label: 'Résonance Magique locale', type: 'text', placeholder: 'Ex: Haute, Basse, Morte...' },
      { name: 'alignment_tendency', label: 'Tendance d\'Alignement', type: 'text', placeholder: 'Ex: Loyal Bon, Chaotique...' }
    ],
    deityFields: [
      { name: 'alignment', label: 'Alignement Divin', type: 'text', placeholder: 'Ex: Loyal Mauvais, Neutre Strict...' },
      { name: 'domains', label: 'Domaines d\'Influence', type: 'text', placeholder: 'Ex: Vie, Tempête, Forge...' }
    ],
    raceFields: [
      { name: 'size_cat', label: 'Catégorie de Taille', type: 'select', options: [{value:'small', label:'Petite'}, {value:'medium', label:'Moyenne'}, {value:'large', label:'Grande'}] },
      { name: 'speed_ft', label: 'Vitesse de marche (ft)', type: 'number', placeholder: '30' }
    ],
    classFields: [
      { name: 'hit_die', label: 'Dé de Vie', type: 'select', options: [{value:'d6', label:'d6'}, {value:'d8', label:'d8'}, {value:'d10', label:'d10'}, {value:'d12', label:'d12'}] }
    ],
    monsterFields: [
      { name: 'cr', label: 'Indice de Dangerosité (CR)', type: 'text', placeholder: 'Ex: 1/4, 5, 20...' },
      { name: 'monster_type', label: 'Type de Créature', type: 'text', placeholder: 'Ex: Mort-vivant, Aberration...' }
    ],
    celestialFields: [
      { name: 'astral_domain', label: 'Domaine Astral', type: 'text', placeholder: 'Ex: Plan de l\'Ombre, Célestia...' }
    ],
    itemFields: [
      { name: 'attunement', label: 'Harmonisation requise', type: 'select', options: [{value:'yes', label:'Oui'}, {value:'no', label:'Non'}] }
    ],

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
    color: 'text-emerald-500',

    // --- CONFIGURATION MAGIE (AJOUTÉ) ---
    magicConfig: {
      type: 'points', // Utilise les Points de Magie (PM)
      resourceKey: 'magic', 
      hasSanityCost: true, // Perte de SAN lors du lancement
      hasPreparation: false, // Pas de grimoire préparé, on connaît ou on ne connaît pas
      castingStats: ['pow'] // Basé sur le Pouvoir
    },

    worldFields: [
      { name: 'mythos_exposure', label: 'Exposition au Mythe', type: 'select', options: [{value:'low', label:'Occulte voilé'}, {value:'medium', label:'Influences visibles'}, {value:'high', label:'Apocalyptique'}] },
      { name: 'sanity_era', label: 'Époque de Santé Mentale', type: 'text', placeholder: 'Ex: Années 20, Moderne, Gazlight...' }
    ],
    geoFields: [
      { name: 'sanity_drain', label: 'Drain de SAN local', type: 'text', placeholder: 'Ex: 1/1d4 par jour' },
      { name: 'mythos_relics', label: 'Vestiges du Mythe', type: 'textarea', placeholder: 'Statuettes, manuscrits interdits...' }
    ],
    deityFields: [
      { name: 'sanity_loss', label: 'Perte de SAN (Moyenne)', type: 'text', placeholder: 'Ex: 1d10/1d100' },
      { name: 'mythos_ranking', label: 'Classement du Mythe', type: 'select', options: [{value:'outer_god', label:'Dieu Extérieur'}, {value:'elder_god', label:'Dieu Très Ancien'}, {value:'great_old_one', label:'Grand Ancien'}] }
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
      }
    ]
  },

  // ==================================================================================
  // ROLEMASTER (FRP)
  // ==================================================================================
  'rolemaster': {
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
  },

  // ==================================================================================
  // RÊVE DE DRAGON
  // ==================================================================================
  'rdd': {
    id: 'rdd',
    name: 'Rêve de Dragon',
    color: 'text-blue-400',
    magicConfig: {
      type: 'points',
      resourceKey: 'reve',
      hasPreparation: true, // "Tissage" du rêve
      castingStats: ['intellect', 'reve']
    },
    worldFields: [
      { name: 'dream_stability', label: 'Stabilité du Rêve', type: 'select', options: [{value:'clear', label:'Rêve Clair'}, {value:'grey', label:'Gris-Rêve'}, {value:'nightmare', label:'Cauchemar'}] }
    ],
    geoFields: [
      { name: 'grey_dream_intensity', label: 'Intensité du Gris-Rêve local', type: 'text' }
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
  },

  // ==================================================================================
  // RUNEQUEST
  // ==================================================================================
  'runequest': {
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
      { name: 'rune_modifier', label: 'Modificateur de Rune local', type: 'text' }
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
          { key: 'pow', label: 'Pouvoir (POU)', type: 'number', icon: Zap, derived: true },
          { key: 'cha', label: 'Charisme (CHA)', type: 'number', icon: Crown, derived: true }
        ]
      }
    ]
  }
};