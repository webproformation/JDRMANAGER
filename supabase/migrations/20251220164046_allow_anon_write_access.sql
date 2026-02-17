/*
  # Permettre l'accès complet aux utilisateurs anonymes

  1. Modifications
    - Ajout de policies INSERT, UPDATE, DELETE pour les utilisateurs anonymes
    - Les utilisateurs non authentifiés peuvent maintenant créer, modifier et supprimer des données
    - Toutes les opérations CRUD sont maintenant possibles sans authentification

  2. Sécurité
    - Cette configuration est adaptée pour un prototype/MVP sans authentification
    - Pour la production, il faudra restreindre l'accès et implémenter l'authentification

  3. Tables concernées
    - Toutes les tables principales de l'application
*/

-- Worlds
CREATE POLICY "Insertion publique" ON worlds FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON worlds FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON worlds FOR DELETE TO anon USING (true);

-- Continents
CREATE POLICY "Insertion publique" ON continents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON continents FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON continents FOR DELETE TO anon USING (true);

-- Countries
CREATE POLICY "Insertion publique" ON countries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON countries FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON countries FOR DELETE TO anon USING (true);

-- Cities
CREATE POLICY "Insertion publique" ON cities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON cities FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON cities FOR DELETE TO anon USING (true);

-- Villages
CREATE POLICY "Insertion publique" ON villages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON villages FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON villages FOR DELETE TO anon USING (true);

-- Locations
CREATE POLICY "Insertion publique" ON locations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON locations FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON locations FOR DELETE TO anon USING (true);

-- Oceans
CREATE POLICY "Insertion publique" ON oceans FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON oceans FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON oceans FOR DELETE TO anon USING (true);

-- Celestial Bodies
CREATE POLICY "Insertion publique" ON celestial_bodies FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON celestial_bodies FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON celestial_bodies FOR DELETE TO anon USING (true);

-- Calendars
CREATE POLICY "Insertion publique" ON calendars FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON calendars FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON calendars FOR DELETE TO anon USING (true);

-- Deities
CREATE POLICY "Insertion publique" ON deities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON deities FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON deities FOR DELETE TO anon USING (true);

-- Sects
CREATE POLICY "Insertion publique" ON sects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON sects FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON sects FOR DELETE TO anon USING (true);

-- Characters
CREATE POLICY "Insertion publique" ON characters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON characters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON characters FOR DELETE TO anon USING (true);

-- Races
CREATE POLICY "Insertion publique" ON races FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON races FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON races FOR DELETE TO anon USING (true);

-- Character Classes
CREATE POLICY "Insertion publique" ON character_classes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON character_classes FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON character_classes FOR DELETE TO anon USING (true);

-- Class Features
CREATE POLICY "Insertion publique" ON class_features FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON class_features FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON class_features FOR DELETE TO anon USING (true);

-- Guilds
CREATE POLICY "Insertion publique" ON guilds FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON guilds FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON guilds FOR DELETE TO anon USING (true);

-- Languages
CREATE POLICY "Insertion publique" ON languages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON languages FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON languages FOR DELETE TO anon USING (true);

-- Spells
CREATE POLICY "Insertion publique" ON spells FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON spells FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON spells FOR DELETE TO anon USING (true);

-- Monsters
CREATE POLICY "Insertion publique" ON monsters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON monsters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON monsters FOR DELETE TO anon USING (true);

-- Animals
CREATE POLICY "Insertion publique" ON animals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON animals FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON animals FOR DELETE TO anon USING (true);

-- Plants
CREATE POLICY "Insertion publique" ON plants FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON plants FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON plants FOR DELETE TO anon USING (true);

-- Minerals
CREATE POLICY "Insertion publique" ON minerals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON minerals FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON minerals FOR DELETE TO anon USING (true);

-- Crafting Materials
CREATE POLICY "Insertion publique" ON crafting_materials FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON crafting_materials FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON crafting_materials FOR DELETE TO anon USING (true);

-- Items
CREATE POLICY "Insertion publique" ON items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON items FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON items FOR DELETE TO anon USING (true);

-- Magic Items
CREATE POLICY "Insertion publique" ON magic_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON magic_items FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON magic_items FOR DELETE TO anon USING (true);

-- Potions
CREATE POLICY "Insertion publique" ON potions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON potions FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON potions FOR DELETE TO anon USING (true);

-- Recipes
CREATE POLICY "Insertion publique" ON recipes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON recipes FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON recipes FOR DELETE TO anon USING (true);

-- Diseases
CREATE POLICY "Insertion publique" ON diseases FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON diseases FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON diseases FOR DELETE TO anon USING (true);

-- Curses
CREATE POLICY "Insertion publique" ON curses FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON curses FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON curses FOR DELETE TO anon USING (true);

-- Campaigns
CREATE POLICY "Insertion publique" ON campaigns FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON campaigns FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON campaigns FOR DELETE TO anon USING (true);

-- Encounters
CREATE POLICY "Insertion publique" ON encounters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON encounters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON encounters FOR DELETE TO anon USING (true);

-- Campaign Characters
CREATE POLICY "Insertion publique" ON campaign_characters FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Modification publique" ON campaign_characters FOR UPDATE TO anon USING (true);
CREATE POLICY "Suppression publique" ON campaign_characters FOR DELETE TO anon USING (true);
