import { useState } from 'react';
import { Leaf, Info, MapPin, Beaker, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (PLANTES) ---
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
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les effets mécaniques de cette plante pour le VTT (ex: soins si ingérée, dégâts de poison, altération temporaire des caractéristiques).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Restauration / Dégâts PV</label>
          <input 
            type="text" 
            value={data.hp_effect || ''} 
            onChange={(e) => updateField('hp_effect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: +2d4+2 (Soin) ou -1d6 (Poison)"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Durée de l'effet</label>
          <input 
            type="text" 
            value={data.effect_duration || ''} 
            onChange={(e) => updateField('effect_duration', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Instantané, 1 heure, 1d4 tours..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Altération des Caractéristiques (Bonus / Malus)
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

const plantsConfig = {
  entityName: 'la plante',
  tableName: 'plants',
  title: 'Plantes',
  getHeaderIcon: () => Leaf,
  getHeaderColor: () => 'from-green-600/30 via-emerald-500/20 to-lime-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles lié',
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
          label: 'Nom de la plante',
          type: 'text',
          required: true,
          placeholder: 'Nom botanique ou commun'
        },
        {
          name: 'subtitle',
          label: 'Nom scientifique ou surnom',
          type: 'text',
          placeholder: 'Ex: Flora magicus, Herbe d\'éclat...'
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
            { value: 'herb', label: 'Herbe' },
            { value: 'flower', label: 'Fleur' },
            { value: 'tree', label: 'Arbre' },
            { value: 'mushroom', label: 'Champignon' },
            { value: 'vine', label: 'Plante grimpante' },
            { value: 'aquatic', label: 'Plante aquatique' },
            { value: 'magical', label: 'Plante magique' }
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
          placeholder: 'Description visuelle, taille, couleurs, caractéristiques distinctives...'
        }
      ]
    },
    {
      id: 'habitat',
      label: 'Habitat & Croissance',
      icon: MapPin,
      fields: [
        {
          name: 'habitat',
          label: 'Habitat & Localisation',
          type: 'text',
          placeholder: 'Forêt dense, marais, montagne, cavernes...'
        },
        {
          name: 'climate',
          label: 'Climat',
          type: 'select',
          options: [
            { value: 'tropical', label: 'Tropical' },
            { value: 'temperate', label: 'Tempéré' },
            { value: 'arctic', label: 'Arctique' },
            { value: 'desert', label: 'Désertique' },
            { value: 'any', label: 'Tous climats' }
          ]
        },
        {
          name: 'season',
          label: 'Saison de croissance',
          type: 'text',
          placeholder: 'Printemps, été, toute l\'année...'
        },
        {
          name: 'growth_time',
          label: 'Temps de croissance',
          type: 'text',
          placeholder: 'Ex: 3 mois, 1 an, 50 ans...'
        },
        {
          name: 'growing_conditions',
          label: 'Conditions de croissance',
          type: 'textarea',
          rows: 3,
          placeholder: 'Sol, lumière, eau, température nécessaires...'
        }
      ]
    },
    {
      id: 'harvest',
      label: 'Récolte',
      icon: Beaker,
      fields: [
        {
          name: 'harvest_difficulty',
          label: 'Difficulté de récolte',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
        },
        {
          name: 'harvest_season',
          label: 'Saison de récolte',
          type: 'text',
          placeholder: 'Ex: Fin d\'été, automne, toute l\'année...'
        },
        {
          name: 'parts_used',
          label: 'Parties utilisées',
          type: 'text',
          placeholder: 'Feuilles, racines, fleurs, écorce, fruits...'
        },
        {
          name: 'yield',
          label: 'Rendement',
          type: 'text',
          placeholder: 'Quantité obtenue par récolte'
        },
        {
          name: 'preservation',
          label: 'Conservation',
          type: 'textarea',
          rows: 2,
          placeholder: 'Méthodes de séchage, stockage...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés & Usages',
      icon: Beaker,
      fields: [
        {
          name: 'data', // COLONNE VTT (Conservé tel quel)
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: EffectMechanicsEditor
        },
        {
          name: 'properties',
          label: 'Propriétés',
          type: 'textarea',
          rows: 4,
          placeholder: 'Propriétés médicinales, magiques, alchimiques...'
        },
        {
          name: 'effects',
          label: 'Effets',
          type: 'textarea',
          rows: 3,
          placeholder: 'Effets quand consommée, appliquée ou utilisée...'
        },
        {
          name: 'uses',
          label: 'Utilisations',
          type: 'textarea',
          rows: 4,
          placeholder: 'Alchimie, cuisine, médecine, artisanat, rituels magiques...'
        },
        {
          name: 'preparation',
          label: 'Préparation',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment préparer la plante pour utilisation...'
        },
        {
          name: 'toxicity_level',
          label: 'Niveau de toxicité',
          type: 'select',
          options: [
            { value: 'none', label: 'Non toxique' },
            { value: 'low', label: 'Légèrement toxique' },
            { value: 'medium', label: 'Toxique' },
            { value: 'high', label: 'Très toxique' },
            { value: 'deadly', label: 'Mortel' }
          ]
        },
        {
          name: 'side_effects',
          label: 'Effets secondaires',
          type: 'textarea',
          rows: 2,
          placeholder: 'Effets indésirables, contre-indications...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'plant_images',
          label: 'Images de la plante',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'whole', label: 'Plante entière' },
            { id: 'flowers', label: 'Fleurs/Fruits' },
            { id: 'leaves', label: 'Feuilles' },
            { id: 'habitat', label: 'Dans son habitat' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'lore',
          label: 'Histoire & Légendes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Mythes, légendes, anecdotes historiques...'
        },
        {
          name: 'notes',
          label: 'Notes MJ',
          type: 'textarea',
          rows: 3,
          placeholder: 'Informations supplémentaires...'
        }
      ]
    }
  ]
};

export default function PlantsPage() {
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
    if (!selectedItem || !confirm('Supprimer cette plante ?')) return;
    const { supabase } = await import('../lib/supabase');
    await supabase.from('plants').delete().eq('id', selectedItem.id);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="plants"
        title="Plantes"
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
        config={plantsConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={plantsConfig}
      />
    </>
  );
}