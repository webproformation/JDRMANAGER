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
// --- NOUVEAU : Import de la page Médiathèque ---
import MediaManagerPage from './pages/MediaManagerPage';

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPath('/login');
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-night via-night to-arcane">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-light mx-auto mb-4"></div>
          <p className="text-cyan-light text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user && currentPath !== '/register' && currentPath !== '/forgot-password') {
    return <LoginPage onNavigate={setCurrentPath} onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={setCurrentPath} />;
      
      // --- NOUVEAU : La route vers la Médiathèque ---
      case '/media-library':
        return <MediaManagerPage />;
      
      case '/univers-hub':
        return <UniversHub onNavigate={setCurrentPath} />;
      case '/worlds-hub':
        return <WorldsHub onNavigate={setCurrentPath} />;
      case '/peoples-hub':
        return <PeoplesHub onNavigate={setCurrentPath} />;
      case '/world-elements-hub':
        return <WorldElementsHub onNavigate={setCurrentPath} />;
      case '/continents-hub':
        return <ContinentsHub onNavigate={setCurrentPath} />;
      case '/countries-hub':
        return <CountriesHub onNavigate={setCurrentPath} />;
      case '/races-hub':
        return <RacesHub onNavigate={setCurrentPath} />;
      case '/classes-hub':
        return <ClassesHub onNavigate={setCurrentPath} />;
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
        return <LoginPage onNavigate={setCurrentPath} onLogin={handleLogin} />;
      case '/register':
        return <RegisterPage onNavigate={setCurrentPath} onLogin={handleLogin} />;
      case '/forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentPath} />;
      case '/settings':
        return <UserSettingsPage user={user} onLogout={handleLogout} onNavigate={setCurrentPath} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Section en construction
              </h1>
              <p className="text-gray-600">
                Cette section sera bientôt disponible
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-night via-arcane to-night overflow-hidden">
      <Navigation
        currentPath={currentPath}
        onNavigate={setCurrentPath}
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