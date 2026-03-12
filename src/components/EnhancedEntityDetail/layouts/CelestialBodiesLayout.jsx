import React from 'react';
import { Star } from 'lucide-react';

/**
 * CelestialBodiesLayout - Standard PRESTIGE 3.0
 * Architecture chirurgicale pour les Astres, Lunes et Comètes
 * Alignement strict sur la structure de la Page Monde (Standard 2.0)
 */
export default function CelestialBodiesLayout({ 
  item, 
  config, 
  activeTab, 
  renderFieldValue 
}) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // Filtrage des champs virtuels sans composant pour le rendu automatique
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  // Styles atomiques PRESTIGE
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Triple Colonne PRESTIGE - Miroir Monde)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            {/* COLONNE 1 : VISUEL DE L'ASTRE (md:col-span-4) 
                Aligné sur le 'Visual Principal' du Monde */}
            <div className="md:col-span-4 h-full min-h-[400px]">
              <label className={labelStyle}>Observation Céleste</label>
              <div className="h-[calc(100%-24px)] rounded-[3rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl">
                {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
              </div>
            </div>
            
            {/* COLONNE 2 & 3 : IDENTITÉ & SYSTÈME (md:col-span-8)
                Utilise une sous-grille de 3 colonnes [cite: 2026-03-12] */}
            <div className="md:col-span-8 flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['name', 'subtitle', 'body_type', 'ruleset_id', 'world_id'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  if (!f) return null;
                  
                  return (
                    <div key={name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={boxStyle}>{renderFieldValue(f)}</div>
                    </div>
                  );
                })}
              </div>

              {/* BLOC SPÉCIFICITÉS SYSTÈME (Ex: Phases, Alignement)
                  Positionné comme le bloc "Spécificités" de la page Monde */}
              <div className="mt-2 bg-teal-500/5 p-8 rounded-[2.5rem] border border-teal-500/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Star size={40} className="text-teal-400" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-teal-500/30"></div>
                  Propriétés du Système
                </h4>
                {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_celestial'))}
              </div>
            </div>
          </div>
          
          {/* ZONE DESCRIPTION (Largeur totale sous le header)
              Identique à 'Description Générale' sur la fiche Monde */}
          <div className="w-full pt-10 border-t border-white/5">
            <label className={labelStyle}>Analyse et Description</label>
            <div className={boxStyle + " min-h-[150px] items-start py-6 px-8 leading-relaxed text-silver/90 text-sm"}>
              {renderFieldValue(visibleFields.find(f => f.name === 'description'))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : ASTROPHYSIQUE (Grille 3 Colonnes - 2 Lignes)
          ================================================================== */}
      {activeTab === 'physical' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {['color', 'size', 'brightness', 'orbital_period', 'phases'].map(name => {
            const f = visibleFields.find(field => field.name === name);
            if (!f) return null;

            return (
              <div key={name} className={name === 'phases' ? "md:col-span-2" : "w-full"}>
                <label className={labelStyle}>{f.label}</label>
                <div className={boxStyle + " py-4"}>
                  {renderFieldValue(f)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================================
          ONGLET 3 : INFLUENCES ET VTT (Focus Mécanique)
          ================================================================== */}
      {activeTab === 'influence' && (
        <div className="space-y-12">
          
          {/* BLOC MOTEUR VTT : PLEINE LARGEUR */}
          <div className="w-full">
             <label className={labelStyle}>Modificateurs Environnementaux (Temps Réel)</label>
             <div className="mt-4">
                {renderFieldValue(visibleFields.find(f => f.name === 'data'))}
             </div>
          </div>

          {/* GRILLE D'INFLUENCES LORE (3 Colonnes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['astrological_influence', 'magical_properties', 'cultural_significance'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={name} className="space-y-2">
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + " min-h-[180px] items-start p-6 italic text-silver/70 leading-relaxed"}>
                    {renderFieldValue(f)}
                  </div>
                </div>
              ) : null;
            })}
          </div>

        </div>
      )}

      {/* ==================================================================
          AUTRES ONGLETS : GALERIE ET MJ (Standard Stack PRESTIGE)
          ================================================================== */}
      {!['general', 'physical', 'influence'].includes(activeTab) && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'images' || f.type === 'custom' ? "" : boxStyle + " min-h-[120px] items-start p-8"}>
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}