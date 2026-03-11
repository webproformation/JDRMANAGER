// src/pages/CharactersConfig.jsx
import { User, Crown } from 'lucide-react';
import { identityTab, cosmicTab, bioTab, gmTab } from './characterTabs/TabIdentityBio';
import { statsTab, combatTab, abilitiesTab } from './characterTabs/TabStatsCombat';
import { magicTab, craftingTab, inventoryTab } from './characterTabs/TabMagicInventory';

export const charactersConfig = {
  entityName: 'le personnage',
  tableName: 'characters',
  title: 'Forge des Héros',
  
  getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
  getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),
  
  tabs: [
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
  ]
};