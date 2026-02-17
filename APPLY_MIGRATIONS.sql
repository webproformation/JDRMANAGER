-- ============================================================
-- APPLICATION DE TOUTES LES MIGRATIONS
-- Copiez ce fichier entier et collez-le dans le SQL Editor
-- https://supabase.com/dashboard/project/mifghuypxbtmkabjvwrm/sql/new
-- ============================================================

-- ============================================================
-- Migration: 20251217145932_create_core_tables.sql
-- ============================================================

/*
  # Création des tables principales pour l'application de gestion de campagnes JDR

  1. Nouvelles Tables
    - `worlds` - Mondes/univers de jeu
    - `continents` - Continents dans les mondes
    - `countries` - Pays/nations
    - `cities` - Grandes cités
    - `villages` - Villages et petites communautés
    - `locations` - Autres lieux (donjons, ruines, etc.)
    - `deities` - Dieux et panthéons
    - `calendars` - Systèmes calendaires
    - `celestial_bodies` - Corps célestes (planètes, lunes, etc.)
    - `races` - Races jouables
    - `character_classes` - Classes de personnages
    - `class_features` - Capacités de classe
    - `spells` - Sorts
    - `monsters` - Monstres et bestiaire
    - `guilds` - Guildes et organisations
    - `languages` - Langages
    - `animals` - Animaux et créatures naturelles
    - `plants` - Flore
    - `minerals` - Minéraux et gemmes
    - `crafting_materials` - Matériaux d'artisanat
    - `items` - Objets courants
    - `magic_items` - Objets magiques
    - `potions` - Potions et élixirs
    - `recipes` - Recettes de cuisine
    - `diseases` - Maladies
    - `curses` - Malédictions
    - `characters` - Personnages (PJ et PNJ)
    - `campaigns` - Campagnes
    - `encounters` - Rencontres et combats

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques permettant la lecture publique et modification pour utilisateurs authentifiés
*/

-- Worlds
CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  climate text,
  magic_level text,
  technology_level text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des mondes"
  ON worlds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Création de mondes"
  ON worlds FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Modification de ses propres mondes"
  ON worlds FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Suppression de ses propres mondes"
  ON worlds FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Continents
