-- ============================================================
-- INSERTION DE DONNÉES DE TEST POUR DEITIES
-- Copiez ce SQL dans le SQL Editor et exécutez-le
-- ============================================================

-- Insérer la déité "Majere" avec l'ID spécifique attendu par les tests
INSERT INTO deities (
    id,
    name,
    pantheon,
    description,
    alignment,
    domains,
    symbol,
    is_sample,
    created_at,
    updated_at
) VALUES (
    '2ee53f59-3bd7-44a4-9feb-582a02cc202f',
    'Majere',
    'Krynn',
    'Majere the Mantis, god of meditation and thought',
    'Lawful Good',
    ARRAY['Knowledge', 'Order', 'Peace'],
    'A copper spider',
    true,
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Insérer quelques autres déités pour tester
INSERT INTO deities (
    name,
    pantheon,
    description,
    alignment,
    domains,
    symbol,
    is_sample,
    created_at,
    updated_at
) VALUES
(
    'Paladine',
    'Krynn',
    'Paladine the Platinum Dragon, god of rulers and guardians',
    'Lawful Good',
    ARRAY['Life', 'War', 'Light'],
    'A silver triangle',
    true,
    now(),
    now()
),
(
    'Takhisis',
    'Krynn',
    'Takhisis the Dragon Queen, goddess of night and hatred',
    'Lawful Evil',
    ARRAY['Death', 'War', 'Trickery'],
    'A five-headed dragon',
    true,
    now(),
    now()
),
(
    'Gilean',
    'Krynn',
    'Gilean the Grey, god of knowledge and balance',
    'Neutral',
    ARRAY['Knowledge', 'Arcana'],
    'An open book',
    true,
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Vérifier les insertions
SELECT id, name, pantheon, alignment FROM deities ORDER BY name;
