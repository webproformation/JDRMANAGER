import { Globe, Users, Trees } from 'lucide-react';

export default function UniversHub({ onNavigate }) {
  const categories = [
    {
      path: '/worlds-hub',
      icon: Globe,
      title: 'Univers de jeux',
      description: 'Créez et explorez les univers de vos campagnes'
    },
    {
      path: '/peoples-hub',
      icon: Users,
      title: 'Peuples',
      description: 'Explorez les races, créatures et animaux qui peuplent vos mondes'
    },
    {
      path: '/world-elements-hub',
      icon: Trees,
      title: 'Éléments du monde',
      description: 'Gérez les ressources, objets et richesses naturelles'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-6xl">
        <h1 className="text-5xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">
          Univers
        </h1>
        <p className="text-xl text-soft-white/80 mb-12 drop-shadow font-medium">
          Construisez et gérez tous les aspects de vos univers de jeu
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.path}
                onClick={() => onNavigate(category.path)}
                className="bg-black/20 backdrop-blur-md border border-white/5 p-10 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
              >
                <Icon size={64} className="mb-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-bold text-soft-white mb-3">{category.title}</h2>
                <p className="text-silver/70">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}