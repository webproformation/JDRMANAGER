import React, { useState } from 'react';
import { 
  Sparkles, Scroll, Users, Zap, Shield, Image as ImageIcon, 
  Sun, Moon, Crown
} from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import { supabase } from '../lib/supabase';

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
      label: 'Culte',
      icon: Scroll,
      fields: [
        { name: 'favored_weapon', label: 'Arme', type: 'text' },
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
      id: 'gm_notes',
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
    if (!confirm(`Supprimer définitivement ${item.name} ?`)) return;
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