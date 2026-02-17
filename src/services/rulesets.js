import { supabase } from '../lib/supabase';

/**
 * Récupère la liste de tous les systèmes de jeu disponibles (D&D, Rolemaster, etc.)
 */
export const getRulesets = async () => {
  const { data, error } = await supabase
    .from('rulesets')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Erreur lors du chargement des règles:', error);
    throw error;
  }
  
  return data;
};

/**
 * Récupère un système spécifique par son ID (ex: 'dnd5')
 */
export const getRulesetById = async (id) => {
  const { data, error } = await supabase
    .from('rulesets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors du chargement du ruleset ${id}:`, error);
    throw error;
  }

  return data;
};