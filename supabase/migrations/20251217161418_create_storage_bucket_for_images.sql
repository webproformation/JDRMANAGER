/*
  # Création du bucket de stockage pour les images

  1. Bucket de stockage
    - Crée le bucket `entity-images` pour stocker toutes les images des entités
    - Configuration publique pour permettre l'accès aux images

  2. Politiques de sécurité
    - Lecture publique : tout le monde peut voir les images
    - Upload/Update/Delete : réservé aux utilisateurs authentifiés
    - Les utilisateurs peuvent gérer toutes les images (pas de restriction par utilisateur)
*/

-- Créer le bucket pour les images des entités
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entity-images',
  'entity-images',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Politique pour permettre la lecture publique
CREATE POLICY "Public access to images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'entity-images');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'entity-images');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'entity-images')
WITH CHECK (bucket_id = 'entity-images');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'entity-images');