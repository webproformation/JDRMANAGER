import { useState } from 'react';
import { Flame, Info, Users, Target, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const sectsConfig = {
  entityName: 'la secte',
  tableName: 'sects',
  title: 'Sectes',
  getHeaderIcon: () => Flame,
  getHeaderColor: () => 'from-red-600/30 via-rose-500/20 to-pink-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom de la secte',
          type: 'text',
          required: true,
          placeholder: 'Ex: Culte du Soleil Noir, Cercle de l\'Ombre...'
        },
        {
          name: 'subtitle',
          label: 'Devise ou surnom',
          type: 'text',
          placeholder: 'Ex: Les Illuminés, Les Gardiens...'
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
          label: 'Symbole de la secte',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 5,
          placeholder: 'Histoire, croyances, objectifs...'
        }
      ]
    },
    {
      id: 'beliefs',
      label: 'Croyances & Dogmes',
      icon: Info,
      fields: [
        {
          name: 'beliefs',
          label: 'Croyances',
          type: 'textarea',
          rows: 5,
          placeholder: 'Doctrines, enseignements, prophéties...'
        },
        {
          name: 'rituals',
          label: 'Rituels',
          type: 'textarea',
          rows: 4,
          placeholder: 'Cérémonies, sacrifices, pratiques...'
        },
        {
          name: 'deity_relation',
          label: 'Divinité vénérée',
          type: 'relation',
          table: 'deities',
          placeholder: 'Sélectionner une divinité (optionnel)'
        }
      ]
    },
    {
      id: 'structure',
      label: 'Organisation',
      icon: Users,
      fields: [
        {
          name: 'hierarchy',
          label: 'Hiérarchie',
          type: 'textarea',
          rows: 4,
          placeholder: 'Grande prêtresse, initiés, fidèles...'
        },
        {
          name: 'membership',
          label: 'Adhésion',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment rejoindre, épreuves, rituels d\'initiation...'
        },
        {
          name: 'members_count',
          label: 'Nombre de membres',
          type: 'text',
          placeholder: 'Ex: 50, plusieurs centaines...'
        }
      ]
    },
    {
      id: 'activities',
      label: 'Activités & Objectifs',
      icon: Target,
      fields: [
        {
          name: 'goals',
          label: 'Objectifs',
          type: 'textarea',
          rows: 4,
          placeholder: 'Buts ultimes, plans à court et long terme...'
        },
        {
          name: 'activities',
          label: 'Activités',
          type: 'textarea',
          rows: 3,
          placeholder: 'Recrutement, rituels, complots...'
        },
        {
          name: 'reputation',
          label: 'Réputation',
          type: 'select',
          options: [
            { value: 'unknown', label: 'Inconnue' },
            { value: 'suspicious', label: 'Suspecte' },
            { value: 'feared', label: 'Crainte' },
            { value: 'hunted', label: 'Pourchassée' }
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
          name: 'sect_images',
          label: 'Images de la secte',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'symbols', label: 'Symboles' },
            { id: 'rituals', label: 'Rituels' },
            { id: 'members', label: 'Membres' }
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
          label: 'Secrets véritables',
          type: 'textarea',
          rows: 4,
          placeholder: 'Vrais objectifs, manipulations, complots...'
        },
        {
          name: 'hooks',
          label: 'Accroches de quête',
          type: 'textarea',
          rows: 3,
          placeholder: 'Comment les joueurs peuvent s\'impliquer...'
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

export default function SectsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="sects"
        title="Sectes"
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
          await supabase.from('sects').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={sectsConfig}
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
        config={sectsConfig}
      />
    </>
  );
}
