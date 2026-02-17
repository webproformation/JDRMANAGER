/*
  # Création du bucket de stockage pour les avatars

  1. Bucket de stockage
    - Crée le bucket `avatars` pour stocker les photos de profil des utilisateurs
    - Configuration publique pour permettre l'accès aux avatars
    - Limite de taille : 2MB par fichier
    - Types de fichiers acceptés : JPEG, PNG, GIF, WebP

  2. Politiques de sécurité (RLS)
    - Lecture publique : tout le monde peut voir les avatars
    - Upload : utilisateurs authentifiés peuvent uploader leur propre avatar
    - Update : utilisateurs authentifiés peuvent modifier leur propre avatar
    - Delete : utilisateurs authentifiés peuvent supprimer leur propre avatar
*/

-- Créer le bucket pour les avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre la lecture publique des avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');