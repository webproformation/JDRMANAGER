import React from 'react';
import { History, CalendarDays } from 'lucide-react';

// LE CORRECTIF EST ICI : On importe le moteur autonome V4 directement dans le Layout
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

export default function ContinentLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // FIX CRITIQUE : On autorise explicitement le type 'world_history_editor' à s'afficher 
  // même s'il est 'isVirtual: true'
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component || f.type === 'world_history_editor') || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-1 block ml-1";
  const boxStyle = "bg-[#151725]/40 rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* 1. GÉNÉRAL */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Image Principale */}
            <div className="md:col-span-4 h-full min-h-[300px]">
              <label className={labelStyle}>Visuel Principal</label>
              <div className="h-[calc(100%-22px)]">
                {renderFieldValue(visibleFields.find(f => f.name === 'image_url'))}
              </div>
            </div>
            
            {/* Infos Clés */}
            <div className="md:col-span-8 grid grid-cols-2 gap-3 h-full content-start">
              {['name', 'subtitle', 'world_id', 'ruleset_id'].map(name => {
                const f = visibleFields.find(field => field.name === name);
                return f ? (
                  <div key={f.name}>
                    <label className={labelStyle}>{f.label}</label>
                    <div className={boxStyle}>
                      {/* Affichage intelligent du nom du monde au lieu de l'ID brut */}
                      {name === 'world_id' && (item?.worlds?.name || item?.world?.name)
                        ? (item.worlds?.name || item.world?.name)
                        : renderFieldValue(f)}
                    </div>
                  </div>
                ) : null;
              })}
              
              {/* Le champ custom ruleset (dynamic_geo) s'affiche en pleine largeur */}
              {visibleFields.find(f => f.name === 'dynamic_geo') && (
                <div className="col-span-2 mt-2">
                    {renderFieldValue(visibleFields.find(f => f.name === 'dynamic_geo'))}
                </div>
              )}
            </div>
          </div>
          
          {/* Description (pleine largeur) */}
          {visibleFields.filter(f => f.name === 'description').map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + " min-h-[100px]"}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 2. GÉOGRAPHIE */}
      {activeTab === 'geography' && (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['area', 'climate'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  return f ? (
                    <div key={f.name} className="w-full">
                      <label className={labelStyle}>{f.label}</label>
                      <div className={boxStyle}>{renderFieldValue(f)}</div>
                    </div>
                  ) : null;
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['terrain_description', 'major_rivers', 'mountain_ranges', 'forests', 'deserts', 'resources'].map(name => {
                  const f = visibleFields.find(field => field.name === name);
                  return f ? (
                    <div key={f.name} className="w-full">
                      <label className={labelStyle}>{f.label}</label>
                      <div className={boxStyle + (f.type === 'textarea' ? " min-h-[80px]" : "")}>{renderFieldValue(f)}</div>
                    </div>
                  ) : null;
              })}
            </div>
        </div>
      )}

      {/* 3. NATURE */}
      {activeTab === 'nature' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + " min-h-[150px]"}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CULTURE */}
      {activeTab === 'culture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {visibleFields.map((f, i) => (
            <div key={f.name} className={f.name === 'population' ? "col-span-2 md:col-span-1" : "col-span-2 md:col-span-1"}>
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + (f.type === 'textarea' ? " min-h-[100px]" : "")}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 5. HISTOIRE (MISE À JOUR V4 AUTONOME) */}
      {activeTab === 'history' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Annales du Continent</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-[#151725]/40 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-teal-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE DIRECTE : Le Moteur V4 en Mode Lecture */}
                <HistoryChronicleEditor 
                  worldId={item?.world_id} // Crucial : l'ID du monde parent pour que le moteur sache quel calendrier charger
                  entityId={item?.id}      // L'ID du continent
                  entityType="continent"
                  readOnly={true}
                />
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. PAYS (LES CARTES ENFANTS) */}
      {activeTab === 'countries' && (
        <div className="w-full mt-4">
           {renderFieldValue(activeTabData?.fields.find(f => f.name === 'continent_countries'))}
        </div>
      )}

      {/* 7. GALERIE (SANS BOX STYLE RESTRICTIF) */}
      {activeTab === 'gallery' && (
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
      
      {/* 8. NOTES MJ */}
      {activeTab === 'gm' && (
        <div className="grid grid-cols-1 gap-4">
          {visibleFields.map(f => (
            <div key={f.name} className="w-full">
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + " min-h-[100px]"}>{renderFieldValue(f)}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}