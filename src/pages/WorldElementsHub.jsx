import { Leaf, Gem, Box, Package, Wand2, FlaskConical, UtensilsCrossed } from 'lucide-react';

export default function WorldElementsHub({ onNavigate }) {
  const categories = [
    {
      path: '/plants',
      icon: Leaf,
      title: 'Flore',
      description: 'Découvrez les plantes, herbes et végétaux aux propriétés uniques'
    },
    {
      path: '/minerals',
      icon: Gem,
      title: 'Minéraux & Poudres',
      description: 'Explorez les pierres précieuses, métaux et poudres magiques'
    },
    {
      path: '/crafting-materials',
      icon: Box,
      title: 'Matériaux d\'Artisanat',
      description: 'Rassemblez les composants pour vos créations artisanales'
    },
    {
      path: '/items',
      icon: Package,
      title: 'Objets',
      description: 'Gérez l\'équipement et les objets du quotidien'
    },
    {
      path: '/magic-items',
      icon: Wand2,
      title: 'Objets Magiques',
      description: 'Manipulez les artefacts enchantés aux pouvoirs extraordinaires'
    },
    {
      path: '/potions',
      icon: FlaskConical,
      title: 'Potions',
      description: 'Concoctez des élixirs, philtres et décoctions'
    },
    {
      path: '/recipes',
      icon: UtensilsCrossed,
      title: 'Recettes de Cuisine',
      description: 'Créez des mets délicieux aux effets parfois surprenants'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-8">
      <div className="text-center max-w-7xl">
        <h1 className="text-5xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          Éléments du Monde
        </h1>
        <p className="text-xl text-soft-white mb-12 drop-shadow">
          Découvrez les ressources et objets qui façonnent vos univers
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
                <h2 className="text-xl font-bold text-soft-white mb-3">{category.title}</h2>
                <p className="text-silver text-sm">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
