import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import DetailHeader from './DetailHeader';
import DetailTabs from './DetailTabs';
import SidebarInfo from './SidebarInfo';

// IMPORTS DE TOUS LES LAYOUTS (SANS EXCEPTION)
import WorldLayout from './layouts/WorldLayout';
import ContinentLayout from './layouts/ContinentLayout';
import CountryLayout from './layouts/CountryLayout';
import CityLayout from './layouts/CityLayout';
import VillageLayout from './layouts/VillageLayout';
import LocationLayout from './layouts/LocationLayout';
import OceanLayout from './layouts/OceanLayout';
import DeityLayout from './layouts/DeityLayout'; // AJOUTÉ POUR LE PANTHÉON
import DefaultLayout from './layouts/DefaultLayout';

// COMPOSANT INTERNE : Résolveur d'UUID pour les relations
const RelationValue = ({ table, id }) => {
  const [label, setLabel] = useState(id);

  useEffect(() => {
    if (!id || !table) return;
    const fetchData = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data } = await supabase.from(table).select('name').eq('id', id).single();
        if (data?.name) setLabel(data.name);
      } catch (err) {
        console.error("Erreur fetch relation:", err);
      }
    };
    fetchData();
  }, [id, table]);

  if (!id) return <span className="text-silver/20 italic text-[13px]">—</span>;
  return <span className="text-teal-300 text-[13px] font-medium">{label}</span>;
};

