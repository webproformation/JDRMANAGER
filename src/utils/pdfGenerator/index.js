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
    subclass_name: "Serment de Dévotion", 
    level: 7,
    alignment: "Loyal Bon", 
    race_id: "Demi-Elfe",
    description: "Cheveux argentés, armure étincelante. (Test d'apparence longue pour l'alignement).",
    backstory: "Né dans les ruelles d'Eauprofonde, recueilli par le clergé. (Test d'historique).",
    data: {
      str: 16, dex: 12, con: 14, int: 10, wis: 14, cha: 16,
      size_cat: "medium", 
      speed_m: 9, hp: 55, hp_max: 55,
      ac: 18, initiative: "+1", prof: "+3",
      passive_perception: 15,

      hit_dice_max: "7d10",
      hit_dice_spent: "3",
      death_saves: { successes: 2, failures: 1 },

      money_pc: 45, money_pa: 12, money_pe: 5, money_po: 145, money_pp: 10,
      
      prof_armor_light: true,
      prof_armor_medium: true,
      prof_armor_heavy: false,
      prof_armor_shields: true,

      skills: {
        acrobatics: false, animal_handling: false, arcana: false, athletics: true,
        deception: false, history: false, insight: true, intimidation: true,
        investigation: false, medicine: false, nature: false, perception: true,
        performance: false, persuasion: true, religion: true, sleight_of_hand: false,
        stealth: false, survival: false
      },
      
      arsenal: [
        { name: "Épée Longue Radiante", stats: { atk: "+6", dmg: "1d8+3 Tr" } },
        { name: "Javelot de foudre", stats: { atk: "+6", dmg: "1d6+3 Pe" } }
      ],
      
      inventory: Array.from({length: 10}, (_, i) => ({ name: `Objet Factice n°${i+1}`, quantity: 1, weight: "1kg" })),
      
      racial_traits: "• Vision dans le noir\n• Ascendance féerique\n• Chanceux",
      proficiencies: "Armes courantes, Armes de guerre\nOutils : Forgeron",
      features: "• Châtiment Divin\n• Imposition des mains (35 PV)\n• Aura de protection",
      languages: "Commun, Elfique, Céleste", 
      
      spell_mod: "+3", spell_dc: "14", spell_atk: "+6",
      
      spell_slots: {
        1: { total: 4, spent: 2 }, 2: { total: 3, spent: 1 }, 3: { total: 0, spent: 0 },
        4: { total: 0, spent: 0 }, 5: { total: 0, spent: 0 }, 6: { total: 0, spent: 0 },
        7: { total: 0, spent: 0 }, 8: { total: 0, spent: 0 }, 9: { total: 0, spent: 0 }
      },

      spell_list: Array.from({length: 27}, (_, i) => {
        let components = "V";
        if (i % 2 === 0) components = "V, S";
        if (i % 3 === 0) components = "V, S, M";

        return {
          level: i < 3 ? "T" : (i < 10 ? "1" : "2"),
          name: `Sortilège Magique n°${i+1}`,
          time: "1 act",
          range: "18m",
          comp: components,
          notes: "Concentration"
        };
      })
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