import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEncoding() {
  console.log('🔍 Test de l\'encodage des caractères...\n');

  const { data: calendars, error: calError } = await supabase
    .from('calendars')
    .select('name, description')
    .limit(1);

  if (calError) {
    console.error('Erreur calendars:', calError);
  } else {
    console.log('📅 Calendrier:');
    console.log('  Nom:', calendars[0]?.name);
    console.log('  Description:', calendars[0]?.description);
    console.log('');
  }

  const { data: deities, error: deitiesError } = await supabase
    .from('deities')
    .select('name, description')
    .limit(3);

  if (deitiesError) {
    console.error('Erreur deities:', deitiesError);
  } else {
    console.log('⛪ Divinités:');
    deities.forEach(d => {
      console.log(`  - ${d.name}: ${d.description?.substring(0, 100)}...`);
    });
    console.log('');
  }

  const { data: plants, error: plantsError } = await supabase
    .from('plants')
    .select('name, description')
    .limit(3);

  if (plantsError) {
    console.error('Erreur plants:', plantsError);
  } else {
    console.log('🌿 Plantes:');
    plants.forEach(p => {
      console.log(`  - ${p.name}: ${p.description?.substring(0, 100)}...`);
    });
  }

  console.log('\n✅ Test terminé!');
}

testEncoding().catch(console.error);
