// src/pages/CharactersPage.jsx
import React, { useState } from 'react';
import { 
  User, Shield, Sword, Scroll, Crown, Skull, Backpack, 
  Sparkles, Hammer, AlertTriangle
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import ArsenalEditor from '../components/ArsenalEditor'; 
import CharacterSpellbook from '../components/CharacterSpellbook';
import InventoryEditor from '../components/InventoryEditor';
import { calculateCombatStats } from '../utils/rulesEngine';

// --- Les Modules Extraits (Architecture Propre) ---
import { generatePDF, runSmokeTestPDF } from '../utils/pdfGenerator';
import LevelUpWizard from '../components/LevelUpWizard';
import CharacterCrafting from '../components/CharacterCrafting';
import CosmicInfluenceStatus from '../components/CosmicInfluenceStatus';

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
        { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { 
          name: 'dynamic_character_fields', 
          isVirtual: true,
          label: 'Détails Système',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <RulesetDynamicFields rulesetId={formData.ruleset_id} entityType="race" formData={formData} onChange={onFullChange} />
          )
        },
        { name: 'name', label: 'Nom du Héros', type: 'text', required: true, placeholder: 'Nom...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
        { name: 'character_type', label: 'Type', type: 'select', options: [{ value: 'PJ', label: 'PJ' }, { value: 'PNJ', label: 'PNJ' }] },
        { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },
        { name: 'birth_date', label: 'Date de Naissance', type: 'text', placeholder: 'Ex: 14-03-1284' },
        { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
        { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
        { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
        { name: 'subclass_id', label: 'Archétype (Sous-Classe)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
        { name: 'level', label: 'Niveau', type: 'number', required: true },
        { name: 'image_url', label: 'Portrait', type: 'image' }
      ]
    },
    {
      id: 'cosmic',
      label: 'Destin & Astres',
      icon: Sparkles,
      fields: [
        { 
          name: 'cosmic_status', 
          isVirtual: true,
          label: 'Influence des Astres en Temps Réel', 
          type: 'custom', 
          component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
        }
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
        { 
          name: 'arsenal_data', 
          isVirtual: true,
          label: 'Arsenal & Équipement', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <ArsenalEditor 
              value={formData.data?.arsenal || []} 
              onChange={(newArsenal) => onFullChange({ ...formData, data: { ...formData.data, arsenal: newArsenal } })} 
              formData={formData} 
            />
          )
        },
        { name: 'abilities', label: 'Capacités Spéciales', type: 'textarea', placeholder: 'Talents, traits de combat...' }
      ]
    },
    {
      id: 'magic',
      label: 'Grimoire Arcanique',
      icon: Sparkles,
      fields: [
        { 
          name: 'magic_editor', 
          isVirtual: true,
          label: 'Maîtrise des Arcanes', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterSpellbook character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
          )
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Artisanat & Alchimie',
      icon: Hammer,
      fields: [
        { 
          name: 'crafting_bench', 
          isVirtual: true,
          label: 'Établi de Fabrication', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterCrafting character={formData} onChange={(newData) => onFullChange({ ...formData, data: newData })} />
          )
        }
      ]
    },
    {
      id: 'bio',
      label: 'Biographie & Histoire',
      icon: Scroll,
      fields: [
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...' },
        { name: 'personality', label: 'Traits de Personnalité', type: 'textarea', rows: 3, placeholder: 'Caractère...' },
        { name: 'description', label: 'Apparence Physique', type: 'textarea', rows: 3, placeholder: 'Traits distinctifs...' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: Backpack,
      fields: [
        {
          name: 'money_custom',
          isVirtual: true,
          label: 'Bourse & Richesses',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-4 gap-4 mb-8 bg-[#0f111a] p-6 rounded-[2rem] border border-white/5">
              {['pp', 'po', 'pa', 'pc'].map(coin => {
                const colors = { pp: 'text-slate-200 border-slate-500/30', po: 'text-yellow-400 border-yellow-500/30', pa: 'text-zinc-400 border-zinc-400/30', pc: 'text-orange-400 border-orange-500/30' };
                const labels = { pp: 'Platine', po: 'Or', pa: 'Argent', pc: 'Cuivre' };
                return (
                  <div key={coin} className={`bg-black/40 p-4 rounded-2xl border ${colors[coin]} text-center`}>
                    <span className="text-[10px] font-black uppercase mb-2 block text-silver/60">{labels[coin]}</span>
                    <input 
                      type="number" 
                      value={formData.data?.[`money_${coin}`] || 0} 
                      onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                      className={`w-full bg-transparent text-center text-xl font-black outline-none [&::-webkit-inner-spin-button]:appearance-none ${colors[coin].split(' ')[0]}`} 
                    />
                  </div>
                );
              })}
            </div>
          )
        },
        { 
          name: 'inventory_data', 
          isVirtual: true,
          label: 'Sac à dos (Équipement BD)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <InventoryEditor 
              value={formData.data?.inventory || []} 
              onChange={(newInv) => onFullChange({ ...formData, data: { ...formData.data, inventory: newInv } })} 
              formData={formData}
            />
          ) 
        }
      ]
    },
    {
      id: 'gm',
      label: 'MJ (Secret)',
      icon: Skull,
      fields: [
        { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...' }
      ]
    }
  ]
};

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  const handleLevelUpClick = (char) => {
    setLevelUpChar(char);
    setShowLevelUp(true);
  };

  return (
    <>
      {/* BOUTON DE CRASH TEST POUR LE CALIBRAGE PDF */}
      <div className="max-w-[1920px] mx-auto px-6 pt-6 flex justify-end">
        <button 
          onClick={runSmokeTestPDF}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg shadow-red-900/50 transition-all hover:scale-105"
        >
          <AlertTriangle size={16} /> Smoke Test PDF
        </button>
      </div>

      <EntityList 
        key={refreshKey} 
        tableName="characters" 
        title="Forge des Personnages" 
        icon={User} 
        onView={(it) => setSelectedItem(it)} 
        onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={async (it) => { 
          if (confirm(`Supprimer ${it.name}?`)) { 
            await supabase.from('characters').delete().eq('id', it.id); 
            setRefreshKey(k => k + 1); 
          }
        }} 
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={getAugmentedItem(selectedItem)} 
        config={charactersConfig} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} 
        onLevelUp={() => handleLevelUpClick(selectedItem)}
        onExportPDF={() => generatePDF(selectedItem)}
      />
      
      <EnhancedEntityForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        item={editingItem} 
        config={charactersConfig} 
        onSuccess={() => setRefreshKey(k => k + 1)} 
      />

      {showLevelUp && levelUpChar && (
        <LevelUpWizard 
          character={levelUpChar}
          onClose={() => setShowLevelUp(false)}
          onSuccess={() => {
            setShowLevelUp(false);
            setRefreshKey(k => k + 1);
            setSelectedItem(null); 
          }}
        />
      )}
    </>
  );
}