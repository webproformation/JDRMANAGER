import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('🚀 Début de l\'application des migrations...\n');

  const migrationsDir = join(__dirname, '..', 'supabase', 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`📁 ${files.length} fichiers de migration trouvés\n`);

  for (const file of files) {
    console.log(`⏳ Application de ${file}...`);

    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf-8');

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

      if (error) {
        console.error(`❌ Erreur: ${error.message}`);
        // Continue quand même avec les autres migrations
      } else {
        console.log(`✅ ${file} appliqué avec succès`);
      }
    } catch (err) {
      console.error(`❌ Exception: ${err.message}`);
    }

    console.log('');
  }

  console.log('✨ Toutes les migrations ont été traitées');
}

applyMigrations();
