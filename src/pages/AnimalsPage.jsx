import { useState, useRef, useEffect } from 'react';
import { 
  PawPrint, Info, Heart, MapPin, Sparkles, ImageIcon, Shield, 
  Plus, Minus, Zap, Target, Sword, Skull, ChevronDown 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT INTERNE : LE SÉLECTEUR GLAMOUR (VTT PREMIUM) ---
const VTTSelectLocal = ({ value, options = [], onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value || opt.value == value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-black/40 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer transition-all min-h-[38px] py-1.5 px-3 ${
          isOpen ? 'border-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.2)]' : ''
        }`}
      >
        <span className={`truncate text-[10px] font-black uppercase tracking-wider ${value ? 'text-white' : 'text-silver/30'}`}>
          {selectedOption ? selectedOption.label : (placeholder || 'Choisir...')}
        </span>
        <ChevronDown size={14} className={`text-[#2DD4BF] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] w-full mt-1 bg-[#0f111a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:bg-[#2DD4BF]/10 hover:text-[#2DD4BF] border-b border-white/5 last:border-0 ${
                  value === opt.value ? 'bg-[#2DD4BF]/20 text-[#2DD4BF]' : 'text-silver/60'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- OPTIONS DE STANDARDISATION ---
const ATTACK_TYPES = [
  { value: 'griffe', label: 'Griffes' }, { value: 'morsure', label: 'Morsure' },
  { value: 'charge', label: 'Charge' }, { value: 'sabot', label: 'Sabots' },
  { value: 'coup_de_bec', label: 'Coup de bec' }, { value: 'serre', label: 'Serres' }
];

const DAMAGE_DICE = [
  { value: '1d4', label: '1d4' }, { value: '1d6', label: '1d6' },
  { value: '1d8', label: '1d8' }, { value: '1d10', label: '1d10' }, { value: '1d12', label: '1d12' },
  { value: '2d6', label: '2d6' }, { value: '2d8', label: '2d8' }
];

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT ---
const AnimalMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const stats = data.stats || { str: 10, dex: 10, con: 10, int: 2, wis: 12, cha: 7 };
  const attacks = data.attacks || [];
  const masterBonuses = data.bonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updateStat = (stat, amount) => {
    const newValue = (stats[stat] || 0) + amount;
    if (newValue >= 1 && newValue <= 30) {
      onChange({ ...data, stats: { ...stats, [stat]: newValue } });
    }
  };

  const addAttack = () => {
    const newAttack = { type: 'morsure', name: 'Morsure', range: '1.5m', damage: '1d6', effect: '' };
    onChange({ ...data, attacks: [...attacks, newAttack] });
  };

  const updateAttack = (index, field, val) => {
    const updatedAttacks = [...attacks];
    updatedAttacks[index] = { ...updatedAttacks[index], [field]: val };
    onChange({ ...data, attacks: updatedAttacks });
  };

  const updateBonus = (stat, amount) => {
    const newValue = (masterBonuses[stat] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) {
      onChange({ ...data, bonuses: { ...masterBonuses, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-black/20 rounded-[2.5rem] p-8 border border-white/5 shadow-inner space-y-12 mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 italic border-l-2 border-[#2DD4BF]/30 pl-4">
        Configuration Technique VTT (Alimente l'onglet Combat)
      </p>
      
      {/* VITALITÉ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label className="text-[10px] font-black uppercase text-[#2DD4BF] block mb-3 ml-1">Classe d'Armure (CA)</label>
          <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden h-[38px]">
            <button type="button" className="w-10 hover:bg-white/5 text-silver transition-colors" onClick={() => updateField('ac', (data.ac || 10) - 1)}>-</button>
            <input type="number" value={data.ac || 10} onChange={(e) => updateField('ac', parseInt(e.target.value) || 0)} className="flex-1 bg-transparent text-center font-black text-white text-sm outline-none" />
            <button type="button" className="w-10 hover:bg-white/5 text-silver transition-colors" onClick={() => updateField('ac', (data.ac || 10) + 1)}>+</button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-[#2DD4BF] block mb-3 ml-1">Points de Vie</label>
          <input type="text" value={data.hp || ''} onChange={(e) => updateField('hp', e.target.value)} className="w-full h-[38px] bg-black/40 border border-white/10 rounded-xl px-4 text-white text-center font-black text-sm focus:border-[#2DD4BF]/50 outline-none" placeholder="Ex: 2d8+4" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-[#2DD4BF] block mb-3 ml-1">Vitesse au sol</label>
          <input type="text" value={data.speed || ''} onChange={(e) => updateField('speed', e.target.value)} className="w-full h-[38px] bg-black/40 border border-white/10 rounded-xl px-4 text-white text-center font-black text-sm focus:border-[#2DD4BF]/50 outline-none" placeholder="Ex: 12m" />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pt-10 border-t border-white/5">
        <div className="flex justify-between items-center mb-8">
          <label className="text-[10px] font-black uppercase text-orange-500 flex items-center gap-3"><Sword size={16} /> Actions & Capacités</label>
          <button type="button" onClick={addAttack} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-xl text-[10px] font-black uppercase transition-all border border-orange-500/20 active:scale-95"><Plus size={14} /> Ajouter</button>
        </div>
        <div className="space-y-4">
          {attacks.map((atk, index) => (
            <div key={index} className="bg-black/40 border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-end animate-in slide-in-from-right-4">
              <div className="md:col-span-3">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Type</label>
                <VTTSelectLocal value={atk.type} options={ATTACK_TYPES} onChange={(v) => updateAttack(index, 'type', v)} />
              </div>
              <div className="md:col-span-3">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Dégâts</label>
                <VTTSelectLocal value={atk.damage} options={DAMAGE_DICE} onChange={(v) => updateAttack(index, 'damage', v)} />
              </div>
              <div className="md:col-span-5">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Effet spécial</label>
                <input type="text" value={atk.effect} onChange={(e) => updateAttack(index, 'effect', e.target.value)} className="w-full bg-[#0f111a] border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-orange-500/50 min-h-[38px]" placeholder="CC, DD, Effet..." />
              </div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => onChange({ ...data, attacks: attacks.filter((_, i) => i !== index) })} className="w-full h-[38px] flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 border border-red-500/20"><Skull size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS & BONUS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-10 border-t border-white/5">
        {Object.entries(statLabels).map(([key, label]) => (
          <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-4 hover:border-[#2DD4BF]/20 transition-all">
            <span className="text-[9px] font-black text-silver/40 uppercase tracking-widest">{label}</span>
            <span className="text-3xl font-black text-white">{stats[key] || 10}</span>
            <div className="flex bg-black/40 border border-white/5 rounded-lg overflow-hidden h-8 w-full">
              <button type="button" className="flex-1 hover:bg-white/5 text-silver transition-colors" onClick={() => updateStat(key, -1)}>-</button>
              <button type="button" className="flex-1 hover:bg-white/5 text-silver transition-colors" onClick={() => updateStat(key, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const animalsConfig = {
  entityName: "l'animal",
  tableName: 'animals',
  title: 'Bestiaire Animalier',
  getHeaderIcon: () => PawPrint,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

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
          name: 'dynamic_animal', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => (
            <RulesetDynamicFields 
              rulesetId={props.formData.ruleset_id || 'dnd5'} 
              entityType="monster" 
              formData={props.formData} 
              onChange={props.onChange} 
            />
          )
        },
        { name: 'name', label: "Nom de l'animal", type: 'text', required: true, placeholder: 'Ex: Loup des neiges...' },
        { name: 'subtitle', label: 'Appellation scientifique / Surnom', type: 'text', placeholder: 'Ex: Canis lupus...' },
        { name: 'world_id', label: 'Monde d\'origine', type: 'relation', table: 'worlds' },
        { name: 'image_url', label: 'Illustration', type: 'image' },
        { name: 'type', label: 'Type biologique', type: 'text', placeholder: 'Mammifère, Reptile, Oiseaux...' },
        { name: 'size', label: 'Taille apparente', type: 'text', placeholder: 'Moyen (1.5m)...' },
        { name: 'description', label: 'Description physique', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie',
      icon: MapPin,
      fields: [
        { name: 'habitat', label: 'Habitat naturel', type: 'text', placeholder: 'Forêts boréales, cavernes...' },
        { name: 'diet', label: 'Régime alimentaire', type: 'select', options: [{ value: 'carnivore', label: 'Carnivore' }, { value: 'herbivore', label: 'Herbivore' }, { value: 'omnivore', label: 'Omnivore' }] },
        { name: 'lifespan', label: 'Durée de vie', type: 'text' },
        { name: 'behavior', label: 'Comportement général', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'vtt',
      label: 'Combat & VTT',
      icon: Target,
      fields: [
        { name: 'data', label: 'Moteur de Règles VTT', type: 'custom', isVirtual: true, component: AnimalMechanicsEditor },
        { name: 'special_abilities', label: 'Capacités innées', type: 'textarea', rows: 4, placeholder: 'Vision nocturne, odorat fin...' },
        { name: 'training_difficulty', label: 'Difficulté de dressage', type: 'select', options: [{ value: 'easy', label: 'Facile' }, { value: 'medium', label: 'Moyen' }, { value: 'hard', label: 'Difficile' }] }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        { name: 'animal_images', label: "Images", type: 'images', bucket: 'images', categories: [{ id: 'adult', label: 'Adulte' }, { id: 'habitat', label: 'Habitat' }, { id: 'variants', label: 'Variantes' }] }
      ]
    },
    {
      id: 'gm',
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'notes', label: 'Secrets & Usages en campagne', type: 'textarea', rows: 6 }
      ]
    }
  ]
};

export default function AnimalsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('animals').select('*').eq('id', id).single();
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

  const handleCreate = () => {
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('animals').delete().eq('id', deleteConfirm.item.id);
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
        title="Bannir la Créature"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} du bestiaire mondial ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="animals"
        title="Bestiaire"
        icon={PawPrint}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => { setSelectedItem(null); cleanURL(); }}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={animalsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={animalsConfig}
      />
    </div>
  );
}