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
    class_name: "Paladin 5 / Sorcier 2",
    level: 7,
    race_id: "Demi-Elfe",
    description: "Kaelen possède de longs cheveux argentés tressés, une armure étincelante avec le sceau de Lathandre et une cicatrice à l'œil gauche. (Test de longueur de texte pour la description, ceci devrait retourner à la ligne automatiquement si le splitTextToSize fonctionne bien. On ajoute encore un peu de texte pour vérifier que le bloc ne déborde pas sur le reste de la fiche de personnage).",
    backstory: "Né dans les ruelles d'Eauprofonde, recueilli par le clergé après avoir manifesté des pouvoirs incontrôlables. Il a purgé sa peine en combattant les gobelours dans les montagnes de l'Épine Dorsale du Monde. (Test de retour à la ligne pour l'historique de la page 2. On ajoute du texte factice pour bien remplir le bloc de la fiche et vérifier l'interligne).",
    data: {
      str: 16, dex: 12, con: 14, int: 10, wis: 10, cha: 16,
      speed_m: 9, hp: 55, hp_max: 55,
      money_pp: 10, money_po: 250, money_pa: 45, money_pc: 8,
      ac: 18,
      initiative: "+1",
      prof: "+3",
      // Armes
      arsenal: [
        { name: "Épée Longue Radiante", stats: { atk: "+6", dmg: "1d8+3 Tranchant" } },
        { name: "Javelot de foudre", stats: { atk: "+6", dmg: "1d6+3 Perçant" } },
        { name: "Marteau de guerre", stats: { atk: "+6", dmg: "1d8+3 Contondant" } },
        { name: "Dague cachée", stats: { atk: "+4", dmg: "1d4+1 Perçant" } }
      ],
      // 15 Objets factices
      inventory: Array.from({length: 15}, (_, i) => ({ name: `Objet Factice n°${i+1} pour tester l'alignement`, quantity: Math.floor(Math.random() * 5) + 1, weight: "1kg" })),
      
      // Capacités et Traits
      features: "• Châtiment Divin\n• Sens Divin\n• Imposition des mains (35 PV)\n• Style de combat: Défense\n• Pacte de la Lame\n• Décharge Déchirante (Agonisante)\n• Vision du Diable (Test de saut de ligne)",
      
      // Maîtrises et Langues
      proficiencies: "Armures lourdes, Armes martiales.\nOutils de forgeron.\nLangues : Commun, Elfique, Céleste, Abyssal.",
      
      // Magie
      spell_class: "Paladin/Sorcier",
      spell_ability: "Charisme",
      spell_dc: "14",
      spell_atk: "+6",
      spells: {
        0: ["Décharge Déchirante", "Lumière", "Prestidigitation", "Illusion mineure"],
        1: ["Bénédiction", "Bouclier de la foi", "Châtiment tonitruant", "Maléfice", "Armure d'Agathys"],
        2: ["Trouver une monture", "Arme magique", "Pas brumeux", "Ténèbres"],
        3: ["Vol", "Boule de feu", "Dissipation de la magie"],
        4: ["Bannissement", "Dimension porte"],
        5: ["Cône de froid"],
        6: ["Désintégration"]
      }
    }
  };

  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    // On réutilise le moteur D&D avec notre personnage factice
    const { generateDnD5PDF } = await import('./dnd5e');
    await generateDnD5PDF(doc, mockCharacter);
    
    doc.save('CRASH_TEST_DND5.pdf');
  } catch (e) {
    console.error(e);
    alert("Erreur lors du Crash Test PDF.");
  }
};