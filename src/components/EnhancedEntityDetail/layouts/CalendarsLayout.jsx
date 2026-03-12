import React from 'react';
import { Sparkles, Clock, Calendar as CalendarIcon } from 'lucide-react';

/**
 * CalendarsLayout - Standard PRESTIGE 3.0
 * Architecture chirurgicale pour la visualisation du temps et des cycles.
 * Alignement strict sur la structure 3 colonnes (Standard 2.0) [cite: 2026-03-11].
 */
export default function CalendarsLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Triple Colonne PRESTIGE) [cite: 2026-03-11]
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* COLONNE 1 : VISUEL (md:col-span-4) [cite: 2026-03-11] */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Emblème Temporel</label>
              <div className="h-[calc(100%-24px)] rounded-[3rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl">
                {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
              </div>
            </div>
            
            {/* COLONNE 2 : IDENTITÉ & SYSTÈME (md:col-span-5) [cite: 2026-03-11] */}
            <div className="md:col-span-5 space-y-6">
              {['name', 'ruleset_id'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
              {/* Propriétés célestes dynamiques */}
              <div>
                {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_celestial'))}
              </div>
            </div>

            {/* COLONNE 3 : MONDE (md:col-span-3) [cite: 2026-03-11] */}
            <div className="md:col-span-3">
              <label className={labelStyle}>Monde lié</label>
              <div className={boxStyle + " border-teal-500/20 bg-teal-500/5"}>
                {renderFieldValue(visibleFields.find(f => f.name === 'world_id'))}
              </div>
            </div>
          </div>
          
          {/* Description historique sous le header [cite: 2026-03-11] */}
          <div className="w-full pt-8 border-t border-white/5">
            <label className={labelStyle}>Contexte Historique</label>
            <div className={boxStyle + " min-h-[120px] items-start py-5 px-6 leading-relaxed text-silver/90"}>
              {renderFieldValue(visibleFields.find(f => f.name === 'description'))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : STRUCTURE DES CYCLES
          ================================================================== */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-8 bg-black/20 p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <Clock className="text-teal-400" size={20} />
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Mécaniques du Temps</h4>
             </div>
             {['days_per_week', 'days_per_month', 'seasons'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
             })}
          </div>
          <div className="rounded-[2.5rem] bg-black/10 p-6 border border-white/10 shadow-2xl">
            <label className={labelStyle}>Séquence des Mois configurée</label>
            {renderFieldValue(visibleFields.find(f => f.name === 'months'))}
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 3 : DATE & HOROSCOPE [cite: 2026-03-12]
          ================================================================== */}
      {activeTab === 'horoscope' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-teal-500/5 rounded-[3rem] border border-teal-500/10 shadow-[0_0_50px_rgba(20,184,166,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <Sparkles size={120} className="text-teal-400" />
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500/50 mb-4">Jour</span>
              <span className="text-6xl font-black text-white drop-shadow-lg">{item.current_day || '01'}</span>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-teal-500/20 rounded-3xl border border-teal-500/30 shadow-inner">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-4">Mois</span>
              <span className="text-3xl font-black text-teal-300 uppercase tracking-tighter text-center">
                {item.current_month || 'Inconnu'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500/50 mb-4">Année</span>
              <span className="text-6xl font-black text-white drop-shadow-lg">{item.current_year || '1000'}</span>
            </div>
          </div>

          <div className="w-full">
             <label className={labelStyle}>Aperçu de la Voûte Céleste & Horoscope</label>
             <div className="mt-4">
                {renderFieldValue(visibleFields.find(f => f.name === 'horoscope_display'))}
             </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS : FESTIVALS & MJ
          ================================================================== */}
      {!['general', 'structure', 'horoscope'].includes(activeTab) && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'custom' ? "" : boxStyle + " min-h-[120px] items-start p-8 leading-relaxed"}>
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}