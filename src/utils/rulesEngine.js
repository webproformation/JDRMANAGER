// src/utils/rulesEngine.js

// --- D&D 5E : (Score - 10) / 2 ---
export const calculateDnDModifier = (score) => {
  if (score === undefined || score === null) return '';
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// --- CTHULHU 7E : 1/2 et 1/5 ---
export const calculateCthulhuLevels = (score) => {
  if (!score) return '';
  const hard = Math.floor(score / 2);
  const extreme = Math.floor(score / 5);
  return `${hard} / ${extreme}`;
};

// --- ROLEMASTER (Table des Bonus) ---
export const calculateRolemasterBonus = (score) => {
  if (!score) return '';
  const s = parseInt(score);
  if (s >= 100) return '+25';
  if (s >= 95) return '+15';
  if (s >= 90) return '+10';
  if (s >= 75) return '+5';
  if (s >= 25) return '0';
  if (s >= 10) return '-5';
  if (s >= 5) return '-10';
  return '-25';
};

// --- RUNEQUEST (Bonus dérivés) ---
export const calculateRunequestMod = (score) => {
  if (!score) return '';
  const s = parseInt(score);
  if (s > 16) return '+1D4';
  if (s > 12) return '+1';
  return '0';
};

// --- RÊVE DE DRAGON (Seuils) ---
export const calculateRddThreshold = (score) => {
  if (!score) return '';
  return `Diff -4: ${Math.max(0, parseInt(score) + 4)}`;
};

// --- LOGIQUE DE DÉS ---
const roll4d6DropLowest = () => {
  let rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
  return rolls.sort((a,b) => b-a).slice(0,3).reduce((a,b) => a+b, 0);
};

// --- GÉNÉRATEUR NARRATIF (BIO & HISTORIQUE) ---
const generateBioContent = (rulesetId, race, cl) => {
  const traits = ["Solitaire", "Héroïque", "Hanté par son passé", "Avide de richesses", "Dévoué à une cause", "Mystérieux"];
  const origins = ["un village côtier", "une citadelle en ruines", "une forêt sacrée", "les bas-fonds d'une cité"];
  const events = ["a survécu à une grande tragédie", "a découvert un secret interdit", "est en quête d'un héritage perdu"];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    backstory: `Né dans ${pick(origins)}, ce ${race || 'individu'} ${cl || ''} ${pick(events)}. Cette expérience a forgé sa détermination.`,
    personality: `${pick(traits)}. Toujours prêt à affronter l'inconnu pour atteindre ses objectifs.`,
    description: `Porte les marques de ses voyages. Un regard vif qui trahit une grande intelligence.`
  };
};

// --- FORGER LE DESTIN (GÉNÉRATION COMPLÈTE) ---
export const generateCharacterData = (rulesetId, raceName, className) => {
  let newData = { stats: {}, bio: {} };
  
  if (rulesetId === 'dnd5') {
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(s => newData.stats[s] = roll4d6DropLowest());
    if (raceName === 'Elfe') newData.stats.dex += 2;
    if (raceName === 'Nain') newData.stats.con += 2;
  } 
  else if (rulesetId === 'cthulhu') {
    ['str', 'con', 'dex', 'app', 'pow'].forEach(s => newData.stats[s] = (Math.floor(Math.random() * 16) + 3) * 5);
    ['int', 'siz', 'edu'].forEach(s => newData.stats[s] = (Math.floor(Math.random() * 11) + 6) * 5);
    newData.stats.luck = (Math.floor(Math.random() * 11) + 6) * 5;
    newData.stats.san = newData.stats.pow;
  }
  else if (rulesetId === 'rolemaster') {
    ['co','ag','sd','me','re','fo','qu','pr','in','em'].forEach(s => newData.stats[s] = Math.floor(Math.random() * 100) + 1);
  }
  else if (rulesetId === 'runequest') {
    ['str','con','siz','dex','int','pow','cha'].forEach(s => newData.stats[s] = Math.floor(Math.random() * 13) + 6);
  }
  else if (rulesetId === 'rdd') {
    ['taille','apparence','constitution','force','agilite','dexterite','vue','ouie','volonte','intellect','reve','chance'].forEach(s => newData.stats[s] = Math.floor(Math.random() * 10) + 7);
  }

  newData.bio = generateBioContent(rulesetId, raceName, className);
  return newData;
};

// --- CALCULS DES STATS (PV, CA, MAITRISE, MAGIE) ---
export const calculateCombatStats = (rulesetId, data, level = 1) => {
  const stats = {};
  const lvl = parseInt(level) || 1;
  
  if (rulesetId === 'dnd5') {
    const conMod = Math.floor((parseInt(data.con || 10) - 10) / 2);
    const dexMod = Math.floor((parseInt(data.dex || 10) - 10) / 2);
    stats.hp = 10 + conMod + ((lvl - 1) * (6 + conMod)); 
    stats.ac = 10 + dexMod;
    stats.init = dexMod >= 0 ? `+${dexMod}` : dexMod;
    stats.prof = `+${Math.floor((lvl - 1) / 4) + 2}`;
    
    // Calcul automatique des emplacements de sorts D&D 5e
    if (lvl >= 1) stats.spell_slots = `Niv 1: ${lvl >= 3 ? 4 : (lvl === 2 ? 3 : 2)}`;
    if (lvl >= 3) stats.spell_slots += `, Niv 2: ${lvl >= 4 ? 3 : 2}`;
    if (lvl >= 5) stats.spell_slots += `, Niv 3: 2`;
  }
  else if (rulesetId === 'cthulhu') {
    stats.hp = Math.floor((parseInt(data.con || 0) + parseInt(data.siz || 0)) / 10);
    stats.san = parseInt(data.pow || 0);
    stats.magic = Math.floor(parseInt(data.pow || 0) / 5);
  }
  return stats;
};

// --- ROUTAGE PRINCIPAL ---
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