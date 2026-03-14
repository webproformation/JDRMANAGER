import React from 'react';
import { 
  Users, Skull, Footprints, Building, Ghost, Languages, ChevronRight
} from 'lucide-react';

/**
 * PeoplesHub - Standard PRESTIGE 4.3.6
 * Hub central des populations, organisations et cultures du Multivers.
 */
export default function PeoplesHub({ onNavigate }) {
  const categories = [
    { 
      icon: Users, 
      title: 'Races', 
      description: 'Découvrez les peuples civilisés, leurs cultures et leurs origines.', 
      path: '/races' 
    },
    { 
      icon: Skull, 
      title: 'Monstres', 
      description: 'Affrontez les créatures dangereuses, aberrations et bêtes magiques.', 
      path: '/monsters' 
    },
    { 
      icon: Footprints, 
      title: 'Animaux', 
      description: 'Rencontrez la faune sauvage, les montures et familiers domestiques.', 
      path: '/animals' 
    },
    { 
      icon: Building, 
      title: 'Guildes', 
      description: 'Syndicats, confréries marchandes et organisations d\'artisans.', 
      path: '/guilds' 
    },
    { 
      icon: Ghost, 
      title: 'Sectes & Factions', 
      description: 'Cultes secrets, sociétés de l\'ombre et confréries mystiques.', 
      path: '/sects' 
    },
    { 
      icon: Languages, 
      title: 'Langages', 
      description: 'Dialectes, alphabets anciens et moyens de communication divers.', 
      path: '/languages' 
    }
  ];

  return (
    // CORRECTIF V4.3.6 : pb-24 pour dégager la navigation mobile, scrollbar prestige
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent pb-24 md:pb-12">

      {/* HEADER DU HUB : GIGANTISME & IMPACT */}
      <div className="text-center max-w-6xl w-full mb-10 md:mb-16 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-4 md:p-5 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-6 md:mb-8 shadow-[0_0_40px_rgba(45,212,191,0.2)] backdrop-blur-sm animate-pulse-slow">
            <Users className="text-[#2DD4BF] drop-shadow-[0_0_10px_#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase tracking-tighter leading-none">
            Peuples & <span className="text-[#2DD4BF] drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">Sociétés</span>
         </h1>
         <p className="text-sm sm:text-base md:text-xl text-silver/70 font-medium max-w-3xl mx-auto leading-relaxed px-4 opacity-80 uppercase tracking-widest">
            Habitants, Organisations & Cultures de l'Omnivers
         </p>
         <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent mt-10"></div>
      </div>

      {/* GRILLE RESPONSIVE : 2 colonnes mobile, 3 colonnes desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-5 sm:p-7 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl hover:shadow-[#2DD4BF]/20 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-500 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Overlay de lueur interne au survol */}
              <div className="absolute inset-0 bg-[#2DD4BF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="mb-4 md:mb-8 p-3 md:p-5 rounded-2xl md:rounded-3xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-500 shadow-inner border border-[#2DD4BF]/10">
                  <Icon className="text-[#2DD4BF] w-6 h-6 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
              </div>
              
              <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-base sm:text-lg md:text-2xl font-black text-soft-white group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                    {category.title}
                </h2>
                <ChevronRight size={20} className="text-white/10 group-hover:text-[#2DD4BF] transition-all transform group-hover:translate-x-2 hidden sm:block" />
              </div>
              
              <p className="text-silver/50 text-[10px] sm:text-xs md:text-base leading-snug md:leading-relaxed group-hover:text-silver/80 transition-colors">
                {category.description}
              </p>

              {/* Indicateur visuel prestige en bas à droite */}
              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <div className="w-8 h-[2px] bg-[#2DD4BF]/60" />
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}