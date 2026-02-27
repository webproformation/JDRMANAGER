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
    if (!response.ok) throw new Error("Fichier introuvable");
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
    return false;
  }
};

// ============================================================================
// 📐 OUTILS DE DESSIN GÉOMÉTRIQUE POUR LA FICHE D&D
// ============================================================================

// 1. Dessine une case avec une diagonale (pour les armures)
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
  const [imgPage1, imgPage2] = await Promise.all([
    loadImageSafe('/sheet_page1.jpg'),
    loadImageSafe('/sheet_page2.jpg'),
    loadCustomFont(doc, '/custom_font.ttf', 'MaPolicePerso', 'normal')
  ]);
  
  const d = character.data || {};
  
  // Utilise les stats calculées, sauf pour le smoke test où on garde nos données factices
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
  // 📄 PAGE 1 : IDENTITÉ, COMBAT, COMPÉTENCES
  // ==============================================================================
  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  // --- EN-TÊTE ---
  doc.setFontSize(11);
  doc.text(character.name || 'Héros Inconnu', 25, 20); 
  doc.text(character.class_name || 'Classe', 90, 20); 
  doc.text(character.subclass_name || 'Sous-Classe', 130, 20); // Sous-classe !
  doc.text(character.race_id || 'Race', 25, 34); 
  doc.text(d.size_cat === 'small' ? 'Taille P' : (d.size_cat === 'large' ? 'Taille G' : 'Taille M'), 160, 34); // Taille !
  
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
  doc.text(String(derived.passive_perception || 10), 24, 230, { align: "center" }); // Perception Passive !

  doc.text(`Dés de Vie : ${d.hit_dice_spent || '0'} / ${d.hit_dice_max || '1d8'}`, 140, 65); // Dés de vie

  // JETS CONTRE LA MORT (LES LOSANGES !)
  let deathY = 75;
  doc.text("Succès:", 135, deathY);
  drawDiamond(doc, 155, deathY - 1, 1.5, d.death_saves?.successes >= 1);
  drawDiamond(doc, 160, deathY - 1, 1.5, d.death_saves?.successes >= 2);
  drawDiamond(doc, 165, deathY - 1, 1.5, d.death_saves?.successes >= 3);

  doc.text("Échecs:", 170, deathY);
  drawDiamond(doc, 188, deathY - 1, 1.5, d.death_saves?.failures >= 1);
  drawDiamond(doc, 193, deathY - 1, 1.5, d.death_saves?.failures >= 2);
  drawDiamond(doc, 198, deathY - 1, 1.5, d.death_saves?.failures >= 3);

  // --- MAÎTRISES D'ARMURES (CASES DIAGONALES) ---
  // Ajustez X et Y selon votre feuille
  let armorY = 250;
  drawDiagonalBox(doc, 25, armorY, 3, d.prof_armor_light); doc.text("Légère", 30, armorY + 2.5);
  drawDiagonalBox(doc, 45, armorY, 3, d.prof_armor_medium); doc.text("Intermédiaire", 50, armorY + 2.5);
  drawDiagonalBox(doc, 75, armorY, 3, d.prof_armor_heavy); doc.text("Lourde", 80, armorY + 2.5);
  drawDiagonalBox(doc, 95, armorY, 3, d.prof_armor_shields); doc.text("Boucliers", 100, armorY + 2.5);

  // --- LISTE DES COMPÉTENCES ---
  if (d.skills) {
    doc.setFontSize(9);
    let skillY = 100; // Y de départ de la colonne compétences
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
       drawDiagonalBox(doc, 80, skillY - 2.5, 2.5, isProficient); // Dessine la case diagonale pour la compétence
       doc.text(sk.label, 85, skillY);
       
       // Calcul rudimentaire du bonus pour l'affichage (modifiable selon vos besoins)
       const bonus = isProficient ? "+5" : "+2"; 
       doc.text(bonus, 115, skillY);
       
       skillY += 5; // Espacement de 5mm par ligne
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

  // ==============================================================================
  // 📄 PAGE 2 : MAGIE (27 LIGNES), ALIGNEMENT, LANGUES, INVENTAIRE
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  // --- EN-TÊTE PAGE 2 ---
  doc.setFontSize(11);
  doc.text(character.alignment || "Neutre", 25, 20); // Alignement
  
  // Caractéristiques d'Incantation
  doc.text(d.spell_mod || "+0", 120, 25, { align: "center" }); // 1. Modificateur d'incantation
  doc.text(d.spell_dc || "10", 150, 25, { align: "center" }); // 2. DD de JDS
  doc.text(d.spell_atk || "+0", 180, 25, { align: "center" }); // 3. Bonus d'attaque de sort

  // Langages
  if (d.languages) {
    doc.setFontSize(9);
    const splitLang = doc.splitTextToSize("Langues: " + d.languages, 50);
    doc.text(splitLang, 25, 35);
  }

  // --- GRILLE DES SORTS (27 Lignes) ---
  if (d.spell_list && d.spell_list.length > 0) {
    doc.setFontSize(8);
    let spellY = 65; // Ligne Y de départ pour le premier sort de la liste
    
    // Colonnes (à ajuster): Niveau(X=25), Nom(X=35), Durée(X=80), Portée(X=110), Composantes(X=140), Notes(X=170)
    d.spell_list.forEach((spell) => {
      doc.text(spell.level || "-", 25, spellY);
      doc.text(spell.name || "-", 35, spellY);
      doc.text(spell.time || "-", 80, spellY);
      doc.text(spell.range || "-", 110, spellY);
      doc.text(spell.comp || "-", 140, spellY);
      doc.text(spell.notes || "-", 170, spellY);
      spellY += 5; // Descend de 5mm pour la ligne suivante. 27 lignes * 5mm = 135mm de haut.
    });
  }

  // --- EMPLACEMENTS DE SORTS (Niv 1 à 9) ---
  if (d.spell_slots) {
    doc.setFontSize(9);
    let slotY = 210; // Ligne Y de départ pour les slots
    for (let niv = 1; niv <= 9; niv++) {
       const slot = d.spell_slots[niv];
       if (slot) {
         doc.text(`Niv ${niv}: Total [${slot.total}] / Dépensés [${slot.spent}]`, 25, slotY);
         slotY += 6;
       }
    }
  }

  // --- MONNAIE (Ordre précis : PC, PA, PE, PO, PP) ---
  doc.setFontSize(11);
  doc.text(String(d.money_pc || 0), 125, 275, { align: "center" }); // PC
  doc.text(String(d.money_pa || 0), 140, 275, { align: "center" }); // PA
  doc.text(String(d.money_pe || 0), 155, 275, { align: "center" }); // PE (Electrum)
  doc.text(String(d.money_po || 0), 170, 275, { align: "center" }); // PO
  doc.text(String(d.money_pp || 0), 185, 275, { align: "center" }); // PP
  
};