import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Fonction utilitaire pour insérer et vérifier les erreurs
const insertAndCheck = async (table, data, label) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error(`❌ ÉCHEC création : ${label} (Table: ${table})`);
    console.error(`   Erreur : ${error.message}`);
    console.error(`   Détails : ${JSON.stringify(error, null, 2)}`);
    process.exit(1); 
  }

  console.log(`✅ ${label} créé(e) (ID: ${result.id})`);
  return result;
};

const seed = async () => {
  console.log('🌱 DÉMARRAGE DE LA GÉNÉRATION (VERTICAL SLICE)...');
  console.log('------------------------------------------------');

  // 0. NETTOYAGE (Ordre Cascade pour éviter les conflits de clés étrangères)
  console.log('🧹 Nettoyage de la base de données...');
  // Note: On assume que les politiques RLS sont ouvertes pour le dev
  await supabase.from('campaign_characters').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
  await supabase.from('characters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('potions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('recipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('crafting_materials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('plants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('locations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('cities').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('countries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('continents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('worlds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('guilds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  // 1. MONDE
  const world = await insertAndCheck('worlds', {
    name: 'Aethoria',
    description: 'Un monde fragmenté par des énergies arcaniques instables.',
    magic_level: 'High',
    technology_level: 'Medieval'
  }, 'Monde');

  // 2. GÉOGRAPHIE (La Hiérarchie)
  const continent = await insertAndCheck('continents', {
    name: 'Draconia',
    description: 'Le continent des anciens dragons, maintenant en ruines.',
    world_id: world.id
  }, 'Continent');

  const country = await insertAndCheck('countries', {
    name: 'Royaume d\'Eldoria',
    description: 'Le dernier bastion de la civilisation humaine.',
    government_type: 'Monarchie',
    world_id: world.id,
    continent_id: continent.id
  }, 'Pays');

  const location = await insertAndCheck('locations', {
    name: 'Bois des Murmures',
    description: 'Une forêt bioluminescente où l\'on entend des voix.',
    location_type: 'Forest',
    danger_level: 'Medium',
    world_id: world.id,
    country_id: country.id
  }, 'Lieu');

  // 3. FLORE & RESSOURCES (L'origine du craft)
  const plant = await insertAndCheck('plants', {
    name: 'Fougère Lunaire',
    description: 'Une plante qui brille sous la lumière de la lune.',
    habitat: 'Bois des Murmures', // Lien textuel contextuel
    rarity: 'Rare',
    type: 'Herb',
    world_id: world.id
  }, 'Plante');

  const material = await insertAndCheck('crafting_materials', {
    name: 'Essence de Lune',
    description: 'Un liquide argenté extrait de la Fougère Lunaire.',
    source: plant.name,
    rarity: 'Rare',
    world_id: world.id
  }, 'Matériau d\'artisanat');

  // 4. SOCIÉTÉ (Guildes & Savoir)
  const guild = await insertAndCheck('guilds', {
    name: 'Le Cercle des Alchimistes',
    description: 'Une organisation dédiée à la découverte de nouvelles potions.',
    guild_type: 'Science/Magic',
    headquarters: 'Eldoria Capital',
    world_id: world.id
  }, 'Guilde');

  // 5. ARTISANAT (La Recette et le Produit)
  const recipe = await insertAndCheck('recipes', {
    name: 'Recette: Vision Nocturne',
    description: 'Permet de voir dans le noir complet pendant 1 heure.',
    ingredients: `1x ${material.name}, 1x Eau Purifiée`,
    required_tools: 'Kit d\'Alchimiste',
    difficulty: 'Moyenne',
    type: 'Potion',
    world_id: world.id
  }, 'Recette');

  const potion = await insertAndCheck('potions', {
    name: 'Fiole de Vision Nocturne',
    description: 'Un liquide sombre qui tourbillonne.',
    effects: 'Vision dans le noir (60ft)',
    duration: '1 heure',
    rarity: 'Uncommon',
    recipe: recipe.name,
    world_id: world.id
  }, 'Potion');

  // 6. PERSONNAGE (Le bout de la chaîne)
  // On s'assure d'avoir une race et une classe
  const race = await insertAndCheck('races', {
    name: 'Elfe',
    world_id: world.id
  }, 'Race');
  
  const charClass = await insertAndCheck('character_classes', {
    name: 'Rôdeur',
    world_id: world.id
  }, 'Classe');

  // Note: On utilise 'ruleset_id' comme défini dans ton CONTEXT.md
  await insertAndCheck('characters', {
    name: 'Sylas Vane',
    level: 4,
    race_id: race.id,
    class_id: charClass.id,
    world_id: world.id,
    ruleset_id: 'dnd5',
    data: {
      alignment: 'Chaotic Good',
      background: 'Hermite',
      inventory: [
        { item_id: potion.id, name: potion.name, quantity: 2 }
      ]
    }
  }, 'Personnage (Sylas)');

  // 7. EXTRAS (Pour remplir les trous mentionnés)
  await insertAndCheck('diseases', {
    name: 'Fièvre Arcanique',
    description: 'Une maladie causée par une exposition trop forte à la magie brute.',
    type: 'Magical',
    world_id: world.id
  }, 'Maladie');

  await insertAndCheck('celestial_bodies', {
    name: 'Lumiera',
    body_type: 'Moon',
    description: 'La lune brisée qui orbite autour d\'Aethoria.',
    world_id: world.id
  }, 'Astre');

  console.log('------------------------------------------------');
  console.log('✨ SUCCÈS : Base de données initialisée avec une chaîne logique complète !');
  console.log('   Monde -> Pays -> Lieu -> Plante -> Recette -> Potion -> Inventaire Perso');
};

seed().catch(err => console.error('Erreur inattendue:', err));