import { useState } from 'react';
import { Calendar, Info, Sun, Moon, ImageIcon, Shield } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';

const calendarsConfig = {
  entityName: 'le calendrier',
  tableName: 'calendars',
  title: 'Calendriers',
  getHeaderIcon: () => Calendar,
  getHeaderColor: () => 'from-sky-600/30 via-blue-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Informations générales',
      icon: Info,
      fields: [
        {
          name: 'name',
          label: 'Nom du calendrier',
          type: 'text',
          required: true,
          placeholder: 'Ex: Calendrier grégorien, Calendrier lunaire elfique...'
        },
        {
          name: 'subtitle',
          label: 'Origine',
          type: 'text',
          placeholder: 'Culture, civilisation qui l\'utilise...'
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
          label: 'Image du calendrier',
          type: 'image'
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 4,
          placeholder: 'Histoire, système, utilisation...'
        }
      ]
    },
    {
      id: 'structure',
      label: 'Structure temporelle',
      icon: Sun,
      fields: [
        {
          name: 'days_per_week',
          label: 'Jours par semaine',
          type: 'number',
          placeholder: '7'
        },
        {
          name: 'weeks_per_month',
          label: 'Semaines par mois',
          type: 'number',
          placeholder: '4'
        },
        {
          name: 'months_per_year',
          label: 'Mois par année',
          type: 'number',
          placeholder: '12'
        },
        {
          name: 'days_per_year',
          label: 'Jours par année',
          type: 'number',
          placeholder: '365'
        }
      ]
    },
    {
      id: 'naming',
      label: 'Noms & Périodes',
      icon: Calendar,
      fields: [
        {
          name: 'day_names',
          label: 'Noms des jours',
          type: 'textarea',
          rows: 3,
          placeholder: 'Liste des noms des jours de la semaine...'
        },
        {
          name: 'month_names',
          label: 'Noms des mois',
          type: 'textarea',
          rows: 4,
          placeholder: 'Liste des noms des mois de l\'année...'
        },
        {
          name: 'seasons',
          label: 'Saisons',
          type: 'textarea',
          rows: 3,
          placeholder: 'Noms et durées des saisons...'
        }
      ]
    },
    {
      id: 'events',
      label: 'Événements & Fêtes',
      icon: Moon,
      fields: [
        {
          name: 'holidays',
          label: 'Jours fériés',
          type: 'textarea',
          rows: 4,
          placeholder: 'Fêtes religieuses, célébrations, événements spéciaux...'
        },
        {
          name: 'astronomical_events',
          label: 'Événements astronomiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Éclipses, alignements planétaires, conjonctions...'
        },
        {
          name: 'cultural_significance',
          label: 'Importance culturelle',
          type: 'textarea',
          rows: 3,
          placeholder: 'Rôle du calendrier dans la société...'
        }
      ]
    },
    {
      id: 'gallery',
      label: "Galerie d'images",
      icon: ImageIcon,
      fields: [
        {
          name: 'calendar_images',
          label: 'Images du calendrier',
          type: 'images',
          bucket: 'images',
          categories: [
            { id: 'layout', label: 'Disposition' },
            { id: 'symbols', label: 'Symboles' },
            { id: 'celebrations', label: 'Célébrations' }
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
          name: 'historical_events',
          label: 'Événements historiques',
          type: 'textarea',
          rows: 3,
          placeholder: 'Dates importantes dans l\'histoire du monde...'
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

export default function CalendarsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <EntityList
        key={refreshKey}
        tableName="calendars"
        title="Calendriers"
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
          await supabase.from('calendars').delete().eq('id', selectedItem.id);
          setSelectedItem(null);
          setRefreshKey(prev => prev + 1);
        }}
        item={selectedItem}
        config={calendarsConfig}
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
        config={calendarsConfig}
      />
    </>
  );
}
