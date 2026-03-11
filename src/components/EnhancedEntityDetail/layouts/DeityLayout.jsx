import React from 'react';

export default function DeityLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  
  // STANDARD PRESTIGE 3.0 : Fond translucide et flou
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ONGLET : IDENTITÉ DIVINE (HEADER SYNCHRONISÉ 12 COLONNES) */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Colonne Image : Hauteur 350px identique au formulaire */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20">
                {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
              </div>
            </div>
            
            {/* Colonne Infos : Grille de 3 colonnes pour l'équilibre Prestige */}
            <div className="md:col-span-8 grid grid-cols-3 gap-5 h-full content-start">
              {['name', 'title', 'ruleset_id', 'pantheon', 'alignment', 'divine_rank'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
              
              <div className="col-span-3 grid grid-cols-3 gap-5 mt-2">
                {['world_id', 'domains', 'portfolio'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  return f ? (
                    <div key={f.name}>
                      <label className={labelStyle}>{f.label}</label>
                      <div className={boxStyle}>{renderFieldValue(f)}</div>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Mécaniques Système */}
              <div className="col-span-3 mt-4">
                 {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_deity_fields'))}
              </div>
            </div>
          </div>
          
          {/* Description & Manifestation (2 colonnes sous le header) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
            {visibleFields.filter(f => ['description', 'appearance'].includes(f.name)).map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(f)}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {visibleFields.filter(f => ['symbol', 'sacred_symbol_description'].includes(f.name)).map(f => (
              <div key={f.name} className="w-full">
                <label className={labelStyle}>{f.label}</label>
                <div className={boxStyle}>{renderFieldValue(f)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ONGLET : CULTE & DOGME (STRUCTURE ARITHMÉTIQUE 3+2) */}
      {activeTab === 'worship' && (
        <div className="space-y-12">
          <div className="w-full">
            {renderFieldValue(visibleFields.find(f => f.name === 'data'))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['favored_weapon', 'holy_days', 'clergy_alignments'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>

          {/* GRILLE 3 COLONNES */}
          <div className="pt-10 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['rituals', 'worshippers', 'typical_worshippers'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " min-h-[100px] items-start py-3"}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* GRILLE 2 COLONNES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['divine_servants', 'temples'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + " min-h-[100px] items-start py-3"}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* ONGLET : POUVOIRS & ARTEFACTS (STRUCTURE ARITHMÉTIQUE 3+2) */}
      {activeTab === 'powers' && (
        <div className="space-y-12">
          {/* GRILLE 3 COLONNES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['sacred_artifacts', 'granted_powers', 'divine_spells'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>

          {/* GRILLE 2 COLONNES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
            {['avatar_description', 'manifestations'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* ONGLET : RELATIONS */}
      {activeTab === 'relations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {['allies', 'enemies'].map(name => {
            const f = visibleFields.find(field => field.name === name);
            return f ? (
              <div key={f.name}>
                <label className={labelStyle}>{f.label}</label>
                <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(f)}</div>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* ONGLET : GALERIE */}
      {activeTab === 'gallery' && (
        <div className="w-full mt-4">
           {renderFieldValue(activeTabData?.fields.find(f => f.name === 'deity_images'))}
        </div>
      )}

      {/* ONGLET : SECRETS MJ */}
      {activeTab === 'gm' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['gm_notes', 'gm_secret_plots', 'gm_conspiracies'].map(name => {
              const f = visibleFields.find(field => field.name === name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + " min-h-[150px] items-start py-4"}>{renderFieldValue(f)}</div>
                </div>
              ) : null;
            })}
          </div>
          <div className="pt-8 border-t border-white/5">
             <label className={labelStyle}>Archives Interdites</label>
             {renderFieldValue(activeTabData?.fields.find(f => f.name === 'gm_secret_images'))}
          </div>
        </div>
      )}
    </div>
  );
}