import React from 'react';
import MediaLibrary from '../components/MediaLibrary';
import { Image, Info, ShieldCheck } from 'lucide-react';

/**
 * MediaManagerPage - Standard PRESTIGE 4.3.6
 * Centre de gestion des archives visuelles du Multivers.
 */
export default function MediaManagerPage() {
  return (
    // CORRECTIF V4.3.6 : pb-24 pour dégager la navigation mobile, h-full pour le scroll
    <div className="min-h-screen bg-transparent text-soft-white p-4 sm:p-6 md:p-8 animate-in fade-in duration-700 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER PRESTIGE XXL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-8 mt-16 md:mt-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.15)] backdrop-blur-sm animate-pulse-slow">
              <Image size={40} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                Médiathèque <span className="text-[#2DD4BF] drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]">Universelle</span>
              </h1>
              <p className="text-silver/50 text-[10px] md:text-xs font-black tracking-[0.3em] mt-2 uppercase">
                Archives Visuelles & Gestionnaire de Ressources v2.0
              </p>
            </div>
          </div>

          {/* Indicateur de statut agnostique */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full border border-white/10">
            <ShieldCheck size={14} className="text-[#2DD4BF]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-silver/60">Stockage Sécurisé</span>
          </div>
        </div>

        {/* LE COMPOSANT PRINCIPAL (Moteur d'indexation) */}
        <div className="bg-black/10 rounded-[2.5rem] border border-white/5 p-2 shadow-2xl overflow-hidden">
           <MediaLibrary />
        </div>
        
        {/* PROTOCOLE D'AIDE PRESTIGE */}
        <div className="mt-10 p-6 bg-[#151725]/60 backdrop-blur-xl border border-[#2DD4BF]/10 rounded-[2rem] shadow-xl group hover:border-[#2DD4BF]/30 transition-all duration-500">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl text-[#2DD4BF] group-hover:scale-110 transition-transform">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[#2DD4BF] font-black uppercase tracking-[0.2em] text-xs">Protocole d'Indexation Multiverselle</h4>
              <p className="text-silver/70 text-xs md:text-sm leading-relaxed max-w-4xl">
                Toutes les images déposées au sein de cette médiathèque sont indexées de manière agnostique. 
                Elles deviennent instantanément disponibles pour l'ensemble de vos mondes, grimoires de sorts et fiches d'entités via les sélecteurs visuels.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}