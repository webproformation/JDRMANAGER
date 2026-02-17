# Guide d'enrichissement des entités

Ce document explique comment standardiser et enrichir toutes les entités de votre application avec une charte graphique cohérente et des champs exhaustifs.

## Architecture du système

Le système utilise deux composants réutilisables :

1. **EnhancedEntityForm** - Formulaire avec onglets et galeries d'images
2. **EnhancedEntityDetail** - Vue détaillée avec onglets et présentation riche

## Exemple complet : Mondes (Worlds)

Le fichier `/src/pages/WorldsPage.jsx` sert d'exemple de référence complet.

### Structure de configuration

```javascript
const worldsConfig = {
  entityName: 'le monde',        // Utilisé dans les titres
  tableName: 'worlds',           // Nom de la table Supabase
  title: 'Mondes',               // Titre affiché

  // Fonction pour obtenir l'icône du header (basée sur les données)
  getHeaderIcon: () => Globe,

  // Fonction pour obtenir la couleur du header
  getHeaderColor: () => 'from-blue-500/30 via-purple-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',                    // Nom du champ en base
          label: 'Nom du monde',           // Label affiché
          type: 'text',                    // Type de champ
          required: true,                  // Champ requis ?
          placeholder: 'Ex: Terrae...'     // Texte d'aide
        },
        // ... autres champs
      ]
    },
    // ... autres onglets
  ]
};
```

### Types de champs disponibles

#### 1. Champs de texte
```javascript
{ name: 'name', label: 'Nom', type: 'text', required: true }
{ name: 'description', label: 'Description', type: 'textarea', rows: 6 }
{ name: 'population', label: 'Population', type: 'number' }
```

#### 2. Champs de sélection
```javascript
{
  name: 'size',
  label: 'Taille',
  type: 'select',
  options: [
    { value: 'small', label: 'Petit' },
    { value: 'medium', label: 'Moyen' },
    { value: 'large', label: 'Grand' }
  ]
}
```

#### 3. Relations
```javascript
{
  name: 'world_id',
  label: 'Monde',
  type: 'relation',
  table: 'worlds',
  placeholder: 'Sélectionner un monde'
}
```

#### 4. Images
```javascript
{
  name: 'image_url',
  label: 'Image',
  type: 'image',
  description: 'Image principale'
}
```

#### 5. Galeries d'images
```javascript
{
  name: 'entity_images',
  label: 'Galerie',
  type: 'images',
  bucket: 'images',
  categories: [
    { id: 'maps', label: 'Cartes' },
    { id: 'landscapes', label: 'Paysages' },
    { id: 'cities', label: 'Cités' }
  ]
}
```

## Champs recommandés par type d'entité

### Univers de Jeux

#### MONDES (Worlds) ✓ Fait
- Onglets : Général, Géographie, Magie, Civilisation, Histoire, Galerie, Notes MJ
- Champs : 45+ champs couvrant tous les aspects
- Images : Cartes, paysages, cités, monuments

#### CORPS CÉLESTES (CelestialBodies)
- Onglets : Général, Astronomie, Astrologie, Mythologie, Galerie
- Champs suggérés :
  - subtitle, diameter, mass, orbital_period_days, rotation_period
  - atmosphere, temperature, moons, rings
  - mythology, astrological_houses, zodiac_influence
  - celestial_events, divination_uses
  - body_images (observation, phases, eclipses, charts)
  - gm_secrets

#### CALENDRIERS (Calendars)
- Onglets : Général, Structure temporelle, Événements, Galerie
- Champs suggérés :
  - subtitle, months_per_year, weeks_per_month
  - month_names, day_names, day_names_week
  - holidays, festivals, seasons_description
  - lunar_cycles, special_dates, timekeeping_methods
  - calendar_images (charts, celebrations, seasons)

### Géographie (Peuples > Géographie)

#### CONTINENTS
- Onglets : Général, Géographie physique, Faune & Flore, Culture, Histoire, Galerie
- Champs suggérés :
  - subtitle, area, terrain_description
  - major_rivers, mountain_ranges, forests, deserts
  - resources, fauna, flora
  - cultures, languages_spoken, religions
  - historical_significance, legends, current_events
  - continent_images (maps, landscapes, landmarks, wildlife)

#### PAYS (Countries)
- Onglets : Général, Géographie, Politique, Économie, Culture, Histoire, Galerie
- Champs suggérés :
  - subtitle, area, climate_description, terrain
  - government_structure, laws, military_strength, alliances, enemies
  - trade_goods, imports, exports, economy
  - cultural_practices, festivals, cuisine, art_style, education_system
  - founding_date, major_wars, historical_figures
  - country_images (flag, cities, landmarks, culture)

#### CITÉS (Cities)
- Onglets : Général, Infrastructure, Quartiers, Économie, Société, Galerie
- Champs suggérés :
  - subtitle, area, founded, architecture
  - defenses, water_supply, sanitation
  - landmarks, temples, guildhalls, markets, inns_taverns
  - economy, demographics, social_classes
  - crime_rate, factions
  - city_images (aerial, districts, landmarks, life)

