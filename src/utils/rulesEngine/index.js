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

export const calculateCombatStats = (rulesetId, data, level = 1) => {
  if (rulesetId === 'dnd5') {
    return calculateDnD5CombatStats(data, level);
  }
  else if (rulesetId === 'cthulhu') {
    return calculateCthulhuCombatStats(data);
  }
  return {};
};

export const calculateWeaponStats = (weaponData, charStats, proficiencyBonus) => {
  // L'arsenal est actuellement géré par le système D&D 5E par défaut
  return dnd5WeaponStats(weaponData, charStats, proficiencyBonus);
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