import React from 'react';
import FieldRenderer from '../FieldRenderer';

export default function DefaultForm({ formData, activeTab, handleChange, setFormData, config }) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  const gridClass = currentTab?.columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  const colSpanClass = currentTab?.columns === 3 ? 'md:col-span-3' : 'md:col-span-2';

  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-x-12 gap-y-10 animate-in fade-in duration-500`}>
      {currentTab?.fields?.map(field => {
        const isFull = field.fullWidth || (['textarea', 'custom', 'relation-list', 'images'].includes(field.type) && field.fullWidth !== false);
        return (
          <div key={field.name} className={isFull ? colSpanClass : "md:col-span-1"}>
            <FieldRenderer field={field} formData={formData} handleChange={handleChange} setFormData={setFormData} onFullChange={(newFull) => setFormData(newFull)} />
          </div>
        );
      })}
    </div>
  );
}