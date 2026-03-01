import { useState } from 'react';
import {
  Globe,
  Users,
  Swords,
  ChevronDown,
  ChevronRight,
  Mountain,
  Flag,
  Building2,
  Home,
  Map,
  Sparkles,
  Shield,
  Wand2,
  Skull,
  Building,
  Languages,
  Footprints,
  Leaf,
  Gem,
  Box,
  Package,
  FlaskConical,
  UtensilsCrossed,
  HeartPulse,
  Ghost,
  Moon,
  Calendar,
  Waves,
  UserCircle,
  Trees,
  Settings,
  LogOut,
  Download,
  Image,
  Award // Ajout de l'icône pour les Dons
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
          { id: 'worlds-list', label: 'Mondes', icon: Globe, path: '/worlds' },
          { id: 'deities', label: 'Dieux & Panthéons', icon: Sparkles, path: '/deities' },
          { id: 'calendars', label: 'Calendriers & Temps', icon: Calendar, path: '/calendars' },
          { id: 'celestial-bodies', label: 'Astrologie & Cieux', icon: Moon, path: '/celestial-bodies' },
          {
            id: 'continents',
            label: 'Continents',
            icon: Mountain,
            path: '/continents-hub',
            children: [
              { id: 'continents-list', label: 'Continents', icon: Mountain, path: '/continents' },
              {
                id: 'countries',
                label: 'Pays',
                icon: Flag,
                path: '/countries-hub',
                children: [
                  { id: 'countries-list', label: 'Pays', icon: Flag, path: '/countries' },
                  { id: 'cities', label: 'Cités', icon: Building2, path: '/cities' },
                  { id: 'villages', label: 'Villages', icon: Home, path: '/villages' },
                  { id: 'locations', label: 'Autres Lieux', icon: Map, path: '/locations' }
                ]
              }
            ]
          },
          { id: 'oceans', label: 'Océans & mers', icon: Waves, path: '/oceans' }
        ]
      },
      {
        id: 'peoples',
        label: 'Peuples',
        icon: Users,
        path: '/peoples-hub',
        children: [
          {
            id: 'races',
            label: 'Races',
            icon: UserCircle,
            path: '/races-hub',
            children: [
              { id: 'races-list', label: 'Races', icon: UserCircle, path: '/races' },
              { id: 'languages', label: 'Langages', icon: Languages, path: '/languages' },
              {
                id: 'classes',
                label: 'Classes',
                icon: Shield,
                path: '/classes-hub',
                children: [
                  { id: 'classes-list', label: 'Classes', icon: Shield, path: '/classes' },
                  { id: 'class-features', label: 'Capacités de Classes', icon: Wand2, path: '/class-features' },
                  { id: 'spells', label: 'Sorts', icon: Sparkles, path: '/spells' }
                ]
              },
              { id: 'feats', label: 'Dons', icon: Award, path: '/feats' }, // --- NOUVELLE ENTRÉE ICI ---
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
          { id: 'minerals', label: 'Minéraux & Poudres', icon: Gem, path: '/minerals' },
          { id: 'crafting-materials', label: 'Matériaux d\'Artisanat', icon: Box, path: '/crafting-materials' },
          { id: 'items', label: 'Objets', icon: Package, path: '/items' },
          { id: 'magic-items', label: 'Objets Magiques', icon: Wand2, path: '/magic-items' },
          { id: 'potions', label: 'Potions', icon: FlaskConical, path: '/potions' },
          { id: 'recipes', label: 'Recettes de Cuisine', icon: UtensilsCrossed, path: '/recipes' }
        ]
      }
    ]
  },
  {
    id: 'characters',
    label: 'PJ & PNJS',
    icon: Users,
    path: '/characters'
  },
  {
    id: 'campaigns',
    label: 'Campagnes & Combats',
    icon: Swords,
    path: '/campaigns'
  },
  {
    id: 'media-library',
    label: 'Médiathèque',
    icon: Image,
    path: '/media-library'
  },
  {
    id: 'export',
    label: 'Export des données',
    icon: Download,
    path: '/export'
  }
];

