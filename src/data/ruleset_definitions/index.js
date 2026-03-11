// src/data/ruleset_definitions/index.js
import { dnd5 } from './dnd5';
import { cthulhu } from './cthulhu';
import { rolemaster } from './rolemaster';
import { rdd } from './rdd';
import { runequest } from './runequest';
import { supabase } from '../../lib/supabase';

export const DEFAULT_RULESETS = {
  'dnd5': dnd5,
  'cthulhu': cthulhu,
  'rolemaster': rolemaster,
  'rdd': rdd,
  'runequest': runequest
};

export const getRulesets = async () => {
  const { data, error } = await supabase.from('rulesets').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getRulesetById = (id) => DEFAULT_RULESETS[id] || DEFAULT_RULESETS['dnd5'];
export const getAllRulesets = () => Object.values(DEFAULT_RULESETS);