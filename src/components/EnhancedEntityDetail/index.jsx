import React, { useState, useRef, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailTabs from './DetailTabs';
import SidebarInfo from './SidebarInfo';
import { RelationDisplay, RelationListDisplay } from './RelationDisplays';

export default function EnhancedEntityDetail({ 
  isOpen, 
  onClose, 
  item, 
  config, 
  onEdit, 
  onDelete,
  onLevelUp,
  onExportPDF,
  canEdit = true
}) {
  const [activeTab, setActiveTab] = useState(config?.tabs[0]?.id || 'identity');
  const contentRef = useRef(null);
  
  // Réinitialiser l'onglet actif à l'ouverture
  useEffect(() => {
    if (isOpen && config?.tabs?.[0]?.id) {
      setActiveTab(config.tabs[0].id);
    }
  }, [isOpen, item?.id, config]);

  if (!isOpen || !item) return null;

  const { tabs, tableName } = config;
  const gmFields = tabs.find(t => t.id === 'gm' || t.id === 'secret' || t.label.includes('MJ'))?.fields || [];
  const regularTabs = tabs.filter(t => !t.id.includes('gm') && !t.id.includes('secret') && !t.label.includes('MJ'));
  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#08090f]/95 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full h-full max-w-7xl bg-[#0f111a] sm:rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER : Regroupe désormais toutes les actions (PDF, LevelUp, Edit, Delete) */}
        <DetailHeader 
          item={item} 
          config={config} 
          onClose={onClose} 
          onLevelUp={onLevelUp}
          onExportPDF={onExportPDF}
          onEdit={canEdit ? onEdit : null}
          onDelete={onDelete}
        />

        {/* NAVIGATION DES ONGLETS */}
        <DetailTabs 
          tabs={regularTabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* CORPS DE LA FICHE */}
        <div className="flex-1 flex overflow-hidden">
          {/* Zone de contenu principal - Défilement unique ici */}
          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-10 lg:p-16 space-y-12 no-scrollbar scroll-smooth"
          >
            {activeTabData?.fields.map(field => (
              <div key={field.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[10px] font-black text-teal-500/60 uppercase tracking-[0.3em] mb-4 block ml-1">
                  {field.label}
                </label>
                <div className="bg-[#151725]/50 rounded-3xl border border-white/5 p-8 shadow-inner">
                   {field.type === 'custom' ? (
                     field.render(item[field.name], item)
                   ) : field.type === 'relation' ? (
                     <RelationDisplay tableName={field.table} id={item[field.name]} />
                   ) : field.type === 'relation-list' ? (
                     <RelationListDisplay tableName={field.table} ids={item[field.name] || []} />
                   ) : field.type === 'image' ? (
                     item[field.name] ? (
                       <img src={item[field.name]} alt={field.label} className="max-w-md rounded-2xl border border-white/10 shadow-2xl" />
                     ) : <span className="text-silver/20 italic">Aucun visuel disponible</span>
                   ) : (
                     <p className="text-soft-white text-lg leading-relaxed whitespace-pre-wrap font-medium">
                       {item[field.name] || <span className="text-silver/20 italic">—</span>}
                     </p>
                   )}
                </div>
              </div>
            ))}
          </div>

          {/* SIDEBAR D'INFORMATIONS - Cachée sur mobile, fixe sur desktop */}
          <aside className="w-[380px] border-l border-white/5 bg-[#0b0d14] p-10 overflow-y-auto hidden xl:block no-scrollbar">
             <SidebarInfo item={item} gmFields={gmFields} />
          </aside>
        </div>
      </div>
    </div>
  );
}