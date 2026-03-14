import React from 'react';
import { Globe, LayoutGrid, Info } from 'lucide-react';

/**
 * DefaultLayout - Standard PRESTIGE 4.4.3 (Lecture Seule)
 * Transforme une simple liste de champs en une fiche d'archive immersive.
 * CORRECTIF FINAL : 
 * 1. Suppression totale des boxStyle (fond/bordure).
 * 2. Force le texte blanc pur.
 * 3. Formatage automatique des listes en " | " (Anti-badges).
 */
export default function DefaultLayout({ config, activeTab, renderFieldValue, formData, item }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const currentItem = item || formData; 
  
  // Champs réservés à l'en-tête identitaire
  const headerFields = ['image_url', 'name', 'subtitle', 'ruleset_id', 'world_id'];
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual && !headerFields.includes(f.name)) || [];

  // --- CONFIGURATION DES STYLES ---
  const labelStyle = "text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-2 block ml-1";
  
  // Styles de texte pur (Zéro cadre)
  const nameValueStyle = "text-white font-black text-[14px] md:text-[16px] leading-tight px-1";
  const standardValueStyle = "text-white font-medium text-[11px] md:text-[13px] leading-tight px-1 py-1";
  const loreTextStyle = "text-silver/80 italic leading-relaxed text-[11px] md:text-[13px] px-1 whitespace-pre-wrap";

  /**
   * smartRender (Le Filtre Prestige)
   * Intercepte les données pour supprimer les badges bleus/verts du moteur par défaut.
   */
  const smartRender = (field) => {
    if (!field) return "—";

    // On préserve le rendu original uniquement pour le visuel et les composants complexes
    if (field.type === 'images' || field.type === 'image' || field.component) {
      return renderFieldValue(field);
    }

    const rawValue = currentItem[field.name];
    if (rawValue === null || rawValue === undefined || rawValue === '') return "—";

    // Transformation radicale des tableaux en texte pur " | "
    if (Array.isArray(rawValue)) {
      return rawValue.length === 0 ? "—" : rawValue.join(" | ");
    }

    // Traduction des ID en Labels pour les sélecteurs
    if (field.options) {
      const opt = field.options.find(o => String(o.value) === String(rawValue));
      return opt ? opt.label : String(rawValue);
    }

    return String(rawValue);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-auto w-full pb-20">
      
      {/* ==================================================================
          SECTION 1 : EN-TÊTE IDENTITAIRE
          ================================================================== */}
      {(activeTab === 'identity' || activeTab === 'general') && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-b border-white/5 pb-10">
          
          {/* VISUEL PRINCIPAL */}
          <div className="md:col-span-4 flex flex-col">
            <label className={labelStyle}>Archive Visuelle</label>
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20 group">
              {currentItem.image_url ? (
                <img 
                  src={currentItem.image_url} 
                  alt="Focus" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2s]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/5">
                  <LayoutGrid size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#242643]/60 to-transparent" />
            </div>
          </div>

          {/* DONNÉES D'IDENTITÉ */}
          <div className="md:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {activeTabData?.fields
                .filter(f => ['name', 'subtitle', 'ruleset_id', 'world_id'].includes(f.name))
                .map(field => (
                  <div key={field.name} className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <label className={labelStyle}>{field.label}</label>
                    <div className={field.name === 'name' ? nameValueStyle : standardValueStyle}>
                      {smartRender(field)}
                    </div>
                  </div>
                ))}
            </div>

            {/* DESCRIPTION (Sans bloc gris) */}
            {activeTabData?.fields.find(f => f.name === 'description') && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-200 border-t border-white/5 pt-8">
                <label className={labelStyle}>Description Fondamentale</label>
                <div className={loreTextStyle}>
                  {smartRender(activeTabData.fields.find(f => f.name === 'description'))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================
          SECTION 2 : GRILLE DE DONNÉES (Épurée)
          ================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
        {visibleFields.map((field, idx) => {
          const isFull = field.fullWidth || ['textarea', 'images', 'custom'].includes(field.type);
          
          return (
            <div 
              key={field.name} 
              className={`${isFull ? 'md:col-span-full' : 'md:col-span-1'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="group flex flex-col h-full">
                <label className={labelStyle}>
                  {field.label}
                </label>
                <div className={isFull && (field.type === 'textarea' || field.name.includes('desc')) ? loreTextStyle : standardValueStyle}>
                  {smartRender(field)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER DISCRET */}
      <div className="pt-16 flex items-center justify-between opacity-10 hover:opacity-40 transition-opacity">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em] text-white">
          <Info size={10} /> Registre Omniversel V4.4
        </div>
        <div className="h-[1px] flex-1 mx-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-[#2DD4BF]">
          Prestige Standard
        </div>
      </div>
    </div>
  );
}