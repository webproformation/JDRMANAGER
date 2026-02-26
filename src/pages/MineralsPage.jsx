import { useState } from 'react';
import { Gem, Info, MapPin, Hammer, DollarSign, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

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
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les propriétés mécaniques de ce minéral pour la forge VTT. Ces valeurs s'appliqueront aux armes et armures fabriquées avec ce matériau.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Modificateur de Poids</label>
          <input 
            type="text" value={data.weight_modifier || ''} onChange={(e) => updateField('weight_modifier', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: -50% (Mithril) ou x2 (Plomb)"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Modificateur d'Armure / Dégâts</label>
          <input 
            type="text" value={data.equipment_bonus || ''} onChange={(e) => updateField('equipment_bonus', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: +1 CA ou +1 aux dégâts tranchants"
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus Magiques (Si porté en amulette/gemme)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = bonuses[key] || 0;
          return (
            <div key={key} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updateBonus(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                <button type="button" onClick={() => updateBonus(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"><Plus size={14}/></button>
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
  title: 'Minéraux',
  getHeaderIcon: () => Gem,
  getHeaderColor: () => 'from-violet-600/30 via-purple-500/20 to-fuchsia-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_item_fields', // INJECTEUR DYNAMIQUE (AJOUTÉ)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="item" 
              formData={formData} 
              onChange={onChange} 
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
          label: 'Image principale',
          type: 'image'
        },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'metal', label: 'Métal' },
            { value: 'gemstone', label: 'Pierre précieuse' },
            { value: 'crystal', label: 'Cristal' },
            { value: 'ore', label: 'Minerai' },
            { value: 'magical', label: 'Minéral magique' }
          ]
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
          label: 'Description & Apparence',
          type: 'textarea',
          rows: 5,
          placeholder: 'Couleur, éclat, transparence, forme cristalline...'
        },
        {
          name: 'appearance',
          label: 'Aspect visuel',
          type: 'text',
          placeholder: 'Bleu azur, translucide avec veines dorées...'
        }
      ]
    },
    {
      id: 'location',
      label: 'Localisation & Formation',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Localisation',
          type: 'text',
          placeholder: 'Montagnes, grottes profondes, volcans, rivières...'
        },
        {
          name: 'formation',
          label: 'Formation géologique',
          type: 'text',
          placeholder: 'Activité volcanique, dépôts sédimentaires...'
        },
        {
          name: 'depth',
          label: 'Profondeur typique',
          type: 'text',
          placeholder: 'Surface, 50m de profondeur, grottes profondes...'
        },
        {
          name: 'associated_minerals',
          label: 'Minéraux associés',
          type: 'textarea',
          rows: 2,
          placeholder: 'Autres minéraux trouvés dans les mêmes gisements...'
        }
      ]
    },
    {
      id: 'extraction',
      label: 'Extraction & Traitement',
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
          label: "Difficulté d'extraction",
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
          label: 'Traitement requis',
          type: 'textarea',
          rows: 3,
          placeholder: 'Raffinage, taille, polissage, fusion...'
        },
        {
          name: 'tools_required',
          label: 'Outils nécessaires',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pics, marteaux, fours, outils spéciaux...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Info,
      fields: [
        {
          name: 'data', // COLONNE VTT (CONSERVÉ)
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: MineralMechanicsEditor
        },
        {
          name: 'hardness',
          label: 'Dureté',
          type: 'text',
          placeholder: 'Échelle de Mohs : 1-10'
        },
        {
          name: 'weight',
          label: 'Poids par unité',
          type: 'text',
          placeholder: '0.5 kg, 2 kg...'
        },
        {
          name: 'properties',
          label: 'Propriétés physiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Conductivité, résistance, malléabilité...'
        },
        {
          name: 'magical_properties',
          label: 'Propriétés magiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Amplification magique, protection, channeling...'
        },
        {
          name: 'special_properties',
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 2,
          placeholder: 'Luminescence, radioactivité, réactivité...'
        },
        {
          name: 'dangers',
          label: 'Dangers & Précautions',
          type: 'textarea',
          rows: 2,
          placeholder: 'Radioactif, toxique, instable...'
        }
      ]
    },
    {
      id: 'uses',
      label: 'Utilisations & Valeur',
      icon: DollarSign,
      fields: [
        {
          name: 'uses',
          label: 'Utilisations',
          type: 'textarea',
          rows: 4,
          placeholder: 'Forge d\'armes, bijouterie, alchimie, enchantements...'
        },
        {
          name: 'crafting_uses',
          label: 'Utilisation en artisanat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Objets magiques, armures, armes, bijoux...'
        },
        {
          name: 'market_value',
          label: 'Valeur marchande',
          type: 'text',
          placeholder: '10 po, 100 po, 1000 po...'
        },
        {
          name: 'value_factors',
          label: 'Facteurs de valeur',
          type: 'textarea',
          rows: 2,
          placeholder: 'Pureté, taille, qualité, rareté locale...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'mineral_images',
          label: 'Images du minéral',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'Brut' },
            { id: 'cut', label: 'Taillé' },
            { id: 'deposit', label: 'Gisement' },
            { id: 'uses', label: 'Utilisations' }
          ]
        }
      ]
    },
    {
      id: 'gm', // SÉCURITÉ MJ
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'lore',
          label: 'Histoire & Légendes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mythes, légendes, découvertes historiques...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Informations supplémentaires...'
        }
      ]
    }
  ]
};

export default function MineralsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleView = (item) => setSelectedItem(item);
  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedItem(null);
    setShowForm(true);
  };
  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };
  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
  };
  const handleDelete = async () => {
    if (!selectedItem || !confirm('Supprimer ce minéral ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('minerals').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="minerals"
        title="Minéraux"
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={handleDelete}
        item={selectedItem}
        config={mineralsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={mineralsConfig}
      />
    </>
  );
}