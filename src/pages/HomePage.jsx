import React, { useState, useEffect } from 'react';
import { Globe, Users, Swords, Dna } from 'lucide-react'; // J'ai ajouté l'icône Dna pour le "Système"
import { getRulesetById } from '../services/rulesets';

export default function HomePage({ onNavigate }) {
  // --- 1. ÉTAT POUR LE SYSTÈME DE RÈGLES ---
  const [activeSystem, setActiveSystem] = useState('Chargement...');

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        // On récupère le ruleset 'dnd5' (ou celui configuré par défaut)
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

  // --- 2. TA CONFIGURATION DE MENU ---
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane">
      <div className="text-center p-12 w-full max-w-7xl">
        
        {/* TITRE PRINCIPAL */}
        <h1 className="text-6xl font-bold text-cyan-light mb-4 drop-shadow-lg">
          JDR Manager
        </h1>

        {/* --- NOUVEAU : BADGE DU SYSTÈME ACTIF --- */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-night/50 border border-arcane/50 backdrop-blur-sm mb-8 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <Dna size={16} className="text-cyan-light animate-pulse" />
          <span className="text-silver text-xs uppercase tracking-wider font-semibold">Moteur de règles :</span>
          <span className="text-cyan-light font-bold text-sm">{activeSystem}</span>
        </div>
        {/* ---------------------------------------- */}

        <p className="text-2xl text-soft-white mb-12 drop-shadow">
          Système complet de gestion de campagnes de jeu de rôle
        </p>

        {/* GRILLE DE BOUTONS (Ton design original préservé) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.path}
                onClick={() => onNavigate(category.path)}
                className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-light/30 hover:border-cyan-light hover:border-opacity-100 transition-all duration-300 group text-center cursor-pointer flex flex-col items-center h-full"
              >
                <div className="mb-6 p-4 rounded-full bg-arcane/10 group-hover:bg-cyan-light/10 transition-colors">
                    <Icon size={64} className="text-cyan-light group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h2 className="text-2xl font-bold text-soft-white mb-3 group-hover:text-cyan-light transition-colors">{category.title}</h2>
                <p className="text-silver leading-relaxed">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-16 text-silver/40 text-sm">
          <p>Initialisation du noyau • Prêt pour l'aventure</p>
        </div>
      </div>
    </div>
  );
}