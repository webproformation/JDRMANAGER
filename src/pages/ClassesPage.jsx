import React, { useState, useEffect } from 'react';
import { Swords, Info, TrendingUp, Book, ImageIcon, Shield, Plus, Minus, Zap } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : ÉDITEUR DE MÉCANIQUES DE CLASSE ---
const ClassMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const hitDie = data.hit_die || 'd8';
  const saves = data.saves || [];

  const availableSaves = [
    { id: 'str', label: 'Force' },
    { id: 'dex', label: 'Dextérité' },
    { id: 'con', label: 'Constitution' },
    { id: 'int', label: 'Intelligence' },
    { id: 'wis', label: 'Sagesse' },
    { id: 'cha', label: 'Charisme' }
  ];

  const toggleSave = (saveId) => {
    const newSaves = saves.includes(saveId)
      ? saves.filter(s => s !== saveId)
      : [...saves, saveId];
    onChange({ ...data, saves: newSaves });
  };

  return (
    <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Configuration technique VTT (Dés de vie & Sauvegardes)
      </p>
      
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 ml-1">Dé de Vie Principal</label>
          <div className="flex flex-wrap gap-3">
            {['d6', 'd8', 'd10', 'd12'].map(die => (
              <button
                key={die}
                type="button"
                onClick={() => onChange({ ...data, hit_die: die })}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  hitDie === die 
                    ? 'bg-[#2DD4BF] text-[#1B2A3F] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/20' 
                    : 'bg-black/40 text-silver/50 hover:bg-white/5 border-white/5'
                }`}
              >
                {die}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 ml-1">Sauvegardes de Classe</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSaves.map(save => {
              const isSelected = saves.includes(save.id);
              return (
                <button
                  key={save.id}
                  type="button"
                  onClick={() => toggleSave(save.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isSelected 
                      ? 'bg-teal-500/10 border-teal-500/40 text-teal-300' 
                      : 'bg-black/20 border-white/5 text-silver/40 hover:border-white/10'
                  }`}
                >
                  <Shield size={14} className={isSelected ? 'text-teal-400' : 'text-silver/20'} />
                  {save.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CONFIGURATION PRESTIGE V4.3.6 ---
const classesConfig = {
  entityName: 'la classe',
  tableName: 'character_classes',
  title: 'Classes & Vocations',
  getHeaderIcon: () => Swords,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-red-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_class_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="class" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la classe',
          type: 'text',
          required: true,
          placeholder: 'Ex: Guerrier, Mage, Rôdeur...'
        },
        {
          name: 'subtitle',
          label: 'Rôle tactique',
          type: 'text',
          placeholder: 'Tank, DPS, Soutien, Contrôle...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds'
        },
        {
          name: 'image_url',
          label: 'Illustration principale',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Philosophie & Lore',
          type: 'textarea',
          rows: 5,
          placeholder: 'Style de jeu, place dans la société, origine...'
        }
      ]
    },
    {
      id: 'stats',
      label: 'Mécaniques VTT',
      icon: TrendingUp,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles (Technique)',
          type: 'custom',
          isVirtual: true,
          component: ClassMechanicsEditor
        },
        {
          name: 'primary_ability',
          label: 'Caractéristique principale',
          type: 'text',
          placeholder: 'Ex: Force, Dextérité...'
        },
        {
          name: 'armor_proficiency',
          label: 'Maîtrise des armures',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Toutes les armures', 'Armures légères', 'Armures intermédiaires', 'Armures lourdes', 'Boucliers', 'Aucune']} 
            />
          )
        },
        {
          name: 'weapon_proficiency',
          label: 'Maîtrise des armes',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Armes simples', 'Armes de guerre', 'Armes de jet', 'Épées longues', 'Bâtons', 'Arcs']} 
            />
          )
        }
      ]
    },
    {
      id: 'abilities',
      label: 'Progression',
      icon: Book,
      fields: [
        {
          name: 'starting_equipment',
          label: 'Dotation de départ',
          type: 'textarea',
          rows: 4,
          placeholder: 'Liste de l\'équipement de base...'
        },
        {
          name: 'progression',
          label: 'Aperçu de progression',
          type: 'textarea',
          rows: 6,
          placeholder: 'Capacités majeures acquises par niveau...'
        },
        {
          name: 'subclasses',
          label: 'Spécialisations (Archétypes)',
          type: 'textarea',
          rows: 4,
          placeholder: 'Voies, domaines, écoles ou spécialités...'
        }
      ]
    },
    {
      id: 'roleplay',
      label: 'Incarner',
      icon: Info,
      fields: [
        {
          name: 'typical_backgrounds',
          label: 'Historiques suggérés',
          type: 'textarea',
          rows: 3
        },
        {
          name: 'roleplay_tips',
          label: 'Conseils d\'interprétation',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment jouer cette classe autour de la table...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'class_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'portraits', label: 'Individus' },
            { id: 'action', label: 'En combat' },
            { id: 'equipment', label: 'Tenues' }
          ]
        }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'balance_notes',
          label: 'Notes d\'équilibrage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Points forts, faiblesses et ajustements MJ...'
        },
        {
          name: 'notes',
          label: 'Notes MJ Confidentielles',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function ClassesPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

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
        const { data, error } = await supabase.from('character_classes').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

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
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('character_classes').delete().eq('id', deleteConfirm.item.id);
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
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Démystifier la Vocation"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des chroniques ? Les personnages de cette classe perdront leurs repères.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="character_classes"
        title="Classes"
        icon={Swords}
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
        item={selectedItem}
        config={classesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={classesConfig}
      />
    </div>
  );
}