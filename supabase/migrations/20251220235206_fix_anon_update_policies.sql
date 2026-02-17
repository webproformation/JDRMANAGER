/*
  # Fix Anonymous User UPDATE Policies

  1. Problem
    - All UPDATE policies for anonymous users had `with_check: null`
    - This prevented any updates from working, even though `using: true` allowed the operation
    - Data was not being saved to the database

  2. Solution
    - Drop and recreate all UPDATE policies for anon users with proper `WITH CHECK (true)`
    - This allows anonymous users to update records in development/testing mode

  3. Tables Fixed
    - All core tables: animals, calendars, campaigns, characters, cities, etc.
    - Storage objects table for image uploads
*/

-- Drop and recreate UPDATE policies for all tables with proper WITH CHECK clause

DROP POLICY IF EXISTS "Modification publique" ON animals;
CREATE POLICY "Modification publique" ON animals FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON calendars;
CREATE POLICY "Modification publique" ON calendars FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON campaign_characters;
CREATE POLICY "Modification publique" ON campaign_characters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON campaigns;
CREATE POLICY "Modification publique" ON campaigns FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON celestial_bodies;
CREATE POLICY "Modification publique" ON celestial_bodies FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON character_classes;
CREATE POLICY "Modification publique" ON character_classes FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON characters;
CREATE POLICY "Modification publique" ON characters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON cities;
CREATE POLICY "Modification publique" ON cities FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON class_features;
CREATE POLICY "Modification publique" ON class_features FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON continents;
CREATE POLICY "Modification publique" ON continents FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON countries;
CREATE POLICY "Modification publique" ON countries FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON crafting_materials;
CREATE POLICY "Modification publique" ON crafting_materials FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON curses;
CREATE POLICY "Modification publique" ON curses FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON deities;
CREATE POLICY "Modification publique" ON deities FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON diseases;
CREATE POLICY "Modification publique" ON diseases FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON encounters;
CREATE POLICY "Modification publique" ON encounters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON guilds;
CREATE POLICY "Modification publique" ON guilds FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON items;
CREATE POLICY "Modification publique" ON items FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON languages;
CREATE POLICY "Modification publique" ON languages FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON locations;
CREATE POLICY "Modification publique" ON locations FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON magic_items;
CREATE POLICY "Modification publique" ON magic_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON minerals;
CREATE POLICY "Modification publique" ON minerals FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON monsters;
CREATE POLICY "Modification publique" ON monsters FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON oceans;
CREATE POLICY "Modification publique" ON oceans FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON plants;
CREATE POLICY "Modification publique" ON plants FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON potions;
CREATE POLICY "Modification publique" ON potions FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON races;
CREATE POLICY "Modification publique" ON races FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON recipes;
CREATE POLICY "Modification publique" ON recipes FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON sects;
CREATE POLICY "Modification publique" ON sects FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON spells;
CREATE POLICY "Modification publique" ON spells FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON villages;
CREATE POLICY "Modification publique" ON villages FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Modification publique" ON worlds;
CREATE POLICY "Modification publique" ON worlds FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Fix storage objects policy
DROP POLICY IF EXISTS "Modification publique des images" ON storage.objects;
CREATE POLICY "Modification publique des images" ON storage.objects FOR UPDATE TO anon USING (true) WITH CHECK (true);