import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function VTTSelect({ 
  value, 
  options = [], 
  onChange, 
  placeholder = "Sélectionner...", 
  readOnly = false,
  required = false,
  zIndex = "z-[80]"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value || opt.value == value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (readOnly) {
    return (
      <div className="h-7 py-0 px-2 border border-white/5 rounded-md bg-white/5 flex items-center">
        <span className="text-[10px] font-normal text-white/70">
          {selectedOption ? selectedOption.label : (value || '---')}
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <div 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`vtt-select flex items-center justify-between cursor-pointer transition-all h-7 px-2 border border-white/10 rounded-md bg-[#08090f] hover:border-teal-500/50 ${
          isOpen ? 'border-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.1)]' : ''
        }`}
      >
        <span className={`truncate text-[10px] font-medium tracking-wide ${value ? 'text-white' : 'text-white/20'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={10} className={`text-teal-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute ${zIndex} w-full mt-0.5 bg-[#0f111a] border border-white/10 rounded-md overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200`}>
          <div className="max-h-[180px] overflow-y-auto scrollbar-hide">
            {!required && (
              <div
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white/10 hover:bg-white/5 cursor-pointer border-b border-white/5"
              >
                -- Reset --
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onChange(opt.value); 
                  setIsOpen(false); 
                }}
                className={`px-2 py-1.5 text-[10px] font-medium transition-all cursor-pointer hover:bg-teal-500/10 hover:text-teal-400 border-b border-white/5 last:border-0 ${
                  value === opt.value ? 'bg-teal-500/10 text-teal-300' : 'text-white/50'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}