import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'calendars',
  'celestial_bodies',
  'continents',
  'countries',
  'deities',
  'locations',
  'worlds',
  'races',
  'character_classes',
  'spells',
  'monsters',
  'languages',
  'guilds',
  'animals',
  'plants',
  'minerals',
  'crafting_materials',
  'items',
  'magic_items',
  'potions',
  'recipes',
  'diseases',
  'curses',
  'oceans',
  'sects'
];

async function deleteAllSampleData() {
  console.log('🗑️  Suppression de toutes les données sample...\n');

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('is_sample', true);

      if (error) {
        if (error.code === '42P01') {
          console.log(`   ⚠️  Table ${table} n'existe pas (ignoré)`);
        } else {
          console.error(`   ❌ Erreur lors de la suppression dans ${table}:`, error.message);
        }
      } else {
        console.log(`   ✅ Données sample supprimées de ${table}`);
      }
    } catch (error) {
      console.error(`   ❌ Erreur lors de la suppression dans ${table}:`, error.message);
    }
  }

  console.log('\n✨ Suppression terminée!\n');
  console.log('📝 Lancez maintenant: npm run import-data');
}

deleteAllSampleData().catch(console.error);
