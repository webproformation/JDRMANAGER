/*
  # Permettre l'accès au storage pour les utilisateurs anonymes

  1. Modifications
    - Ajout de policies pour permettre l'upload, la lecture, la modification et la suppression de fichiers
    - Les utilisateurs anonymes peuvent maintenant gérer les images

  2. Sécurité
    - Cette configuration est adaptée pour un prototype/MVP sans authentification
    - Pour la production, il faudra restreindre l'accès et implémenter l'authentification
*/

-- Autoriser la lecture publique des images
CREATE POLICY "Lecture publique des images"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'images');

-- Autoriser l'upload public
CREATE POLICY "Upload public des images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'images');

-- Autoriser la modification publique
CREATE POLICY "Modification publique des images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'images');

-- Autoriser la suppression publique
CREATE POLICY "Suppression publique des images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'images');
