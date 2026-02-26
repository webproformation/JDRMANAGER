// src/pages/ClassesPage.jsx
import React, { useState } from 'react';
import { Swords, Info, TrendingUp, Book, ImageIcon, Shield, Plus, X } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

// --- COMPOSANT SPÉCIALISÉ : ÉDITEUR DE MÉCANIQUES DE CLASSE ---
// Enregistre les données techniques (Dé de vie, Saves) dans la colonne JSONB "data"
const ClassMechanicsEditor = ({ value = {}, onChange }) => {
  const data = value || {};
  const hitDie = data.hit_die || 'd8';
  const saves = data.saves || [];

  const availableSaves = [
    { id: 'str', label: 'Force' },
    { id: 'dex', label: 'Dextérité' },
    { id: 'con', label: 'Constitution' },
    { id: 'int', label: 'Intelligence' },
    { id: 'wis', label: 'Sagesse' },
    { id: 'cha', label: 'Charisme' }
  ];

  const handleHitDieChange = (e) => {
    onChange({ ...data, hit_die: e.target.value });
  };

  const toggleSave = (saveId) => {
    const newSaves = saves.includes(saveId)
      ? saves.filter(s => s !== saveId)
      : [...saves, saveId];
    onChange({ ...data, saves: newSaves });
  };

  return (
    <div className="bg-[#151725] rounded-[2rem] p-8 border border-white/5 shadow-inner">
      <p className="text-xs text-silver/50 mb-8 italic">
        Configurez les données techniques pour le Moteur de Règles. Ces informations permettront d'automatiser les jets de sauvegarde et le calcul des points de vie.
      </p>
      
      <div className="space-y-8">
        {/* DÉ DE VIE (TECHNIQUE) */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Dé de Vie Technique</label>
          <div className="flex gap-3">
            {['d6', 'd8', 'd10', 'd12'].map(die => (
              <button
                key={die}
                type="button"
                onClick={() => onChange({ ...data, hit_die: die })}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all ${
                  hitDie === die 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20 scale-105' 
                    : 'bg-black/40 text-silver/50 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {die}
              </button>
            ))}
          </div>
        </div>

        {/* JETS DE SAUVEGARDE MAITRISÉS */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-3">Sauvegardes Maîtrisées</label>
          <div className="flex flex-wrap gap-3">
            {availableSaves.map(save => {
              const isSelected = saves.includes(save.id);
              return (
                <button
                  key={save.id}
                  type="button"
                  onClick={() => toggleSave(save.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                    isSelected 
                      ? 'bg-teal-500/10 border-teal-500/30 text-teal-300' 
                      : 'bg-black/40 border-white/5 text-silver/40 hover:bg-white/5 hover:text-silver'
                  }`}
                >
                  {isSelected ? <Shield size={14} className="text-teal-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-silver/30" />}
                  {save.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CONFIGURATION DE LA PAGE ---
const classesConfig = {
  entityName: 'la classe',
  tableName: 'character_classes',
  title: 'Classes de Personnage',
  getHeaderIcon: () => Swords,
  getHeaderColor: () => 'from-amber-600/30 via-orange-500/20 to-red-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la classe',
          type: 'text',
          required: true,
          placeholder: 'Ex: Guerrier, Mage, Rôdeur...'
        },
        {
          name: 'subtitle',
          label: 'Rôle',
          type: 'text',
          placeholder: 'Tank, DPS, Soutien, Contrôle...'
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
          label: 'Image de la classe',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Philosophie, style de jeu, place dans le monde...'
        }
      ]
    },
    {
      id: 'stats',
      label: 'Caractéristiques & Mécaniques',
      icon: TrendingUp,
      fields: [
        {
          name: 'data', // Utilise la colonne JSONB pour structurer le VTT
          label: 'Moteur de Règles (Mécaniques)',
          type: 'custom',
          component: ClassMechanicsEditor
        },
        {
          name: 'primary_ability',
          label: 'Caractéristique principale (Lore)',
          type: 'text',
          placeholder: 'Ex: Force, Dextérité, Intelligence...'
        },
        {
          name: 'saving_throws',
          label: 'Jets de sauvegarde (Lore)',
          type: 'text',
          placeholder: 'Ex: Force et Constitution, Dextérité et Intelligence...'
        },
        {
          name: 'armor_proficiency',
          label: 'Maîtrise des armures',
          type: 'textarea',
          rows: 2,
          placeholder: 'Armures légères, armures intermédiaires...'
        },
        {
          name: 'weapon_proficiency',
          label: 'Maîtrise des armes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Armes simples, armes de guerre...'
        }
      ]
    },
    {
      id: 'abilities',
      label: 'Capacités & Progression',
      icon: Book,
      fields: [
        {
          name: 'starting_equipment',
          label: 'Équipement de départ',
          type: 'textarea',
          rows: 4,
          placeholder: 'Liste de l\'équipement de base...'
        },
        {
          name: 'progression',
          label: 'Progression',
          type: 'textarea',
          rows: 6,
          placeholder: 'Capacités acquises par niveau...'
        },
        {
          name: 'subclasses',
          label: 'Sous-classes',
          type: 'textarea',
          rows: 4,
          placeholder: 'Archétypes, voies, spécialisations disponibles...'
        }
      ]
    },
    {
      id: 'roleplay',
      label: 'Roleplay',
      icon: Info,
      fields: [
        {
          name: 'typical_backgrounds',
          label: 'Historiques typiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Origines courantes pour cette classe...'
        },
        {
          name: 'roleplay_tips',
          label: 'Conseils de roleplay',
          type: 'textarea',
          rows: 4,
          placeholder: 'Comment incarner cette classe...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'class_images',
          label: 'Images de la classe',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'portraits', label: 'Portraits' },
            { id: 'action', label: 'En action' },
            { id: 'equipment', label: 'Équipement' }
          ]
        }
      ]
    },
    {
      id: 'gm', // Renommé de gm_notes à gm pour activer la protection secrète du MJ
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'balance_notes',
          label: 'Notes d\'équilibrage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Forces, faiblesses, ajustements...'
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

export default function ClassesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="character_classes"
        title="Classes de Personnage"
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
          if (!selectedItem || !window.confirm('Supprimer cette classe ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('character_classes').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={classesConfig}
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
        config={classesConfig}
      />
    </>
  );
}