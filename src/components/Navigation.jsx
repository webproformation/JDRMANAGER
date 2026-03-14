import React, { useState, useEffect } from 'react';
import {
  Globe, Users, Swords, ChevronDown, ChevronRight, Mountain, Flag, Building2,
  Home, MapPin, Sparkles, Shield, Wand2, Skull, Building, Languages,
  Footprints, Leaf, Gem, Box, Package, FlaskConical, UtensilsCrossed,
  HeartPulse, Ghost, Moon, Calendar, Waves, UserCircle, Trees,
  Settings, LogOut, Download, Image, Award, BookOpen, ShoppingBag, 
  Hammer, Beer, GraduationCap, Menu, X, Crosshair
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const menuStructure = [
  {
    id: 'univers', label: 'Univers', icon: Globe, path: '/',
    children: [
      {
        id: 'univers-jeux', label: 'Univers de jeux', icon: Globe, path: '/univers-hub',
        children: [
          { 
            id: 'worlds-list', label: 'Mondes', icon: Globe, path: '/worlds',
            children: [
              {
                id: 'continents', label: 'Continents', icon: Mountain, path: '/continents',
                children: [
                  {
                    id: 'countries', label: 'Pays', icon: Flag, path: '/countries',
                    children: [
                      { id: 'cities', label: 'Cités', icon: Building2, path: '/cities' },
                      { id: 'villages', label: 'Villages', icon: Home, path: '/villages' },
                      { id: 'locations', label: 'Autres Lieux', icon: MapPin, path: '/locations' },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      { id: 'deities', label: 'Dieux & Panthéons', icon: Sparkles, path: '/deities' },
      { id: 'calendars', label: 'Calendriers & Temps', icon: Calendar, path: '/calendars' },
      { id: 'oceans', label: 'Océans & Mers', icon: Waves, path: '/oceans' },
      { id: 'astrology', label: 'Astrologie & Cieux', icon: Moon, path: '/celestial-bodies' },
    ]
  },
  {
    id: 'peoples-factions', label: 'Peuples & Sociétés', icon: Users, path: '/peoples-hub',
    children: [
      { id: 'races', label: 'Races', icon: Users, path: '/races' },
      { id: 'monsters', label: 'Monstres', icon: Skull, path: '/monsters' },
      { id: 'animals', label: 'Animaux', icon: Footprints, path: '/animals' },
      { id: 'guilds', label: 'Guildes', icon: Building, path: '/guilds' },
      { id: 'sects', label: 'Sectes', icon: Ghost, path: '/sects' },
      { id: 'languages', label: 'Langages', icon: Languages, path: '/languages' },
    ]
  },
  {
    id: 'classes', label: 'Classes & Magie', icon: Shield, path: '/classes-hub',
    children: [
      { id: 'classes-list', label: 'Classes', icon: Shield, path: '/classes' },
      { id: 'class-features', label: 'Capacités de Classes', icon: Wand2, path: '/class-features' },
      { id: 'spells', label: 'Sorts', icon: Sparkles, path: '/spells' },
      { id: 'feats', label: 'Dons', icon: Award, path: '/feats' },
      { id: 'curses', label: 'Malédictions', icon: Skull, path: '/curses' },
      { id: 'diseases', label: 'Maladies', icon: HeartPulse, path: '/diseases' },
    ]
  },
  {
    id: 'world-elements', label: 'Éléments du Monde', icon: Gem, path: '/world-elements-hub',
    children: [
      { id: 'plants', label: 'Flore', icon: Leaf, path: '/plants' },
      { id: 'minerals', label: 'Minéraux', icon: Gem, path: '/minerals' },
      { id: 'crafting-materials', label: 'Matériaux', icon: Box, path: '/crafting-materials' },
      { id: 'items', label: 'Objets', icon: Package, path: '/items' },
      { id: 'magic-items', label: 'Objets Magiques', icon: Wand2, path: '/magic-items' },
      { id: 'potions', label: 'Potions', icon: FlaskConical, path: '/potions' },
      { id: 'recipes', label: 'Recettes', icon: UtensilsCrossed, path: '/recipes' },
      { id: 'books', label: 'Livres & Savoirs', icon: BookOpen, path: '/books' },
    ]
  },
  {
    id: 'professions', label: 'Métiers & Commerces', icon: Hammer, path: '/professions-hub',
    children: [
      { id: 'merchants', label: 'Marchands', icon: ShoppingBag, path: '/merchants' },
      { id: 'artisans', label: 'Artisans', icon: Hammer, path: '/artisans' },
      { id: 'innkeepers', label: 'Aubergistes', icon: Beer, path: '/innkeepers' },
      { id: 'alchemists', label: 'Alchimistes', icon: FlaskConical, path: '/alchemists' },
      { id: 'learning-masters', label: "Maîtres d'apprentissage", icon: GraduationCap, path: '/learning-masters' },
    ]
  },
  {
    id: 'campaigns', label: 'Campagnes & Combats', icon: Swords, path: '/campaigns-hub',
    children: [
      { id: 'campaigns-list', label: 'Campagnes', icon: Flag, path: '/campaigns' },
      { id: 'encounters', label: 'Rencontres', icon: Crosshair, path: '/encounters' },
    ]
  },
  { id: 'media', label: 'Médiathèque', icon: Image, path: '/media-manager' }
];

export default function Navigation({ onNavigate, user, onLogout, activeRuleset }) {
  const [activeLevels, setActiveLevels] = useState({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeWorldName, setActiveWorldName] = useState(null);

  useEffect(() => {
    const fetchWorldName = async () => {
      const worldId = localStorage.getItem('activeWorldId');
      if (worldId && worldId !== 'all') {
        const { data } = await supabase.from('worlds').select('name').eq('id', worldId).single();
        if (data) setActiveWorldName(data.name);
      } else {
        setActiveWorldName(null);
      }
    };
    fetchWorldName();
    const handleWorldUpdate = () => fetchWorldName();
    window.addEventListener('worldChanged', handleWorldUpdate);
    return () => window.removeEventListener('worldChanged', handleWorldUpdate);
  }, []);

  const anyMenuOpen = Object.keys(activeLevels).length > 0;

  // --- LOGIQUE DE NETTOYAGE DES NIVEAUX ---
  const handleItemClick = (item, level, e) => {
    if (item.path) {
      onNavigate(item.path);
      setIsMobileOpen(false); 
    }

    setActiveLevels(prev => {
      const newState = { ...prev };
      
      // 1. On supprime TOUT ce qui est plus profond que le niveau actuel
      for (let i = level + 1; i <= 10; i++) delete newState[i];

      // 2. Si l'élément a des enfants, on gère son expansion (toggle)
      if (item.children && item.children.length > 0) {
        if (newState[level] === item.id) {
          delete newState[level];
        } else {
          newState[level] = item.id;
        }
      } else {
        // 3. S'il n'a pas d'enfants (ex: Dieux), on replie la branche de ses voisins (ex: Univers de jeux)
        delete newState[level];
      }
      
      return newState;
    });
  };

  const toggleExpand = (id, level, e) => {
    if (e) e.stopPropagation();
    setActiveLevels(prev => {
      const newState = { ...prev };
      if (newState[level] === id) {
        for (let i = level; i <= 10; i++) delete newState[i];
      } else {
        newState[level] = id;
        for (let i = level + 1; i <= 10; i++) delete newState[i];
      }
      return newState;
    });
  };

  const getLevelStyles = (level, isExpanded, isRoot) => {
    if (isRoot && !isExpanded && anyMenuOpen) {
      return {
        container: "p-1 mt-0.5 opacity-60 hover:opacity-100 rounded-lg",
        text: "text-[9px] md:text-[11px] lg:text-[9px] font-semibold uppercase tracking-widest text-silver/70",
        iconSize: 12,
        activeBg: "bg-transparent",
        hoverBg: "hover:bg-white/5"
      };
    }
    switch(level) {
      case 0: return { container: "p-1.5 mt-1 rounded-lg", text: "text-[11px] md:text-[13px] lg:text-[11px] font-black uppercase tracking-widest text-soft-white", iconSize: 16, activeBg: "bg-[#2DD4BF]/10", hoverBg: "hover:bg-[#2DD4BF]/10" };
      case 1: return { container: "p-1 mt-0.5 rounded-md", text: "text-[10px] md:text-[12px] lg:text-[10px] font-bold uppercase tracking-wider text-silver/90", iconSize: 14, activeBg: "bg-white/5", hoverBg: "hover:bg-white/5" };
      case 2: return { container: "py-1 px-1.5 mt-0.5 rounded-md", text: "text-[9px] md:text-[10px] lg:text-[9px] font-semibold uppercase tracking-widest text-silver/70", iconSize: 12, activeBg: "bg-white/5", hoverBg: "hover:bg-white/5" };
      default: return { container: "py-0.5 px-1 mt-0.5 rounded-md", text: "text-[8px] font-medium uppercase tracking-widest text-silver/50", iconSize: 10, activeBg: "bg-white/5", hoverBg: "hover:bg-white/5" };
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = activeLevels[level] === item.id;
    const Icon = item.icon;
    const isRoot = level === 0;
    const styles = getLevelStyles(level, isExpanded, isRoot);

    return (
      <li key={item.id} className="relative">
        <div
          className={`flex items-center justify-between cursor-pointer transition-all duration-300 group ${styles.container} ${styles.hoverBg} ${isExpanded && level > 0 ? styles.activeBg : ''}`}
          onClick={(e) => handleItemClick(item, level, e)}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {isRoot && Icon && (
               <div className={`p-1.5 transition-all ${isExpanded ? 'bg-[#2DD4BF] text-night scale-110 rounded-lg shadow-[0_0_10px_rgba(45,212,191,0.4)]' : 'bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-md group-hover:scale-110 group-hover:bg-[#2DD4BF]/20'}`}>
                 <Icon size={styles.iconSize} />
               </div>
            )}
            {!isRoot && Icon && (
              <div className={`transition-colors z-10 rounded-full p-0.5 ${isExpanded ? 'text-[#2DD4BF]' : 'text-white/30 group-hover:text-[#2DD4BF]'}`}>
                <Icon size={styles.iconSize} />
              </div>
            )}
            <span className={`truncate transition-colors ${styles.text} ${isExpanded ? 'text-[#2DD4BF]' : 'group-hover:text-[#2DD4BF]'}`}>
              {item.label}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            {hasChildren && (
              <button
                onClick={(e) => toggleExpand(item.id, level, e)}
                className={`p-1 rounded-md transition-colors ${isExpanded ? 'text-[#2DD4BF]' : 'text-white/40 group-hover:text-white'}`}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <ul className={`mt-0.5 space-y-0.5 relative ${level > 0 ? 'border-l border-white/10 ml-4 pl-2' : ''}`}>
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <button onClick={() => setIsMobileOpen(true)} className="md:hidden fixed top-4 left-4 z-40 p-3 bg-gradient-to-br from-[#192236]/95 to-[#2A274A]/95 backdrop-blur-md border border-[#2DD4BF]/20 rounded-xl text-[#2DD4BF] shadow-lg hover:brightness-110 transition-colors">
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />
      )}

      <nav className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-gradient-to-br from-[#192236]/95 to-[#2A274A]/95 md:bg-none md:bg-black/20 backdrop-blur-md border-r border-white/5 flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="py-4 px-2 flex flex-col items-center justify-center relative border-b border-white/5 bg-black/10">
          <div className="relative flex items-center justify-center cursor-pointer group transition-all duration-500 w-full" onClick={() => { onNavigate('/'); setIsMobileOpen(false); setActiveLevels({ 0: 'univers' }); }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.25)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 blur-xl mix-blend-screen pointer-events-none rounded-full"></div>
            {/* CORRECTIF LOGO : /RPGManager-Logo.png au lieu de public/RPGManager-Logo.png */}
            <img src="/RPGManager-Logo.png" alt="Logo" className="w-56 h-auto max-h-20 object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden absolute right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors z-20">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 bg-[#2DD4BF]/5 border-b border-[#2DD4BF]/10 animate-in fade-in duration-700">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <Shield size={11} className="text-[#2DD4BF]" />
              <span className="text-[9px] font-black text-[#2DD4BF] uppercase tracking-[0.2em]">{activeRuleset || 'Agnostique'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe size={11} className={activeWorldName ? "text-[#2DD4BF]" : "text-white/20"} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${activeWorldName ? "text-white drop-shadow-[0_0_5px_rgba(45,212,191,0.3)]" : "text-white/20"}`}>
                {activeWorldName ? activeWorldName : "Tous les mondes"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">
          <ul className="space-y-0.5">
            {menuStructure.map(item => renderMenuItem(item, 0))}
          </ul>
        </div>

        <div className="p-3 border-t border-white/5 bg-black/20">
          {user && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl">
              <div onClick={() => { onNavigate('/settings'); setIsMobileOpen(false); }} className="flex-1 flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <UserCircle className="text-[#2DD4BF]" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white truncate font-black tracking-wide group-hover:text-[#2DD4BF]">{user.user_metadata?.full_name || 'MJ'}</p>
                  <p className="text-[8px] text-[#2DD4BF] truncate uppercase tracking-widest font-bold">Mon Compte</p>
                </div>
              </div>
              <button onClick={onLogout} className="p-2 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all rounded-lg shrink-0">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}