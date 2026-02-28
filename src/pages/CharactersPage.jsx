// src/pages/CharactersPage.jsx
import React, { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import { supabase } from '../lib/supabase';
import { calculateCombatStats } from '../utils/rulesEngine';
import { generatePDF, runSmokeTestPDF } from '../utils/pdfGenerator/index'; 
import LevelUpWizard from '../components/LevelUpWizard';
import { charactersConfig } from './CharactersConfig';

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);

  // Ce hook injecte les statistiques dérivées (comme CA, Perception) en temps réel pour l'affichage
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