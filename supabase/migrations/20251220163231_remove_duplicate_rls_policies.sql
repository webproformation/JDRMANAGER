/*
  # Suppression des politiques RLS en double

  ## Problème
  - Des politiques RLS en double ont été créées
  - Les nouvelles politiques bloquent l'accès public aux données d'exemple
  - Les utilisateurs ne peuvent plus voir leurs données

  ## Solution
  - Suppression des 4 nouvelles politiques créées par erreur
  - Conservation des politiques originales qui permettent l'accès public aux données d'exemple
  
  ## Politiques supprimées
  Pour chaque table (worlds, deities, continents, etc.):
  - "Authenticated users can read all data"
  - "Authenticated users can insert own data"
  - "Authenticated users can update data"
  - "Authenticated users can delete data"
*/

-- Supprimer les politiques en double sur worlds
DROP POLICY IF EXISTS "Authenticated users can read all data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can update data" ON worlds;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON worlds;

-- Supprimer les politiques en double sur deities
DROP POLICY IF EXISTS "Authenticated users can read all data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can update data" ON deities;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON deities;

-- Supprimer les politiques en double sur continents
DROP POLICY IF EXISTS "Authenticated users can read all data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can update data" ON continents;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON continents;

-- Supprimer les politiques en double sur countries
DROP POLICY IF EXISTS "Authenticated users can read all data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can update data" ON countries;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON countries;

-- Supprimer les politiques en double sur cities
DROP POLICY IF EXISTS "Authenticated users can read all data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can update data" ON cities;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON cities;

-- Supprimer les politiques en double sur oceans
DROP POLICY IF EXISTS "Authenticated users can read all data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can update data" ON oceans;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON oceans;

-- Supprimer les politiques en double sur sects
DROP POLICY IF EXISTS "Authenticated users can read all data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can update data" ON sects;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON sects;

-- Supprimer les politiques en double sur toutes les autres tables
DROP POLICY IF EXISTS "Authenticated users can read all data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can update data" ON characters;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON characters;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can update data" ON celestial_bodies;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON celestial_bodies;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can update data" ON animals;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON animals;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can update data" ON plants;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON plants;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can update data" ON minerals;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON minerals;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can update data" ON monsters;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON monsters;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON races;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON races;
DROP POLICY IF EXISTS "Authenticated users can update data" ON races;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON races;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can update data" ON character_classes;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON character_classes;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can update data" ON class_features;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON class_features;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can update data" ON spells;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON spells;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON items;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON items;
DROP POLICY IF EXISTS "Authenticated users can update data" ON items;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON items;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can update data" ON magic_items;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON magic_items;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can update data" ON potions;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON potions;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can update data" ON crafting_materials;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON crafting_materials;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can update data" ON recipes;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON recipes;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can update data" ON guilds;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON guilds;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can update data" ON languages;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON languages;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can update data" ON curses;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON curses;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can update data" ON diseases;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON diseases;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can update data" ON campaigns;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON campaigns;

DROP POLICY IF EXISTS "Authenticated users can read all data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can insert own data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can update data" ON locations;
DROP POLICY IF EXISTS "Authenticated users can delete data" ON locations;
