/*
  # Ajouter des champs réservés au MJ pour les déités
  
  ## Description
  Ajoute des champs spéciaux pour les maîtres de jeu (Game Masters) permettant
  de stocker des informations secrètes sur les déités qui ne sont pas destinées
  aux joueurs.
  
  ## Nouveaux champs
  - `gm_notes` (text) - Notes secrètes du MJ sur la divinité
  - `gm_secret_plots` (text) - Plans secrets de la divinité
  - `gm_conspiracies` (text) - Conspirations et intrigues secrètes
  - `gm_secret_images` (jsonb) - Galerie d'images secrètes (structure similaire à deity_images)
  
  ## Sécurité
  Ces champs sont accessibles à tous pour le moment (anon access), mais dans
  une future version, ils pourront être restreints aux administrateurs uniquement.
*/

-- Ajouter les champs réservés au MJ
ALTER TABLE deities 
ADD COLUMN IF NOT EXISTS gm_notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gm_secret_plots text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gm_conspiracies text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS gm_secret_images jsonb DEFAULT '{"plots": [], "secrets": [], "future_events": [], "hidden_aspects": []}'::jsonb;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN deities.gm_notes IS 'Notes secrètes du MJ sur la divinité (non visibles par les joueurs)';
COMMENT ON COLUMN deities.gm_secret_plots IS 'Plans secrets et machinations de la divinité';
COMMENT ON COLUMN deities.gm_conspiracies IS 'Conspirations et intrigues impliquant la divinité';
COMMENT ON COLUMN deities.gm_secret_images IS 'Images secrètes réservées au MJ (structure: plots, secrets, future_events, hidden_aspects)';
