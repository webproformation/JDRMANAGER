import { UserCircle, Languages, Shield, Building, Ghost, HeartPulse } from 'lucide-react';

export default function RacesHub({ onNavigate }) {
  const categories = [
    {
      path: '/races',
      icon: UserCircle,
      title: 'Races',
      description: 'Découvrez les différentes races et espèces'
    },
    {
      path: '/languages',
      icon: Languages,
      title: 'Langages',
      description: 'Explorez les langues et systèmes d\'écriture'
    },
    {
      path: '/classes-hub',
      icon: Shield,
      title: 'Classes',
      description: 'Classes de personnages et leurs capacités'
    },
    {
      path: '/guilds',
      icon: Building,
      title: 'Guildes',
      description: 'Organisations, corporations et guildes'
    },
    {
      path: '/sects',
      icon: Ghost,
      title: 'Sectes',
      description: 'Cultes, ordres secrets et organisations occultes'
    },
    {
      path: '/curses',
      icon: Ghost,
      title: 'Malédictions',
      description: 'Malédictions et afflictions mystiques'
    },
    {
      path: '/diseases',
      icon: HeartPulse,
      title: 'Maladies',
      description: 'Maladies, infections et fléaux'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-8">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          Races & Civilisations
        </h1>
        <p className="text-xl text-soft-white mb-12 drop-shadow">
          Explorez les peuples, cultures et organisations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
