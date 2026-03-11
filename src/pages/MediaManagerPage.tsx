import React from 'react';
import MediaLibrary from '../components/MediaLibrary';
import { Image } from 'lucide-react';

export default function MediaManagerPage() {
  return (
    <div className="min-h-screen bg-transparent text-soft-white p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Prestige - Écart réduit (mb-5 et pb-4) */}
        <div className="flex items-center gap-5 mb-5 border-b border-white/5 pb-4">
          <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl border border-[#2DD4BF]/20 shadow-lg shadow-[#2DD4BF]/5">
            <Image size={28} className="text-[#2DD4BF]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Médiathèque <span className="text-[#2DD4BF]">Universelle</span>
            </h1>
            <p className="text-silver/60 text-[10px] font-black tracking-[0.2em] mt-0.5 uppercase">
              Gestionnaire de ressources visuelles agnostique v2.0
            </p>
          </div>
        </div>

        {/* Le Composant Principal */}
        <MediaLibrary />
        
        {/* Note d'aide compactée */}
        <div className="mt-8 p-4 bg-vtt-card-bg/60 backdrop-blur-md border border-white/5 rounded-2xl text-silver/70 text-[11px] flex items-start gap-4">
          <div className="p-1.5 bg-[#2DD4BF]/10 rounded-lg text-[#2DD4BF] font-bold">💡</div>
          <p className="leading-relaxed">
            <strong className="text-white uppercase tracking-wider text-[10px] block mb-1">Protocole d'Indexation :</strong> 
            Toutes les images déposées ici sont indexées de manière universelle pour vos grimoires et fiches d'entités.
          </p>
        </div>
      </div>
    </div>
  );
}