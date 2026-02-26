import { useState } from 'react';
import { Languages, Info, BookText, Users, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; // Injecteur de système
import { DEFAULT_RULESETS } from '../data/rulesets'; // Définitions des systèmes

const languagesConfig = {
  entityName: 'le langage',
  tableName: 'languages',
  title: 'Langages',
  getHeaderIcon: () => Languages,
  getHeaderColor: () => 'from-teal-600/30 via-cyan-500/20 to-sky-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'ruleset_id', // SYSTÈME DE RÈGLES (AJOUTÉ)
          label: 'Système de Règles lié',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ 
            value: id, 
            label: cfg.name 
          }))
        },
        {
          name: 'dynamic_geo_fields', // INJECTEUR DYNAMIQUE (Utilise la clé geo pour les éléments de monde)
          label: 'Propriétés Système',
          type: 'custom',
          component: ({ formData, onChange }) => (
            <RulesetDynamicFields 
              rulesetId={formData.ruleset_id} 
              entityType="geo" 
              formData={formData} 
              onChange={onChange} 
            />
          )
        },
        {
          name: 'name',
          label: 'Nom du langage',
          type: 'text',
          required: true,
          placeholder: 'Ex: Commun, Elfique, Draconique...'
        },
        {
          name: 'subtitle',
          label: 'Nom natif',
          type: 'text',
          placeholder: 'Nom du langage dans sa propre langue'
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
          label: 'Image du système d\'écriture',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'Origines, évolution, caractéristiques...'
        }
      ]
    },
    {
      id: 'writing',
      label: 'Écriture & Phonétique',
      icon: BookText,
      fields: [
        {
          name: 'script',
          label: 'Système d\'écriture',
          type: 'text',
          placeholder: 'Alphabet, Idéogrammes, Runes...'
        },
        {
          name: 'phonetics',
          label: 'Phonétique',
          type: 'textarea',
          rows: 3,
          placeholder: 'Sons caractéristiques, prononciation...'
        },
        {
          name: 'grammar',
          label: 'Grammaire',
          type: 'textarea',
          rows: 3,
          placeholder: 'Structure des phrases, règles principales...'
        },
        {
          name: 'vocabulary_examples',
          label: 'Exemples de vocabulaire',
          type: 'textarea',
          rows: 4,
          placeholder: 'Mots et phrases courantes...'
        }
      ]
    },
    {
      id: 'speakers',
      label: 'Locuteurs',
      icon: Users,
      fields: [
        {
          name: 'speakers',
          label: 'Qui parle ce langage',
          type: 'textarea',
          rows: 3,
          placeholder: 'Races, peuples, régions...'
        },
        {
          name: 'rarity',
          label: 'Rareté',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'exotic', label: 'Exotique' },
            { value: 'secret', label: 'Secret' }
          ]
        },
        {
          name: 'dialects',
          label: 'Dialectes',
          type: 'textarea',
          rows: 2,
          placeholder: 'Variantes régionales, dialectes...'
        }
      ]
    },
    {
      id: 'cultural',
      label: 'Aspects culturels',
      icon: Info,
      fields: [
        {
          name: 'cultural_significance',
          label: 'Importance culturelle',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rôle dans la société, traditions...'
        },
        {
          name: 'related_languages',
          label: 'Langages apparentés',
          type: 'textarea',
          rows: 2,
          placeholder: 'Langages similaires, langues mères...'
        },
        {
          name: 'learning_difficulty',
          label: 'Difficulté d\'apprentissage',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' }
          ]
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'language_images',
          label: 'Images du langage',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'script', label: 'Écriture' },
            { id: 'examples', label: 'Exemples' },
            { id: 'historical', label: 'Documents historiques' }
          ]
        }
      ]
    },
    {
      id: 'gm', // RENOMMÉ EN 'gm' POUR LA PROTECTION MJ (CONSERVÉ)
      label: 'Notes MJ (Secret)',
      icon: Shield,
      fields: [
        {
          name: 'secret_uses',
          label: 'Utilisations secrètes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Sorts, rituels, codes secrets...'
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

export default function LanguagesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="languages"
        title="Langages"
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
          if (!selectedItem || !confirm('Supprimer ?')) return;
          const { supabase } = await import('../lib/supabase');
          await supabase.from('languages').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={languagesConfig}
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
        config={languagesConfig}
      />
    </>
  );
}