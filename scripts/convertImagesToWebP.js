import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MAX_WIDTH = 1400;

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

async function processImage(buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let processedImage = image;

  if (metadata.width > MAX_WIDTH) {
    const newHeight = Math.round((MAX_WIDTH / metadata.width) * metadata.height);
    processedImage = processedImage.resize(MAX_WIDTH, newHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  return await processedImage
    .webp({ quality: 85 })
    .toBuffer();
}

async function uploadToSupabase(buffer, fileName) {
  const webpFileName = fileName.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');

  const { data, error } = await supabase.storage
    .from('images')
    .upload(webpFileName, buffer, {
      contentType: 'image/webp',
      upsert: true
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from('images')
    .getPublicUrl(webpFileName);

  return publicData.publicUrl;
}

async function convertTableImages(tableName) {
  console.log(`\n📋 Converting images in: ${tableName}`);

  const { data: rows, error } = await supabase
    .from(tableName)
    .select('id, name, image_url')
    .not('image_url', 'is', null);

  if (error) {
    console.error(`❌ Error fetching ${tableName}:`, error.message);
    return { processed: 0, converted: 0, errors: 0 };
  }

  let processed = 0;
  let converted = 0;
  let errors = 0;

  for (const row of rows) {
    processed++;

    if (!row.image_url) continue;

    const isAlreadyWebP = row.image_url.endsWith('.webp');

    if (isAlreadyWebP) {
      console.log(`  ⏭️  Already WebP: ${row.name}`);
      continue;
    }

    try {
      console.log(`  ⬇️  Downloading: ${row.name}`);
      const imageBuffer = await downloadImage(row.image_url);

      console.log(`  🔄 Converting to WebP: ${row.name}`);
      const webpBuffer = await processImage(imageBuffer);

      const currentFileName = row.image_url.split('/').pop();
      const fileName = `${tableName}/${row.id}.webp`;

      console.log(`  ⬆️  Uploading: ${fileName}`);
      const newUrl = await uploadToSupabase(webpBuffer, fileName);

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ image_url: newUrl })
        .eq('id', row.id);

      if (updateError) {
        throw updateError;
      }

      console.log(`  ✅ Converted: ${row.name}`);
      converted++;

      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`  ❌ Error with ${row.name}:`, error.message);
      errors++;
    }
  }

  return { processed, converted, errors };
}

async function convertAllImages() {
  console.log('🚀 Starting image conversion to WebP\n');

  const tables = [
    'animals', 'campaigns', 'celestial_bodies', 'character_classes',
    'characters', 'cities', 'continents', 'countries', 'crafting_materials',
    'deities', 'guilds', 'items', 'locations', 'magic_items', 'minerals',
    'monsters', 'oceans', 'plants', 'potions', 'races', 'recipes', 'sects',
    'villages', 'worlds'
  ];

  const stats = {
    totalProcessed: 0,
    totalConverted: 0,
    totalErrors: 0
  };

  for (const tableName of tables) {
    const result = await convertTableImages(tableName);
    stats.totalProcessed += result.processed;
    stats.totalConverted += result.converted;
    stats.totalErrors += result.errors;
  }

  console.log('\n📊 Conversion Summary:');
  console.log(`   Total images processed: ${stats.totalProcessed}`);
  console.log(`   Images converted to WebP: ${stats.totalConverted}`);
  console.log(`   Errors: ${stats.totalErrors}`);
  console.log('\n✨ Conversion complete!');
}

convertAllImages().catch(console.error);
