import React, { useState, useEffect } from 'react';
import { Globe, Users, Swords, Sparkles, Gem, Hammer, Shield, CheckCircle2 } from 'lucide-react';
import { getRulesetById } from '../services/rulesets';

export default function HomePage({ onNavigate, activeRuleset, onRulesetChange }) {
  // --- ÉTAT POUR LE NOM DU SYSTÈME ACTIF ---
  const [activeSystemName, setActiveSystemName] = useState('Chargement...');

  // Liste des systèmes disponibles pour la "Mémoire"
  const availableSystems = [
    { id: 'dnd5', name: 'Dungeons & Dragons 5E', color: 'from-red-600 to-red-900' },
    { id: 'pathfinder2', name: 'Pathfinder 2E', color: 'from-blue-600 to-blue-900' },
    { id: 'cthulhu', name: 'L\'Appel de Cthulhu', color: 'from-green-700 to-emerald-900' },
    { id: 'agnostic', name: 'Système Agnostique', color: 'from-slate-600 to-slate-800' }
  ];

  // Effet pour mettre à jour le nom affiché dès que le ruleset change dans la mémoire
  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const rules = await getRulesetById(activeRuleset || 'dnd5');
        if (rules) {
          setActiveSystemName(rules.name);
        }
      } catch (error) {
        console.error("Erreur de récupération du système:", error);
        setActiveSystemName("Système agnostique");
      }
    };
    fetchSystem();
  }, [activeRuleset]);

  // --- CONFIGURATION DES HUBS (Inchangée) ---
  const categories = [
    { icon: Globe, title: 'Univers', description: 'Gérez vos mondes, continents, divinités et calendriers temporels.', path: '/univers-hub' },
    { icon: Users, title: 'Peuples & Sociétés', description: 'Découvrez les races, factions, guildes, monstres et langues.', path: '/peoples-hub' },
    { icon: Shield, title: 'Classes & Magie', description: 'Gérez les classes, sorts, dons, maladies et malédictions.', path: '/classes-hub' },
    { icon: Gem, title: 'Éléments du Monde', description: 'Ressources naturelles, objets magiques, potions et savoirs.', path: '/world-elements-hub' },
    { icon: Hammer, title: 'Métiers & Commerces', description: 'Gérez les marchands, auberges, artisans et maîtres.', path: '/professions-hub' },
    { icon: Swords, title: 'Campagnes & Combats', description: 'Scénarios, rencontres, PJ et chronologies des affrontements.', path: '/campaigns-hub' }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">

      {/* HEADER : LOGO & SÉLECTEUR DE MÉMOIRE */}
      <div className="text-center max-w-6xl w-full mb-8 md:mb-12 mt-20 md:mt-12 flex flex-col items-center">
         
         {/* Badge Système Actif (Conservé et rendu dynamique) */}
         <div className="inline-flex items-center justify-center p-2 md:p-3 bg-white/5 rounded-2xl border border-white/10 mb-6 md:mb-8 shadow-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
            <Globe className="text-[#2DD4BF] mr-2" size={16} />
            <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-[#2DD4BF]">
              Moteur Propulsé : {activeSystemName}
            </span>
         </div>

         {/* --- NOUVEAU : SÉLECTEUR DE SESSION (La Mémoire) --- */}
         <div className="mb-10 w-full max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2DD4BF]/60 mb-4">Activation du Contexte de Jeu</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
               {availableSystems.map((sys) => (
                  <button
                    key={sys.id}
                    onClick={() => onRulesetChange(sys.id)}
                    className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden group
                      ${activeRuleset === sys.id 
                        ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                        : 'border-white/5 bg-black/20 hover:border-white/20'}`}
                  >
                     <div className={`absolute inset-0 bg-gradient-to-br ${sys.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                     {activeRuleset === sys.id && (
                        <CheckCircle2 size={14} className="absolute top-2 right-2 text-[#2DD4BF] animate-in zoom-in" />
                     )}
                     <span className={`text-[9px] font-black uppercase tracking-tighter text-center leading-tight z-10 
                       ${activeRuleset === sys.id ? 'text-[#2DD4BF]' : 'text-white/40'}`}>
                        {sys.name}
                     </span>
                  </button>
               ))}
            </div>
         </div>

         {/* Logo Image avec Spotlight Magique (Inchangé) */}
         <div className="relative mb-4 md:mb-6 group cursor-default">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.3)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 blur-2xl mix-blend-screen pointer-events-none rounded-full"></div>
            <img
              src="public/RPGManager-Logo.png"
              alt="Ultimate RPG Manager"
              className="w-auto h-28 sm:h-32 md:h-40 lg:h-48 object-contain relative z-10 transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
            />
         </div>

         <p className="text-xs sm:text-sm md:text-lg text-silver/70 font-medium max-w-2xl mx-auto leading-relaxed px-4 mt-2">
            L'architecture ultime pour sculpter vos univers, forger vos héros et tisser des légendes immortelles.
         </p>
      </div>

      {/* GRILLE DES HUBS RESPONSIVE (2 colonnes sur mobile forcées) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl w-full pb-16">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className="bg-black/20 backdrop-blur-md border border-white/5 p-4 sm:p-6 md:p-10 rounded-xl md:rounded-[2rem] shadow-xl hover:shadow-[#2DD4BF]/20 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-2 md:border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-1"
            >
              <div className="mb-3 md:mb-6 p-2 md:p-4 rounded-xl md:rounded-2xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-300 shadow-inner">
                  <Icon className="text-[#2DD4BF] w-6 h-6 md:w-9 md:h-9" />
              </div>
              <h2 className="text-sm sm:text-base md:text-2xl font-black text-soft-white mb-1.5 md:mb-3 group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                  {category.title}
              </h2>
              <p className="text-silver/60 text-[10px] sm:text-xs md:text-base leading-snug md:leading-relaxed">
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}