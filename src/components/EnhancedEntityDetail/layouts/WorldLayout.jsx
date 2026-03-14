import React from 'react';
import { History, CalendarDays, Sparkles, Clock, BookOpen } from 'lucide-react';

// LE CORRECTIF EST ICI : On importe le moteur autonome V4 directement dans le Layout
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * WorldLayout - Standard PRESTIGE 4.4.2 (FIDÉLITÉ & ÉPURE TOTALE)
 * Architecture chirurgicale pour la visualisation des mondes.
 * * CORRECTIF RADICAL :
 * - Suppression totale des badges colorés (bleu, vert, etc.).
 * - Remplacement par du texte blanc pur séparé par " | ".
 * - Suppression définitive des bordures et fonds de blocs.
 */
export default function WorldLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component || f.type === 'world_history_editor') || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  
  // NOUVEAUX STYLES PURS (Zéro bordure, Zéro fond)
  const nameTextStyle = "text-white font-black text-[13px] md:text-[15px] leading-tight px-1";
  const plainTextStyle = "text-white font-medium text-[11px] md:text-[13px] leading-tight px-1 py-1";
  const descriptionStyle = "text-silver/90 text-[11px] md:text-[13px] font-medium whitespace-pre-wrap px-1 leading-relaxed";

  /**
   * smartRender (Le "Filtre à Badges")
   * Cette fonction ignore les composants de badges et force le texte blanc.
   * Elle ne laisse passer le rendu original que pour les éléments structurels.
   */
  const smartRender = (field) => {
    if (!field) return "—";

    // ON NE GARDE LE RENDER ORIGINAL QUE POUR CE QUI EST VISUEL / GRAPHIQUE
    const isGraphic = field.type === 'images' || 
                       field.name === 'image_url' || 
                       field.name === 'world_continents' || 
                       field.name === 'world_images' ||
                       field.type === 'world_history_editor';

    if (isGraphic) return renderFieldValue(field);

    const rawValue = item[field.name];
    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";
    
    // Transformation des listes/badges en texte pur " | "
    if (Array.isArray(rawValue)) {
      return rawValue.length === 0 ? "—" : rawValue.join(" | ");
    }
    
    // Récupération des labels pour les sélecteurs
    if (field.options) {
      const opt = field.options.find(o => String(o.value) === String(rawValue));
      return opt ? opt.label : String(rawValue);
    }
    
    return String(rawValue);
  };

  return (
    <div className="animate-in fade-in duration-500 h-auto w-full">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl relative">
                <div className="absolute inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover">
                  {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
                </div>
              </div>
            </div>
            
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
              
              <div className="mt-2 pt-6 border-t border-white/5">
                 {/* Seul ce bloc système dynamique garde ses badges car ce sont des données de jeu (Ruleset) */}
                 {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_world'))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-8">
            {visibleFields.filter(f => ['description', 'creation_myth'].includes(f.name)).map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={descriptionStyle}>
                  {smartRender(f)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLETS TECHNIQUES UNIFIÉS (GÉO, MAGIE, CIVILISATION)
          On force la grille à 2 colonnes et le plainTextStyle pour tout le monde
          ================================================================== */}
      {['geography', 'magic', 'civilization'].includes(activeTab) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className={`${activeTab === 'magic' ? 'md:col-span-6' : 'md:col-span-2'} grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10`}>
            {visibleFields.filter(f => f.name !== 'calendar_config').map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={plainTextStyle}>
                  {smartRender(f)}
                </div>
              </div>
            ))}
          </div>
          
          {activeTab === 'magic' && (
            <div className="md:col-span-2 mt-4 sticky top-0">
               {visibleFields.filter(f => f.name === 'calendar_config').map(f => (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/10 p-8 shadow-2xl backdrop-blur-md">
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================
          ONGLET HISTOIRE & CHRONOLOGIE (V4 Autonome)
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
                <HistoryChronicleEditor 
                  worldId={item?.id}
                  entityId={item?.id}
                  entityType="world"
                  readOnly={true}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-white/5 pt-12">
            <div className="md:col-span-7 space-y-10">
              {['current_era', 'major_historical_events', 'ancient_civilizations'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name} className="w-full">
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
                  <div key={f.name} className="w-full">
                    <label className={labelStyle}>{f.label}</label>
                    <div className={plainTextStyle}>
                      {smartRender(f)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS (Continents, Galerie)
          ================================================================== */}
      {!['general', 'geography', 'magic', 'history', 'civilization'].includes(activeTab) && (
        <div className="space-y-12">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div>
                {smartRender(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}