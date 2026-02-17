import { UserCircle, Skull, Footprints } from 'lucide-react';

export default function PeoplesHub({ onNavigate }) {
  const categories = [
    {
      path: '/races-hub',
      icon: UserCircle,
      title: 'Races',
      description: 'Découvrez les peuples civilisés et leurs cultures ancestrales'
    },
    {
      path: '/monsters',
      icon: Skull,
      title: 'Monstres',
      description: 'Affrontez les créatures dangereuses et légendaires'
    },
    {
      path: '/animals',
      icon: Footprints,
      title: 'Animaux',
      description: 'Rencontrez la faune sauvage et domestique des mondes'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-8">
      <div className="text-center max-w-6xl">
        <h1 className="text-5xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          Peuples
        </h1>
        <p className="text-xl text-soft-white mb-12 drop-shadow">
          Explorez les races, créatures et animaux qui peuplent vos mondes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.path}
                onClick={() => onNavigate(category.path)}
                className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-10 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-light hover:border-cyan-light hover:border-opacity-70 transition-all duration-300 group text-left"
              >
                <Icon size={64} className="mb-4 text-cyan-light group-hover:scale-110 transition-transform" />
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
