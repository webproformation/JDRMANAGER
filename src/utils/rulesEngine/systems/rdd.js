export const calculateRddThreshold = (score) => {
  if (!score) return '';
  return `Diff -4: ${Math.max(0, parseInt(score) + 4)}`;
};

export const generateRddStats = () => {
  const stats = {};
  ['taille','apparence','constitution','force','agilite','dexterite','vue','ouie','volonte','intellect','reve','chance'].forEach(s => stats[s] = Math.floor(Math.random() * 10) + 7);
  return stats;
};