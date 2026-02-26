import React, { useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';
import DetailHeader from './DetailHeader';
import DetailTabs from './DetailTabs';
import SidebarInfo from './SidebarInfo';
import { RelationDisplay, RelationListDisplay } from './RelationDisplays';
import { supabase } from '../../lib/supabase'; 

export default function EnhancedEntityDetail({ 
  isOpen, 
  onClose, 
  item, 
  config, 
  onEdit, 
  onDelete,
  onLevelUp,     // NOUVEAU
  onExportPDF,   // NOUVEAU
  canEdit = true
}) {
  const [activeTab, setActiveTab] = useState(config?.tabs[0]?.id || 'identity');
  const contentRef = useRef(null);
  
  if (!isOpen || !item) return null;

  const { tabs, tableName } = config;
  const gmFields = tabs.find(t => t.id === 'gm' || t.id === 'secret' || t.label.includes('MJ'))?.fields || [];
  const regularTabs = tabs.filter(t => !t.id.includes('gm') && !t.id.includes('secret') && !t.label.includes('MJ'));
  const firstTabId = config.tabs[0]?.id;

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 300;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(item);
    } else {
      const isConfirmed = window.confirm(`Voulez-vous vraiment supprimer ${item.name} ? Cette action est irréversible.`);
      if (isConfirmed) {
        try {
          const { error } = await supabase.from(tableName).delete().eq('id', item.id);
          if (error) throw error;
          onClose();
          window.location.reload(); 
        } catch (err) {
          console.error("Erreur de suppression autonome:", err);
          alert("Une erreur est survenue lors de la suppression.");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[90vh] flex flex-col pointer-events-none">
        
        <div className="hidden lg:flex absolute -right-24 top-1/2 -translate-y-1/2 flex-col gap-4 z-[60] pointer-events-auto">
            <button type="button" onClick={() => scrollContent('up')} className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
               <ChevronUp size={32} />
            </button>
            <button type="button" onClick={() => scrollContent('down')} className="p-4 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:translate-y-1 cursor-pointer">
               <ChevronDown size={32} />
            </button>
        </div>

        <div className="relative w-full h-full bg-[#0f111a] rounded-[2.5rem] flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95 pointer-events-auto shadow-2xl shadow-black">
          
          {/* TRANSMISSION DES FONCTIONS ICI */}
          <DetailHeader 
            item={item} 
            config={config} 
            onClose={onClose} 
            onLevelUp={onLevelUp}
            onExportPDF={onExportPDF}
          />

          <DetailTabs 
            tabs={regularTabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          <div className="relative flex-1 bg-[#0f111a] min-h-0 w-full overflow-hidden">
             <div ref={contentRef} className="absolute inset-0 overflow-y-auto scroll-smooth p-10 pb-40 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
                   
                   <div className="lg:col-span-8 space-y-12">
                      {activeTab === firstTabId && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Chroniques</h2>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            <p className="text-silver/80 text-lg leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:text-teal-500 first-letter:mr-2 first-letter:float-left first-letter:mt-1">
                              {item.description || "L'histoire attend d'être forgée par vos actes."}
                            </p>
                          </div>
                        </section>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {tabs.find(t => t.id === activeTab)?.fields.map(field => {
                          if (['image_url', 'name', 'description'].includes(field.name)) return null;
                          
                          const value = item[field.name];
                          if (value === undefined || value === null || value === '') return null;

                          const isFullWidth = ['stats-editor', 'custom', 'relation-list', 'textarea', 'images'].includes(field.type) || field.name === 'data';

                          return (
                            <div key={field.name} className={`group border-l-2 border-white/5 pl-8 hover:border-teal-500/30 transition-all ${isFullWidth ? 'md:col-span-2' : 'md:col-span-1'}`}>
                              <label className="text-[10px] font-black text-silver/40 uppercase tracking-[0.3em] block mb-2 group-hover:text-teal-400 transition-colors">
                                {field.label}
                              </label>
                              <div className="text-silver text-lg font-medium leading-relaxed">
                                {field.type === 'relation' ? (
                                  <RelationDisplay tableName={field.table} id={value} />
                                ) : field.type === 'relation-list' ? (
                                  <RelationListDisplay tableName={field.table} ids={value} />
                                ) : (field.type === 'stats-editor' || field.type === 'custom') ? (
                                  <div className="bg-black/40 rounded-[2rem] p-8 mt-4 border border-white/5 shadow-inner pointer-events-none">
                                     {field.component ? (
                                        <field.component value={value} formData={item} onChange={() => {}} {...field.props} />
                                     ) : (
                                        <div className="text-silver/50 italic">Composant non défini.</div>
                                     )}
                                  </div>
                                ) : typeof value === 'object' ? (
                                  <div className="bg-black/20 p-4 rounded-xl text-xs italic text-silver/40">
                                    Données complexes enregistrées.
                                  </div>
                                ) : (
                                  <span className="whitespace-pre-wrap">{value}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-10">
                      <SidebarInfo item={item} gmFields={gmFields} />
                   </div>

                </div>
             </div>
             
             {canEdit && (
               <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#0f111a] via-[#0f111a] to-transparent pointer-events-none flex justify-end z-20">
                  <div className="pointer-events-auto flex gap-4 items-center animate-in slide-in-from-bottom-4">
                    <button 
                      onClick={handleDelete} 
                      className="p-4 bg-red-500/10 hover:bg-red-500/30 backdrop-blur-md rounded-2xl text-red-400 border border-red-500/30 transition-all hover:scale-110 active:scale-95 shadow-xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px]"
                      title="Supprimer cette archive"
                    >
                      <Trash2 size={18} />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                    {onEdit && (
                      <button 
                        onClick={onEdit} 
                        className="p-4 bg-teal-500/10 hover:bg-teal-500/30 backdrop-blur-md rounded-2xl text-teal-400 border border-teal-500/30 transition-all hover:scale-110 active:scale-95 shadow-xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px]"
                        title="Modifier cette archive"
                      >
                        <Edit size={18} />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                    )}
                  </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
}