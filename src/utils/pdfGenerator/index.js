// src/utils/pdfGenerator/index.js
import { generateDnD5PDF } from './dnd5e';

export const generatePDF = async (character) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const ruleset = character.ruleset_id || 'dnd5';

    switch (ruleset) {
        case 'dnd5':
            await generateDnD5PDF(doc, character);
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
  
  // Génération de 35 sorts factices pour remplir votre grille Page 2
  const fakeSpells = Array.from({length: 35}, (_, i) => ({
    name: `Sortilège d'oblitération n°${i+1}`,
    casting_time: "1 act",
    range: "18m",
    components: i % 3 === 0 ? "V, S, M" : "V, S",
    duration: "Conc 1min"
  }));

  const mockCharacter = {
    name: "Kaelen 'SmokeTest' Le Magnifique",
    class_name: "Paladin",
    subclass_name: "Serment de Dévotion", 
    level: 7,
    alignment: "Loyal Bon", 
    race_id: "Demi-Elfe",
    
    description: "Apparence : Il porte une imposante armure de plates rutilante, marquée du sceau de Lathandre. Ses cheveux argentés sont toujours tressés, et une cicatrice traverse son œil gauche, souvenir d'un combat contre un dragon rouge.",
    backstory: "Histoire : Orphelin des rues de Padhiver, il a été recueilli par l'Ordre du Gantelet après avoir manifesté des pouvoirs divins. Personnalité : Il est droit, inflexible, mais cache une profonde mélancolie.",
    
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
      
      inventory: Array.from({length: 15}, (_, i) => ({ name: `Objet Factice n°${i+1}`, quantity: 1, weight: "1kg" })),
      
      racial_traits: "• Vision dans le noir (18m)\n• Ascendance féerique",
      feats: "• Mage de guerre\n• Maître des armures lourdes", 
      proficiencies: "Armes courantes, Armes de guerre", 
      tool_proficiencies: "Outils de Forgeron, Matériel d'alchimiste", 
      features: "• Châtiment Divin\n• Imposition des mains (35 PV)\n• Aura de protection",
      languages: "Commun, Elfique, Céleste", 
      
      spell_mod: "+3", spell_dc: "14", spell_atk: "+6",
      
      spell_slots: {
        1: { total: 4, spent: 2 }, 2: { total: 3, spent: 1 }, 3: { total: 0, spent: 0 },
        4: { total: 0, spent: 0 }, 5: { total: 0, spent: 0 }, 6: { total: 0, spent: 0 },
        7: { total: 0, spent: 0 }, 8: { total: 0, spent: 0 }, 9: { total: 0, spent: 0 }
      },

      // Le VRAI format de Grimoire, rempli à ras bord pour votre test des 35 lignes !
      spells: {
        0: fakeSpells.slice(0, 5),   // 5 Tours de magie
        1: fakeSpells.slice(5, 15),  // 10 Sorts de niveau 1
        2: fakeSpells.slice(15, 25), // 10 Sorts de niveau 2
        3: fakeSpells.slice(25, 35)  // 10 Sorts de niveau 3
      }
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