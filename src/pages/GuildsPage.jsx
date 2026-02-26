import { useState } from 'react';
import { Users2, Info, Building2, Target, ImageIcon, Shield, Plus, Minus } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

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
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les avantages mécaniques (VTT) accordés aux membres de cette guilde (ex: accès à des sorts spécifiques, atouts passifs, bonus de caractéristiques via l'entraînement).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Sorts ou Capacités de Guilde</label>
          <input 
            type="text" value={data.granted_spells || ''} onChange={(e) => updateField('granted_spells', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Détection de la magie, Invisibilité..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Atouts passifs / Équipement</label>
          <input 
            type="text" value={data.special_perks || ''} onChange={(e) => updateField('special_perks', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: +1 CA, Accès aux poisons rares..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus de Caractéristiques (Entraînement / Bénédiction)
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

const guildsConfig = {
  entityName: 'la guilde',
  tableName: 'guilds',
  title: 'Guildes',
  getHeaderIcon: () => Users2,
  getHeaderColor: () => 'from-blue-600/30 via-indigo-500/20 to-violet-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
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
          name: 'dynamic_guild_fields', // INJECTEUR DYNAMIQUE (AJOUTÉ)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="geo" // Les guildes utilisent la clé geo pour les modificateurs sociaux/locaux
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
          label: 'Devise ou titre',
          type: 'text',
          placeholder: 'Ex: Pour la justice, Dans l\'ombre...'
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
          label: 'Emblème de la guilde',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Histoire, réputation, influence...'
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
          label: 'Type de guilde',
          type: 'select',
          options: [
            { value: 'trade', label: 'Commerce' },
            { value: 'mercenary', label: 'Mercenaires' },
            { value: 'thieves', label: 'Voleurs' },
            { value: 'mages', label: 'Mages' },
            { value: 'assassins', label: 'Assassins' },
            { value: 'craftsmen', label: 'Artisans' },
            { value: 'adventurers', label: 'Aventuriers' },
            { value: 'other', label: 'Autre' }
          ]
        },
        {
          name: 'leadership',
          label: 'Direction',
          type: 'textarea',
          rows: 3,
          placeholder: 'Maître de guilde, conseil, hiérarchie...'
        },
        {
          name: 'members',
          label: 'Membres notables',
          type: 'textarea',
          rows: 4,
          placeholder: 'Noms et rôles des membres importants...'
        },
        {
          name: 'membership',
          label: 'Conditions d\'adhésion',
          type: 'textarea',
          rows: 3,
          placeholder: 'Prérequis, épreuves, cotisations...'
        }
      ]
    },
    {
      id: 'activities',
      label: 'Activités & Avantages',
      icon: Target,
      fields: [
        {
          name: 'data', // COLONNE VTT (Composant original conservé)
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: GuildMechanicsEditor
        },
        {
          name: 'activities',
          label: 'Activités principales',
          type: 'textarea',
          rows: 4,
          placeholder: 'Commerce, missions, formation...'
        },
        {
          name: 'goals',
          label: 'Objectifs',
          type: 'textarea',
          rows: 3,
          placeholder: 'Buts à court et long terme...'
        },
        {
          name: 'resources',
          label: 'Ressources',
          type: 'textarea',
          rows: 3,
          placeholder: 'Entrepôts, contacts, informations...'
        },
        {
          name: 'benefits',
          label: 'Avantages narratifs membres',
          type: 'textarea',
          rows: 3,
          placeholder: 'Accès à des services, réductions, protection...'
        }
      ]
    },
    {
      id: 'relations',
      label: 'Relations',
      icon: Users2,
      fields: [
        {
          name: 'allies',
          label: 'Alliés',
          type: 'textarea',
          rows: 2,
          placeholder: 'Autres guildes, factions amies...'
        },
        {
          name: 'rivals',
          label: 'Rivaux',
          type: 'textarea',
          rows: 2,
          placeholder: 'Guildes concurrentes, ennemis...'
        },
        {
          name: 'reputation',
          label: 'Réputation',
          type: 'textarea',
          rows: 2,
          placeholder: 'Comment la guilde est perçue...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'guild_images',
          label: 'Images de la guilde',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'headquarters', label: 'Quartier général' },
            { id: 'members', label: 'Membres' },
            { id: 'symbols', label: 'Symboles' }
          ]
        }
      ]
    },
    {
      id: 'gm', // SÉCURITÉ MJ ACTIVÉE
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'secrets',
          label: 'Secrets',
          type: 'textarea',
          rows: 3,
          placeholder: 'Complots, agendas cachés...'
        },
        {
          name: 'hooks',
          label: 'Accroches de quête',
          type: 'textarea',
          rows: 3,
          placeholder: 'Missions possibles pour les joueurs...'
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

export default function GuildsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="guilds"
        title="Guildes"
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
          await supabase.from('guilds').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={guildsConfig}
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
        config={guildsConfig}
      />
    </>
  );
}