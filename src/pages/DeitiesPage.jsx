import React, { useState } from 'react';
import { 
  Sparkles, Scroll, Users, Zap, Shield, Image as ImageIcon, 
  Sun, Moon, Crown, Plus, Minus
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import { supabase } from '../lib/supabase';

// --- COMPOSANT SPÉCIALISÉ : MÉCANIQUES VTT (DIVINITÉS) ---
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
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner mb-6">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les bénédictions mécaniques (VTT) accordées par cette divinité à ses plus fidèles adorateurs (ex: sorts de domaine, immunités, bonus divins).
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

// --- CONFIGURATION : LA "PARTITION" DES DIEUX ---
// C'est ici qu'on définit à quoi ressemble un Dieu dans le nouveau système
const godsConfig = {
  entityName: 'la divinité',
  tableName: 'deities',
  title: 'Panthéon',
  
  // Icône dynamique selon le rang divin
  getHeaderIcon: (item) => {
    if (!item) return Sparkles;
    switch (item.divine_rank) {
      case 'overdeity': return Sun;
      case 'greater': return Crown;
      case 'demigod': return Users;
      case 'quasi': return Moon;
      default: return Sparkles;
    }
  },
  
  // Ambiance Vert d'eau / Mystique
  getHeaderColor: () => 'from-teal-900/60 via-cyan-900/40 to-emerald-900/20',

  tabs: [
    {
      id: 'general',
      label: 'Général',
      icon: Crown,
      fields: [
        { name: 'name', label: 'Nom', type: 'text', required: true, placeholder: 'Ex: Bahamut...' },
        { name: 'title', label: 'Titre / Épithète', type: 'text' },
        { name: 'pantheon', label: 'Panthéon', type: 'text' },
        { 
          name: 'alignment', 
          label: 'Alignement', 
          type: 'select', 
          options: [
            { value: 'lawful_good', label: 'Loyal Bon' },
            { value: 'neutral_good', label: 'Neutre Bon' },
            { value: 'chaotic_good', label: 'Chaotique Bon' },
            { value: 'lawful_neutral', label: 'Loyal Neutre' },
            { value: 'true_neutral', label: 'Neutre Absolu' },
            { value: 'chaotic_neutral', label: 'Chaotique Neutre' },
            { value: 'lawful_evil', label: 'Loyal Mauvais' },
            { value: 'neutral_evil', label: 'Neutre Mauvais' },
            { value: 'chaotic_evil', label: 'Chaotique Mauvais' }
          ]
        },
        { 
          name: 'divine_rank', 
          label: 'Rang Divin', 
          type: 'select', 
          options: [
            { value: 'overdeity', label: 'Surdivinité' },
            { value: 'greater', label: 'Dieu Majeur' },
            { value: 'intermediate', label: 'Dieu Intermédiaire' },
            { value: 'lesser', label: 'Dieu Mineur' },
            { value: 'demigod', label: 'Demi-Dieu' },
            { value: 'quasi', label: 'Quasi-Divinité' }
          ]
        },
        { name: 'image_url', label: 'Avatar', type: 'image', bucket: 'images' },
        { name: 'domains', label: 'Domaines', type: 'text', placeholder: 'Vie, Lumière...' },
        { name: 'portfolio', label: 'Portefeuille', type: 'textarea', rows: 2 },
        { name: 'description', label: 'Description', type: 'textarea', rows: 6 },
        { name: 'appearance', label: 'Apparence', type: 'textarea', rows: 3 },
        { name: 'symbol', label: 'Symbole Sacré', type: 'text' },
        { name: 'sacred_symbol_description', label: 'Desc. Symbole', type: 'textarea', rows: 2 },
        { name: 'world_id', label: 'Monde lié', type: 'relation', table: 'worlds' }
      ]
    },
    {
      id: 'worship',
      label: 'Culte & Pouvoirs',
      icon: Scroll,
      fields: [
        {
          name: 'data', // COLONNE VTT
          label: 'Moteur de Règles VTT',
          type: 'custom',
          component: DeityMechanicsEditor
        },
        { name: 'favored_weapon', label: 'Arme de prédilection', type: 'text' },
        { name: 'worshippers', label: 'Adorateurs', type: 'textarea', rows: 3 },
        { name: 'temples', label: 'Temples', type: 'textarea', rows: 4 },
        { name: 'rituals', label: 'Rituels', type: 'textarea', rows: 4 }
      ]
    },
    {
      id: 'relations',
      label: 'Relations',
      icon: Users,
      fields: [
        { name: 'allies', label: 'Alliés', type: 'textarea', rows: 3 },
        { name: 'enemies', label: 'Ennemis', type: 'textarea', rows: 3 }
      ]
    },
    {
      id: 'gallery',
      label: 'Galerie',
      icon: ImageIcon,
      fields: [
        {
          name: 'deity_images',
          label: 'Images',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'god', label: 'Avatar' },
            { id: 'temples', label: 'Temples' },
            { id: 'symbols', label: 'Symboles' }
          ]
        }
      ]
    },
    {
      id: 'gm', // SÉCURITÉ MJ
      label: 'MJ',
      icon: Shield,
      fields: [
        { name: 'gm_notes', label: 'Notes Secrètes', type: 'textarea', rows: 6 },
        { name: 'gm_secret_plots', label: 'Intrigues', type: 'textarea', rows: 4 }
      ]
    }
  ]
};

export default function DeitiesPage() {
  const [selectedItem, setSelectedItem] = useState(null); // Mode Lecture
  const [editingItem, setEditingItem] = useState(null);   // Mode Édition
  const [isCreating, setIsCreating] = useState(false);    // Mode Création
  const [refreshKey, setRefreshKey] = useState(0);        // Refresh liste

  // --- GESTIONNAIRES D'ACTIONS ---

  const handleView = (item) => setSelectedItem(item);

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(null); // On ferme la lecture si ouverte
    setEditingItem(item);
    setIsCreating(true);
  };

  const handleSuccess = () => {
    setIsCreating(false);
    setEditingItem(null);
    setRefreshKey(prev => prev + 1); // Recharge la liste
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer définitivement ${item.name} ?`)) return;
    const { error } = await supabase.from('deities').delete().eq('id', item.id);
    if (error) console.error(error);
    else {
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="deities"
        title="Dieux & Panthéons"
        icon={Sparkles} // Icône optionnelle pour le titre
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />

      {/* MODALE DE LECTURE (Nouveau Design) */}
      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        config={godsConfig}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => handleDelete(selectedItem)}
      />

      {/* MODALE DE FORMULAIRE (Nouveau Design) */}
      <EnhancedEntityForm
        isOpen={isCreating}
        onClose={() => { setIsCreating(false); setEditingItem(null); }}
        item={editingItem}
        config={godsConfig}
        onSuccess={handleSuccess}
      />
    </>
  );
}