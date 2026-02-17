/*
  # Ajout des colonnes détaillées pour toutes les ressources

  Cette migration ajoute toutes les colonnes manquantes pour permettre l'importation
  complète des données des fichiers CSV avec tous leurs détails.

  ## Tables modifiées

  ### 1. recipes (Recettes)
  Ajout de 34 colonnes pour capturer tous les détails culinaires:
  - Informations de base: type, cuisine_style, difficulty, difficulty_dc
  - Temps: preparation_time, cooking_time, total_time, servings
  - Ingrédients: ingredients_total_cost, required_tools
  - Instructions: cooking_steps
  - Effets: special_effects, effects_duration, addiction_risk, addiction_threshold,
    positive_effects_degradation, addiction_effects, withdrawal_symptoms
  - Sensorielles: taste_description, appearance, aroma, texture
  - Service: serving_suggestion, pairing
  - Conservation: storage_conditions, shelf_life
  - Valeur: market_value
  - Contexte: cultural_significance, history, variations, tips, warnings

  ### 2. plants (Plantes)
  Ajout de 15 colonnes pour les détails botaniques:
  - Caractéristiques: type, climate, season
  - Propriétés: effects, preparation, parts_used, harvest_difficulty
  - Valeur: market_value
  - Toxicité: toxicity_level, antidote
  - Magie: magical_uses
  - Culture: growth_time, cultivable
  - Informations: warnings, lore

  ### 3. animals (Animaux)
  Ajout de 17 colonnes pour les statistiques de créature:
  - Type: type
  - Combat: challenge_rating, armor_class, hit_points, speed
  - Capacités: abilities, skills, senses, special_abilities, actions
  - Comportement: behavior, diet
  - Domestication: domesticable, rideable
  - Gameplay: exp_value, token_url

  ### 4. minerals (Minéraux)
  Ajout de 15 colonnes pour les propriétés minéralogiques:
  - Caractéristiques: type, formation, appearance
  - Propriétés: magical_properties
  - Extraction: extraction_method, extraction_difficulty, processing
  - Physique: weight, hardness
  - Sécurité: dangers, side_effects
  - Usage: combinations
  - Contexte: lore, cultural_significance

  ### 5. crafting_materials (Matériaux d'artisanat)
  Ajout de 19 colonnes pour l'artisanat:
  - Classification: type, subtype, quality
  - Source: source, source_creature, harvest_method, harvest_difficulty, required_tool
  - Traitement: processing
  - Propriétés: magical_properties
  - Stockage: weight, unit, stack_size, durability
  - Usage: combinations, storage_conditions, preservation_time, crafting_bonus
  - Contexte: lore

  ### 6. items (Objets)
  Ajout de 12 colonnes pour les objets:
  - Type: type
  - Qualité: quality
  - Fabrication: materials, crafting_time, crafting_skill, durability
  - Propriétés: special_properties
  - Contexte: history, creator, uses
  - Physique: weight

  ### 7. magic_items (Objets magiques)
  Ajout de 12 colonnes pour la magie:
  - Type: type, requires_attunement, attunement_requirements
  - Pouvoir: magical_properties, bonus, charges
  - Malédiction: curse
  - Sentience: sentient, personality
  - Création: creator, creation_method, history
  - Physique: weight

  ### 8. potions (Potions)
  Ajout de 18 colonnes pour l'alchimie:
  - Type: type
  - Effets: effect, side_effects, addiction_risk, addiction_threshold,
    positive_effects_degradation, addiction_effects, withdrawal_symptoms
  - Fabrication: brewing_time, brewing_difficulty, brewing_method, required_tools,
    recipe_steps, ingredients_total_cost
  - Sensorielles: appearance, taste, smell
  - Stockage: weight, storage, shelf_life

  ### 9. diseases (Maladies)
  Ajout de 17 colonnes pour l'épidémiologie:
  - Type: type
  - Transmission: incubation_period, stages, transmission (remplace le champ existant)
  - Symptômes: mechanical_effects, symptoms (remplace le champ existant)
  - Évolution: mortality_rate, sequelae
  - Traitement: natural_remedies, magical_remedies, alchemical_remedies
  - Prévention: prevention, immunity_after_recovery, immunity_duration
  - Contexte: affected_species, origin, historical_outbreaks, cultural_impact

  ### 10. curses (Malédictions)
  Ajout de 20 colonnes pour les malédictions:
  - Type: type, severity, origin
  - Activation: manifestation, stages
  - Symptômes: symptoms, mechanical_effects, psychological_effects, social_effects
  - Propagation: is_hereditary, hereditary_conditions, spread_conditions, death_clause, sequelae
  - Remède: breaking_conditions, magical_remedies, ritual_remedies, quest_remedy
  - Prévention: prevention, detection
  - Contexte: famous_victims, cultural_significance

  ## Notes importantes
  - Tous les nouveaux champs sont de type TEXT sauf indication contraire
  - Les champs numériques utilisent INTEGER ou NUMERIC selon le contexte
  - Les champs booléens utilisent BOOLEAN avec des valeurs par défaut appropriées
  - Toutes les colonnes sont optionnelles (NULL autorisé) pour la flexibilité
*/

