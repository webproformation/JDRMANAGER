import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ImagePicker from '../ImagePicker';

export default function ImageGalleryField({ field, value = {}, onChange }) {
  const [activeCategory, setActiveCategory] = useState(field.categories?.[0]?.id || null);

  const handleGalleryAdd = (categoryId, url) => {
    onChange({
      ...value,
      [categoryId]: [...(value[categoryId] || []), url]
    });
  };

  const handleGalleryRemove = (categoryId, indexToRemove) => {
    onChange({
      ...value,
      [categoryId]: value[categoryId]?.filter((_, i) => i !== indexToRemove) || []
    });
  };

  const labelClass = "block text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="space-y-4 mt-4 bg-black/20 p-6 rounded-2xl border border-white/5">
      <h3 className={labelClass}>{field.label}</h3>
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
        {field.categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat.id 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : 'bg-white/5 text-silver/50 hover:text-silver'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {field.categories.map(cat => {
         if (activeCategory !== cat.id) return null;
         const currentImages = value[cat.id] || [];
         return (
           <div key={cat.id} className="pt-4 space-y-4 animate-in fade-in duration-300">
              <ImagePicker 
                  value="" 
                  onChange={(url) => { if(url) handleGalleryAdd(cat.id, url); }}
                  label={`Ajouter à la galerie ${cat.label}`}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentImages.map((url, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                          <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => handleGalleryRemove(cat.id, idx)} 
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-xl"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                      </div>
                  ))}
              </div>
           </div>
         )
      })}
    </div>
  );
}