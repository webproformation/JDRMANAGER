import { useState } from 'react';
import { Star, Info, Orbit, Sparkles, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (CORPS CÉLESTES) ---
const CelestialMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const magicModifiers = data.magicModifiers || { healing: 0, damage: 0, necromancy: 0, illusion: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updateModifier = (school, amount) => {
    const newValue = (magicModifiers[school] || 0) + amount;
    if (newValue >= -5 && newValue <= 5) {
      onChange({ ...data, magicModifiers: { ...magicModifiers, [school]: newValue } });
    }
  };

  const schoolLabels = { healing: 'Soin', damage: 'Dégâts', necromancy: 'Nécromancie', illusion: 'Illusion' };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les effets mécaniques (VTT) environnementaux appliqués lorsque cet astre domine le ciel (ex: malus globaux, bonus à certaines écoles de magie).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Effet d'Environnement Global</label>
          <input 
            type="text" value={data.global_effect || ''} onChange={(e) => updateField('global_effect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Vision nocturne doublée, Fatigué..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Condition de déclenchement</label>
          <input 
            type="text" value={data.trigger_condition || ''} onChange={(e) => updateField('trigger_condition', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Pleine lune, Éclipse, Alignement..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Modificateurs Magiques Environnementaux (Dés)
      </label>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(schoolLabels).map(([key, label]) => {
          const val = magicModifiers[key] || 0;
          return (
            <div key={key} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updateModifier(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                <button type="button" onClick={() => updateModifier(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"><Plus size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const celestialBodiesConfig = {
  entityName: 'le corps céleste',
  tableName: 'celestial_bodies',
  title: 'Corps Célestes',
  getHeaderIcon: () => Star,
  getHeaderColor: () => 'from-blue-600/30 via-cyan-500/20 to-sky-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du corps céleste',
          type: 'text',
          required: true,
          placeholder: 'Ex: Solara, Lune d\'Argent...'
        },
        {
          name: 'subtitle',
          label: 'Autre nom ou titre',
          type: 'text',
          placeholder: 'Ex: L\'Œil du Ciel, Grande Étoile...'
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
          name: 'body_type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'planet', label: 'Planète' },
            { value: 'moon', label: 'Lune' },
            { value: 'star', label: 'Étoile' },
            { value: 'comet', label: 'Comète' },
            { value: 'constellation', label: 'Constellation' }
          ]
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Apparence, caractéristiques visibles...'
        }
      ]
    },
    {
      id: 'physical',
      label: 'Caractéristiques physiques',
      icon: Orbit,
      fields: [
        {
          name: 'color',
          label: 'Couleur',
          type: 'text',
          placeholder: 'Rouge, argentée, dorée, bleue...'
        },
        {
          name: 'size',
          label: 'Taille',
          type: 'text',
          placeholder: 'Petite, moyenne, grande, gigantesque...'
        },
        {
          name: 'brightness',
          label: 'Luminosité',
          type: 'text',
          placeholder: 'Très brillant, faible, variable...'
        },
        {
          name: 'orbital_period',
          label: 'Période orbitale',
          type: 'text',
          placeholder: '28 jours, 365 jours, aucune...'
        },
        {
          name: 'phases',
          label: 'Phases',
          type: 'textarea',
          rows: 3,
          placeholder: 'Phases de la lune, cycles, changements...'
        }
      ]
    },
    {
      id: 'influence',
      label: 'Influences & Effets',
      icon: Sparkles,
      fields: [
        {
          name: 'data', // COLONNE VTT
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: CelestialMechanicsEditor
        },
        {
          name: 'astrological_influence',
          label: 'Influence astrologique',
          type: 'textarea',
          rows: 4,
          placeholder: 'Effets sur la magie, marées, comportements...'
        },
        {
          name: 'magical_properties',
          label: 'Propriétés magiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Amplification magique sous certaines phases...'
        },
        {
          name: 'cultural_significance',
          label: 'Importance culturelle',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rôle dans les mythes, religions, calendriers...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'celestial_images',
          label: 'Images du corps céleste',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'full', label: 'Vue complète' },
            { id: 'phases', label: 'Phases' },
            { id: 'sky', label: 'Dans le ciel' },
            { id: 'effects', label: 'Effets' }
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
          placeholder: 'Mythes, légendes, prophéties...'
        },
        {
          name: 'notes',
          label: 'Notes diverses',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function CelestialBodiesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="celestial_bodies"
        title="Corps Célestes"
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
          await supabase.from('celestial_bodies').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={celestialBodiesConfig}
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
        config={celestialBodiesConfig}
      />
    </>
  );
}