import { useState } from 'react';
import {
  Globe, Users, Swords, ChevronDown, ChevronRight, Mountain, Flag, Building2,
  Home, MapPin, Sparkles, Shield, Wand2, Skull, Building, Languages,
  Footprints, Leaf, Gem, Box, Package, FlaskConical, UtensilsCrossed,
  HeartPulse, Ghost, Moon, Calendar, Waves, UserCircle, Trees,
  Settings, LogOut, Download, Image, Award
} from 'lucide-react';

const menuStructure = [
  {
    id: 'univers',
    label: 'Univers',
    icon: Globe,
    path: '/univers-hub',
    children: [
      {
        id: 'univers-jeux',
        label: 'Univers de jeux',
        icon: Globe,
        path: '/worlds-hub',
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
          },
          { id: 'oceans', label: 'Océans & mers', icon: Waves, path: '/oceans' },
          { id: 'deities', label: 'Dieux & Panthéons', icon: Sparkles, path: '/deities' },
          { id: 'calendars', label: 'Calendriers & Temps', icon: Calendar, path: '/calendars' },
          { id: 'celestial-bodies', label: 'Astrologie & Cieux', icon: Moon, path: '/celestial-bodies' },
        ]
      },
      {
        id: 'peoples',
        label: 'Peuples',
        icon: Users,
        path: '/peoples-hub',
        children: [
          {
            id: 'races', label: 'Races', icon: UserCircle, path: '/races-hub',
            children: [
              { id: 'races-list', label: 'Races', icon: UserCircle, path: '/races' },
              { id: 'languages', label: 'Langages', icon: Languages, path: '/languages' },
              {
                id: 'classes', label: 'Classes', icon: Shield, path: '/classes-hub',
                children: [
                  { id: 'classes-list', label: 'Classes', icon: Shield, path: '/classes' },
                  { id: 'class-features', label: 'Capacités', icon: Wand2, path: '/class-features' },
                  { id: 'spells', label: 'Sorts', icon: Sparkles, path: '/spells' }
                ]
              },
              { id: 'feats', label: 'Dons', icon: Award, path: '/feats' },
              { id: 'guilds', label: 'Guildes', icon: Building, path: '/guilds' },
              { id: 'sects', label: 'Sectes', icon: Ghost, path: '/sects' },
              { id: 'curses', label: 'Malédictions', icon: Ghost, path: '/curses' },
              { id: 'diseases', label: 'Maladies', icon: HeartPulse, path: '/diseases' }
            ]
          },
          { id: 'monsters', label: 'Monstres', icon: Skull, path: '/monsters' },
          { id: 'animals', label: 'Animaux', icon: Footprints, path: '/animals' }
        ]
      },
      {
        id: 'world-elements',
        label: 'Éléments du monde',
        icon: Trees,
        path: '/world-elements-hub',
        children: [
          { id: 'plants', label: 'Flore', icon: Leaf, path: '/plants' },
          { id: 'minerals', label: 'Minéraux', icon: Gem, path: '/minerals' },
          { id: 'materials', label: 'Matériaux', icon: Box, path: '/crafting-materials' },
          { id: 'items', label: 'Objets', icon: Package, path: '/items' },
          { id: 'magic-items', label: 'Objets Magiques', icon: Wand2, path: '/magic-items' },
          { id: 'potions', label: 'Potions', icon: FlaskConical, path: '/potions' },
          { id: 'recipes', label: 'Recettes', icon: UtensilsCrossed, path: '/recipes' }
        ]
      }
    ]
  },
  { id: 'characters', label: 'PJ & PNJS', icon: Users, path: '/characters' },
  { id: 'campaigns', label: 'Campagnes & Combats', icon: Swords, path: '/campaigns' },
  { id: 'media-library', label: 'Médiathèque (Galerie)', icon: Image, path: '/media-library' },
  { id: 'export', label: 'Export des données', icon: Download, path: '/export' }
];

