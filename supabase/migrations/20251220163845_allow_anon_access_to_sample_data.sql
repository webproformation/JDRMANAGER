/*
  # Permettre l'accès anonyme aux données d'exemple

  1. Modifications
    - Ajout de policies permettant l'accès anonyme (anon) aux données sample
    - Les utilisateurs non authentifiés peuvent maintenant voir les données où is_sample = true
    - Chaque table reçoit une policy "Lecture publique des données d'exemple"

  2. Tables concernées
    - worlds, continents, countries, cities, villages, locations, oceans
    - celestial_bodies, calendars, deities, sects
    - characters, races, character_classes, class_features, guilds, languages
    - spells, monsters
    - animals, plants, minerals, crafting_materials
    - items, magic_items, potions, recipes
    - diseases, curses
    - campaigns, encounters

  3. Sécurité
    - L'accès anonyme est limité aux données marquées is_sample = true
    - Les données utilisateur (is_sample = false) restent protégées
    - Les utilisateurs authentifiés gardent leurs accès existants
*/

CREATE POLICY "Lecture publique des données d'exemple"
  ON worlds FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON continents FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON countries FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON cities FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON villages FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON locations FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON oceans FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON celestial_bodies FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON calendars FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON deities FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON sects FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON characters FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON races FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON character_classes FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON class_features FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON guilds FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON languages FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON spells FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON monsters FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON animals FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON plants FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON minerals FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON crafting_materials FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON items FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON magic_items FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON potions FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON recipes FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON diseases FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON curses FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON campaigns FOR SELECT
  TO anon
  USING (is_sample = true);

CREATE POLICY "Lecture publique des données d'exemple"
  ON encounters FOR SELECT
  TO anon
  USING (is_sample = true);
