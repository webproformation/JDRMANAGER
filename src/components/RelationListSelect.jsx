import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Minus, Info, X, ChevronLeft, ChevronRight, Crown, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RelationListSelect({ table, tableName, value = [], onChange, filterBy, filterValue }) {
  // Sécurité : On accepte les deux noms de props
  const targetTable = table || tableName;

  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!targetTable) return;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        let query = supabase.from(targetTable).select('*');
        if (filterBy && filterValue) query = query.eq(filterBy, filterValue);
        const { data, error } = await query.order('name');
        if (error) throw error;
        setOptions(data || []);
      } catch (err) { 
        console.error("Erreur Liste:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchOptions();
  }, [targetTable, filterBy, filterValue]);

  const toggleItem = (id) => {
    const newValue = value.includes(id) ? value.filter(i => i !== id) : [...value, id];
    onChange(newValue);
  };

  const handleOpenInfo = (idToOpen) => {
    if (options.length === 0) return;
    let idx = 0;
    if (idToOpen) {
      idx = options.findIndex(opt => opt.id === idToOpen);
    } else if (value.length > 0) {
      idx = options.findIndex(opt => opt.id === value[0]);
    }
    setCurrentIndex(idx !== -1 ? idx : 0);
    setShowInfo(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + options.length) % options.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % options.length);
  };

  const filteredOptions = options.filter(opt => 
    !value.includes(opt.id) && 
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const popupContent = showInfo && options.length > 0 && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        
        <button 
          type="button" 
          onClick={handlePrev} 
          className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:-translate-x-1 shrink-0"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
               <Info className="text-teal-400 shrink-0" size={28} /> 
               <span className="truncate">{options[currentIndex].name}</span>
             </h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all shrink-0"><X size={24} /></button>
          </div>
          
          <div className="p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 flex-1 bg-[#0f111a]">
            {options[currentIndex].image_url && (
              <div className="mb-8 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/20 shrink-0 shadow-2xl">
                <img 
                  src={options[currentIndex].image_url} 
                  alt={options[currentIndex].name} 
                  className="w-full h-64 sm:h-80 object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            <div className="text-silver text-base sm:text-lg leading-relaxed font-medium">
              {options[currentIndex].description ? (
                options[currentIndex].description.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line}</p>
                ))
              ) : (
                <span className="italic opacity-50 block text-center py-10">Aucune description disponible.</span>
              )}
            </div>
          </div>
          
          <div className="p-6 sm:p-8 border-t border-white/5 bg-[#161926] shrink-0 flex justify-center">
            {value.includes(options[currentIndex].id) ? (
              <button 
                type="button"
                onClick={() => toggleItem(options[currentIndex].id)}
                className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-500/20 hover:bg-red-500/20 border border-teal-500/50 hover:border-red-500/50 text-teal-300 hover:text-red-400 rounded-2xl font-black uppercase tracking-widest transition-all group text-xs sm:text-base"
              >
                <Crown size={28} className="text-teal-400 group-hover:hidden shrink-0" />
                <Minus size={28} className="hidden group-hover:block text-red-400 shrink-0" />
                <span className="group-hover:hidden">Déjà dans votre liste</span>
                <span className="hidden group-hover:inline">Retirer de la liste</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => toggleItem(options[currentIndex].id)}
                className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all hover:scale-105 active:scale-95 text-xs sm:text-base"
              >
                <Plus size={28} className="shrink-0" />
                Ajouter à la liste
              </button>
            )}
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleNext} 
          className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:translate-x-1 shrink-0"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {value.length === 0 && <span className="text-silver/40 text-xs italic">Aucun élément sélectionné.</span>}
        {value.map(id => {
          const itemInfo = options.find(o => o.id === id);
          if (!itemInfo) return null;
          return (
            <div key={id} className="flex items-center gap-2 px-3 py-1.5 bg-teal-900/40 border border-teal-500/30 text-teal-300 rounded-lg text-sm font-medium shadow-lg animate-in fade-in zoom-in">
              <span>{itemInfo.name}</span>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); handleOpenInfo(itemInfo.id); }}
                className="p-1 hover:bg-white/10 rounded transition-colors text-teal-200 ml-1"
                title="Détails"
              >
                <Info size={14} />
              </button>
              <button 
                type="button"
                onClick={() => toggleItem(id)}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors ml-1"
                title="Retirer"
              >
                <Minus size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="flex items-center bg-[#151725] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500/30 focus-within:border-teal-500/50 transition-all shadow-inner">
          <Search size={18} className="text-silver/40 mr-3" />
          <input 
            type="text" 
            placeholder="Rechercher pour ajouter..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-silver/20"
          />
        </div>

        {search && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a1d2d] border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-silver/40 text-xs italic">Aucun résultat trouvé.</div>
            ) : (
              filteredOptions.map(opt => (
                <div key={opt.id} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0 hover:bg-teal-500/10 transition-colors group">
                  <span className="text-silver group-hover:text-white transition-colors">{opt.name}</span>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => handleOpenInfo(opt.id)}
                      className="p-1.5 text-silver/50 hover:text-teal-400 bg-white/5 hover:bg-teal-500/20 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Info size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => toggleItem(opt.id)}
                      className="p-1.5 text-silver/50 hover:text-white bg-white/5 hover:bg-white/20 rounded-md transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
}