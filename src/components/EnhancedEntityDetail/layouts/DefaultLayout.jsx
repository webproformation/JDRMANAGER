import React from 'react';
import { Globe, LayoutGrid, Info } from 'lucide-react';

/**
 * DefaultLayout - Standard PRESTIGE 4.2 (Lecture Seule)
 * Transforme une simple liste de champs en une fiche d'archive immersive.
 */
export default function DefaultLayout({ config, activeTab, renderFieldValue, formData }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // On sépare les champs pour l'en-tête et le corps
  const headerFields = ['image_url', 'name', 'subtitle', 'ruleset_id', 'world_id'];
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual && !headerFields.includes(f.name)) || [];

  // Styles Prestige
  const labelStyle = "text-[9px] font-black text-[#2DD4BF]/40 uppercase tracking-[0.3em] mb-2 block ml-1";
  const boxStyle = "bg-white/5 rounded-2xl border border-white/5 p-4 shadow-inner min-h-[50px] flex items-center text-sm text-silver/80 backdrop-blur-sm hover:bg-white/10 transition-all duration-300";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ==================================================================
          SECTION 1 : EN-TÊTE IDENTITAIRE (Uniquement sur l'onglet Identity/Général)
          ================================================================== */}
      {(activeTab === 'identity' || activeTab === 'general') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-b border-white/5 pb-10">
          
          {/* VISUEL PRINCIPAL (4/12) */}
          <div className="md:col-span-4">
            <label className={labelStyle}>Archive Visuelle</label>
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20 group">
              {formData.image_url ? (
                <img 
                  src={formData.image_url} 
                  alt="Focus" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                  <LayoutGrid size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* DONNÉES CLÉS (8/12) */}
          <div className="md:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTabData?.fields
                .filter(f => ['name', 'subtitle', 'ruleset_id', 'world_id'].includes(f.name))
                .map(field => (
                  <div key={field.name} className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <label className={labelStyle}>{field.label}</label>
                    <div className={boxStyle}>
                      {renderFieldValue(field)}
                    </div>
                  </div>
                ))}
            </div>

            {/* DESCRIPTION / LORE DE BASE */}
            {activeTabData?.fields.find(f => f.name === 'description') && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-200">
                <label className={labelStyle}>Description Fondamentale</label>
                <div className="bg-white/[0.02] rounded-[2rem] border border-white/5 p-8 text-silver/60 italic leading-relaxed text-sm shadow-2xl">
                  {renderFieldValue(activeTabData.fields.find(f => f.name === 'description'))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================
          SECTION 2 : GRILLE DE DONNÉES (Corps du Layout)
          ================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleFields.map((field, idx) => {
          const isFull = field.fullWidth || ['textarea', 'images', 'custom'].includes(field.type);
          
          return (
            <div 
              key={field.name} 
              className={`${isFull ? 'md:col-span-full' : 'md:col-span-1'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="group flex flex-col h-full">
                <label className={`${labelStyle} group-hover:text-[#2DD4BF] transition-colors duration-300`}>
                  {field.label}
                </label>
                <div className={`${boxStyle} h-full`}>
                  {renderFieldValue(field)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER DE LA FICHE */}
      <div className="pt-10 flex items-center justify-between opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em] text-silver">
          <Info size={10} /> Registre Omniversel V4.2
        </div>
        <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-[#2DD4BF]">
          Prestige Standard
        </div>
      </div>
    </div>
  );
}