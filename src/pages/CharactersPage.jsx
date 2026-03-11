// src/pages/CharactersPage.jsx
import React, { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import VTTDialog from '../components/VTTDialog'; // Import du dialogue Prestige
import { supabase } from '../lib/supabase';
import { calculateCombatStats } from '../utils/rulesEngine';
import { generatePDF, runSmokeTestPDF } from '../utils/pdfGenerator/index'; 
import LevelUpWizard from '../components/LevelUpWizard';
import { getCharacterConfig } from './characterConfigs';

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);

  // État pour le dialogue de suppression personnalisé
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  const handleLevelUpClick = (char) => {
    setLevelUpChar(char);
    setShowLevelUp(true);
  };

  // Logique de suppression Prestige
  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    try {
      const { error } = await supabase.from('characters').delete().eq('id', item.id);
      if (error) throw error;
      
      setSelectedItem(null);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error("Erreur de suppression:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <>
      {/* DIALOGUE DE SUPPRESSION PERSONNALISÉ */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Supprimer le Héros"
        message={`Voulez-vous vraiment effacer ${deleteConfirm.item?.name} ? Son histoire et ses exploits seront perdus à jamais.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <div className="max-w-[1920px] mx-auto px-6 pt-6 flex justify-end">
        <button 
          onClick={runSmokeTestPDF}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <AlertTriangle size={14} />
          Test PDF (Debug)
        </button>
      </div>

      <EntityList 
        key={refreshKey}
        tableName="characters" 
        title="Personnages" 
        icon={User} 
        onView={(it) => setSelectedItem(it)} 
        onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={openDeleteDialog} // Utilisation du nouveau dialogue
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={getAugmentedItem(selectedItem)} 
        config={getCharacterConfig(selectedItem?.ruleset_id || 'dnd5')} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} 
        onDelete={() => openDeleteDialog(selectedItem)} // Utilisation du nouveau dialogue
        onLevelUp={() => handleLevelUpClick(selectedItem)}
        onExportPDF={() => generatePDF(selectedItem)}
      />
      
      <EnhancedEntityForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        item={editingItem} 
        config={getCharacterConfig(editingItem?.ruleset_id || 'dnd5')} 
        onSuccess={() => setRefreshKey(k => k + 1)} 
      />

      {showLevelUp && levelUpChar && (
        <LevelUpWizard 
          character={levelUpChar}
          onClose={() => setShowLevelUp(false)}
          onComplete={() => {
            setShowLevelUp(false);
            setRefreshKey(k => k + 1);
            if (selectedItem?.id === levelUpChar.id) {
              // Optionnel: rafraîchir le détail si ouvert
            }
          }}
        />
      )}
    </>
  );
}