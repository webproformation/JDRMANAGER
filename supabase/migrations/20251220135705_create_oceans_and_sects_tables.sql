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