CREATE TABLE IF NOT EXISTS continents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  climate text,
  population text,
  geography text,
  history text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE continents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des continents"
  ON continents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Création de continents"
  ON continents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Modification de ses propres continents"
  ON continents FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Suppression de ses propres continents"
  ON continents FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Countries
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  continent_id uuid REFERENCES continents(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  government_type text,
  ruler text,
  population text,
  capital text,
  language text,
  currency text,
  military text,
  economy text,
  culture text,
  history text,
  relations text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des pays"
  ON countries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Création de pays"
  ON countries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Modification de ses propres pays"
  ON countries FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Suppression de ses propres pays"
  ON countries FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Races
CREATE TABLE IF NOT EXISTS races (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  ability_score_increase text,
  age text,
  alignment text,
  size text,
  speed text,
  languages text,
  traits text,
  subraces text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des races"
  ON races FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Création de races"
  ON races FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Modification de ses propres races"
  ON races FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Suppression de ses propres races"
  ON races FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_continents_world_id ON continents(world_id);
CREATE INDEX IF NOT EXISTS idx_countries_continent_id ON countries(continent_id);
CREATE INDEX IF NOT EXISTS idx_races_world_id ON races(world_id);



-- ============================================================
-- Migration: 20251217150017_create_additional_universe_tables.sql
-- ============================================================

/*
  # Création des tables supplémentaires pour la section Univers

  1. Nouvelles Tables
    - `cities` - Grandes cités
    - `villages` - Villages
    - `locations` - Autres lieux
    - `deities` - Dieux et panthéons
    - `calendars` - Calendriers
    - `celestial_bodies` - Corps célestes
    - `guilds` - Guildes et organisations
    - `languages` - Langages
    - `character_classes` - Classes de personnages
    - `class_features` - Capacités de classe
    - `spells` - Sorts
    - `monsters` - Monstres

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques de lecture publique et modification authentifiée
*/

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  population text,
  government text,
  economy text,
  districts text,
  notable_locations text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des cités" ON cities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de cités" ON cities FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres cités" ON cities FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres cités" ON cities FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Villages
CREATE TABLE IF NOT EXISTS villages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  population text,
  economy text,
  notable_npcs text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des villages" ON villages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de villages" ON villages FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres villages" ON villages FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres villages" ON villages FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Locations (autres lieux)
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  location_type text,
  danger_level text,
  treasures text,
  encounters text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des lieux" ON locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de lieux" ON locations FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres lieux" ON locations FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres lieux" ON locations FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Deities
CREATE TABLE IF NOT EXISTS deities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  alignment text,
  domains text,
  symbol text,
  worshippers text,
  temples text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE deities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des dieux" ON deities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de dieux" ON deities FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres dieux" ON deities FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres dieux" ON deities FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Calendars
CREATE TABLE IF NOT EXISTS calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  months jsonb,
  days_per_week integer,
  days_per_month integer,
  seasons text,
  festivals text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des calendriers" ON calendars FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de calendriers" ON calendars FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres calendriers" ON calendars FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres calendriers" ON calendars FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Celestial Bodies
CREATE TABLE IF NOT EXISTS celestial_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  body_type text,
  color text,
  size text,
  orbital_period text,
  astrological_influence text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE celestial_bodies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des corps célestes" ON celestial_bodies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de corps célestes" ON celestial_bodies FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres corps célestes" ON celestial_bodies FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres corps célestes" ON celestial_bodies FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Guilds
CREATE TABLE IF NOT EXISTS guilds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  guild_type text,
  headquarters text,
  leader text,
  members text,
  activities text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des guildes" ON guilds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de guildes" ON guilds FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres guildes" ON guilds FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres guildes" ON guilds FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  script text,
  typical_speakers text,
  rarity text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des langages" ON languages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de langages" ON languages FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres langages" ON languages FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres langages" ON languages FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Character Classes
CREATE TABLE IF NOT EXISTS character_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  hit_die text,
  primary_ability text,
  saving_throws text,
  armor_proficiencies text,
  weapon_proficiencies text,
  tool_proficiencies text,
  skills text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE character_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des classes" ON character_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de classes" ON character_classes FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres classes" ON character_classes FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres classes" ON character_classes FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Class Features
CREATE TABLE IF NOT EXISTS class_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES character_classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  level integer NOT NULL,
  feature_type text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE class_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des capacités" ON class_features FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de capacités" ON class_features FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres capacités" ON class_features FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres capacités" ON class_features FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Spells
CREATE TABLE IF NOT EXISTS spells (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  level integer NOT NULL,
  school text,
  casting_time text,
  range text,
  components text,
  duration text,
  classes text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE spells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des sorts" ON spells FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de sorts" ON spells FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres sorts" ON spells FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres sorts" ON spells FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Monsters
CREATE TABLE IF NOT EXISTS monsters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  size text,
  type text,
  alignment text,
  armor_class integer,
  hit_points text,
  speed text,
  stats jsonb,
  abilities text,
  challenge_rating text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des monstres" ON monsters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de monstres" ON monsters FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres monstres" ON monsters FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres monstres" ON monsters FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Index
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_villages_country_id ON villages(country_id);
CREATE INDEX IF NOT EXISTS idx_locations_world_id ON locations(world_id);
CREATE INDEX IF NOT EXISTS idx_deities_world_id ON deities(world_id);
CREATE INDEX IF NOT EXISTS idx_calendars_world_id ON calendars(world_id);
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_world_id ON celestial_bodies(world_id);
CREATE INDEX IF NOT EXISTS idx_guilds_world_id ON guilds(world_id);
CREATE INDEX IF NOT EXISTS idx_languages_world_id ON languages(world_id);
CREATE INDEX IF NOT EXISTS idx_character_classes_world_id ON character_classes(world_id);
CREATE INDEX IF NOT EXISTS idx_class_features_class_id ON class_features(class_id);
CREATE INDEX IF NOT EXISTS idx_spells_world_id ON spells(world_id);
CREATE INDEX IF NOT EXISTS idx_monsters_world_id ON monsters(world_id);



-- ============================================================
-- Migration: 20251217150135_create_resources_and_campaign_tables.sql
-- ============================================================

/*
  # Tables pour ressources et campagnes

  1. Nouvelles Tables
    - `animals` - Animaux et créatures naturelles
    - `plants` - Flore
    - `minerals` - Minéraux et gemmes
    - `crafting_materials` - Matériaux d'artisanat
    - `items` - Objets courants
    - `magic_items` - Objets magiques
    - `potions` - Potions et élixirs
    - `recipes` - Recettes de cuisine
    - `diseases` - Maladies
    - `curses` - Malédictions
    - `characters` - Personnages (PJ et PNJ)
    - `campaigns` - Campagnes
    - `encounters` - Rencontres/combats
    - `campaign_characters` - Relation campagnes-personnages

  2. Sécurité
    - Enable RLS sur toutes les tables
*/

-- Animals
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  habitat text,
  size text,
  diet text,
  behavior text,
  uses text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des animaux" ON animals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création d'animaux" ON animals FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres animaux" ON animals FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres animaux" ON animals FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Plants
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  habitat text,
  rarity text,
  properties text,
  uses text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des plantes" ON plants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de plantes" ON plants FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres plantes" ON plants FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres plantes" ON plants FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Minerals
CREATE TABLE IF NOT EXISTS minerals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  rarity text,
  value text,
  properties text,
  uses text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE minerals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des minéraux" ON minerals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de minéraux" ON minerals FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres minéraux" ON minerals FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres minéraux" ON minerals FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Crafting Materials
CREATE TABLE IF NOT EXISTS crafting_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  material_type text,
  rarity text,
  value text,
  sources text,
  uses text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE crafting_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des matériaux" ON crafting_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de matériaux" ON crafting_materials FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres matériaux" ON crafting_materials FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres matériaux" ON crafting_materials FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Items
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  item_type text,
  rarity text,
  value text,
  weight text,
  properties text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des objets" ON items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création d'objets" ON items FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres objets" ON items FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres objets" ON items FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Magic Items
CREATE TABLE IF NOT EXISTS magic_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  item_type text,
  rarity text,
  attunement boolean DEFAULT false,
  properties text,
  curse text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE magic_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des objets magiques" ON magic_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création d'objets magiques" ON magic_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres objets magiques" ON magic_items FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres objets magiques" ON magic_items FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Potions
CREATE TABLE IF NOT EXISTS potions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  rarity text,
  effects text,
  duration text,
  recipe text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE potions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des potions" ON potions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de potions" ON potions FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres potions" ON potions FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres potions" ON potions FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Recipes
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  ingredients text,
  preparation text,
  effects text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des recettes" ON recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de recettes" ON recipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres recettes" ON recipes FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres recettes" ON recipes FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Diseases
CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  transmission text,
  symptoms text,
  treatment text,
  duration text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des maladies" ON diseases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de maladies" ON diseases FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres maladies" ON diseases FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres maladies" ON diseases FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Curses
CREATE TABLE IF NOT EXISTS curses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  effects text,
  trigger text,
  removal text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE curses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des malédictions" ON curses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de malédictions" ON curses FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres malédictions" ON curses FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres malédictions" ON curses FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Characters (PJ et PNJ)
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  character_type text,
  race_id uuid REFERENCES races(id),
  class_id uuid REFERENCES character_classes(id),
  level integer DEFAULT 1,
  alignment text,
  stats jsonb,
  abilities jsonb,
  equipment jsonb,
  backstory text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des personnages" ON characters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de personnages" ON characters FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres personnages" ON characters FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres personnages" ON characters FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  status text DEFAULT 'planning',
  start_date timestamptz,
  session_count integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des campagnes" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de campagnes" ON campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres campagnes" ON campaigns FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres campagnes" ON campaigns FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Encounters
CREATE TABLE IF NOT EXISTS encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  encounter_type text,
  difficulty text,
  participants jsonb,
  initiative_order jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_sample boolean DEFAULT false
);

ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des rencontres" ON encounters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de rencontres" ON encounters FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Modification de ses propres rencontres" ON encounters FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Suppression de ses propres rencontres" ON encounters FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Campaign Characters (relation many-to-many)
CREATE TABLE IF NOT EXISTS campaign_characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  character_id uuid REFERENCES characters(id) ON DELETE CASCADE,
  role text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des liens campagne-personnage" ON campaign_characters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Création de liens campagne-personnage" ON campaign_characters FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Suppression de liens campagne-personnage" ON campaign_characters FOR DELETE TO authenticated USING (true);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_characters_world_id ON characters(world_id);
CREATE INDEX IF NOT EXISTS idx_characters_race_id ON characters(race_id);
CREATE INDEX IF NOT EXISTS idx_characters_class_id ON characters(class_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_world_id ON campaigns(world_id);
CREATE INDEX IF NOT EXISTS idx_encounters_campaign_id ON encounters(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_characters_campaign_id ON campaign_characters(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_characters_character_id ON campaign_characters(character_id);



-- ============================================================
-- Migration: 20251217151730_enable_public_sample_data_insert.sql
-- ============================================================

/*
  # Permettre l'insertion de données d'exemple publiques

  1. Changements
    - Ajoute des politiques pour permettre l'insertion de données avec is_sample = true
    - Permet la lecture publique de toutes les données d'exemple
    
  2. Sécurité
    - Seules les données marquées comme is_sample peuvent être insérées publiquement
    - Les utilisateurs authentifiés peuvent créer leurs propres données
*/

-- Politique pour permettre la lecture publique des données d'exemple
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'worlds', 'continents', 'countries', 'cities', 'villages', 'locations',
    'races', 'character_classes', 'class_features', 'characters', 
    'deities', 'calendars', 'celestial_bodies', 'guilds', 'languages',
    'spells', 'monsters', 'animals', 'plants', 'minerals', 
    'crafting_materials', 'items', 'magic_items', 'potions', 'recipes',
    'diseases', 'curses', 'campaigns', 'encounters'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Public can read sample data" ON %I;
      CREATE POLICY "Public can read sample data"
        ON %I FOR SELECT
        TO public
        USING (is_sample = true);
        
      DROP POLICY IF EXISTS "Public can insert sample data" ON %I;
      CREATE POLICY "Public can insert sample data"
        ON %I FOR INSERT
        TO public
        WITH CHECK (is_sample = true);
    ', tbl, tbl, tbl, tbl);
  END LOOP;
END $$;



-- ============================================================
-- Migration: 20251217160444_add_detailed_resource_columns.sql
-- ============================================================

/*
  # Ajout des colonnes détaillées pour toutes les ressources

  Cette migration ajoute toutes les colonnes manquantes pour permettre l'importation
  complète des données des fichiers CSV avec tous leurs détails.

  ## Tables modifiées

  ### 1. recipes (Recettes)
  Ajout de 34 colonnes pour capturer tous les détails culinaires:
  - Informations de base: type, cuisine_style, difficulty, difficulty_dc
  - Temps: preparation_time, cooking_time, total_time, servings
  - Ingrédients: ingredients_total_cost, required_tools
  - Instructions: cooking_steps
  - Effets: special_effects, effects_duration, addiction_risk, addiction_threshold,
    positive_effects_degradation, addiction_effects, withdrawal_symptoms
  - Sensorielles: taste_description, appearance, aroma, texture
  - Service: serving_suggestion, pairing
  - Conservation: storage_conditions, shelf_life
  - Valeur: market_value
  - Contexte: cultural_significance, history, variations, tips, warnings

  ### 2. plants (Plantes)
  Ajout de 15 colonnes pour les détails botaniques:
  - Caractéristiques: type, climate, season
  - Propriétés: effects, preparation, parts_used, harvest_difficulty
  - Valeur: market_value
  - Toxicité: toxicity_level, antidote
  - Magie: magical_uses
  - Culture: growth_time, cultivable
  - Informations: warnings, lore

  ### 3. animals (Animaux)
  Ajout de 17 colonnes pour les statistiques de créature:
  - Type: type
  - Combat: challenge_rating, armor_class, hit_points, speed
  - Capacités: abilities, skills, senses, special_abilities, actions
  - Comportement: behavior, diet
  - Domestication: domesticable, rideable
  - Gameplay: exp_value, token_url

  ### 4. minerals (Minéraux)
  Ajout de 15 colonnes pour les propriétés minéralogiques:
  - Caractéristiques: type, formation, appearance
  - Propriétés: magical_properties
  - Extraction: extraction_method, extraction_difficulty, processing
  - Physique: weight, hardness
  - Sécurité: dangers, side_effects
  - Usage: combinations
  - Contexte: lore, cultural_significance

  ### 5. crafting_materials (Matériaux d'artisanat)
  Ajout de 19 colonnes pour l'artisanat:
  - Classification: type, subtype, quality
  - Source: source, source_creature, harvest_method, harvest_difficulty, required_tool
  - Traitement: processing
  - Propriétés: magical_properties
  - Stockage: weight, unit, stack_size, durability
  - Usage: combinations, storage_conditions, preservation_time, crafting_bonus
  - Contexte: lore

  ### 6. items (Objets)
  Ajout de 12 colonnes pour les objets:
  - Type: type
  - Qualité: quality
  - Fabrication: materials, crafting_time, crafting_skill, durability
  - Propriétés: special_properties
  - Contexte: history, creator, uses
  - Physique: weight

  ### 7. magic_items (Objets magiques)
  Ajout de 12 colonnes pour la magie:
  - Type: type, requires_attunement, attunement_requirements
  - Pouvoir: magical_properties, bonus, charges
  - Malédiction: curse
  - Sentience: sentient, personality
  - Création: creator, creation_method, history
  - Physique: weight

  ### 8. potions (Potions)
  Ajout de 18 colonnes pour l'alchimie:
  - Type: type
  - Effets: effect, side_effects, addiction_risk, addiction_threshold,
    positive_effects_degradation, addiction_effects, withdrawal_symptoms
  - Fabrication: brewing_time, brewing_difficulty, brewing_method, required_tools,
    recipe_steps, ingredients_total_cost
  - Sensorielles: appearance, taste, smell
  - Stockage: weight, storage, shelf_life

  ### 9. diseases (Maladies)
  Ajout de 17 colonnes pour l'épidémiologie:
  - Type: type
  - Transmission: incubation_period, stages, transmission (remplace le champ existant)
  - Symptômes: mechanical_effects, symptoms (remplace le champ existant)
  - Évolution: mortality_rate, sequelae
  - Traitement: natural_remedies, magical_remedies, alchemical_remedies
  - Prévention: prevention, immunity_after_recovery, immunity_duration
  - Contexte: affected_species, origin, historical_outbreaks, cultural_impact

  ### 10. curses (Malédictions)
  Ajout de 20 colonnes pour les malédictions:
  - Type: type, severity, origin
  - Activation: manifestation, stages
  - Symptômes: symptoms, mechanical_effects, psychological_effects, social_effects
  - Propagation: is_hereditary, hereditary_conditions, spread_conditions, death_clause, sequelae
  - Remède: breaking_conditions, magical_remedies, ritual_remedies, quest_remedy
  - Prévention: prevention, detection
  - Contexte: famous_victims, cultural_significance

  ## Notes importantes
  - Tous les nouveaux champs sont de type TEXT sauf indication contraire
  - Les champs numériques utilisent INTEGER ou NUMERIC selon le contexte
  - Les champs booléens utilisent BOOLEAN avec des valeurs par défaut appropriées
  - Toutes les colonnes sont optionnelles (NULL autorisé) pour la flexibilité
*/

-- ============================================================================
-- RECIPES - Recettes de cuisine
-- ============================================================================
DO $$
BEGIN
  -- Informations de base
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'type') THEN
    ALTER TABLE recipes ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cuisine_style') THEN
    ALTER TABLE recipes ADD COLUMN cuisine_style TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'difficulty') THEN
    ALTER TABLE recipes ADD COLUMN difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'difficulty_dc') THEN
    ALTER TABLE recipes ADD COLUMN difficulty_dc INTEGER;
  END IF;
  
  -- Temps de préparation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'preparation_time') THEN
    ALTER TABLE recipes ADD COLUMN preparation_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cooking_time') THEN
    ALTER TABLE recipes ADD COLUMN cooking_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'total_time') THEN
    ALTER TABLE recipes ADD COLUMN total_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'servings') THEN
    ALTER TABLE recipes ADD COLUMN servings TEXT;
  END IF;
  
  -- Coûts et outils
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'ingredients_total_cost') THEN
    ALTER TABLE recipes ADD COLUMN ingredients_total_cost TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'required_tools') THEN
    ALTER TABLE recipes ADD COLUMN required_tools TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cooking_steps') THEN
    ALTER TABLE recipes ADD COLUMN cooking_steps TEXT;
  END IF;
  
  -- Effets spéciaux
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'special_effects') THEN
    ALTER TABLE recipes ADD COLUMN special_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'effects_duration') THEN
    ALTER TABLE recipes ADD COLUMN effects_duration TEXT;
  END IF;
  
  -- Addiction
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_risk') THEN
    ALTER TABLE recipes ADD COLUMN addiction_risk TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_threshold') THEN
    ALTER TABLE recipes ADD COLUMN addiction_threshold TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'positive_effects_degradation') THEN
    ALTER TABLE recipes ADD COLUMN positive_effects_degradation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_effects') THEN
    ALTER TABLE recipes ADD COLUMN addiction_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'withdrawal_symptoms') THEN
    ALTER TABLE recipes ADD COLUMN withdrawal_symptoms TEXT;
  END IF;
  
  -- Propriétés sensorielles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'taste_description') THEN
    ALTER TABLE recipes ADD COLUMN taste_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'appearance') THEN
    ALTER TABLE recipes ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'aroma') THEN
    ALTER TABLE recipes ADD COLUMN aroma TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'texture') THEN
    ALTER TABLE recipes ADD COLUMN texture TEXT;
  END IF;
  
  -- Service
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'serving_suggestion') THEN
    ALTER TABLE recipes ADD COLUMN serving_suggestion TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'pairing') THEN
    ALTER TABLE recipes ADD COLUMN pairing TEXT;
  END IF;
  
  -- Conservation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'storage_conditions') THEN
    ALTER TABLE recipes ADD COLUMN storage_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'shelf_life') THEN
    ALTER TABLE recipes ADD COLUMN shelf_life TEXT;
  END IF;
  
  -- Valeur et contexte
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'market_value') THEN
    ALTER TABLE recipes ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cultural_significance') THEN
    ALTER TABLE recipes ADD COLUMN cultural_significance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'history') THEN
    ALTER TABLE recipes ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'variations') THEN
    ALTER TABLE recipes ADD COLUMN variations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'tips') THEN
    ALTER TABLE recipes ADD COLUMN tips TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'warnings') THEN
    ALTER TABLE recipes ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- PLANTS - Plantes
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'type') THEN
    ALTER TABLE plants ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'climate') THEN
    ALTER TABLE plants ADD COLUMN climate TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'season') THEN
    ALTER TABLE plants ADD COLUMN season TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'effects') THEN
    ALTER TABLE plants ADD COLUMN effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'preparation') THEN
    ALTER TABLE plants ADD COLUMN preparation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'parts_used') THEN
    ALTER TABLE plants ADD COLUMN parts_used TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'harvest_difficulty') THEN
    ALTER TABLE plants ADD COLUMN harvest_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'market_value') THEN
    ALTER TABLE plants ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'toxicity_level') THEN
    ALTER TABLE plants ADD COLUMN toxicity_level TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'antidote') THEN
    ALTER TABLE plants ADD COLUMN antidote TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'magical_uses') THEN
    ALTER TABLE plants ADD COLUMN magical_uses TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'growth_time') THEN
    ALTER TABLE plants ADD COLUMN growth_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'cultivable') THEN
    ALTER TABLE plants ADD COLUMN cultivable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'warnings') THEN
    ALTER TABLE plants ADD COLUMN warnings TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'lore') THEN
    ALTER TABLE plants ADD COLUMN lore TEXT;
  END IF;
