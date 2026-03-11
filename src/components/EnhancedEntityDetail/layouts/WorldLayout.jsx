import React from 'react';

export default function WorldLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // On autorise les composants Customs (Horloge, Calendrier, Cartes Enfants)
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  
  // HARMONISATION : Fond Prestige bg-black/20 et flou
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      {/* GÉNÉRAL : Alignement chirurgical sur le formulaire (Grille 12 colonnes) */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Colonne Image : Forcée à 350px de hauteur minimale pour matcher l'édition */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20">
                {renderFieldValue(visibleFields.find(f => f.type === 'image' || f.name === 'image_url'))}
              </div>
            </div>
            
            {/* Colonne Infos : Structure en 3 colonnes pour l'équilibre visuel */}
            <div className="md:col-span-8 grid grid-cols-3 gap-5 h-full content-start">
              {['name', 'age', 'subtitle', 'size', 'shape', 'ruleset_id'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
              {/* Champs dynamiques du Ruleset */}
              <div className="col-span-3 mt-4">
                 {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_world'))}
              </div>
            </div>
          </div>
          
          {/* Bloc Description & Cosmologie */}
          {visibleFields.filter(f => ['description', 'creation_myth'].includes(f.name)).map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

      {/* GÉOGRAPHIE & MAGIE */}
      {(activeTab === 'geography' || activeTab === 'magic') && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleFields.filter(f => f.type !== 'custom' || f.name !== 'calendar_config').map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={f.type === 'custom' ? "" : boxStyle}>{renderFieldValue(f)}</div>
              </div>
            ))}
          </div>
          {/* Calendrier Config */}
          {visibleFields.filter(f => f.name === 'calendar_config').map(f => (
            <div key={f.name} className="pt-8 border-t border-white/5">
              <label className={labelStyle}>{f.label}</label>
              {renderFieldValue(f)}
            </div>
          ))}
        </div>
      )}

      {/* CIVILISATION */}
      {activeTab === 'civilization' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleFields.map((f, i) => (
            <div key={f.name} className={i === visibleFields.length - 1 && visibleFields.length % 2 !== 0 ? "md:col-span-2" : "md:col-span-1"}>
              <label className={labelStyle}>{f.label}</label>
              <div className={f.type === 'custom' ? "" : boxStyle}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

      {/* HISTOIRE */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['current_era', 'major_historical_events', 'ancient_civilizations', 'prophecies', 'current_conflicts'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name} className="w-full">
                  <label className={labelStyle}>{f.label}</label>
                  <div className={f.type === 'custom' ? "" : boxStyle}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>
          {/* Moteur de Temps */}
          {visibleFields.filter(f => f.name === 'time_engine').map(f => (
            <div key={f.name} className="pt-8 border-t border-white/5">
              <label className={labelStyle}>{f.label}</label>
              {renderFieldValue(f)}
            </div>
          ))}
        </div>
      )}

      {/* CONTINENTS (LES CARTES) */}
      {activeTab === 'continents' && (
        <div className="w-full mt-4">
           {renderFieldValue(activeTabData?.fields.find(f => f.name === 'world_continents'))}
        </div>
      )}

      {/* GALERIE D'IMAGES */}
      {!['general', 'geography', 'magic', 'civilization', 'history', 'continents'].includes(activeTab) && (
        <div className="space-y-6">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className="py-2">
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}