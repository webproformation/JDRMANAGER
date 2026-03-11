import { useState, useRef, useEffect } from 'react';
import { PawPrint, Info, Heart, MapPin, Sparkles, ImageIcon, Shield, Plus, Minus, Zap, Target, Sword, Skull, ChevronDown } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import { DEFAULT_RULESETS } from '../data/rulesets'; 
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
        className={`vtt-select flex items-center justify-between cursor-pointer transition-all min-h-[38px] py-1.5 px-3 ${
          isOpen ? 'border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : ''
        }`}
      >
        <span className={`truncate text-[11px] font-bold tracking-wider ${value ? 'text-white' : 'text-silver/30'}`}>
          {selectedOption ? selectedOption.label : (placeholder || 'Choisir...')}
        </span>
        <ChevronDown size={14} className={`text-teal-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[200] w-full mt-1 bg-[#0f111a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:bg-teal-500/10 hover:text-teal-400 border-b border-white/5 last:border-0 ${
                  value === opt.value ? 'bg-teal-500/20 text-teal-300' : 'text-silver/60'
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
const HABITAT_OPTIONS = [
  { value: 'foret', label: 'Forêt' }, { value: 'montagne', label: 'Montagne' },
  { value: 'plaine', label: 'Plaine' }, { value: 'desert', label: 'Désert' },
  { value: 'marais', label: 'Marais' }, { value: 'ocean', label: 'Océan' },
  { value: 'urbain', label: 'Urbain' }, { value: 'caverne', label: 'Caverne' },
  { value: 'arctique', label: 'Arctique' }, { value: 'tropical', label: 'Tropical' },
  { value: 'littoral', label: 'Littoral' }, { value: 'souterrain', label: 'Souterrain' }
];

const ATTACK_TYPES = [
  { value: 'griffe', label: 'Griffes' }, { value: 'morsure', label: 'Morsure' },
  { value: 'tentacule', label: 'Tentacules' }, { value: 'venin_crachat', label: 'Venin (Crachat)' },
  { value: 'venin_morsure', label: 'Venin (Morsure)' }, { value: 'charge', label: 'Charge' },
  { value: 'ecrasement', label: 'Écrasement' }, { value: 'sabot', label: 'Sabots' },
  { value: 'piqure', label: 'Piqûre' }, { value: 'corne', label: 'Cornes' },
  { value: 'coup_de_bec', label: 'Coup de bec' }, { value: 'serre', label: 'Serres' }
];

const DAMAGE_DICE = [
  { value: '1', label: '1 pt' }, { value: '1d4', label: '1d4' }, { value: '1d6', label: '1d6' },
  { value: '1d8', label: '1d8' }, { value: '1d10', label: '1d10' }, { value: '1d12', label: '1d12' },
  { value: '2d4', label: '2d4' }, { value: '2d6', label: '2d6' }, { value: '2d8', label: '2d8' },
  { value: '2d10', label: '2d10' }, { value: '3d6', label: '3d6' }, { value: '4d6', label: '4d6' },
  { value: '5d6', label: '5d6' }, { value: '8d6', label: '8d6' }
];

const RANGES = [
  { value: '1.5m', label: 'Contact (1.5m)' }, { value: '3m', label: 'Allonge (3m)' },
  { value: '6m', label: 'Portée courte (6m)' }, { value: '9m', label: 'Portée moyenne (9m)' },
  { value: '18m', label: 'Distance (18m)' }, { value: '30m', label: 'Longue (30m)' },
  { value: '60m', label: 'Extrême (60m)' }
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

  const removeAttack = (index) => {
    onChange({ ...data, attacks: attacks.filter((_, i) => i !== index) });
  };

  const updateBonus = (stat, amount) => {
    const newValue = (masterBonuses[stat] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) {
      onChange({ ...data, bonuses: { ...masterBonuses, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner space-y-12 mb-6">
      <p className="text-xs text-silver/50 italic border-l-2 border-teal-500/30 pl-4 font-medium tracking-wide">
        Configuration technique VTT. Ces données alimentent l'onglet Combat lors des sessions.
      </p>
      
      {/* VITALITÉ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label className="text-[10px] font-black uppercase text-teal-400 block mb-3 ml-1">Classe d'Armure (CA)</label>
          <div className="vtt-counter-container h-[38px]">
            <button type="button" className="vtt-btn-counter vtt-btn-minus w-9" onClick={() => updateField('ac', (data.ac || 10) - 1)}>-</button>
            <input type="number" value={data.ac || 10} onChange={(e) => updateField('ac', parseInt(e.target.value) || 0)} className="vtt-input-number text-sm" />
            <button type="button" className="vtt-btn-counter vtt-btn-plus w-9" onClick={() => updateField('ac', (data.ac || 10) + 1)}>+</button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-teal-400 block mb-3 ml-1">Points de Vie</label>
          <input type="text" value={data.hp || ''} onChange={(e) => updateField('hp', e.target.value)} className="w-full h-[38px] bg-black/40 border border-white/10 rounded-xl px-4 text-white text-center font-bold text-sm focus:border-teal-500/50 outline-none shadow-inner" placeholder="Ex: 2d8+4" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-teal-400 block mb-3 ml-1">Vitesse au sol</label>
          <input type="text" value={data.speed || ''} onChange={(e) => updateField('speed', e.target.value)} className="w-full h-[38px] bg-black/40 border border-white/10 rounded-xl px-4 text-white text-center font-bold text-sm focus:border-teal-500/50 outline-none shadow-inner" placeholder="Ex: 12m" />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pt-10 border-t border-white/5">
        <div className="flex justify-between items-center mb-8">
          <label className="text-[10px] font-black uppercase text-orange-500 flex items-center gap-3"><Sword size={16} /> Actions & Capacités</label>
          <button type="button" onClick={addAttack} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg border border-orange-500/20"><Plus size={14} /> Ajouter</button>
        </div>
        <div className="space-y-4">
          {attacks.map((atk, index) => (
            <div key={index} className="bg-black/40 border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-end shadow-inner animate-in slide-in-from-right-4">
              <div className="md:col-span-3">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Type</label>
                <VTTSelectLocal value={atk.type} options={ATTACK_TYPES} onChange={(v) => updateAttack(index, 'type', v)} placeholder="Type..." />
              </div>
              <div className="md:col-span-3">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Dégâts</label>
                <VTTSelectLocal value={atk.damage} options={DAMAGE_DICE} onChange={(v) => updateAttack(index, 'damage', v)} placeholder="Dés..." />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Portée</label>
                <VTTSelectLocal value={atk.range} options={RANGES} onChange={(v) => updateAttack(index, 'range', v)} placeholder="Dist..." />
              </div>
              <div className="md:col-span-3">
                <label className="text-[9px] font-black text-silver/40 uppercase mb-3 block">Effet spécial</label>
                <input type="text" value={atk.effect} onChange={(e) => updateAttack(index, 'effect', e.target.value)} className="w-full bg-[#0f111a] border border-white/10 rounded-xl p-2 text-xs text-white outline-none focus:border-orange-500/50 min-h-[38px]" placeholder="CC, DD, Effet..." />
              </div>
              <div className="md:col-span-1">
                <button type="button" onClick={() => removeAttack(index)} className="w-full h-[38px] flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 border border-red-500/20"><Skull size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(statLabels).map(([key, label]) => (
          <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-4 hover:bg-white/10 transition-colors shadow-inner">
            <span className="text-[9px] font-black text-silver/40 uppercase tracking-widest">{label}</span>
            <span className="text-3xl font-black text-white">{stats[key] || 10}</span>
            <div className="vtt-counter-container h-8 w-full border-white/5">
              <button type="button" className="vtt-btn-counter vtt-btn-minus text-sm w-10" onClick={() => updateStat(key, -1)}>-</button>
              <button type="button" className="vtt-btn-counter vtt-btn-plus text-sm w-10" onClick={() => updateStat(key, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* BONUS */}
      <div className="pt-10 border-t border-white/5">
        <label className="text-[10px] font-black uppercase text-teal-400 block mb-8 flex items-center gap-3"><Heart size={16} /> Influence sur le Maître</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(statLabels).map(([key, label]) => {
            const val = masterBonuses[key] || 0;
            return (
              <div key={key} className="bg-black/40 rounded-2xl p-5 border border-white/5 flex flex-col items-center gap-4 shadow-inner">
                <span className="text-[10px] font-black uppercase text-silver/60 tracking-widest">{label}</span>
                <div className="vtt-counter-container w-full h-[38px]">
                  <button type="button" className="vtt-btn-counter vtt-btn-minus w-9" onClick={() => updateBonus(key, -1)}>-</button>
                  <div className={`flex-1 flex items-center justify-center text-2xl font-black ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</div>
                  <button type="button" className="vtt-btn-counter vtt-btn-plus w-9" onClick={() => updateBonus(key, 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const animalsConfig = {
  entityName: "l'animal", tableName: 'animals', title: 'Animaux',
  getHeaderIcon: () => PawPrint, getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general', label: 'Informations générales', icon: Info, columns: 3,
      fields: [
        { name: 'image_url', label: 'Image principale', type: 'image' },
        // --- GRILLE D'IDENTITÉ HERO SWAPPÉE ---
        { name: 'name', label: "Nom de l'animal", type: 'text', required: true, placeholder: 'Ex: Loup des neiges...' },
        { name: 'ruleset_id', label: 'Système de Règles local', type: 'select', options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { name: 'subtitle', label: 'Nom scientifique ou surnom', type: 'text', placeholder: 'Ex: Canis lupus...' },
        { name: 'world_id', label: 'Monde', type: 'relation', table: 'worlds', placeholder: 'Sélectionner un monde' },
        { name: 'type', label: 'Type biologique', type: 'text', placeholder: 'Ex: Mammifère carnivore...' },
        { name: 'size', label: 'Taille', type: 'text', placeholder: 'Ex: Moyen (1.5m)...' },
        { name: 'description', label: 'Description physique', type: 'textarea', rows: 5, placeholder: 'Apparence...' },
        { name: 'dynamic_animal', label: 'Propriétés Système', type: 'custom', isVirtual: true, component: (props) => <RulesetDynamicFields rulesetId={props.formData.ruleset_id} entityType="monster" formData={props.formData} onChange={props.onFullChange} /> }
      ]
    },
    {
      id: 'ecology', label: 'Écologie & Habitat', icon: MapPin, columns: 3,
      fields: [
        { name: 'habitat', label: 'Habitat naturel', type: 'select', options: HABITAT_OPTIONS },
        { name: 'diet', label: 'Régime alimentaire', type: 'select', options: [{ value: 'carnivore', label: 'Carnivore' }, { value: 'herbivore', label: 'Herbivore' }, { value: 'omnivore', label: 'Omnivore' }] },
        { name: 'lifespan', label: 'Durée de vie', type: 'text', placeholder: 'Ex: 15-20 ans...' },
        { name: 'reproduction', label: 'Reproduction', type: 'textarea', rows: 5 },
        { name: 'diet_details', label: 'Détails alimentaires', type: 'textarea', rows: 5 },
        { name: 'habitat_description', label: 'Description de l\'habitat', type: 'textarea', rows: 5 }
      ]
    },
    {
      id: 'behavior', label: 'Comportement', icon: Heart, columns: 3,
      fields: [
        { name: 'behavior', label: 'Comportement général', type: 'textarea', rows: 5 },
        { name: 'social_structure', label: 'Structure sociale', type: 'textarea', rows: 5 },
        { name: 'intelligence', label: 'Intelligence (VTT)', type: 'text' },
        { name: 'temperament', label: 'Tempérament', type: 'text' }
      ]
    },
    {
      id: 'vtt', label: 'Capacités VTT & Combat', icon: Target, columns: 3,
      fields: [
        // MARQUÉ ISVIRTUAL POUR MASQUER EN MODE CONSULTATION
        { name: 'data', label: 'Moteur de Règles VTT', type: 'custom', component: AnimalMechanicsEditor, fullWidth: true, isVirtual: true },
        { name: 'uses', label: 'Ressources & Utilités', type: 'textarea', rows: 5, placeholder: 'Viande, cuir...', fullWidth: false },
        { name: 'special_abilities', label: 'Capacités innées', type: 'textarea', rows: 5, placeholder: 'Vision...', fullWidth: false },
        { name: 'training_difficulty', label: 'Difficulté dressage', type: 'select', fullWidth: false, options: [{ value: 'easy', label: 'Facile' }, { value: 'medium', label: 'Moyen' }, { value: 'hard', label: 'Difficile' }] },
        { name: 'domesticable', label: 'Domestication', type: 'select', options: [{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }] },
        { name: 'rideable', label: 'Peut servir de monture', type: 'select', options: [{ value: 'yes', label: 'Oui' }, { value: 'no', label: 'Non' }] }
      ]
    },
    { id: 'gallery', label: "Galerie d'images", icon: ImageIcon, fields: [{ name: 'animal_images', label: "Images", type: 'images', bucket: 'images', categories: [{ id: 'adult', label: 'Adulte' }, { id: 'habitat', label: 'Habitat' }, { id: 'variants', label: 'Variantes' }] }] },
    { id: 'gm', label: 'Notes MJ', icon: Shield, fields: [{ name: 'notes', label: 'Secrets & Informations secrètes', type: 'textarea', rows: 5 }] }
  ]
};

export default function AnimalsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => { setRefreshKey(prev => prev + 1); setShowForm(false); setEditingItem(null); };

  return (
    <>
      <EntityList key={refreshKey} tableName="animals" title="Animaux" onView={setSelectedItem} onEdit={(i) => { setEditingItem(i); setShowForm(true); }} onCreate={() => { setEditingItem(null); setShowForm(true); }} />
      <EnhancedEntityDetail isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }} onDelete={async () => { if (!selectedItem || !window.confirm('Supprimer ?')) return; await supabase.from('animals').delete().eq('id', selectedItem.id); setSelectedItem(null); setRefreshKey(p => p + 1); }} item={selectedItem} config={animalsConfig} />
      <EnhancedEntityForm isOpen={showForm} onClose={() => { setShowForm(false); setEditingItem(null); }} onSuccess={handleSuccess} item={editingItem} config={animalsConfig} />
    </>
  );
}