END $$;

-- ============================================================================
-- ANIMALS - Animaux
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'type') THEN
    ALTER TABLE animals ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'challenge_rating') THEN
    ALTER TABLE animals ADD COLUMN challenge_rating TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'armor_class') THEN
    ALTER TABLE animals ADD COLUMN armor_class INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'hit_points') THEN
    ALTER TABLE animals ADD COLUMN hit_points TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'speed') THEN
    ALTER TABLE animals ADD COLUMN speed TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'abilities') THEN
    ALTER TABLE animals ADD COLUMN abilities TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'skills') THEN
    ALTER TABLE animals ADD COLUMN skills TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'senses') THEN
    ALTER TABLE animals ADD COLUMN senses TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'special_abilities') THEN
    ALTER TABLE animals ADD COLUMN special_abilities TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'actions') THEN
    ALTER TABLE animals ADD COLUMN actions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'behavior') THEN
    ALTER TABLE animals ADD COLUMN behavior TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'diet') THEN
    ALTER TABLE animals ADD COLUMN diet TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'domesticable') THEN
    ALTER TABLE animals ADD COLUMN domesticable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'rideable') THEN
    ALTER TABLE animals ADD COLUMN rideable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'exp_value') THEN
    ALTER TABLE animals ADD COLUMN exp_value INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'token_url') THEN
    ALTER TABLE animals ADD COLUMN token_url TEXT;
  END IF;
END $$;

