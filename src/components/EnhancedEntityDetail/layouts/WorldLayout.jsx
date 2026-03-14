import React from 'react';
import { History, CalendarDays, Sparkles, Clock, BookOpen } from 'lucide-react';

// LE CORRECTIF EST ICI : On importe le moteur autonome V4 directement dans le Layout
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * WorldLayout - Standard PRESTIGE 4.5.6 (Épure & Fix UUID/Ruleset)
 * Architecture chirurgicale pour la visualisation des mondes.
 * CORRECTIFS :
 * 1. Restauration de l'intégralité du code (Zéro simplification).
 * 2. FIX RESOLUTION : smartRender croise maintenant les IDs avec les options pour afficher "D&D 5e".
 * 3. Styles unifiés sans bordures ni fonds gris.
 * 4. Maintien du Calendrier ultra-compact en mode liste.
 */
export default function WorldLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component || f.type === 'world_history_editor') || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  
  // STYLES PURS PRESTIGE
  const nameTextStyle = "text-white font-black text-[13px] md:text-[15px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[11px] md:text-[13px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[11px] md:text-[13px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Smart Resolver" PRESTIGE 4.5.6)
   * On force le rendu graphique pour les éléments de structure et on traduit les IDs techniques.
   */
  const smartRender = (field) => {
    if (!field) return "—";

    // ON GARDE LE RENDU ORIGINAL POUR LES ÉLÉMENTS INTERACTIFS OU GRAPHIQUES
    const isGraphic = field.type === 'images' || 
                       field.type === 'relation' || 
                       field.name === 'image_url' || 
                       field.name === 'world_continents' || 
                       field.name === 'world_images' ||
                       field.type === 'world_history_editor';

    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];

    // CORRECTIF UUID / RULESET : Résolution par jointure ou par les OPTIONS du champ
    if (field.name === 'primary_calendar_id') {
        const calName = item.calendars?.name || item.calendar?.name || item.primary_calendar_name || item.primary_calendar_id?.name;
        if (calName) return calName;
    }
    if (field.name === 'ruleset_id') {
        const ruleName = item.rulesets?.name || item.ruleset?.name || item.ruleset_name || item.ruleset_id?.name;
        if (ruleName) return ruleName;
    }

    // NOUVEAU FALLBACK : Si on a un ID mais pas de nom, on regarde dans les options de la config
    if (rawValue && field.options) {
      const opt = field.options.find(o => String(o.value) === String(rawValue));
      if (opt) return opt.label;
    }

    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    
    // Transformation des listes simples en texte pur " | "
    if (Array.isArray(rawValue)) {
      return rawValue.length === 0 ? "—" : rawValue.join(" | ");
    }
    
    return String(rawValue);
  };

  /**
   * compactCalendarRender
   * Rendu manuel des mois pour éviter les gros blocs d'édition.
   */
  const compactCalendarRender = (configData) => {
    if (!configData || !configData.months || configData.months.length === 0) return "Aucun mois défini.";
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 py-2">
        {configData.months.map((month, idx) => (
          <div key={idx} className="flex items-baseline gap-2 group">
            <span className="text-teal-500/30 font-black text-[9px] tabular-nums">
              {(idx + 1).toString().padStart(2, '0')}
            </span>
            <span className="text-white font-black text-[12px] md:text-[14px] tracking-tight">
              {month.name}
            </span>
            <span className="text-silver/40 font-medium text-[10px] italic">
              {month.days}j
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 h-auto w-full pb-20">
      
      {/* ==================================================================
          1. ONGLET GÉNÉRAL
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* Colonne Visuel (4/12) */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                <div className="absolute inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
                  {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
                </div>
              </div>
            </div>
            
            {/* Colonne Infos & Continents (8/12) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-5 h-full content-start">
                {['name', 'subtitle', 'primary_calendar_id', 'age', 'ruleset_id', 'size', 'shape'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  if (!f) return null;
                  return (
                    <div key={f.name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={name === 'name' ? nameTextStyle : plainTextStyle}>
                        {smartRender(f)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Blocs Continents et Systèmes Dynamiques (Ruleset) */}
              <div className="mt-2 pt-6 border-t border-white/5 space-y-6">
                 {visibleFields.filter(f => ['world_continents', 'dynamic_world'].includes(f.name)).map(f => (
                   <div key={f.name}>
                     <label className={labelStyle}>{f.label}</label>
                     <div className="py-1">{renderFieldValue(f)}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          
          {/* Description & Mythe (Pleine largeur) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-8">
            {visibleFields.filter(f => ['description', 'creation_myth'].includes(f.name)).map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={descriptionStyle}>{smartRender(f)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          2. ONGLETS TECHNIQUES (Magie, Géo, Civilisation)
          ================================================================== */}
      {['geography', 'magic', 'civilization'].includes(activeTab) && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {visibleFields.filter(f => f.name !== 'calendar_config').map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={plainTextStyle}>{smartRender(f)}</div>
              </div>
            ))}
          </div>
          
          {/* Rendu compact des mois pour l'onglet Magie */}
          {activeTab === 'magic' && item.calendar_config && (
            <div className="w-full pt-10 border-t border-white/5">
                <label className={labelStyle}>Séquence des Cycles (Mois)</label>
                {compactCalendarRender(item.calendar_config)}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================
          3. ONGLET HISTOIRE (Moteur V4)
          ================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-12">
          <div className="w-full">
            <label className={labelStyle}>Lignage Temporel du Monde</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-black/20 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-teal-400" />
                </div>
                <HistoryChronicleEditor worldId={item?.id} entityId={item?.id} entityType="world" readOnly={true} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-white/5 pt-12">
             <div className="md:col-span-7 space-y-10">
               {['current_era', 'major_historical_events', 'ancient_civilizations'].map(name => {
                 const f = visibleFields.find(field => field.name === name);
                 return f ? (
                   <div key={f.name}>
                     <label className={labelStyle}>{f.label}</label>
                     <div className={descriptionStyle}>{smartRender(f)}</div>
                   </div>
                 ) : null;
               })}
             </div>
             <div className="md:col-span-5 space-y-10">
                {['prophecies', 'current_conflicts', 'time_engine'].map(name => {
                 const f = visibleFields.find(field => field.name === name);
                 return f ? (
                   <div key={f.name}>
                     <label className={labelStyle}>{f.label}</label>
                     <div className={plainTextStyle}>{smartRender(f)}</div>
                   </div>
                 ) : null;
               })}
             </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          4. AUTRES ONGLETS (Galerie Photos, etc.)
          ================================================================== */}
      {!['general', 'geography', 'magic', 'history', 'civilization'].includes(activeTab) && (
        <div className="space-y-12">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className="py-2">{smartRender(f)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}