// src/utils/rulesEngine/systems/cthulhu.js

export const calculateCthulhuLevels = (score) => {
  if (!score) return '';
  const hard = Math.floor(score / 2);
  const extreme = Math.floor(score / 5);
  return `${hard} / ${extreme}`;
};

export const generateCthulhuStats = () => {
  const stats = {};
  ['str', 'con', 'dex', 'app', 'pow'].forEach(s => stats[s] = (Math.floor(Math.random() * 16) + 3) * 5);
  ['int', 'siz', 'edu'].forEach(s => stats[s] = (Math.floor(Math.random() * 11) + 6) * 5);
  stats.luck = (Math.floor(Math.random() * 11) + 6) * 5;
  stats.san = stats.pow;
  return stats;
};

export const calculateCthulhuCombatStats = (data, cosmicModifier = 0) => {
  const stats = {};
  // Dans Cthulhu, les influences cosmiques peuvent altérer la Santé Mentale max ou la Chance
  const cosmicFactor = 1 + (cosmicModifier / 100);

  stats.hp = Math.floor((parseInt(data.con || 0) + parseInt(data.siz || 0)) / 10);
  stats.san = Math.floor(parseInt(data.pow || 0) * cosmicFactor);
  stats.magic = Math.floor(parseInt(data.pow || 0) / 5);
  stats.luck_mod = cosmicModifier !== 0 ? `${cosmicModifier > 0 ? '+' : ''}${cosmicModifier}% à la Chance` : '';
  
  return stats;
};