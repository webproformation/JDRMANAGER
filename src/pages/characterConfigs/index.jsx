// src/pages/characterConfigs/index.jsx
import { User, Crown } from 'lucide-react';
import { identityTab, cosmicTab, bioTab, gmTab } from './commonTabs';
import { statsTab, combatTab, abilitiesTab, magicTab, craftingTab, inventoryTab } from './dnd5Tabs';

export const getCharacterConfig = (rulesetId = 'dnd5') => {
  const common = [identityTab, cosmicTab, bioTab, gmTab];
  let tabs = [];

  if (rulesetId === 'dnd5') {
    // Ordre logique d'une fiche D&D 5e
    tabs = [
      identityTab, 
      cosmicTab, 
      statsTab, 
      combatTab, 
      abilitiesTab, 
      magicTab, 
      craftingTab, 
      bioTab, 
      inventoryTab, 
      gmTab
    ];
  } else {
    // Fiche par défaut pour un système inconnu (on pourra ajouter Cthulhu ici plus tard)
    tabs = common;
  }

  return {
    entityName: 'le personnage',
    tableName: 'characters',
    title: 'Forge des Héros',
    getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
    getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),
    tabs: tabs
  };
};