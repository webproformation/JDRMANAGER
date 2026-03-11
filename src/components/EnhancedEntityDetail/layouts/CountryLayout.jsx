import React from 'react';
import { Scale, Shield, Landmark, Waves } from 'lucide-react';

/**
 * CountryLayout - Version Prestige Réorganisée
 * Structure 4/12 pour le Général, Blocs Thématiques pour la Politique.
 */
export default function CountryLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // Correction : On autorise les champs virtuels s'ils possèdent un composant (ex: EntityChildCards)
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-1 block ml-1";
  const boxStyle = "bg-[#151725]/40 rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center w-full";

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          1. GÉNÉRAL (Structure 4/12)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Visuel Principal à GAUCHE (4 colonnes) */}
            <div className="md:col-span-4 h-full min-h-[300px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-22px)]">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Infos Clés à DROITE (8 colonnes, Grid 2x3) */}
            <div className="md:col-span-8 grid grid-cols-2 gap-3 h-full content-start">
              {['name', 'subtitle', 'world_id', 'continent_id', 'ocean_id', 'ruleset_id'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
              })}
              
              {/* Le bloc système dynamique */}
              {getField('dynamic_nation') && (
                <div className="col-span-2 mt-2">
                    {renderFieldValue(getField('dynamic_nation'))}
                </div>
              )}
            </div>
          </div>
          
          {/* Description Générale en pleine largeur */}
          {getField('description') && (
            <div className="w-full">
              <label className={labelStyle}>Description Générale</label>
              <div className={boxStyle + " min-h-[100px] items-start py-4"}>
                {renderFieldValue(getField('description'))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================
          2. GÉOGRAPHIE
          ================================================================== */}
      {activeTab === 'geography' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['capital', 'population', 'area'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>{renderFieldValue(f)}</div>
                  </div>
                ) : null;
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['terrain', 'climate_description'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " min-h-[80px] items-start py-3"}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. POLITIQUE
          ================================================================== */}
      {activeTab === 'politics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 space-y-4 shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 mb-2">
              <Scale size={14} /> Autorité Civile
            </h4>
            {['government_type', 'ruler', 'government_structure', 'laws'].map(name => {
              const f = getField(name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + (f.type === 'textarea' ? " min-h-[80px] items-start py-3" : "")}>
                    {renderFieldValue(f)}
                  </div>
                </div>
              ) : null;
            })}
          </div>

          <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10 space-y-4 shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2 mb-2">
              <Shield size={14} /> Défense & Diplomatie
            </h4>
            {['military_strength', 'military_structure', 'alliances', 'enemies'].map(name => {
              const f = getField(name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + (f.type === 'textarea' ? " min-h-[80px] items-start py-3" : "")}>
                    {renderFieldValue(f)}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* ==================================================================
          4. ÉCONOMIE
          ================================================================== */}
      {activeTab === 'economy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['currency', 'economy'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + (f.type === 'textarea' ? " min-h-[80px] items-start py-3" : "")}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
            {['trade_goods', 'imports', 'exports'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " min-h-[80px] items-start py-3"}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}

      {/* ==================================================================
          5. CULTURE & SOCIÉTÉ
          ================================================================== */}
      {activeTab === 'culture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['language', 'cultural_practices', 'festivals', 'cuisine', 'art_style', 'education_system'].map(name => {
              const f = getField(name);
              return f ? (
                <div key={f.name}>
                  <label className={labelStyle}>{f.label}</label>
                  <div className={boxStyle + (f.type === 'textarea' ? " min-h-[100px] items-start py-3" : "")}>
                    {renderFieldValue(f)}
                  </div>
                </div>
              ) : null;
          })}
        </div>
      )}

      {/* ==================================================================
          6. VILLES & LIEUX (Restauration du bloc manquant)
          ================================================================== */}
      {activeTab === 'locations' && (
        <div className="w-full mt-4">
          {renderFieldValue(getField('country_locations'))}
        </div>
      )}

      {/* ==================================================================
          7. OCÉANS & MERS (Restauration du bloc manquant)
          ================================================================== */}
      {activeTab === 'oceans' && (
        <div className="w-full mt-4">
          {renderFieldValue(getField('country_oceans'))}
        </div>
      )}

      {/* ==================================================================
          8. HISTOIRE
          ================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {getField('founding_date') && (
            <div>
              <label className={labelStyle}>Date de Fondation</label>
              <div className={boxStyle}>{renderFieldValue(getField('founding_date'))}</div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['history', 'major_wars', 'historical_figures', 'relations'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name} className={name === 'history' ? 'col-span-2' : ''}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " min-h-[120px] items-start py-3"}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}

      {/* ==================================================================
          9. GALERIE D'IMAGES
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {visibleFields.filter(f => f.type === 'images').map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className="py-2">
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* ==================================================================
          10. NOTES MJ
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2 mb-2">
            <Shield size={14} /> Archives Secrètes MJ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['gm_secrets_country', 'notes'].map(name => {
                const f = getField(name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle + " min-h-[120px] items-start py-3"}>
                      {renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}