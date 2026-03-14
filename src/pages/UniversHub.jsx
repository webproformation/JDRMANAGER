import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Calendar, Waves, Moon, ChevronRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * UniversHub - Standard PRESTIGE 4.3.6
 * Hub central de la genèse et de la cosmologie du Multivers.
 */
export default function UniversHub({ onNavigate }) {
  const [activeWorld, setActiveWorld] = useState(localStorage.getItem('activeWorldId') || 'all');
  const [worldName, setWorldName] = useState("Tous les mondes");

  useEffect(() => {
    const fetchWorldName = async () => {
      if (activeWorld !== 'all') {
        const { data } = await supabase.from('worlds').select('name').eq('id', activeWorld).single();
        if (data) setWorldName(data.name);
      } else {
        setWorldName("Tous les mondes");
      }
    };
    fetchWorldName();
    
    const handleWorldUpdate = () => {
      const newId = localStorage.getItem('activeWorldId') || 'all';
      setActiveWorld(newId);
    };
    window.addEventListener('worldChanged', handleWorldUpdate);
    return () => window.removeEventListener('worldChanged', handleWorldUpdate);
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
    // CORRECTIF V4.3.6 : pb-24 pour la navigation mobile, scrollbar prestige
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 animate-in fade-in duration-700 bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent pb-24 md:pb-12">

      {/* HEADER DU HUB : GIGANTISME & HALO */}
      <div className="text-center max-w-6xl w-full mb-12 mt-20 md:mt-8 flex flex-col items-center">
         <div className="inline-flex items-center justify-center p-4 md:p-5 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 mb-8 shadow-[0_0_40px_rgba(45,212,191,0.2)] backdrop-blur-sm animate-pulse-slow">
            <Globe className="text-[#2DD4BF] drop-shadow-[0_0_10px_#2DD4BF]" size={48} />
         </div>
         
         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl uppercase tracking-tighter leading-none">
            Univers de <span className="text-[#2DD4BF] drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">jeux</span>
         </h1>
         
         {/* INDICATEUR DE FOCUS ACTUEL OPTIMISÉ */}
         <div className="flex items-center gap-3 px-8 py-3 bg-black/40 rounded-full border border-[#2DD4BF]/20 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
            <CheckCircle2 size={18} className="text-[#2DD4BF]" />
            <p className="text-[10px] md:text-xs text-silver/70 font-black uppercase tracking-[0.3em]">
              Focus actif : <span className="text-white italic ml-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{worldName}</span>
            </p>
         </div>

         <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent mt-10"></div>
      </div>

      {/* GRILLE DE NAVIGATION DES SOUS-CATÉGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-full max-w-7xl">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.path}
              onClick={() => onNavigate(category.path)}
              className={`relative bg-black/20 backdrop-blur-md border border-white/5 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl hover:shadow-[#2DD4BF]/20 hover:bg-white/5 hover:border-[#2DD4BF]/40 transition-all duration-500 group text-left h-full flex flex-col justify-start border-b-4 border-b-transparent hover:border-b-[#2DD4BF] hover:-translate-y-2 overflow-hidden`}
            >
              {/* Effet de couleur diffuse en arrière-plan */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${category.color} to-transparent blur-[60px] -mr-20 -mt-20 opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="mb-6 p-4 rounded-2xl bg-[#2DD4BF]/10 w-fit group-hover:scale-110 group-hover:bg-[#2DD4BF]/20 transition-all duration-500 shadow-inner border border-[#2DD4BF]/10">
                    <Icon className="text-[#2DD4BF] w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-black text-soft-white group-hover:text-[#2DD4BF] transition-colors uppercase tracking-tight leading-tight">
                      {category.title}
                  </h2>
                  <ChevronRight size={24} className="text-white/10 group-hover:text-[#2DD4BF] transition-all transform group-hover:translate-x-2" />
                </div>
                
                <p className="text-silver/50 text-xs md:text-base leading-relaxed group-hover:text-silver/80 transition-colors">
                  {category.description}
                </p>
              </div>

              {/* Indicateur visuel de bas de carte */}
              <div className="absolute bottom-8 right-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <div className="w-10 h-[2px] bg-[#2DD4BF]/50" />
              </div>
            </button>
          );
        })}
      </div>
      
    </div>
  );
}