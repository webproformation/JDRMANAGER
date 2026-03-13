import React, { useState } from 'react';
import { Users, Info, User, Landmark, BookOpen, Sparkles, ImageIcon, Shield, Plus, Minus, Globe, Fingerprint } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import { DEFAULT_RULESETS } from '../data/rulesets';

// --- COMPOSANT SPÉCIALISÉ : ÉDITEUR DE BONUS RACIAUX (PRESTIGE EDITION) ---
const RaceBonusEditor = ({ value = {}, onChange }) => {
  const defaultBonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  const bonuses = value.bonuses || defaultBonuses;

  const updateBonus = (stat, amount) => {
    const newValue = (bonuses[stat] || 0) + amount;
    if (newValue >= -4 && newValue <= 4) {
      onChange({ ...value, bonuses: { ...bonuses, [stat]: newValue } });
    }
  };

  const statLabels = {
    str: 'Force', dex: 'Dextérité', con: 'Constitution',
    int: 'Intelligence', wis: 'Sagesse', cha: 'Charisme'
  };

  return (
    <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 shadow-inner">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={18} className="text-amber-400" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Modificateurs de Caractéristiques</h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = bonuses[key] || 0;
          return (
            <div key={key} className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col items-center gap-3 hover:border-amber-500/30 transition-all group">
              <span className="text-[9px] font-black uppercase tracking-widest text-silver/40 group-hover:text-amber-400 transition-colors">{label}</span>
              <div className="flex items-center gap-5">
                <button 
                  type="button"
                  onClick={() => updateBonus(key, -1)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-xl transition-all active:scale-90"
                >
                  <Minus size={16} />
                </button>
                <span className={`text-2xl font-black min-w-[40px] text-center ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>
                  {val > 0 ? `+${val}` : val}
                </span>
                <button 
                  type="button"
                  onClick={() => updateBonus(key, 1)}
                  className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-xl transition-all active:scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CONFIGURATION PRESTIGE V4.2 ---
const racesConfig = {
  entityName: 'la race',
  tableName: 'races',
  title: 'Races & Peuples',
  getHeaderIcon: () => Users,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité & Origines',
      icon: Info,
      fields: [
        {
          name: 'image_url',
          label: 'Portrait Représentatif',
          type: 'image',
          fullWidth: false
        },
        {
          name: 'name',
          label: 'Nom de la Race',
          type: 'text',
          required: true,
          placeholder: 'Ex: Elfe Sylvestre, Nain des Écus...'
        },
        {
          name: 'subtitle',
          label: 'Appellation Commune',
          type: 'text',
          placeholder: 'Ex: Le Peuple des Premiers-Nés...'
        },
        {
          name: 'ruleset_id',
          label: 'Système de Règles',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'world_id',
          label: 'Présence Multiverselle',
          type: 'relation',
          table: 'worlds',
          isVirtual: true // Intercepté par le sélecteur multiversel V4.2
        },
        {
          name: 'description',
          label: 'Lore Fondamental',
          type: 'textarea',
          rows: 6,
          fullWidth: true,
          placeholder: 'Légendes, création et rôle dans l\'histoire...'
        }
      ]
    },
    {
      id: 'biology',
      label: 'Physiologie',
      icon: Fingerprint,
      fields: [
        {
          name: 'size',
          label: 'Catégorie de Taille',
          type: 'static-select',
          options: [
            { value: 'Très Petit', label: 'Très Petit (TP)' },
            { value: 'Petit', label: 'Petit (P)' },
            { value: 'Moyen', label: 'Moyen (M)' },
            { value: 'Grand', label: 'Grand (G)' },
            { value: 'Très Grand', label: 'Très Grand (TG)' }
          ]
        },
        {
          name: 'speed',
          label: 'Vitesse de Base',
          type: 'text',
          placeholder: 'Ex: 9 mètres (30 ft)'
        },
        {
          name: 'lifespan',
          label: 'Longévité',
          type: 'text',
          placeholder: 'Ex: Env. 750 ans'
        },
        {
          name: 'age',
          label: 'Maturité & Cycle de vie',
          type: 'textarea',
          rows: 3,
          placeholder: 'Âge adulte, étapes du vieillissement...'
        },
        {
          name: 'physical_description',
          label: 'Description Anatomique',
          type: 'textarea',
          rows: 4,
          fullWidth: true,
          placeholder: 'Traits distinctifs, couleur de peau, yeux...'
        }
      ]
    },
    {
      id: 'culture',
      label: 'Société & Langues',
      icon: Landmark,
      fields: [
        {
          name: 'languages',
          label: 'Langues Parlées',
          type: 'text',
          placeholder: 'Ex: Commun, Elfique...'
        },
        {
          name: 'alignment',
          label: 'Tendances Morales',
          type: 'text',
          placeholder: 'Ex: Souvent Loyal Bon...'
        },
        {
          name: 'society_structure',
          label: 'Organisation Sociale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Hiérarchie, clans, politique interne...'
        },
        {
          name: 'naming_conventions',
          label: 'Traditions de Nommage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Prénoms, noms de famille, titres honorifiques...'
        }
      ]
    },
    {
      id: 'abilities',
      label: 'Capacités & VTT',
      icon: Sparkles,
      fields: [
        {
          name: 'dynamic_race_fields',
          label: 'Propriétés du Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields rulesetId={formData.ruleset_id} entityType="race" formData={formData} onChange={onChange} />
          )
        },
        {
          name: 'data',
          label: 'Moteur de Bonus VTT',
          type: 'custom',
          fullWidth: true,
          component: RaceBonusEditor
        },
        {
          name: 'traits',
          label: 'Traits Raciaux Passifs',
          type: 'textarea',
          rows: 6,
          placeholder: 'Vision dans le noir, résistances...'
        },
        {
          name: 'racial_abilities',
          label: 'Pouvoirs Actifs',
          type: 'textarea',
          rows: 4,
          placeholder: 'Sorts innés, capacités spéciales...'
        }
      ]
    },
    {
      id: 'homeland',
      label: 'Territoires',
      icon: BookOpen,
      fields: [
        {
          name: 'homeland',
          label: "Milieu Naturel Favori",
          type: 'multi-select-other',
          suggestions: ['Forêts Millénaires', 'Montagnes Escarpées', 'Cités Souterraines', 'Déserts Arides', 'Plaines Sauvages', 'Archipels Isolés']
        },
        {
          name: 'relations_with_other_races',
          label: 'Diplomatie & Relations',
          type: 'textarea',
          rows: 4,
          placeholder: 'Alliés historiques, rivalités...'
        }
      ]
    },
    {
      id: 'gallery',
      label: 'Archives Visuelles',
      icon: ImageIcon,
      fields: [
        {
          name: 'race_images',
          label: 'Galerie de la Race',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'portraits', label: 'Individus' },
            { id: 'culture', label: 'Scènes de vie' },
            { id: 'homeland', label: 'Habitats' }
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
          name: 'gm_secrets_race',
          label: 'Secrets Cosmogoniques',
          type: 'textarea',
          rows: 6
        }
      ]
    }
  ]
};

export default function RacesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="races"
        title="Races & Peuples"
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={() => { setEditingItem(null); setShowForm(true); }}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={async () => {
          if (!selectedItem || !window.confirm('Voulez-vous vraiment effacer ce peuple de l\'histoire ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('races').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={racesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={racesConfig}
      />
    </>
  );
}