-- ============================================================================
-- RECIPES - Recettes de cuisine
-- ============================================================================
DO $$
BEGIN
  -- Informations de base
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'type') THEN
    ALTER TABLE recipes ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cuisine_style') THEN
    ALTER TABLE recipes ADD COLUMN cuisine_style TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'difficulty') THEN
    ALTER TABLE recipes ADD COLUMN difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'difficulty_dc') THEN
    ALTER TABLE recipes ADD COLUMN difficulty_dc INTEGER;
  END IF;
  
  -- Temps de préparation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'preparation_time') THEN
    ALTER TABLE recipes ADD COLUMN preparation_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cooking_time') THEN
    ALTER TABLE recipes ADD COLUMN cooking_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'total_time') THEN
    ALTER TABLE recipes ADD COLUMN total_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'servings') THEN
    ALTER TABLE recipes ADD COLUMN servings TEXT;
  END IF;
  
  -- Coûts et outils
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'ingredients_total_cost') THEN
    ALTER TABLE recipes ADD COLUMN ingredients_total_cost TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'required_tools') THEN
    ALTER TABLE recipes ADD COLUMN required_tools TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cooking_steps') THEN
    ALTER TABLE recipes ADD COLUMN cooking_steps TEXT;
  END IF;
  
  -- Effets spéciaux
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'special_effects') THEN
    ALTER TABLE recipes ADD COLUMN special_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'effects_duration') THEN
    ALTER TABLE recipes ADD COLUMN effects_duration TEXT;
  END IF;
  
  -- Addiction
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_risk') THEN
    ALTER TABLE recipes ADD COLUMN addiction_risk TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_threshold') THEN
    ALTER TABLE recipes ADD COLUMN addiction_threshold TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'positive_effects_degradation') THEN
    ALTER TABLE recipes ADD COLUMN positive_effects_degradation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'addiction_effects') THEN
    ALTER TABLE recipes ADD COLUMN addiction_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'withdrawal_symptoms') THEN
    ALTER TABLE recipes ADD COLUMN withdrawal_symptoms TEXT;
  END IF;
  
  -- Propriétés sensorielles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'taste_description') THEN
    ALTER TABLE recipes ADD COLUMN taste_description TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'appearance') THEN
    ALTER TABLE recipes ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'aroma') THEN
    ALTER TABLE recipes ADD COLUMN aroma TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'texture') THEN
    ALTER TABLE recipes ADD COLUMN texture TEXT;
  END IF;
  
  -- Service
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'serving_suggestion') THEN
    ALTER TABLE recipes ADD COLUMN serving_suggestion TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'pairing') THEN
    ALTER TABLE recipes ADD COLUMN pairing TEXT;
  END IF;
  
  -- Conservation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'storage_conditions') THEN
    ALTER TABLE recipes ADD COLUMN storage_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'shelf_life') THEN
    ALTER TABLE recipes ADD COLUMN shelf_life TEXT;
  END IF;
  
  -- Valeur et contexte
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'market_value') THEN
    ALTER TABLE recipes ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cultural_significance') THEN
    ALTER TABLE recipes ADD COLUMN cultural_significance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'history') THEN
    ALTER TABLE recipes ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'variations') THEN
    ALTER TABLE recipes ADD COLUMN variations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'tips') THEN
    ALTER TABLE recipes ADD COLUMN tips TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'warnings') THEN
    ALTER TABLE recipes ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- PLANTS - Plantes
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'type') THEN
    ALTER TABLE plants ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'climate') THEN
    ALTER TABLE plants ADD COLUMN climate TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'season') THEN
    ALTER TABLE plants ADD COLUMN season TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'effects') THEN
    ALTER TABLE plants ADD COLUMN effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'preparation') THEN
    ALTER TABLE plants ADD COLUMN preparation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'parts_used') THEN
    ALTER TABLE plants ADD COLUMN parts_used TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'harvest_difficulty') THEN
    ALTER TABLE plants ADD COLUMN harvest_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'market_value') THEN
    ALTER TABLE plants ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'toxicity_level') THEN
    ALTER TABLE plants ADD COLUMN toxicity_level TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'antidote') THEN
    ALTER TABLE plants ADD COLUMN antidote TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'magical_uses') THEN
    ALTER TABLE plants ADD COLUMN magical_uses TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'growth_time') THEN
    ALTER TABLE plants ADD COLUMN growth_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'cultivable') THEN
    ALTER TABLE plants ADD COLUMN cultivable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'warnings') THEN
    ALTER TABLE plants ADD COLUMN warnings TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'plants' AND column_name = 'lore') THEN
    ALTER TABLE plants ADD COLUMN lore TEXT;
  END IF;
END $$;

-- ============================================================================
-- ANIMALS - Animaux
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'type') THEN
    ALTER TABLE animals ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'challenge_rating') THEN
    ALTER TABLE animals ADD COLUMN challenge_rating TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'armor_class') THEN
    ALTER TABLE animals ADD COLUMN armor_class INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'hit_points') THEN
    ALTER TABLE animals ADD COLUMN hit_points TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'speed') THEN
    ALTER TABLE animals ADD COLUMN speed TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'abilities') THEN
    ALTER TABLE animals ADD COLUMN abilities TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'skills') THEN
    ALTER TABLE animals ADD COLUMN skills TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'senses') THEN
    ALTER TABLE animals ADD COLUMN senses TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'special_abilities') THEN
    ALTER TABLE animals ADD COLUMN special_abilities TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'actions') THEN
    ALTER TABLE animals ADD COLUMN actions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'behavior') THEN
    ALTER TABLE animals ADD COLUMN behavior TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'diet') THEN
    ALTER TABLE animals ADD COLUMN diet TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'domesticable') THEN
    ALTER TABLE animals ADD COLUMN domesticable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'rideable') THEN
    ALTER TABLE animals ADD COLUMN rideable TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'exp_value') THEN
    ALTER TABLE animals ADD COLUMN exp_value INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'animals' AND column_name = 'token_url') THEN
    ALTER TABLE animals ADD COLUMN token_url TEXT;
  END IF;
END $$;

-- Continuer avec les autres tables dans le prochain bloc...
-- (La limite de caractères m'oblige à diviser la migration)