### Peuples

#### RACES
- Onglets : Général, Traits physiques, Culture, Société, Capacités, Galerie
- Champs suggérés :
  - subtitle, lifespan, height_range, weight_range
  - physical_description, appearance_variations
  - cultural_traits, society_structure, naming_conventions
  - religion_practices, homeland, settlements
  - relations_with_other_races, famous_members
  - racial_abilities
  - race_images (full-body, variants, cultural, homeland)

### Éléments du Monde

#### ANIMAUX
- Onglets : Général, Caractéristiques physiques, Écologie, Comportement, Utilisation, Galerie
- Champs suggérés :
  - subtitle, scientific_name, conservation_status
  - lifespan, weight_range, height_length, coloration, physical_features
  - habitat_description, diet_description, hunting_methods
  - reproduction, social_structure, communication
  - natural_predators, natural_prey, migration_patterns
  - training_difficulty, domesticable, rideable
  - market_value, leather_quality, meat_quality
  - animal_images (full-body, head, habitat, behavior)

#### PLANTES
- Onglets : Général, Botanique, Culture, Alchimie, Médecine, Galerie
- Champs suggérés :
  - subtitle, scientific_name
  - growth_rate, size_mature, lifespan
  - flowering_season, fruiting_season, pollination
  - soil_requirements, water_needs, sunlight_needs
  - companions, pests, diseases, cultivation_difficulty
  - alchemical_properties, medicinal_uses, culinary_uses, magical_uses
  - parts_used, harvest_difficulty, preparation
  - toxicity_level, poisonous_parts, antidotes
  - plant_images (flower, fruit, specimen, habitat)

#### MINÉRAUX
- Onglets : Général, Propriétés physiques, Extraction, Magie, Utilisation, Galerie
- Champs suggérés :
  - subtitle, chemical_formula, crystal_system
  - mohs_hardness, specific_gravity, color_variations
  - luster, transparency, fracture, cleavage, streak
  - geological_formations, mining_locations
  - mining_techniques, extraction_difficulty, refinement_process
  - magical_conductivity, enchantment_affinity, magical_resonance
  - industrial_uses, construction_uses, jewelry_uses
  - extraction_dangers, handling_precautions
  - mineral_images (raw, cut, magical, formation)

#### MONSTRES
- Onglets : Général, Statistiques, Combat, Écologie, Trésor, Lore, Galerie, Tactiques MJ
- Champs suggérés :
  - subtitle, size, type, alignment
  - armor_class, hit_points, speed, abilities
  - intelligence, senses, languages_known, skills
  - saving_throws, vulnerabilities, resistances, immunities
  - actions, legendary_actions, lair_actions, regional_effects
  - habitat_description, behavior_patterns, diet, reproduction, lifespan
  - social_structure, treasure_typical
  - lore, variants, encounter_tips
  - monster_images (full-body, action, lair, variants)
  - gm_tactics

## Application du système à une entité

### Étape 1 : Analyser l'entité existante

1. Ouvrir le fichier de la page (ex: `/src/pages/AnimalsPage.jsx`)
2. Noter les champs actuels dans le tableau `fields`
3. Identifier ce qui manque pour une description exhaustive

### Étape 2 : Créer la configuration enrichie

1. Copier la structure de `worldsConfig` depuis WorldsPage.jsx
2. Adapter :
   - `entityName`, `tableName`, `title`
   - `getHeaderIcon` et `getHeaderColor`
3. Organiser les champs en onglets logiques
4. Ajouter les champs manquants

### Étape 3 : Remplacer les composants

```javascript
// ANCIEN
import EntityForm from '../components/EntityForm';
import EntityDetail from '../components/EntityDetail';

// NOUVEAU
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
```

### Étape 4 : Adapter les handlers

```javascript
const [refreshKey, setRefreshKey] = useState(0);

const handleSuccess = () => {
  setRefreshKey(prev => prev + 1);
  setShowForm(false);
  setEditingItem(null);
  setSelectedItem(null);
};

const handleDelete = async () => {
  if (!selectedItem || !confirm('Êtes-vous sûr ?')) return;
  const { supabase } = await import('../lib/supabase');
  await supabase.from('table_name').delete().eq('id', selectedItem.id);
  setSelectedItem(null);
  setRefreshKey(prev => prev + 1);
};
```

### Étape 5 : Mettre à jour le JSX

```javascript
return (
  <>
    <EntityList
      key={refreshKey}
      tableName="table_name"
      title="Entités"
      onView={handleView}
      onEdit={handleEdit}
      onCreate={handleCreate}
    />

    <EnhancedEntityDetail
      isOpen={!!selectedItem}
      onClose={() => setSelectedItem(null)}
      onEdit={() => handleEdit(selectedItem)}
      onDelete={handleDelete}
      item={selectedItem}
      config={entityConfig}
    />

    <EnhancedEntityForm
      isOpen={showForm}
      onClose={() => {
        setShowForm(false);
        setEditingItem(null);
      }}
      onSuccess={handleSuccess}
      item={editingItem}
      config={entityConfig}
    />
  </>
);
```

