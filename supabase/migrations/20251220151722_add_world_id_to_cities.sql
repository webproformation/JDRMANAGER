/*
  # Add world_id to cities table

  ## Overview
  Cities currently only have country_id, but they should also have
  a direct link to their world for easier filtering.

  ## Changes
  - Add world_id column to cities table
  - Add index for performance

  ## Notes
  This column is optional (nullable) as existing data may not have this information.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cities' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE cities 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_cities_world_id ON cities(world_id);
  END IF;
END $$;