-- Continuer avec les autres tables dans le prochain bloc...
-- (La limite de caractères m'oblige à diviser la migration)


-- ============================================================
-- Migration: 20251217160601_add_detailed_resource_columns_part2.sql
-- ============================================================

/*
  # Ajout des colonnes détaillées pour les ressources - Partie 2

  Suite de la migration précédente pour les tables restantes.
*/

-- ============================================================================
-- MINERALS - Minéraux
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'type') THEN
    ALTER TABLE minerals ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'habitat') THEN
    ALTER TABLE minerals ADD COLUMN habitat TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'formation') THEN
    ALTER TABLE minerals ADD COLUMN formation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'appearance') THEN
    ALTER TABLE minerals ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'magical_properties') THEN
    ALTER TABLE minerals ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'extraction_method') THEN
    ALTER TABLE minerals ADD COLUMN extraction_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'extraction_difficulty') THEN
    ALTER TABLE minerals ADD COLUMN extraction_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'processing') THEN
    ALTER TABLE minerals ADD COLUMN processing TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'market_value') THEN
    ALTER TABLE minerals ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'weight') THEN
    ALTER TABLE minerals ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'hardness') THEN
    ALTER TABLE minerals ADD COLUMN hardness TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'dangers') THEN
    ALTER TABLE minerals ADD COLUMN dangers TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'side_effects') THEN
    ALTER TABLE minerals ADD COLUMN side_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'combinations') THEN
    ALTER TABLE minerals ADD COLUMN combinations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'lore') THEN
    ALTER TABLE minerals ADD COLUMN lore TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'cultural_significance') THEN
    ALTER TABLE minerals ADD COLUMN cultural_significance TEXT;
  END IF;
END $$;

-- ============================================================================
-- CRAFTING_MATERIALS - Matériaux d'artisanat
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'type') THEN
    ALTER TABLE crafting_materials ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'subtype') THEN
    ALTER TABLE crafting_materials ADD COLUMN subtype TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'quality') THEN
    ALTER TABLE crafting_materials ADD COLUMN quality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'source') THEN
    ALTER TABLE crafting_materials ADD COLUMN source TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'source_creature') THEN
    ALTER TABLE crafting_materials ADD COLUMN source_creature TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'harvest_method') THEN
    ALTER TABLE crafting_materials ADD COLUMN harvest_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'harvest_difficulty') THEN
    ALTER TABLE crafting_materials ADD COLUMN harvest_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'required_tool') THEN
    ALTER TABLE crafting_materials ADD COLUMN required_tool TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'processing') THEN
    ALTER TABLE crafting_materials ADD COLUMN processing TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'properties') THEN
    ALTER TABLE crafting_materials ADD COLUMN properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'magical_properties') THEN
    ALTER TABLE crafting_materials ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'market_value') THEN
    ALTER TABLE crafting_materials ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'weight') THEN
    ALTER TABLE crafting_materials ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'unit') THEN
    ALTER TABLE crafting_materials ADD COLUMN unit TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'stack_size') THEN
    ALTER TABLE crafting_materials ADD COLUMN stack_size TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'durability') THEN
    ALTER TABLE crafting_materials ADD COLUMN durability TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'combinations') THEN
    ALTER TABLE crafting_materials ADD COLUMN combinations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'storage_conditions') THEN
    ALTER TABLE crafting_materials ADD COLUMN storage_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'preservation_time') THEN
    ALTER TABLE crafting_materials ADD COLUMN preservation_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'crafting_bonus') THEN
    ALTER TABLE crafting_materials ADD COLUMN crafting_bonus TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'lore') THEN
    ALTER TABLE crafting_materials ADD COLUMN lore TEXT;
  END IF;
END $$;

-- ============================================================================
-- ITEMS - Objets
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'type') THEN
    ALTER TABLE items ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'quality') THEN
    ALTER TABLE items ADD COLUMN quality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'market_value') THEN
    ALTER TABLE items ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'weight') THEN
    ALTER TABLE items ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'materials') THEN
    ALTER TABLE items ADD COLUMN materials TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'crafting_time') THEN
    ALTER TABLE items ADD COLUMN crafting_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'crafting_skill') THEN
    ALTER TABLE items ADD COLUMN crafting_skill TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'durability') THEN
    ALTER TABLE items ADD COLUMN durability TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'special_properties') THEN
    ALTER TABLE items ADD COLUMN special_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'history') THEN
    ALTER TABLE items ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'creator') THEN
    ALTER TABLE items ADD COLUMN creator TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'item_uses') THEN
    ALTER TABLE items ADD COLUMN item_uses TEXT;
  END IF;
END $$;

-- ============================================================================
-- MAGIC_ITEMS - Objets magiques
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'type') THEN
    ALTER TABLE magic_items ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'requires_attunement') THEN
    ALTER TABLE magic_items ADD COLUMN requires_attunement TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'attunement_requirements') THEN
    ALTER TABLE magic_items ADD COLUMN attunement_requirements TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'magical_properties') THEN
    ALTER TABLE magic_items ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'bonus') THEN
    ALTER TABLE magic_items ADD COLUMN bonus TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'charges') THEN
    ALTER TABLE magic_items ADD COLUMN charges TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'curse') THEN
    ALTER TABLE magic_items ADD COLUMN curse TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'sentient') THEN
    ALTER TABLE magic_items ADD COLUMN sentient TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'personality') THEN
    ALTER TABLE magic_items ADD COLUMN personality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'creator') THEN
    ALTER TABLE magic_items ADD COLUMN creator TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'creation_method') THEN
    ALTER TABLE magic_items ADD COLUMN creation_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'history') THEN
    ALTER TABLE magic_items ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'market_value') THEN
    ALTER TABLE magic_items ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'weight') THEN
    ALTER TABLE magic_items ADD COLUMN weight TEXT;
  END IF;
END $$;

-- ============================================================================
-- POTIONS - Potions
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'type') THEN
    ALTER TABLE potions ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'effect') THEN
    ALTER TABLE potions ADD COLUMN effect TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'side_effects') THEN
    ALTER TABLE potions ADD COLUMN side_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_risk') THEN
    ALTER TABLE potions ADD COLUMN addiction_risk TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_threshold') THEN
    ALTER TABLE potions ADD COLUMN addiction_threshold TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'positive_effects_degradation') THEN
    ALTER TABLE potions ADD COLUMN positive_effects_degradation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_effects') THEN
    ALTER TABLE potions ADD COLUMN addiction_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'withdrawal_symptoms') THEN
    ALTER TABLE potions ADD COLUMN withdrawal_symptoms TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'ingredients') THEN
    ALTER TABLE potions ADD COLUMN ingredients TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'ingredients_total_cost') THEN
    ALTER TABLE potions ADD COLUMN ingredients_total_cost TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_time') THEN
    ALTER TABLE potions ADD COLUMN brewing_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_difficulty') THEN
    ALTER TABLE potions ADD COLUMN brewing_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_method') THEN
    ALTER TABLE potions ADD COLUMN brewing_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'required_tools') THEN
    ALTER TABLE potions ADD COLUMN required_tools TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'recipe_steps') THEN
    ALTER TABLE potions ADD COLUMN recipe_steps TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'appearance') THEN
    ALTER TABLE potions ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'taste') THEN
    ALTER TABLE potions ADD COLUMN taste TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'smell') THEN
    ALTER TABLE potions ADD COLUMN smell TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'market_value') THEN
    ALTER TABLE potions ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'weight') THEN
    ALTER TABLE potions ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'storage') THEN
    ALTER TABLE potions ADD COLUMN storage TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'shelf_life') THEN
    ALTER TABLE potions ADD COLUMN shelf_life TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'warnings') THEN
    ALTER TABLE potions ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- DISEASES - Maladies
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'type') THEN
    ALTER TABLE diseases ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'incubation_period') THEN
    ALTER TABLE diseases ADD COLUMN incubation_period TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'stages') THEN
    ALTER TABLE diseases ADD COLUMN stages TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'mechanical_effects') THEN
    ALTER TABLE diseases ADD COLUMN mechanical_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'mortality_rate') THEN
    ALTER TABLE diseases ADD COLUMN mortality_rate TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'sequelae') THEN
    ALTER TABLE diseases ADD COLUMN sequelae TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'natural_remedies') THEN
    ALTER TABLE diseases ADD COLUMN natural_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'magical_remedies') THEN
    ALTER TABLE diseases ADD COLUMN magical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'alchemical_remedies') THEN
    ALTER TABLE diseases ADD COLUMN alchemical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'prevention') THEN
    ALTER TABLE diseases ADD COLUMN prevention TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'immunity_after_recovery') THEN
    ALTER TABLE diseases ADD COLUMN immunity_after_recovery TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'immunity_duration') THEN
    ALTER TABLE diseases ADD COLUMN immunity_duration TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'affected_species') THEN
    ALTER TABLE diseases ADD COLUMN affected_species TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'origin') THEN
    ALTER TABLE diseases ADD COLUMN origin TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'historical_outbreaks') THEN
    ALTER TABLE diseases ADD COLUMN historical_outbreaks TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'cultural_impact') THEN
    ALTER TABLE diseases ADD COLUMN cultural_impact TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'warnings') THEN
    ALTER TABLE diseases ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- CURSES - Malédictions
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'type') THEN
    ALTER TABLE curses ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'severity') THEN
    ALTER TABLE curses ADD COLUMN severity TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'origin') THEN
    ALTER TABLE curses ADD COLUMN origin TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'manifestation') THEN
    ALTER TABLE curses ADD COLUMN manifestation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'stages') THEN
    ALTER TABLE curses ADD COLUMN stages TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'symptoms') THEN
    ALTER TABLE curses ADD COLUMN symptoms TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'mechanical_effects') THEN
    ALTER TABLE curses ADD COLUMN mechanical_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'psychological_effects') THEN
    ALTER TABLE curses ADD COLUMN psychological_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'social_effects') THEN
    ALTER TABLE curses ADD COLUMN social_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'duration') THEN
    ALTER TABLE curses ADD COLUMN duration TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'is_hereditary') THEN
    ALTER TABLE curses ADD COLUMN is_hereditary TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'hereditary_conditions') THEN
    ALTER TABLE curses ADD COLUMN hereditary_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'spread_conditions') THEN
    ALTER TABLE curses ADD COLUMN spread_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'death_clause') THEN
    ALTER TABLE curses ADD COLUMN death_clause TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'sequelae') THEN
    ALTER TABLE curses ADD COLUMN sequelae TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'breaking_conditions') THEN
    ALTER TABLE curses ADD COLUMN breaking_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'magical_remedies') THEN
    ALTER TABLE curses ADD COLUMN magical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'ritual_remedies') THEN
    ALTER TABLE curses ADD COLUMN ritual_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'quest_remedy') THEN
    ALTER TABLE curses ADD COLUMN quest_remedy TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'prevention') THEN
    ALTER TABLE curses ADD COLUMN prevention TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'detection') THEN
    ALTER TABLE curses ADD COLUMN detection TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'famous_victims') THEN
    ALTER TABLE curses ADD COLUMN famous_victims TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'cultural_significance') THEN
    ALTER TABLE curses ADD COLUMN cultural_significance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'warnings') THEN
    ALTER TABLE curses ADD COLUMN warnings TEXT;
  END IF;
