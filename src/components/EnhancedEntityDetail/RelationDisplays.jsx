import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { Info, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Affiche le nom au lieu de l'ID pour les relations UNIQUES ---
export const RelationDisplay = ({ tableName, id }) => {
  const [item, setItem] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id || !tableName) return;

    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setItem(data);
      } catch (err) {
        console.error("Erreur relation:", err);
      }
    };

    fetchItem();
  }, [tableName, id]);

  if (!item) return <span className="text-silver/50 italic">—</span>;

  const popupContent = showInfo && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
               <Info className="text-teal-400 shrink-0" size={28} /> 
               <span className="truncate">{item.name}</span>
             </h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all shrink-0"><X size={24} /></button>
          </div>
          
          <div className="p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 flex-1 bg-[#0f111a]">
            {item.image_url && (
              <div className="mb-8 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/20 shrink-0 shadow-2xl">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-64 sm:h-80 object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            <div className="text-silver text-base sm:text-lg leading-relaxed font-medium">
              {item.description ? (
                item.description.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line}</p>
                ))
              ) : (
                <span className="italic opacity-50 block text-center py-10">Aucune description disponible dans les archives.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <span 
        onClick={() => setShowInfo(true)} 
        className="inline-flex items-center gap-2 text-teal-400 font-bold hover:underline hover:text-teal-300 cursor-pointer transition-colors"
      >
        {item.name}
        <Info size={14} className="opacity-60" />
      </span>
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </>
  );
};

// --- Liste de badges pour les relations MULTIPLES ---
export const RelationListDisplay = ({ tableName, ids = [] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showInfo, setShowInfo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .in('id', ids)
          .order('name');

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Erreur list relation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [tableName, ids]);

  const handleOpenInfo = (idx) => {
    setCurrentIndex(idx);
    setShowInfo(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (loading) return <span className="text-xs text-silver/50 italic">Incantation...</span>;
  if (items.length === 0) return <span className="text-xs text-silver/50 italic">—</span>;

  const popupContent = showInfo && items.length > 0 && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-8">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowInfo(false)} />
      
      <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-6 w-full max-w-[1100px] animate-in zoom-in-95 duration-300">
        
        {items.length > 1 && (
          <button 
            type="button" 
            onClick={handlePrev} 
            className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:-translate-x-1 shrink-0"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        <div className="relative w-full max-w-3xl bg-[#0f111a] border border-teal-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-6 sm:p-8 border-b border-white/5 flex justify-between items-center bg-[#161926] shrink-0">
             <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-[0.2em] flex items-center gap-4">
               <Info className="text-teal-400 shrink-0" size={28} /> 
               <span className="truncate">{items[currentIndex].name}</span>
             </h3>
             <button onClick={() => setShowInfo(false)} className="p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all shrink-0"><X size={24} /></button>
          </div>
          
          <div className="p-6 sm:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/30 flex-1 bg-[#0f111a]">
            {items[currentIndex].image_url && (
              <div className="mb-8 w-full rounded-3xl overflow-hidden border border-white/10 bg-black/20 shrink-0 shadow-2xl">
                <img 
                  src={items[currentIndex].image_url} 
                  alt={items[currentIndex].name} 
                  className="w-full h-64 sm:h-80 object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            <div className="text-silver text-base sm:text-lg leading-relaxed font-medium">
              {items[currentIndex].description ? (
                items[currentIndex].description.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line}</p>
                ))
              ) : (
                <span className="italic opacity-50 block text-center py-10">Aucune description disponible.</span>
              )}
            </div>
          </div>
        </div>

        {items.length > 1 && (
          <button 
            type="button" 
            onClick={handleNext} 
            className="p-3 sm:p-5 bg-[#1a1d2d] hover:bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30 shadow-2xl transition-all hover:translate-x-1 shrink-0"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, idx) => (
        <span 
          key={it.id} 
          onClick={() => handleOpenInfo(idx)}
          className="group px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/50 rounded-lg text-xs font-bold text-teal-300 uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2"
        >
          {it.name}
          <Info size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
        </span>
      ))}
      {mounted && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
};