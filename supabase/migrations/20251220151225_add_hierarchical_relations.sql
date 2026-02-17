/*
  # Add Hierarchical Relations Between Entities

  ## Overview
  This migration adds the missing foreign key relationships to create a complete
  hierarchical structure for worldbuilding elements.

  ## New Relationships Added

  1. **Oceans and Sects**
    - Add `world_id` to both tables to link them to specific worlds

  2. **Countries**
    - Add `ocean_id` to allow countries to belong to an ocean/sea instead of a continent

  3. **Locations**
    - Add `country_id` to link locations (villages, cities, etc.) to countries

  ## Foreign Keys
  All new foreign key relationships use ON DELETE SET NULL to preserve data
  when parent records are deleted.

  ## Security
  - All tables already have RLS enabled from previous migrations
  - No changes to existing RLS policies needed
*/

-- Add world_id to oceans table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'oceans' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE oceans 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_oceans_world_id ON oceans(world_id);
  END IF;
END $$;

-- Add world_id to sects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sects' AND column_name = 'world_id'
  ) THEN
    ALTER TABLE sects 
    ADD COLUMN world_id uuid REFERENCES worlds(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_sects_world_id ON sects(world_id);
  END IF;
END $$;

-- Add ocean_id to countries table (countries can be on continents OR oceans/seas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'ocean_id'
  ) THEN
    ALTER TABLE countries 
    ADD COLUMN ocean_id uuid REFERENCES oceans(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_countries_ocean_id ON countries(ocean_id);
  END IF;
END $$;

-- Add country_id to locations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE locations 
    ADD COLUMN country_id uuid REFERENCES countries(id) ON DELETE SET NULL;
    
    CREATE INDEX IF NOT EXISTS idx_locations_country_id ON locations(country_id);
  END IF;
END $$;

-- Add comment to document the hierarchical structure
COMMENT ON TABLE worlds IS 'Root level: All elements belong to a world';
COMMENT ON TABLE continents IS 'Level 2: Continents belong to worlds';
COMMENT ON TABLE oceans IS 'Level 2: Oceans/seas belong to worlds';
COMMENT ON TABLE countries IS 'Level 3: Countries belong to continents OR oceans';
COMMENT ON TABLE cities IS 'Level 4: Cities belong to countries';
COMMENT ON TABLE locations IS 'Level 4: Locations (villages, landmarks) belong to countries';