END $$;


-- ============================================================
-- Migration: 20251217161418_create_storage_bucket_for_images.sql
-- ============================================================

/*
  # Création du bucket de stockage pour les images

  1. Bucket de stockage
    - Crée le bucket `entity-images` pour stocker toutes les images des entités
    - Configuration publique pour permettre l'accès aux images

  2. Politiques de sécurité
    - Lecture publique : tout le monde peut voir les images
    - Upload/Update/Delete : réservé aux utilisateurs authentifiés
    - Les utilisateurs peuvent gérer toutes les images (pas de restriction par utilisateur)
*/

-- Créer le bucket pour les images des entités
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entity-images',
  'entity-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Politique pour permettre la lecture publique
CREATE POLICY "Public access to images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'entity-images');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'entity-images');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'entity-images')
WITH CHECK (bucket_id = 'entity-images');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'entity-images');


-- ============================================================
-- Migration: 20251217164616_add_authenticated_user_policies.sql
-- ============================================================

/*
  # Ajouter les policies pour les utilisateurs authentifiés
  
  1. Nouvelles policies
    - Les utilisateurs authentifiés peuvent créer leurs propres données
    - Les utilisateurs authentifiés peuvent lire toutes les données
    - Les utilisateurs authentifiés peuvent modifier leurs propres données
    - Les utilisateurs authentifiés peuvent supprimer leurs propres données
  
  2. Sécurité
    - Les utilisateurs ne peuvent modifier/supprimer que leurs propres données
    - Les utilisateurs peuvent lire toutes les données (publiques + leurs propres données)
*/

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'worlds', 'continents', 'countries', 'cities', 'villages', 'locations',
    'races', 'character_classes', 'class_features', 'characters', 
    'deities', 'calendars', 'celestial_bodies', 'guilds', 'languages',
    'spells', 'monsters', 'animals', 'plants', 'minerals', 
    'crafting_materials', 'items', 'magic_items', 'potions', 'recipes',
    'diseases', 'curses', 'campaigns', 'encounters'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    -- Policy pour permettre aux utilisateurs authentifiés de lire toutes les données
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can read all data" ON %I;
      CREATE POLICY "Authenticated users can read all data"
        ON %I FOR SELECT
        TO authenticated
        USING (true);
    ', tbl, tbl);
    
    -- Policy pour permettre aux utilisateurs authentifiés de créer leurs propres données
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can insert own data" ON %I;
      CREATE POLICY "Authenticated users can insert own data"
        ON %I FOR INSERT
        TO authenticated
        WITH CHECK (created_by = auth.uid() OR created_by IS NULL);
    ', tbl, tbl);
    
    -- Policy pour permettre aux utilisateurs authentifiés de modifier leurs propres données
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can update own data" ON %I;
      CREATE POLICY "Authenticated users can update own data"
        ON %I FOR UPDATE
        TO authenticated
        USING (created_by = auth.uid())
        WITH CHECK (created_by = auth.uid());
    ', tbl, tbl);
    
    -- Policy pour permettre aux utilisateurs authentifiés de supprimer leurs propres données
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can delete own data" ON %I;
      CREATE POLICY "Authenticated users can delete own data"
        ON %I FOR DELETE
        TO authenticated
        USING (created_by = auth.uid());
    ', tbl, tbl);
  END LOOP;
END $$;



-- ============================================================
-- Migration: 20251220135705_create_oceans_and_sects_tables.sql
-- ============================================================

/*
  # Création des tables Océans & mers et Sectes

  1. Nouvelles Tables
    - `oceans`
      - `id` (uuid, clé primaire)
      - `name` (text, obligatoire) - Nom de l'océan ou de la mer
      - `description` (text) - Description détaillée
      - `image_url` (text) - URL de l'image
      - `notes` (text) - Notes et particularités
      - `user_id` (uuid, référence à auth.users) - Utilisateur propriétaire
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour

    - `sects`
      - `id` (uuid, clé primaire)
      - `name` (text, obligatoire) - Nom de la secte
      - `description` (text) - Description détaillée
      - `leader` (text) - Chef ou leader de la secte
      - `goals` (text) - Objectifs et motivations
      - `image_url` (text) - URL de l'image
      - `notes` (text) - Notes et particularités
      - `user_id` (uuid, référence à auth.users) - Utilisateur propriétaire
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour

  2. Sécurité
    - Active RLS sur les deux tables
    - Politiques permettant aux utilisateurs authentifiés de :
      - Voir leurs propres données
      - Insérer leurs propres données
      - Modifier leurs propres données
      - Supprimer leurs propres données
*/

-- Table oceans
CREATE TABLE IF NOT EXISTS oceans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  notes text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE oceans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own oceans"
  ON oceans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own oceans"
  ON oceans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own oceans"
  ON oceans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own oceans"
  ON oceans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Table sects
CREATE TABLE IF NOT EXISTS sects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  leader text,
  goals text,
  image_url text,
  notes text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sects"
  ON sects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sects"
  ON sects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sects"
  ON sects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sects"
  ON sects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);



-- ============================================================
-- Migration: 20251220142438_add_is_sample_to_oceans_and_sects.sql
-- ============================================================

/*
  # Ajout de la colonne is_sample aux tables oceans et sects

  1. Modifications
    - Ajoute la colonne `is_sample` (boolean) à la table `oceans`
    - Ajoute la colonne `is_sample` (boolean) à la table `sects`
    - Valeur par défaut: false
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'oceans' AND column_name = 'is_sample'
  ) THEN
    ALTER TABLE oceans ADD COLUMN is_sample boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sects' AND column_name = 'is_sample'
  ) THEN
    ALTER TABLE sects ADD COLUMN is_sample boolean DEFAULT false;
  END IF;
END $$;



-- ============================================================
-- Migration: 20251220151225_add_hierarchical_relations.sql
-- ============================================================

/*
  # Add Hierarchical Relations Between Entities

  ## Overview
  This migration adds the missing foreign key relationships to create a complete
  hierarchical structure for worldbuilding elements.

  ## New Relationships Added

  1. **Oceans and Sects**
    - Add `world_id` to both tables to link them to specific worlds

  2. **Countries**
    - Add `ocean_id` to allow countries to belong to an ocean/sea instead of a continent

  3. **Locations**
    - Add `country_id` to link locations (villages, cities, etc.) to countries

  ## Foreign Keys
  All new foreign key relationships use ON DELETE SET NULL to preserve data
  when parent records are deleted.

  ## Security
  - All tables already have RLS enabled from previous migrations
  - No changes to existing RLS policies needed
*/

-- Add world_id to oceans table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'oceans' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE oceans 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_oceans_world_id ON oceans(world_id);
  END IF;
END $$;

-- Add world_id to sects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sects' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE sects 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_sects_world_id ON sects(world_id);
  END IF;
END $$;

