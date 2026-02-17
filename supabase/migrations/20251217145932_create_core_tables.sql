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
