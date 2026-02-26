import { useState } from 'react';
import { Skull, Info, AlertTriangle, Sparkles, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (MALÉDICTIONS) ---
const CurseMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const penalties = data.penalties || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updatePenalty = (stat, amount) => {
    const newValue = (penalties[stat] || 0) + amount;
    // Les malédictions infligent des malus (de -10 à 0)
    if (newValue >= -10 && newValue <= 0) {
      onChange({ ...data, penalties: { ...penalties, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les effets mécaniques (VTT) infligés par cette malédiction (ex: jet de sauvegarde initial, dégâts périodiques, ou malus permanents aux caractéristiques).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Jet de Sauvegarde (DD)</label>
          <input 
            type="text" value={data.save_dc || ''} onChange={(e) => updateField('save_dc', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: DD 15 Sagesse"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Dégâts ou Effet direct</label>
          <input 
            type="text" value={data.direct_effect || ''} onChange={(e) => updateField('direct_effect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Vulnérabilité au feu, -1d6 PV max..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Malus de Caractéristiques (Pénalités maudites)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = penalties[key] || 0;
          return (
            <div key={key} className="bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updatePenalty(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center ${val < 0 ? 'text-red-400' : 'text-white'}`}>{val}</span>
                <button type="button" onClick={() => updatePenalty(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"><Plus size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const cursesConfig = {
  entityName: 'la malédiction',
  tableName: 'curses',
  title: 'Malédictions',
  getHeaderIcon: () => Skull,
  getHeaderColor: () => 'from-violet-600/30 via-purple-500/20 to-indigo-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la malédiction',
          type: 'text',
          required: true,
          placeholder: 'Ex: Malédiction du sang, Marque du damné...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Malédiction mineure, majeure, divine...'
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
          label: 'Image',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Origine, apparence, manifestation...'
        }
      ]
    },
    {
      id: 'effects',
      label: 'Effets',
      icon: AlertTriangle,
      fields: [
        {
          name: 'data', // COLONNE VTT
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: CurseMechanicsEditor
        },
        {
          name: 'effects',
          label: 'Effets de la malédiction',
          type: 'textarea',
          rows: 6,
          placeholder: 'Effets mécaniques et narratifs...'
        },
        {
          name: 'severity',
          label: 'Gravité',
          type: 'select',
          options: [
            { value: 'minor', label: 'Mineure' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'severe', label: 'Grave' },
            { value: 'lethal', label: 'Mortelle' }
          ]
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: 'Permanent, 1 mois, jusqu\'à dissipation...'
        },
        {
          name: 'progression',
          label: 'Progression',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment la malédiction évolue dans le temps...'
        }
      ]
    },
    {
      id: 'transmission',
      label: 'Transmission & Origine',
      icon: Sparkles,
      fields: [
        {
          name: 'origin',
          label: 'Origine',
          type: 'textarea',
          rows: 3,
          placeholder: 'Qui ou quoi a créé cette malédiction...'
        },
        {
          name: 'transmission',
          label: 'Transmission',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment la malédiction se transmet...'
        },
        {
          name: 'signs',
          label: 'Signes visibles',
          type: 'textarea',
          rows: 2,
          placeholder: 'Marques, symptômes, aura...'
        }
      ]
    },
    {
      id: 'removal',
      label: 'Dissipation',
      icon: Sparkles,
      fields: [
        {
          name: 'removal_method',
          label: 'Méthode de dissipation',
          type: 'textarea',
          rows: 4,
          placeholder: 'Sorts, rituels, quêtes nécessaires...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté de dissipation',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' },
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
          name: 'curse_images',
          label: 'Images de la malédiction',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'marks', label: 'Marques' },
            { id: 'effects', label: 'Effets' },
            { id: 'victims', label: 'Victimes' }
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
          name: 'plot_hooks',
          label: 'Accroches narratives',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment intégrer cette malédiction dans l\'histoire...'
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

export default function CursesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="curses"
        title="Malédictions"
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
          if (!selectedItem || !confirm('Supprimer ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('curses').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={cursesConfig}
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
        config={cursesConfig}
      />
    </>
  );
}