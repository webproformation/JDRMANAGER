import React, { useState, useEffect, useRef } from 'react';
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
  
  // États pour le menu déroulant glamour
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Pour le Portal (éviter les erreurs SSR)
  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

        const { data, error: err } = await query;
        if (err) throw err;
        setOptions(data || []);
      } catch (err) {
        console.error(`[RelationSelect] Erreur chargement ${targetTable}:`, err);
        setError("Erreur");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [targetTable, filterBy, filterValue]);

  const selectedOption = options.find(opt => opt.id === value);

  const handleOpenInfo = (e) => {
    e.stopPropagation();
    if (options.length === 0) return;
    const idx = options.findIndex(opt => opt.id === value);
    setCurrentIndex(idx !== -1 ? idx : 0);
    setShowInfo(true);
    setIsOpen(false);
  };

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + options.length) % options.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % options.length);

  const handleSelectCurrent = () => {
    if (options[currentIndex]) {
      onChange(options[currentIndex].id);
      setShowInfo(false);
    }
  };

  if (!targetTable) {
    return <div className="text-red-500 text-[10px] font-black bg-red-500/10 p-2 rounded border border-red-500/20 uppercase tracking-widest">Table manquante</div>;
  }

  // --- CONTENU DU POPUP D'INFORMATION (PORTAL) ---
  const popupContent = showInfo && options.length > 0 && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        <button type="button" onClick={handlePrev} className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:-translate-x-1 shrink-0">
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
                <img src={options[currentIndex].image_url} alt={options[currentIndex].name} className="w-full h-64 sm:h-80 object-cover object-center" />
              </div>
            )}
            <div className="text-silver text-base sm:text-lg leading-relaxed font-medium">
              {options[currentIndex].description ? (
                options[currentIndex].description.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)
              ) : (
                <span className="italic opacity-50 block text-center py-10">Aucune description disponible.</span>
              )}
            </div>
          </div>
          
          <div className="p-6 sm:p-8 border-t border-white/5 bg-[#161926] shrink-0 flex justify-center">
            {options[currentIndex].id === value ? (
              <div className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.2)] animate-pulse">
                <Crown size={28} /> Sélection Actuelle
              </div>
            ) : (
              <button type="button" onClick={handleSelectCurrent} className="flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all hover:scale-105 active:scale-95">
                <Check size={28} /> Adopter cette voie
              </button>
            )}
          </div>
        </div>

        <button type="button" onClick={handleNext} className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:translate-x-1 shrink-0">
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 w-full">
      {/* SÉLECTEUR PERSONNALISÉ GLAMOUR */}
      <div className="relative flex-1">
        <div 
          onClick={() => !loading && setIsOpen(!isOpen)}
          className={`vtt-select flex items-center justify-between cursor-pointer transition-all min-h-[38px] py-1.5 px-3 ${
            isOpen ? 'border-teal-500 shadow-[0_0_10px_rgba(45,212,191,0.15)]' : ''
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-2 truncate">
            {loading && <Loader size={12} className="animate-spin text-teal-500 shrink-0" />}
            {error && <AlertCircle size={12} className="text-red-500 shrink-0" />}
            <span className={`truncate font-bold text-xs tracking-wide ${value ? 'text-white' : 'text-silver/20'}`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
          </div>
          <ChevronDown size={14} className={`text-teal-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* MENU DÉROULANT DES RELATIONS */}
        {isOpen && options.length > 0 && (
          <div className="absolute z-[200] w-full mt-1 bg-[#0f111a] border border-white/10 rounded-lg overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-[250px] overflow-y-auto scrollbar-hide">
              {!required && (
                <div
                  onClick={() => { onChange(''); setIsOpen(false); }}
                  className="px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-silver/20 hover:bg-white/5 cursor-pointer border-b border-white/5"
                >
                  -- Aucun --
                </div>
              )}
              {options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => { onChange(opt.id); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer hover:bg-teal-500/10 hover:text-teal-400 border-b border-white/5 last:border-0 ${
                    value === opt.id ? 'bg-teal-500/20 text-teal-300' : 'text-silver/60'
                  }`}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOUTON INFO GLAMOUR */}
      {options.length > 0 && value && (
        <button 
          type="button" 
          onClick={handleOpenInfo}
          className="w-[38px] h-[38px] flex items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-white transition-all shadow-lg shrink-0"
          title="Explorer les détails"
        >
          <Info size={16} />
        </button>
      )}

      {/* RENDU DU MODAL VIA PORTAL */}
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
}