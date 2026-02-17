import { useState } from 'react';
import { Swords, Info, TrendingUp, Book, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

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
      label: 'Caractéristiques',
      icon: TrendingUp,
      fields: [
        {
          name: 'hit_die',
          label: 'Dé de vie',
          type: 'select',
          options: [
            { value: 'd6', label: 'd6' },
            { value: 'd8', label: 'd8' },
            { value: 'd10', label: 'd10' },
            { value: 'd12', label: 'd12' }
          ]
        },
        {
          name: 'primary_ability',
          label: 'Caractéristique principale',
          type: 'text',
          placeholder: 'Force, Dextérité, Intelligence...'
        },
        {
          name: 'saving_throws',
          label: 'Jets de sauvegarde maîtrisés',
          type: 'text',
          placeholder: 'Force et Constitution, Dextérité et Intelligence...'
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
      id: 'gm_notes',
      label: 'Notes MJ',
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
          if (!selectedItem || !confirm('Supprimer ?')) return;
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
