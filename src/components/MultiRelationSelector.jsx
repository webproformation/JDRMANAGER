import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Check, ChevronDown, X } from 'lucide-react';

export default function MultiRelationSelector({ value, onChange, readOnly = false, table }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);

  const selectedList = value ? value.split(',').map(v => v.trim()).filter(Boolean) : [];

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from(table)
        .select('name')
        .order('name', { ascending: true });
      
      if (!error && data) setItems(data.map(d => d.name));
      setLoading(false);
    };
    if (table) fetchItems();
  }, [table]);

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
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target) && !event.target.closest('.vtt-portal-menu')) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = (event) => {
      if (event.target.closest('.vtt-portal-menu')) return;
      if (isOpen) setIsOpen(false);
    };

    const handleResize = () => setIsOpen(false);

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const toggleItem = (itemName) => {
    if (readOnly) return;
    let newList = [...selectedList];
    if (newList.includes(itemName)) {
      newList = newList.filter(i => i !== itemName);
    } else {
      newList.push(itemName);
    }
    onChange(newList.join(', '));
  };

  const removeItem = (e, itemName) => {
    e.stopPropagation();
    if (!readOnly) toggleItem(itemName);
  };

  if (loading) return <div className="text-silver/40 text-[10px] uppercase flex items-center gap-2 p-2"><Loader2 size={12} className="animate-spin" /> Chargement...</div>;

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* BARRE DE SÉLECTION (TAGS) */}
      <div 
        onClick={toggleMenu}
        className={`w-full min-h-[44px] bg-[#151725]/90 border ${isOpen ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/10 hover:border-white/20'} rounded-xl px-3 py-2 flex flex-wrap items-center gap-2 transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {selectedList.length === 0 ? (
          <span className="text-silver/30 text-[12px] italic select-none ml-1">Lier à {table}...</span>
        ) : (
          selectedList.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-[10px] uppercase tracking-wider font-black">
              {item}
              {!readOnly && (
                <X size={12} className="hover:text-white cursor-pointer transition-colors" onClick={(e) => removeItem(e, item)} />
              )}
            </span>
          ))
        )}
        {!readOnly && <ChevronDown size={14} className={`ml-auto text-silver/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />}
      </div>

      {/* PORTAL : TÉLÉPORTATION */}
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
          {items.length === 0 ? (
            <div className="px-4 py-3 text-silver/40 text-[12px] italic">Aucune donnée trouvée dans la table {table}.</div>
          ) : (
            items.map((itemName, idx) => {
              const isChecked = selectedList.includes(itemName);
              return (
                <div
                  key={idx}
                  onClick={() => toggleItem(itemName)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/5 ${isChecked ? 'text-purple-400 bg-purple-500/5' : 'text-silver/80'}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-purple-500 border-purple-500' : 'border-white/20 bg-black/20'}`}>
                    {isChecked && <Check size={12} className="text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-[13px] font-medium">{itemName}</span>
                </div>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
}