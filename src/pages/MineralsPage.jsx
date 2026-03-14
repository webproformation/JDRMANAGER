import { useState, useEffect } from 'react';
import { Gem, Info, MapPin, Hammer, DollarSign, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (MINÉRAUX) ---
const MineralMechanicsEditor = ({ value = {}, onChange }) => {
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
        Propriétés mécaniques pour la forge VTT (Armes, Armures, Artefacts)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Modificateur de Poids</label>
          <input 
            type="text" value={data.weight_modifier || ''} onChange={(e) => updateField('weight_modifier', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: -50% (Mithril) ou x2 (Plomb)"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Bonus d'Équipement</label>
          <input 
            type="text" value={data.equipment_bonus || ''} onChange={(e) => updateField('equipment_bonus', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: +1 CA ou +1 aux dégâts"
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">
        Bonus de Caractéristiques (Gemmes serties)
      </label>
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

const mineralsConfig = {
  entityName: 'le minéral',
  tableName: 'minerals',
  title: 'Minéraux & Gemmes',
  getHeaderIcon: () => Gem,
  getHeaderColor: () => 'from-violet-600/30 via-purple-500/20 to-fuchsia-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id',
          label: 'Système de Règles local',
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
          component: (props) => (
            <RulesetDynamicFields 
              rulesetId={props.formData.ruleset_id || 'dnd5'} 
              entityType="item" 
              formData={props.formData} 
              onChange={props.onChange}
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du minéral',
          type: 'text',
          required: true,
          placeholder: 'Nom du minéral ou de la pierre'
        },
        {
          name: 'subtitle',
          label: 'Nom alternatif ou surnom',
          type: 'text',
          placeholder: 'Ex: Pierre de lune, Cristal éternel...'
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
          name: 'type',
          label: 'Catégorie',
          type: 'custom',
          component: (props) => (
            <MultiSelectWithOther 
              {...props} 
              options={['Métal', 'Pierre précieuse', 'Cristal', 'Minerai brut', 'Minéral magique', 'Substance alchimique']} 
            />
          )
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
          placeholder: 'Couleur, éclat, transparence...'
        }
      ]
    },
    {
      id: 'location',
      label: 'Gisements',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Localisation géographique',
          type: 'text',
          placeholder: 'Montagnes, grottes profondes, volcans...'
        },
        {
          name: 'formation',
          label: 'Origine géologique',
          type: 'text',
          placeholder: 'Activité volcanique, dépôts sédimentaires...'
        },
        {
          name: 'depth',
          label: 'Profondeur d\'extraction',
          type: 'text',
          placeholder: 'Surface, Abysses, 50m de profondeur...'
        },
        {
          name: 'associated_minerals',
          label: 'Minéraux associés',
          type: 'textarea',
          rows: 2
        }
      ]
    },
    {
      id: 'extraction',
      label: 'Minage',
      icon: Hammer,
      fields: [
        {
          name: 'extraction_method',
          label: "Méthode d'extraction",
          type: 'textarea',
          rows: 3,
          placeholder: 'Minage, tamisage, collecte en surface...'
        },
        {
          name: 'extraction_difficulty',
          label: "Difficulté de récolte",
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyenne' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
        },
        {
          name: 'processing',
          label: 'Traitement requis (Raffinage)',
          type: 'textarea',
          rows: 3,
          placeholder: 'Fusion, taille, polissage...'
        }
      ]
    },
    {
      id: 'properties_tab',
      label: 'Propriétés',
      icon: Gem,
      fields: [
        {
          name: 'data',
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: MineralMechanicsEditor
        },
        {
          name: 'hardness',
          label: 'Dureté (Échelle de Mohs)',
          type: 'text'
        },
        {
          name: 'weight',
          label: 'Poids par unité standard',
          type: 'text'
        },
        {
          name: 'magical_properties',
          label: 'Propriétés arcaniques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Amplification magique, channeling...'
        }
      ]
    },
    {
      id: 'value_tab',
      label: 'Économie',
      icon: DollarSign,
      fields: [
        {
          name: 'market_value',
          label: 'Valeur marchande (Raffiné)',
          type: 'text',
          placeholder: 'Ex: 100 po / carat'
        },
        {
          name: 'uses',
          label: 'Utilisations industrielles/artisanales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Forge d\'armes, bijouterie, alchimie...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'mineral_images',
          label: 'Photothèque minérale',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'État Brut' },
            { id: 'cut', label: 'État Taillé' },
            { id: 'deposit', label: 'Gisement' }
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
          name: 'lore',
          label: 'Histoire & Légendes',
          type: 'textarea',
          rows: 4
        },
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

export default function MineralsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('minerals').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('minerals').delete().eq('id', deleteConfirm.item.id);
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
        title="Détruire le Minéral"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} ? Les gisements s'épuiseront à jamais.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="minerals"
        title="Minéraux"
        icon={Gem}
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
        config={mineralsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={mineralsConfig}
      />
    </div>
  );
}