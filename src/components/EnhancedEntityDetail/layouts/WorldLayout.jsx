import React from 'react';
import { History, CalendarDays, Sparkles, Clock, BookOpen } from 'lucide-react';

// LE CORRECTIF EST ICI : On importe le moteur autonome V4 directement dans le Layout
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * WorldLayout - Standard PRESTIGE 3.0
 * Architecture chirurgicale pour la visualisation des mondes et de leur chronologie.
 * Intégration de la Chronique des Âges V4 (Autonome) [cite: 2026-03-12].
 */
export default function WorldLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component || f.type === 'world_history_editor') || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Header 3 Colonnes PRESTIGE)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl">
                {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
              </div>
            </div>
            
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-5 h-full content-start">
                {['name', 'subtitle', 'primary_calendar_id', 'age', 'ruleset_id', 'size', 'shape'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  return f ? (
                    <div key={f.name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={boxStyle}>{renderFieldValue(f)}</div>
                    </div>
                  ) : null;
                })}
              </div>
              
              <div className="mt-2">
                 {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_world'))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-8">
            {visibleFields.filter(f => ['description', 'creation_myth'].includes(f.name)).map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={boxStyle + " min-h-[140px] items-start py-5 px-6 leading-relaxed text-silver/90"}>
                  {renderFieldValue(f)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET GÉOGRAPHIE
          ================================================================== */}
      {activeTab === 'geography' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'custom' ? "" : boxStyle + " py-4 px-5"}>
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================
          ONGLET MAGIE & COSMOLOGIE
          ================================================================== */}
      {activeTab === 'magic' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-6 space-y-8">
            {visibleFields.filter(f => f.name !== 'calendar_config').map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={f.type === 'custom' ? "" : boxStyle + " py-4 px-5"}>
                  {renderFieldValue(f)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="md:col-span-6 sticky top-0 animate-in slide-in-from-right duration-700">
             {visibleFields.filter(f => f.name === 'calendar_config').map(f => (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/10 p-6 shadow-2xl backdrop-blur-md">
                    {renderFieldValue(f)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET HISTOIRE & CHRONOLOGIE (V4 Autonome)
          ================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          
          {/* LA GRANDE CHRONIQUE (Pleine Largeur) */}
          <div className="w-full">
            <label className={labelStyle}>Lignage Temporel du Monde</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-black/20 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-teal-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE DIRECTE : Le Moteur V4 en Mode Lecture */}
                <HistoryChronicleEditor 
                  worldId={item?.id}
                  entityId={item?.id}
                  entityType="world"
                  readOnly={true}
                />

              </div>
            </div>
          </div>

          {/* DÉTAILS CHRONOLOGIQUES ET CONFLITS (Grille 2 Colonnes) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-white/5 pt-12">
            <div className="md:col-span-7 space-y-8">
              {['current_era', 'major_historical_events', 'ancient_civilizations'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name} className="w-full">
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " py-5 px-6 items-start min-h-[80px]"}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
            </div>
            
            <div className="md:col-span-5 space-y-8">
               {['prophecies', 'current_conflicts', 'time_engine'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name} className="w-full">
                    <label className={labelStyle}>{f.label}</label>
                    <div className={f.name === 'time_engine' ? "" : boxStyle + " py-5 px-6 items-start"}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS (Civilisation, Continents, Galerie)
          ================================================================== */}
      {!['general', 'geography', 'magic', 'history'].includes(activeTab) && (
        <div className="space-y-10">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'custom' ? "" : "py-2"}>
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}