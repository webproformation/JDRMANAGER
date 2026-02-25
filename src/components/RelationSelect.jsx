// src/components/RelationSelect.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, AlertCircle, Loader, Info, X, ChevronLeft, ChevronRight, Crown, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RelationSelect({ 
  table,      
  tableName,  
  value, 
  onChange, 
  placeholder = "Sélectionner...", 
  filterBy, 
  filterValue,
  required
}) {
  const targetTable = table || tableName;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Pour le Portal (éviter les erreurs SSR de Next.js/Vite)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!targetTable) return;

    if (filterBy && !filterValue) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from(targetTable)
          .select('*')
          .order('name', { ascending: true });

        if (filterBy && filterValue) {
          query = query.eq(filterBy, filterValue);
        }

        const { data, err } = await query;

        if (err) throw err;
        setOptions(data || []);
      } catch (err) {
        console.error(`[RelationSelect] Erreur chargement ${targetTable}:`, err);
        setError("Erreur chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [targetTable, filterBy, filterValue]);

  const handleOpenInfo = () => {
    if (options.length === 0) return;
    const idx = options.findIndex(opt => opt.id === value);
    setCurrentIndex(idx !== -1 ? idx : 0);
    setShowInfo(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + options.length) % options.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % options.length);
  };

  const handleSelectCurrent = () => {
    if (options[currentIndex]) {
      onChange(options[currentIndex].id);
      setShowInfo(false); // On ferme automatiquement le popup après la sélection
    }
  };

  if (!targetTable) {
    return <div className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded">Paramètre `table` manquant.</div>;
  }

  const popupContent = showInfo && options.length > 0 && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      
      {/* Conteneur Flex pour coller les flèches au cadre */}
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
                <span className="italic opacity-50 block text-center py-10">Aucune description disponible dans les archives.</span>
              )}
            </div>
          </div>
          
          <div className="p-6 sm:p-8 border-t border-white/5 bg-[#161926] shrink-0 flex justify-center">
            {options[currentIndex].id === value ? (
              <div className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.2)] animate-pulse text-xs sm:text-base">
                <Crown size={28} />
                Sélection Actuelle
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleSelectCurrent}
                className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all hover:scale-105 active:scale-95 text-xs sm:text-base"
              >
                <Check size={28} />
                Adopter cette voie
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
    <div className="relative flex items-center gap-3">
      <div className="relative flex-1">
        <select 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-[#151725] border border-white/10 rounded-xl p-4 pr-12 text-white focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all appearance-none cursor-pointer outline-none shadow-inner text-sm"
        >
          <option value="" disabled className="text-silver/50 bg-[#0f111a]">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id} className="bg-[#151725] text-white">
              {opt.name}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-silver/40">
          {loading && <Loader size={16} className="animate-spin text-teal-500" />}
          {error && <AlertCircle size={16} className="text-red-500" />}
          {!loading && !error && <ChevronDown size={16} />}
        </div>
      </div>

      {options.length > 0 && (
        <button 
          type="button" 
          onClick={handleOpenInfo}
          className="p-4 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-white transition-all shadow-lg shrink-0"
          title="Parcourir le grimoire"
        >
          <Info size={20} />
        </button>
      )}

      {/* Rendu via Portal pour s'échapper du contexte d'empilement (z-index) */}
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
}