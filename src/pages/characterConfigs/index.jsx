import { User, Crown } from 'lucide-react';
import { identityTab, cosmicTab, bioTab, gmTab } from './commonTabs';
import { 
  statsTab, 
  combatTab, 
  abilitiesTab, 
  magicTab, 
  craftingTab, 
  inventoryTab 
} from './dnd5Tabs';

/**
 * Dispatcher Central des Configurations Personnages - Standard PRESTIGE 4.3.6
 * Gère le polymorphisme des fiches selon le Ruleset et le type (PJ/PNJ).
 */
export const getCharacterConfig = (rulesetId = 'dnd5') => {
  let tabs = [];

  // --- LOGIQUE DE DISPATCH DES SYSTÈMES ---
  if (rulesetId === 'dnd5') {
    // Ordre tactique optimisé pour le flux de jeu D&D 5e
    tabs = [
      identityTab,   // Identité & Visuel (Grid 3-Cols)
      cosmicTab,     // Horoscope & Destinée
      statsTab,      // Caractéristiques & Compétences
      combatTab,     // Arsenal & Combat
      abilitiesTab,  // Talents & Grimoire de Capacités
      magicTab,      // Gestion des Sorts (Slots VTT)
      craftingTab,   // Atelier d'Artisanat
      bioTab,        // Histoire & Apparence
      inventoryTab,  // Richesses & Sac à dos
      gmTab          // Archives Secrètes MJ
    ];
  } else {
    // Fallback pour les systèmes génériques ou en cours de développement
    tabs = [
      identityTab,
      cosmicTab,
      bioTab,
      gmTab
    ];
  }

  return {
    entityName: 'le personnage',
    tableName: 'characters',
    title: 'Forge des Héros',

    // SIGNATURE VISUELLE PRESTIGE : Différenciation de Rang
    getHeaderIcon: (it) => {
      if (!it) return User;
      return it.character_type === 'PJ' ? Crown : User;
    },

    getHeaderColor: (it) => {
      // PJ : Halo Ambré / PNJ : Halo Ardoise
      if (it?.character_type === 'PJ') {
        return 'from-amber-600/40 via-yellow-500/20 to-orange-500/30';
      }
      return 'from-slate-700/40 via-blue-900/30 to-slate-800/50';
    },

    tabs: tabs
  };
};

// Export par défaut pour la compatibilité avec le moteur EnhancedEntity
export const charactersConfig = getCharacterConfig('dnd5');