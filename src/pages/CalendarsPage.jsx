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

/**
 * Configuration PRESTIGE - Gestion du Temps et des Éphémérides
 */
const calendarsConfig = {
  entityName: 'le calendrier',
  tableName: 'calendars',
  title: 'Calendriers & Ères',
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
          label: 'Système de Règles local',
          type: 'select',
          options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name }))
        },
        {
          name: 'dynamic_celestial', 
          label: 'Propriétés Célestes',
          type: 'custom',
          isVirtual: true,
          component: (props) => (
            <RulesetDynamicFields 
              rulesetId={props.formData.ruleset_id || 'dnd5'} 
              entityType="celestial" 
              formData={props.formData} 
              onChange={props.onChange} 
              readOnly={props.readOnly}
            />
          )
        },
        { name: 'description', label: 'Contexte Historique', type: 'textarea', rows: 6 }
      ]
    },
    {
      id: 'structure',
      label: 'Cycles',
      icon: Clock,
      fields: [
        { name: 'days_per_week', label: 'Jours / Semaine', type: 'number' },
        { name: 'days_per_month', label: 'Jours / Mois', type: 'number' },
        { name: 'seasons', label: 'Description des Saisons', type: 'textarea', rows: 4 },
        { name: 'months', label: 'Configuration des Mois', type: 'custom', component: CalendarConfigEditor }
      ]
    },
    {
      id: 'horoscope',
      label: 'Éphémérides',
      icon: Sparkles,
      fields: [
        { name: 'current_day', label: 'Jour Actuel', type: 'number', min: 1 },
        { name: 'current_month', label: 'Mois Actuel', type: 'text', placeholder: 'Mois en cours' },
        { name: 'current_year', label: 'Année en cours', type: 'number', placeholder: 'Ex: 351' },
        {
          name: 'horoscope_display',
          label: 'Aperçu Cosmique',
          type: 'custom',
          isVirtual: true,
          component: () => (
            <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 text-[10px] text-silver/40 uppercase font-black tracking-[0.2em] text-center italic">
              Le rendu dynamique de la voûte céleste est synchronisé avec les éphémérides en vue détaillée.
            </div>
          )
        }
      ]
    },
    {
      id: 'history',
      label: 'Chronique',
      icon: History,
      fields: [
        { name: 'world_history_editor', label: 'Mémoire du Temps', type: 'world_history_editor', isVirtual: true }
      ]
    },
    {
      id: 'festivals',
      label: 'Célébrations',
      icon: Sun,
      fields: [{ name: 'festivals', label: 'Calendrier des Événements Sacrés', type: 'textarea', rows: 12 }]
    },
    {
      id: 'gm',
      label: 'Notes MJ',
      icon: Shield,
      fields: [{ name: 'notes', label: 'Notes MJ Confidentielles', type: 'textarea', rows: 8 }]
    }
  ]
};

export default function CalendarsPage({ activeRuleset, activeWorldId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, item: null });

  // --- PROTOCOLE DE ROUTAGE VERCEL ---
  const cleanURL = () => {
    const url = new URL(window.location);
    url.searchParams.delete('view'); 
    url.searchParams.delete('edit');
    window.history.replaceState({}, document.title, url.pathname);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    const editId = params.get('edit');

    if (viewId || editId) {
      const id = viewId || editId;
      const fetchInitialItem = async () => {
        const { data, error } = await supabase.from('calendars').select('*').eq('id', id).single();
        if (data && !error) {
          if (viewId) setSelectedItem(data);
          else { setEditingItem(data); setShowForm(true); }
          cleanURL();
        }
      };
      fetchInitialItem();
    }
  }, []);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingItem(null);
    setSelectedItem(null);
    cleanURL();
  };

  const handleClose = () => {
    setSelectedItem(null);
    setShowForm(false);
    setEditingItem(null);
    cleanURL();
  };

  const handleCreate = () => {
    // MÉMOIRE PRESTIGE V4.3 : Injection focus
    setEditingItem({ 
      ruleset_id: activeRuleset || 'dnd5',
      world_id: activeWorldId !== 'all' ? activeWorldId : null,
      days_per_week: 7,
      days_per_month: 30
    });
    setShowForm(true);
  };

  const executeDelete = async () => {
    if (!deleteConfirm.item) return;
    try {
      const { error } = await supabase.from('calendars').delete().eq('id', deleteConfirm.item.id);
      if (error) throw error;
      setSelectedItem(null);
      setRefreshKey(prev => prev + 1);
      cleanURL();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full">
      {/* DIALOGUE DE SUPPRESSION PRESTIGE */}
      <VTTDialog 
        isOpen={deleteConfirm.isOpen}
        title="Effacer le Temps"
        message={`Voulez-vous vraiment supprimer définitivement le calendrier ${deleteConfirm.item?.name} ? Les ères passées seront oubliées.`}
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
        onEdit={(item) => { setEditingItem(item); setSelectedItem(null); setShowForm(true); }}
        onCreate={handleCreate}
        onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
      />

      <EnhancedEntityDetail
        isOpen={!!selectedItem}
        onClose={handleClose}
        onEdit={() => { setEditingItem(selectedItem); setSelectedItem(null); setShowForm(true); }}
        onDelete={() => setDeleteConfirm({ isOpen: true, item: selectedItem })}
        item={selectedItem}
        config={calendarsConfig}
        customLayout={CalendarsLayout}
      />

      <EnhancedEntityForm
        isOpen={showForm}
        onClose={handleClose}
        onSuccess={handleSuccess}
        item={editingItem}
        config={calendarsConfig}
        customForm={CalendarsForm}
      />
    </div>
  );
}