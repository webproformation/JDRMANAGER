-- ============================================================
-- FIX: Correction de la policy UPDATE pour deities
-- Cette policy manquait dans la migration précédente
-- ============================================================

-- Supprimer l'ancienne policy UPDATE qui ne fonctionnait pas
DROP POLICY IF EXISTS "Modification publique" ON deities;

-- Recréer la policy avec USING et WITH CHECK
CREATE POLICY "Modification publique" ON deities
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Vérifier les policies existantes pour deities
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'deities'
ORDER BY cmd, policyname;
