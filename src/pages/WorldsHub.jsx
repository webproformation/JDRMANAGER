import { Globe, Sparkles, Calendar, Moon, Mountain, Waves, Flag } from 'lucide-react';

export default function WorldsHub({ onNavigate }) {
  const categories = [
    { 
      path: '/worlds', 
      icon: Globe, 
      title: 'Mondes', 
      description: 'Explorez les univers fantastiques et leurs caractéristiques uniques' 
    },
    { 
      path: '/continents-hub', 
      icon: Mountain, 
      title: 'Continents', 
      description: 'Parcourez les grandes terres émergées et les masses continentales' 
    },
    { 
      path: '/countries', 
      icon: Flag, 
      title: 'Pays & Régions', 
      description: 'Gérez les nations, les royaumes et les frontières politiques' 
    },
    { 
      path: '/oceans', 
      icon: Waves, 
      title: 'Océans & Mers', 
      description: 'Naviguez sur les vastes étendues marines et les courants profonds' 
    },
    { 
      path: '/deities', 
      icon: Sparkles, 
      title: 'Dieux & Panthéons', 
      description: 'Découvrez les divinités, les cultes et leurs domaines divins' 
    },
    { 
      path: '/calendars', 
      icon: Calendar, 
      title: 'Calendriers & Temps', 
      description: 'Gérez le temps, les cycles et les époques des mondes' 
    },
    { 
      path: '/celestial-bodies', 
      icon: Moon, 
      title: 'Astrologie & Cieux', 
      description: 'Contemplez les astres, les constellations et les corps célestes' 
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">
          Univers de jeux
        </h1>
        <p className="text-xl text-soft-white/80 mb-12 font-medium">
          Créez et explorez les univers de vos campagnes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-8 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
            >
              <category.icon size={56} className="mb-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-soft-white mb-3">{category.title}</h2>
              <p className="text-silver/70 text-sm leading-relaxed">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}