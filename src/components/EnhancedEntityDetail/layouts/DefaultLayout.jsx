import React from 'react';

export default function DefaultLayout({ config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  const visibleFields = activeTabData?.fields.filter(f => !f.isVirtual) || [];
  const labelStyle = "text-[9px] font-black text-teal-500/40 uppercase tracking-[0.25em] mb-1 block ml-1";
  const boxStyle = "bg-[#151725]/40 rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
      {visibleFields.map(field => (
        <div key={field.name} className={field.fullWidth || ['textarea', 'images', 'custom'].includes(field.type) ? 'md:col-span-full' : 'md:col-span-1'}>
          <label className={labelStyle}>{field.label}</label>
          <div className={boxStyle}>{renderFieldValue(field)}</div>
        </div>
      ))}
    </div>
  );
}