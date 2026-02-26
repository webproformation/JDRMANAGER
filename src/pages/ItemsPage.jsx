import { useState } from 'react';
import { Package, Info, DollarSign, Wrench, ImageIcon, Shield, Plus, Minus, Hammer } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import CraftingEngineEditor from '../components/CraftingEngineEditor'; // IMPORT DU MOTEUR D'ARTISANAT

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (OBJETS/ARMES/ARMURES) ---
const ItemMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const vttType = data.type || 'item'; 
  const bonuses = data.bonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updateBonus = (stat, amount) => {
    const newValue = (bonuses[stat] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) onChange({ ...data, bonuses: { ...bonuses, [stat]: newValue } });
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner space-y-8 mb-6">
      <p className="text-xs text-silver/50 italic">
        Configurez les propriétés VTT de cet objet. S'il s'agit d'une arme ou d'une armure, ces valeurs seront utilisées par l'Arsenal des joueurs.
      </p>
      
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Classification VTT</label>
        <div className="flex flex-wrap gap-3">
          {['item', 'weapon', 'armor', 'consumable'].map(t => (
            <button
              key={t} type="button" onClick={() => updateField('type', t)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${vttType === t ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-black/40 text-silver/50 hover:bg-white/5 border border-white/5'}`}
            >
              {t === 'item' ? 'Standard' : t === 'weapon' ? 'Arme' : t === 'armor' ? 'Armure' : 'Consommable'}
            </button>
          ))}
        </div>
      </div>

      {vttType === 'weapon' && (
        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 bg-orange-900/10 p-6 rounded-2xl border border-orange-500/20">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-orange-400 block mb-2">Dégâts (ex: 1d8)</label>
            <input type="text" value={data.damage || ''} onChange={(e) => updateField('damage', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none placeholder-silver/30" placeholder="Ex: 1d8" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-orange-400 block mb-2">Type de dégâts</label>
            <input type="text" value={data.damage_type || ''} onChange={(e) => updateField('damage_type', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none placeholder-silver/30" placeholder="Ex: Tranchant" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-orange-400 block mb-2">Propriétés de l'arme</label>
            <input type="text" value={data.weapon_properties || ''} onChange={(e) => updateField('weapon_properties', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none placeholder-silver/30" placeholder="Ex: Finesse, Lancer (portée 6/18m)" />
          </div>
        </div>
      )}

      {vttType === 'armor' && (
        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-2">Classe d'Armure (CA)</label>
            <input type="number" value={data.ac || ''} onChange={(e) => updateField('ac', parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none placeholder-silver/30" placeholder="Ex: 14" />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input type="checkbox" id="stealth_dis" checked={data.stealth_disadvantage || false} onChange={(e) => updateField('stealth_disadvantage', e.target.checked)} className="w-6 h-6 accent-blue-500 rounded cursor-pointer" />
            <label htmlFor="stealth_dis" className="text-xs font-bold text-silver uppercase tracking-widest cursor-pointer">Désavantage Discrétion</label>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-white/5">
        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4">Bonus Équipés (Objet de maître)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(statLabels).map(([key, label]) => {
            const val = bonuses[key] || 0;
            return (
              <div key={key} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-silver">{label}</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => updateBonus(key, -1)} className="p-1.5 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"><Minus size={14}/></button>
                  <span className={`text-lg font-black w-8 text-center ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                  <button type="button" onClick={() => updateBonus(key, 1)} className="p-1.5 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"><Plus size={14}/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const itemsConfig = {
  entityName: "l'objet",
  tableName: 'items',
  title: 'Objets',
  getHeaderIcon: () => Package,
  getHeaderColor: () => 'from-amber-600/30 via-yellow-500/20 to-orange-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: "Nom de l'objet",
          type: 'text',
          required: true,
          placeholder: 'Ex: Épée longue, Corde de chanvre...'
        },
        {
          name: 'subtitle',
          label: 'Type ou catégorie',
          type: 'text',
          placeholder: 'Ex: Arme, Outil, Équipement...'
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
          rows: 5,
          placeholder: 'Apparence, matériaux, détails...'
        }
      ]
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Wrench,
      fields: [
        {
          name: 'data', // COLONNE VTT - Statistiques de combat/utilisation
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: ItemMechanicsEditor
        },
        {
          name: 'type',
          label: 'Type descriptif',
          type: 'select',
          options: [
            { value: 'weapon', label: 'Arme' },
            { value: 'armor', label: 'Armure' },
            { value: 'tool', label: 'Outil' },
            { value: 'clothing', label: 'Vêtement' },
            { value: 'consumable', label: 'Consommable' },
            { value: 'misc', label: 'Divers' }
          ]
        },
        {
          name: 'weight',
          label: 'Poids',
          type: 'text',
          placeholder: 'Ex: 2 kg, 500g...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' }
          ]
        },
        {
          name: 'properties',
          label: 'Propriétés spéciales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Durabilité, résistance, caractéristiques...'
        }
      ]
    },
    {
      id: 'crafting',
      label: 'Fabrication & Artisanat',
      icon: Hammer, // L'icône de forge
      fields: [
        {
          name: 'data', // COLONNE VTT - Recette de craft intégrée
          label: 'Atelier de Fabrication (Optionnel)',
          type: 'custom',
          component: CraftingEngineEditor
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
          placeholder: 'Ex: 50 po, 10 pa...'
        },
        {
          name: 'availability',
          label: 'Disponibilité',
          type: 'text',
          placeholder: 'Courant, rare, sur commande...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'item_images',
          label: "Images de l'objet",
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'main', label: 'Principal' },
            { id: 'details', label: 'Détails' },
            { id: 'variants', label: 'Variantes' }
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
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 4
        }
      ]
    }
  ]
};

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="items"
        title="Objets"
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
          await supabase.from('items').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={itemsConfig}
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
        config={itemsConfig}
      />
    </>
  );
}