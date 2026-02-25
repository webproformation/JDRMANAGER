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

export const generateRolemasterStats = () => {
  const stats = {};
  ['co','ag','sd','me','re','fo','qu','pr','in','em'].forEach(s => stats[s] = Math.floor(Math.random() * 100) + 1);
  return stats;
};