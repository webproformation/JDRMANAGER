import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Info, Calendar, Star, Shield, Image as ImageIcon, 
  Plus, Minus, Zap, Compass, Clock, Moon, Sun, AlertOctagon
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import VTTDialog from '../components/VTTDialog';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

// --- COMPOSANT : ÉDITEUR DE CONJONCTION (PRÉDOMINANCE / ABSENCE) ---
const CosmicInfluenceEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const [celestialBodies, setCelestialBodies] = useState([]);
  const configs = data.celestial_configs || { predominant: [], absent: [], global_modifier: 0 };

  useEffect(() => {
    async function fetchBodies() {
      const { data: bodies } = await supabase.from('celestial_bodies').select('id, name');
      if (bodies) setCelestialBodies(bodies);
    }
    fetchBodies();
  }, []);

  const toggleBody = (listName, bodyId) => {
    const newList = configs[listName].includes(bodyId)
      ? configs[listName].filter(id => id !== bodyId)
      : [...configs[listName], bodyId];
    
    onChange({ 
      ...data, 
      celestial_configs: { ...configs, [listName]: newList } 
    });
  };

  const updateGlobalModifier = (val) => {
    onChange({ 
      ...data, 
      celestial_configs: { ...configs, global_modifier: parseFloat(val) } 
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
        <h4 className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
          <Star size={14} className="animate-pulse" /> Configuration des Alignements Énergétiques
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ASTRES PRÉDOMINANTS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-green-400 flex items-center gap-2 ml-1">
              <Sun size={12} /> Astres en Ascendance (Bonus)
            </label>
            <div className="flex flex-wrap gap-2">
              {celestialBodies.map(body => (
                <button
                  key={body.id} type="button"
                  onClick={() => toggleBody('predominant', body.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    configs.predominant.includes(body.id)
                    ? 'bg-green-500/20 border-green-500 text-green-300 shadow-lg shadow-green-500/10'
                    : 'bg-black/40 border-white/5 text-silver/40 hover:border-white/20'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>

          {/* ASTRES ABSENTS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-red-400 flex items-center gap-2 ml-1">
              <Moon size={12} /> Astres Obscurcis (Malus)
            </label>
            <div className="flex flex-wrap gap-2">
              {celestialBodies.map(body => (
                <button
                  key={body.id} type="button"
                  onClick={() => toggleBody('absent', body.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    configs.absent.includes(body.id)
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/10'
                    : 'bg-black/40 border-white/5 text-silver/40 hover:border-white/20'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <label className="text-[10px] font-black uppercase text-[#2DD4BF] block mb-6 ml-1">
            Intensité de la Résonance Magique (%)
          </label>
          <div className="flex items-center gap-8">
            <input 
              type="range" min="-20" max="20" step="0.5"
              value={configs.global_modifier || 0}
              onChange={(e) => updateGlobalModifier(e.target.value)}
              className="flex-1 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
            />
            <span className={`text-2xl font-black min-w-[80px] text-right drop-shadow-md ${configs.global_modifier > 0 ? 'text-green-400' : configs.global_modifier < 0 ? 'text-red-400' : 'text-white'}`}>
              {configs.global_modifier > 0 ? `+${configs.global_modifier}` : configs.global_modifier}%
            </span>
          </div>
          <p className="text-[10px] text-silver/30 mt-4 italic flex items-center gap-2">
            <Info size={12} /> Note : Impacte l'ensemble des flux énergétiques (Attaques, Sorts, Sauvegardes).
          </p>
        </div>
      </div>
    </div>
  );
};

// --- CONFIGURATION DE LA PAGE ---
const horoscopeConfig = {
  entityName: 'l\'influence',
  tableName: 'horoscopes',
  title: 'Horoscope & Influences',
  getHeaderIcon: () => Sparkles,
  getHeaderColor: () => 'from-purple-900/60 via-indigo-900/40 to-black',

  tabs: [
    {
      id: 'general',
      label: 'Identité Cosmique',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', 
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_celestial', 
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id || 'dnd5'} 
              entityType="celestial" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        { name: 'name', label: 'Nom du Signe ou de la Phase', type: 'text', required: true, placeholder: 'Ex: Signe du Dragon, Heure de la Pénombre...' },
        { name: 'subtitle', label: 'Désignation Astrologique', type: 'text', placeholder: 'Ex: Alignement Magnétique Alpha-7...' },
        { name: 'world_id', label: 'Monde lié', type: 'relation', table: 'worlds', required: true },
        { 
          name: 'scale', 
          label: 'Périodicité', 
          type: 'select',
          required: true,
          options: [
            { value: 'natal', label: 'Influence de Naissance (Fixe)' },
            { value: 'year', label: 'Cycle Annuel' },
            { value: 'month', label: 'Cycle Mensuel' },
            { value: 'week', label: 'Cycle Hebdomadaire' },
            { value: 'day', label: 'Cycle Journalier' },
            { value: 'hour', label: 'Cycle Horaire (Critique)' }
          ]
        },
        { name: 'image_url', label: 'Schéma Énergétique / Icone', type: 'image' },
        { name: 'description', label: 'Récits & Lore', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'engine',
      label: 'Moteur d\'Influence',
      icon: Zap,
      fields: [
        {
          name: 'data', 
          label: 'Alignements Cosmiques',
          type: 'custom',
          isVirtual: true,
          component: CosmicInfluenceEditor
        }
      ]
    },
    {
      id: 'cycle',
      label: 'Activation',
      icon: Clock,
      fields: [
        { name: 'start_date', label: 'Date de Début (Format Libre)', type: 'text', placeholder: 'Ex: Jour 1, Mois 3...' },
        { name: 'end_date', label: 'Date de Fin', type: 'text' },
        { name: 'celestial_body_id', label: 'Astre Dominant', type: 'relation', table: 'celestial_bodies' }
      ]
    },
    {
      id: 'gm', 
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'notes', label: 'Secrets des Alignements', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function HoroscopesPage({ activeRuleset, activeWorldId }) {
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
        const { data, error } = await supabase.from('horoscopes').select('*').eq('id', id).single();
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
      const { error } = await supabase.from('horoscopes').delete().eq('id', deleteConfirm.item.id);
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
        title="Dissiper l'Influence"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} des constellations ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="horoscopes"
        title="Système d'Influences"
        icon={Sparkles}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />
      
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => { setSelectedItem(null); cleanURL(); }}
        item={selectedItem}
        config={horoscopeConfig}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); cleanURL(); }}
        item={editingItem}
        config={horoscopeConfig}
        onSuccess={handleSuccess}
      />
    </div>
  );
}