function MenuItem({ item, currentPath, expandedSections, toggleSection, handleNavigate, level = 0 }) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = !!expandedSections[item.id];
  const isActive = currentPath === item.path;

  // Optimisation Prestige : On réduit le padding vertical au fur et à mesure de la profondeur
  const py = level === 0 ? 'py-1.5' : 'py-1';

  const handleClick = (e) => {
    e.stopPropagation();
    toggleSection(item.id, hasChildren);
    if (item.path) handleNavigate(item.path);
  };

  return (
    <li>
      <div
        className={`flex items-center justify-between px-3 ${py} rounded-md cursor-pointer transition-all duration-200 group border ${
          isActive 
            ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/30 shadow-lg shadow-[#2DD4BF]/10' 
            : 'text-silver/80 border-transparent hover:bg-white/5 hover:text-soft-white'
        }`}
        style={{ paddingLeft: `${(level + 1) * 10}px` }} // Gain de 2px par niveau
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <item.icon size={level === 0 ? 18 : 16} className={isActive ? 'text-[#2DD4BF]' : 'text-silver/60 group-hover:text-[#2DD4BF]'} />
          <span className={`font-medium ${level === 0 ? 'text-sm' : 'text-[13px]'}`}>{item.label}</span>
        </div>
        {hasChildren && <div className="text-silver/30">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</div>}
      </div>
      {hasChildren && isExpanded && (
        <ul className="mt-0.5 space-y-0.5 animate-in slide-in-from-top-1">
          {item.children.map(child => (
            <MenuItem key={child.id} item={child} currentPath={currentPath} expandedSections={expandedSections} toggleSection={toggleSection} handleNavigate={handleNavigate} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Navigation({ currentPath, onNavigate, user, onLogout }) {
  const [expandedSections, setExpandedSections] = useState({});

  const findPathToId = (items, targetId, currentPathIds = []) => {
    for (const item of items) {
      if (item.id === targetId) return [...currentPathIds, item.id];
      if (item.children) {
        const path = findPathToId(item.children, targetId, [...currentPathIds, item.id]);
        if (path) return path;
      }
    }
    return null;
  };

  const toggleSection = (sectionId, hasChildren) => {
    setExpandedSections(prev => {
      if (hasChildren && prev[sectionId]) {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      }
      const pathIds = findPathToId(menuStructure, sectionId);
      if (!pathIds) return prev;
      const nextExpanded = {};
      pathIds.forEach(id => { nextExpanded[id] = true; });
      return nextExpanded;
    });
  };

  const handleNavigate = (path) => { if (onNavigate) onNavigate(path); };

  return (
    <nav className="w-64 bg-black/15 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen transition-all">
      {/* Header Compacté : Gain de 12px */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-[#2DD4BF]/30 to-[#2DD4BF]/5 rounded-xl flex items-center justify-center shadow-lg border border-[#2DD4BF]/20">
            <Shield className="text-[#2DD4BF]" size={20} />
          </div>
          <div>
            <h1 className="text-base font-black text-soft-white tracking-tighter uppercase leading-none">
              ULTIMATE <span className="text-[#2DD4BF] block text-lg">RPG Manager</span>
            </h1>
            <p className="text-[8px] text-[#2DD4BF]/60 uppercase tracking-[0.2em] font-black mt-1">Moteur v2.0</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/30 shrink-0">
              <UserCircle className="text-[#2DD4BF]/80" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-soft-white truncate font-black leading-tight">{user.user_metadata?.full_name || 'MJ'}</p>
              <p className="text-[9px] text-white/30 truncate">Connecté</p>
            </div>
            <div className="flex gap-0.5">
              <button onClick={() => handleNavigate('/settings')} className="p-1.5 hover:bg-[#2DD4BF]/10 text-white/40 hover:text-[#2DD4BF] transition-all rounded-lg">
                <Settings size={14} />
              </button>
              <button onClick={onLogout} className="p-1.5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all rounded-lg">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Zone de Scroll Optimisée : On réduit le margin top */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-4 scrollbar-thin scrollbar-thumb-[#2DD4BF]/10 scrollbar-track-transparent">
        <ul className="space-y-0.5 mt-3">
          {menuStructure.map(section => (
            <MenuItem key={section.id} item={section} currentPath={currentPath} expandedSections={expandedSections} toggleSection={toggleSection} handleNavigate={handleNavigate} />
          ))}
        </ul>
      </div>
    </nav>
  );
}