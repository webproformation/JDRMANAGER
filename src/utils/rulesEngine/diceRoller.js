export const roll4d6DropLowest = () => {
  let rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
  return rolls.sort((a,b) => b-a).slice(0,3).reduce((a,b) => a+b, 0);
};