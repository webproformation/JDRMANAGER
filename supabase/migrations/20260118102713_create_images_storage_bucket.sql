/*
  # Création du bucket de stockage 'images'

  1. Nouveau bucket
    - Crée le bucket `images` pour stocker toutes les images des entités
    - Configuration publique pour permettre l'accès aux images
    - Limite de taille : 5MB par fichier
    - Types MIME autorisés : jpeg, jpg, png, gif, webp

  2. Politiques de sécurité
    - Lecture publique : tout le monde peut voir les images (anon + authenticated)
    - Upload : accessible aux utilisateurs anonymes et authentifiés
    - Update/Delete : accessible aux utilisateurs anonymes et authentifiés

  Note: Cette configuration permet l'accès complet pour le développement/prototype
*/

-- Créer le bucket 'images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Lecture publique des images" ON storage.objects;
DROP POLICY IF EXISTS "Upload public des images" ON storage.objects;
DROP POLICY IF EXISTS "Modification publique des images" ON storage.objects;
DROP POLICY IF EXISTS "Suppression publique des images" ON storage.objects;

-- Politique pour permettre la lecture publique (anon + authenticated + public)
CREATE POLICY "Lecture publique des images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Politique pour permettre l'upload (anon + authenticated)
CREATE POLICY "Upload public des images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- Politique pour permettre la mise à jour (anon + authenticated)
CREATE POLICY "Modification publique des images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Politique pour permettre la suppression (anon + authenticated)
CREATE POLICY "Suppression publique des images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');