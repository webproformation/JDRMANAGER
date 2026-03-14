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

// Import des Layouts/Forms Prestige
import DeityLayout from '../components/EnhancedEntityDetail/layouts/DeityLayout';
import DeityForm from '../components/EnhancedEntityForm/layouts/DeityForm';

import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index';
import { supabase } from '../lib/supabase';

/**
 * COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (DIVINITÉS)
 */
const DeityMechanicsEditor = ({ value = {}, onChange }) => {
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
    <div className="bg-black/20 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2DD4BF]/60 mb-8 italic">
        Configuration des bénédictions VTT (Sorts de domaine, immunités, bonus divins)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Sorts Accordés (Domaine)</label>
          <input 
            type="text" value={data.granted_spells || ''} onChange={(e) => updateField('granted_spells', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: Mot de guérison, Colonne de flammes..."
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-3 ml-1">Bénédictions / Immunités</label>
          <input 
            type="text" value={data.divine_boons || ''} onChange={(e) => updateField('divine_boons', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#2DD4BF]/50 outline-none placeholder-white/10 font-bold"
            placeholder="Ex: Immunité au feu, +1 CA divine..."
          />
        </div>
      </div>

      <label className="text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] block mb-4 border-t border-white/5 pt-6 ml-1">
        Bonus de Caractéristiques (Élus & Champions)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

// --- CONFIGURATION PRESTIGE 3.0 ---
const godsConfig = {
  entityName: 'la divinité',
  tableName: 'deities',
  title: 'Panthéon des Dieux',
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
        { name: 'image_url', label: 'Illustration Avatar', type: 'image' },
        { name: 'description', label: 'Description & Lore', type: 'textarea', rows: 4 },
        { name: 'appearance', label: 'Manifestation Physique', type: 'textarea', rows: 3 },
        { name: 'symbol', label: 'Symbole Sacré', type: 'text', placeholder: 'Un bras squelettique tenant une balance' },
        { name: 'sacred_symbol_description', label: 'Signification du Symbole', type: 'textarea', rows: 2 },
        {
          name: 'dynamic_deity_fields',
          label: 'Propriétés Système',
          type: 'custom',
          isVirtual: true,
          component: (props) => (
            <RulesetDynamicFields 
              rulesetId={props.formData.ruleset_id || 'dnd5'} 
              entityType="deity" 
              formData={props.formData} 
              onChange={props.onChange} 
            />
          )
        }
      ]
    },
    {
      id: 'worship',
      label: 'Culte & Dogme',
      icon: Scroll,
      fields: [
        { name: 'data', label: 'Moteur de Règles VTT', type: 'custom', isVirtual: true, component: DeityMechanicsEditor },
        { name: 'favored_weapon', label: 'Arme de prédilection', type: 'text' },
        { name: 'holy_days', label: 'Jours Sacrés & Calendrier', type: 'text' },
        { name: 'clergy_alignments', label: 'Alignement du Clergé', type: 'text' },
        { 
          name: 'rituals', 
          label: 'Rituels & Sacrifices', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Sacrifices d\'encens', 'Prières à l\'aube', 'Jeûne rituel', 'Pèlerinage', 'Libations', 'Processions nocturnes']} /> 
        },
        { 
          name: 'worshippers', 
          label: 'Ordres Religieux', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Ordre des Veilleurs', 'Inquisition de Fer', 'Cercle des Déshérités', 'Fraternité du Sang', 'Secte de l\'Ombre']} /> 
        },
        { 
          name: 'typical_worshippers', 
          label: 'Profil des Fidèles', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Paysans', 'Guerriers vétérans', 'Mages érudits', 'Juges', 'Marins', 'Bourreaux']} /> 
        }
      ]
    },
    {
      id: 'history_tab',
      label: 'Chroniques',
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
          label: 'Reliques Divines', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Lame dévorante', 'Sceptre de lumière', 'Couronne d\'épines', 'Orbe des tempêtes', 'Livre des Lois']} /> 
        },
        { 
          name: 'granted_powers', 
          label: 'Pouvoirs de Domaine', 
          type: 'custom', 
          component: (props) => <MultiSelectWithOther {...props} options={['Clairvoyance', 'Résistance au feu', 'Vol spirituel', 'Commande des morts', 'Guérison']} /> 
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
          label: 'Iconographie', 
          type: 'images', 
          bucket: 'images', 
          categories: [
            { id: 'god', label: 'Avatar' }, 
            { id: 'symbols', label: 'Symboles' }, 
            { id: 'temples', label: 'Temples' }
          ] 
        }
      ]
    },
    {
      id: 'gm',
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Notes MJ Confidentielles', type: 'textarea', rows: 4 },
        { name: 'gm_secret_plots', label: 'Intrigues en Cours', type: 'textarea', rows: 3 },
        { 
          name: 'gm_secret_images', 
          label: 'Archives Interdites', 
          type: 'images', 
          bucket: 'images', 
          categories: [
            { id: 'plots', label: 'Complots' }, 
            { id: 'future', label: 'Prophéties' }
          ] 
        }
      ]
    }
  ]
};

export default function DeitiesPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);   
  const [isCreating, setIsCreating] = useState(false);    
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
        const { data, error } = await supabase.from('deities').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setIsCreating(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleSuccess = () => {
    setIsCreating(false);
    setEditingItem(null);
    setSelectedItem(null);
    setRefreshKey(prev => prev + 1);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setIsCreating(false);
    setEditingItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection automatique du focus
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null
    });
    setIsCreating(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('deities').delete().eq('id', deleteConfirm.item.id);
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
        title="Dissoudre la Divinité"
        message={`Voulez-vous vraiment effacer définitivement ${deleteConfirm.item?.name} du Panthéon ? Ses miracles et son culte seront oubliés.`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="deities"
        title="Panthéon Divine"
        icon={Sparkles}
        onView={setSelectedItem}
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setIsCreating(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        item={selectedItem}
        config={godsConfig}
        customLayout={DeityLayout} 
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setIsCreating(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
      />

      <EnhancedEntityForm
        isOpen={isCreating}
        onClose={handleClose}
        item={editingItem}
        config={godsConfig}
        customForm={DeityForm} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}