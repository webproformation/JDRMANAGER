import { useState, useEffect } from 'react';
import { Users2, Info, Building2, Target, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (GUILDES) ---
const GuildMechanicsEditor = ({ value = {}, onChange }) => {
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
    <div className="bg-black/20 rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Avantages mécaniques VTT (Entraînements, Rangs, Sorts de Guilde)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Capacités de Guilde</label>
          <input 
            type="text" value={data.granted_spells || ''} onChange={(e) => updateField('granted_spells', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: Détection de la magie, Invisibilité..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Atouts Passifs / Équipement</label>
          <input 
            type="text" value={data.special_perks || ''} onChange={(e) => updateField('special_perks', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: +1 CA, Accès aux poisons rares..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">
        Modificateurs de Caractéristiques (Bénédictions / Mentorat)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(statLabels).map(([key, label]) => {
          const val = bonuses[key] || 0;
          return (
            <div key={key} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-3 hover:border-[#2DD4BF]/20 transition-colors group">
              <span className="text-[10px] font-black uppercase tracking-widest text-silver/40 group-hover:text-[#2DD4BF] transition-colors">{label}</span>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => updateBonus(key, -1)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-all active:scale-90"><Minus size={14}/></button>
                <span className={`text-xl font-black w-8 text-center drop-shadow-md ${val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-white'}`}>{val > 0 ? `+${val}` : val}</span>
                <button type="button" onClick={() => updateBonus(key, 1)} className="p-2 bg-green-500/10 hover:bg-green-500/30 text-green-400 rounded-lg transition-all active:scale-90"><Plus size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const guildsConfig = {
  entityName: 'la guilde',
  tableName: 'guilds',
  title: 'Guildes & Organisations',
  getHeaderIcon: () => Users2,
  getHeaderColor: () => 'from-blue-600/30 via-indigo-500/20 to-violet-500/30',

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
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_guild_fields', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="geo" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom de la guilde',
          type: 'text',
          required: true,
          placeholder: 'Ex: Guilde des Marchands, Confrérie des Ombres...'
        },
        {
          name: 'subtitle',
          label: 'Devise ou titre honorifique',
          type: 'text',
          placeholder: 'Ex: Pour la justice, Dans l\'ombre...'
        },
        {
          name: 'world_id',
          label: 'Monde',
          type: 'relation',
          table: 'worlds'
        },
        {
          name: 'image_url',
          label: 'Blason ou Emblème',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description narrative',
          type: 'textarea',
          rows: 5,
          placeholder: 'Histoire, réputation, influence politique...'
        }
      ]
    },
    {
      id: 'structure',
      label: 'Organisation',
      icon: Building2,
      fields: [
        {
          name: 'type',
          label: 'Nature de l\'organisation',
          type: 'select',
          options: [
            { value: 'trade', label: 'Commerce & Artisanat' },
            { value: 'mercenary', label: 'Mercenaires & Guerriers' },
            { value: 'thieves', label: 'Voleurs & Bas-fonds' },
            { value: 'mages', label: 'Mages & Arcanes' },
            { value: 'assassins', label: 'Assassins & Espions' },
            { value: 'craftsmen', label: 'Compagnons Artisans' },
            { value: 'adventurers', label: 'Aventuriers' },
            { value: 'other', label: 'Autre' }
          ]
        },
        {
          name: 'leadership',
          label: 'Direction & Gouvernance',
          type: 'textarea',
          rows: 3,
          placeholder: 'Maître de guilde, conseil des anciens...'
        },
        {
          name: 'membership',
          label: 'Conditions d\'adhésion',
          type: 'textarea',
          rows: 3,
          placeholder: 'Prérequis, épreuves initiatiques, cotisations...'
        }
      ]
    },
    {
      id: 'activities',
      label: 'Activités',
      icon: Target,
      fields: [
        {
          name: 'data', 
          label: 'Moteur de Règles VTT',
          type: 'custom',
          isVirtual: true,
          component: GuildMechanicsEditor
        },
        {
          name: 'activities',
          label: 'Opérations courantes',
          type: 'textarea',
          rows: 4,
          placeholder: 'Commerce, missions secrètes, formation...'
        },
        {
          name: 'goals',
          label: 'Objectifs & Ambitions',
          type: 'textarea',
          rows: 3,
          placeholder: 'Buts à court et long terme...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie",
      icon: ImageIcon,
      fields: [
        {
          name: 'guild_images',
          label: 'Images de la guilde',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'headquarters', label: 'Quartier Général' },
            { id: 'members', label: 'Membres & Tenues' },
            { id: 'symbols', label: 'Symboles' }
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
          label: 'Secrets & Agendas cachés',
          type: 'textarea',
          rows: 4
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

export default function GuildsPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('guilds').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('guilds').delete().eq('id', deleteConfirm.item.id);
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
        title="Dissoudre la Guilde"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} ? Cette action supprimera ses secrets et ses membres des archives.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="guilds"
        title="Guildes"
        icon={Users2}
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
        config={guildsConfig}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={guildsConfig}
      />
    </div>
  );
}