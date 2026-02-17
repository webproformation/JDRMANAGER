import React from 'react';
import { ArrowLeft } from 'lucide-react';

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

  // Fallback si pas d'image : un beau dégradé "cosmique"
  const hasBg = !!backgroundImage;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f111a] text-soft-white overflow-y-auto animate-in slide-in-from-bottom-5 duration-300 scrollbar-thin scrollbar-thumb-arcane/20 scrollbar-track-night">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden border-b border-cyan-light/10">
        
        {/* BACKGROUND LAYER */}
        <div className="absolute inset-0">
          {hasBg ? (
            <img src={backgroundImage} alt="Background" className="w-full h-full object-cover blur-sm opacity-50 scale-105" />
          ) : (
            // Ce dégradé remplace l'image manquante
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0f111a] to-[#0f111a]" />
          )}
          {/* Overlay pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/60 to-transparent" />
        </div>

        {/* CONTENU DU HEADER */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
          
          {/* Bouton Retour (Mieux placé) */}
          <button 
            onClick={onBack}
            className="absolute top-8 left-6 p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-white/10 transition-all text-silver hover:text-white border border-white/5 group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex items-end gap-8">
            {/* Portrait (Carte) */}
            <div className="hidden md:block w-40 h-40 rounded-2xl border-4 border-[#0f111a] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 bg-black/50 relative z-10">
              {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-arcane/10 text-arcane/30">
                  <Icon size={48} />
                </div>
              )}
            </div>

            {/* Titres et Actions */}
            <div className="flex-1 mb-2 relative z-10">
              <div className="flex items-center gap-3 text-cyan-light mb-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-cyan-light/10 rounded-full border border-cyan-light/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest">
                  <Icon size={14} />
                  <span>Entité</span>
                </div>
                {subtitle && <span className="text-silver/60 text-sm font-medium tracking-wider uppercase border-l border-white/10 pl-3">{subtitle}</span>}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl font-serif">
                {title}
              </h1>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex gap-3 mb-4 relative z-10">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg backdrop-blur-sm border
                      ${action.variant === 'danger' 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-light/50 hover:shadow-cyan-light/10'}
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
          
          {/* MAIN CONTENT (Left) */}
          <div className="lg:col-span-8 space-y-16">
            {children}
          </div>

          {/* SIDEBAR (Right) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              {sidebar}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}