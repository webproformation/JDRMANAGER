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
