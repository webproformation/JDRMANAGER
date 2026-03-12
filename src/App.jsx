import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import UniversHub from './pages/UniversHub';
import WorldsHub from './pages/WorldsHub';
import PeoplesHub from './pages/PeoplesHub';
import WorldElementsHub from './pages/WorldElementsHub';
import ContinentsHub from './pages/ContinentsHub';
import CountriesHub from './pages/CountriesHub';
import RacesHub from './pages/RacesHub';
import ClassesHub from './pages/ClassesHub';
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
import CharactersPage from './pages/CharactersPage';
import CampaignsPage from './pages/CampaignsPage';
import OceansPage from './pages/OceansPage';
import SectsPage from './pages/SectsPage';
import ExportPage from './pages/ExportPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserSettingsPage from './pages/UserSettingsPage';
import MediaManagerPage from './pages/MediaManagerPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Style de dégradé diagonal personnalisé (Standard Prestige)
  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Vérification de la session Supabase au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écoute des changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPath('/login');
    window.history.pushState({}, '', '/login');
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Écran de chargement initial
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-screen"
        style={globalBackgroundStyle}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium tracking-tight">Synchronisation du Multivers...</p>
        </div>
      </div>
    );
  }

  // Redirection vers Login si non connecté (sauf pages publiques)
  if (!user && currentPath !== '/register' && currentPath !== '/forgot-password') {
    return <LoginPage onNavigate={navigateTo} onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigateTo} />;
      case '/media-library':
        return <MediaManagerPage />;
      case '/univers-hub':
        return <UniversHub onNavigate={navigateTo} />;
      case '/worlds-hub':
        return <WorldsHub onNavigate={navigateTo} />;
      case '/peoples-hub':
        return <PeoplesHub onNavigate={navigateTo} />;
      case '/world-elements-hub':
        return <WorldElementsHub onNavigate={navigateTo} />;
      case '/continents-hub':
        return <ContinentsHub onNavigate={navigateTo} />;
      case '/countries-hub':
        return <CountriesHub onNavigate={navigateTo} />;
      case '/races-hub':
        return <RacesHub onNavigate={navigateTo} />;
      case '/classes-hub':
        return <ClassesHub onNavigate={navigateTo} />;
      case '/worlds':
        return <WorldsPage />;
      case '/deities':
        return <DeitiesPage />;
      case '/calendars':
        return <CalendarsPage />;
      case '/celestial-bodies':
        return <CelestialBodiesPage />;
      case '/continents':
        return <ContinentsPage />;
      case '/countries':
        return <CountriesPage />;
      case '/cities':
        return <CitiesPage />;
      case '/villages':
        return <VillagesPage />;
      case '/locations':
        return <LocationsPage />;
      case '/spells':
        return <SpellsPage />;
      case '/monsters':
        return <MonstersPage />;
      case '/races':
        return <RacesPage />;
      case '/classes':
        return <ClassesPage />;
      case '/class-features':
        return <ClassFeaturesPage />;
      case '/feats':
        return <FeatsPage />;
      case '/guilds':
        return <GuildsPage />;
      case '/languages':
        return <LanguagesPage />;
      case '/animals':
        return <AnimalsPage />;
      case '/plants':
        return <PlantsPage />;
      case '/minerals':
        return <MineralsPage />;
      case '/crafting-materials':
        return <CraftingMaterialsPage />;
      case '/items':
        return <ItemsPage />;
      case '/magic-items':
        return <MagicItemsPage />;
      case '/potions':
        return <PotionsPage />;
      case '/recipes':
        return <RecipesPage />;
      case '/diseases':
        return <DiseasesPage />;
      case '/curses':
        return <CursesPage />;
      case '/characters':
        return <CharactersPage />;
      case '/campaigns':
        return <CampaignsPage />;
      case '/oceans':
        return <OceansPage />;
      case '/sects':
        return <SectsPage />;
      case '/export':
        return <ExportPage />;
      case '/login':
        return <LoginPage onNavigate={navigateTo} onLogin={handleLogin} />;
      case '/register':
        return <RegisterPage onNavigate={navigateTo} onLogin={handleLogin} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={navigateTo} />;
      case '/settings':
        return <UserSettingsPage user={user} onLogout={handleLogout} onNavigate={navigateTo} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center p-12 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
              <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                Zone Inexplorée
              </h1>
              <p className="text-white/50 font-medium mb-8">
                L'URL demandée (<span className="text-teal-400 font-mono">{currentPath}</span>) n'existe pas dans ce plan de réalité.
              </p>
              <button 
                onClick={() => navigateTo('/')}
                className="px-8 py-3 bg-teal-500 text-black rounded-xl font-black uppercase text-[10px] hover:bg-teal-400 transition-all"
              >
                Retourner au Hub
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={globalBackgroundStyle}
    >
      <Navigation
        currentPath={currentPath}
        onNavigate={navigateTo}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;