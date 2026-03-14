import { useState, useEffect } from 'react';
import { FlaskConical, Info, Beaker, DollarSign, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor'; 
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog'; 
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (POTIONS) ---
const EffectMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const bonuses = data.bonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updateBonus = (stat, amount) => {
    const newValue = (bonuses[stat] || 0) + amount;
    if (newValue >= -10 && newValue <= 10) {
      onChange({ ...data, bonuses: { ...bonuses, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Configuration des effets mécaniques VTT (Soins, Buffs, Malus)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Restauration / Dégâts PV</label>
          <input 
            type="text" value={data.hp_effect || ''} onChange={(e) => updateField('hp_effect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: +4d4+4 (Soin) ou -3d6 (Acide)"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Durée de l'effet</label>
          <input 
            type="text" value={data.effect_duration || ''} onChange={(e) => updateField('effect_duration', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: 1 heure, 10 minutes..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">Modificateurs de Caractéristiques</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = bonuses[key] || 0;
          return (
            <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-3 hover:border-[#2DD4BF]/20 transition-colors group">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver/40 group-hover:text-[#2DD4BF] transition-colors">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updateBonus(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-all active:scale-90"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center drop-shadow-md ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                <button type="button" onClick={() => updateBonus(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-all active:scale-90"><Plus size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const potionsConfig = {
  entityName: 'la potion',
  tableName: 'potions',
  title: 'Potions & Élixirs',
  getHeaderIcon: () => FlaskConical,
  getHeaderColor: () => 'from-emerald-600/30 via-teal-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_item_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="item" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la potion',
          type: 'text',
          required: true,
          placeholder: 'Ex: Potion de guérison, Élixir de force...'
        },
        {
          name: 'subtitle',
          label: 'Type de breuvage',
          type: 'text',
          placeholder: 'Potion, Élixir, Philtre...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds',
          placeholder: 'Sélectionner un monde'
        },
        {
          name: 'image_url',
          label: 'Illustration',
          type: 'image'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          required: true,
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, couleur, odeur, consistance...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets',
      icon: Beaker,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: EffectMechanicsEditor
        },
        {
          name: 'effects',
          label: 'Effets principaux',
          type: 'textarea',
          rows: 5,
          placeholder: 'Description détaillée des effets...'
        },
        {
          name: 'side_effects',
          label: 'Effets secondaires / Risques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Effets indésirables, accoutumance...'
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Ex: 1 heure, instantané, permanent...'
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Alchimie',
      icon: Beaker,
      fields: [
        {
          name: 'data', 
          label: 'Alchimie Interactive (VTT)',
          type: 'custom',
          isVirtual: true,
          component: CraftingEngineEditor
        },
        {
          name: 'ingredients',
          label: 'Ingrédients requis',
          type: 'textarea',
          rows: 4,
          placeholder: 'Liste des composants nécessaires...'
        },
        {
          name: 'recipe',
          label: 'Processus de distillation',
          type: 'textarea',
          rows: 4,
          placeholder: 'Étapes de fabrication...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté alchimique',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
        }
      ]
    },
    {
      id: 'value',
      label: 'Valeur',
      icon: DollarSign,
      fields: [
        {
          name: 'value',
          label: 'Valeur marchande estimée',
          type: 'text',
          placeholder: 'Ex: 50 po, 100 po...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'potion_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'bottle', label: 'Fiole' },
            { id: 'liquid', label: 'Liquide' },
            { id: 'ingredients', label: 'Ingrédients' }
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
          name: 'notes',
          label: 'Notes MJ Confidentielles',
          type: 'textarea',
          rows: 4
        }
      ]
    }
  ]
};

export default function PotionsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('potions').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('potions').delete().eq('id', deleteConfirm.item.id);
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
        title="Vider la Fiole"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} du grimoire alchimique ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="potions"
        title="Potions"
        icon={FlaskConical}
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
        config={potionsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={potionsConfig}
      />
    </div>
  );
}