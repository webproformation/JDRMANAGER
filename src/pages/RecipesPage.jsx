import { useState } from 'react';
import { BookOpen, Info, Utensils, Clock, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const recipesConfig = {
  entityName: 'la recette',
  tableName: 'recipes',
  title: 'Recettes',
  getHeaderIcon: () => BookOpen,
  getHeaderColor: () => 'from-orange-600/30 via-amber-500/20 to-yellow-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la recette',
          type: 'text',
          required: true,
          placeholder: 'Ex: Potion de guérison supérieure, Épée enchantée...'
        },
        {
          name: 'subtitle',
          label: 'Catégorie',
          type: 'text',
          placeholder: 'Alchimie, Forge, Enchantement...'
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
          label: 'Image principale',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'Description de la recette et du résultat...'
        }
      ]
    },
    {
      id: 'ingredients',
      label: 'Ingrédients & Matériaux',
      icon: Utensils,
      fields: [
        {
          name: 'ingredients',
          label: 'Ingrédients',
          type: 'textarea',
          rows: 6,
          placeholder: 'Liste détaillée des ingrédients avec quantités...'
        },
        {
          name: 'tools',
          label: 'Outils nécessaires',
          type: 'textarea',
          rows: 3,
          placeholder: 'Alambic, enclume, baguette magique...'
        },
        {
          name: 'rarity',
          label: 'Rareté des ingrédients',
          type: 'select',
          options: [
            { value: 'common', label: 'Commun' },
            { value: 'uncommon', label: 'Peu commun' },
            { value: 'rare', label: 'Rare' },
            { value: 'very_rare', label: 'Très rare' }
          ]
        }
      ]
    },
    {
      id: 'process',
      label: 'Processus de fabrication',
      icon: Clock,
      fields: [
        {
          name: 'instructions',
          label: 'Instructions',
          type: 'textarea',
          rows: 8,
          placeholder: 'Étapes détaillées de la fabrication...'
        },
        {
          name: 'difficulty',
          label: 'Difficulté',
          type: 'select',
          options: [
            { value: 'easy', label: 'Facile' },
            { value: 'medium', label: 'Moyen' },
            { value: 'hard', label: 'Difficile' },
            { value: 'very_hard', label: 'Très difficile' },
            { value: 'master', label: 'Maître artisan' }
          ]
        },
        {
          name: 'duration',
          label: 'Durée',
          type: 'text',
          placeholder: '2 heures, 1 jour, 1 semaine...'
        },
        {
          name: 'skill_required',
          label: 'Compétence requise',
          type: 'text',
          placeholder: 'Alchimie niveau 5, Forge niveau 10...'
        }
      ]
    },
    {
      id: 'result',
      label: 'Résultat',
      icon: Info,
      fields: [
        {
          name: 'result',
          label: 'Produit final',
          type: 'textarea',
          rows: 4,
          placeholder: 'Description du résultat obtenu...'
        },
        {
          name: 'yield',
          label: 'Rendement',
          type: 'text',
          placeholder: 'Ex: 1 potion, 3 doses, 1 arme...'
        },
        {
          name: 'value',
          label: 'Valeur du produit',
          type: 'text',
          placeholder: 'Ex: 100 po, 500 po...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'recipe_images',
          label: 'Images de la recette',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'ingredients', label: 'Ingrédients' },
            { id: 'process', label: 'Processus' },
            { id: 'result', label: 'Résultat' }
          ]
        }
      ]
    },
    {
      id: 'gm_notes',
      label: 'Notes MJ',
      icon: Shield,
      fields: [
        {
          name: 'secrets',
          label: 'Variantes secrètes',
          type: 'textarea',
          rows: 3,
          placeholder: 'Ingrédients alternatifs, améliorations...'
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

export default function RecipesPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="recipes"
        title="Recettes"
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
          await supabase.from('recipes').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={recipesConfig}
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
        config={recipesConfig}
      />
    </>
  );
}
