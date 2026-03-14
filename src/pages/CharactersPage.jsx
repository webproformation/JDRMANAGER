import React, { useState, useEffect } from 'react';
import { User, AlertTriangle, Sparkles, FileText, Zap } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import VTTDialog from '../components/VTTDialog'; 
import LevelUpWizard from '../components/LevelUpWizard';
import { getCharacterConfig } from './characterConfigs';
import { supabase } from '../lib/supabase';
import { calculateCombatStats } from '../utils/rulesEngine';
import { generatePDF, runSmokeTestPDF } from '../utils/pdfGenerator/index'; 

/**
 * CharactersPage - Standard PRESTIGE 4.3.6
 * Gestionnaire de Héros et Registre des Légendes.
 */
export default function CharactersPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpChar, setLevelUpChar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  // --- PROTOCOLE DE ROUTAGE VERCEL ---
  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  // --- LOGIQUE MOTEUR DE RÈGLES ---
  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  const handleLevelUpClick = (char) => {
    setLevelUpChar(char);
    setShowLevelUp(true);
  };

  // --- GESTION DES ACTIONS ---
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowForm(false);
    setEditingItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null,
      level: 1
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('characters').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      {/* DIALOGUE DE SUPPRESSION PRESTIGE */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Effacer la Légende"
        message={`Voulez-vous vraiment supprimer définitivement ${deleteConfirm.item?.name} ? Ses exploits et son histoire seront oubliés du Multivers.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      {/* BOUTON DEBUG PDF (Header Right Context) */}
      <div className="max-w-[1920px] mx-auto px-6 pt-6 flex justify-end">
        <button 
          onClick={runSmokeTestPDF}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
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
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        onLevelUp={() => handleLevelUpClick(selectedItem)}
        onExportPDF={() => generatePDF(selectedItem)}
        item={getAugmentedItem(selectedItem)}
        config={getCharacterConfig(selectedItem?.ruleset_id || 'dnd5')}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={getCharacterConfig(editingItem?.ruleset_id || 'dnd5')}
      />

      {/* SORCIER DE MONTÉE DE NIVEAU */}
      {showLevelUp && levelUpChar && (
        <LevelUpWizard 
          character={levelUpChar}
          onClose={() => setShowLevelUp(false)}
          onComplete={() => {
            setShowLevelUp(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}