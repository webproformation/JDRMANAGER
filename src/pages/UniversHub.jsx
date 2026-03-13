import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Calendar, Waves, Moon, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UniversHub({ onNavigate }) {
  const [activeWorld, setActiveWorld] = useState(localStorage.getItem('activeWorldId') || 'all');
  const [worldName, setWorldName] = useState("Tous les mondes");

  useEffect(() => {
    if (activeWorld !== 'all') {
      supabase.from('worlds').select('name').eq('id', activeWorld).single()
        .then(({ data }) => data && setWorldName(data.name));
    }
  }, [activeWorld]);

  const categories = [
    { 
      icon: Globe, 
      title: 'Mondes & Univers', 
      description: 'Définissez vos cadres de campagne et sélectionnez votre monde actif.', 
      path: '/worlds',
      color: 'from-cyan-500/20'
    },
    { 
      icon: Sparkles, 
      title: 'Dieux & Panthéons', 
      description: 'Gérez les divinités, les cultes et les puissances cosmiques.', 
      path: '/deities',
      color: 'from-amber-500/20'
    },
    { 
      icon: Calendar, 
      title: 'Calendriers & Temps', 
      description: 'Paramétrez les ères, les mois et les cycles temporels.', 
      path: '/calendars',
      color: 'from-emerald-500/20'
    },
    { 
      icon: Waves, 
      title: 'Océans & Mers', 
      description: 'Cartographiez les étendues d\'eau et les secrets abyssaux.', 
      path: '/oceans',
      color: 'from-blue-500/20'
    },
    { 
      icon: Moon, 
      title: 'Astrologie & Cieux', 
      description: 'Gérez les corps célestes, les constellations et les plans.', 
      path: '/celestial-bodies',
      color: 'from-purple-500/20'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin">

      {/* HEADER DU HUB */}
      <div className="text-center max-w-6xl w-full mb-12 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-4 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-8 shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-sm">
            <Globe className="text-[#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl uppercase tracking-tighter leading-none">
            Univers de <span className="text-[#2DD4BF]">jeux</span>
         </h1>
         
         {/* INDICATEUR DE FOCUS ACTUEL */}
         <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 animate-pulse">
            <CheckCircle2 size={16} className="text-[#2DD4BF]" />
            <p className="text-[10px] md:text-xs text-silver/70 font-black uppercase tracking-widest">
              Focus actuel : <span className="text-white italic">{worldName}</span>
            </p>
         </div>
      </div>

      {/* GRILLE DE NAVIGATION DES SOUS-CATÉGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-6xl pb-16">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className={`relative bg-black/20 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl hover:shadow-[#2DD4BF]/10 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-300 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-1 overflow-hidden`}
            >
              {/* Effet de couleur en arrière-plan */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} to-transparent blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="mb-6 p-4 rounded-2xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-300 shadow-inner">
                    <Icon className="text-[#2DD4BF] w-8 h-8" />
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl md:text-2xl font-black text-soft-white group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight">
                      {category.title}
                  </h2>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-[#2DD4BF] transition-all transform group-hover:translate-x-1" />
                </div>
                
                <p className="text-silver/60 text-xs md:text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}