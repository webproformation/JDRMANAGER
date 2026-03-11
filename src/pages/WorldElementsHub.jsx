import { Leaf, Gem, Box, Package, Wand2, FlaskConical, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function WorldElementsHub({ onNavigate }) {
  const categories = [
    { path: '/plants', icon: Leaf, title: 'Flore', description: 'Plantes et végétaux aux propriétés uniques' },
    { path: '/minerals', icon: Gem, title: 'Minéraux', description: 'Pierres précieuses, métaux et poudres' },
    { path: '/crafting-materials', icon: Box, title: 'Matériaux', description: 'Composants pour créations artisanales' },
    { path: '/items', icon: Package, title: 'Objets', description: 'Équipement et objets du quotidien' },
    { path: '/magic-items', icon: Wand2, title: 'Objets Magiques', description: 'Artefacts enchantés aux pouvoirs extraordinaires' },
    { path: '/spells', icon: Sparkles, title: 'Sorts & Grimoires', description: 'Arcanes et rituels magiques' },
    { path: '/potions', icon: FlaskConical, title: 'Potions', description: 'Élixirs, philtres et décoctions' },
    { path: '/recipes', icon: UtensilsCrossed, title: 'Recettes', description: 'Mets délicieux aux effets surprenants' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">Éléments du Monde</h1>
        <p className="text-xl text-soft-white/80 mb-12 font-medium">Découvrez les ressources et objets qui façonnent vos univers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-8 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
            >
              <category.icon size={56} className="mb-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-soft-white mb-3">{category.title}</h2>
              <p className="text-silver/70 text-sm leading-relaxed">{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}