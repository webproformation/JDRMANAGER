import { useState, useEffect } from 'react';
import { Hammer, Info, MapPin, DollarSign, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (MATÉRIAUX) ---
const CraftingMaterialMechanicsEditor = ({ value = {}, onChange }) => {
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
    <div className="bg-black/20 rounded-[2.5rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Propriétés mécaniques VTT (Propagées aux objets forgés)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Bonus d'Artisanat</label>
          <input 
            type="text" value={data.crafting_bonus || ''} onChange={(e) => updateField('crafting_bonus', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: +1 aux jets d'attaque, +2 CA..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Modificateur de Poids / Durabilité</label>
          <input 
            type="text" value={data.weight_durability_modifier || ''} onChange={(e) => updateField('weight_durability_modifier', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: Poids divisé par 2, Indestructible..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">
        Bénéfices de Caractéristiques (Transmis)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

const craftingMaterialsConfig = {
  entityName: 'le matériau',
  tableName: 'crafting_materials',
  title: 'Matériaux & Composants',
  getHeaderIcon: () => Hammer,
  getHeaderColor: () => 'from-slate-600/30 via-gray-500/20 to-zinc-500/30',

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
          label: 'Nom du matériau',
          type: 'text',
          required: true,
          placeholder: 'Ex: Cuir tanné, Acier trempé, Essence lunaire...'
        },
        {
          name: 'subtitle',
          label: 'Type de ressource',
          type: 'text',
          placeholder: 'Métal, Cuir, Tissu, Composant magique...'
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
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, texture, rareté naturelle...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Info,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: CraftingMaterialMechanicsEditor
        },
        {
          name: 'quality',
          label: 'Indice de Qualité',
          type: 'select',
          options: [
            { value: 'poor', label: 'Médiocre' },
            { value: 'common', label: 'Commune' },
            { value: 'good', label: 'Bonne' },
            { value: 'excellent', label: 'Excellente' },
            { value: 'masterwork', label: 'Chef-d\'œuvre' }
          ]
        },
        {
          name: 'properties',
          label: 'Propriétés physiques & arcaniques',
          type: 'textarea',
          rows: 4,
          placeholder: 'Résistance thermique, conductivité magique, poids...'
        },
        {
          name: 'uses',
          label: 'Utilisations artisanales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Forge d\'armes, création de potions, enchantements...'
        }
      ]
    },
    {
      id: 'source',
      label: 'Provenance',
      icon: MapPin,
      fields: [
        {
          name: 'source',
          label: 'Origine géographique / Biologique',
          type: 'textarea',
          rows: 3,
          placeholder: 'Où et comment trouver ce matériau...'
        },
        {
          name: 'rarity',
          label: 'Rareté mondiale',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' },
            { value: 'legendary', label: 'Légendaire' }
          ]
        },
        {
          name: 'harvesting',
          label: 'Protocole de récolte',
          type: 'textarea',
          rows: 2,
          placeholder: 'Extraction, chasse, cueillette, distillation...'
        }
      ]
    },
    {
      id: 'value',
      label: 'Économie',
      icon: DollarSign,
      fields: [
        {
          name: 'value',
          label: 'Valeur marchande par unité',
          type: 'text',
          placeholder: 'Ex: 10 po/kg, 50 po/unité...'
        },
        {
          name: 'availability',
          label: 'Canaux de distribution',
          type: 'text',
          placeholder: 'Marchés noirs, guildes artisanales...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'material_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'État Brut' },
            { id: 'processed', label: 'État Traité' },
            { id: 'crafted', label: 'Objet Fini' }
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

export default function CraftingMaterialsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('crafting_materials').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('crafting_materials').delete().eq('id', deleteConfirm.item.id);
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
        title="Détruire le Matériau"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des registres d'artisanat ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="crafting_materials"
        title="Matériaux"
        icon={Hammer}
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
        config={craftingMaterialsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={craftingMaterialsConfig}
      />
    </div>
  );
}