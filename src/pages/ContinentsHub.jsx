import { Mountain, Flag } from 'lucide-react';

export default function ContinentsHub({ onNavigate }) {
  const categories = [
    {
      path: '/continents',
      icon: Mountain,
      title: 'Continents',
      description: 'Explorez les grandes masses continentales de vos mondes'
    },
    {
      path: '/countries-hub',
      icon: Flag,
      title: 'Pays',
      description: 'Découvrez les nations et leurs territoires'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-8">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          Continents & Territoires
        </h1>
        <p className="text-xl text-soft-white mb-12 drop-shadow">
          Gérez la géographie et les divisions territoriales
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
