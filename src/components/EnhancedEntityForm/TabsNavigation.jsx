import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TabsNavigation - Standard PRESTIGE 4.5.3 (UX/UI Symmetry)
 * Version Formulaire de la navigation par onglets.
 * CORRECTIFS : 
 * 1. Style "Pill" (Capsule) pour l'onglet actif.
 * 2. Gradients de masquage latéraux pour le scroll mobile.
 * 3. Fond synchronisé sur #1a1d2d.
 */
export default function TabsNavigation({ tabs, activeTab, setActiveTab }) {
  const tabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const amount = 200;
      tabsRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <nav className="relative border-b border-white/5 bg-[#1a1d2d] shrink-0 z-10">
      <div className="flex items-center">
        
        {/* BOUTON GAUCHE (Desktop uniquement) */}
        <button 
          type="button" 
          onClick={() => scrollTabs('left')} 
          className="hidden md:flex p-4 text-silver/20 hover:text-teal-400 transition-colors z-20"
        >
          <ChevronLeft size={18}/>
        </button>

        {/* ZONE DE NAVIGATION AVEC EFFETS DE GRADIENTS */}
        <div className="relative flex-1 overflow-hidden">
          
          {/* Gradient indicateur gauche (Mobile) */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1d2d] to-transparent z-10 pointer-events-none md:hidden" />

          <div 
            ref={tabsRef} 
            className="flex items-center overflow-x-auto scroll-smooth no-scrollbar px-4 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-2 py-3">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-6 py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] 
                      transition-all duration-300 whitespace-nowrap
                      ${isActive 
                        ? 'text-teal-400 bg-teal-500/10 border border-teal-500/20 shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
                        : 'text-silver/40 hover:text-silver/70 border border-transparent'}
                    `}
                  >
                    {tab.label}
                    
                    {/* Indicateur de ligne lumineuse (Style Prestige) */}
                    {isActive && (
                      <div className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-8 h-1 bg-teal-500 rounded-full shadow-[0_0_100px_rgba(45,212,191,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gradient indicateur droit (Mobile) */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1d2d] to-transparent z-10 pointer-events-none md:hidden" />
        </div>

        {/* BOUTON DROIT (Desktop uniquement) */}
        <button 
          type="button" 
          onClick={() => scrollTabs('right')} 
          className="hidden md:flex p-4 text-silver/20 hover:text-teal-400 transition-colors z-20"
        >
          <ChevronRight size={18}/>
        </button>
      </div>
    </nav>
  );
}