// src/utils/rulesEngine/systems/dnd5e.js
import { roll4d6DropLowest } from '../diceRoller';

export const calculateDnDModifier = (score) => {
  if (score === undefined || score === null) return '';
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const generateDnD5Stats = (raceName) => {
  const stats = {};
  ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(s => stats[s] = roll4d6DropLowest());
  if (raceName === 'Elfe') stats.dex += 2;
  if (raceName === 'Nain') stats.con += 2;
  return stats;
};

export const calculateDnD5CombatStats = (data, level = 1, cosmicModifier = 0) => {
  const stats = {};
  const lvl = parseInt(level) || 1;
  const conMod = Math.floor((parseInt(data.con || 10) - 10) / 2);
  const dexMod = Math.floor((parseInt(data.dex || 10) - 10) / 2);
  
  // Le bonus cosmique (en %) influence légèrement les PV et l'AC dans ce moteur
  const cosmicFlat = Math.floor(cosmicModifier / 5); // Conversion 5% -> +1

  stats.hp = 10 + conMod + ((lvl - 1) * (6 + conMod)) + (cosmicFlat > 0 ? cosmicFlat : 0); 
  stats.ac = 10 + dexMod + (cosmicFlat > 0 ? 1 : 0); // Les astres favorables protègent
  
  // L'initiative est fortement impactée par l'horoscope
  const totalInit = dexMod + cosmicFlat;
  stats.init = totalInit >= 0 ? `+${totalInit}` : totalInit;
  
  stats.prof = `+${Math.floor((lvl - 1) / 4) + 2}`;
  stats.cosmic_mod = `${cosmicModifier}%`; // Pour affichage sur la fiche
  
  if (lvl >= 1) stats.spell_slots = `Niv 1: ${lvl >= 3 ? 4 : (lvl === 2 ? 3 : 2)}`;
  if (lvl >= 3) stats.spell_slots += `, Niv 2: ${lvl >= 4 ? 3 : 2}`;
  if (lvl >= 5) stats.spell_slots += `, Niv 3: 2`;
  
  return stats;
};

export const calculateWeaponStats = (weaponData, charStats, proficiencyBonus) => {
  if (!weaponData || !charStats) return { atk: '+0', dmg: '0' };

  const str = parseInt(charStats.str || 10);
  const dex = parseInt(charStats.dex || 10);
  const strMod = Math.floor((str - 10) / 2);
  const dexMod = Math.floor((dex - 10) / 2);
  const prof = parseInt(proficiencyBonus || 2);

  let mod = strMod;
  const props = weaponData.properties || [];

  if (props.includes('Finesse')) {
    mod = Math.max(strMod, dexMod);
  } 
  else if (weaponData.range_type === 'ranged') {
    mod = dexMod;
  }

  const atkBonus = mod + prof;
  const dmgBonus = mod;

  const atkSign = atkBonus >= 0 ? '+' : '';
  const dmgSign = dmgBonus >= 0 ? '+' : '';

  return {
    atk: `${atkSign}${atkBonus}`,
    dmg: `${weaponData.damage}${dmgSign}${dmgBonus} (${weaponData.damage_type})`
  };
};