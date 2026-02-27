// src/utils/pdfGenerator/dnd5e.js
import { calculateCombatStats } from '../rulesEngine';

const loadImageSafe = async (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); 
    img.src = src;
  });
};

const loadCustomFont = async (doc, fontPath, fontName, fontStyle) => {
  try {
    const response = await fetch(fontPath);
    if (!response.ok) throw new Error("Fichier de police introuvable");
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Font = btoa(binary);
    doc.addFileToVFS(fontPath, base64Font);
    doc.addFont(fontPath, fontName, fontStyle);
    return true;
  } catch (error) {
    console.warn(`Impossible de charger la police ${fontPath}, utilisation de la police par défaut.`, error);
    return false;
  }
};

export const generateDnD5PDF = async (doc, character) => {
  const [imgPage1, imgPage2, imgPage3] = await Promise.all([
    loadImageSafe('/sheet_page1.jpg'),
    loadImageSafe('/sheet_page2.jpg'),
    loadImageSafe('/sheet_page3.jpg'),
    loadCustomFont(doc, '/custom_font.ttf', 'MaPolicePerso', 'normal')
  ]);
  
  const d = character.data || {};
  
  let derived = {};
  if (typeof character.level === 'number') {
      derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
  } else {
      derived = d; 
  }
  
  const getMod = (score) => {
    const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  doc.setFont("MaPolicePerso", "normal");
  doc.setTextColor(30, 30, 30); 

  // ==============================================================================
  // 📖 TUTORIEL DE CALIBRAGE DES COORDONNÉES (X, Y)
  // ==============================================================================
  // La fonction utilisée est : doc.text("Texte à écrire", X, Y);
  // 
  // L'axe X (Horizontal) :
  // - 0 est le bord tout à fait à gauche de la feuille.
  // - 210 est le bord tout à fait à droite de la feuille.
  // -> Pour déplacer un texte vers la DROITE, augmentez le X (ex: passez de 25 à 30).
  // -> Pour déplacer un texte vers la GAUCHE, diminuez le X (ex: passez de 25 à 20).
  //
  // L'axe Y (Vertical) :
  // - 0 est le bord tout en haut de la feuille.
  // - 297 est le bord tout en bas de la feuille.
  // -> Pour descendre un texte, AUGMENTEZ le Y (ex: passez de 20 à 25).
  // -> Pour monter un texte, DIMINUEZ le Y (ex: passez de 20 à 15).
  // ==============================================================================

  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  // --- BLOC 1 : EN-TÊTE ---
  doc.setFontSize(11);
  doc.text(character.name || 'Héros Inconnu', 25, 20); // Nom du personnage
  doc.text(character.class_name || 'Aventurier', 90, 20); // Classe
  doc.text('Aventure', 40, 27); // Historique
  doc.text(character.race_id || 'Humain', 25, 34); // Race
  
  doc.setFontSize(14);
  doc.text(String(character.level || 1), 133, 26); // Niveau

  // --- BLOC 2 : CARACTÉRISTIQUES ---
  // L'option { align: "center" } centre le texte sur le point X fourni.
  doc.setFontSize(12);
  
  doc.text(String(d.str || 10), 24, 88, { align: "center" }); // FORCE Valeur
  doc.text(getMod(d.str), 24, 102, { align: "center" });      // FORCE Modificateur
  
  doc.text(String(d.dex || 10), 24, 131, { align: "center" }); // DEXTÉRITÉ Valeur
  doc.text(getMod(d.dex), 24, 145, { align: "center" });       // DEXTÉRITÉ Modificateur
  
  doc.text(String(d.con || 10), 24, 175, { align: "center" }); // CONSTITUTION Valeur
  doc.text(getMod(d.con), 24, 189, { align: "center" });       // CONSTITUTION Modificateur

  doc.text(String(d.int || 10), 56, 73, { align: "center" }); // INTELLIGENCE Valeur
  doc.text(getMod(d.int), 56, 88, { align: "center" });       // INTELLIGENCE Modificateur
  
  doc.text(String(d.wis || 10), 56, 128, { align: "center" }); // SAGESSE Valeur
  doc.text(getMod(d.wis), 56, 143, { align: "center" });       // SAGESSE Modificateur
  
  doc.text(String(d.cha || 10), 56, 185, { align: "center" }); // CHARISME Valeur
  doc.text(getMod(d.cha), 56, 200, { align: "center" });       // CHARISME Modificateur

  // --- BLOC 3 : COMBAT ET PERCEPTION ---
  doc.setFontSize(16);
  doc.text(derived.prof || '+2', 34, 52, { align: "center" }); // Bonus de Maîtrise
  doc.text(String(derived.ac || 10), 108, 30, { align: "center" }); // Classe d'Armure
  
  doc.setFontSize(12);
  doc.text(String(derived.hp || 10), 165, 33, { align: "center" }); // PV Max
  doc.text(String(derived.hp || 10), 140, 33, { align: "center" }); // PV Actuels
  doc.text(derived.init || '+0', 104, 55, { align: "center" }); // Initiative
  doc.text(String(d.speed_m || '9') + 'm', 132, 55, { align: "center" }); // Vitesse
  
  doc.text(String(derived.passive_perception || 10), 24, 230, { align: "center" }); // Perception Passive

  // --- BLOC 4 : ARSENAL ---
  if (d.arsenal && d.arsenal.length > 0) {
    doc.setFontSize(9);
    let startY = 83; // Y de la première ligne d'arme
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 20), 95, startY);
       doc.text(arme.stats?.atk || '+0', 135, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 155, startY, { align: "center" });
       startY += 9; // On descend de 9mm pour l'arme suivante
    });
  }

  // --- BLOC 5 : TEXTES LONGS ---
  // doc.splitTextToSize(texte, largeur_max) coupe le texte pour qu'il revienne à la ligne.
  // 65 représente la largeur maximum du cadre en millimètres.
  doc.setFontSize(8);
  
  if (d.racial_traits) {
    const splitRacial = doc.splitTextToSize(d.racial_traits, 65); 
    doc.text(splitRacial, 135, 115); // Traits Raciaux & Dons
  }

  if (d.proficiencies) {
    const splitProfs = doc.splitTextToSize(d.proficiencies, 65);
    doc.text(splitProfs, 25, 250); // Entraînement et Maîtrises
  }

  // ==============================================================================
  // PAGE 2 : INVENTAIRE ET BIO
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(9);
  
  if (d.inventory && d.inventory.length > 0) {
    let invY = 165; // Y de départ de l'inventaire
    d.inventory.slice(0, 15).forEach((item) => {
       const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
       doc.text(`- ${item.name}${qty}`, 135, invY);
       invY += 5.5; // Espacement de 5.5mm entre chaque objet
    });
  }

  doc.setFontSize(11);
  doc.text(String(d.money_pc || 0), 145, 275, { align: "center" });
  doc.text(String(d.money_pa || 0), 160, 275, { align: "center" });
  doc.text(String(d.money_po || 0), 185, 275, { align: "center" });

  doc.setFontSize(8);
  if (character.description) {
    const splitDesc = doc.splitTextToSize(character.description, 60);
    doc.text(splitDesc, 135, 25);
  }
  if (character.backstory) {
    const splitStory = doc.splitTextToSize(character.backstory, 60);
    doc.text(splitStory, 135, 75);
  }

  // ==============================================================================
  // PAGE 3 : GRIMOIRE
  // ==============================================================================
  if (imgPage3 || d.spells) { 
    doc.addPage();
    if (imgPage3) doc.addImage(imgPage3, 'JPEG', 0, 0, 210, 297);
    
    doc.setFontSize(11);
    doc.text(d.spell_class || 'Classe', 80, 22);
    doc.text(d.spell_ability || 'CAR', 125, 22);
    doc.text(d.spell_dc || '10', 150, 22);
    doc.text(d.spell_atk || '+0', 175, 22);

    doc.setFontSize(9);

    let y0 = 55; (d.spells?.[0] || []).forEach(s => { doc.text(s, 25, y0); y0 += 6.5; });
    let y1 = 115; (d.spells?.[1] || []).forEach(s => { doc.text(s, 25, y1); y1 += 6.5; });
    let y2 = 195; (d.spells?.[2] || []).forEach(s => { doc.text(s, 25, y2); y2 += 6.5; });

    let y3 = 55; (d.spells?.[3] || []).forEach(s => { doc.text(s, 95, y3); y3 += 6.5; });
    let y4 = 125; (d.spells?.[4] || []).forEach(s => { doc.text(s, 95, y4); y4 += 6.5; });
    let y5 = 195; (d.spells?.[5] || []).forEach(s => { doc.text(s, 95, y5); y5 += 6.5; });

    let y6 = 55; (d.spells?.[6] || []).forEach(s => { doc.text(s, 160, y6); y6 += 6.5; });
    let y7 = 115; (d.spells?.[7] || []).forEach(s => { doc.text(s, 160, y7); y7 += 6.5; });
    let y8 = 165; (d.spells?.[8] || []).forEach(s => { doc.text(s, 160, y8); y8 += 6.5; });
    let y9 = 215; (d.spells?.[9] || []).forEach(s => { doc.text(s, 160, y9); y9 += 6.5; });
  }
};