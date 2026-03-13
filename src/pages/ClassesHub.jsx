import React from 'react';
import { 
  Shield, Wand2, Sparkles, Award, Skull, HeartPulse 
} from 'lucide-react';

export default function ClassesHub({ onNavigate }) {
  const categories = [
    { 
      icon: Shield, 
      title: 'Classes', 
      description: 'Archétypes de personnages, voies martiales et profils de héros.', 
      path: '/classes' 
    },
    { 
      icon: Wand2, 
      title: 'Capacités de Classes', 
      description: 'Compétences, talents, et traits spécifiques liés aux vocations.', 
      path: '/class-features' 
    },
    { 
      icon: Sparkles, 
      title: 'Sorts & Grimoires', 
      description: 'Magie arcanique, divine, incantations et rituels de puissance.', 
      path: '/spells' 
    },
    { 
      icon: Award, 
      title: 'Dons & Prouesses', 
      description: 'Avantages uniques, spécialisations et exploits héroïques.', 
      path: '/feats' 
    },
    { 
      icon: Skull, 
      title: 'Malédictions', 
      description: 'Sortilèges persistants, afflictions magiques et mauvais œil.', 
      path: '/curses' 
    },
    { 
      icon: HeartPulse, 
      title: 'Maladies', 
      description: 'Fléaux naturels, épidémies et poisons affectant le corps.', 
      path: '/diseases' 
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">

      {/* HEADER DU HUB */}
      <div className="text-center max-w-6xl w-full mb-8 md:mb-12 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-3 md:p-4 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-6 md:mb-8 shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-sm">
            <Shield className="text-[#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl uppercase tracking-tighter leading-none">
            Classes & <span className="text-[#2DD4BF]">Magie</span>
         </h1>
         <p className="text-sm sm:text-base md:text-lg text-silver/70 font-medium max-w-3xl mx-auto leading-relaxed px-4">
            Forgez l'évolution de vos héros. Des talents martiaux bruts aux mystères des arcanes les plus sombres.
         </p>
      </div>

      {/* GRILLE RESPONSIVE (2 colonnes mobile, 3 colonnes desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-6xl pb-16">
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