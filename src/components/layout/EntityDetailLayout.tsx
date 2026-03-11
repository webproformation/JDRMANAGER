import React from 'react';
import { ArrowLeft } from 'lucide-react';

// Si tu n'utilises pas TypeScript, tu peux retirer les interfaces
interface ActionButton {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface EntityDetailLayoutProps {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  backgroundImage?: string;
  image?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  onBack: () => void;
  actions?: ActionButton[];
}

export default function EntityDetailLayout({
  title,
  subtitle,
  icon: Icon,
  backgroundImage,
  image,
  children,
  sidebar,
  onBack,
  actions
}: EntityDetailLayoutProps) {

  // Fallback si pas d'image : On utilise le dégradé "Ultimate" définit dans ton Tailwind
  const hasBg = !!backgroundImage;

  return (
    // CHANGEMENT : Fond principal utilisant le dégradé spectral global
    <div className="fixed inset-0 z-50 bg-ultimate-gradient text-soft-white overflow-y-auto animate-in slide-in-from-bottom-5 duration-300 scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-black/20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden border-b border-[#2DD4BF]/10">
        
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0">
          {hasBg ? (
            <img src={backgroundImage} alt="Background" className="w-full h-full object-cover blur-sm opacity-40 scale-105" />
          ) : (
            // Utilisation du violet spectral profond pour le header si pas d'image
            <div className="w-full h-full bg-gradient-to-br from-[#583B84]/40 via-[#1B2A3F] to-[#1B2A3F]" />
          )}
          {/* Overlay dégradé vers le bas pour fusionner avec le contenu */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A3F] via-transparent to-transparent" />
        </div>

        {/* CONTENU DU HEADER */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
          
          {/* Bouton Retour (Version Teal Premium) */}
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 p-3 bg-black/30 backdrop-blur-xl rounded-full hover:bg-[#2DD4BF]/20 transition-all text-white/70 hover:text-[#2DD4BF] border border-white/5 group shadow-2xl"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex items-end gap-8">
            {/* Portrait / Carte Visuelle (Cadre Violet Profond) */}
            <div className="hidden md:block w-44 h-44 rounded-2xl border-4 border-vtt-card-bg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 bg-vtt-card-bg relative z-10">
              {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2DD4BF]/5 text-[#2DD4BF]/30">
                  <Icon size={56} />
                </div>
              )}
            </div>

            {/* Titres et Badges */}
            <div className="flex-1 mb-2 relative z-10">
              <div className="flex items-center gap-3 text-[#2DD4BF] mb-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#2DD4BF]/10 rounded-full border border-[#2DD4BF]/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em]">
                  <Icon size={14} />
                  <span>Entité</span>
                </div>
                {subtitle && <span className="text-white/40 text-xs font-black tracking-[0.15em] uppercase border-l border-white/10 pl-4">{subtitle}</span>}
              </div>
              
              {/* Titre Ultra-Prestige */}
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl uppercase italic">
                {title}
              </h1>
            </div>

            {/* Actions (Boutons Teal) */}
            {actions && (
              <div className="flex gap-3 mb-6 relative z-10">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl backdrop-blur-md border
                      ${action.variant === 'danger' 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                        : 'bg-white/5 border-white/10 text-white hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF] hover:bg-[#2DD4BF]/5'}
                    `}
                  >
                    <action.icon size={16} />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* MAIN CONTENT (Left) - Carte Violet Spectral */}
          <div className="lg:col-span-8 space-y-12 bg-vtt-card-bg/40 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl">
            {children}
          </div>

          {/* SIDEBAR (Right) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {sidebar}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}