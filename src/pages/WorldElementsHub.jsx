import React from 'react';
import { 
  Leaf, Gem, Box, Package, Wand2, FlaskConical, UtensilsCrossed, BookOpen 
} from 'lucide-react';

export default function WorldElementsHub({ onNavigate }) {
  const categories = [
    { 
      icon: Leaf, 
      title: 'Flore', 
      description: 'Plantes, herbes médicinales et végétation aux propriétés uniques.', 
      path: '/plants' 
    },
    { 
      icon: Gem, 
      title: 'Minéraux', 
      description: 'Pierres précieuses, minerais bruts et cristaux magiques.', 
      path: '/minerals' 
    },
    { 
      icon: Box, 
      title: 'Matériaux', 
      description: 'Composants d\'artisanat, cuirs, bois rares et métaux forgés.', 
      path: '/crafting-materials' 
    },
    { 
      icon: Package, 
      title: 'Objets', 
      description: 'Équipement du quotidien, armes, armures et outils d\'aventuriers.', 
      path: '/items' 
    },
    { 
      icon: Wand2, 
      title: 'Objets Magiques', 
      description: 'Artefacts enchantés, reliques anciennes et armes de légende.', 
      path: '/magic-items' 
    },
    { 
      icon: FlaskConical, 
      title: 'Potions', 
      description: 'Élixirs, philtres de soins, venins mortels et décoctions.', 
      path: '/potions' 
    },
    { 
      icon: UtensilsCrossed, 
      title: 'Recettes', 
      description: 'Mets délicieux, plats régionaux et cuisine aux effets surprenants.', 
      path: '/recipes' 
    },
    { 
      icon: BookOpen, 
      title: 'Livres & Savoirs', 
      description: 'Manuscrits, tomes d\'apprentissage, parchemins et contes.', 
      path: '/books' 
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">

      {/* HEADER DU HUB */}
      <div className="text-center max-w-6xl w-full mb-8 md:mb-12 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-3 md:p-4 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-6 md:mb-8 shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-sm">
            <Gem className="text-[#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl uppercase tracking-tighter leading-none">
            Éléments du <span className="text-[#2DD4BF]">Monde</span>
         </h1>
         <p className="text-sm sm:text-base md:text-lg text-silver/70 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            De la simple plante médicinale à l'artefact capable de fendre les cieux. Gérez les ressources qui façonnent vos univers.
         </p>
      </div>

      {/* GRILLE RESPONSIVE (2 cols mobile, 3 cols tablet, 4 cols très grand écran) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-[1920px] pb-16">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-[2rem] shadow-xl hover:shadow-[#2DD4BF]/20 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-2 md:border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-1"
            >
              <div className="mb-3 md:mb-6 p-2 md:p-4 rounded-xl md:rounded-2xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-300 shadow-inner">
                  <Icon className="text-[#2DD4BF] w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h2 className="text-sm sm:text-base md:text-xl font-black text-soft-white mb-1.5 md:mb-3 group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                  {category.title}
              </h2>
              <p className="text-silver/60 text-[10px] sm:text-xs md:text-sm leading-snug md:leading-relaxed">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}