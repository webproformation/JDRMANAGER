import React from 'react';
import { Fingerprint, Landmark, Sparkles, Users } from 'lucide-react';

export default function RacesLayout({ config, activeTab, renderFieldValue, formData }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const labelStyle = "text-[9px] font-black text-amber-500/40 uppercase tracking-[0.3em] mb-2 block ml-1";
  const boxStyle = "bg-white/5 rounded-2xl border border-white/5 p-4 min-h-[50px] flex items-center text-sm text-silver/80 backdrop-blur-sm";

  const renderSection = (fieldNames) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fieldNames.map(name => {
        const field = activeTabData?.fields.find(f => f.name === name);
        return field ? (
          <div key={name}>
            <label className={labelStyle}>{field.label}</label>
            <div className={boxStyle}>{renderFieldValue(field)}</div>
          </div>
        ) : null;
      })}
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
             <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={formData.image_url} alt="Race" className="w-full h-full object-cover" />
             </div>
          </div>
          <div className="md:col-span-8 space-y-8">
             <div className="grid grid-cols-2 gap-6">
                {['name', 'subtitle', 'ruleset_id', 'world_id'].map(n => (
                  <div key={n}>
                    <label className={labelStyle}>{config.tabs[0].fields.find(f => f.name === n)?.label}</label>
                    <div className={boxStyle}>{renderFieldValue(config.tabs[0].fields.find(f => f.name === n))}</div>
                  </div>
                ))}
             </div>
             <div className="bg-white/[0.02] rounded-[2rem] border border-white/5 p-8 text-silver/60 italic leading-relaxed shadow-inner">
                {renderFieldValue(activeTabData.fields.find(f => f.name === 'description'))}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'biology' && renderSection(['size', 'speed', 'lifespan', 'age', 'physical_description'])}
      {activeTab === 'culture' && renderSection(['languages', 'alignment', 'society_structure', 'naming_conventions'])}
      
      {activeTab === 'abilities' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {['traits', 'racial_abilities'].map(n => (
               <div key={n}>
                 <label className={labelStyle}>{activeTabData.fields.find(f => f.name === n)?.label}</label>
                 <div className="bg-amber-500/5 rounded-2xl border border-amber-500/10 p-6 text-sm text-silver/70">
                    {renderFieldValue(activeTabData.fields.find(f => f.name === n))}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && <div className="w-full">{renderFieldValue(activeTabData.fields[0])}</div>}
      {activeTab === 'gm' && <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-red-200/60 italic">{renderFieldValue(activeTabData.fields[0])}</div>}
    </div>
  );
}