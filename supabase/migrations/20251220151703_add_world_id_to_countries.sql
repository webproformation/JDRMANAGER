/*
  # Add world_id to countries table

  ## Overview
  Countries previously only had continent_id and ocean_id, but they also
  need to belong to a specific world for consistency.

  ## Changes
  - Add world_id column to countries table
  - Add index for performance

  ## Notes
  This column is optional (nullable) as existing data may not have this information.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE countries 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_countries_world_id ON countries(world_id);
  END IF;
END $$;
