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