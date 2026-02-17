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