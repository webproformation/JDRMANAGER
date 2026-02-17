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
