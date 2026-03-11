import React from 'react';
import { Shield, Waves, Anchor } from 'lucide-react';

export default function OceanLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual || f.component) || [];
  
  const labelStyle = "text-[9px] font-black text-slate-400/60 uppercase tracking-[0.25em] mb-1 block ml-1";
  const boxStyle = "bg-[#151725]/40 rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center w-full";

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500">
      
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            <div className="h-full min-h-[300px]">
              <label className={labelStyle}>Visuel Maritime</label>
              <div className="h-[calc(100%-22px)]">{renderFieldValue(getField('image_url'))}</div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Nom de l'Océan</label>
                <div className="bg-gradient-to-r from-blue-500/20 to-transparent rounded-xl border border-white/10 p-4 text-xl font-black text-white uppercase tracking-wider">
                  {renderFieldValue(getField('name'))}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Titre ou Surnom</label>
                <div className={boxStyle}>{renderFieldValue(getField('subtitle'))}</div>
              </div>
              <div>
                <label className={labelStyle}>Système de Règles</label>
                <div className={boxStyle}>{renderFieldValue(getField('ruleset_id'))}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Monde</label>
                <div className={boxStyle}>{renderFieldValue(getField('world_id'))}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <label className={labelStyle}>Description</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4"}>{renderFieldValue(getField('description'))}</div>
            </div>
            <div>
              <label className={labelStyle}>Propriétés Système</label>
              <div>{renderFieldValue(getField('dynamic_geo'))}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'environment' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['area', 'depth', 'water_temp', 'visibility'].map(name => (
            <div key={name}>
              <label className={labelStyle}>{getField(name)?.label}</label>
              <div className={boxStyle + " min-h-[80px]"}>{renderFieldValue(getField(name))}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'navigation' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Anchor size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Flux & Ressources</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['currents', 'routes', 'resources'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[100px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hazards_tab' && (
        <div className="w-full">
           <label className={labelStyle}>Dangers répertoriés</label>
           <div className={boxStyle + " min-h-[150px] items-start py-4 text-red-400 bg-red-500/5 border-red-500/10"}>
             {renderFieldValue(getField('hazards'))}
           </div>
        </div>
      )}

      {activeTab === 'gallery' && <div className="w-full">{renderFieldValue(getField('ocean_images'))}</div>}

      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 space-y-4">
          <div className="flex items-center gap-2 mb-2 text-red-500"><Shield size={14} /><h4 className="text-[10px] font-black uppercase tracking-widest">Secrets MJ</h4></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Secrets des profondeurs</label>
              <div className={boxStyle + " min-h-[150px] items-start py-3 text-red-200/80"}>{renderFieldValue(getField('gm_secrets_ocean'))}</div>
            </div>
            <div>
              <label className={labelStyle}>Notes diverses</label>
              <div className={boxStyle + " min-h-[150px] items-start py-3"}>{renderFieldValue(getField('notes'))}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}