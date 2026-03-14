import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight, Maximize2, Globe } from 'lucide-react';
import DetailHeader from './DetailHeader';
import DetailTabs from './DetailTabs';
import SidebarInfo from './SidebarInfo';

// IMPORTS DES LAYOUTS (Standard Prestige 4.4.2)
import WorldLayout from './layouts/WorldLayout';
import ContinentLayout from './layouts/ContinentLayout';
import CountryLayout from './layouts/CountryLayout';
import CityLayout from './layouts/CityLayout';
import VillageLayout from './layouts/VillageLayout';
import LocationLayout from './layouts/LocationLayout';
import OceanLayout from './layouts/OceanLayout';
import DeityLayout from './layouts/DeityLayout'; 
import CalendarsLayout from './layouts/CalendarsLayout';
import CelestialBodiesLayout from './layouts/CelestialBodiesLayout';
import RacesLayout from './layouts/RacesLayout';
import MonstersLayout from './layouts/MonstersLayout'; 
import DefaultLayout from './layouts/DefaultLayout';

// --- COMPOSANT INTERNE : Résolveur d'UUID pour les relations ---
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

  if (!id) return <span className="text-silver/20 italic">—</span>;
  return <span className="text-teal-400 font-bold">{label}</span>;
};

// --- COMPOSANT INTERNE : Résolveur Ubiquité Multiverselle ---
const MultiversalWorldLinks = ({ entityId, entityType }) => {
  const [worlds, setWorlds] = useState([]);

  useEffect(() => {
    if (!entityId) return;
    const fetchWorlds = async () => {
      const { supabase } = await import('../../lib/supabase');
      const { data } = await supabase
        .from('world_links')
        .select('worlds(name)')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType);
      
      if (data) setWorlds(data.map(d => d.worlds.name));
    };
    fetchWorlds();
  }, [entityId, entityType]);

  if (worlds.length === 0) return <span className="text-silver/20 italic text-[11px]">Entité Universelle</span>;
  
  return (
    <div className="flex flex-wrap gap-2">
      {worlds.map((name, i) => (
        <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 rounded-md text-[10px] font-black uppercase text-teal-400 tracking-tighter">
          <Globe size={10} /> {name}
        </span>
      ))}
    </div>
  );
};

