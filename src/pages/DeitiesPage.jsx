import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Scroll, Users, Zap, Shield, Image as ImageIcon, 
  Sun, Moon, Crown, Plus, Minus, Landmark, Flame, Sword, BookOpen,
  Ghost, Star, History, Crosshair, HelpCircle
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields';
import MultiSelectWithOther from '../components/MultiSelectWithOther';
import VTTDialog from '../components/VTTDialog'; 

// Import des futurs Layouts/Forms Prestige (à créer/modifier)
import DeityLayout from '../components/EnhancedEntityDetail/layouts/DeityLayout';
import DeityForm from '../components/EnhancedEntityForm/layouts/DeityForm';

import { DEFAULT_RULESETS } from '../data/rulesets';
import { supabase } from '../lib/supabase';

/**
 * COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (DIVINITÉS)
 */
const DeityMechanicsEditor = ({ value = {}, onChange, item, formData }) => {
  const data = value || item?.data || formData?.data || {};
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
    <div className="bg-black/20 backdrop-blur-sm rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les bénédictions mécaniques (VTT) accordées par cette divinité (sorts de domaine, immunités, bonus divins).
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Sorts Accordés (Domaine)</label>
          <input 
            type="text" value={data.granted_spells || ''} onChange={(e) => updateField('granted_spells', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Mot de guérison, Colonne de flammes..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Bénédictions / Immunités</label>
          <input 
            type="text" value={data.divine_boons || ''} onChange={(e) => updateField('divine_boons', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-teal-500/50 outline-none placeholder-silver/20"
            placeholder="Ex: Immunité au feu, +1 CA divine..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-4 border-t border-white/5 pt-6">
        Bonus de Caractéristiques (Champion / Élu)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

// --- CONFIGURATION PRESTIGE 3.0 ---
const godsConfig = {
  entityName: 'la divinité',
  tableName: 'deities',
  title: 'Panthéon Divine',
  getHeaderIcon: (item) => {
    if (!item) return Sparkles;
    switch (item.divine_rank) {
      case 'overdeity': return Sun;
      case 'greater': return Crown;
      case 'demigod': return Zap;
      case 'quasi': return Moon;
      default: return Sparkles;
    }
  },
  getHeaderColor: () => 'from-teal-900/60 via-cyan-900/40 to-emerald-900/20',
  tabs: [
    {
      id: 'general',
      label: 'Identité Divine',
      icon: Crown,
      fields: [
        { name: 'name', label: 'Nom de la Divinité', type: 'text', required: true, placeholder: 'Ex: Kelemvor...' },
        { name: 'title', label: 'Titre / Épithète', type: 'text', placeholder: 'Le Seigneur des Morts' },
        { name: 'ruleset_id', label: 'Système de Règles', type: 'select', options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
        { name: 'pantheon', label: 'Panthéon', type: 'text', placeholder: 'Panthéon des Oubliés' },
        { 
          name: 'alignment', 
          label: 'Alignement', 
          type: 'select', 
          options: [
            { value: 'lawful_good', label: 'Loyal Bon' }, { value: 'neutral_good', label: 'Neutre Bon' }, { value: 'chaotic_good', label: 'Chaotique Bon' },
            { value: 'lawful_neutral', label: 'Loyal Neutre' }, { value: 'true_neutral', label: 'Neutre Absolu' }, { value: 'chaotic_neutral', label: 'Chaotique Neutre' },
            { value: 'lawful_evil', label: 'Loyal Mauvais' }, { value: 'neutral_evil', label: 'Neutre Mauvais' }, { value: 'chaotic_evil', label: 'Chaotique Mauvais' }
          ]
        },
        { 
          name: 'divine_rank', 
          label: 'Rang Divin', 
          type: 'select', 
          options: [
            { value: 'overdeity', label: 'Surdivinité' }, { value: 'greater', label: 'Dieu Majeur' }, { value: 'intermediate', label: 'Dieu Intermédiaire' },
            { value: 'lesser', label: 'Dieu Mineur' }, { value: 'demigod', label: 'Demi-Dieu' }, { value: 'quasi', label: 'Quasi-Divinité' }
          ]
        },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds' },
        { 
          name: 'domains', 
          label: 'Domaines d\'Influence', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Guerre', 'Mort', 'Nature', 'Sagesse', 'Tempête', 'Fourberie', 'Lumière', 'Forge', 'Connaissance', 'Repos éternel']} /> 
        },
        { 
          name: 'portfolio', 
          label: 'Portefeuille / Attributions', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['La Justice', 'Les funérailles', 'La vengeance', 'La récolte', 'Le commerce maritime', 'Le passage du temps', 'La protection des faibles']} /> 
        },
        { name: 'image_url', label: 'Avatar Principal', type: 'image' },
        { name: 'description', label: 'Description & Lore', type: 'textarea', rows: 4 },
        { name: 'appearance', label: 'Manifestation Physique', type: 'textarea', rows: 3 },
        { name: 'symbol', label: 'Symbole Sacré', type: 'text', placeholder: 'Un bras squelettique tenant une balance' },
        { name: 'sacred_symbol_description', label: 'Signification du Symbole', type: 'textarea', rows: 2 },
        {
          name: 'dynamic_deity_fields',
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => {
            const data = props.formData || props.item || {};
            return (
              <RulesetDynamicFields 
                rulesetId={data.ruleset_id || 'dnd5'} 
                entityType="deity" 
                formData={data} 
                onChange={props.onChange} 
              />
            );
          }
        }
      ]
    },
    {
      id: 'worship',
      label: 'Culte & Dogme',
      icon: Scroll,
      fields: [
        { name: 'data', label: 'Moteur de Règles VTT', type: 'custom', component: DeityMechanicsEditor },
        { name: 'favored_weapon', label: 'Arme de prédilection', type: 'text' },
        { name: 'holy_days', label: 'Jours Sacrés & Calendrier', type: 'text' },
        { name: 'clergy_alignments', label: 'Alignement du Clergé', type: 'text' },
        { 
          name: 'rituals', 
          label: 'Rituels & Sacrifices', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Sacrifices d\'encens', 'Prières à l\'aube', 'Jeûne rituel de 3 jours', 'Pèlerinage au sanctuaire', 'Libations de vin sacré', 'Processions nocturnes', 'Chants grégoriens']} /> 
        },
        { 
          name: 'worshippers', 
          label: 'Fidèles & Ordres', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Ordre des Veilleurs', 'Inquisition de Fer', 'Cercle des Déshérités', 'Fraternité du Sang', 'Secte de l\'Ombre', 'Chevaliers de l\'Aube']} /> 
        },
        { 
          name: 'typical_worshippers', 
          label: 'Profil des Adorateurs', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Paysans et Laboureurs', 'Guerriers vétérans', 'Mages érudits', 'Juges et Avocats', 'Marins et Marchands', 'Bourreaux et Assassins']} /> 
        },
        { 
          name: 'divine_servants', 
          label: 'Serviteurs Célestes / Infernaux', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Anges solaires', 'Diables contractuels', 'Élémentaires de foudre', 'Spectres vengeurs', 'Chiens de l\'enfer', 'Totems animaliers']} /> 
        },
        { 
          name: 'temples', 
          label: 'Lieux de Culte & Organisation', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Cathédrales urbaines', 'Sanctuaires de forêt isolés', 'Grottes oubliées', 'Autels de voyage', 'Forteresses-temples', 'Chapelles de quartier']} /> 
        }
      ]
    },
    // ==========================================================
    // NOUVEL ONGLET HISTOIRE (Moteur V4.3 Polymorphe)
    // ==========================================================
    {
      id: 'history_tab',
      label: 'Actes & Chronologie Divines',
      icon: History,
      fields: [
        { 
          name: 'historical_chronicle', 
          label: 'Mémoire des Dieux', 
          type: 'world_history_editor',
          entityType: 'deity', 
          isVirtual: true     
        }
      ]
    },
    {
      id: 'powers',
      label: 'Pouvoirs & Artefacts',
      icon: Zap,
      fields: [
        { 
          name: 'sacred_artifacts', 
          label: 'Reliques & Artefacts Sacrés', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Lame dévorante d\'âmes', 'Sceptre de pure lumière', 'Couronne d\'épines divines', 'Orbe des tempêtes', 'Livre des Saintes Lois', 'Bouclier de foi']} /> 
        },
        { 
          name: 'granted_powers', 
          label: 'Pouvoirs de Domaine', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Clairvoyance céleste', 'Résistance au feu divin', 'Vol spirituel', 'Commande des morts', 'Aura de peur sacrée', 'Guérison accélérée']} /> 
        },
        { 
          name: 'divine_spells', 
          label: 'Sorts Divins Spécifiques', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Mot de Pouvoir : Mort', 'Colonne de Lumière Eternelle', 'Fléau de Dieu', 'Intervention Divine Directe', 'Résurrection Majeure']} /> 
        },
        { 
          name: 'avatar_description', 
          label: 'Forme de l\'Avatar', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Géant de lumière pure', 'Animal chimérique massif', 'Ombre immatérielle terrifiante', 'Vague de pure énergie', 'Forme humaine parfaite et sereine']} /> 
        },
        { 
          name: 'manifestations', 
          label: 'Signes & Manifestations Divines', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Pluie de sang', 'Éclipses solaires soudaines', 'Chant d\'oiseaux célestes', 'Visions oniriques collectives', 'Tonnerre sans nuages']} /> 
        }
      ]
    },
    {
      id: 'relations',
      label: 'Alliances & Conflits',
      icon: Users,
      fields: [
        { 
          name: 'allies', 
          label: 'Divinités Alliées', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Le Panthéon de l\'Ordre', 'Le Conseil de la Nature', 'La Fraternité du Sang', 'Le Cercle de l\'Aube', 'L\'Alliance des Gardiens']} /> 
        },
        { 
          name: 'enemies', 
          label: 'Divinités Ennemies', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Le Chaos Primordial', 'Le Seigneur des Abysses', 'L\'Oubli Absolu', 'La Secte du Vide', 'Le Fléau des Mondes']} /> 
        }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie Sacrée',
      icon: ImageIcon,
      fields: [
        { 
          name: 'deity_images', 
          label: 'Images de la Divinité', 
          type: 'images', 
          bucket: 'images', 
          render: () => null,
          categories: [
            { id: 'god', label: 'Avatar' }, 
            { id: 'symbols', label: 'Symboles' }, 
            { id: 'temples', label: 'Temples' }, 
            { id: 'disciples', label: 'Disciples' }
          ] 
        }
      ]
    },
    {
      id: 'gm',
      label: 'Secrets MJ',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Notes Secrètes (MJ)', type: 'textarea', rows: 4 },
        { name: 'gm_secret_plots', label: 'Intrigues Divines en Cours', type: 'textarea', rows: 3 },
        { name: 'gm_conspiracies', label: 'Conspirations & Sectes', type: 'textarea', rows: 3 },
        { 
          name: 'gm_secret_images', 
          label: 'Archives Interdites', 
          type: 'images', 
          bucket: 'images', 
          render: () => null, 
          categories: [
            { id: 'plots', label: 'Complots' }, 
            { id: 'future', label: 'Prophéties' }, 
            { id: 'hidden', label: 'Lieux Cachés' }, 
            { id: 'secrets', label: 'Secrets' }
          ] 
        }
      ]
    }
  ]
};

