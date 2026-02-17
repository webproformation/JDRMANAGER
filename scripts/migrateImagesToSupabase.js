import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES_WITH_IMAGES = [
  'animals', 'campaigns', 'celestial_bodies', 'character_classes',
  'characters', 'cities', 'continents', 'countries', 'crafting_materials',
  'deities', 'guilds', 'items', 'locations', 'magic_items', 'minerals',
  'monsters', 'oceans', 'plants', 'potions', 'races', 'recipes', 'sects',
  'villages', 'worlds'
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      client.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadImage(response.headers.location).then(resolve).catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function getFileExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  } catch {
    return 'jpg';
  }
}

function getContentType(extension) {
  const types = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  return types[extension] || 'image/jpeg';
}

async function uploadToSupabase(buffer, fileName, contentType) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, buffer, {
      contentType,
      upsert: true
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}

async function processTable(tableName) {
  console.log(`\n📋 Processing table: ${tableName}`);

  const { data: rows, error } = await supabase
    .from(tableName)
    .select('id, name, image_url')
    .not('image_url', 'is', null);

  if (error) {
    console.error(`❌ Error fetching ${tableName}:`, error.message);
    return { processed: 0, migrated: 0, errors: 0 };
  }

  let processed = 0;
  let migrated = 0;
  let errors = 0;

  for (const row of rows) {
    processed++;

    if (!row.image_url || row.image_url.includes(supabaseUrl)) {
      continue;
    }

    try {
      console.log(`  ⬇️  Downloading: ${row.name}`);
      const imageBuffer = await downloadImage(row.image_url);

      const extension = getFileExtension(row.image_url);
      const fileName = `${tableName}/${row.id}.${extension}`;
      const contentType = getContentType(extension);

      console.log(`  ⬆️  Uploading: ${fileName}`);
      const newUrl = await uploadToSupabase(imageBuffer, fileName, contentType);

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_url: newUrl })
        .eq('id', row.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`  ✅ Migrated: ${row.name}`);
      migrated++;

      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`  ❌ Error with ${row.name}:`, error.message);
      errors++;
    }
  }

  return { processed, migrated, errors };
}

async function migrateAllImages() {
  console.log('🚀 Starting image migration to Supabase Storage\n');

  const stats = {
    totalProcessed: 0,
    totalMigrated: 0,
    totalErrors: 0
  };

  for (const tableName of TABLES_WITH_IMAGES) {
    const result = await processTable(tableName);
    stats.totalProcessed += result.processed;
    stats.totalMigrated += result.migrated;
    stats.totalErrors += result.errors;
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   Total rows processed: ${stats.totalProcessed}`);
  console.log(`   Images migrated: ${stats.totalMigrated}`);
  console.log(`   Errors: ${stats.totalErrors}`);
  console.log('\n✨ Migration complete!');
}

migrateAllImages().catch(console.error);
