import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Info, Calendar, Star, Shield, Image as ImageIcon, 
  Plus, Minus, Zap, Compass, Clock, Moon, Sun, AlertOctagon
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes
import { supabase } from '../lib/supabase';

// --- COMPOSANT : ÉDITEUR DE CONJONCTION (PRÉDOMINANCE / ABSENCE) ---
const CosmicInfluenceEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const [celestialBodies, setCelestialBodies] = useState([]);
  
  // Configuration des astres
  const configs = data.celestial_configs || { predominant: [], absent: [], modifiers: {} };

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
      <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-purple-500/20 shadow-2xl">
        <h4 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Star size={16} /> Configuration des Alignements
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ASTRES PRÉDOMINANTS */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-green-400 flex items-center gap-2">
              <Sun size={12} /> Astres Prédominants (Bonus)
            </label>
            <div className="flex flex-wrap gap-2">
              {celestialBodies.map(body => (
                <button
                  key={body.id} type="button"
                  onClick={() => toggleBody('predominant', body.id)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                    configs.predominant.includes(body.id)
                    ? 'bg-green-500/20 border-green-500 text-green-300'
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
            <label className="text-[10px] font-black uppercase text-red-400 flex items-center gap-2">
              <Moon size={12} /> Astres Absents / Obscurcis (Malus)
            </label>
            <div className="flex flex-wrap gap-2">
              {celestialBodies.map(body => (
                <button
                  key={body.id} type="button"
                  onClick={() => toggleBody('absent', body.id)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                    configs.absent.includes(body.id)
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'bg-black/40 border-white/5 text-silver/40 hover:border-white/20'
                  }`}
                >
                  {body.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
          <label className="text-[10px] font-black uppercase text-teal-400 block mb-4">
            Intensité de l'Influence sur les Compétences (%)
          </label>
          <div className="flex items-center gap-6">
            <input 
              type="range" min="-20" max="20" step="0.5"
              value={configs.global_modifier || 0}
              onChange={(e) => updateGlobalModifier(e.target.value)}
              className="flex-1 accent-teal-500"
            />
            <span className={`text-xl font-black min-w-[60px] text-center ${configs.global_modifier > 0 ? 'text-green-400' : configs.global_modifier < 0 ? 'text-red-400' : 'text-white'}`}>
              {configs.global_modifier > 0 ? `+${configs.global_modifier}` : configs.global_modifier}%
            </span>
          </div>
          <p className="text-[10px] text-silver/30 mt-2 italic">
            Note: Cette valeur impacte l'ensemble des jets de dés (compétences, attaques, sauvegardes).
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
  title: 'Horoscope & Influences Cosmiques',
  getHeaderIcon: () => Sparkles,
  getHeaderColor: () => 'from-purple-900/60 via-indigo-900/40 to-black',

  tabs: [
    {
      id: 'general',
      label: 'Identité de l\'Influence',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_celestial', // INJECTEUR DYNAMIQUE (AJOUTÉ)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="celestial" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        { name: 'name', label: 'Nom (Signe, Saison, ou Heure)', type: 'text', required: true, placeholder: 'Ex: Signe du Dragon, Heure de la Pénombre...' },
        { name: 'subtitle', label: 'Appellation Scientifique / Futuriste', type: 'text', placeholder: 'Ex: Alignement Magnétique Alpha-7...' },
        { name: 'world_id', label: 'Monde lié', type: 'relation', table: 'worlds', required: true },
        { 
          name: 'scale', 
          label: 'Échelle de Temps', 
          type: 'select',
          required: true,
          options: [
            { value: 'natal', label: 'Influence de Naissance (Fixe)' },
            { value: 'year', label: 'Influence Annuelle (Très légère)' },
            { value: 'month', label: 'Influence Mensuelle (Légère)' },
            { value: 'week', label: 'Influence Hebdomadaire (Modérée)' },
            { value: 'day', label: 'Influence Journalière (Importante)' },
            { value: 'hour', label: 'Influence Horaire (Critique)' }
          ]
        },
        { name: 'image_url', label: 'Iconographie / Schéma Énergétique', type: 'image' },
        { name: 'description', label: 'Effets Narratifs & Lore', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'engine',
      label: 'Moteur d\'Influence VTT',
      icon: Zap,
      fields: [
        {
          name: 'data', // COLONNE VTT (Conservé tel quel)
          label: 'Configuration Cosmique',
          type: 'custom',
          component: CosmicInfluenceEditor
        }
      ]
    },
    {
      id: 'cycle',
      label: 'Période d\'Activation',
      icon: Clock,
      fields: [
        { name: 'start_date', label: 'Début (Format libre selon calendrier)', type: 'text', placeholder: 'Ex: Jour 1, Mois 3...' },
        { name: 'end_date', label: 'Fin (Format libre)', type: 'text' },
        { name: 'celestial_body_id', label: 'Astre Référent', type: 'relation', table: 'celestial_bodies' }
      ]
    },
    {
      id: 'gm', // SÉCURITÉ MJ ACTIVÉE
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'notes', label: 'Secrets des Alignements', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function HoroscopesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="horoscopes"
        title="Système d'Influences"
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={() => { setEditingItem(null); setShowForm(true); }}
      />
      
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        config={horoscopeConfig}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={async () => {
          if (!confirm('Supprimer cette influence ?')) return;
          await supabase.from('horoscopes').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        item={editingItem}
        config={horoscopeConfig}
        onSuccess={() => { setRefreshKey(prev => prev + 1); setShowForm(false); }}
      />
    </>
  );
}