import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { generateCharacterData } from '../../utils/rulesEngine';

import FormHeader from './FormHeader';
import TabsNavigation from './TabsNavigation';
import FieldRenderer from './FieldRenderer';

export default function EnhancedEntityForm({
  isOpen,
  onClose,
  onSuccess,
  item = null,
  config
}) {
  const { tableName, tabs } = config;

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'identity');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
      } else {
        const initialData = { level: 1, experience: 0, ruleset_id: 'dnd5', character_type: 'PJ' };
        tabs.forEach(tab => tab.fields.forEach(field => {
          if (field.defaultValue !== undefined) initialData[field.name] = field.defaultValue;
        }));
        setFormData(initialData);
      }
      setActiveTab(tabs[0]?.id || 'identity');
    }
  }, [isOpen, item, tabs]);

  if (!isOpen) return null;

  const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleAutoGenerate = () => {
    const generated = generateCharacterData(formData.ruleset_id || 'dnd5');
    setFormData(prev => ({ ...prev, ...generated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = { ...formData, updated_at: new Date().toISOString() };
      config.tabs.forEach(t => t.fields.forEach(f => { if(f.isVirtual) delete payload[f.name]; }));
      if (item) {
        const { error: err } = await supabase.from(tableName).update(payload).eq('id', item.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from(tableName).insert([{ ...payload, created_by: user?.id }]);
        if (err) throw err;
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[#08090f]/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full h-full max-w-7xl bg-[#0f111a] sm:rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        <FormHeader 
          config={config} 
          formData={formData} 
          item={item} 
          onAutoGenerate={handleAutoGenerate} 
          onClose={onClose} 
          loading={loading} 
        />

        <TabsNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <div className="flex-1 flex overflow-hidden relative">
          {/* NAVIGATION VERTICALE REGROUPÉE À DROITE - HORS DU FLUX DE SCROLL */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
             <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
             <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-teal-500/20 text-silver/40 hover:text-teal-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
          </div>

          <div 
            ref={contentRef}
            className="flex-1 overflow-y-auto p-10 lg:p-16 no-scrollbar scroll-smooth"
          >
             <form id="entity-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {activeTabData?.fields.map(field => (
                    <div key={field.name} className={field.type === 'textarea' || field.type === 'custom' || field.fullWidth ? "md:col-span-2" : ""}>
                      <FieldRenderer 
                        field={field} 
                        formData={formData} 
                        handleChange={handleChange} 
                        setFormData={setFormData} 
                        onFullChange={(newFull) => setFormData(newFull)} 
                      />
                    </div>
                  ))}
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
}