import React from 'react';
import MediaLibrary from '../components/MediaLibrary';
import { Info } from 'lucide-react';

/**
 * MediaManagerPage - Standard PRESTIGE 4.5.9
 * Page conteneur pour la Médiathèque Universelle.
 * Le Header est désormais géré en interne par le composant MediaLibrary.
 */
export default function MediaManagerPage() {
  return (
    // pb-24 pour dégager la navigation mobile, mt-16 pour laisser de l'espace sous le header global sur mobile
    <div className="min-h-screen bg-transparent text-soft-white p-4 sm:p-6 md:p-8 animate-in fade-in duration-700 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* LE COMPOSANT PRINCIPAL (Moteur d'indexation autonome) */}
        <div className="bg-black/10 rounded-[2.5rem] border border-white/5 p-2 shadow-2xl overflow-hidden mt-8 md:mt-0">
           <MediaLibrary />
        </div>
        
        {/* PROTOCOLE D'AIDE PRESTIGE */}
        <div className="p-6 bg-[#151725]/60 backdrop-blur-xl border border-[#2DD4BF]/10 rounded-[2rem] shadow-xl group hover:border-[#2DD4BF]/30 transition-all duration-500">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl text-[#2DD4BF] group-hover:scale-110 transition-transform">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[#2DD4BF] font-black uppercase tracking-[0.2em] text-xs">Protocole d'Indexation Multiverselle</h4>
              <p className="text-silver/70 text-xs md:text-sm leading-relaxed max-w-4xl">
                Toutes les images déposées au sein de cette médiathèque sont indexées de manière agnostique. 
                Elles deviennent instantanément disponibles pour l'ensemble de vos mondes, grimoires de sorts et fiches d'entités via les sélecteurs visuels (onOpenPicker).
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}