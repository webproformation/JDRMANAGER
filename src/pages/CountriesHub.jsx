import { Flag, Building2, Home, Map } from 'lucide-react';

export default function CountriesHub({ onNavigate }) {
  const categories = [
    { path: '/countries', icon: Flag, title: 'Pays', description: 'Royaumes et territoires nationaux' },
    { path: '/cities', icon: Building2, title: 'Cités', description: 'Grandes villes et métropoles' },
    { path: '/villages', icon: Home, title: 'Villages', description: 'Hameaux et communautés rurales' },
    { path: '/locations', icon: Map, title: 'Autres Lieux', description: 'Donjons, temples et sites remarquables' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">Pays & Lieux</h1>
        <p className="text-xl text-soft-white/80 mb-12 font-medium">Découvrez les territoires, villes et sites remarquables</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-8 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
            >
              <category.icon size={56} className="mb-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold text-soft-white mb-3">{category.title}</h2>
              <p className="text-silver/70 text-sm">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}