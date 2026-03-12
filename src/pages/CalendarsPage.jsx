import { useState, useEffect } from 'react';
import { Calendar, Info, Sun, Moon, ImageIcon, Shield, Clock, Sparkles, History } from 'lucide-react';
import EntityList from '../components/EntityList';
import EnhancedEntityDetail from '../components/EnhancedEntityDetail';
import EnhancedEntityForm from '../components/EnhancedEntityForm';
import RulesetDynamicFields from '../components/RulesetDynamicFields'; 
import CalendarConfigEditor from '../components/CalendarConfigEditor';
import VTTDialog from '../components/VTTDialog'; 
import CalendarsLayout from '../components/EnhancedEntityDetail/layouts/CalendarsLayout';
import CalendarsForm from '../components/EnhancedEntityForm/layouts/CalendarsForm';
import { DEFAULT_RULESETS } from '../data/ruleset_definitions/index'; 
import { supabase } from '../lib/supabase';

const calendarsConfig = {
  entityName: 'le calendrier',
  tableName: 'calendars',
  title: 'Calendriers',
  getHeaderIcon: () => Calendar,
  getHeaderColor: () => 'from-sky-600/30 via-blue-500/20 to-cyan-500/30',

  tabs: [
    {
      id: 'general',
      label: 'Identité',
      icon: Info,
      fields: [
        { name: 'image_url', label: 'Visuel Iconique', type: 'image' },
        { name: 'name', label: 'Nom du Calendrier', type: 'text', required: true, placeholder: 'Ex: Calendrier d\'Ansalon...' },
        { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds' },
        {
          name: 'ruleset_id', 
          label: 'Système de Règles',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_celestial', 
          label: 'Propriétés Célestes',
          type: 'custom',
          isVirtual: true,
          component: (props) => {
            const data = props.formData || props.item;
            return <RulesetDynamicFields key={data?.ruleset_id} rulesetId={data?.ruleset_id} entityType="celestial" formData={data} setFormData={props.setFormData} readOnly={props.readOnly} />;
          }
        },
        { name: 'description', label: 'Contexte Historique', type: 'textarea', rows: 6 }
      ]
    },
    {
      id: 'structure',
      label: 'Structure & Cycles',
      icon: Clock,
      fields: [
        { name: 'days_per_week', label: 'Jours par Semaine', type: 'number' },
        { name: 'days_per_month', label: 'Jours par Mois (Défaut)', type: 'number' },
        { name: 'seasons', label: 'Description des Saisons', type: 'textarea', rows: 4 },
        { name: 'months', label: 'Configuration des Mois', type: 'custom', component: CalendarConfigEditor }
      ]
    },
    {
      id: 'horoscope',
      label: 'Date & Horoscope',
      icon: Sparkles,
      fields: [
        { name: 'current_day', label: 'Jour Actuel', type: 'number', min: 1 },
        { name: 'current_month', label: 'Mois Actuel', type: 'text', placeholder: 'Sélectionnez le mois en cours' },
        { name: 'current_year', label: 'Année en cours', type: 'number', placeholder: 'Ex: 351' },
        {
          name: 'horoscope_display',
          label: 'Aperçu de la voûte',
          type: 'custom',
          isVirtual: true,
          component: () => <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-[10px] text-silver/40 uppercase font-black tracking-widest text-center">Le rendu dynamique de l'horoscope sera calculé dans la vue détaillée.</div>
        }
      ]
    },
    {
      id: 'history',
      label: 'Chronique',
      icon: History,
      fields: [
        { name: 'world_history_editor', label: 'Chronique Historique', type: 'world_history_editor' }
      ]
    },
    {
      id: 'festivals',
      label: 'Fêtes & Célébrations',
      icon: Sun,
      fields: [{ name: 'festivals', label: 'Calendrier des Événements', type: 'textarea', rows: 12 }]
    },
    {
      id: 'gm',
      label: 'Notes MJ',
      icon: Shield,
      fields: [{ name: 'notes', label: 'Notes privées', type: 'textarea', rows: 8 }]
    }
  ]
};

export default function CalendarsPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1); setShowForm(false); setEditingItem(null); setSelectedItem(null);
  };

  const executeDelete = async () => {
    const item = deleteConfirm.item;
    if (!item) return;
    await supabase.from('calendars').delete().eq('id', item.id);
    setSelectedItem(null); setRefreshKey(prev => prev + 1); setDeleteConfirm({ isOpen: false, item: null });
  };

  return (
    <>
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Effacer le Temps"
        message={`Voulez-vous vraiment supprimer le calendrier ${deleteConfirm.item?.name} ?`}
        onConfirm={executeDelete}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        type="confirm"
      />

      <EntityList
        key={refreshKey}
        tableName="calendars"
        title="Calendriers"
        icon={Calendar} 
        onView={setSelectedItem}
        onEdit={(i) => { setEditingItem(i); setShowForm(true); }}
        onCreate={() => { setEditingItem(null); setShowForm(true); }}
        onDelete={(i) => setDeleteConfirm({ isOpen: true, item: i })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={calendarsConfig}
        customLayout={CalendarsLayout}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
        onSuccess={handleSuccess}
        item={editingItem}
        config={calendarsConfig}
        customForm={CalendarsForm}
      />
    </>
  );
}