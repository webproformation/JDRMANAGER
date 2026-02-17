import React from 'react';
import MediaLibrary from '../components/MediaLibrary';
import { Image } from 'lucide-react';

export default function MediaManagerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-night to-arcane text-soft-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-arcane/30 pb-6">
          <div className="p-3 bg-arcane/20 rounded-lg border border-cyan-light/30">
            <Image size={32} className="text-cyan-light" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-soft-white">Médiathèque Universelle</h1>
            <p className="text-silver mt-1">Gérez l'ensemble des ressources visuelles de vos mondes et campagnes.</p>
          </div>
        </div>

        {/* Le Composant Principal */}
        <MediaLibrary />
        
        {/* Note d'aide */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-yellow-200/70 text-sm">
          💡 <strong>Note :</strong> Les images uploadées ici seront disponibles dans les futurs formulaires de création (Personnages, Lieux, Objets...).
          Assurez-vous de choisir le bon dossier à gauche avant d'uploader.
        </div>
      </div>
    </div>
  );
}