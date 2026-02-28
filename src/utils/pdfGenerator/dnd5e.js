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
  const [imgPage1, imgPage2, isFontLoaded] = await Promise.all([
    loadImageSafe('/sheet_page1.jpg'),
    loadImageSafe('/sheet_page2.jpg'),
    loadCustomFont(doc, '/custom_font.ttf', 'MaPolicePerso', 'normal')
  ]);
  
  const mainFont = isFontLoaded ? 'MaPolicePerso' : 'helvetica';

  const d = character.data || {};
  let derived = {};
  if (typeof character.level === 'number' && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
      derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
  } else {
      derived = d; 
  }
  
  let classNameStr = character.class_name || '';
  let subclassStr = character.subclass_name || '';
  let raceNameStr = character.race_id || ''; // Ajout pour la race

  if (character.class_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: cData } = await supabase.from('character_classes').select('name').eq('id', character.class_id).single();
    if (cData) classNameStr = cData.name;
  }
  if (character.subclass_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: sData } = await supabase.from('subclasses').select('name').eq('id', character.subclass_id).single();
    if (sData) subclassStr = sData.name;
  }
  
  // LE CORRECTIF EST ICI : On va chercher le vrai nom de la race !
  if (character.race_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: rData } = await supabase.from('races').select('name').eq('id', character.race_id).single();
    if (rData) raceNameStr = rData.name;
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
  
  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  doc.text(character.name || '', 14, 13); 
  doc.text(classNameStr, 53, 22); 
  doc.text(subclassStr, 53, 30); 
  
  // Utilisation de raceNameStr au lieu de character.race_id
  doc.text(raceNameStr, 12, 30); 
  
  doc.text(d.size_cat === 'small' ? 'P' : (d.size_cat === 'large' ? 'G' : 'M'), 153, 59); 
  
  doc.setFontSize(18); doc.setFont(mainFont, "normal");
  doc.text(String(character.level || 1), 95, 20); 

  doc.setFontSize(14); doc.setFont(mainFont, "normal");
  doc.text(String(d.str || 10), 28.5, 90.5, { align: "center" }); doc.text(getMod(d.str), 18, 89, { align: "center" });      
  doc.text(String(d.dex || 10), 28.5, 135.5, { align: "center" }); doc.text(getMod(d.dex), 18, 133.5, { align: "center" });       
  doc.text(String(d.con || 10), 28.5, 190, { align: "center" }); doc.text(getMod(d.con), 18, 189, { align: "center" });       
  doc.text(String(d.int || 10), 64, 62, { align: "center" }); doc.text(getMod(d.int), 53, 60, { align: "center" });       
  doc.text(String(d.wis || 10), 64, 127, { align: "center" }); doc.text(getMod(d.wis), 53, 125, { align: "center" });       
  doc.text(String(d.cha || 10), 64, 192, { align: "center" }); doc.text(getMod(d.cha), 53, 190, { align: "center" });       

  doc.setFontSize(18); doc.setFont(mainFont, "normal");
  doc.text(String(derived.ac || 10), 117, 23, { align: "center" }); 
  
  doc.setFontSize(16); doc.setFont(mainFont, "normal");
  doc.text(derived.prof || '+2', 24, 63, { align: "center" }); 
  
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  doc.text(String(derived.hp_max || 10), 152, 29, { align: "center" }); 
  doc.text(String(derived.hp || 10), 152, 21, { align: "center" }); 

  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  doc.text(derived.init || '+0', 92, 59, { align: "center" }); 
  doc.text(String(d.speed_m || '9') + 'm', 123, 59, { align: "center" }); 
  doc.text(String(derived.passive_perception || 10), 187, 59, { align: "center" }); 

  doc.text(`${d.hit_dice_spent || '0'} / ${derived.hit_dice_max || d.hit_dice_max || '1d8'}`, 169, 29); 

  let deathY1 = 20; 
  drawDiamond(doc, 187.8, deathY1, 1.4, d.death_saves?.successes >= 1);
  drawDiamond(doc, 191.2, deathY1, 1.4, d.death_saves?.successes >= 2);
  drawDiamond(doc, 194.5, deathY1, 1.4, d.death_saves?.successes >= 3);
  let deathY2 = 28;
  drawDiamond(doc, 187.8, deathY2, 1.4, d.death_saves?.failures >= 1);
  drawDiamond(doc, 191.2, deathY2, 1.4, d.death_saves?.failures >= 2);
  drawDiamond(doc, 194.5, deathY2, 1.4, d.death_saves?.failures >= 3);

  let armorY = 247;
  drawDiamond(doc, 25, armorY, 1.4, d.prof_armor_light); 
  drawDiamond(doc, 37.5, armorY, 1.4, d.prof_armor_medium); 
  drawDiamond(doc, 48.5, armorY, 1.4, d.prof_armor_heavy); 
  drawDiamond(doc, 62, armorY, 1.4, d.prof_armor_shields); 

  if (d.skills) {
    doc.setFontSize(12); doc.setFont(mainFont, "normal");
    
    const getBonus = (key) => d.skills[key] ? "+5" : "+2";
    
    doc.text(getBonus('athletics'), 14, 111.2);
    doc.text(getBonus('acrobatics'), 14, 155.3);
    doc.text(getBonus('stealth'), 14, 160.4);
    doc.text(getBonus('sleight_of_hand'), 14, 165.9);
    doc.text(getBonus('arcana'), 49, 82);
    doc.text(getBonus('history'), 49, 87.2);
    doc.text(getBonus('investigation'), 49, 92.4);
    doc.text(getBonus('nature'), 49, 97.7);
    doc.text(getBonus('religion'), 49, 103.3);
    doc.text(getBonus('animal_handling'), 49, 147);
    doc.text(getBonus('insight'), 49, 152.3);
    doc.text(getBonus('medicine'), 49, 157.3);
    doc.text(getBonus('perception'), 49, 162.8);
    doc.text(getBonus('survival'), 49, 168.2);
    doc.text(getBonus('intimidation'), 49, 212.5);
    doc.text(getBonus('persuasion'), 49, 217.5);
    doc.text(getBonus('performance'), 49, 222.7);
    doc.text(getBonus('deception'), 49, 227.8);
  }

  if (d.arsenal && d.arsenal.length > 0) {
    doc.setFontSize(9); doc.setFont(mainFont, "normal");
    let startY = 82; 
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 20), 80, startY);
       doc.text(arme.stats?.atk || '+0', 123, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 145, startY, { align: "center" });
       startY += 7.5; 
    });
  }

  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  if (d.racial_traits) {
    const splitRacial = doc.splitTextToSize(d.racial_traits, 54); 
    doc.text(splitRacial, 80, 230); 
  }
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.proficiencies) { // ARMES
    const splitProfs = doc.splitTextToSize(d.proficiencies, 54);
    doc.text(splitProfs, 10, 258); 
  }
  // Dons (Feats)
  if (d.feats) {
    const splitFeats = doc.splitTextToSize(d.feats, 56); 
    doc.text(splitFeats, 143, 230); // À AJUSTER (X, Y)
  }
  // --- NOUVEAU : OUTILS ---
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.tool_proficiencies) { // OUTILS
    const splitTools = doc.splitTextToSize(d.tool_proficiencies, 54);
    doc.text(splitTools, 10, 282); // À AJUSTER (X, Y)
  }

  if (d.features) {
    const splitFeatures = doc.splitTextToSize(d.features, 65);
    doc.text(splitFeatures, 80, 140); 
  }

  // ==============================================================================
  // 📄 PAGE 2 : MAGIE, BIO (Apparence/Histoire/Dons), INVENTAIRE
  // ==============================================================================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  // --- NOUVEAUX BLOCS (PAGE 2) : APPARENCE, HISTOIRE, DONS ---
  doc.setFontSize(8); doc.setFont(mainFont, "normal");
  
  // Apparence
  if (character.description) {
    const splitDesc = doc.splitTextToSize(character.description, 56);
    doc.text(splitDesc, 143, 19); // À AJUSTER (X, Y)
  }
  
  // Histoire et Personnalité
  if (character.backstory) {
    const splitStory = doc.splitTextToSize(character.backstory, 56);
    doc.text(splitStory, 143, 60); // À AJUSTER (X, Y)
  }

  
  // --- MAGIE & ALIGNEMENT ---
  doc.setFontSize(11); doc.setFont(mainFont, "normal");
  doc.text(character.alignment || "", 143, 118); 
  
  doc.text(d.spell_mod || "+0", 15, 27, { align: "center" }); 
  doc.text(d.spell_dc || "10", 15, 38, { align: "center" }); 
  doc.text(d.spell_atk || "+0", 15, 49, { align: "center" }); 

  if (d.spell_slots) {
    doc.setFontSize(11);
    const getSlot = (level, type) => String(d.spell_slots[level]?.[type] || 0);

    doc.text(getSlot(1, 'total'), 67, 38, { align: "center" });
    doc.text(getSlot(2, 'total'), 67, 43.5, { align: "center" });
    doc.text(getSlot(3, 'total'), 67, 49, { align: "center" });
    doc.text(getSlot(4, 'total'), 96, 38, { align: "center" });
    doc.text(getSlot(5, 'total'), 96, 43.5, { align: "center" });
    doc.text(getSlot(6, 'total'), 96, 49, { align: "center" });
    doc.text(getSlot(7, 'total'), 122, 38, { align: "center" });
    doc.text(getSlot(8, 'total'), 122, 43.5, { align: "center" });
    doc.text(getSlot(9, 'total'), 122, 49, { align: "center" });
  }

  if (d.languages) {
    doc.setFontSize(11); doc.setFont(mainFont, "normal");
    const splitLang = doc.splitTextToSize(d.languages, 50); 
    doc.text(splitLang, 143, 140);
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
    doc.setFontSize(9); doc.setFont(mainFont, "normal");
    let spellY = 75; 
    
    flatSpells.slice(0, 35).forEach((spell) => {
      doc.text(spell.level || "", 14, spellY);
      doc.text((spell.name || "").substring(0, 30), 20, spellY);
      doc.text((spell.time || "").substring(0, 15), 56, spellY);
      doc.text((spell.range || "").substring(0, 15), 68, spellY);
      doc.text((spell.notes || "").substring(0, 25), 105, spellY);

      const comp = (spell.comp || "").toUpperCase();
      drawDiamond(doc, 85, spellY - 0, 1.2, comp.includes("V"));
      drawDiamond(doc, 93, spellY - 0, 1.2, comp.includes("S"));
      drawDiamond(doc, 100, spellY - 0, 1.2, comp.includes("M"));

      spellY += 7.3; 
    });
  }

  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  if (d.inventory && d.inventory.length > 0) {
    let invY = 165; 
    d.inventory.slice(0, 15).forEach((item) => {
       const qty = item.quantity > 1 ? ` (x${item.quantity})` : '';
       doc.text(`- ${item.name}${qty}`, 143, invY);
       invY += 5.7; 
    });
  }

  doc.setFontSize(11); doc.setFont(mainFont, "normal");
  doc.text(String(d.money_pc || 0), 147, 273, { align: "center" }); 
  doc.text(String(d.money_pa || 0), 159, 273, { align: "center" }); 
  doc.text(String(d.money_pe || 0), 171, 273, { align: "center" }); 
  doc.text(String(d.money_po || 0), 183, 273, { align: "center" }); 
  doc.text(String(d.money_pp || 0), 195, 273, { align: "center" }); 
  
};