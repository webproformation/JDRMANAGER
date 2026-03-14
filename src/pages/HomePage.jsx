import React, { useState, useEffect } from 'react';
import { Globe, Users, Swords, Sparkles, Gem, Hammer, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import { getRulesetById } from '../services/rulesets';

/**
 * HomePage - Standard PRESTIGE 4.3.6
 * Le Nexus central du Multivers.
 */
export default function HomePage({ onNavigate, activeRuleset, onRulesetChange }) {
  const [activeSystemName, setActiveSystemName] = useState('Déchiffrement...');

  // Liste des systèmes pour la Double Mémoire
  const availableSystems = [
    { id: 'dnd5', name: 'Dungeons & Dragons 5E', color: 'from-red-500 to-red-900' },
    { id: 'pathfinder2', name: 'Pathfinder 2E', color: 'from-blue-500 to-blue-900' },
    { id: 'cthulhu', name: 'L\'Appel de Cthulhu', color: 'from-green-600 to-emerald-900' },
    { id: 'agnostic', name: 'Système Agnostique', color: 'from-slate-500 to-slate-800' }
  ];

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const rules = await getRulesetById(activeRuleset || 'dnd5');
        if (rules) setActiveSystemName(rules.name);
      } catch (error) {
        setActiveSystemName("Système Universel");
      }
    };
    fetchSystem();
  }, [activeRuleset]);

  const categories = [
    { icon: Globe, title: 'Univers', description: 'Mondes, Panthéons, Chronologies et Astrologie.', path: '/univers-hub' },
    { icon: Users, title: 'Peuples', description: 'Races, Factions, Bestiaire et Langages.', path: '/peoples-hub' },
    { icon: Shield, title: 'Magie', description: 'Grimoires, Sorts, Classes et Dons.', path: '/classes-hub' },
    { icon: Gem, title: 'Éléments', description: 'Artisanat, Objets, Potions et Savoirs.', path: '/world-elements-hub' },
    { icon: Hammer, title: 'Métiers', description: 'Commerces, Artisans et Maîtres d\'apprentissage.', path: '/professions-hub' },
    { icon: Swords, title: 'Campagnes', description: 'Scénarios, Chroniques et Gestes Héroïques.', path: '/campaigns-hub' }
  ];

  return (
    // CORRECTIF V4.3.6 : pb-24 pour libérer la navigation mobile
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin pb-24 md:pb-12">

      {/* HEADER : BADGE & SÉLECTEUR DE CONTEXTE */}
      <div className="text-center max-w-6xl w-full mb-12 mt-20 md:mt-8 flex flex-col items-center">
         
         {/* Badge Dynamique */}
         <div className="inline-flex items-center justify-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10 mb-10 shadow-2xl backdrop-blur-md animate-pulse-slow">
            <Sparkles className="text-[#2DD4BF] mr-3" size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF]">
              Moteur Actif : {activeSystemName}
            </span>
         </div>

         {/* Sélecteur de Contexte (La Mémoire) */}
         <div className="mb-14 w-full max-w-5xl">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-silver/30 mb-6">Initialisation du Système de Règles</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
               {availableSystems.map((sys) => (
                  <button
                    key={sys.id}
                    onClick={() => onRulesetChange(sys.id)}
                    className={`relative p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-2 overflow-hidden group
                      ${activeRuleset === sys.id 
                        ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 shadow-[0_0_30px_rgba(45,212,191,0.15)] scale-105' 
                        : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-black/60'}`}
                  >
                     <div className={`absolute inset-0 bg-gradient-to-br ${sys.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                     {activeRuleset === sys.id && (
                        <CheckCircle2 size={16} className="absolute top-3 right-3 text-[#2DD4BF] animate-in zoom-in duration-500" />
                     )}
                     <span className={`text-[10px] font-black uppercase tracking-tighter text-center leading-tight z-10 transition-colors
                       ${activeRuleset === sys.id ? 'text-[#2DD4BF]' : 'text-silver/40'}`}>
                        {sys.name}
                     </span>
                  </button>
               ))}
            </div>
         </div>

         {/* Logo RPG Manager avec Halo Sarcelle */}
         <div className="relative mb-6 group cursor-default">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.2)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-all duration-1000 blur-3xl rounded-full"></div>
            <img
              src="/RPGManager-Logo.png"
              alt="Ultimate RPG Manager"
              className="w-auto h-32 sm:h-40 md:h-52 lg:h-64 object-contain relative z-10 transition-transform duration-1000 group-hover:scale-105 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
         </div>

         <p className="text-sm sm:text-base md:text-xl text-silver/60 font-medium max-w-2xl mx-auto leading-relaxed px-6 mt-4 italic opacity-80">
           "Forgez des mondes, érigez des légendes, dominez le destin."
         </p>
         <div className="w-16 h-1 bg-[#2DD4BF]/30 rounded-full mt-8"></div>
      </div>

      {/* GRILLE DES HUBS : PRESTIGE LAYOUT */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl w-full">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-xl border border-white/5 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-2xl hover:shadow-[#2DD4BF]/10 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-500 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Overlay de lueur interne au survol */}
              <div className="absolute inset-0 bg-[#2DD4BF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="mb-6 p-4 rounded-2xl md:rounded-3xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-500 shadow-inner border border-[#2DD4BF]/10">
                  <Icon className="text-[#2DD4BF] w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
              </div>
              
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-base sm:text-lg md:text-2xl font-black text-soft-white group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                    {category.title}
                </h2>
                <ChevronRight size={20} className="text-white/10 group-hover:text-[#2DD4BF] transition-all transform group-hover:translate-x-2 hidden sm:block" />
              </div>
              
              <p className="text-silver/50 text-[10px] sm:text-xs md:text-base leading-snug md:leading-relaxed group-hover:text-silver/80 transition-colors">
                {category.description}
              </p>

              {/* Indicateur visuel prestige en bas à droite */}
              <div className="absolute bottom-8 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                <div className="w-10 h-[2px] bg-[#2DD4BF]/50" />
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}