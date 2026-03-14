import { useState, useEffect } from 'react';
import { Wand2, Info, Sparkles, DollarSign, ImageIcon, Shield, Plus, Minus, Hammer } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor'; 
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (OBJETS MAGIQUES) ---
const ItemMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const vttType = data.type || 'item'; 
  const bonuses = data.bonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updateBonus = (stat, amount) => {
    const newValue = (bonuses[stat] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) onChange({ ...data, bonuses: { ...bonuses, [stat]: newValue } });
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 shadow-inner space-y-8 mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 italic">
        Configuration des propriétés VTT (Bonus calculés pour l'Arsenal)
      </p>
      
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 ml-1">Classification VTT</label>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'item', label: 'Standard / Anneau' },
            { id: 'weapon', label: 'Arme' },
            { id: 'armor', label: 'Armure' },
            { id: 'consumable', label: 'Consommable' }
          ].map(t => (
            <button
              key={t.id} type="button" onClick={() => updateField('type', t.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${vttType === t.id ? 'bg-[#2DD4BF] text-[#1B2A3F] border-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/20' : 'bg-black/40 text-silver/50 hover:bg-white/5 border-white/5'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {vttType === 'weapon' && (
        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 bg-purple-900/10 p-6 rounded-2xl border border-purple-500/20">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-2 ml-1">Dégâts de base</label>
            <input type="text" value={data.damage || ''} onChange={(e) => updateField('damage', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none placeholder-white/10 font-bold" placeholder="Ex: 1d8 + 1d6 Feu" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-2 ml-1">Type</label>
            <input type="text" value={data.damage_type || ''} onChange={(e) => updateField('damage_type', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none placeholder-white/10 font-bold" placeholder="Ex: Tranchant" />
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-white/5">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 ml-1">Bonus de Caractéristiques (Équipé)</label>
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
    </div>
  );
};

const magicItemsConfig = {
  entityName: "l'objet magique",
  tableName: 'magic_items',
  title: 'Objets Magiques',
  getHeaderIcon: () => Wand2,
  getHeaderColor: () => 'from-purple-600/30 via-violet-500/20 to-indigo-500/30',

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
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
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
          label: "Nom de l'objet magique",
          type: 'text',
          required: true,
          placeholder: 'Ex: Anneau de protection, Bâton de feu...'
        },
        {
          name: 'subtitle',
          label: 'Catégorie / Type',
          type: 'text',
          placeholder: 'Anneau, Bâton, Armure, Arme...'
        },
        {
          name: 'world_id',
          label: 'Monde d\'origine',
          type: 'relation',
          table: 'worlds'
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
            { value: 'legendary', label: 'Légendaire' },
            { value: 'artifact', label: 'Artefact' }
          ]
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, aura magique, sensation au toucher...'
        }
      ]
    },
    {
      id: 'magic',
      label: 'Propriétés magiques',
      icon: Sparkles,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: ItemMechanicsEditor
        },
        {
          name: 'attunement',
          label: 'Harmonisation requise',
          type: 'select',
          options: [
            { value: 'yes', label: 'Oui' },
            { value: 'no', label: 'Non' }
          ]
        },
        {
          name: 'magical_properties',
          label: 'Pouvoirs & Capacités',
          type: 'textarea',
          rows: 5,
          placeholder: 'Description détaillée des effets magiques...'
        },
        {
          name: 'charges',
          label: 'Charges / Utilisations',
          type: 'text',
          placeholder: 'Ex: 3 charges/jour, 10 charges au total...'
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Fabrication',
      icon: Hammer,
      fields: [
        {
          name: 'data', 
          label: 'Protocole d\'Enchantement (VTT)',
          type: 'custom',
          isVirtual: true,
          component: CraftingEngineEditor
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
          placeholder: 'Ex: 5000 po, Inestimable...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'magic_item_images',
          label: "Images de l'objet",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'main', label: 'Principal' },
            { id: 'active', label: 'En utilisation' },
            { id: 'details', label: 'Gros plan' }
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
          name: 'history',
          label: 'Histoire & Origine',
          type: 'textarea',
          rows: 3,
          placeholder: 'Qui a créé cet objet ? Pourquoi ?'
        },
        {
          name: 'curse',
          label: 'Malédiction (Secrète)',
          type: 'textarea',
          rows: 2,
          placeholder: 'Effets néfastes cachés...'
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

export default function MagicItemsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('magic_items').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('magic_items').delete().eq('id', deleteConfirm.item.id);
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
        title="Détruire l'Artefact"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des chroniques ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="magic_items"
        title="Objets Magiques"
        icon={Wand2}
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
        config={magicItemsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={magicItemsConfig}
      />
    </div>
  );
}