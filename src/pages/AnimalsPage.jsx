import { useState } from 'react';
import { PawPrint, Info, Heart, MapPin, Sparkles, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (ANIMAUX) ---
const AnimalMechanicsEditor = ({ value = {}, onChange }) => {
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
        Configurez les statistiques VTT de l'animal. S'il sert de familier ou de monture, ces valeurs (CA, PV, Vitesse) et ces bonus de caractéristiques s'appliqueront à son maître.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Classe d'Armure (CA)</label>
          <input 
            type="number" value={data.ac || ''} onChange={(e) => updateField('ac', parseInt(e.target.value) || 0)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: 13"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Points de Vie (PV)</label>
          <input 
            type="text" value={data.hp || ''} onChange={(e) => updateField('hp', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: 2d8+2"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Vitesse (Monture)</label>
          <input 
            type="text" value={data.speed || ''} onChange={(e) => updateField('speed', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: 18m"
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus accordés au Maître (Familier / Compagnon)
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

const animalsConfig = {
  entityName: "l'animal",
  tableName: 'animals',
  title: 'Animaux',
  getHeaderIcon: () => PawPrint,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_animal', // INJECTEUR DYNAMIQUE (Utilise la clé monster car les animaux sont des créatures)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="monster" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: "Nom de l'animal",
          type: 'text',
          required: true,
          placeholder: 'Ex: Loup des neiges, Aigle royal...'
        },
        {
          name: 'subtitle',
          label: 'Nom scientifique ou surnom',
          type: 'text',
          placeholder: 'Ex: Canis lupus nivalis, Chasseur silencieux...'
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
            { value: 'mammal', label: 'Mammifère' },
            { value: 'bird', label: 'Oiseau' },
            { value: 'reptile', label: 'Reptile' },
            { value: 'amphibian', label: 'Amphibien' },
            { value: 'fish', label: 'Poisson' },
            { value: 'insect', label: 'Insecte' },
            { value: 'magical', label: 'Créature magique' }
          ]
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'select',
          required: true,
          options: [
            { value: 'Minuscule', label: 'Minuscule' },
            { value: 'Très Petit', label: 'Très Petit' },
            { value: 'Petit', label: 'Petit' },
            { value: 'Moyen', label: 'Moyen' },
            { value: 'Grand', label: 'Grand' },
            { value: 'Très Grand', label: 'Très Grand' },
            { value: 'Gigantesque', label: 'Gigantesque' }
          ]
        },
        {
          name: 'description',
          label: 'Description physique',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, traits distinctifs, coloration...'
        }
      ]
    },
    {
      id: 'ecology',
      label: 'Écologie',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Habitat naturel',
          type: 'text',
          placeholder: 'Forêt, montagne, désert, marais, océan...'
        },
        {
          name: 'habitat_description',
          label: 'Description de l\'habitat',
          type: 'textarea',
          rows: 3,
          placeholder: 'Environnement préféré, conditions de vie...'
        },
        {
          name: 'diet',
          label: 'Régime alimentaire',
          type: 'select',
          options: [
            { value: 'carnivore', label: 'Carnivore' },
            { value: 'herbivore', label: 'Herbivore' },
            { value: 'omnivore', label: 'Omnivore' },
            { value: 'insectivore', label: 'Insectivore' }
          ]
        },
        {
          name: 'diet_details',
          label: 'Détails alimentaires',
          type: 'textarea',
          rows: 2,
          placeholder: 'Proies préférées, plantes consommées...'
        },
        {
          name: 'lifespan',
          label: 'Durée de vie',
          type: 'text',
          placeholder: 'Ex: 5-10 ans, 50 ans...'
        },
        {
          name: 'reproduction',
          label: 'Reproduction',
          type: 'textarea',
          rows: 2,
          placeholder: 'Saison, portée, gestation...'
        }
      ]
    },
    {
      id: 'behavior',
      label: 'Comportement',
      icon: Heart,
      fields: [
        {
          name: 'behavior',
          label: 'Comportement général',
          type: 'textarea',
          rows: 4,
          placeholder: 'Agressif, territorial, pacifique, grégaire, solitaire...'
        },
        {
          name: 'social_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 3,
          placeholder: 'Solitaire, meute, troupeau, colonie...'
        },
        {
          name: 'intelligence',
          label: 'Intelligence',
          type: 'text',
          placeholder: 'Ex: Rudimentaire, moyenne, élevée...'
        },
        {
          name: 'temperament',
          label: 'Tempérament',
          type: 'text',
          placeholder: 'Ex: Docile, agressif, craintif, curieux...'
        }
      ]
    },
    {
      id: 'uses',
      label: 'Utilisations & VTT',
      icon: Sparkles,
      fields: [
        {
          name: 'data', // COLONNE VTT (Composant AnimalMechanicsEditor conservé)
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: AnimalMechanicsEditor
        },
        {
          name: 'domesticable',
          label: 'Domestication',
          type: 'select',
          options: [
            { value: 'yes', label: 'Domesticable' },
            { value: 'no', label: 'Non domesticable' },
            { value: 'difficult', label: 'Difficile' }
          ]
        },
        {
          name: 'rideable',
          label: 'Peut servir de monture',
          type: 'select',
          options: [
            { value: 'yes', label: 'Oui' },
            { value: 'no', label: 'Non' }
          ]
        },
        {
          name: 'uses',
          label: 'Utilisations & Ressources',
          type: 'textarea',
          rows: 4,
          placeholder: 'Monture, viande, fourrure, gardien, compagnon, ingrédients...'
        },
        {
          name: 'special_abilities',
          label: 'Capacités spéciales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Vol, vision nocturne, venin, carapace...'
        },
        {
          name: 'training_difficulty',
          label: 'Difficulté de dressage',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'impossible', label: 'Impossible' }
          ]
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'animal_images',
          label: "Images de l'animal",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'adult', label: 'Adulte' },
            { id: 'young', label: 'Jeune' },
            { id: 'habitat', label: 'Dans son habitat' },
            { id: 'variants', label: 'Variantes' }
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
          name: 'notes',
          label: 'Notes & Écologie',
          type: 'textarea',
          rows: 4,
          placeholder: 'Rôle dans l\'écosystème, informations additionnelles...'
        }
      ]
    }
  ]
};

export default function AnimalsPage() {
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
    if (!selectedItem || !confirm('Supprimer cet animal ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('animals').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="animals"
        title="Animaux"
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
        config={animalsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={animalsConfig}
      />
    </>
  );
}