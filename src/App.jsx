import { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';

// --- HUBS (Architecture Prestige) ---
import HomePage from './pages/HomePage';
import UniversHub from './pages/UniversHub';
import PeoplesHub from './pages/PeoplesHub';
import WorldElementsHub from './pages/WorldElementsHub';
import ClassesHub from './pages/ClassesHub';
import ProfessionsHub from './pages/ProfessionsHub';
import CampaignsHub from './pages/CampaignsHub';

// --- PAGES ENTITÉS ---
import WorldsPage from './pages/WorldsPage';
import DeitiesPage from './pages/DeitiesPage';
import CalendarsPage from './pages/CalendarsPage';
import CelestialBodiesPage from './pages/CelestialBodiesPage';
import ContinentsPage from './pages/ContinentsPage';
import CountriesPage from './pages/CountriesPage';
import CitiesPage from './pages/CitiesPage';
import VillagesPage from './pages/VillagesPage';
import LocationsPage from './pages/LocationsPage';
import SpellsPage from './pages/SpellsPage';
import MonstersPage from './pages/MonstersPage';
import RacesPage from './pages/RacesPage';
import ClassesPage from './pages/ClassesPage';
import ClassFeaturesPage from './pages/ClassFeaturesPage';
import FeatsPage from './pages/FeatsPage';
import GuildsPage from './pages/GuildsPage';
import LanguagesPage from './pages/LanguagesPage';
import AnimalsPage from './pages/AnimalsPage';
import PlantsPage from './pages/PlantsPage';
import MineralsPage from './pages/MineralsPage';
import CraftingMaterialsPage from './pages/CraftingMaterialsPage';
import ItemsPage from './pages/ItemsPage';
import MagicItemsPage from './pages/MagicItemsPage';
import PotionsPage from './pages/PotionsPage';
import RecipesPage from './pages/RecipesPage';
import DiseasesPage from './pages/DiseasesPage';
import CursesPage from './pages/CursesPage';
import OceansPage from './pages/OceansPage';
import SectsPage from './pages/SectsPage';
import CharactersPage from './pages/CharactersPage';
import CampaignsPage from './pages/CampaignsPage';

// --- SYSTÈME & USER ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserSettingsPage from './pages/UserSettingsPage';
import MediaManagerPage from './pages/MediaManagerPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- DOUBLE MÉMOIRE PRESTIGE ---
  const [activeRuleset, setActiveRuleset] = useState(localStorage.getItem('activeRuleset') || 'dnd5');
  const [activeWorldId, setActiveWorldId] = useState(localStorage.getItem('activeWorldId') || 'all');

  // --- ÉTAT PLEIN ÉCRAN ---
  const [isFullscreen, setIsFullscreen] = useState(false);

  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    // Écouteur pour synchroniser l'état si l'utilisateur quitte le plein écran via 'Echap'
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // --- GESTION DU PLEIN ÉCRAN ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erreur lors de l'activation du plein écran : ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const updateActiveRuleset = (id) => {
    setActiveRuleset(id);
    localStorage.setItem('activeRuleset', id);
  };

  const updateActiveWorld = (id) => {
    setActiveWorldId(id);
    localStorage.setItem('activeWorldId', id);
    window.dispatchEvent(new Event('worldChanged'));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigateTo('/login');
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={globalBackgroundStyle}>
        <div className="text-center animate-in fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#2DD4BF] mx-auto mb-4"></div>
          <p className="text-white/70 text-sm font-black uppercase tracking-[0.3em]">Synchronisation du Multivers...</p>
        </div>
      </div>
    );
  }

  if (!user && !['/login', '/register', '/forgot-password'].includes(currentPath)) {
    return <LoginPage onNavigate={navigateTo} onLogin={(u) => setUser(u)} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/': return <HomePage onNavigate={navigateTo} activeRuleset={activeRuleset} onRulesetChange={updateActiveRuleset} />;
      
      case '/univers-hub': 
      case '/worlds-hub': 
        return <UniversHub onNavigate={navigateTo} activeWorldId={activeWorldId} />;
      
      case '/peoples-hub': 
      case '/races-hub':
        return <PeoplesHub onNavigate={navigateTo} />;

      case '/classes-hub': return <ClassesHub onNavigate={navigateTo} />;
      case '/world-elements-hub': return <WorldElementsHub onNavigate={navigateTo} />;
      case '/professions-hub': return <ProfessionsHub onNavigate={navigateTo} />;
      case '/campaigns-hub': return <CampaignsHub onNavigate={navigateTo} />;

      case '/worlds': return <WorldsPage onWorldSelect={updateActiveWorld} activeWorldId={activeWorldId} />;
      case '/continents': 
      case '/continents-hub': 
        return <ContinentsPage activeRuleset={activeRuleset} activeWorldId={activeWorldId} />;
      
      case '/countries': 
      case '/countries-hub': 
        return <CountriesPage activeWorldId={activeWorldId} />;
        
      case '/cities': return <CitiesPage activeWorldId={activeWorldId} />;
      case '/villages': return <VillagesPage activeWorldId={activeWorldId} />;
      case '/locations': return <LocationsPage activeWorldId={activeWorldId} />;
      case '/races': return <RacesPage />;
      
      case '/deities': return <DeitiesPage />;
      case '/calendars': return <CalendarsPage />;
      case '/celestial-bodies': return <CelestialBodiesPage />;
      case '/spells': return <SpellsPage />;
      case '/monsters': return <MonstersPage />;
      case '/classes': return <ClassesPage />;
      case '/class-features': return <ClassFeaturesPage />;
      case '/feats': return <FeatsPage />;
      case '/guilds': return <GuildsPage />;
      case '/languages': return <LanguagesPage />;
      case '/animals': return <AnimalsPage />;
      case '/plants': return <PlantsPage />;
      case '/minerals': return <MineralsPage />;
      case '/crafting-materials': return <CraftingMaterialsPage />;
      case '/items': return <ItemsPage />;
      case '/magic-items': return <MagicItemsPage />;
      case '/potions': return <PotionsPage />;
      case '/recipes': return <RecipesPage />;
      case '/diseases': return <DiseasesPage />;
      case '/curses': return <CursesPage />;
      case '/campaigns': return <CampaignsPage />;
      case '/oceans': return <OceansPage />;
      case '/sects': return <SectsPage />;
      case '/media-manager': return <MediaManagerPage onNavigate={navigateTo} />;
      case '/settings': return <UserSettingsPage user={user} onLogout={handleLogout} onNavigate={navigateTo} />;
      
      default:
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center p-12 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
              <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Zone Inexplorée</h1>
              <p className="text-white/50 font-medium mb-8">L'URL <span className="text-[#2DD4BF] font-mono">{currentPath}</span> est perdue dans le Warp.</p>
              <button onClick={() => navigateTo('/')} className="px-8 py-3 bg-[#2DD4BF] text-night rounded-xl font-black uppercase text-[10px] hover:bg-[#2DD4BF]/80 transition-all">Retourner au Hub</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative" style={globalBackgroundStyle}>
      {/* BOUTON PLEIN ÉCRAN PRESTIGE (Ordinateur uniquement) */}
      <button 
        onClick={toggleFullscreen}
        className="hidden md:flex fixed top-4 right-4 z-[60] p-2.5 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl text-[#2DD4BF] hover:bg-[#2DD4BF]/10 hover:border-[#2DD4BF]/30 transition-all duration-300 shadow-2xl group"
        title={isFullscreen ? "Quitter le plein écran" : "Passer en plein écran"}
      >
        {isFullscreen ? (
          <Minimize size={20} className="group-hover:scale-90 transition-transform" />
        ) : (
          <Maximize size={20} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      <Navigation 
        currentPath={currentPath} 
        onNavigate={navigateTo} 
        user={user} 
        onLogout={handleLogout} 
        activeRuleset={activeRuleset} 
      />
      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;