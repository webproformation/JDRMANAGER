// src/utils/pdfGenerator.js
import { calculateCombatStats } from './rulesEngine';

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`Impossible de charger ${src}`));
  img.src = src;
});

// Le moteur de dessin spécifique à D&D 5E
const generateDnD5PDF = async (doc, character) => {
  const [imgPage1, imgPage2] = await Promise.all([
    loadImage('/sheet_page1.jpg'),
    loadImage('/sheet_page2.jpg')
  ]);
  
  const d = character.data || {};
  const derived = calculateCombatStats('dnd5', d, character.level);
  
  const getMod = (score) => {
    const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30); 

  // --- PAGE 1 ---
  doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(11);
  doc.text(character.name || 'Héros Inconnu', 25, 20); 
  doc.text('Aventurier', 90, 20); 
  doc.text('Aventure', 40, 27); 
  doc.text(character.race_id || 'Humain', 25, 34); 
  
  doc.setFontSize(14);
  doc.text(String(character.level || 1), 133, 26); 

  doc.setFontSize(12);
  doc.text(String(d.str || 10), 24, 88, { align: "center" }); 
  doc.text(getMod(d.str), 24, 102, { align: "center" });      
  
  doc.text(String(d.dex || 10), 24, 131, { align: "center" }); 
  doc.text(getMod(d.dex), 24, 145, { align: "center" });       
  
  doc.text(String(d.con || 10), 24, 175, { align: "center" }); 
  doc.text(getMod(d.con), 24, 189, { align: "center" });       

  doc.text(String(d.int || 10), 56, 73, { align: "center" }); 
  doc.text(getMod(d.int), 56, 88, { align: "center" });       
  
  doc.text(String(d.wis || 10), 56, 128, { align: "center" }); 
  doc.text(getMod(d.wis), 56, 143, { align: "center" });       
  
  doc.text(String(d.cha || 10), 56, 185, { align: "center" }); 
  doc.text(getMod(d.cha), 56, 200, { align: "center" });       

  doc.setFontSize(16);
  doc.text(derived.prof || '+2', 34, 52, { align: "center" }); 
  doc.text(String(derived.ac || 10), 108, 30, { align: "center" }); 
  
  doc.setFontSize(12);
  doc.text(String(derived.hp || 10), 165, 33, { align: "center" }); 
  doc.text(String(derived.hp || 10), 140, 33, { align: "center" }); 
  doc.text(derived.init || '+0', 104, 55, { align: "center" }); 
  doc.text((d.speed_m || '9') + 'm', 132, 55, { align: "center" }); 

  if (d.arsenal && d.arsenal.length > 0) {
    doc.setFontSize(9);
    let startY = 83;
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 20), 95, startY);
       doc.text(arme.stats?.atk || '+0', 135, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 155, startY, { align: "center" });
       startY += 9; 
    });
  }

  // --- PAGE 2 ---
  doc.addPage();
  doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(9);
  
  if (d.inventory && d.inventory.length > 0) {
    let invY = 165;
    d.inventory.slice(0, 15).forEach((item) => {
       const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
       doc.text(`- ${item.name}${qty}`, 135, invY);
       invY += 5.5;
    });
  }

  doc.setFontSize(11);
  doc.text(String(d.money_pc || 0), 145, 275, { align: "center" });
  doc.text(String(d.money_pa || 0), 160, 275, { align: "center" });
  doc.text(String(d.money_po || 0), 185, 275, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  
  if (character.description) {
    const splitDesc = doc.splitTextToSize(character.description, 60);
    doc.text(splitDesc, 135, 25);
  }
  if (character.backstory) {
    const splitStory = doc.splitTextToSize(character.backstory, 60);
    doc.text(splitStory, 135, 75);
  }
};

// Le contrôleur d'impression Universel
export const generatePDF = async (character) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    
    const ruleset = character.ruleset_id || 'dnd5';

    // Aiguillage selon le jeu
    if (ruleset === 'dnd5') {
        await generateDnD5PDF(doc, character);
    } else {
        alert(`La génération PDF pour le système de jeu "${ruleset}" n'est pas encore configurée.`);
        return;
    }

    doc.save(`${character.name}_Feuille_de_Perso.pdf`);
    
  } catch (e) {
    console.error(e);
    alert("Erreur de génération. Vérifiez que jsPDF est installé et que les images sont dans le dossier /public.");
  }
};