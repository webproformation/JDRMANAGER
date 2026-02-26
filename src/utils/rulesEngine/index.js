// src/utils/rulesEngine/index.js
import { generateBioContent } from './narrativeGen';
import { 
  calculateDnDModifier, 
  generateDnD5Stats, 
  calculateDnD5CombatStats, 
  calculateWeaponStats as dnd5WeaponStats 
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

// On ajoute l'argument cosmicModifier ici
export const calculateCombatStats = (rulesetId, data, level = 1, cosmicModifier = 0) => {
  if (rulesetId === 'dnd5') {
    return calculateDnD5CombatStats(data, level, cosmicModifier);
  }
  else if (rulesetId === 'cthulhu') {
    return calculateCthulhuCombatStats(data, cosmicModifier);
  }
  // Pour les autres systèmes, on retourne au moins le bonus pour affichage
  return { cosmic_bonus: cosmicModifier };
};

export const calculateWeaponStats = (weaponData, charStats, proficiencyBonus, cosmicModifier = 0) => {
  // L'arsenal profite aussi du bonus cosmique sur l'attaque
  const baseStats = dnd5WeaponStats(weaponData, charStats, proficiencyBonus);
  if (cosmicModifier !== 0) {
    const atkValue = parseInt(baseStats.atk);
    const newAtk = atkValue + (cosmicModifier / 5); // Le bonus % est converti en bonus plat (ex: 5% = +1)
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