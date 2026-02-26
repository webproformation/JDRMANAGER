import { useState } from 'react';
import { Hammer, Info, MapPin, DollarSign, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

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
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les propriétés mécaniques de ce matériau pour la forge VTT. Ces valeurs s'appliqueront aux objets fabriqués avec.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Bonus d'Artisanat / Équipement</label>
          <input 
            type="text" value={data.crafting_bonus || ''} onChange={(e) => updateField('crafting_bonus', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: +1 aux jets d'attaque, +2 CA..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Modificateur de Poids / Durabilité</label>
          <input 
            type="text" value={data.weight_durability_modifier || ''} onChange={(e) => updateField('weight_durability_modifier', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Poids divisé par 2, Indestructible..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus Magiques Transmis (Caractéristiques)
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

const craftingMaterialsConfig = {
  entityName: 'le matériau',
  tableName: 'crafting_materials',
  title: 'Matériaux de Fabrication',
  getHeaderIcon: () => Hammer,
  getHeaderColor: () => 'from-slate-600/30 via-gray-500/20 to-zinc-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du matériau',
          type: 'text',
          required: true,
          placeholder: 'Ex: Cuir tanné, Acier trempé, Essence lunaire...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Métal, Cuir, Tissu, Composant magique...'
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
          placeholder: 'Apparence, texture, propriétés physiques...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Info,
      fields: [
        {
          name: 'data', // COLONNE VTT
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: CraftingMaterialMechanicsEditor
        },
        {
          name: 'quality',
          label: 'Qualité',
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
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Résistance, conductivité magique, durabilité...'
        },
        {
          name: 'uses',
          label: 'Utilisations',
          type: 'textarea',
          rows: 3,
          placeholder: 'Forge d\'armes, création de potions, enchantement...'
        }
      ]
    },
    {
      id: 'source',
      label: 'Source & Récolte',
      icon: MapPin,
      fields: [
        {
          name: 'source',
          label: 'Source',
          type: 'textarea',
          rows: 3,
          placeholder: 'Où et comment obtenir ce matériau...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
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
          label: 'Méthode de récolte',
          type: 'textarea',
          rows: 2,
          placeholder: 'Extraction, chasse, cueillette...'
        }
      ]
    },
    {
      id: 'value',
      label: 'Valeur & Commerce',
      icon: DollarSign,
      fields: [
        {
          name: 'value',
          label: 'Valeur',
          type: 'text',
          placeholder: 'Ex: 10 po/kg, 50 po/unité...'
        },
        {
          name: 'availability',
          label: 'Disponibilité',
          type: 'text',
          placeholder: 'Marchés, guildes artisanales...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'material_images',
          label: 'Images du matériau',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'raw', label: 'Brut' },
            { id: 'processed', label: 'Traité' },
            { id: 'crafted', label: 'Travaillé' }
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
          label: 'Notes',
          type: 'textarea',
          rows: 4
        }
      ]
    }
  ]
};

export default function CraftingMaterialsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="crafting_materials"
        title="Matériaux de Fabrication"
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
          await supabase.from('crafting_materials').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={craftingMaterialsConfig}
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
        config={craftingMaterialsConfig}
      />
    </>
  );
}