export default function DeitiesPage() {
  const [selectedItem, setSelectedItem] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);   
  const [isCreating, setIsCreating] = useState(false);    
  const [refreshKey, setRefreshKey] = useState(0);        

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('deities').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setIsCreating(true); }
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleView = (item) => setSelectedItem(item);

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(null); 
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleSuccess = () => {
    setIsCreating(false);
    setEditingItem(null);
    setRefreshKey(prev => prev + 1); 
  };

  const openDeleteDialog = (item) => {
    setDeleteConfirm({ isOpen: true, item });
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;

    const { error } = await supabase.from('deities').delete().eq('id', item.id);
    
    if (error) {
      console.error("Erreur de suppression :", error);
    } else {
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    }
    setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Bannir du Panthéon"
        message={`Souhaitez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} ? Les astres s'éteindront et ses miracles seront oubliés.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="deities"
        title="Panthéon des Dieux"
        icon={Sparkles} 
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        config={godsConfig}
        customLayout={DeityLayout} // PASSAGE AU LAYOUT PRESTIGE
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => openDeleteDialog(selectedItem)}
      />

      <EnhancedEntityForm
        isOpen={isCreating}
        onClose={() => { setIsCreating(false); setEditingItem(null); }}
        item={editingItem}
        config={godsConfig}
        customForm={DeityForm} // PASSAGE AU FORMULAIRE PRESTIGE
        onSuccess={handleSuccess}
      />
    </>
  );
}