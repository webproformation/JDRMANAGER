// src/utils/pdfGenerator/dnd5e.js
import { calculateCombatStats } from '../rulesEngine';

const loadImageSafe = async (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // Ne fait pas planter si l'image n'existe pas
    img.src = src;
  });
};

export const generateDnD5PDF = async (doc, character) => {
  // Chargement des 3 pages (Si sheet_page3.jpg n'existe pas, imgPage3 vaudra null)
  const [imgPage1, imgPage2, imgPage3] = await Promise.all([
    loadImageSafe('/sheet_page1.jpg'),
    loadImageSafe('/sheet_page2.jpg'),
    loadImageSafe('/sheet_page3.jpg')
  ]);
  
  const d = character.data || {};
  
  // Pour le crash test, on évite d'écraser les valeurs manuelles si on passe une fausse string dans 'level'
  let derived = {};
  if (typeof character.level === 'number') {
      derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
  } else {
      derived = d; // Mode Crash Test
  }
  
  const getMod = (score) => {
    const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30); 

  // ==========================================
  // PAGE 1 : IDENTITÉ, STATS ET COMBAT
  // ==========================================
  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(11);
  doc.text(character.name || 'Héros Inconnu', 25, 20); 
  doc.text(character.class_name || 'Aventurier', 90, 20); 
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
  doc.text(String(d.speed_m || '9') + 'm', 132, 55, { align: "center" }); 

  // Arsenal / Armes
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

  // Traits et Capacités (En bas à droite généralement)
  if (d.features) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const splitFeatures = doc.splitTextToSize(d.features, 65); 
    doc.text(splitFeatures, 135, 115); // COORDONNÉES À AJUSTER (X, Y)
  }

  // Maîtrises et Langues (En bas à gauche généralement)
  if (d.proficiencies) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const splitProfs = doc.splitTextToSize(d.proficiencies, 65);
    doc.text(splitProfs, 25, 220); // COORDONNÉES À AJUSTER (X, Y)
  }

  // ==========================================
  // PAGE 2 : INVENTAIRE ET BIO
  // ==========================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
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

  // ==========================================
  // PAGE 3 : GRIMOIRE ET SORTS
  // ==========================================
  if (imgPage3 || d.spells) { // Si l'image page 3 existe, ou s'il y a des sorts à imprimer
    doc.addPage();
    if (imgPage3) doc.addImage(imgPage3, 'JPEG', 0, 0, 210, 297);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    
    // En-tête des sorts
    doc.text(d.spell_class || 'Classe', 80, 22);
    doc.text(d.spell_ability || 'CAR', 125, 22);
    doc.text(d.spell_dc || '10', 150, 22);
    doc.text(d.spell_atk || '+0', 175, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Colonne de Gauche
    let y0 = 55;
    (d.spells?.[0] || []).forEach(s => { doc.text(s, 25, y0); y0 += 6.5; });
    
    let y1 = 115;
    (d.spells?.[1] || []).forEach(s => { doc.text(s, 25, y1); y1 += 6.5; });
    
    let y2 = 195;
    (d.spells?.[2] || []).forEach(s => { doc.text(s, 25, y2); y2 += 6.5; });

    // Colonne Centrale
    let y3 = 55;
    (d.spells?.[3] || []).forEach(s => { doc.text(s, 95, y3); y3 += 6.5; });

    let y4 = 125;
    (d.spells?.[4] || []).forEach(s => { doc.text(s, 95, y4); y4 += 6.5; });

    let y5 = 195;
    (d.spells?.[5] || []).forEach(s => { doc.text(s, 95, y5); y5 += 6.5; });

    // Colonne de Droite
    let y6 = 55;
    (d.spells?.[6] || []).forEach(s => { doc.text(s, 160, y6); y6 += 6.5; });

    let y7 = 115;
    (d.spells?.[7] || []).forEach(s => { doc.text(s, 160, y7); y7 += 6.5; });

    let y8 = 165;
    (d.spells?.[8] || []).forEach(s => { doc.text(s, 160, y8); y8 += 6.5; });

    let y9 = 215;
    (d.spells?.[9] || []).forEach(s => { doc.text(s, 160, y9); y9 += 6.5; });
  }
};