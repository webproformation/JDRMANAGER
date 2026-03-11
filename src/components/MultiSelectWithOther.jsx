import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Check, Plus, ChevronDown, X } from 'lucide-react';

export default function MultiSelectWithOther({ value, onChange, options = [], readOnly = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);

  const selectedList = value ? value.split(',').map(v => v.trim()).filter(Boolean) : [];
  const standardOptions = options.map(o => typeof o === 'string' ? o : o.value);
  const otherItems = selectedList.filter(v => !standardOptions.includes(v));
  
  const [showOther, setShowOther] = useState(otherItems.length > 0);
  const [otherText, setOtherText] = useState(otherItems.join(', '));

  // Ouvre le menu et calcule sa position exacte à l'écran
  const toggleMenu = () => {
    if (readOnly) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // On ignore le clic si c'est DANS le portal
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target) && !event.target.closest('.vtt-portal-menu')) {
        setIsOpen(false);
      }
    };
    
    // Ferme le menu si on scrolle la page (évite que le menu flotte)
    const handleScroll = (event) => {
      if (event.target.closest('.vtt-portal-menu')) return;
      if (isOpen) setIsOpen(false);
    };

    const handleResize = () => setIsOpen(false);

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // true = capture phase
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const toggleOption = (opt) => {
    if (readOnly) return;
    let newList = [...selectedList];
    if (newList.includes(opt)) {
      newList = newList.filter(item => item !== opt);
    } else {
      newList.push(opt);
    }
    onChange(newList.join(', '));
  };

  const handleOtherChange = (e) => {
    if (readOnly) return;
    const val = e.target.value;
    setOtherText(val);
    const stdSelected = selectedList.filter(v => standardOptions.includes(v));
    if (val.trim()) {
      stdSelected.push(val.trim());
    }
    onChange(stdSelected.join(', '));
  };

  const toggleOtherAction = () => {
    if (readOnly) return;
    if (showOther) {
      setOtherText('');
      const stdSelected = selectedList.filter(v => standardOptions.includes(v));
      onChange(stdSelected.join(', '));
    }
    setShowOther(!showOther);
  };

  const handleRemoveTag = (e, item) => {
    e.stopPropagation();
    if (readOnly) return;
    
    if (standardOptions.includes(item)) {
      toggleOption(item);
    } else {
      const newOthers = otherItems.filter(i => i !== item);
      setOtherText(newOthers.join(', '));
      const stdSelected = selectedList.filter(v => standardOptions.includes(v));
      const combined = [...stdSelected, ...newOthers].filter(Boolean);
      onChange(combined.join(', '));
      if (newOthers.length === 0) setShowOther(false);
    }
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* BARRE DE SÉLECTION (TAGS) */}
      <div 
        onClick={toggleMenu}
        className={`w-full min-h-[44px] bg-[#151725]/90 border ${isOpen ? 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : 'border-white/10 hover:border-white/20'} rounded-xl px-3 py-2 flex flex-wrap items-center gap-2 transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {selectedList.length === 0 ? (
          <span className="text-silver/30 text-[12px] italic select-none ml-1">Sélectionner les options...</span>
        ) : (
          selectedList.map((item, idx) => (
            <span key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-black ${standardOptions.includes(item) ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
              {item}
              {!readOnly && (
                <X size={12} className="hover:text-white cursor-pointer transition-colors" onClick={(e) => handleRemoveTag(e, item)} />
              )}
            </span>
          ))
        )}
        {!readOnly && <ChevronDown size={14} className={`ml-auto text-silver/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-400' : ''}`} />}
      </div>

      {/* PORTAL : TÉLÉPORTATION DU MENU HORS DE LA GRILLE */}
      {isOpen && !readOnly && createPortal(
        <div 
          className="vtt-portal-menu fixed z-[999999] bg-[#1a1d2d] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 no-scrollbar animate-in fade-in zoom-in-95 duration-200"
          style={{
            top: `${coords.top + 8}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            maxHeight: '280px',
            overflowY: 'auto'
          }}
        >
          {options.map((optObj, idx) => {
            const optValue = typeof optObj === 'string' ? optObj : optObj.value;
            const optLabel = typeof optObj === 'string' ? optObj : optObj.label;
            const isChecked = selectedList.includes(optValue);
            
            return (
              <div
                key={idx}
                onClick={() => toggleOption(optValue)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/5 ${isChecked ? 'text-teal-400 bg-teal-500/5' : 'text-silver/80'}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-teal-500 border-teal-500' : 'border-white/20 bg-black/20'}`}>
                  {isChecked && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
                <span className="text-[13px] font-medium">{optLabel}</span>
              </div>
            );
          })}
          
          <div
            onClick={toggleOtherAction}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 border-t border-white/5 mt-1 pt-3 ${showOther ? 'text-blue-400 bg-blue-500/5' : 'text-silver/80'}`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${showOther ? 'bg-blue-500 border-blue-500' : 'border-white/20 bg-black/20'}`}>
              {showOther ? <Check size={12} className="text-white" strokeWidth={4} /> : <Plus size={12} />}
            </div>
            <span className="text-[13px] font-medium tracking-wide">Ajouter une option personnalisée...</span>
          </div>
        </div>,
        document.body
      )}

      {/* CHAMP TEXTE (Lui reste dans la grille) */}
      {showOther && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            readOnly={readOnly}
            value={otherText}
            onChange={handleOtherChange}
            placeholder="Écrivez votre propre texte (séparez par des virgules)..."
            className="w-full bg-[#151725] border border-blue-500/50 rounded-xl px-4 py-2.5 text-[13px] text-blue-100 font-normal focus:border-blue-400 outline-none shadow-inner"
          />
        </div>
      )}
    </div>
  );
}