import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
  
  useEffect(() => {
    if (isOpen && config?.tabs?.[0]?.id) setActiveTab(config.tabs[0].id);
  }, [isOpen, item?.id, config]);

  if (!isOpen || !item) return null;

  const { tabs } = config;
  const gmFields = tabs.find(t => t.id === 'gm' || t.id === 'secret' || t.label.includes('MJ'))?.fields || [];
  const regularTabs = tabs.filter(t => !t.id.includes('gm') && !t.id.includes('secret') && !t.label.includes('MJ'));
  const activeTabData = tabs.find(t => t.id === activeTab);

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 400;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#08090f]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative w-full h-full max-w-7xl bg-[#0f111a] sm:rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        
        <DetailHeader 
          item={item} 
          config={config} 
          onClose={onClose} 
          onLevelUp={onLevelUp} 
          onExportPDF={onExportPDF} 
          onEdit={canEdit ? onEdit : null} 
          onDelete={onDelete} 
        />

        <DetailTabs tabs={regularTabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex overflow-hidden relative">
          {/* NAVIGATION VERTICALE REGROUPÉE À DROITE */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
             <button onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
             <button onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
          </div>

          <div ref={contentRef} className="flex-1 overflow-y-auto p-10 lg:p-16 space-y-12 no-scrollbar scroll-smooth">
            {activeTabData?.fields.map(field => (
              <div key={field.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[10px] font-black text-teal-500/60 uppercase tracking-[0.3em] mb-4 block ml-1">{field.label}</label>
                <div className="bg-[#151725]/50 rounded-3xl border border-white/5 p-8 shadow-inner">
                   {field.type === 'custom' ? field.render(item[field.name], item) : (
                     <p className="text-soft-white text-lg leading-relaxed whitespace-pre-wrap font-medium">{item[field.name] || <span className="text-silver/20 italic">—</span>}</p>
                   )}
                </div>
              </div>
            ))}
          </div>

          <aside className="w-[400px] border-l border-white/5 bg-[#0f111a] p-10 overflow-y-auto hidden xl:block no-scrollbar">
             <SidebarInfo item={item} gmFields={gmFields} />
          </aside>
        </div>
      </div>
    </div>
  );
}