-- Add ocean_id to countries table (countries can be on continents OR oceans/seas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'ocean_id'
  ) THEN
    ALTER TABLE countries 
    ADD COLUMN ocean_id uuid REFERENCES oceans(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_countries_ocean_id ON countries(ocean_id);
  END IF;
END $$;

-- Add country_id to locations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE locations 
    ADD COLUMN country_id uuid REFERENCES countries(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_locations_country_id ON locations(country_id);
  END IF;
END $$;

-- Add comment to document the hierarchical structure
COMMENT ON TABLE worlds IS 'Root level: All elements belong to a world';
COMMENT ON TABLE continents IS 'Level 2: Continents belong to worlds';
COMMENT ON TABLE oceans IS 'Level 2: Oceans/seas belong to worlds';
COMMENT ON TABLE countries IS 'Level 3: Countries belong to continents OR oceans';
COMMENT ON TABLE cities IS 'Level 4: Cities belong to countries';
COMMENT ON TABLE locations IS 'Level 4: Locations (villages, landmarks) belong to countries';



-- ============================================================
-- Migration: 20251220151703_add_world_id_to_countries.sql
-- ============================================================

/*
  # Add world_id to countries table

  ## Overview
  Countries previously only had continent_id and ocean_id, but they also
  need to belong to a specific world for consistency.

  ## Changes
  - Add world_id column to countries table
  - Add index for performance

  ## Notes
  This column is optional (nullable) as existing data may not have this information.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE countries 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_countries_world_id ON countries(world_id);
  END IF;
END $$;



-- ============================================================
-- Migration: 20251220151722_add_world_id_to_cities.sql
-- ============================================================

/*
  # Add world_id to cities table

  ## Overview
  Cities currently only have country_id, but they should also have
  a direct link to their world for easier filtering.

  ## Changes
  - Add world_id column to cities table
  - Add index for performance

  ## Notes
  This column is optional (nullable) as existing data may not have this information.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cities' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE cities 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_cities_world_id ON cities(world_id);
  END IF;
END $$;



-- ============================================================
-- Migration: 20251220155622_add_enhanced_deity_fields.sql
-- ============================================================

/*
  # Ajout de champs améliorés pour les divinités

  ## Nouvelles colonnes
  
  ### Informations de base
  - `pantheon` (text) - Panthéon d'appartenance (ex: Dragonlance, Forgotten Realms, Greyhawk)
  - `title` (text) - Titre ou épithète (ex: "Dieu de la Sagesse et du Temps")
  - `divine_rank` (text) - Rang divin (mineur, intermédiaire, majeur, surdivin)
  - `portfolio` (text) - Portefeuille/responsabilités du dieu
  
  ### Symboles et représentation
  - `sacred_symbol_description` (text) - Description détaillée du symbole sacré
  - `deity_images` (jsonb) - Images multiples catégorisées (dieu, temples, disciples, symboles)
  - `appearance` (text) - Apparence physique de la divinité
  
  ### Culte et adoration
  - `favored_weapon` (text) - Arme de prédilection
  - `holy_days` (text) - Jours saints et célébrations
  - `rituals` (text) - Rituels et cérémonies
  - `clergy_alignments` (text) - Alignements du clergé
  - `typical_worshippers` (text) - Description des adorateurs typiques
  
  ### Relations divines
  - `divine_servants` (text) - Serviteurs divins (anges, hérauts, etc.)
  - `allies` (text) - Alliés divins
  - `enemies` (text) - Ennemis et rivaux divins
  
  ### Pouvoirs et artefacts
  - `sacred_artifacts` (text) - Artefacts sacrés associés
  - `granted_powers` (text) - Pouvoirs accordés aux fidèles
  - `divine_spells` (text) - Sorts divins spécifiques
  
  ### Avatar et manifestation
  - `avatar_description` (text) - Description de l'avatar
  - `manifestations` (text) - Manifestations et signes divins
*/

-- Ajout des nouveaux champs à la table deities
DO $$ 
BEGIN
  -- Informations de base
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'pantheon'
  ) THEN
    ALTER TABLE deities ADD COLUMN pantheon text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'title'
  ) THEN
    ALTER TABLE deities ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'divine_rank'
  ) THEN
    ALTER TABLE deities ADD COLUMN divine_rank text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'portfolio'
  ) THEN
    ALTER TABLE deities ADD COLUMN portfolio text;
  END IF;

  -- Symboles et représentation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'sacred_symbol_description'
  ) THEN
    ALTER TABLE deities ADD COLUMN sacred_symbol_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'deity_images'
  ) THEN
    ALTER TABLE deities ADD COLUMN deity_images jsonb DEFAULT '{"god": [], "temples": [], "disciples": [], "symbols": []}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'appearance'
  ) THEN
    ALTER TABLE deities ADD COLUMN appearance text;
  END IF;

  -- Culte et adoration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'favored_weapon'
  ) THEN
    ALTER TABLE deities ADD COLUMN favored_weapon text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'holy_days'
  ) THEN
    ALTER TABLE deities ADD COLUMN holy_days text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'rituals'
  ) THEN
    ALTER TABLE deities ADD COLUMN rituals text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'clergy_alignments'
  ) THEN
    ALTER TABLE deities ADD COLUMN clergy_alignments text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'typical_worshippers'
  ) THEN
    ALTER TABLE deities ADD COLUMN typical_worshippers text;
  END IF;

  -- Relations divines
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'divine_servants'
  ) THEN
    ALTER TABLE deities ADD COLUMN divine_servants text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'allies'
  ) THEN
    ALTER TABLE deities ADD COLUMN allies text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'enemies'
  ) THEN
    ALTER TABLE deities ADD COLUMN enemies text;
  END IF;

  -- Pouvoirs et artefacts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'sacred_artifacts'
  ) THEN
    ALTER TABLE deities ADD COLUMN sacred_artifacts text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'granted_powers'
  ) THEN
    ALTER TABLE deities ADD COLUMN granted_powers text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'divine_spells'
  ) THEN
    ALTER TABLE deities ADD COLUMN divine_spells text;
  END IF;

  -- Avatar et manifestation
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'avatar_description'
  ) THEN
    ALTER TABLE deities ADD COLUMN avatar_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deities' AND column_name = 'manifestations'
  ) THEN
    ALTER TABLE deities ADD COLUMN manifestations text;
  END IF;
END $$;


-- ============================================================
-- Migration: 20251220160622_fix_rls_policies_for_sample_data.sql
-- ============================================================

