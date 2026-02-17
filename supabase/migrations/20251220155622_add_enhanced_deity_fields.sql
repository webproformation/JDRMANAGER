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