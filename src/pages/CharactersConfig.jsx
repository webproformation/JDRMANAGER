import { User, Crown, Shield, Zap, Sparkles } from 'lucide-react';
import { identityTab, cosmicTab, bioTab, gmTab } from './characterTabs/TabIdentityBio';
import { statsTab, combatTab, abilitiesTab } from './characterTabs/TabStatsCombat';
import { magicTab, craftingTab, inventoryTab } from './characterTabs/TabMagicInventory';

/**
 * Configuration PRESTIGE 4.3.6 - Forge des Héros
 * Cette configuration gère l'affichage polymorphe des PJ et PNJ.
 */
export const getCharacterConfig = (rulesetId = 'dnd5') => {
  return {
    entityName: 'le personnage',
    tableName: 'characters',
    title: 'Forge des Héros',
    
    // LOGIQUE DE HEADER PRESTIGE : Différenciation PJ / PNJ
    getHeaderIcon: (it) => {
      if (!it) return User;
      return it.character_type === 'PJ' ? Crown : User;
    },

    getHeaderColor: (it) => {
      // Halo Doré pour les Héros (PJ), Ardoise/Bleu pour les PNJ
      if (it?.character_type === 'PJ') {
        return 'from-amber-600/40 via-yellow-500/20 to-orange-500/30';
      }
      return 'from-slate-700/40 via-blue-900/30 to-slate-800/50';
    },
    
    // DISPATCH DES ONGLETS (Architecture modulaire)
    tabs: [
      identityTab,    // Identité, Monde, Image (Grid 3 colonnes)
      cosmicTab,      // Influences célestes & Signes
      statsTab,       // Caractéristiques brutes (FOR, DEX...)
      combatTab,      // Statistiques calculées (CA, PV, Initiative)
      abilitiesTab,   // Capacités de classe & Traits
      magicTab,       // Grimoire & Sorts connus
      craftingTab,    // Recettes & Progression artisanale
      bioTab,         // Histoire, Apparence, Traits de personnalité
      inventoryTab,   // Équipement & Richesse
      gmTab           // Secrets MJ, Complots, Notes privées
    ]
  };
};

// Export par défaut pour compatibilité
export const charactersConfig = getCharacterConfig('dnd5');