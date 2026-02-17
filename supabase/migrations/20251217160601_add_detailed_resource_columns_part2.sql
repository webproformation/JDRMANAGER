/*
  # Ajout des colonnes détaillées pour les ressources - Partie 2

  Suite de la migration précédente pour les tables restantes.
*/

-- ============================================================================
-- MINERALS - Minéraux
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'type') THEN
    ALTER TABLE minerals ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'habitat') THEN
    ALTER TABLE minerals ADD COLUMN habitat TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'formation') THEN
    ALTER TABLE minerals ADD COLUMN formation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'appearance') THEN
    ALTER TABLE minerals ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'magical_properties') THEN
    ALTER TABLE minerals ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'extraction_method') THEN
    ALTER TABLE minerals ADD COLUMN extraction_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'extraction_difficulty') THEN
    ALTER TABLE minerals ADD COLUMN extraction_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'processing') THEN
    ALTER TABLE minerals ADD COLUMN processing TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'market_value') THEN
    ALTER TABLE minerals ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'weight') THEN
    ALTER TABLE minerals ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'hardness') THEN
    ALTER TABLE minerals ADD COLUMN hardness TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'dangers') THEN
    ALTER TABLE minerals ADD COLUMN dangers TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'side_effects') THEN
    ALTER TABLE minerals ADD COLUMN side_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'combinations') THEN
    ALTER TABLE minerals ADD COLUMN combinations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'lore') THEN
    ALTER TABLE minerals ADD COLUMN lore TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'minerals' AND column_name = 'cultural_significance') THEN
    ALTER TABLE minerals ADD COLUMN cultural_significance TEXT;
  END IF;
END $$;

-- ============================================================================
-- CRAFTING_MATERIALS - Matériaux d'artisanat
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'type') THEN
    ALTER TABLE crafting_materials ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'subtype') THEN
    ALTER TABLE crafting_materials ADD COLUMN subtype TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'quality') THEN
    ALTER TABLE crafting_materials ADD COLUMN quality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'source') THEN
    ALTER TABLE crafting_materials ADD COLUMN source TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'source_creature') THEN
    ALTER TABLE crafting_materials ADD COLUMN source_creature TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'harvest_method') THEN
    ALTER TABLE crafting_materials ADD COLUMN harvest_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'harvest_difficulty') THEN
    ALTER TABLE crafting_materials ADD COLUMN harvest_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'required_tool') THEN
    ALTER TABLE crafting_materials ADD COLUMN required_tool TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'processing') THEN
    ALTER TABLE crafting_materials ADD COLUMN processing TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'properties') THEN
    ALTER TABLE crafting_materials ADD COLUMN properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'magical_properties') THEN
    ALTER TABLE crafting_materials ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'market_value') THEN
    ALTER TABLE crafting_materials ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'weight') THEN
    ALTER TABLE crafting_materials ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'unit') THEN
    ALTER TABLE crafting_materials ADD COLUMN unit TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'stack_size') THEN
    ALTER TABLE crafting_materials ADD COLUMN stack_size TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'durability') THEN
    ALTER TABLE crafting_materials ADD COLUMN durability TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'combinations') THEN
    ALTER TABLE crafting_materials ADD COLUMN combinations TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'storage_conditions') THEN
    ALTER TABLE crafting_materials ADD COLUMN storage_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'preservation_time') THEN
    ALTER TABLE crafting_materials ADD COLUMN preservation_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'crafting_bonus') THEN
    ALTER TABLE crafting_materials ADD COLUMN crafting_bonus TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crafting_materials' AND column_name = 'lore') THEN
    ALTER TABLE crafting_materials ADD COLUMN lore TEXT;
  END IF;
END $$;

