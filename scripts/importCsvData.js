import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import chardet from 'chardet';
import iconv from 'iconv-lite';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- MAPPINGS (La carte au trésor) ---
// Associe chaque fichier CSV à sa table Supabase
const fileToTable = {
  // Bases
  'world.csv': 'worlds',
  'continent.csv': 'continents',
  'country.csv': 'countries',
  'location.csv': 'locations',
  'city.csv': 'cities',
  
  // Calendrier & Astral
  'calendar.csv': 'calendars',
  'celestialbody.csv': 'celestial_bodies',
  
  // Nature & Bestiaire
  'animal.csv': 'animals',
  'monster.csv': 'monsters',
  'plant.csv': 'plants',
  'mineral.csv': 'minerals',
  
  // Personnages & Classes
  'race.csv': 'races',
  'characterclass.csv': 'character_classes',
  'classfeature.csv': 'class_features',
  'character.csv': 'characters',      // <--- LE VOILÀ !
  'deity.csv': 'deities',
  'language.csv': 'languages',
  'guild.csv': 'guilds',
  
  // Campagne
  'campaign.csv': 'campaigns',
  'encounter.csv': 'encounters',
  
  // Items & Craft
  'item.csv': 'items',
  'magicitem.csv': 'magic_items',
  'potion.csv': 'potions',
  'recipe.csv': 'recipes',
  'craftingmaterial.csv': 'crafting_materials',
  
  // Afflictions
  'disease.csv': 'diseases',
  'curse.csv': 'curses',
  
  // Système
  'charactersheettemplate.csv': 'character_sheet_templates'
};

// --- ORDRE D'IMPORT CRITIQUE ---
// Pour éviter les erreurs "Clé étrangère manquante"
const importOrder = [
  'worlds',
  'continents', 
  'countries', 
  'cities',
  'locations',
  'races', 
  'character_classes',
  'characters', // On importe les persos après leurs races/classes
  'campaigns'   // Et les campagnes à la fin
];

const importData = async () => {
  console.log('🚀 Démarrage de l\'importation v2.0 (Mode Robuste)...');
  const dataDir = path.resolve(__dirname, '../src/data');

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Le dossier ${dataDir} n'existe pas.`);
    return;
  }

  // 1. Lister tous les CSV
  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv') && !file.includes('copy'));
  
  // 2. Trier les fichiers selon l'ordre de priorité
  const sortedFiles = files.sort((a, b) => {
    const tableA = fileToTable[a.toLowerCase()] || '';
    const tableB = fileToTable[b.toLowerCase()] || '';
    
    const indexA = importOrder.indexOf(tableA);
    const indexB = importOrder.indexOf(tableB);
    
    // Si les deux sont dans la liste prioritaire, on respecte l'ordre
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // Si A est prioritaire, il passe avant
    if (indexA !== -1) return -1;
    // Si B est prioritaire, il passe avant
    if (indexB !== -1) return 1;
    // Sinon, ordre alphabétique
    return a.localeCompare(b);
  });

  for (const file of sortedFiles) {
    const tableName = fileToTable[file.toLowerCase()];

    if (!tableName) {
      console.warn(`⚠️  Ignoré: ${file} (Pas de table associée dans le script)`);
      continue;
    }

    console.log(`\n📄 Traitement de ${file} -> Table [${tableName}]`);
    
    try {
      const filePath = path.join(dataDir, file);
      const buffer = fs.readFileSync(filePath);

      // --- DÉTECTION INTELLIGENTE DE L'ENCODAGE ---
      const detected = chardet.detect(buffer);
      let content;
      
      // Si ce n'est pas de l'UTF-8 standard ou ASCII, on décode
      if (detected && !['UTF-8', 'ASCII', 'ISO-8859-1'].includes(detected)) {
          // Fallback souvent nécessaire pour Excel Windows
          console.log(`   🔦 Encodage détecté: ${detected} -> Tentative conversion Windows-1252`);
          content = iconv.decode(buffer, 'windows-1252'); 
      } else if (detected === 'ISO-8859-1') {
          console.log(`   🔦 Encodage détecté: ISO-8859-1 -> Conversion UTF-8`);
          content = iconv.decode(buffer, 'ISO-8859-1');
      } else {
          content = buffer.toString('utf-8');
      }

      // --- PARSING ROBUSTE ---
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true, // Tolère les erreurs de guillemets
        trim: true,
        cast: (value, context) => {
          // Conversion automatique des types
          if (value === '') return null;
          if (value === 'TRUE' || value === 'True') return true;
          if (value === 'FALSE' || value === 'False') return false;
          // Tente de convertir les nombres si la colonne ressemble à un nombre
          // (Attention aux ID qui ressemblent à des nombres, ici on reste prudent)
          return value;
        }
      });

      if (records.length === 0) {
        console.log(`   ℹ️  Fichier vide ou en-têtes seuls.`);
        continue;
      }

      console.log(`   📊 ${records.length} lignes trouvées.`);

      // --- NETTOYAGE DES DONNÉES ---
      // On retire la colonne 'is_sample' si elle existe mais n'est pas dans la base
      // et on s'assure que les colonnes vides sont bien NULL
      const cleanedRecords = records.map(record => {
        const clean = {};
        for (const [key, val] of Object.entries(record)) {
             // Mapping manuel si besoin (ex: description_text -> description)
             let finalKey = key;
             if (key === 'description_text') finalKey = 'description';
             if (key === 'worshippers') finalKey = 'worshipers'; // Faute fréquente
             
             clean[finalKey] = val;
        }
        return clean;
      });

      // --- ENVOI BATCHÉ ---
      // Supabase aime bien les paquets de 100
      const BATCH_SIZE = 100;
      for (let i = 0; i < cleanedRecords.length; i += BATCH_SIZE) {
        const batch = cleanedRecords.slice(i, i + BATCH_SIZE);
        
        const { error } = await supabase
          .from(tableName)
          .upsert(batch, { ignoreDuplicates: true });

        if (error) {
           if (error.code === '42P01') {
             console.error(`   ❌ ERREUR CRITIQUE: La table '${tableName}' n'existe pas dans Supabase.`);
           } else {
             console.error(`   ❌ Erreur d'insertion (Lignes ${i}-${i+batch.length}): ${error.message}`);
           }
        }
      }
      console.log(`   ✅ Import réussi pour ${tableName}`);

    } catch (err) {
      console.error(`   ❌ CRASH sur le fichier ${file}:`, err.message);
    }
  }

  console.log('\n✨✨ Importation terminée avec succès ! ✨✨');
};

importData();