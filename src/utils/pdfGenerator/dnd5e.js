// src/utils/pdfGenerator/dnd5e.js
import { calculateCombatStats } from '../rulesEngine';
import { supabase } from '../../lib/supabase'; // Pour aller chercher le nom de la sous-classe

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
    console.warn(`Police ${fontPath} absente, bascule sur la police standard.`);
    return false;
  }
};

const drawDiamond = (doc, x, y, size, isFilled) => {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  if (isFilled) doc.setFillColor(30, 30, 30);
  else doc.setFillColor(255, 255, 255);
  doc.triangle(x, y - size, x + size, y, x - size, y, isFilled ? 'FD' : 'S');
  doc.triangle(x, y + size, x + size, y, x - size, y, isFilled ? 'FD' : 'S');
};

export const generateDnD5PDF = async (doc, character) => {
  // On récupère une variable isFontLoaded pour savoir si la police a réussi à charger
  const [imgPage1, imgPage2, isFontLoaded] = await Promise.all([
    loadImageSafe('/sheet_page1.jpg'),
    loadImageSafe('/sheet_page2.jpg'),
    loadCustomFont(doc, '/custom_font.ttf', 'MaPolicePerso', 'normal')
  ]);
  
  // Définit la police principale : votre police si elle existe, sinon l'Helvetica par défaut
  const mainFont = isFontLoaded ? 'MaPolicePerso' : 'helvetica';

  const d = character.data || {};
  let derived = {};
  if (typeof character.level === 'number' && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
      derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
  } else {
      derived = d; 
  }
  
  // --- RÉCUPÉRATION DES NOMS DE CLASSE ET SOUS-CLASSE DEPUIS LA BDD ---
  let classNameStr = character.class_name || '';
  let subclassStr = character.subclass_name || '';
  if (character.class_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: cData } = await supabase.from('character_classes').select('name').eq('id', character.class_id).single();
    if (cData) classNameStr = cData.name;
  }
  if (character.subclass_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: sData } = await supabase.from('subclasses').select('name').eq('id', character.subclass_id).single();
    if (sData) subclassStr = sData.name;
  }
  
  const getMod = (score) => {
    const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  doc.setFont(mainFont, "normal");
  doc.setTextColor(30, 30, 30); 

  // ==============================================================================
  // 📄 PAGE 1 : IDENTITÉ, COMBAT, COMPÉTENCES
  // ==============================================================================
  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  // L'ERREUR ÉTAIT ICI : doc.fontstyle('bold') N'EXISTE PAS.
  // LA BONNE SYNTAXE EST : doc.setFont(mainFont, "bold")
  doc.setFontSize(11); doc.setFont(mainFont, "bold");
  doc.text(character.name || '', 13, 13); 
  doc.text(classNameStr, 63, 21); 
  doc.text(subclassStr, 63, 29); 
  doc.text(character.race_id || '', 13, 29); 
  
  doc.text(d.size_cat === 'small' ? 'P' : (d.size_cat === 'large' ? 'G' : 'M'), 155, 58); 
  
  doc.setFontSize(16); doc.setFont(mainFont, "bold");
  doc.text(String(character.level || 1), 95, 20); 

  doc.setFontSize(14); doc.setFont(mainFont, "bold");
  doc.text(String(d.str || 10), 30, 92, { align: "center" }); doc.text(getMod(d.str), 19, 90, { align: "center" });      
  doc.text(String(d.dex || 10), 30, 139, { align: "center" }); doc.text(getMod(d.dex), 19, 135, { align: "center" });       
  doc.text(String(d.con || 10), 30, 191, { align: "center" }); doc.text(getMod(d.con), 19, 190, { align: "center" });       
  doc.text(String(d.int || 10), 64, 63, { align: "center" }); doc.text(getMod(d.int), 56, 63, { align: "center" });       
  doc.text(String(d.wis || 10), 64, 128, { align: "center" }); doc.text(getMod(d.wis), 56, 127, { align: "center" });       
  doc.text(String(d.cha || 10), 64, 192, { align: "center" }); doc.text(getMod(d.cha), 56, 192, { align: "center" });       

  doc.setFontSize(16); doc.setFont(mainFont, "bold");
  doc.text(derived.prof || '+2', 34, 52, { align: "center" }); 
  doc.text(String(derived.ac || 10), 118, 25, { align: "center" }); 
  
  doc.setFontSize(11); doc.setFont(mainFont, "bold");
  doc.text(String(derived.hp_max || 10), 150, 29, { align: "center" }); 
  doc.text(String(derived.hp || 10), 150, 20, { align: "center" }); 
  doc.text(derived.init || '+0', 92, 59, { align: "center" }); 
  doc.text(String(d.speed_m || '9') + 'm', 124, 59, { align: "center" }); 
  doc.text(String(derived.passive_perception || 10), 189, 59, { align: "center" }); 

  doc.text(`${d.hit_dice_spent || '0'} / ${derived.hit_dice_max || d.hit_dice_max || '1d8'}`, 169, 29); 

  let deathY = 19; 
  drawDiamond(doc, 185, deathY, 1.4, d.death_saves?.successes >= 1);
  drawDiamond(doc, 189, deathY, 1.4, d.death_saves?.successes >= 2);
  drawDiamond(doc, 193, deathY, 1.4, d.death_saves?.successes >= 3);
  drawDiamond(doc, 185, deathY, 1.4, d.death_saves?.failures >= 1);
  drawDiamond(doc, 189, deathY, 1.4, d.death_saves?.failures >= 2);
  drawDiamond(doc, 193, deathY, 1.4, d.death_saves?.failures >= 3);

  let armorY = 247;
  drawDiamond(doc, 25, armorY, 1.4, d.prof_armor_light); 
  drawDiamond(doc, 37.5, armorY, 1.4, d.prof_armor_medium); 
  drawDiamond(doc, 48.5, armorY, 1.4, d.prof_armor_heavy); 
  drawDiamond(doc, 62, armorY, 1.4, d.prof_armor_shields); 

  if (d.skills) {
    doc.setFontSize(12); doc.setFont(mainFont, "bold");
    
    const getBonus = (key) => d.skills[key] ? "+5" : "+2";
    
    doc.text(getBonus('athletics'), 115, 100);
    doc.text(getBonus('acrobatics'), 115, 105);
    doc.text(getBonus('stealth'), 115, 110);
    doc.text(getBonus('sleight_of_hand'), 115, 115);
    doc.text(getBonus('arcana'), 115, 120);
    doc.text(getBonus('history'), 115, 125);
    doc.text(getBonus('investigation'), 115, 130);
    doc.text(getBonus('nature'), 115, 135);
    doc.text(getBonus('religion'), 115, 140);
    doc.text(getBonus('animal_handling'), 115, 145);
    doc.text(getBonus('insight'), 115, 150);
    doc.text(getBonus('medicine'), 115, 155);
    doc.text(getBonus('perception'), 115, 160);
    doc.text(getBonus('survival'), 115, 165);
    doc.text(getBonus('intimidation'), 115, 170);
    doc.text(getBonus('persuasion'), 115, 175);
    doc.text(getBonus('performance'), 115, 180);
    doc.text(getBonus('deception'), 115, 185);
  }

  if (d.arsenal && d.arsenal.length > 0) {
    // On repasse en police normale pour les textes descriptifs
    doc.setFontSize(9); doc.setFont(mainFont, "normal");
    let startY = 83; 
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 20), 80, startY);
       doc.text(arme.stats?.atk || '+0', 125, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 145, startY, { align: "center" });
       startY += 7; 
    });
  }

  if (d.spell_slots) {
    doc.setFontSize(11); doc.setFont(mainFont, "bold");
    let slotY = 260;
    const xTotal = 175; 
    const xSpent = 185; 
    for (let niv = 1; niv <= 9; niv++) {
       const slot = d.spell_slots[niv];
       if (slot) {
         doc.text(String(slot.total || 0), xTotal, slotY, { align: "center" });
         doc.text(String(slot.spent || 0), xSpent, slotY, { align: "center" });
         slotY += 6; 
       }
    }
  }

  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.racial_traits) {
    const splitRacial = doc.splitTextToSize(d.racial_traits, 54); 
    doc.text(splitRacial, 80, 230); 
  }
  if (d.proficiencies) {
    const splitProfs = doc.splitTextToSize(d.proficiencies, 54);
    doc.text(splitProfs, 142, 230); 
  }
  if (d.features) {
    const splitFeatures = doc.splitTextToSize(d.features, 65);
    doc.text(splitFeatures, 135, 136); 
  }

  // ==============================================================================
  // 📄 PAGE 2 : MAGIE, BIO, INVENTAIRE
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(11); doc.setFont(mainFont, "bold");
  doc.text(character.alignment || "", 25, 20); 
  
  doc.text(d.spell_mod || "+0", 120, 25, { align: "center" }); 
  doc.text(d.spell_dc || "10", 150, 25, { align: "center" }); 
  doc.text(d.spell_atk || "+0", 180, 25, { align: "center" }); 

  if (d.languages) {
    doc.setFontSize(9); doc.setFont(mainFont, "normal");
    const splitLang = doc.splitTextToSize(d.languages, 50); 
    doc.text(splitLang, 25, 35);
  }

  const spellsObj = d.spells || {};
  let flatSpells = [];
  
  Object.keys(spellsObj).sort().forEach(level => {
    const list = spellsObj[level];
    if (Array.isArray(list)) {
       list.forEach(sp => {
         let lvlStr = level === '0' ? 'T' : String(level);
         if (typeof sp === 'string') {
           flatSpells.push({ level: lvlStr, name: sp, time: '', range: '', comp: '', notes: '' });
         } else {
           flatSpells.push({
             level: lvlStr,
             name: sp.name || '',
             time: sp.casting_time || sp.time || '',
             range: sp.range || '',
             comp: sp.components || sp.comp || '',
             notes: sp.duration || sp.notes || ''
           });
         }
       });
    }
  });

  if (flatSpells.length > 0) {
    doc.setFontSize(8); doc.setFont(mainFont, "normal");
    let spellY = 65; 
    
    flatSpells.slice(0, 27).forEach((spell) => {
      doc.text(spell.level || "", 25, spellY);
      doc.text((spell.name || "").substring(0, 30), 35, spellY);
      doc.text((spell.time || "").substring(0, 15), 80, spellY);
      doc.text((spell.range || "").substring(0, 15), 110, spellY);
      doc.text((spell.notes || "").substring(0, 25), 170, spellY);

      const comp = (spell.comp || "").toUpperCase();
      drawDiamond(doc, 140, spellY - 1, 1.2, comp.includes("V"));
      drawDiamond(doc, 145, spellY - 1, 1.2, comp.includes("S"));
      drawDiamond(doc, 150, spellY - 1, 1.2, comp.includes("M"));

      spellY += 5; 
    });
  }

  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.inventory && d.inventory.length > 0) {
    let invY = 165; 
    d.inventory.slice(0, 15).forEach((item) => {
       const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
       doc.text(`- ${item.name}${qty}`, 135, invY);
       invY += 5.5; 
    });
  }

  doc.setFontSize(11); doc.setFont(mainFont, "bold");
  doc.text(String(d.money_pc || 0), 125, 275, { align: "center" }); 
  doc.text(String(d.money_pa || 0), 140, 275, { align: "center" }); 
  doc.text(String(d.money_pe || 0), 155, 275, { align: "center" }); 
  doc.text(String(d.money_po || 0), 170, 275, { align: "center" }); 
  doc.text(String(d.money_pp || 0), 185, 275, { align: "center" }); 
  
};