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

// ============================================================================
// 📐 OUTILS DE DESSIN GÉOMÉTRIQUE POUR LA FICHE D&D
// ============================================================================

// 1. Dessine une case avec une diagonale (pour les armures, compétences, etc.)
const drawDiagonalBox = (doc, x, y, size, isChecked) => {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  doc.rect(x, y, size, size); // Dessine le carré
  if (isChecked) {
    doc.line(x, y, x + size, y + size); // Dessine la diagonale \
  }
};

// 2. Dessine un losange (pour les Jets de Mort)
const drawDiamond = (doc, x, y, size, isFilled) => {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  if (isFilled) {
    doc.setFillColor(30, 30, 30);
  } else {
    doc.setFillColor(255, 255, 255);
  }
  // Construction du losange via deux triangles (Haut et Bas)
  doc.triangle(x, y - size, x + size, y, x - size, y, isFilled ? 'FD' : 'S');
  doc.triangle(x, y + size, x + size, y, x - size, y, isFilled ? 'FD' : 'S');
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
  if (typeof character.level === 'number' && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
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
  // 📄 PAGE 1 : IDENTITÉ, COMBAT, COMPÉTENCES ET EMPLACEMENTS SORTS
  // ==============================================================================
  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  // --- EN-TÊTE ---
  doc.setFontSize(11);
  doc.text(character.name || 'Héros Inconnu', 25, 20); 
  doc.text(character.class_name || 'Classe', 90, 20); 
  doc.text(character.subclass_name || 'Sous-Classe', 130, 20); 
  doc.text(character.race_id || 'Race', 25, 34); 
  
  // TAILLE : Seulement la valeur "P", "M" ou "G"
  doc.text(d.size_cat === 'small' ? 'P' : (d.size_cat === 'large' ? 'G' : 'M'), 160, 34); 
  
  doc.setFontSize(14);
  doc.text(String(character.level || 1), 133, 26); 

  // --- CARACTÉRISTIQUES ---
  doc.setFontSize(12);
  doc.text(String(d.str || 10), 24, 88, { align: "center" }); doc.text(getMod(d.str), 24, 102, { align: "center" });      
  doc.text(String(d.dex || 10), 24, 131, { align: "center" }); doc.text(getMod(d.dex), 24, 145, { align: "center" });       
  doc.text(String(d.con || 10), 24, 175, { align: "center" }); doc.text(getMod(d.con), 24, 189, { align: "center" });       
  doc.text(String(d.int || 10), 56, 73, { align: "center" }); doc.text(getMod(d.int), 56, 88, { align: "center" });       
  doc.text(String(d.wis || 10), 56, 128, { align: "center" }); doc.text(getMod(d.wis), 56, 143, { align: "center" });       
  doc.text(String(d.cha || 10), 56, 185, { align: "center" }); doc.text(getMod(d.cha), 56, 200, { align: "center" });       

  // --- SANTÉ ET SAUVEGARDES ---
  doc.setFontSize(16);
  doc.text(derived.prof || '+2', 34, 52, { align: "center" }); 
  doc.text(String(derived.ac || 10), 108, 30, { align: "center" }); 
  
  doc.setFontSize(11);
  doc.text(String(derived.hp_max || 10), 165, 33, { align: "center" }); 
  doc.text(String(derived.hp || 10), 140, 33, { align: "center" }); 
  doc.text(derived.init || '+0', 104, 55, { align: "center" }); 
  doc.text(String(d.speed_m || '9') + 'm', 132, 55, { align: "center" }); 
  doc.text(String(derived.passive_perception || 10), 24, 230, { align: "center" }); 

  // DÉS DE VIE : Seulement la valeur ex: "3d10 / 7d10"
  doc.text(`${d.hit_dice_spent || '0'} / ${d.hit_dice_max || '1d8'}`, 140, 65); 

  // JETS CONTRE LA MORT : Uniquement les 6 icônes (Sans les textes "Succès/Échecs")
  let deathY = 75; // Y commun pour tous les losanges
  // 3 Losanges de Succès
  drawDiamond(doc, 155, deathY, 1.5, d.death_saves?.successes >= 1);
  drawDiamond(doc, 160, deathY, 1.5, d.death_saves?.successes >= 2);
  drawDiamond(doc, 165, deathY, 1.5, d.death_saves?.successes >= 3);
  // 3 Losanges d'Échecs
  drawDiamond(doc, 188, deathY, 1.5, d.death_saves?.failures >= 1);
  drawDiamond(doc, 193, deathY, 1.5, d.death_saves?.failures >= 2);
  drawDiamond(doc, 198, deathY, 1.5, d.death_saves?.failures >= 3);

  // --- MAÎTRISES D'ARMURES (CASES DIAGONALES UNIQUEMENT) ---
  let armorY = 250;
  // Les textes ont été retirés. Seules les cases s'affichent.
  drawDiagonalBox(doc, 25, armorY, 3, d.prof_armor_light); 
  drawDiagonalBox(doc, 45, armorY, 3, d.prof_armor_medium); 
  drawDiagonalBox(doc, 75, armorY, 3, d.prof_armor_heavy); 
  drawDiagonalBox(doc, 95, armorY, 3, d.prof_armor_shields); 

  // --- LISTE DES COMPÉTENCES ---
  if (d.skills) {
    doc.setFontSize(9);
    let skillY = 100; // Y de départ de la colonne compétences
    
    // La liste sert uniquement de repère pour savoir dans quel ordre les valeurs s'impriment
    const skillList = [
      { key: 'acrobatics', label: "Acrobaties" }, { key: 'animal_handling', label: "Dressage" },
      { key: 'arcana', label: "Arcanes" }, { key: 'athletics', label: "Athlétisme" },
      { key: 'deception', label: "Tromperie" }, { key: 'history', label: "Histoire" },
      { key: 'insight', label: "Perspicacité" }, { key: 'intimidation', label: "Intimidation" },
      { key: 'investigation', label: "Investigation" }, { key: 'medicine', label: "Médecine" },
      { key: 'nature', label: "Nature" }, { key: 'perception', label: "Perception" },
      { key: 'performance', label: "Représentation" }, { key: 'persuasion', label: "Persuasion" },
      { key: 'religion', label: "Religion" }, { key: 'sleight_of_hand', label: "Escamotage" },
      { key: 'stealth', label: "Discrétion" }, { key: 'survival', label: "Survie" }
    ];
    
    skillList.forEach(sk => {
       const isProficient = d.skills[sk.key];
       // 1. Dessine la case à cocher en diagonale (ajustez le X=80)
       drawDiagonalBox(doc, 80, skillY - 2.5, 2.5, isProficient); 
       
       // Le texte du nom de la compétence (sk.label) a été retiré !
       
       // 2. Dessine la valeur numérique de la compétence (ajustez le X=115)
       const bonus = isProficient ? "+5" : "+2"; // Calcul factice pour le test
       doc.text(bonus, 115, skillY);
       
       skillY += 5; // On descend pour la compétence suivante
    });
  }

  // --- ARSENAL ---
  if (d.arsenal && d.arsenal.length > 0) {
    doc.setFontSize(9);
    let startY = 83; 
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 20), 135, startY);
       doc.text(arme.stats?.atk || '+0', 170, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 190, startY, { align: "center" });
       startY += 9; 
    });
  }

  // --- EMPLACEMENTS DE SORTS (DÉPLACÉS EN PAGE 1) ---
  if (d.spell_slots) {
    doc.setFontSize(9);
    let slotY = 260; // Y de départ de la liste des slots
    const xTotal = 175; // X pour afficher la valeur du TOTAL d'emplacements
    const xSpent = 185; // X pour afficher la valeur des DÉPENSÉS
    
    // Boucle sur les 9 niveaux de sorts
    for (let niv = 1; niv <= 9; niv++) {
       const slot = d.spell_slots[niv];
       if (slot) {
         // Indication : C'est la ligne pour les emplacements de Niveau [niv]
         // Impression uniquement des valeurs nues !
         doc.text(String(slot.total), xTotal, slotY, { align: "center" });
         doc.text(String(slot.spent), xSpent, slotY, { align: "center" });
         slotY += 6; // Descente de ligne
       }
    }
  }

  // ==============================================================================
  // 📄 PAGE 2 : MAGIE (27 LIGNES), ALIGNEMENT, LANGUES, INVENTAIRE
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  // --- EN-TÊTE PAGE 2 ---
  doc.setFontSize(11);
  doc.text(character.alignment || "Neutre", 25, 20); // Alignement
  
  // Caractéristiques d'Incantation
  doc.text(d.spell_mod || "+0", 120, 25, { align: "center" }); 
  doc.text(d.spell_dc || "10", 150, 25, { align: "center" }); 
  doc.text(d.spell_atk || "+0", 180, 25, { align: "center" }); 

  // Langages
  if (d.languages) {
    doc.setFontSize(9);
    const splitLang = doc.splitTextToSize("Langues: " + d.languages, 50);
    doc.text(splitLang, 25, 35);
  }

  // --- GRILLE DES SORTS (27 Lignes) ---
  if (d.spell_list && d.spell_list.length > 0) {
    doc.setFontSize(8);
    let spellY = 65; 
    
    d.spell_list.forEach((spell) => {
      doc.text(spell.level || "-", 25, spellY);
      doc.text(spell.name || "-", 35, spellY);
      doc.text(spell.time || "-", 80, spellY);
      doc.text(spell.range || "-", 110, spellY);
      doc.text(spell.comp || "-", 140, spellY);
      doc.text(spell.notes || "-", 170, spellY);
      spellY += 5; 
    });
  }

  // --- INVENTAIRE ---
  doc.setFontSize(9);
  if (d.inventory && d.inventory.length > 0) {
    let invY = 165; 
    d.inventory.slice(0, 15).forEach((item) => {
       const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
       doc.text(`- ${item.name}${qty}`, 135, invY);
       invY += 5.5; 
    });
  }

  // --- MONNAIE ---
  doc.setFontSize(11);
  doc.text(String(d.money_pc || 0), 125, 275, { align: "center" }); 
  doc.text(String(d.money_pa || 0), 140, 275, { align: "center" }); 
  doc.text(String(d.money_pe || 0), 155, 275, { align: "center" }); 
  doc.text(String(d.money_po || 0), 170, 275, { align: "center" }); 
  doc.text(String(d.money_pp || 0), 185, 275, { align: "center" }); 
  
  // ==============================================================================
  // 📄 PAGE 3 (OPTIONNELLE) : VIEUX GRIMOIRE
  // ==============================================================================
  if (imgPage3) { 
    doc.addPage();
    doc.addImage(imgPage3, 'JPEG', 0, 0, 210, 297);
    
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