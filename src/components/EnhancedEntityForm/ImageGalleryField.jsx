import React, { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import ImagePicker from '../ImagePicker';

export default function ImageGalleryField({ field, value = {}, onChange }) {
  const categories = field.categories || [];
  const defaultCatId = categories[0]?.id || 'default';
  
  // CRÉATION DE L'ONGLET "TOUTES" EN PREMIÈRE POSITION
  const displayCategories = [{ id: 'all', label: 'Toutes' }, ...categories];
  const [activeCategory, setActiveCategory] = useState('all');

  // --- LE SYSTÈME DE SAUVETAGE DES IMAGES ORPHELINES ---
  const safeValue = useMemo(() => {
    let raw = value;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch (e) { raw = {}; }
    }
    
    let processed = {};
    const knownCatIds = categories.map(c => c.id);

    if (Array.isArray(raw)) {
      processed[defaultCatId] = raw;
    } else if (raw && typeof raw === 'object') {
      Object.keys(raw).forEach(key => {
        const arr = Array.isArray(raw[key]) ? raw[key] : [];
        if (knownCatIds.includes(key)) {
          processed[key] = [...(processed[key] || []), ...arr];
        } else {
          processed[defaultCatId] = [...(processed[defaultCatId] || []), ...arr];
        }
      });
    }
    
    const cleanProcessed = {};
    knownCatIds.forEach(catId => {
      const arr = processed[catId] || [];
      cleanProcessed[catId] = arr.filter(url => 
        url && 
        typeof url === 'string' && 
        url.trim() !== '' && 
        url.trim() !== 'null' && 
        !url.endsWith('undefined') && 
        !url.endsWith('null')
      );
    });
    
    return cleanProcessed;
  }, [value, categories, defaultCatId]);

  const handleGalleryAdd = (categoryId, url) => {
    onChange({
      ...safeValue,
      [categoryId]: [...(safeValue[categoryId] || []), url]
    });
  };

  const handleGalleryRemove = (categoryId, urlToRemove) => {
    const currentList = safeValue[categoryId] || [];
    onChange({
      ...safeValue,
      [categoryId]: currentList.filter(url => url !== urlToRemove)
    });
  };

  const labelClass = "block text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-2 ml-1";

  // Préparation de l'ensemble des images pour l'onglet "Toutes"
  const allImages = categories.flatMap(cat => 
    (safeValue[cat.id] || []).map(url => ({ url, categoryId: cat.id, categoryLabel: cat.label }))
  );

  return (
    <div className="space-y-4 mt-4 bg-black/20 p-6 rounded-2xl border border-white/5" onClick={(e) => e.stopPropagation()}>
      <h3 className={labelClass}>{field.label}</h3>
      
      {/* ONGLETS DES CATÉGORIES */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
        {displayCategories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveCategory(cat.id);
            }}
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

      {/* CONTENU DE LA GALERIE */}
      <div className="pt-4 space-y-4 animate-in fade-in duration-300" onClick={(e) => e.stopPropagation()}>
        
        {activeCategory === 'all' ? (
          // VUE "TOUTES"
          <>
            {allImages.length === 0 ? (
              <p className="text-[11px] text-silver/40 italic">Aucune image dans la galerie.</p>
            ) : (
              <>
                <p className="text-[10px] text-teal-500/50 italic mb-4">
                  Sélectionnez une catégorie spécifique ci-dessus pour ajouter de nouvelles images.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allImages.map((img, idx) => (
                    <div key={`${idx}-${img.url}`} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                      <img 
                        src={img.url} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        alt="" 
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                      />
                      {/* Badge indiquant la catégorie */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-[8px] uppercase tracking-widest rounded-md border border-white/10">
                        {img.categoryLabel}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleGalleryRemove(img.categoryId, img.url); }} 
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-xl"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // VUE PAR CATÉGORIE SPÉCIFIQUE
          <>
            <ImagePicker 
                value="" 
                onChange={(url) => { if(url) handleGalleryAdd(activeCategory, url); }}
                label={`Ajouter à la galerie ${categories.find(c => c.id === activeCategory)?.label}`}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(safeValue[activeCategory] || []).map((url, idx) => (
                    <div key={`${idx}-${url}`} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <img 
                          src={url} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                          alt="" 
                          onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); handleGalleryRemove(activeCategory, url); }} 
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-xl"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}