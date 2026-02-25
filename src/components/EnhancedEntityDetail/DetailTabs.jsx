import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DetailTabs({ tabs, activeTab, setActiveTab }) {
  const tabsRef = useRef(null);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const amount = 200;
      tabsRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative border-b border-white/5 bg-[#161926] shrink-0 z-10 flex items-center px-4">
      <button type="button" onClick={() => scrollTabs('left')} className="p-4 text-silver/40 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
      <div ref={tabsRef} className="flex-1 flex items-center overflow-x-hidden scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          <div className="flex no-scrollbar">
              {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-teal-400 bg-white/5' : 'text-silver/40 hover:text-silver'}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.6)]" />}
                  </button>
              ))}
          </div>
      </div>
      <button type="button" onClick={() => scrollTabs('right')} className="p-4 text-silver/40 hover:text-white transition-colors"><ChevronRight size={20}/></button>
    </div>
  );
}