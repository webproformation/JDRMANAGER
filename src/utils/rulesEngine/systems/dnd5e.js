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
  const wisMod = Math.floor((parseInt(data.wis || 10) - 10) / 2);
  
  const cosmicFlat = Math.floor(cosmicModifier / 5); 
  const profBonusInt = Math.floor((lvl - 1) / 4) + 2;

  // --- CALCUL DE L'ENCOMBREMENT (Basé sur la Constitution et la Taille) ---
  const sizeMod = data.size_cat === 'large' ? 2 : (data.size_cat === 'small' ? 0.5 : 1);
  stats.max_weight = Math.floor(parseInt(data.con || 10) * 7.5 * sizeMod);

  // --- CALCUL DE LA PERCEPTION PASSIVE ---
  // Ajoute le bonus de maîtrise si data.prof_perception est activé
  stats.passive_perception = 10 + wisMod + (data.prof_perception ? profBonusInt : 0) + cosmicFlat;

  // --- CALCUL DE LA CLASSE D'ARMURE (CA) VIA L'INVENTAIRE ---
  let armorAc = null;
  let shieldBonus = 0;

  if (data.inventory) {
    data.inventory.filter(i => i.location === 'equipped').forEach(item => {
      const type = (item.type || '').toLowerCase();
      if (type.includes('armor') || type.includes('armure')) {
        const ac = parseInt(item.base_data?.ac_bonus || item.base_data?.base_ac || item.base_data?.ac || 0);
        if (ac > 0) armorAc = ac;
      }
      if (type.includes('shield') || type.includes('bouclier')) {
        shieldBonus += parseInt(item.base_data?.ac_bonus || 2);
      }
    });
  }

  if (armorAc !== null) {
    stats.ac = armorAc + dexMod + shieldBonus + (cosmicFlat > 0 ? 1 : 0);
  } else {
    stats.ac = 10 + dexMod + shieldBonus + (cosmicFlat > 0 ? 1 : 0);
  }

  stats.hp = 10 + conMod + ((lvl - 1) * (6 + conMod)) + (cosmicFlat > 0 ? cosmicFlat : 0); 
  
  const totalInit = dexMod + cosmicFlat;
  stats.init = totalInit >= 0 ? `+${totalInit}` : totalInit;
  stats.prof = `+${profBonusInt}`;
  stats.cosmic_mod = `${cosmicModifier}%`; 
  
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
    dmg: `${weaponData.damage || '1d4'}${dmgSign}${dmgBonus} (${weaponData.damage_type || 'Contondant'})`
  };
};

export const getLevelUpBenefits = (className, newLevel) => {
  const generic = ["Amélioration des points de vie (Dé de Vie + Mod. Constitution)."];
  
  if (newLevel % 4 === 0) {
    generic.push("Amélioration de Caractéristiques (+2 à une, ou +1 à deux) OU un Don.");
  }
  if (newLevel === 5 || newLevel === 11 || newLevel === 17) {
    generic.push("Augmentation du palier de puissance global (Maitrise augmentée).");
  }
  
  const specific = {
    'guerrier': { 2: "Sursaut d'activité", 3: "Archétype martial", 5: "Attaque supplémentaire" },
    'magicien': { 2: "Tradition arcanique", 3: "Sorts de niveau 2", 5: "Sorts de niveau 3" },
    'roublard': { 2: "Action rusée", 3: "Archétype de roublard", 5: "Esquive instinctive" },
    'clerc': { 2: "Conduit divin", 5: "Destruction des morts-vivants", 8: "Frappe divine" },
    'paladin': { 2: "Châtiment divin", 3: "Serment sacré", 5: "Attaque supplémentaire" },
  };

  const classKey = Object.keys(specific).find(k => (className || '').toLowerCase().includes(k));
  if (classKey && specific[classKey][newLevel]) {
    generic.push(`Capacité de Classe : ${specific[classKey][newLevel]}`);
  }
  return generic;
};