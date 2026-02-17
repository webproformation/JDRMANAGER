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
