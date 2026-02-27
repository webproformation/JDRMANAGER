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
// 📐 OUTIL GÉOMÉTRIQUE : LE LOSANGE
// ============================================================================
// Remplace toutes les anciennes cases à cocher. Utilisé pour :
// - Les Jets contre la mort
// - Les Maîtrises d'Armures
// - Les Composantes de Sorts (V, S, M)
const drawDiamond = (doc, x, y, size, isFilled) => {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  if (isFilled) {
    doc.setFillColor(30, 30, 30);
  } else {
    doc.setFillColor(255, 255, 255);
  }
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
  doc.text(character.name || '', 25, 20); 
  doc.text(character.class_name || '', 90, 20); 
  // SOUS-CLASSE 
  doc.text(character.subclass_name || '', 130, 20); 
  doc.text(character.race_id || '', 25, 34); 
  
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

  // DÉS DE VIE : Seulement la valeur brute
  doc.text(`${d.hit_dice_spent || '0'} / ${d.hit_dice_max || '1d8'}`, 140, 65); 

  // JETS CONTRE LA MORT (Uniquement les 6 Losanges)
  let deathY = 75; 
  drawDiamond(doc, 155, deathY, 1.5, d.death_saves?.successes >= 1);
  drawDiamond(doc, 160, deathY, 1.5, d.death_saves?.successes >= 2);
  drawDiamond(doc, 165, deathY, 1.5, d.death_saves?.successes >= 3);

  drawDiamond(doc, 188, deathY, 1.5, d.death_saves?.failures >= 1);
  drawDiamond(doc, 193, deathY, 1.5, d.death_saves?.failures >= 2);
  drawDiamond(doc, 198, deathY, 1.5, d.death_saves?.failures >= 3);

  // --- MAÎTRISES D'ARMURES (LOSANGES AU LIEU DE CASES COCHÉES) ---
  let armorY = 250;
  drawDiamond(doc, 25, armorY, 1.5, d.prof_armor_light); 
  drawDiamond(doc, 45, armorY, 1.5, d.prof_armor_medium); 
  drawDiamond(doc, 75, armorY, 1.5, d.prof_armor_heavy); 
  drawDiamond(doc, 95, armorY, 1.5, d.prof_armor_shields); 

  // --- COMPÉTENCES (VALEURS UNIQUEMENT) ---
  if (d.skills) {
    doc.setFontSize(9);
    let skillY = 100; // Y de la première compétence
    
    // Tableau indicatif pour ajuster chaque ligne dans l'ordre de votre fiche
    const skillList = [
      { key: 'acrobatics' }, { key: 'animal_handling' }, { key: 'arcana' }, { key: 'athletics' },
      { key: 'deception' }, { key: 'history' }, { key: 'insight' }, { key: 'intimidation' },
      { key: 'investigation' }, { key: 'medicine' }, { key: 'nature' }, { key: 'perception' },
      { key: 'performance' }, { key: 'persuasion' }, { key: 'religion' }, { key: 'sleight_of_hand' },
      { key: 'stealth' }, { key: 'survival' }
    ];
    
    skillList.forEach(sk => {
       const isProficient = d.skills[sk.key];
       const bonus = isProficient ? "+5" : "+2"; 
       
       // On n'imprime QUE le chiffre du bonus ! (Ajustez le X=115 et l'espacement de 5mm)
       doc.text(bonus, 115, skillY);
       skillY += 5; 
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

  // --- EMPLACEMENTS DE SORTS (PAGE 1) ---
  if (d.spell_slots) {
    doc.setFontSize(9);
    let slotY = 260; // Y de départ de la liste des slots en page 1
    const xTotal = 175; // X du nombre total
    const xSpent = 185; // X du nombre dépensé
    
    for (let niv = 1; niv <= 9; niv++) {
       const slot = d.spell_slots[niv];
       if (slot) {
         doc.text(String(slot.total), xTotal, slotY, { align: "center" });
         doc.text(String(slot.spent), xSpent, slotY, { align: "center" });
         slotY += 6; 
       }
    }
  }

  // --- BLOCS DE TEXTES MANQUANTS (TRAITS, OUTILS, CAPACITÉS) ---
  doc.setFontSize(8);
  
  // Traits Raciaux & Dons
  if (d.racial_traits) {
    const splitRacial = doc.splitTextToSize(d.racial_traits, 65); 
    // Si cela n'apparaissait pas, j'ai décalé légèrement pour être sûr qu'il est dans la zone blanche
    doc.text(splitRacial, 135, 115); 
  }

  // Entraînement et Maîtrises (Armes et Outils)
  if (d.proficiencies) {
    const splitProfs = doc.splitTextToSize(d.proficiencies, 65);
    // Placé par défaut en bas à gauche de la page 1 (Ajustez 25, 250)
    doc.text(splitProfs, 25, 250); 
  }

  // Capacités de Classe
  if (d.features) {
    const splitFeatures = doc.splitTextToSize(d.features, 65);
    // Placé par défaut en bas à droite de la page 1 (Ajustez 135, 180)
    doc.text(splitFeatures, 135, 180); 
  }


  // ==============================================================================
  // 📄 PAGE 2 : MAGIE (27 LIGNES), ALIGNEMENT, LANGUES, INVENTAIRE
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  // --- EN-TÊTE PAGE 2 ---
  doc.setFontSize(11);
  doc.text(character.alignment || "", 25, 20); // Alignement
  
  doc.text(d.spell_mod || "+0", 120, 25, { align: "center" }); 
  doc.text(d.spell_dc || "10", 150, 25, { align: "center" }); 
  doc.text(d.spell_atk || "+0", 180, 25, { align: "center" }); 

  if (d.languages) {
    doc.setFontSize(9);
    const splitLang = doc.splitTextToSize(d.languages, 50); // Le mot "Langues:" a été retiré
    doc.text(splitLang, 25, 35);
  }

  // --- GRILLE DES SORTS (27 Lignes avec Losanges V,S,M) ---
  if (d.spell_list && d.spell_list.length > 0) {
    doc.setFontSize(8);
    let spellY = 65; 
    
    d.spell_list.forEach((spell) => {
      // Textes
      doc.text(spell.level || "", 25, spellY);
      doc.text(spell.name || "", 35, spellY);
      doc.text(spell.time || "", 80, spellY);
      doc.text(spell.range || "", 110, spellY);
      doc.text(spell.notes || "", 170, spellY);

      // Composantes remplacées par des Losanges
      const comp = spell.comp || "";
      drawDiamond(doc, 140, spellY - 1, 1.2, comp.includes("V"));
      drawDiamond(doc, 145, spellY - 1, 1.2, comp.includes("S"));
      drawDiamond(doc, 150, spellY - 1, 1.2, comp.includes("M"));

      spellY += 5; // Ligne suivante
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
  
};