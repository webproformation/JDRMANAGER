import { calculateCombatStats } from '../rulesEngine';
import { supabase } from '../../lib/supabase'; 

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
  const [imgPage1, imgPage2, isFont1Loaded, isFont2Loaded] = await Promise.all([
    loadImageSafe('/templates/dnd5_page1.jpg'),
    loadImageSafe('/templates/dnd5_page2.jpg'),
    loadCustomFont(doc, '/custom_font.ttf', 'MaPolicePerso', 'normal'),
    loadCustomFont(doc, '/custom_font2.ttf', 'MaPolicePerso2', 'normal')
  ]);
  
  const mainFont = isFont1Loaded ? 'MaPolicePerso' : 'helvetica';

  const d = character.data || {};
  let derived = {};
  if (typeof character.level === 'number' && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
      derived = calculateCombatStats(character.ruleset_id || 'dnd5', d, character.level);
  } else {
      derived = d; 
  }
  
  let classNameStr = character.class_name || '';
  let subclassStr = character.subclass_name || '';
  let raceNameStr = character.race_id || ''; 

  if (character.class_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: cData } = await supabase.from('character_classes').select('name').eq('id', character.class_id).single();
    if (cData) classNameStr = cData.name;
  }
  if (character.subclass_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: sData } = await supabase.from('subclasses').select('name').eq('id', character.subclass_id).single();
    if (sData) subclassStr = sData.name;
  }
  
  if (character.race_id && character.name !== "Kaelen 'SmokeTest' Le Magnifique") {
    const { data: rData } = await supabase.from('races').select('name').eq('id', character.race_id).single();
    if (rData) raceNameStr = rData.name;
  }
  
  const getMod = (score) => {
    const m = Math.floor(((parseInt(score) || 10) - 10) / 2);
    return m >= 0 ? `+${m}` : `${m}`;
  };

  const level = character.level || 1;
  const baseProf = Math.floor((level - 1) / 4) + 2;
  const profBonus = baseProf + (d.prof_override || 0);

  const baseAc = derived.ac || 10;
  const displayAc = baseAc + (d.ac_override || 0);

  const baseInit = parseInt(String(derived.init || 0).replace('+', ''));
  const displayInit = baseInit + (d.init_override || 0);
  const formattedInit = displayInit >= 0 ? `+${displayInit}` : `${displayInit}`;

  const wisMod = Math.floor(((d.wis || 10) - 10) / 2);
  const passivePerception = 10 + wisMod + (d.skills?.perception ? profBonus : 0);

  doc.setFont(mainFont, "normal");
  doc.setTextColor(30, 30, 30); 

  // ==================== PAGE 1 ====================
  if (imgPage1) doc.addImage(imgPage1, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  doc.text(character.name || '', 14, 13); 
  doc.text(classNameStr, 53, 22); 
  doc.text(subclassStr, 53, 30); 
  doc.text(raceNameStr, 12, 30); 
  
  doc.text(d.size_cat === 'small' ? 'P' : (d.size_cat === 'large' ? 'G' : 'M'), 153, 59); 
  
  doc.setFontSize(18); doc.setFont(mainFont, "normal");
  doc.text(String(character.level || 1), 95, 20); 

  doc.setFontSize(14); doc.setFont(mainFont, "normal");
  doc.text(String(d.str || 10), 28.5, 90.5, { align: "center" }); doc.text(getMod(d.str), 18, 89, { align: "center" });      
  doc.text(String(d.dex || 10), 28.5, 135.5, { align: "center" }); doc.text(getMod(d.dex), 18, 133.5, { align: "center" });       
  doc.text(String(d.con || 10), 28.5, 190, { align: "center" }); doc.text(getMod(d.con), 18, 188, { align: "center" });       
  doc.text(String(d.int || 10), 64, 62, { align: "center" }); doc.text(getMod(d.int), 53, 59, { align: "center" });       
  doc.text(String(d.wis || 10), 64, 127, { align: "center" }); doc.text(getMod(d.wis), 53, 125, { align: "center" });       
  doc.text(String(d.cha || 10), 64, 192, { align: "center" }); doc.text(getMod(d.cha), 53, 190, { align: "center" });       

  doc.setFontSize(18); doc.setFont(mainFont, "normal");
  doc.text(String(displayAc), 117, 23, { align: "center" }); 
  
  doc.setFontSize(16); doc.setFont(mainFont, "normal");
  doc.text(profBonus >= 0 ? `+${profBonus}` : `${profBonus}`, 24, 63, { align: "center" }); 
  
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  doc.text(String(d.hp_max !== undefined ? d.hp_max : (derived.hp_max || 10)), 153, 29, { align: "center" }); 
  doc.text(d.temp_hp > 0 ? String(d.temp_hp) : "", 153, 21, { align: "center" }); 

  doc.setFontSize(16); doc.setFont(mainFont, "normal");
  doc.text(String(d.hp !== undefined ? d.hp : (d.hp_max !== undefined ? d.hp_max : (derived.hp_max || 10))), 134, 29, { align: "center" }); 

  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  doc.text(formattedInit, 92, 59, { align: "center" }); 
  doc.text(String(d.speed_m || '9') + 'm', 123, 59, { align: "center" }); 
  doc.text(String(passivePerception), 187, 59, { align: "center" }); 
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  doc.text(`${d.hit_dice_spent || '0'} / ${derived.hit_dice_max || d.hit_dice_max || '1d8'}`, 169, 29); 

  let deathY1 = 20; 
  drawDiamond(doc, 187, deathY1, 1.4, d.death_saves?.successes >= 1);
  drawDiamond(doc, 191, deathY1, 1.4, d.death_saves?.successes >= 2);
  drawDiamond(doc, 194.5, deathY1, 1.4, d.death_saves?.successes >= 3);
  let deathY2 = 28;
  drawDiamond(doc, 187, deathY2, 1.4, d.death_saves?.failures >= 1);
  drawDiamond(doc, 191, deathY2, 1.4, d.death_saves?.failures >= 2);
  drawDiamond(doc, 194.5, deathY2, 1.4, d.death_saves?.failures >= 3);

  let armorY = 247;
  drawDiamond(doc, 25, armorY, 1.4, d.prof_armor_light); 
  drawDiamond(doc, 37.5, armorY, 1.4, d.prof_armor_medium); 
  drawDiamond(doc, 48.5, armorY, 1.4, d.prof_armor_heavy); 
  drawDiamond(doc, 62, armorY, 1.4, d.prof_armor_shields); 

  if (d.skills) {
    doc.setFontSize(12); doc.setFont(mainFont, "normal");
    const skillAttr = { athletics: 'str', acrobatics: 'dex', sleight_of_hand: 'dex', stealth: 'dex', arcana: 'int', history: 'int', investigation: 'int', nature: 'int', religion: 'int', animal_handling: 'wis', insight: 'wis', medicine: 'wis', perception: 'wis', survival: 'wis', deception: 'cha', intimidation: 'cha', performance: 'cha', persuasion: 'cha' };
    
    const getSkillBonus = (key) => {
        const isProf = d.skills[key];
        const attrMod = Math.floor(((d[skillAttr[key]] || 10) - 10) / 2);
        const total = attrMod + (isProf ? profBonus : 0);
        return total >= 0 ? `+${total}` : `${total}`;
    };
    
    doc.text(getSkillBonus('athletics'), 14, 111.2);
    doc.text(getSkillBonus('acrobatics'), 14, 155.3);
    doc.text(getSkillBonus('stealth'), 14, 160.4);
    doc.text(getSkillBonus('sleight_of_hand'), 14, 165.9);
    doc.text(getSkillBonus('arcana'), 49, 82);
    doc.text(getSkillBonus('history'), 49, 87.2);
    doc.text(getSkillBonus('investigation'), 49, 92.4);
    doc.text(getSkillBonus('nature'), 49, 97.7);
    doc.text(getSkillBonus('religion'), 49, 103.3);
    doc.text(getSkillBonus('animal_handling'), 49, 147);
    doc.text(getSkillBonus('insight'), 49, 152.3);
    doc.text(getSkillBonus('medicine'), 49, 157.3);
    doc.text(getSkillBonus('perception'), 49, 162.8);
    doc.text(getSkillBonus('survival'), 49, 168.2);
    doc.text(getSkillBonus('intimidation'), 49, 212.5);
    doc.text(getSkillBonus('persuasion'), 49, 217.5);
    doc.text(getSkillBonus('performance'), 49, 222.7);
    doc.text(getSkillBonus('deception'), 49, 228.2);
  }

  if (d.arsenal && d.arsenal.length > 0) {
    doc.setFontSize(9); doc.setFont(mainFont, "normal");
    let startY = 82; 
    d.arsenal.slice(0, 4).forEach((arme) => {
       doc.text(arme.name.substring(0, 40), 80, startY);
       doc.text(arme.stats?.atk || '+0', 123, startY, { align: "center" });
       doc.text(arme.stats?.dmg || '1d4', 145, startY, { align: "center" });
       startY += 7.5; 
    });
  }

  // ==================== BLOC: CAPACITÉS DE CLASSE (2 COLONNES) ====================
  if (d.dynamic_features?.class_features && d.dynamic_features.class_features.length > 0) {
    const colWidth = 56; // Largeur de chaque colonne (5.6 cm)
    const spacing = 5; // Espacement de 5mm
    let currentX = 81; // Début Colonne 1
    const startY = 140; // Hauteur de départ
    const maxY = startY + 74; // Hauteur maximale autorisée (7.4 cm)
    let currentY = startY;

    d.dynamic_features.class_features.forEach((feat) => {
      // 1. Simulation de la hauteur nécessaire pour ce bloc
      doc.setFontSize(9);
      doc.setFont(mainFont, "normal");
      const nameLines = doc.splitTextToSize(String(feat.name || ""), colWidth);
      const nameHeight = nameLines.length * 3.5;

      let descLines = [];
      let descHeight = 0;
      if (feat.desc) {
        doc.setFontSize(7.5);
        const secondFont = isFont2Loaded ? 'MaPolicePerso2' : 'helvetica';
        doc.setFont(secondFont, "normal");
        descLines = doc.splitTextToSize(String(feat.desc), colWidth);
        descHeight = descLines.length * 3.2;
      }

      const totalHeight = nameHeight + descHeight + 2.5; // Titre + Desc + Marge

      // 2. Gestion intelligente des colonnes
      if (currentY + totalHeight > maxY) {
        if (currentX === 80) {
          // On n'a plus de place dans la colonne 1, on passe à la colonne 2 !
          currentX = 80 + colWidth + spacing; // Soit 141
          currentY = startY;
        } else {
          // Les deux colonnes sont pleines, on arrête pour ne pas écrire sur les Traits Raciaux
          return;
        }
      }

      // 3. Impression réelle du Titre
      doc.setFontSize(9);
      doc.setFont(mainFont, "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(nameLines, currentX, currentY);
      currentY += nameHeight;

      // 4. Impression réelle de la Description (plus petit, 2ème police, gris)
      if (feat.desc) {
        doc.setFontSize(7.5);
        const secondFont = isFont2Loaded ? 'MaPolicePerso2' : 'helvetica';
        doc.setFont(secondFont, "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(descLines, currentX, currentY);
        currentY += descHeight;
        doc.setTextColor(30, 30, 30); // Réinitialisation de la couleur
      }

      currentY += 2.5; // Petite marge avant la prochaine capacité
    });
  } else if (d.features) {
    // Rétrocompatibilité si jamais c'est juste un vieux bloc texte brut (sur la largeur totale de 117mm)
    doc.setFontSize(9);
    doc.setFont(mainFont, "normal");
    const splitFeatures = doc.splitTextToSize(String(d.features), 117);
    doc.text(splitFeatures, 80, 140);
  }
  // ===========================================================================

  doc.setFontSize(10); doc.setFont(mainFont, "normal");
  if (d.racial_traits) {
    const splitRacial = doc.splitTextToSize(d.racial_traits, 54); 
    doc.text(splitRacial, 80, 230); 
  }
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.proficiencies) {
    const splitProfs = doc.splitTextToSize(d.proficiencies, 54);
    doc.text(splitProfs, 10, 258); 
  }
  if (d.feats) {
    let featsText = Array.isArray(d.feats) ? d.feats.map(f => f.name).join(', ') : d.feats;
    const splitFeats = doc.splitTextToSize(featsText, 56); 
    doc.text(splitFeats, 143, 230); 
  }
  doc.setFontSize(9); doc.setFont(mainFont, "normal");
  if (d.tool_proficiencies) {
    const splitTools = doc.splitTextToSize(d.tool_proficiencies, 54);
    doc.text(splitTools, 10, 282); 
  }


  // ==================== PAGE 2 ====================
  doc.addPage();
  if (imgPage2) doc.addImage(imgPage2, 'JPEG', 0, 0, 210, 297);
  
  doc.setFontSize(8); doc.setFont(mainFont, "normal");
  if (character.description) {
    const splitDesc = doc.splitTextToSize(character.description, 56);
    doc.text(splitDesc, 143, 19); 
  }

  // --- NOUVEAU BLOC TAILLE & POIDS ---
  const heightStr = d.height ? (d.height / 100).toFixed(2) + " m" : "—";
  const weightStr = d.weight ? d.weight + " kg" : "—";

  doc.setFontSize(9); 
  doc.setFont(mainFont, "normal");
  doc.text("Taille :", 143, 42); 
  doc.text(heightStr, 155, 42);
  
  doc.setFont(mainFont, "normal");
  doc.text("Poids :", 175, 42); 
  doc.text(weightStr, 187, 42);
  // ------------------------------------

  doc.setFontSize(8); doc.setFont(mainFont, "normal");
  if (character.backstory) {
    const splitStory = doc.splitTextToSize(character.backstory, 56);
    doc.text(splitStory, 143, 60); 
  }
  
  // PUISSANCE ARCANIQUE
  doc.setFontSize(11); doc.setFont(mainFont, "normal");
  doc.text(character.alignment || "", 143, 117); 
  
  doc.text(String(d.spell_mod || "+0"), 15, 27, { align: "center" }); 
  doc.text(String(d.spell_dc || "10"), 15, 37, { align: "center" }); 
  doc.text(String(d.spell_atk || "+0"), 15, 47, { align: "center" }); 

  if (d.spell_slots) {
    doc.setFontSize(11);
    const getSlot = (level) => String(d.spell_slots[level]?.total || 0);

    doc.text(getSlot(1), 67, 38, { align: "center" });
    doc.text(getSlot(2), 67, 43.5, { align: "center" });
    doc.text(getSlot(3), 67, 49, { align: "center" });
    doc.text(getSlot(4), 96, 38, { align: "center" });
    doc.text(getSlot(5), 96, 43.5, { align: "center" });
    doc.text(getSlot(6), 96, 49, { align: "center" });
    doc.text(getSlot(7), 122, 38, { align: "center" });
    doc.text(getSlot(8), 122, 43.5, { align: "center" });
    doc.text(getSlot(9), 122, 49, { align: "center" });
  }

  if (d.languages) {
    doc.setFontSize(11); doc.setFont(mainFont, "normal");
    const splitLang = doc.splitTextToSize(d.languages, 50); 
    doc.text(splitLang, 143, 140);
  }

  // LECTURE DU GRIMOIRE AVANCÉ
  const spellsData = d.spells || {};
  const spellsObj = spellsData.prepared ? spellsData.prepared : spellsData;
  let flatSpells = [];
  
  Object.keys(spellsObj).filter(k => k !== 'library' && k !== 'spellbook' && k !== 'prepared').sort().forEach(level => {
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
    let spellY = 75; 
    
    flatSpells.slice(0, 35).forEach((spell) => {
      doc.text(String(spell.level || ""), 14, spellY);
      doc.text(String(spell.name || "").substring(0, 40), 20, spellY);
      doc.text(String(spell.time || "").substring(0, 15), 56, spellY);
      doc.text(String(spell.range || "").substring(0, 15), 68, spellY);
      doc.text(String(spell.notes || "").substring(0, 25), 107, spellY);

      const comp = String(spell.comp || "").toUpperCase();
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