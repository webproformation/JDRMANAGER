// src/utils/rulesEngine/index.js
import { generateBioContent } from './narrativeGen';
import { 
  calculateDnDModifier, 
  generateDnD5Stats, 
  calculateDnD5CombatStats, 
  calculateWeaponStats as dnd5WeaponStats,
  getLevelUpBenefits as dnd5GetLevelUpBenefits // <-- L'IMPORT MANQUANT EST ICI
} from './systems/dnd5e';
import { 
  calculateCthulhuLevels, 
  generateCthulhuStats, 
  calculateCthulhuCombatStats 
} from './systems/cthulhu';
import { calculateRolemasterBonus, generateRolemasterStats } from './systems/rolemaster';
import { calculateRunequestMod, generateRunequestStats } from './systems/runequest';
import { calculateRddThreshold, generateRddStats } from './systems/rdd';

/**
 * Calcule le bonus cosmique total cumulé
 * @param {Array} activeInfluences - Liste des influences (horoscopes) s'appliquant actuellement
 */
export const calculateTotalCosmicModifier = (activeInfluences = []) => {
  return activeInfluences.reduce((acc, inf) => {
    return acc + (inf.data?.celestial_configs?.global_modifier || 0);
  }, 0);
};

export const generateCharacterData = (rulesetId, raceName, className) => {
  let newData = { stats: {}, bio: {} };
  
  if (rulesetId === 'dnd5') {
    newData.stats = generateDnD5Stats(raceName);
  } 
  else if (rulesetId === 'cthulhu') {
    newData.stats = generateCthulhuStats();
  }
  else if (rulesetId === 'rolemaster') {
    newData.stats = generateRolemasterStats();
  }
  else if (rulesetId === 'runequest') {
    newData.stats = generateRunequestStats();
  }
  else if (rulesetId === 'rdd') {
    newData.stats = generateRddStats();
  }

  newData.bio = generateBioContent(rulesetId, raceName, className);
  return newData;
};

export const calculateCombatStats = (rulesetId, data, level = 1, cosmicModifier = 0) => {
  if (rulesetId === 'dnd5') {
    return calculateDnD5CombatStats(data, level, cosmicModifier);
  }
  else if (rulesetId === 'cthulhu') {
    return calculateCthulhuCombatStats(data, cosmicModifier);
  }
  return { cosmic_bonus: cosmicModifier };
};

export const calculateWeaponStats = (weaponData, charStats, proficiencyBonus, cosmicModifier = 0) => {
  const baseStats = dnd5WeaponStats(weaponData, charStats, proficiencyBonus);
  if (cosmicModifier !== 0) {
    const atkValue = parseInt(baseStats.atk);
    const newAtk = atkValue + (cosmicModifier / 5); 
    baseStats.atk = `${newAtk >= 0 ? '+' : ''}${Math.floor(newAtk)}`;
  }
  return baseStats;
};

export const getDerivedValue = (rulesetId, key, value) => {
  const v = parseInt(value, 10);
  if (isNaN(v)) return null;
  switch (rulesetId) {
    case 'dnd5': return ['str','dex','con','int','wis','cha'].includes(key) ? calculateDnDModifier(v) : null;
    case 'cthulhu': return ['str','con','siz','dex','app','int','pow','edu','san','luck'].includes(key) ? calculateCthulhuLevels(v) : null;
    case 'rolemaster': return calculateRolemasterBonus(v);
    case 'runequest': return calculateRunequestMod(v);
    case 'rdd': return calculateRddThreshold(v);
    default: return null;
  }
};

/**
 * PONT VERS LE DICTIONNAIRE DE MONTÉE DE NIVEAU
 */
export const getLevelUpBenefits = (className, newLevel, rulesetId = 'dnd5') => {
  if (rulesetId === 'dnd5') {
    return dnd5GetLevelUpBenefits(className, newLevel);
  }
  // Fallback générique pour les autres systèmes (Cthulhu, etc.) s'ils n'ont pas encore de dictionnaire
  return [
    "Amélioration des points de vie (Jet de dé).",
    "Nouvelles compétences disponibles selon votre système de règles."
  ];
};

/**
 * MOTEUR D'ESTIMATION MARCHANDE
 */
export const calculateEntityValue = (entityType, data, levelOrCR) => {
  let lvl = 1;
  if (typeof levelOrCR === 'string') {
    if (levelOrCR.includes('/')) {
       const [num, den] = levelOrCR.split('/');
       lvl = parseInt(num) / parseInt(den);
    } else {
       lvl = parseFloat(levelOrCR) || 1;
    }
  } else {
    lvl = parseFloat(levelOrCR) || 1;
  }
  
  const hp = parseInt(data?.hp || data?.hp_max || data?.con || 10);
  let goldValue = 10;
  
  const typeStr = (entityType || '').toLowerCase();

  if (typeStr.includes('npc') || typeStr.includes('pnj')) {
    goldValue = Math.floor((lvl * lvl * 50) + (hp * 5));
  } 
  else if (typeStr.includes('monster') || typeStr.includes('mount') || typeStr.includes('animal')) {
    goldValue = Math.floor((lvl * lvl * 10) + (hp * 2));
  } 
  else if (typeStr.includes('vehicle') || typeStr.includes('vehicule')) {
    goldValue = Math.floor((lvl * 100) + 500);
  }

  return `${goldValue > 0 ? goldValue : 10} po`;
};