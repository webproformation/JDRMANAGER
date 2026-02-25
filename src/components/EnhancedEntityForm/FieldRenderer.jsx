import React from 'react';
import RelationListSelect from '../RelationListSelect';
import AutoResizingTextarea from '../AutoResizingTextarea';
import StaticSelect from '../StaticSelect';
import RelationSelect from '../RelationSelect';
import ImagePicker from '../ImagePicker';
import ImageGalleryField from './ImageGalleryField';

export default function FieldRenderer({ field, formData, handleChange }) {
  const value = formData[field.name];
  const inputClass = "w-full bg-[#151725] border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all placeholder-silver/20 outline-none shadow-inner";
  const labelClass = "block text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2 ml-1";

  switch (field.type) {
    case 'relation-list':
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label}</label>
          <RelationListSelect 
             table={field.table} 
             value={value || []} 
             onChange={(newList) => handleChange(field.name, newList)}
             filterBy={field.filterBy}
             filterValue={field.filterValue ? formData[field.filterValue] : undefined}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <AutoResizingTextarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        </div>
      );

    case 'select':
    case 'static-select':
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <StaticSelect 
            options={field.options} 
            value={value} 
            onChange={(val) => handleChange(field.name, val)} 
            placeholder={field.placeholder} 
          />
        </div>
      );

    case 'relation':
      if (!field.table) return null;
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <RelationSelect 
              tableName={field.table} 
              value={value} 
              onChange={(val) => handleChange(field.name, val)} 
              placeholder={field.placeholder} 
              filterBy={field.filterBy} 
              filterValue={field.filterValue ? formData[field.filterValue] : undefined} 
              required={field.required}
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label}</label>
          <ImagePicker 
            value={value || ''} 
            onChange={(url) => handleChange(field.name, url)} 
            folder={field.bucket || 'images'} 
            label={null} 
          />
        </div>
      );

    case 'images':
      return (
        <ImageGalleryField 
          field={field} 
          value={value} 
          onChange={(newVal) => handleChange(field.name, newVal)} 
        />
      );

    case 'custom':
    case 'stats-editor':
      const Component = field.component;
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label}</label>
          <Component 
            value={value} 
            onChange={(newVal) => handleChange(field.name, newVal)}
            formData={formData} 
            {...field.props} 
          />
        </div>
      );

    default:
      return (
        <div className="space-y-1">
          <label className={labelClass}>{field.label} {field.required && '*'}</label>
          <input
            type={field.type === 'number' ? 'number' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
            required={field.required}
          />
        </div>
      );
  }
}