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