-- ============================================================================
-- ITEMS - Objets
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'type') THEN
    ALTER TABLE items ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'quality') THEN
    ALTER TABLE items ADD COLUMN quality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'market_value') THEN
    ALTER TABLE items ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'weight') THEN
    ALTER TABLE items ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'materials') THEN
    ALTER TABLE items ADD COLUMN materials TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'crafting_time') THEN
    ALTER TABLE items ADD COLUMN crafting_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'crafting_skill') THEN
    ALTER TABLE items ADD COLUMN crafting_skill TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'durability') THEN
    ALTER TABLE items ADD COLUMN durability TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'special_properties') THEN
    ALTER TABLE items ADD COLUMN special_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'history') THEN
    ALTER TABLE items ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'creator') THEN
    ALTER TABLE items ADD COLUMN creator TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'item_uses') THEN
    ALTER TABLE items ADD COLUMN item_uses TEXT;
  END IF;
END $$;

-- ============================================================================
-- MAGIC_ITEMS - Objets magiques
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'type') THEN
    ALTER TABLE magic_items ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'requires_attunement') THEN
    ALTER TABLE magic_items ADD COLUMN requires_attunement TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'attunement_requirements') THEN
    ALTER TABLE magic_items ADD COLUMN attunement_requirements TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'magical_properties') THEN
    ALTER TABLE magic_items ADD COLUMN magical_properties TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'bonus') THEN
    ALTER TABLE magic_items ADD COLUMN bonus TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'charges') THEN
    ALTER TABLE magic_items ADD COLUMN charges TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'curse') THEN
    ALTER TABLE magic_items ADD COLUMN curse TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'sentient') THEN
    ALTER TABLE magic_items ADD COLUMN sentient TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'personality') THEN
    ALTER TABLE magic_items ADD COLUMN personality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'creator') THEN
    ALTER TABLE magic_items ADD COLUMN creator TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'creation_method') THEN
    ALTER TABLE magic_items ADD COLUMN creation_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'history') THEN
    ALTER TABLE magic_items ADD COLUMN history TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'market_value') THEN
    ALTER TABLE magic_items ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'magic_items' AND column_name = 'weight') THEN
    ALTER TABLE magic_items ADD COLUMN weight TEXT;
  END IF;
END $$;

-- ============================================================================
-- POTIONS - Potions
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'type') THEN
    ALTER TABLE potions ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'effect') THEN
    ALTER TABLE potions ADD COLUMN effect TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'side_effects') THEN
    ALTER TABLE potions ADD COLUMN side_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_risk') THEN
    ALTER TABLE potions ADD COLUMN addiction_risk TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_threshold') THEN
    ALTER TABLE potions ADD COLUMN addiction_threshold TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'positive_effects_degradation') THEN
    ALTER TABLE potions ADD COLUMN positive_effects_degradation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'addiction_effects') THEN
    ALTER TABLE potions ADD COLUMN addiction_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'withdrawal_symptoms') THEN
    ALTER TABLE potions ADD COLUMN withdrawal_symptoms TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'ingredients') THEN
    ALTER TABLE potions ADD COLUMN ingredients TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'ingredients_total_cost') THEN
    ALTER TABLE potions ADD COLUMN ingredients_total_cost TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_time') THEN
    ALTER TABLE potions ADD COLUMN brewing_time TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_difficulty') THEN
    ALTER TABLE potions ADD COLUMN brewing_difficulty TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'brewing_method') THEN
    ALTER TABLE potions ADD COLUMN brewing_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'required_tools') THEN
    ALTER TABLE potions ADD COLUMN required_tools TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'recipe_steps') THEN
    ALTER TABLE potions ADD COLUMN recipe_steps TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'appearance') THEN
    ALTER TABLE potions ADD COLUMN appearance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'taste') THEN
    ALTER TABLE potions ADD COLUMN taste TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'smell') THEN
    ALTER TABLE potions ADD COLUMN smell TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'market_value') THEN
    ALTER TABLE potions ADD COLUMN market_value TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'weight') THEN
    ALTER TABLE potions ADD COLUMN weight TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'storage') THEN
    ALTER TABLE potions ADD COLUMN storage TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'shelf_life') THEN
    ALTER TABLE potions ADD COLUMN shelf_life TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'potions' AND column_name = 'warnings') THEN
    ALTER TABLE potions ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- DISEASES - Maladies
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'type') THEN
    ALTER TABLE diseases ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'incubation_period') THEN
    ALTER TABLE diseases ADD COLUMN incubation_period TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'stages') THEN
    ALTER TABLE diseases ADD COLUMN stages TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'mechanical_effects') THEN
    ALTER TABLE diseases ADD COLUMN mechanical_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'mortality_rate') THEN
    ALTER TABLE diseases ADD COLUMN mortality_rate TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'sequelae') THEN
    ALTER TABLE diseases ADD COLUMN sequelae TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'natural_remedies') THEN
    ALTER TABLE diseases ADD COLUMN natural_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'magical_remedies') THEN
    ALTER TABLE diseases ADD COLUMN magical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'alchemical_remedies') THEN
    ALTER TABLE diseases ADD COLUMN alchemical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'prevention') THEN
    ALTER TABLE diseases ADD COLUMN prevention TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'immunity_after_recovery') THEN
    ALTER TABLE diseases ADD COLUMN immunity_after_recovery TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'immunity_duration') THEN
    ALTER TABLE diseases ADD COLUMN immunity_duration TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'affected_species') THEN
    ALTER TABLE diseases ADD COLUMN affected_species TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'origin') THEN
    ALTER TABLE diseases ADD COLUMN origin TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'historical_outbreaks') THEN
    ALTER TABLE diseases ADD COLUMN historical_outbreaks TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'cultural_impact') THEN
    ALTER TABLE diseases ADD COLUMN cultural_impact TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diseases' AND column_name = 'warnings') THEN
    ALTER TABLE diseases ADD COLUMN warnings TEXT;
  END IF;
