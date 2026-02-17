// src/data/heritage.js

export const HERITAGE_DATA = {
  'dnd5': {
    races: {
      'Elfe': { bonuses: { dex: 2, int: 1 }, features: 'Vision dans le noir, Transe' },
      'Nain': { bonuses: { con: 2, str: 1 }, features: 'Résistance au poison, Vision dans le noir' },
      'Humain': { bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, features: 'Polyvalence' },
      'Halfelin': { bonuses: { dex: 2, cha: 1 }, features: 'Chanceux, Agilité' }
    },
    classes: {
      'Guerrier': { hitDie: 10, mainStat: 'str', skills: 2, proficiencies: 'Toutes armures, armes de guerre' },
      'Mage': { hitDie: 6, mainStat: 'int', skills: 2, proficiencies: 'Bâtons, dagues' },
      'Prêtre': { hitDie: 8, mainStat: 'wis', skills: 2, proficiencies: 'Armures moyennes, armes simples' },
      'Rôdeur': { hitDie: 10, mainStat: 'dex', mainStatAlt: 'wis', skills: 3, proficiencies: 'Armures légères/moyennes, armes de guerre' }
    }
  },
  'cthulhu': {
    races: { // Pour Cthulhu, on utilise souvent l'Âge ou l'Origine
      'Standard': { bonuses: {}, features: '' }
    },
    classes: {
      'Investigateur': { hitDie: 0, mainStat: 'edu' },
      'Soldat': { hitDie: 0, mainStat: 'str' }
    }
  }
};