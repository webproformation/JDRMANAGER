import { useState } from 'react';
import { Activity, Info, AlertTriangle, HeartPulse, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (MALADIES) ---
const DiseaseMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const penalties = data.penalties || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updatePenalty = (stat, amount) => {
    const newValue = (penalties[stat] || 0) + amount;
    // Pour une maladie, on gère principalement des malus (de -10 à 0)
    if (newValue >= -10 && newValue <= 0) {
      onChange({ ...data, penalties: { ...penalties, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les malus mécaniques (VTT) infligés par cette maladie (ex: jet de sauvegarde requis, perte de PV max, malus de caractéristiques).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Jet de Sauvegarde (DD)</label>
          <input 
            type="text" value={data.save_dc || ''} onChange={(e) => updateField('save_dc', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: DD 14 Constitution"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Dégâts ou Perte de PV Max</label>
          <input 
            type="text" value={data.hp_drain || ''} onChange={(e) => updateField('hp_drain', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: -1d4 PV max par jour"
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Malus de Caractéristiques (Symptômes affaiblissants)
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

const diseasesConfig = {
  entityName: 'la maladie',
  tableName: 'diseases',
  title: 'Maladies',
  getHeaderIcon: () => Activity,
  getHeaderColor: () => 'from-green-600/30 via-lime-500/20 to-emerald-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la maladie',
          type: 'text',
          required: true,
          placeholder: 'Ex: Fièvre des marais, Peste noire...'
        },
        {
          name: 'subtitle',
          label: 'Type',
          type: 'text',
          placeholder: 'Bactérienne, virale, magique, maudite...'
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
          rows: 4,
          placeholder: 'Origine, historique, zones affectées...'
        }
      ]
    },
    {
      id: 'transmission',
      label: 'Transmission & Incubation',
      icon: AlertTriangle,
      fields: [
        {
          name: 'transmission',
          label: 'Mode de transmission',
          type: 'textarea',
          rows: 3,
          placeholder: 'Contact, air, eau, morsure...'
        },
        {
          name: 'contagion',
          label: 'Contagiosité',
          type: 'select',
          options: [
            { value: 'none', label: 'Non contagieuse' },
            { value: 'low', label: 'Faible' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'high', label: 'Élevée' },
            { value: 'extreme', label: 'Extrême' }
          ]
        },
        {
          name: 'incubation',
          label: 'Période d\'incubation',
          type: 'text',
          placeholder: '1 jour, 1 semaine, 1 mois...'
        }
      ]
    },
    {
      id: 'symptoms',
      label: 'Symptômes & Effets',
      icon: HeartPulse,
      fields: [
        {
          name: 'data', // COLONNE VTT
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: DiseaseMechanicsEditor
        },
        {
          name: 'symptoms',
          label: 'Symptômes',
          type: 'textarea',
          rows: 5,
          placeholder: 'Symptômes visibles, effets physiques et mentaux...'
        },
        {
          name: 'stages',
          label: 'Stades de progression',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment la maladie évolue...'
        },
        {
          name: 'lethality',
          label: 'Létalité',
          type: 'select',
          options: [
            { value: 'none', label: 'Non létale' },
            { value: 'low', label: 'Faible' },
            { value: 'moderate', label: 'Modérée' },
            { value: 'high', label: 'Élevée' },
            { value: 'certain', label: 'Mortelle' }
          ]
        }
      ]
    },
    {
      id: 'treatment',
      label: 'Traitement & Guérison',
      icon: HeartPulse,
      fields: [
        {
          name: 'treatment',
          label: 'Traitement',
          type: 'textarea',
          rows: 4,
          placeholder: 'Remèdes, potions, sorts, soins...'
        },
        {
          name: 'cure',
          label: 'Guérison',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment guérir complètement...'
        },
        {
          name: 'immunity',
          label: 'Immunité',
          type: 'textarea',
          rows: 2,
          placeholder: 'Qui est naturellement immunisé...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'disease_images',
          label: 'Images de la maladie',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'symptoms', label: 'Symptômes' },
            { id: 'remedies', label: 'Remèdes' },
            { id: 'affected', label: 'Personnes affectées' }
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
          name: 'plot_usage',
          label: 'Utilisation narrative',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment utiliser cette maladie dans l\'histoire...'
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

export default function DiseasesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="diseases"
        title="Maladies"
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
          await supabase.from('diseases').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={diseasesConfig}
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
        config={diseasesConfig}
      />
    </>
  );
}