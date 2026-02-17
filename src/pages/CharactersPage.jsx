// src/pages/CharactersPage.jsx
import React, { useState } from 'react';
import { User, Shield, Sword, Scroll, Crown, Skull, Zap, Backpack, Sparkles, BookOpen } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import { calculateCombatStats } from '../utils/rulesEngine';

const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5'];
  
  const handleStatsChange = (newStats) => {
    const derived = calculateCombatStats(currentRulesetId, newStats, formData.level);
    onChange({ ...newStats, ...derived });
  };
  return <DynamicStatsEditor ruleset={currentRuleset} data={value} onChange={handleStatsChange} />;
};

const charactersConfig = {
  entityName: 'le personnage',
  tableName: 'characters',
  title: 'Forge des Héros',
  getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
  getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),

  tabs: [
    {
      id: 'identity',
      label: 'Système & Identité',
      icon: User,
      fields: [
        { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: [{ value: 'dnd5', label: 'D&D 5e' }, { value: 'cthulhu', label: 'Cthulhu 7e' }, { value: 'rdd', label: 'Rêve de Dragon' }, { value: 'rolemaster', label: 'Rolemaster' }, { value: 'runequest', label: 'RuneQuest' }] },
        { name: 'name', label: 'Nom du Héros', type: 'text', required: true },
        { name: 'character_type', label: 'Rôle', type: 'select', options: [{ value: 'PJ', label: 'Héros (PJ)' }, { value: 'PNJ', label: 'Allié/Ennemi (PNJ)' }] },
        { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },
        { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
        { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
        { name: 'level', label: 'Niveau Actuel', type: 'number', required: true },
        { name: 'experience', label: 'Points d\'Expérience (XP)', type: 'number' },
        { name: 'image_url', label: 'Portrait Illustré', type: 'image' }
      ]
    },
    {
      id: 'stats',
      label: 'Caractéristiques & Compétences',
      icon: Shield,
      fields: [{ name: 'data', label: 'Fiche Technique Interactive', type: 'custom', component: ConnectedStatsEditor }]
    },
    {
      id: 'combat',
      label: 'Combat & Arsenal',
      icon: Sword,
      fields: [
        { name: 'weapons', label: 'Arsenal & Bonus d\'Attaque', type: 'textarea', placeholder: 'Ex: Épée Longue (+5 touche, 1d8+3 dégâts)' },
        { name: 'abilities_notes', label: 'Notes de Capacités', type: 'textarea' }
      ]
    },
    {
      id: 'magic',
      label: 'Magie',
      icon: Sparkles,
      fields: [
        { name: 'magic_system_slots', label: 'Slots de Sorts', type: 'textarea', placeholder: 'Calculé auto dans la fiche technique...' },
        { name: 'spells_list', label: 'Grimoire (Sorts Connus)', type: 'relation-list', table: 'spells', filterBy: 'class_id' }
      ]
    },
    {
      id: 'bio',
      label: 'Biographie & Histoire',
      icon: Scroll,
      fields: [
        { name: 'description', label: 'Apparence Physique', type: 'textarea' },
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea' },
        { name: 'personality', label: 'Traits de Personnalité', type: 'textarea' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: Backpack,
      fields: [{ name: 'equipment', label: 'Sac à dos (Objets)', type: 'textarea' }, { name: 'money', label: 'Fortune & Richesses', type: 'text' }]
    },
    {
      id: 'gm_notes',
      label: 'MJ (Secret)',
      icon: Skull,
      fields: [{ name: 'gm_notes', label: 'Secrets du Maître du Jeu', type: 'textarea' }]
    }
  ]
};

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  return (
    <>
      <EntityList key={refreshKey} tableName="characters" title="Forge des Héros" icon={User} 
        onView={setSelectedItem} onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={async (it) => { if (confirm(`Supprimer ${it.name}?`)) { await supabase.from('characters').delete().eq('id', it.id); setRefreshKey(k => k + 1); }}}
      />
      <EnhancedEntityDetail isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={getAugmentedItem(selectedItem)} config={charactersConfig} onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} />
      <EnhancedEntityForm isOpen={isCreating} onClose={() => setIsCreating(false)} item={editingItem} config={charactersConfig} onSuccess={() => setRefreshKey(k => k + 1)} />
    </>
  );
}