## Ajout de champs en base de données

Les nouveaux champs doivent être ajoutés via des migrations Supabase :

```sql
DO $$ BEGIN
  ALTER TABLE table_name ADD COLUMN IF NOT EXISTS field_name text;
  ALTER TABLE table_name ADD COLUMN IF NOT EXISTS numeric_field numeric;
  ALTER TABLE table_name ADD COLUMN IF NOT EXISTS json_field jsonb DEFAULT '{}'::jsonb;
END $$;
```

Pour les images JSON, utilisez:
```sql
entity_images jsonb DEFAULT '{}'::jsonb
```

Structure recommandée pour les images:
```json
{
  "category1": ["url1", "url2"],
  "category2": ["url3"],
  "category3": []
}
```

## Icônes recommandées (lucide-react)

### Univers
- Globe, Map, Sparkles, Moon, Sun, Star, Cloud

### Géographie
- Mountain, Waves, Trees, MapPin, Compass

### Peuples & Races
- Users, User, Crown, Shield, Sword

### Nature
- Leaf, Flower, Bug, Fish, Bird

### Objets
- Package, Diamond, Gem, Scroll, Book

### Magie
- Wand, Sparkles, Zap, Eye, Crystal

## Bonnes pratiques

### Organisation des onglets
1. **Général** - Toujours en premier (nom, image, description)
2. **Caractéristiques principales** - Selon le type d'entité
3. **Informations détaillées** - Onglets thématiques
4. **Galerie d'images** - Avant-dernier
5. **Notes MJ** - Toujours en dernier

### Nombre de champs par onglet
- Minimum : 3 champs
- Optimal : 4-7 champs
- Maximum : 10 champs

Si un onglet dépasse 10 champs, le subdiviser.

### Nommage
- Champs en anglais en snake_case pour la base : `magic_level`
- Labels en français avec majuscules : `Niveau de magie`
- IDs d'onglets en anglais : `general`, `geography`
- Labels d'onglets en français : `Général`, `Géographie`

### Types de données
- Texte court : `text`
- Texte long : `textarea` avec rows=4 à 8
- Nombres : `numeric` en base, `number` en formulaire
- Sélections : `text` en base avec options prédéfinies
- Images multiples : `jsonb` en base
- Relations : UUID avec foreign keys

## Ordre de priorité pour l'enrichissement

### Haute priorité (Très utilisé)
1. ✓ Worlds (Mondes)
2. Races
3. Countries (Pays)
4. Cities (Cités)
5. Monsters (Monstres)

### Priorité moyenne (Souvent utilisé)
6. Continents
7. Animals (Animaux)
8. Plants (Plantes)
9. Minerals (Minéraux)
10. Celestial Bodies (Corps célestes)

### Basse priorité (Moins utilisé)
11. Items, Magic Items
12. Potions, Recipes
13. Guilds, Languages
14. Villages, Locations
15. Crafting Materials

## Exemple rapide : Enrichir les Animaux

```javascript
// src/pages/AnimalsPage.jsx
import { Rabbit, Info, Heart, Brain, Package, ImageIcon, Shield } from 'lucide-react';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';

const animalsConfig = {
  entityName: "l'animal",
  tableName: 'animals',
  title: 'Animaux',
  getHeaderIcon: () => Rabbit,
  getHeaderColor: () => 'from-green-500/30 via-emerald-500/20 to-teal-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'subtitle', label: 'Nom commun', type: 'text' },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds' },
        { name: 'type', label: 'Type', type: 'select', options: [
          { value: 'mammal', label: 'Mammifère' },
          { value: 'bird', label: 'Oiseau' },
          // ... autres types
        ]},
        { name: 'image_url', label: 'Image', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'physical',
      label: 'Caractéristiques physiques',
      icon: Heart,
      fields: [
        { name: 'size', label: 'Taille', type: 'select', options: [...] },
        { name: 'weight_range', label: 'Poids', type: 'text' },
        { name: 'coloration', label: 'Coloration', type: 'textarea', rows: 2 },
        { name: 'physical_features', label: 'Particularités', type: 'textarea', rows: 3 }
      ]
    },
    // ... autres onglets
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'animal_images',
          label: 'Images',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'full-body', label: 'Corps entier' },
            { id: 'head', label: 'Tête' },
            { id: 'habitat', label: 'Habitat' },
            { id: 'behavior', label: 'Comportement' }
          ]
        }
      ]
    },
    {
      id: 'gm_notes',
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'gm_secrets_animal', label: 'Secrets', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

// Utiliser les composants Enhanced avec cette config
```

## Support et questions

Ce système est conçu pour être extensible et cohérent. Chaque entité peut avoir sa propre configuration adaptée tout en conservant la même charte graphique et expérience utilisateur.

Pour toute question ou problème, référez-vous à l'exemple complet dans WorldsPage.jsx.
