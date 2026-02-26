// src/pages/CharactersPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Sword, Scroll, Crown, Skull, Zap, Backpack, 
  Sparkles, BookOpen, Compass, Clock, Star, Moon, Sun, Calendar 
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // L'injecteur système
import { supabase } from '../lib/supabase';
import { DEFAULT_RULESETS } from '../data/rulesets';
import DynamicStatsEditor from '../components/DynamicStatsEditor';
import ArsenalEditor from '../components/ArsenalEditor'; 
import CharacterSpellbook from '../components/CharacterSpellbook'; // Nouveau Grimoire Dynamique
import InventoryEditor from '../components/InventoryEditor'; // Nouvel Inventaire lié à la BDD
import { calculateCombatStats } from '../utils/rulesEngine';

// --- COMPOSANT : CALCULATEUR D'INFLUENCES ASTRALES SYNCHRONISÉES ---
const CosmicInfluenceStatus = ({ character }) => {
  const [influences, setInfluences] = useState([]);
  const [worldInfo, setWorldInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCosmicData() {
      if (!character?.world_id) return;
      
      // 1. Récupérer l'état actuel du monde (Temps + Configuration Calendrier)
      const { data: world } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', character.world_id)
        .single();
      setWorldInfo(world);

      // 2. Récupérer toutes les influences astrologiques configurées pour ce monde
      const { data: allHoroscopes } = await supabase
        .from('horoscopes')
        .select('*, celestial_bodies(name)')
        .eq('world_id', character.world_id);
      
      if (allHoroscopes && world) {
        const months = world.calendar_config?.months || [];

        // LOGIQUE DE FILTRAGE : On cumule Natal + Annuel + Mensuel + Quotidien + Horaire
        const active = allHoroscopes.filter(h => {
          // A. Influence de Naissance (Fixe)
          if (h.scale === 'natal' && character.birth_date) {
            return character.birth_date.includes(h.start_date) || character.data?.zodiac === h.name;
          }
          
          // B. Influence Annuelle
          if (h.scale === 'year' && h.start_date === String(world.current_year)) return true;

          // C. Influence Mensuelle
          if (h.scale === 'month') {
            const currentMonthName = months[world.current_month - 1]?.name;
            return h.name === currentMonthName || h.start_date === String(world.current_month);
          }

          // D. Influence Journalière
          if (h.scale === 'day' && h.start_date === String(world.current_day)) return true;

          // E. Influence Horaire
          if (h.scale === 'hour' && h.start_date === String(world.current_hour)) return true;
          
          return false;
        });

        setInfluences(active);
      }
      setLoading(false);
    }
    fetchCosmicData();
  }, [character]);

  const totalMod = influences.reduce((acc, curr) => acc + (curr.data?.celestial_configs?.global_modifier || 0), 0);

  if (loading) return <div className="p-8 text-center text-silver/20 animate-pulse uppercase tracking-widest text-xs">Consultation des Astres...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* TABLEAU DE BORD COSMIQUE */}
      <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 text-purple-500">
          <Compass size={140} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              {/* CORRECTION : Retrait de 'italic' des classes ci-dessous */}
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">
                {character?.ruleset_id === 'starfinder' || character?.ruleset_id === 'cyberpunk' ? 'Résonance Énergétique' : 'Thème Astral'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star size={12}/> Né le {character?.birth_date || 'Inconnu'} à {character?.birth_hour || '??'}h
                </span>
                {worldInfo && (
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12}/> Temps du Monde : J{worldInfo.current_day} / M{worldInfo.current_month} / A{worldInfo.current_year}
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-black/60 px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-center shadow-inner">
              <span className="text-[10px] font-black text-silver/40 uppercase mb-1">Modificateur Global</span>
              <span className={`text-4xl font-black ${totalMod >= 0 ? 'text-green-400' : 'text-red-400'} drop-shadow-md`}>
                {totalMod > 0 ? `+${totalMod}` : totalMod}%
              </span>
            </div>
          </div>

          <p className="text-[10px] text-silver/40 font-bold uppercase tracking-widest border-t border-white/5 pt-4">
            Influences cumulées sur l'ensemble des compétences et jets de dés.
          </p>
        </div>
      </div>

      {/* LISTE DES INFLUENCES ACTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {influences.map((inf, idx) => (
          <div key={idx} className="bg-[#151725] p-5 rounded-2xl border border-white/5 flex items-center gap-5 transition-all hover:bg-white/5 group">
            <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${inf.scale === 'natal' ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/5' : 'bg-purple-500/20 text-purple-400 shadow-purple-500/5'}`}>
              {inf.scale === 'natal' ? <Star size={24}/> : <Moon size={24}/>}
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">{inf.name}</h4>
              <p className="text-[10px] text-silver/50 font-bold uppercase flex items-center gap-2">
                <span className="text-teal-500/70">{inf.scale}</span> • {inf.celestial_bodies?.name || 'Astre dominant'}
              </p>
            </div>
            <div className={`ml-auto text-sm font-black ${inf.data?.celestial_configs?.global_modifier >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {inf.data?.celestial_configs?.global_modifier > 0 ? '+' : ''}{inf.data?.celestial_configs?.global_modifier}%
            </div>
          </div>
        ))}
        {influences.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <Sparkles size={32} className="mx-auto text-silver/10 mb-4" />
            <p className="text-[10px] text-silver/30 font-black uppercase tracking-widest">Le ciel est muet pour ce héros aujourd'hui</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- LOGIQUE DE CONNEXION DES ÉDITEURS ---
const ConnectedStatsEditor = ({ value, onChange, formData }) => {
  const currentRulesetId = formData?.ruleset_id || 'dnd5';
  const currentRuleset = DEFAULT_RULESETS[currentRulesetId] || DEFAULT_RULESETS['dnd5'];
  
  const handleStatsChange = (newStats) => {
    const derived = calculateCombatStats(currentRulesetId, newStats, formData.level);
    onChange({ ...newStats, ...derived });
  };
  return <DynamicStatsEditor ruleset={currentRuleset} data={value} onChange={handleStatsChange} />;
};

// --- CONFIGURATION DE LA FICHE PERSONNAGE ---
const charactersConfig = {
  entityName: 'le personnage',
  tableName: 'characters',
  title: 'Forge des Héros',
  getHeaderIcon: (it) => (!it ? User : it.character_type === 'PJ' ? Crown : User),
  getHeaderColor: (it) => (it?.character_type === 'PJ' ? 'from-amber-600/40 via-yellow-500/20 to-orange-500/30' : 'from-slate-700/40 via-blue-900/30 to-slate-800/50'),

  tabs: [
    {
      id: 'identity',
      label: 'Système & Identité',
      icon: User,
      fields: [
        { 
          name: 'ruleset_id', 
          label: 'Système de Règles', 
          type: 'select', 
          required: true, 
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_character_fields', 
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Détails Système',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="race" 
              formData={formData} 
              onChange={onFullChange} 
            />
          )
        },
        { name: 'name', label: 'Nom du Héros', type: 'text', required: true, placeholder: 'Nom du personnage...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
        { name: 'character_type', label: 'Type', type: 'select', options: [{ value: 'PJ', label: 'PJ' }, { value: 'PNJ', label: 'PNJ' }] },
        { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },
        { name: 'birth_date', label: 'Date de Naissance (JJ-MM-AAAA)', type: 'text', placeholder: 'Ex: 14-03-1284' },
        { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
        { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
        { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
        { name: 'subclass_id', label: 'Archétype (Sous-Classe)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
        { name: 'level', label: 'Niveau', type: 'number', required: true },
        { name: 'image_url', label: 'Portrait', type: 'image' }
      ]
    },
    {
      id: 'cosmic',
      label: 'Destin & Astres',
      icon: Sparkles,
      fields: [
        { 
          name: 'cosmic_status', 
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Influence des Astres en Temps Réel', 
          type: 'custom', 
          component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
        }
      ]
    },
    {
      id: 'stats',
      label: 'Caractéristiques & Compétences',
      icon: Shield,
      fields: [
        { 
          name: 'data', 
          label: 'Fiche Technique Interactive', 
          type: 'custom', 
          component: ConnectedStatsEditor 
        }
      ]
    },
    {
      id: 'combat',
      label: 'Combat & Arsenal',
      icon: Sword,
      fields: [
        { 
          name: 'arsenal_data', 
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Arsenal & Équipement', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <ArsenalEditor 
              value={formData.data?.arsenal || []} 
              onChange={(newArsenal) => onFullChange({ ...formData, data: { ...formData.data, arsenal: newArsenal } })} 
              formData={formData} 
            />
          )
        },
        { 
          name: 'abilities', 
          label: 'Capacités Spéciales', 
          type: 'textarea', 
          placeholder: 'Talents, traits de combat...' 
        }
      ]
    },
    {
      id: 'magic',
      label: 'Grimoire Arcanique',
      icon: Sparkles,
      fields: [
        { 
          name: 'magic_editor', 
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Maîtrise des Arcanes', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <CharacterSpellbook 
              character={formData} 
              onChange={(newData) => onFullChange({ ...formData, data: newData })} 
            />
          )
        }
      ]
    },
    {
      id: 'bio',
      label: 'Biographie & Histoire',
      icon: Scroll,
      fields: [
        { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...' },
        { name: 'personality', label: 'Traits de Personnalité', type: 'textarea', rows: 3, placeholder: 'Caractère...' },
        { name: 'description', label: 'Apparence Physique', type: 'textarea', rows: 3, placeholder: 'Traits distinctifs...' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventaire',
      icon: Backpack,
      fields: [
        {
          name: 'money_custom',
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Bourse & Richesses',
          type: 'custom',
          component: ({ formData, onFullChange }) => (
            <div className="grid grid-cols-4 gap-4 mb-8 bg-[#0f111a] p-6 rounded-[2rem] border border-white/5">
              {['pp', 'po', 'pa', 'pc'].map(coin => {
                const colors = { 
                  pp: 'text-slate-200 border-slate-500/30', 
                  po: 'text-yellow-400 border-yellow-500/30', 
                  pa: 'text-zinc-400 border-zinc-400/30', 
                  pc: 'text-orange-400 border-orange-500/30' 
                };
                const labels = { pp: 'Platine', po: 'Or', pa: 'Argent', pc: 'Cuivre' };
                return (
                  <div key={coin} className={`bg-black/40 p-4 rounded-2xl border ${colors[coin]} text-center`}>
                    <span className="text-[10px] font-black uppercase mb-2 block text-silver/60">{labels[coin]}</span>
                    <input 
                      type="number" 
                      value={formData.data?.[`money_${coin}`] || 0} 
                      onChange={(e) => onFullChange({...formData, data: {...formData.data, [`money_${coin}`]: parseInt(e.target.value)||0}})} 
                      className={`w-full bg-transparent text-center text-xl font-black outline-none [&::-webkit-inner-spin-button]:appearance-none ${colors[coin].split(' ')[0]}`} 
                    />
                  </div>
                );
              })}
            </div>
          )
        },
        { 
          name: 'inventory_data', 
          isVirtual: true, // FLAG SAUVEGARDE
          label: 'Sac à dos (Équipement BD)', 
          type: 'custom', 
          component: ({ formData, onFullChange }) => (
            <InventoryEditor 
              value={formData.data?.inventory || []} 
              onChange={(newInv) => onFullChange({ ...formData, data: { ...formData.data, inventory: newInv } })} 
            />
          ) 
        }
      ]
    },
    {
      id: 'gm', // HARMONISÉ EN 'gm' POUR LA SÉCURITÉ MJ
      label: 'MJ (Secret)',
      icon: Skull,
      fields: [
        { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...' }
      ]
    }
  ]
};

export default function CharactersPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getAugmentedItem = (item) => {
    if (!item) return null;
    const auto = calculateCombatStats(item.ruleset_id, item.data || {}, item.level);
    return { ...item, ...auto };
  };

  return (
    <>
      <EntityList 
        key={refreshKey} 
        tableName="characters" 
        title="Forge des Personnages" 
        icon={User} 
        onView={(it) => setSelectedItem(it)} 
        onEdit={(it) => { setEditingItem(it); setIsCreating(true); }}
        onCreate={() => { setEditingItem(null); setIsCreating(true); }}
        onDelete={async (it) => { 
          if (confirm(`Supprimer ${it.name}?`)) { 
            await supabase.from('characters').delete().eq('id', it.id); 
            setRefreshKey(k => k + 1); 
          }
        }} 
      />
      
      <EnhancedEntityDetail 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={getAugmentedItem(selectedItem)} 
        config={charactersConfig} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }} 
      />
      
      <EnhancedEntityForm 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        item={editingItem} 
        config={charactersConfig} 
        onSuccess={() => setRefreshKey(k => k + 1)} 
      />
    </>
  );
}