export default function EnhancedEntityDetail({ 
  isOpen, onClose, item, config, onEdit, onDelete, onLevelUp, onExportPDF, canEdit = true 
}) {
  const [activeTab, setActiveTab] = useState(config?.tabs?.[0]?.id || 'identity');
  const [viewerState, setViewerState] = useState({ isOpen: false, images: [], index: 0 });
  const contentRef = useRef(null);
  
  const openViewer = (images, index) => {
    setViewerState({ isOpen: true, images, index });
  };

  const closeViewer = () => setViewerState(prev => ({ ...prev, isOpen: false }));

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    setViewerState(prev => ({ ...prev, index: (prev.index + 1) % prev.images.length }));
  }, []);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    setViewerState(prev => ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }));
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

    if (typeof field.render === 'function') return field.render(value, item);

    if (field.type === 'custom' || field.type === 'stats-editor') {
      const CustomComponent = field.component;
      if (CustomComponent) return <CustomComponent value={value} item={item} formData={item} readOnly={true} onChange={() => {}} />;
      return null;
    }

    if (field.name === 'world_id') return <MultiversalWorldLinks entityId={item.id} entityType={tableName} />;

    if (field.type === 'relation') return <RelationValue table={field.table} id={value} />;

    if (field.type === 'image' || field.name === 'image_url') {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return <div className="w-full h-full bg-black/20 flex items-center justify-center rounded-xl border border-white/5"><span className="text-silver/20 italic text-[10px]">Pas d'image</span></div>;
      }
      return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner cursor-zoom-in group relative" onClick={() => openViewer([value], 0)}>
          <img src={value} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Maximize2 className="text-white/70" size={24} /></div>
        </div>
      );
    }

    if (field.type === 'images') {
      let galleries = value || {};
      if (typeof galleries === 'string') { try { galleries = JSON.parse(galleries); } catch (e) { galleries = {}; } }
      let allImages = Array.isArray(galleries) ? galleries : (typeof galleries === 'object' ? Object.values(galleries).flat() : []);
      allImages = allImages.filter(url => url && typeof url === 'string' && url.trim() !== '');
      if (allImages.length === 0) return <span className="text-silver/20 italic text-[10px]">Galerie vide</span>;
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allImages.map((url, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-black/20 cursor-zoom-in group relative shadow-lg" onClick={() => openViewer(allImages, idx)}>
              <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Maximize2 className="text-white/50" size={24} /></div>
            </div>
          ))}
        </div>
      );
    }

    if (field.type === 'select' || field.type === 'static-select') {
      const opt = field.options?.find(o => o.value === value || o.value == value);
      return <span className="text-white font-medium">{opt ? opt.label : (value || '—')}</span>;
    }

    if (field.type === 'number') return <span className="text-teal-400 font-bold">{value ?? '0'}</span>;
    
    return <span className="whitespace-pre-wrap font-medium leading-relaxed">{value || '—'}</span>;
  };

  const layoutProps = { item, config, activeTab, renderFieldValue, formData: item };
  const noScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#08090f]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      {/* CADRE PRINCIPAL UNIFIÉ BLEU FORMULAIRE (#242643) */}
      <div className="relative w-full h-full max-w-7xl bg-[#242643] md:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* DetailHeader : onDelete est retiré pour ne pas afficher la poubelle en lecture */}
        <DetailHeader 
          item={item} 
          config={config} 
          onClose={onClose} 
          onLevelUp={onLevelUp} 
          onExportPDF={onExportPDF} 
          onEdit={canEdit ? onEdit : null} 
        />
        
        <DetailTabs tabs={regularTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex overflow-hidden relative">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
            <button onClick={() => scrollContent('up')} className="p-2.5 bg-[#1a1d2d]/80 text-[#2DD4BF] rounded-full border border-teal-500/20 shadow-xl hover:bg-teal-500/10 transition-all"><ChevronUp size={20} /></button>
            <button onClick={() => scrollContent('down')} className="p-2.5 bg-[#1a1d2d]/80 text-[#2DD4BF] rounded-full border border-white/5 shadow-xl hover:bg-teal-500/10 transition-all"><ChevronDown size={20} /></button>
          </div>
          <div ref={contentRef} className="flex-1 overflow-y-auto p-10 lg:pl-16 lg:pr-24 pb-32 scroll-smooth scrollbar-hide" style={noScrollbarStyle}>
            {(() => {
              switch (tableName) {
                case 'worlds': return <WorldLayout {...layoutProps} />;
                case 'continents': return <ContinentLayout {...layoutProps} />;
                case 'countries': return <CountryLayout {...layoutProps} />;
                case 'cities': return <CityLayout {...layoutProps} />;
                case 'villages': return <VillageLayout {...layoutProps} />;
                case 'locations': return <LocationLayout {...layoutProps} />;
                case 'oceans': return <OceanLayout {...layoutProps} />;
                case 'deities': return <DeityLayout {...layoutProps} />; 
                case 'calendars': return <CalendarsLayout {...layoutProps} />; 
                case 'celestial_bodies': return <CelestialBodiesLayout {...layoutProps} />;
                case 'races': return <RacesLayout {...layoutProps} />;
                case 'monsters': return <MonstersLayout {...layoutProps} />; 
                default: return <DefaultLayout {...layoutProps} />;
              }
            })()}
          </div>
          {(gmFields.length > 0) && (
            <aside className="w-[350px] border-l border-white/5 bg-black/20 p-6 overflow-y-auto hidden xl:block shadow-2xl" style={noScrollbarStyle}>
              <SidebarInfo item={item} gmFields={gmFields} renderFieldValue={renderFieldValue} />
            </aside>
          )}
        </div>
      </div>

      {viewerState.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button onClick={closeViewer} className="absolute top-8 right-8 p-3 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[210]"><X size={32} /></button>
          <div className="relative w-full h-full flex items-center justify-center p-12 md:p-24 select-none" onClick={closeViewer}>
            {viewerState.images.length > 1 && (<button onClick={prevImage} className="absolute left-8 p-4 text-white/30 hover:text-teal-400 transition-colors z-[210]"><ChevronLeft size={64} strokeWidth={1} /></button>)}
            <img src={viewerState.images[viewerState.index]} alt="" className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()} />
            {viewerState.images.length > 1 && (<button onClick={nextImage} className="absolute right-8 p-4 text-white/30 hover:text-teal-400 transition-colors z-[210]"><ChevronRight size={64} strokeWidth={1} /></button>)}
          </div>
        </div>
      )}
    </div>
  );
}