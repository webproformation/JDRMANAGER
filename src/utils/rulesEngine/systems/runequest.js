export const calculateRunequestMod = (score) => {
  if (!score) return '';
  const s = parseInt(score);
  if (s > 16) return '+1D4';
  if (s > 12) return '+1';
  return '0';
};

export const generateRunequestStats = () => {
  const stats = {};
  ['str','con','siz','dex','int','pow','cha'].forEach(s => stats[s] = Math.floor(Math.random() * 13) + 6);
  return stats;
};