/*
  # Correction des politiques RLS pour permettre la modification des données d'exemple

  ## Problème
  Les utilisateurs authentifiés ne peuvent pas modifier les données qui ne leur appartiennent pas,
  y compris les données d'exemple (is_sample = true) ou les données sans créateur (created_by IS NULL).

  ## Solution
  Mettre à jour les politiques UPDATE et DELETE pour permettre aux utilisateurs authentifiés de modifier :
  1. Leurs propres données (created_by = auth.uid())
  2. Les données d'exemple (is_sample = true)
  3. Les données sans créateur (created_by IS NULL)

  ## Tables concernées
  Toutes les tables principales avec la colonne created_by
*/

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'worlds', 'continents', 'countries', 'cities', 'villages', 'locations',
    'races', 'character_classes', 'class_features', 'characters', 
    'deities', 'calendars', 'celestial_bodies', 'guilds', 'languages',
    'spells', 'monsters', 'animals', 'plants', 'minerals', 
    'crafting_materials', 'items', 'magic_items', 'potions', 'recipes',
    'diseases', 'curses', 'campaigns', 'encounters'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    -- Supprimer l'ancienne politique UPDATE
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can update own data" ON %I;
      DROP POLICY IF EXISTS "Authenticated users can update data" ON %I;
    ', tbl, tbl);
    
    -- Créer la nouvelle politique UPDATE qui permet la modification des données d'exemple
    EXECUTE format('
      CREATE POLICY "Authenticated users can update data"
        ON %I FOR UPDATE
        TO authenticated
        USING (
          created_by = auth.uid() 
          OR is_sample = true 
          OR created_by IS NULL
        )
        WITH CHECK (true);
    ', tbl);
    
    -- Améliorer aussi la politique DELETE pour les données d'exemple
    EXECUTE format('
      DROP POLICY IF EXISTS "Authenticated users can delete own data" ON %I;
      DROP POLICY IF EXISTS "Authenticated users can delete data" ON %I;
    ', tbl, tbl);
    
    EXECUTE format('
      CREATE POLICY "Authenticated users can delete data"
        ON %I FOR DELETE
        TO authenticated
        USING (
          created_by = auth.uid() 
          OR is_sample = true 
          OR created_by IS NULL
        );
    ', tbl);
  END LOOP;
END $$;

-- Pour les tables oceans et sects qui utilisent user_id au lieu de created_by
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['oceans', 'sects'];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    -- Supprimer les anciennes politiques
    EXECUTE format('
      DROP POLICY IF EXISTS "Users can view own %s" ON %I;
      DROP POLICY IF EXISTS "Users can insert own %s" ON %I;
      DROP POLICY IF EXISTS "Users can update own %s" ON %I;
      DROP POLICY IF EXISTS "Users can delete own %s" ON %I;
    ', tbl, tbl, tbl, tbl, tbl, tbl, tbl, tbl);
    
    -- Créer les nouvelles politiques
    EXECUTE format('
      CREATE POLICY "Authenticated users can read all data"
        ON %I FOR SELECT
        TO authenticated
        USING (true);
    ', tbl);
    
    EXECUTE format('
      CREATE POLICY "Authenticated users can insert own data"
        ON %I FOR INSERT
        TO authenticated
        WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
    ', tbl);
    
    EXECUTE format('
      CREATE POLICY "Authenticated users can update data"
        ON %I FOR UPDATE
        TO authenticated
        USING (
          user_id = auth.uid() 
          OR is_sample = true 
          OR user_id IS NULL
        )
        WITH CHECK (true);
    ', tbl);
    
    EXECUTE format('
      CREATE POLICY "Authenticated users can delete data"
        ON %I FOR DELETE
        TO authenticated
        USING (
          user_id = auth.uid() 
          OR is_sample = true 
          OR user_id IS NULL
        );
    ', tbl);
  END LOOP;
END $$;


-- ============================================================
-- Migration: 20251220160854_cleanup_duplicate_rls_policies.sql
-- ============================================================

/*
  # Nettoyage des politiques RLS en double

  ## Problème
  Il existe plusieurs politiques RLS en double sur les tables, ce qui crée des conflits.
  Par exemple, sur deities il y a:
  - "Authenticated users can insert own data" ET "Création de dieux"
  - "Authenticated users can update data" ET "Modification de ses propres dieux"
  - etc.

  ## Solution
  Supprimer toutes les anciennes politiques et ne garder que les nouvelles qui sont plus flexibles.

  ## Tables concernées
  Toutes les tables principales
*/

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'worlds', 'continents', 'countries', 'cities', 'villages', 'locations',
    'races', 'character_classes', 'class_features', 'characters', 
    'deities', 'calendars', 'celestial_bodies', 'guilds', 'languages',
    'spells', 'monsters', 'animals', 'plants', 'minerals', 
    'crafting_materials', 'items', 'magic_items', 'potions', 'recipes',
    'diseases', 'curses', 'campaigns', 'encounters'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    -- Supprimer toutes les anciennes politiques
    EXECUTE format('DROP POLICY IF EXISTS "Lecture publique des %s" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Création de %s" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Modification de ses propres %s" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Suppression de ses propres %s" ON %I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public can read sample data" ON %I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public can insert sample data" ON %I', tbl);
    
    -- S'assurer que les politiques actuelles sont correctes
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can read all data" ON %I', tbl);
    EXECUTE format('
      CREATE POLICY "Authenticated users can read all data"
        ON %I FOR SELECT
        TO authenticated
        USING (true);
    ', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can insert own data" ON %I', tbl);
    EXECUTE format('
      CREATE POLICY "Authenticated users can insert own data"
        ON %I FOR INSERT
        TO authenticated
        WITH CHECK (true);
    ', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can update data" ON %I', tbl);
    EXECUTE format('
      CREATE POLICY "Authenticated users can update data"
        ON %I FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);
    ', tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can delete data" ON %I', tbl);
    EXECUTE format('
      CREATE POLICY "Authenticated users can delete data"
        ON %I FOR DELETE
        TO authenticated
        USING (true);
    ', tbl);
  END LOOP;
END $$;


-- ============================================================
-- Migration: 20251220163231_remove_duplicate_rls_policies.sql
-- ============================================================

/*
  # Suppression des politiques RLS en double

  ## Problème
  - Des politiques RLS en double ont été créées
  - Les nouvelles politiques bloquent l'accès public aux données d'exemple
  - Les utilisateurs ne peuvent plus voir leurs données

  ## Solution
  - Suppression des 4 nouvelles politiques créées par erreur
  - Conservation des politiques originales qui permettent l'accès public aux données d'exemple
  
  ## Politiques supprimées
  Pour chaque table (worlds, deities, continents, etc.):
  - "Authenticated users can read all data"
  - "Authenticated users can insert own data"
  - "Authenticated users can update data"
  - "Authenticated users can delete data"
*/

-- Supprimer les politiques en double sur worlds
DROP POLICY IF EXISTS "Authenticated users can read all data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can update data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON worlds;

-- Supprimer les politiques en double sur deities
DROP POLICY IF EXISTS "Authenticated users can read all data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can update data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON deities;

-- Supprimer les politiques en double sur continents
DROP POLICY IF EXISTS "Authenticated users can read all data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can update data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON continents;

-- Supprimer les politiques en double sur countries
DROP POLICY IF EXISTS "Authenticated users can read all data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can update data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON countries;

-- Supprimer les politiques en double sur cities
DROP POLICY IF EXISTS "Authenticated users can read all data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can update data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON cities;

-- Supprimer les politiques en double sur oceans
DROP POLICY IF EXISTS "Authenticated users can read all data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can update data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON oceans;

-- Supprimer les politiques en double sur sects
DROP POLICY IF EXISTS "Authenticated users can read all data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can update data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON sects;

-- Supprimer les politiques en double sur toutes les autres tables
DROP POLICY IF EXISTS "Authenticated users can read all data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can update data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON characters;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can update data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON celestial_bodies;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can update data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON animals;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can update data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON plants;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can update data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON minerals;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can update data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON monsters;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON races;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON races;
DROP POLICY IF EXISTS "Authenticated users can update data" ON races;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON races;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can update data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON character_classes;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can update data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON class_features;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can update data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON spells;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON items;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON items;
DROP POLICY IF EXISTS "Authenticated users can update data" ON items;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON items;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can update data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON magic_items;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can update data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON potions;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can update data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON crafting_materials;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can update data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON recipes;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can update data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON guilds;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can update data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON languages;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can update data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON curses;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can update data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON diseases;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can update data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON campaigns;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can update data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON locations;



-- ============================================================
-- Migration: 20251220163845_allow_anon_access_to_sample_data.sql
-- ============================================================

/*
  # Permettre l'accès anonyme aux données d'exemple

  1. Modifications
    - Ajout de policies permettant l'accès anonyme (anon) aux données sample
    - Les utilisateurs non authentifiés peuvent maintenant voir les données où is_sample = true
    - Chaque table reçoit une policy "Lecture publique des données d'exemple"

  2. Tables concernées
    - worlds, continents, countries, cities, villages, locations, oceans
    - celestial_bodies, calendars, deities, sects
    - characters, races, character_classes, class_features, guilds, languages
    - spells, monsters
    - animals, plants, minerals, crafting_materials
    - items, magic_items, potions, recipes
    - diseases, curses
    - campaigns, encounters

  3. Sécurité
    - L'accès anonyme est limité aux données marquées is_sample = true
    - Les données utilisateur (is_sample = false) restent protégées
    - Les utilisateurs authentifiés gardent leurs accès existants
*/

CREATE POLICY "Lecture publique des données d'exemple"
  ON worlds FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON continents FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON countries FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON cities FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON villages FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON locations FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON oceans FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON celestial_bodies FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON calendars FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON deities FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON sects FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON characters FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON races FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON character_classes FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON class_features FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON guilds FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON languages FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON spells FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON monsters FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON animals FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON plants FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON minerals FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON crafting_materials FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON items FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON magic_items FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON potions FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON recipes FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON diseases FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON curses FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON campaigns FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON encounters FOR SELECT
  TO anon
  USING (is_sample = true);



-- ============================================================
-- Migration: 20251220164046_allow_anon_write_access.sql
-- ============================================================

/*
  # Permettre l'accès complet aux utilisateurs anonymes

  1. Modifications
    - Ajout de policies INSERT, UPDATE, DELETE pour les utilisateurs anonymes
    - Les utilisateurs non authentifiés peuvent maintenant créer, modifier et supprimer des données
    - Toutes les opérations CRUD sont maintenant possibles sans authentification

  2. Sécurité
    - Cette configuration est adaptée pour un prototype/MVP sans authentification
    - Pour la production, il faudra restreindre l'accès et implémenter l'authentification

  3. Tables concernées
    - Toutes les tables principales de l'application
*/

-- Worlds
CREATE POLICY "Insertion publique" ON worlds FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON worlds FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON worlds FOR DELETE TO anon USING (true);

-- Continents
CREATE POLICY "Insertion publique" ON continents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON continents FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON continents FOR DELETE TO anon USING (true);

-- Countries
CREATE POLICY "Insertion publique" ON countries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON countries FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON countries FOR DELETE TO anon USING (true);

-- Cities
CREATE POLICY "Insertion publique" ON cities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON cities FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON cities FOR DELETE TO anon USING (true);

-- Villages
CREATE POLICY "Insertion publique" ON villages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON villages FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON villages FOR DELETE TO anon USING (true);

-- Locations
CREATE POLICY "Insertion publique" ON locations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON locations FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON locations FOR DELETE TO anon USING (true);

-- Oceans
CREATE POLICY "Insertion publique" ON oceans FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON oceans FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON oceans FOR DELETE TO anon USING (true);

-- Celestial Bodies
CREATE POLICY "Insertion publique" ON celestial_bodies FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON celestial_bodies FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON celestial_bodies FOR DELETE TO anon USING (true);

-- Calendars
CREATE POLICY "Insertion publique" ON calendars FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON calendars FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON calendars FOR DELETE TO anon USING (true);

-- Deities
CREATE POLICY "Insertion publique" ON deities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON deities FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON deities FOR DELETE TO anon USING (true);

-- Sects
CREATE POLICY "Insertion publique" ON sects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON sects FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON sects FOR DELETE TO anon USING (true);

-- Characters
CREATE POLICY "Insertion publique" ON characters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON characters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON characters FOR DELETE TO anon USING (true);

-- Races
CREATE POLICY "Insertion publique" ON races FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON races FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON races FOR DELETE TO anon USING (true);

-- Character Classes
CREATE POLICY "Insertion publique" ON character_classes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON character_classes FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON character_classes FOR DELETE TO anon USING (true);

-- Class Features
CREATE POLICY "Insertion publique" ON class_features FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON class_features FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON class_features FOR DELETE TO anon USING (true);

-- Guilds
CREATE POLICY "Insertion publique" ON guilds FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON guilds FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON guilds FOR DELETE TO anon USING (true);

-- Languages
CREATE POLICY "Insertion publique" ON languages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON languages FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON languages FOR DELETE TO anon USING (true);

-- Spells
CREATE POLICY "Insertion publique" ON spells FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON spells FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON spells FOR DELETE TO anon USING (true);

-- Monsters
CREATE POLICY "Insertion publique" ON monsters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON monsters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON monsters FOR DELETE TO anon USING (true);

-- Animals
CREATE POLICY "Insertion publique" ON animals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON animals FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON animals FOR DELETE TO anon USING (true);

-- Plants
CREATE POLICY "Insertion publique" ON plants FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON plants FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON plants FOR DELETE TO anon USING (true);

-- Minerals
CREATE POLICY "Insertion publique" ON minerals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON minerals FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON minerals FOR DELETE TO anon USING (true);

-- Crafting Materials
CREATE POLICY "Insertion publique" ON crafting_materials FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON crafting_materials FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON crafting_materials FOR DELETE TO anon USING (true);

-- Items
CREATE POLICY "Insertion publique" ON items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON items FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON items FOR DELETE TO anon USING (true);

-- Magic Items
CREATE POLICY "Insertion publique" ON magic_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON magic_items FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON magic_items FOR DELETE TO anon USING (true);

-- Potions
CREATE POLICY "Insertion publique" ON potions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON potions FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON potions FOR DELETE TO anon USING (true);

-- Recipes
CREATE POLICY "Insertion publique" ON recipes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON recipes FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON recipes FOR DELETE TO anon USING (true);

-- Diseases
CREATE POLICY "Insertion publique" ON diseases FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON diseases FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON diseases FOR DELETE TO anon USING (true);

-- Curses
CREATE POLICY "Insertion publique" ON curses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON curses FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON curses FOR DELETE TO anon USING (true);

-- Campaigns
CREATE POLICY "Insertion publique" ON campaigns FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON campaigns FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON campaigns FOR DELETE TO anon USING (true);

-- Encounters
CREATE POLICY "Insertion publique" ON encounters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON encounters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON encounters FOR DELETE TO anon USING (true);

-- Campaign Characters
CREATE POLICY "Insertion publique" ON campaign_characters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON campaign_characters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON campaign_characters FOR DELETE TO anon USING (true);



-- ============================================================
-- Migration: 20251220164208_allow_anon_storage_access.sql
-- ============================================================

/*
  # Permettre l'accès au storage pour les utilisateurs anonymes

  1. Modifications
    - Ajout de policies pour permettre l'upload, la lecture, la modification et la suppression de fichiers
    - Les utilisateurs anonymes peuvent maintenant gérer les images

  2. Sécurité
    - Cette configuration est adaptée pour un prototype/MVP sans authentification
    - Pour la production, il faudra restreindre l'accès et implémenter l'authentification
*/

-- Autoriser la lecture publique des images
CREATE POLICY "Lecture publique des images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'images');

-- Autoriser l'upload public
CREATE POLICY "Upload public des images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'images');

-- Autoriser la modification publique
CREATE POLICY "Modification publique des images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'images');

-- Autoriser la suppression publique
CREATE POLICY "Suppression publique des images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'images');



-- ============================================================
-- Migration: 20251220171749_create_avatars_storage_bucket.sql
-- ============================================================

/*
  # Création du bucket de stockage pour les avatars

  1. Bucket de stockage
    - Crée le bucket `avatars` pour stocker les photos de profil des utilisateurs
    - Configuration publique pour permettre l'accès aux avatars
    - Limite de taille : 2MB par fichier
    - Types de fichiers acceptés : JPEG, PNG, GIF, WebP

  2. Politiques de sécurité (RLS)
    - Lecture publique : tout le monde peut voir les avatars
    - Upload : utilisateurs authentifiés peuvent uploader leur propre avatar
    - Update : utilisateurs authentifiés peuvent modifier leur propre avatar
    - Delete : utilisateurs authentifiés peuvent supprimer leur propre avatar
*/

-- Créer le bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');


-- ============================================================
-- Migration: 20251220235206_fix_anon_update_policies.sql
-- ============================================================

/*
  # Fix Anonymous User UPDATE Policies

  1. Problem
    - All UPDATE policies for anonymous users had `with_check: null`
    - This prevented any updates from working, even though `using: true` allowed the operation
    - Data was not being saved to the database

  2. Solution
    - Drop and recreate all UPDATE policies for anon users with proper `WITH CHECK (true)`
    - This allows anonymous users to update records in development/testing mode

  3. Tables Fixed
    - All core tables: animals, calendars, campaigns, characters, cities, etc.
    - Storage objects table for image uploads
*/

-- Drop and recreate UPDATE policies for all tables with proper WITH CHECK clause

DROP POLICY IF EXISTS "Modification publique" ON animals;
CREATE POLICY "Modification publique" ON animals FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON calendars;
CREATE POLICY "Modification publique" ON calendars FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON campaign_characters;
CREATE POLICY "Modification publique" ON campaign_characters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON campaigns;
CREATE POLICY "Modification publique" ON campaigns FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON celestial_bodies;
CREATE POLICY "Modification publique" ON celestial_bodies FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON character_classes;
CREATE POLICY "Modification publique" ON character_classes FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON characters;
CREATE POLICY "Modification publique" ON characters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON cities;
CREATE POLICY "Modification publique" ON cities FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON class_features;
CREATE POLICY "Modification publique" ON class_features FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON continents;
CREATE POLICY "Modification publique" ON continents FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON countries;
CREATE POLICY "Modification publique" ON countries FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON crafting_materials;
CREATE POLICY "Modification publique" ON crafting_materials FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON curses;
CREATE POLICY "Modification publique" ON curses FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON diseases;
CREATE POLICY "Modification publique" ON diseases FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON encounters;
CREATE POLICY "Modification publique" ON encounters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON guilds;
CREATE POLICY "Modification publique" ON guilds FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON items;
CREATE POLICY "Modification publique" ON items FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON languages;
CREATE POLICY "Modification publique" ON languages FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON locations;
CREATE POLICY "Modification publique" ON locations FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON magic_items;
CREATE POLICY "Modification publique" ON magic_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON minerals;
CREATE POLICY "Modification publique" ON minerals FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON monsters;
CREATE POLICY "Modification publique" ON monsters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON oceans;
CREATE POLICY "Modification publique" ON oceans FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON plants;
CREATE POLICY "Modification publique" ON plants FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON potions;
CREATE POLICY "Modification publique" ON potions FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON races;
CREATE POLICY "Modification publique" ON races FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON recipes;
CREATE POLICY "Modification publique" ON recipes FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON sects;
CREATE POLICY "Modification publique" ON sects FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON spells;
CREATE POLICY "Modification publique" ON spells FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON villages;
CREATE POLICY "Modification publique" ON villages FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON worlds;
CREATE POLICY "Modification publique" ON worlds FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Fix storage objects policy
DROP POLICY IF EXISTS "Modification publique des images" ON storage.objects;
CREATE POLICY "Modification publique des images" ON storage.objects FOR UPDATE TO anon USING (true) WITH CHECK (true);


