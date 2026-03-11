import { UserCircle, Skull, Footprints } from 'lucide-react';

export default function PeoplesHub({ onNavigate }) {
  const categories = [
    { path: '/races-hub', icon: UserCircle, title: 'Races', description: 'Découvrez les peuples civilisés et leurs cultures' },
    { path: '/monsters', icon: Skull, title: 'Monstres', description: 'Affrontez les créatures dangereuses et légendaires' },
    { path: '/animals', icon: Footprints, title: 'Animaux', description: 'Rencontrez la faune sauvage et domestique' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-6xl">
        <h1 className="text-5xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">Peuples</h1>
        <p className="text-xl text-soft-white/80 mb-12 font-medium">Explorez les races, créatures et animaux qui peuplent vos mondes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-10 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
            >
              <category.icon size={64} className="mb-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-soft-white mb-3">{category.title}</h2>
              <p className="text-silver/70">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}