const MenuItem = ({ item, currentPath, expandedSections, toggleSection, handleNavigate, level = 0 }) => {
  const ItemIcon = item.icon;
  const isExpanded = expandedSections[item.id];
  const hasChildren = item.children && item.children.length > 0;
  const hasPath = !!item.path;

  const padding = level === 0 ? 'p-2.5' : level === 1 ? 'p-2' : level === 2 ? 'p-1.5' : 'p-1';
  const iconSize = level === 0 ? 18 : level === 1 ? 16 : level === 2 ? 14 : 12;
  const fontSize = level === 0 ? 'text-sm' : level === 1 ? 'text-xs' : 'text-xs';

  return (
    <li>
      <button
        onClick={() => {
          if (hasChildren) {
            toggleSection(item.id);
          }
          if (hasPath) {
            handleNavigate(item.path);
          }
        }}
        className={`w-full flex items-center justify-between ${padding} rounded-lg transition-all duration-200 ${fontSize} ${
          currentPath === item.path
            ? 'bg-cyan-light bg-opacity-20 text-cyan-light border border-cyan-light border-opacity-50'
            : 'hover:bg-arcane hover:bg-opacity-30 text-silver hover:text-soft-white hover:border hover:border-arcane hover:border-opacity-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <ItemIcon size={iconSize} />
          <span className={level === 0 ? 'font-semibold' : 'font-normal'}>{item.label}</span>
        </div>
        {hasChildren && (
          isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        )}
      </button>

      {hasChildren && isExpanded && (
        <ul className="ml-2 mt-0.5 space-y-0.5 border-l border-arcane border-opacity-20 pl-2">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              currentPath={currentPath}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleNavigate={handleNavigate}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function Navigation({ currentPath, onNavigate, user, onLogout }) {
  const [expandedSections, setExpandedSections] = useState({ univers: true });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const isOpening = !prev[sectionId];
      const newState = { ...prev };

      if (isOpening) {
        const findSiblings = (items) => {
          for (const item of items) {
            if (item.id === sectionId) return items;
            if (item.children) {
              const found = findSiblings(item.children);
              if (found) return found;
            }
          }
          return null;
        };

        const siblings = findSiblings(menuStructure);
        
        if (siblings) {
          siblings.forEach(sibling => {
            if (sibling.id !== sectionId && sibling.id) {
              newState[sibling.id] = false;
            }
          });
        }
      }

      newState[sectionId] = isOpening;
      return newState;
    });
  };

  const handleNavigate = (path) => {
    if (path) {
      onNavigate(path);
    }
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.user_metadata?.full_name || user.email || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || '';
  };

  return (
    <nav className="w-64 bg-night border-r border-arcane border-opacity-30 text-soft-white h-screen flex flex-col overflow-hidden">
      <div className="p-4 pb-3 border-b border-arcane border-opacity-30">
        <button
          onClick={() => handleNavigate('/')}
          className="w-full text-xl font-bold text-center text-cyan-light hover:text-soft-white transition-colors duration-200 mb-4"
        >
          JDR Manager
        </button>

        {user && (
          <div className="flex items-center gap-3 bg-arcane bg-opacity-20 p-2 rounded-lg">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-cyan-light object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyan-light text-night flex items-center justify-center font-bold text-sm">
                {getUserInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-soft-white truncate font-medium">
                {user.user_metadata?.full_name || 'Utilisateur'}
              </p>
              <p className="text-xs text-silver truncate">{user.email}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleNavigate('/settings')}
                className="p-1.5 hover:bg-arcane rounded-md transition-colors text-silver hover:text-cyan-light"
                title="Paramètres"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded-md transition-colors text-silver hover:text-red-400"
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-arcane/20 scrollbar-track-transparent">
        <ul className="space-y-1 mt-3">
          {menuStructure.map((section) => (
            <MenuItem
              key={section.id}
              item={section}
              currentPath={currentPath}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleNavigate={handleNavigate}
              level={0}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}