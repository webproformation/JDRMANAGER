import { Globe, Sparkles, Calendar, Moon, Mountain, Waves } from 'lucide-react';

export default function WorldsHub({ onNavigate }) {
  const categories = [
    {
      path: '/worlds',
      icon: Globe,
      title: 'Mondes',
      description: 'Explorez les univers fantastiques et leurs caractéristiques uniques'
    },
    {
      path: '/deities',
      icon: Sparkles,
      title: 'Dieux & Panthéons',
      description: 'Découvrez les divinités et leurs domaines divins'
    },
    {
      path: '/calendars',
      icon: Calendar,
      title: 'Calendriers & Temps',
      description: 'Gérez le temps et les cycles des mondes'
    },
    {
      path: '/celestial-bodies',
      icon: Moon,
      title: 'Astrologie & Cieux',
      description: 'Contemplez les astres et corps célestes'
    },
    {
      path: '/continents-hub',
      icon: Mountain,
      title: 'Continents',
      description: 'Parcourez les grandes terres émergées'
    },
    {
      path: '/oceans',
      icon: Waves,
      title: 'Océans & Mers',
      description: 'Naviguez sur les vastes étendues marines'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-8">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          Univers de jeux
        </h1>
        <p className="text-xl text-soft-white mb-12 drop-shadow">
          Créez et explorez les univers de vos campagnes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.path}
                onClick={() => onNavigate(category.path)}
                className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-light hover:border-cyan-light hover:border-opacity-70 transition-all duration-300 group text-left"
              >
                <Icon size={56} className="mb-4 text-cyan-light group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-bold text-soft-white mb-3">{category.title}</h2>
                <p className="text-silver">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
