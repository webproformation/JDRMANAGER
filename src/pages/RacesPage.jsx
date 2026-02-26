// src/pages/RacesPage.jsx
import React, { useState } from 'react';
import { Users, Info, User, Landmark, BookOpen, Sparkles, ImageIcon, Shield, Plus, Minus, Activity } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

// --- COMPOSANT SPÉCIALISÉ : ÉDITEUR DE BONUS RACIAUX ---
// Ce composant écrit directement dans la colonne JSONB "data" sous la clé "bonuses"
const RaceBonusEditor = ({ value = {}, onChange }) => {
  // Structure par défaut des bonus (D&D 5 classique)
  const defaultBonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  const bonuses = value.bonuses || defaultBonuses;

  const updateBonus = (stat, amount) => {
    const newValue = (bonuses[stat] || 0) + amount;
    // On limite généralement les bonus raciaux entre -2 et +4
    if (newValue >= -2 && newValue <= 4) {
      onChange({ ...value, bonuses: { ...bonuses, [stat]: newValue } });
    }
  };

  const statLabels = {
    str: 'Force', dex: 'Dextérité', con: 'Constitution',
    int: 'Intelligence', wis: 'Sagesse', cha: 'Charisme'
  };

  return (
    <div className="bg-[#151725] rounded-xl p-6 border border-white/5 shadow-inner">
      <p className="text-xs text-silver/50 mb-6 italic">
        Ajustez les modificateurs de caractéristiques inhérents à cette race. Ces valeurs s'ajouteront automatiquement aux jets de création des personnages.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = bonuses[key] || 0;
          return (
            <div key={key} className="bg-black/40 rounded-lg p-4 border border-white/5 flex flex-col items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">{label}</span>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => updateBonus(key, -1)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-md transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className={`text-xl font-black w-8 text-center ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>
                  {val > 0 ? `+${val}` : val}
                </span>
                <button 
                  type="button"
                  onClick={() => updateBonus(key, 1)}
                  className="p-1.5 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-md transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CONFIGURATION DE LA PAGE ---
const racesConfig = {
  entityName: 'la race',
  tableName: 'races',
  title: 'Races',
  getHeaderIcon: () => Users,
  getHeaderColor: () => 'from-amber-500/30 via-orange-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la race',
          type: 'text',
          required: true,
          placeholder: 'Ex: Elfes, Nains, Humains...'
        },
        {
          name: 'subtitle',
          label: 'Surnom ou appellation commune',
          type: 'text',
          placeholder: 'Ex: Enfants des étoiles, Peuple de la montagne...'
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
          type: 'image',
          description: 'Portrait représentatif de la race'
        },
        {
          name: 'description',
          label: 'Description générale',
          type: 'textarea',
          rows: 6,
          placeholder: 'Description générale de la race, son histoire, sa place dans le monde...'
        }
      ]
    },
    {
      id: 'physical',
      label: 'Traits physiques',
      icon: User,
      fields: [
        {
          name: 'size',
          label: 'Catégorie de taille',
          type: 'static-select',
          required: true,
          options: [
            { value: 'Très Petit', label: 'Très Petit (TP)' },
            { value: 'Petit', label: 'Petit (P)' },
            { value: 'Moyen', label: 'Moyen (M)' },
            { value: 'Grand', label: 'Grand (G)' },
            { value: 'Très Grand', label: 'Très Grand (TG)' }
          ]
        },
        {
          name: 'height_range',
          label: 'Gamme de taille',
          type: 'text',
          placeholder: 'Ex: 1,50m à 1,80m'
        },
        {
          name: 'weight_range',
          label: 'Gamme de poids',
          type: 'text',
          placeholder: 'Ex: 50 à 80 kg'
        },
        {
          name: 'lifespan',
          label: 'Durée de vie',
          type: 'text',
          placeholder: 'Ex: 80 ans, 750 ans, éternelle...'
        },
        {
          name: 'age',
          label: 'Âge & Maturité',
          type: 'text',
          placeholder: 'Ex: Maturité à 20 ans, vieillesse à 60 ans...',
          required: true
        },
        {
          name: 'physical_description',
          label: 'Description physique détaillée',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, traits distinctifs, variations physiques, dimorphisme sexuel...'
        },
        {
          name: 'speed',
          label: 'Vitesse de déplacement',
          type: 'text',
          placeholder: 'Ex: 9 mètres (30 pieds)',
          required: true
        }
      ]
    },
    {
      id: 'culture',
      label: 'Culture & Société',
      icon: Landmark,
      fields: [
        {
          name: 'alignment',
          label: 'Alignement typique',
          type: 'text',
          placeholder: 'Tendances morales et philosophiques courantes...'
        },
        {
          name: 'cultural_traits',
          label: 'Traits culturels',
          type: 'textarea',
          rows: 4,
          placeholder: 'Valeurs, traditions, coutumes, art, musique...'
        },
        {
          name: 'society_structure',
          label: 'Structure sociale',
          type: 'textarea',
          rows: 4,
          placeholder: 'Organisation sociale, hiérarchie, gouvernement, classes...'
        },
        {
          name: 'naming_conventions',
          label: 'Conventions de nommage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment sont nommés les individus, noms de famille, titres...'
        },
        {
          name: 'religion_practices',
          label: 'Pratiques religieuses',
          type: 'textarea',
          rows: 3,
          placeholder: 'Divinités vénérées, rituels, croyances spirituelles...'
        },
        {
          name: 'languages',
          label: 'Langues parlées',
          type: 'text',
          placeholder: 'Ex: Commun, Elfique, Nain...',
          required: true
        }
      ]
    },
    {
      id: 'homeland',
      label: 'Territoires & Relations',
      icon: BookOpen,
      fields: [
        {
          name: 'homeland',
          label: "Terre d'origine",
          type: 'textarea',
          rows: 3,
          placeholder: 'Région, continent, environnement d\'origine de la race...'
        },
        {
          name: 'settlements',
          label: 'Colonies & Établissements',
          type: 'textarea',
          rows: 3,
          placeholder: 'Types de cités, villages, style architectural typique...'
        },
        {
          name: 'relations_with_other_races',
          label: 'Relations avec les autres races',
          type: 'textarea',
          rows: 5,
          placeholder: 'Alliés, ennemis, tensions, échanges commerciaux et culturels...'
        },
        {
          name: 'famous_members',
          label: 'Membres célèbres',
          type: 'textarea',
          rows: 3,
          placeholder: 'Héros, leaders, personnages historiques de cette race...'
        }
      ]
    },
    {
      id: 'abilities',
      label: 'Capacités & Traits',
      icon: Sparkles,
      fields: [
        {
          name: 'data', // Utilise la colonne JSONB pour structurer le moteur VTT
          label: 'Bonus raciaux (Moteur de Règles)',
          type: 'custom',
          component: RaceBonusEditor
        },
        {
          name: 'ability_score_increase',
          label: 'Description des bonus',
          type: 'text',
          placeholder: 'Ex: +2 Dextérité, +1 Intelligence (pour affichage)',
          required: true
        },
        {
          name: 'traits',
          label: 'Traits raciaux',
          type: 'textarea',
          rows: 6,
          placeholder: 'Vision dans le noir, résistances, compétences naturelles, sorts innés...',
          required: true
        },
        {
          name: 'racial_abilities',
          label: 'Capacités raciales spéciales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Pouvoirs innés, capacités magiques, talents naturels...'
        },
        {
          name: 'subraces',
          label: 'Sous-races & Variantes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Différentes ethnies, variantes régionales, leurs traits distinctifs...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'race_images',
          label: 'Images de la race',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'portraits', label: 'Portraits' },
            { id: 'variants', label: 'Variantes' },
            { id: 'culture', label: 'Culture & Vie' },
            { id: 'homeland', label: "Terres d'origine" }
          ]
        }
      ]
    },
    {
      id: 'gm', // Renommé en 'gm' pour correspondre au filtrage du composant Detail
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'gm_secrets_race',
          label: 'Secrets raciaux',
          type: 'textarea',
          rows: 4,
          placeholder: 'Origines secrètes, pouvoirs cachés, complots raciaux...'
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

  const handleView = (item) => {
    setSelectedItem(item);
  };

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
    if (!selectedItem || !window.confirm('Êtes-vous sûr de vouloir supprimer cette race ?')) return;

    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.from('races').delete().eq('id', selectedItem.id);
      if (error) throw error;
      
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de la race.");
    }
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="races"
        title="Races"
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
        config={racesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={racesConfig}
      />
    </>
  );
}