export default function EnhancedEntityDetail({ 
  isOpen, onClose, item, config, onEdit, onDelete, onLevelUp, onExportPDF, canEdit = true 
}) {
  const [activeTab, setActiveTab] = useState(config?.tabs[0]?.id || 'identity');
  const [viewerState, setViewerState] = useState({ isOpen: false, images: [], index: 0 });
  const contentRef = useRef(null);
  
  const openViewer = (images, index) => {
    setViewerState({ isOpen: true, images, index });
  };

  const closeViewer = () => setViewerState(prev => ({ ...prev, isOpen: false }));

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setViewerState(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  }, []);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setViewerState(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!viewerState.isOpen) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerState.isOpen, nextImage, prevImage]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (config?.tabs?.[0]?.id) setActiveTab(config.tabs[0].id);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = ''; 
    };
  }, [isOpen, item?.id, config]);

  if (!isOpen || !item) return null;

  const { tabs, tableName } = config;
  const gmTab = tabs.find(t => t.id === 'gm' || t.label.includes('MJ'));
  const gmFields = gmTab?.fields || [];
  const regularTabs = tabs.filter(t => t.id !== 'gm' && !t.label.includes('MJ'));

  const scrollContent = (direction) => {
    if (contentRef.current) {
      const amount = 350;
      contentRef.current.scrollBy({ top: direction === 'up' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const renderFieldValue = (field) => {
    if (!field) return null;
    const value = item[field.name];
    const t = (val) => val; 

    // PRIORITÉ : Si une fonction de rendu personnalisée est définie (ex: () => null pour les images)
    if (typeof field.render === 'function') return field.render(value, item);

    // GESTION DES COMPOSANTS PERSONNALISÉS
    if (field.type === 'custom') {
      const CustomComponent = field.component;
      if (CustomComponent) return <CustomComponent value={value} item={item} readOnly={true} onChange={() => {}} />;
      return null;
    }

    // GESTION DES RELATIONS (UUID -> Nom)
    if (field.type === 'relation') {
      return <RelationValue table={field.table} id={value} />;
    }

    if (field.type === 'image' || field.name === 'image_url') {
      if (!value || typeof value !== 'string' || value.trim() === '' || value.includes('undefined') || value.includes('null')) {
        return <div className="w-full h-full bg-black/20 flex items-center justify-center rounded-xl border border-white/5"><span className="text-silver/20 italic text-[10px] text-center px-4">{t("Pas d'image")}</span></div>;
      }
      return (
        <div 
          className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner cursor-zoom-in group relative"
          onClick={() => openViewer([value], 0)}
        >
          <img 
            src={value} 
            alt="" 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="text-white/70" size={24} />
          </div>
        </div>
      );
    }

    if (field.type === 'images') {
      let galleries = value || {};
      if (typeof galleries === 'string') {
        try { galleries = JSON.parse(galleries); } catch (e) { galleries = {}; }
      }
      
      let allImages = [];
      if (Array.isArray(galleries)) {
        allImages = galleries;
      } else if (typeof galleries === 'object' && galleries !== null) {
        allImages = Object.values(galleries).flat();
      }

      allImages = allImages.filter(url => 
        url && 
        typeof url === 'string' && 
        url.trim() !== '' && 
        url.trim() !== 'null' && 
        !url.includes('undefined') && 
        !url.includes('null')
      );

      if (allImages.length === 0) return <span className="text-silver/20 italic text-[10px]">{t("Galerie vide")}</span>;
      
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allImages.map((url, idx) => (
            <div 
              key={idx} 
              className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-black/20 cursor-zoom-in group relative shadow-lg"
              onClick={() => openViewer(allImages, idx)}
            >
              <img 
                src={url} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="text-white/50" size={24} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (field.type === 'select' || field.type === 'static-select') {
      const opt = field.options?.find(o => o.value === value || o.value == value);
      return <p className="text-white text-[13px] font-normal truncate">{opt ? t(opt.label) : (value || '—')}</p>;
    }

    if (field.type === 'number') return <p className="text-teal-400 text-[13px] font-normal">{value ?? '0'}</p>;

    // SÉCURITÉ ANTI-CRASH : On ne rend jamais un objet JSON directement
    if (typeof value === 'object' && value !== null) return null;

    return <p className="text-silver/80 text-[13px] leading-relaxed whitespace-pre-wrap font-normal">{t(value) || '—'}</p>;
  };

  const layoutProps = { item, config, activeTab, renderFieldValue };
  const noScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

  // DISPATCHER CENTRALISÉ : Oriente vers le bon Layout selon la table
  const renderLayout = () => {
    switch (tableName) {
      case 'worlds': return <WorldLayout {...layoutProps} />;
      case 'continents': return <ContinentLayout {...layoutProps} />;
      case 'countries': return <CountryLayout {...layoutProps} />;
      case 'cities': return <CityLayout {...layoutProps} />;
      case 'villages': return <VillageLayout {...layoutProps} />;
      case 'locations': return <LocationLayout {...layoutProps} />;
      case 'oceans': return <OceanLayout {...layoutProps} />;
      case 'deities': return <DeityLayout {...layoutProps} />; // ACTIVÉ POUR LE PANTHÉON
      default: return <DefaultLayout {...layoutProps} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* OVERLAY SOMBRE ÉCLAIRCIE */}
      <div className="absolute inset-0 bg-[#08090f]/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      {/* FENÊTRE PRINCIPALE : FOND #242643 (PRESTIGE) */}
      <div className="relative w-full h-[98vh] max-w-7xl bg-[#242643] rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 pointer-events-auto">
        <DetailHeader item={item} config={config} onClose={onClose} onLevelUp={onLevelUp} onExportPDF={onExportPDF} onEdit={canEdit ? onEdit : null} onDelete={onDelete} />
        <DetailTabs tabs={regularTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex overflow-hidden relative">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
            <button onClick={() => scrollContent('up')} className="p-2.5 bg-[#1a1d2d]/80 text-teal-400 rounded-full border border-teal-500/20 shadow-xl hover:bg-teal-500/10 transition-all"><ChevronUp size={20} /></button>
            <button onClick={() => scrollContent('down')} className="p-2.5 bg-[#1a1d2d]/80 text-teal-400 rounded-full border border-white/5 shadow-xl hover:bg-teal-500/10 transition-all"><ChevronDown size={20} /></button>
          </div>
          <div ref={contentRef} className="flex-1 overflow-y-auto p-10 lg:pl-16 lg:pr-24 pb-32 scroll-smooth scrollbar-hide" style={noScrollbarStyle}>
            {renderLayout()}
          </div>
          {(gmFields.length > 0) && (
            <aside className="w-[350px] border-l border-white/5 bg-black/20 p-6 overflow-y-auto hidden xl:block shadow-2xl" style={noScrollbarStyle}>
              <SidebarInfo item={item} gmFields={gmFields} renderFieldValue={renderFieldValue} />
            </aside>
          )}
        </div>
      </div>

      {/* VISIONNEUSE D'IMAGES */}
      {viewerState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button onClick={closeViewer} className="absolute top-8 right-8 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[210]"><X size={32} /></button>
          <div className="relative w-full h-full flex items-center justify-center p-12 md:p-24 select-none" onClick={closeViewer}>
            {viewerState.images.length > 1 && (<button onClick={prevImage} className="absolute left-8 p-4 text-white/30 hover:text-teal-400 transition-colors z-[210]"><ChevronLeft size={64} strokeWidth={1} /></button>)}
            <img src={viewerState.images[viewerState.index]} alt="" className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(20,184,166,0.15)] animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-teal-400 font-mono text-sm tracking-widest">{viewerState.index + 1} <span className="text-white/20 mx-1">/</span> {viewerState.images.length}</span>
            </div>
            {viewerState.images.length > 1 && (<button onClick={nextImage} className="absolute right-8 p-4 text-white/30 hover:text-teal-400 transition-colors z-[210]"><ChevronRight size={64} strokeWidth={1} /></button>)}
          </div>
        </div>
      )}
    </div>
  );
}