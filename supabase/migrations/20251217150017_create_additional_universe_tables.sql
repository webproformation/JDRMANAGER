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
