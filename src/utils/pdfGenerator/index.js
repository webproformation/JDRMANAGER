// src/utils/pdfGenerator/index.js
import { generateDnD5PDF } from './dnd5e';
import { generateRddPDF } from './rdd';

export const generatePDF = async (character) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const ruleset = character.ruleset_id || 'dnd5';

    switch (ruleset) {
        case 'dnd5':
            await generateDnD5PDF(doc, character);
            break;
        case 'rdd':
            await generateRddPDF(doc, character);
            break;
        default:
            alert(`La génération PDF pour le système de jeu "${ruleset}" n'est pas encore configurée.`);
            return;
    }

    doc.save(`${character.name}_Feuille_de_Perso.pdf`);
    
  } catch (e) {
    console.error(e);
    alert("Erreur de génération. Vérifiez que jsPDF est installé et que les images sont dans le dossier /public.");
  }
};

// --- CRASH TEST ULTIME POUR LE CALIBRAGE ---
export const runSmokeTestPDF = async () => {
  const mockCharacter = {
    name: "Kaelen 'SmokeTest' Le Magnifique",
    class_name: "Paladin",
    subclass_name: "Serment de Dévotion", // Sous-classe ajoutée !
    level: 7,
    alignment: "Loyal Bon", // Alignement ajouté !
    race_id: "Demi-Elfe",
    description: "Cheveux argentés, armure étincelante. (Test d'apparence longue pour voir le retour à la ligne).",
    backstory: "Né dans les ruelles d'Eauprofonde, recueilli par le clergé. (Test d'historique).",
    data: {
      str: 16, dex: 12, con: 14, int: 10, wis: 14, cha: 16,
      size_cat: "medium", 
      speed_m: 9, hp: 55, hp_max: 55,
      ac: 18, initiative: "+1", prof: "+3",
      passive_perception: 15, // Rempli manuellement pour le test

      // NOUVEAU : Dés de vie et Jets contre la mort
      hit_dice_max: "7d10",
      hit_dice_spent: "3d10",
      death_saves: { successes: 2, failures: 1 },

      // NOUVEAU : Monnaie complète (PC, PA, PE, PO, PP)
      money_pc: 45, money_pa: 12, money_pe: 5, money_po: 145, money_pp: 10,
      
      // NOUVEAU : Maîtrises d'armures pour les cases diagonales
      prof_armor_light: true,
      prof_armor_medium: true,
      prof_armor_heavy: false,
      prof_armor_shields: true,

      // NOUVEAU : Compétences (Vrai = Coché)
      skills: {
        acrobatics: false, animal_handling: false, arcana: false, athletics: true,
        deception: false, history: false, insight: true, intimidation: true,
        investigation: false, medicine: false, nature: false, perception: true,
        performance: false, persuasion: true, religion: true, sleight_of_hand: false,
        stealth: false, survival: false
      },
      
      arsenal: [
        { name: "Épée Longue Radiante", stats: { atk: "+6", dmg: "1d8+3 Tranchant" } },
        { name: "Javelot de foudre", stats: { atk: "+6", dmg: "1d6+3 Perçant" } }
      ],
      
      inventory: Array.from({length: 10}, (_, i) => ({ name: `Objet Factice n°${i+1}`, quantity: 1, weight: "1kg" })),
      
      racial_traits: "• Vision dans le noir\n• Ascendance féerique\n• Chanceux",
      proficiencies: "Armes courantes, Armes de guerre\nOutils : Forgeron",
      languages: "Commun, Elfique, Céleste", // Langages
      features: "• Châtiment Divin\n• Imposition des mains (35 PV)\n• Aura de protection",
      
      // NOUVEAU : Magie ultra détaillée
      spell_mod: "+3", spell_dc: "14", spell_atk: "+6",
      
      spell_slots: {
        1: { total: 4, spent: 2 }, 2: { total: 3, spent: 1 }, 3: { total: 0, spent: 0 },
        4: { total: 0, spent: 0 }, 5: { total: 0, spent: 0 }, 6: { total: 0, spent: 0 },
        7: { total: 0, spent: 0 }, 8: { total: 0, spent: 0 }, 9: { total: 0, spent: 0 }
      },

      // 27 lignes de sorts pour remplir la grille de la page 2
      spell_list: Array.from({length: 27}, (_, i) => ({
        level: i < 3 ? "T" : (i < 10 ? "1" : "2"),
        name: `Sortilège Magique n°${i+1}`,
        time: "1 act",
        range: "18m",
        comp: "V, S, M",
        notes: "Concentration"
      }))
    }
  };

  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const { generateDnD5PDF } = await import('./dnd5e');
    await generateDnD5PDF(doc, mockCharacter);
    doc.save('CRASH_TEST_DND5_COMPLET.pdf');
  } catch (e) {
    console.error(e);
    alert("Erreur lors du Crash Test PDF.");
  }
};