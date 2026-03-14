import React from 'react';
import { 
  Leaf, Gem, Box, Package, Wand2, FlaskConical, UtensilsCrossed, BookOpen 
} from 'lucide-react';

/**
 * WorldElementsHub - Standard PRESTIGE 4.3.6
 * Hub central des ressources, objets et savoirs du Multivers.
 */
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
    // CORRECTIF V4.3.6 : pb-24 pour dégager la navigation mobile
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent pb-24 md:pb-12">

      {/* HEADER DU HUB : GIGANTISME & HALO */}
      <div className="text-center max-w-6xl w-full mb-10 md:mb-16 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-4 md:p-5 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-6 md:mb-8 shadow-[0_0_40px_rgba(45,212,191,0.2)] backdrop-blur-sm animate-pulse-slow">
            <Gem className="text-[#2DD4BF] drop-shadow-[0_0_10px_#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase tracking-tighter leading-none">
            Éléments du <span className="text-[#2DD4BF] drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">Monde</span>
         </h1>
         <p className="text-sm sm:text-base md:text-xl text-silver/70 font-medium max-w-3xl mx-auto leading-relaxed px-4 opacity-80 uppercase tracking-widest">
            Ressources, Artefacts & Savoirs Ancestraux
         </p>
         <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent mt-6"></div>
      </div>

      {/* GRILLE RESPONSIVE : 2 cols mobile, 3 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-[1920px]">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-5 sm:p-7 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl hover:shadow-[#2DD4BF]/20 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-500 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Effet de lueur interne au hover */}
              <div className="absolute inset-0 bg-[#2DD4BF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="mb-4 md:mb-8 p-3 md:p-5 rounded-2xl md:rounded-3xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-500 shadow-inner border border-[#2DD4BF]/10">
                  <Icon className="text-[#2DD4BF] w-6 h-6 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
              </div>
              
              <h2 className="text-base sm:text-lg md:text-2xl font-black text-soft-white mb-2 md:mb-4 group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                  {category.title}
              </h2>
              
              <p className="text-silver/50 text-[10px] sm:text-xs md:text-base leading-snug md:leading-relaxed group-hover:text-silver/80 transition-colors">
                {category.description}
              </p>

              {/* Petit indicateur visuel en bas à droite */}
              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <div className="w-8 h-[2px] bg-[#2DD4BF]" />
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}