import { useState } from 'react';
import { BookOpen, Info, Utensils, Clock, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor'; // IMPORT DU MOTEUR

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (RECETTES) ---
const RecipeMechanicsEditor = ({ value = {}, onChange }) => {
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
        Configurez les effets mécaniques (VTT) accordés par la consommation de ce plat ou l'utilisation de cette création (ex: soins, PV temporaires, bonus de statistiques "Bien nourri").
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Soin / PV Temporaires</label>
          <input 
            type="text" value={data.hp_effect || ''} onChange={(e) => updateField('hp_effect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: +1d8 PV, +5 PV Temp..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Durée des avantages</label>
          <input 
            type="text" value={data.effect_duration || ''} onChange={(e) => updateField('effect_duration', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: 8 heures, Jusqu'au prochain repos..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus de Caractéristiques (Effet "Bien Nourri" / "Revigoré")
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

const recipesConfig = {
  entityName: 'la recette',
  tableName: 'recipes',
  title: 'Recettes',
  getHeaderIcon: () => BookOpen,
  getHeaderColor: () => 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la recette',
          type: 'text',
          required: true,
          placeholder: 'Ex: Potion de guérison supérieure, Épée enchantée...'
        },
        {
          name: 'subtitle',
          label: 'Catégorie',
          type: 'text',
          placeholder: 'Alchimie, Forge, Enchantement...'
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
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'Description de la recette et du résultat...'
        }
      ]
    },
    {
      id: 'ingredients',
      label: 'Ingrédients & Matériaux',
      icon: Utensils,
      fields: [
        {
          name: 'ingredients',
          label: 'Ingrédients',
          type: 'textarea',
          rows: 6,
          placeholder: 'Liste détaillée des ingrédients avec quantités...'
        },
        {
          name: 'tools',
          label: 'Outils nécessaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Alambic, enclume, baguette magique...'
        },
        {
          name: 'rarity',
          label: 'Rareté des ingrédients',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' }
          ]
        }
      ]
    },
    {
      id: 'process',
      label: 'Processus de fabrication',
      icon: Clock,
      fields: [
        {
          name: 'data', 
          label: 'Moteur d\'Artisanat Interactif',
          type: 'custom',
          component: CraftingEngineEditor
        },
        {
          name: 'instructions',
          label: 'Instructions',
          type: 'textarea',
          rows: 8,
          placeholder: 'Étapes détaillées de la fabrication...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' },
            { value: 'master', label: 'Maître artisan' }
          ]
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: '2 heures, 1 jour, 1 semaine...'
        },
        {
          name: 'skill_required',
          label: 'Compétence requise',
          type: 'text',
          placeholder: 'Alchimie niveau 5, Forge niveau 10...'
        }
      ]
    },
    {
      id: 'result',
      label: 'Résultat',
      icon: Info,
      fields: [
        {
          name: 'data', 
          label: 'Effets VTT (Consommation)',
          type: 'custom',
          component: RecipeMechanicsEditor
        },
        {
          name: 'result',
          label: 'Produit final',
          type: 'textarea',
          rows: 4,
          placeholder: 'Description du résultat obtenu...'
        },
        {
          name: 'yield',
          label: 'Rendement',
          type: 'text',
          placeholder: 'Ex: 1 potion, 3 doses, 1 arme...'
        },
        {
          name: 'value',
          label: 'Valeur du produit',
          type: 'text',
          placeholder: 'Ex: 100 po, 500 po...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'recipe_images',
          label: 'Images de la recette',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'ingredients', label: 'Ingrédients' },
            { id: 'process', label: 'Processus' },
            { id: 'result', label: 'Résultat' }
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
          name: 'secrets',
          label: 'Variantes secrètes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Ingrédients alternatifs, améliorations...'
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function RecipesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="recipes"
        title="Recettes"
        onView={setSelectedItem}
        onEdit={(item) => {
          setEditingItem(item);
          setSelectedItem(null);
          setShowForm(true);
        }}
        onCreate={() => {
          setEditingItem(null);
          setShowForm(true);
        }}
      />
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => {
          setEditingItem(selectedItem);
          setSelectedItem(null);
          setShowForm(true);
        }}
        onDelete={async () => {
          if (!selectedItem || !window.confirm('Supprimer ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('recipes').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={recipesConfig}
      />
      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
          setShowForm(false);
          setEditingItem(null);
        }}
        item={editingItem}
        config={recipesConfig}
      />
    </>
  );
}