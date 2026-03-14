import { useState, useEffect } from 'react';
import { Activity, Info, AlertTriangle, HeartPulse, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (MALADIES) ---
const DiseaseMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const penalties = data.penalties || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const updateField = (field, val) => onChange({ ...data, [field]: val });
  const updatePenalty = (stat, amount) => {
    const newValue = (penalties[stat] || 0) + amount;
    if (newValue >= -10 && newValue <= 0) {
      onChange({ ...data, penalties: { ...penalties, [stat]: newValue } });
    }
  };

  const statLabels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };

  return (
    <div className="bg-black/20 rounded-[2.5rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Configuration des affaiblissements VTT (Jets de sauvegarde & Malus)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Jet de Sauvegarde (DD)</label>
          <input 
            type="text" value={data.save_dc || ''} onChange={(e) => updateField('save_dc', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: DD 14 Constitution"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Attrition (PV Max)</label>
          <input 
            type="text" value={data.hp_drain || ''} onChange={(e) => updateField('hp_drain', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: -1d4 PV max / jour"
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">
        Affaiblissement des Caractéristiques
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = penalties[key] || 0;
          return (
            <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-3 hover:border-[#2DD4BF]/20 transition-colors group">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver/40 group-hover:text-[#2DD4BF] transition-colors">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updatePenalty(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-all active:scale-90"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center drop-shadow-md ${val < 0 ? 'text-red-400' : 'text-white'}`}>{val}</span>
                <button type="button" onClick={() => updatePenalty(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-all active:scale-90"><Plus size={14}/></button>
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
  title: 'Maladies & Pathogènes',
  getHeaderIcon: () => Activity,
  getHeaderColor: () => 'from-green-600/30 via-lime-500/20 to-emerald-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_disease_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="item" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la pathologie',
          type: 'text',
          required: true,
          placeholder: 'Ex: Fièvre des marais, Peste noire...'
        },
        {
          name: 'subtitle',
          label: 'Classification',
          type: 'text',
          placeholder: 'Bactérienne, virale, magique, maudite...'
        },
        {
          name: 'world_id',
          label: 'Monde d\'incidence',
          type: 'relation',
          table: 'worlds'
        },
        {
          name: 'image_url',
          label: 'Illustration',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Origine, vecteurs et zones affectées...'
        }
      ]
    },
    {
      id: 'transmission',
      label: 'Propagation',
      icon: AlertTriangle,
      fields: [
        {
          name: 'transmission',
          label: 'Mode de contagion',
          type: 'textarea',
          rows: 3,
          placeholder: 'Contact, air, eau, morsure...'
        },
        {
          name: 'contagion',
          label: 'Indice de contagion',
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
      label: 'Symptomatologie',
      icon: HeartPulse,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: DiseaseMechanicsEditor
        },
        {
          name: 'symptoms',
          label: 'Symptômes cliniques',
          type: 'textarea',
          rows: 4,
          placeholder: 'Symptômes visibles, effets physiques...'
        },
        {
          name: 'stages',
          label: 'Stades de progression',
          type: 'textarea',
          rows: 4,
          placeholder: 'Évolution de la pathologie...'
        },
        {
          name: 'lethality',
          label: 'Niveau de létalité',
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
      label: 'Thérapeutique',
      icon: HeartPulse,
      fields: [
        {
          name: 'treatment',
          label: 'Traitements connus',
          type: 'textarea',
          rows: 4,
          placeholder: 'Remèdes, potions, rituels de soins...'
        },
        {
          name: 'cure',
          label: 'Protocole de guérison',
          type: 'textarea',
          rows: 3,
          placeholder: 'Condition d\'arrêt de la maladie...'
        },
        {
          name: 'immunity',
          label: 'Immunité & Résistance',
          type: 'textarea',
          rows: 2
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'disease_images',
          label: 'Archives visuelles',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'symptoms', label: 'Symptômes' },
            { id: 'remedies', label: 'Remèdes' },
            { id: 'affected', label: 'Spécimens' }
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
          name: 'plot_usage',
          label: 'Potentiel narratif (Secrets)',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment utiliser cette maladie dans votre campagne...'
        },
        {
          name: 'notes',
          label: 'Notes MJ Confidentielles',
          type: 'textarea',
          rows: 3
        }
      ]
    }
  ]
};

export default function DiseasesPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('diseases').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowForm(false);
    setEditingItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('diseases').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Éradiquer la Pathologie"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} du registre des maladies ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="diseases"
        title="Maladies"
        icon={Activity}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={diseasesConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={diseasesConfig}
      />
    </div>
  );
}