END $$;

-- ============================================================================
-- CURSES - Malédictions
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'type') THEN
    ALTER TABLE curses ADD COLUMN type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'severity') THEN
    ALTER TABLE curses ADD COLUMN severity TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'origin') THEN
    ALTER TABLE curses ADD COLUMN origin TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'manifestation') THEN
    ALTER TABLE curses ADD COLUMN manifestation TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'stages') THEN
    ALTER TABLE curses ADD COLUMN stages TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'symptoms') THEN
    ALTER TABLE curses ADD COLUMN symptoms TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'mechanical_effects') THEN
    ALTER TABLE curses ADD COLUMN mechanical_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'psychological_effects') THEN
    ALTER TABLE curses ADD COLUMN psychological_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'social_effects') THEN
    ALTER TABLE curses ADD COLUMN social_effects TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'duration') THEN
    ALTER TABLE curses ADD COLUMN duration TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'is_hereditary') THEN
    ALTER TABLE curses ADD COLUMN is_hereditary TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'hereditary_conditions') THEN
    ALTER TABLE curses ADD COLUMN hereditary_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'spread_conditions') THEN
    ALTER TABLE curses ADD COLUMN spread_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'death_clause') THEN
    ALTER TABLE curses ADD COLUMN death_clause TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'sequelae') THEN
    ALTER TABLE curses ADD COLUMN sequelae TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'breaking_conditions') THEN
    ALTER TABLE curses ADD COLUMN breaking_conditions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'magical_remedies') THEN
    ALTER TABLE curses ADD COLUMN magical_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'ritual_remedies') THEN
    ALTER TABLE curses ADD COLUMN ritual_remedies TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'quest_remedy') THEN
    ALTER TABLE curses ADD COLUMN quest_remedy TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'prevention') THEN
    ALTER TABLE curses ADD COLUMN prevention TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'detection') THEN
    ALTER TABLE curses ADD COLUMN detection TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'famous_victims') THEN
    ALTER TABLE curses ADD COLUMN famous_victims TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'cultural_significance') THEN
    ALTER TABLE curses ADD COLUMN cultural_significance TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'curses' AND column_name = 'warnings') THEN
    ALTER TABLE curses ADD COLUMN warnings TEXT;
  END IF;
END $$;