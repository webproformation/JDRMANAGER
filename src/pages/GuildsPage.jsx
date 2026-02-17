import { useState } from 'react';
import { Users2, Info, Building2, Target, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

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
      label: 'Activités & Objectifs',
      icon: Target,
      fields: [
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
          label: 'Avantages membres',
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
      id: 'gm_notes',
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
          if (!selectedItem || !confirm('Supprimer ?')) return;
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
