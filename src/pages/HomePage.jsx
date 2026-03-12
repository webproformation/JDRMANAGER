import React, { useState, useEffect } from 'react';
import { Globe, Users, Swords, Dna } from 'lucide-react';
import { getRulesetById } from '../services/rulesets';

export default function HomePage({ onNavigate }) {
  // --- 1. ÉTAT POUR LE SYSTÈME DE RÈGLES ---
  const [activeSystem, setActiveSystem] = useState('Chargement...');

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        // On récupère le ruleset par défaut 'dnd5'
        const rules = await getRulesetById('dnd5');
        if (rules) {
          setActiveSystem(rules.name);
        }
      } catch (error) {
        console.error("Erreur de récupération du système:", error);
        setActiveSystem("Hors ligne");
      }
    };
    fetchSystem();
  }, []);

  // --- 2. CONFIGURATION DE MENU ---
  const categories = [
    {
      icon: Globe,
      title: 'Univers',
      description: 'Créez et gérez vos mondes, peuples, créatures et éléments naturels',
      path: '/univers-hub'
    },
    {
      icon: Users,
      title: 'PJ & PNJS',
      description: 'Gérez vos personnages joueurs et non-joueurs avec des fiches détaillées',
      path: '/characters'
    },
    {
      icon: Swords,
      title: 'Campagnes & Combats',
      description: 'Organisez vos campagnes, gérez les combats avec initiative et battlemaps',
      path: '/campaigns'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-transparent">
      <div className="text-center max-w-7xl">
        
        {/* TITRE PRINCIPAL - Style Prestige 2.0 */}
        <h1 className="text-7xl font-black text-[#2DD4BF] mb-4 drop-shadow-lg uppercase tracking-tighter">
          JDR Manager
        </h1>

        {/* BADGE DU SYSTÈME ACTIF - Version harmonisée */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md mb-12 shadow-xl">
          <Dna size={18} className="text-[#2DD4BF] animate-pulse" />
          <span className="text-silver/70 text-xs uppercase tracking-widest font-black">Moteur de règles :</span>
          <span className="text-[#2DD4BF] font-bold text-sm">{activeSystem}</span>
        </div>

        <p className="text-2xl text-soft-white/80 mb-16 font-medium drop-shadow max-w-3xl mx-auto">
          Système complet de gestion de campagnes de jeu de rôle
        </p>

        {/* GRILLE DE CATÉGORIES - Miroir du WorldElementsHub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.path}
                onClick={() => onNavigate(category.path)}
                className="bg-black/20 backdrop-blur-md border border-white/5 p-10 rounded-2xl shadow-lg hover:shadow-[#2DD4BF]/10 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF]"
              >
                <div className="mb-6 p-4 rounded-2xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon size={56} className="text-[#2DD4BF]" />
                </div>
                <h2 className="text-2xl font-black text-soft-white mb-4 group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight">
                    {category.title}
                </h2>
                <p className="text-silver/70 text-base leading-relaxed">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* FOOTER TECHNIQUE */}
        <div className="mt-20 text-silver/30 text-[10px] font-black uppercase tracking-[0.4em]">
          <p>Initialisation du noyau • Standard Prestige 2.0 • Prêt pour l'aventure</p>
        </div>
      </div>
    </div>
  );
}