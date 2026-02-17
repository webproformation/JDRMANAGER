import React, { useState } from 'react';
import { Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';
import Modal from './Modal';
import MediaLibrary from './MediaLibrary';
import { StorageFolder } from '../services/storageService';

interface ImagePickerProps {
  value: string;              // L'URL actuelle de l'image
  onChange: (url: string) => void; // Fonction pour mettre à jour l'URL
  label?: string;             // Label du champ (ex: "Image de couverture")
  folder?: StorageFolder;     // Dossier par défaut à ouvrir (ex: 'worlds')
}

export default function ImagePicker({ value, onChange, label = "Image", folder = "worlds" }: ImagePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quand on choisit une image dans la médiathèque
  const handleSelectImage = (url: string) => {
    onChange(url);
    setIsModalOpen(false); // On ferme la popup
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-silver">{label}</label>
      
      <div className="flex items-start gap-4">
        {/* Zone d'aperçu / Bouton */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`
            relative group cursor-pointer border-2 border-dashed rounded-lg transition-all overflow-hidden
            ${value ? 'border-arcane/50' : 'border-silver/20 hover:border-cyan-light/50 hover:bg-white/5'}
            h-48 w-full sm:w-64 flex flex-col items-center justify-center
          `}
        >
          {value ? (
            <>
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
              {/* Overlay au survol */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="flex items-center gap-2 text-cyan-light font-bold">
                  <Edit2 size={16} /> Changer
                </span>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <ImageIcon size={32} className="mx-auto mb-2 text-silver/50 group-hover:text-cyan-light transition-colors" />
              <p className="text-sm text-silver group-hover:text-soft-white">Choisir une image</p>
            </div>
          )}
        </div>

        {/* Bouton de suppression (si une image est sélectionnée) */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
            title="Supprimer l'image"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* --- LA POPUP MÉDIATHÈQUE --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Médiathèque Universelle"
      >
        {/* On passe handleSelectImage pour que le clic sur une image ferme la modale et mette à jour le champ */}
        <MediaLibrary 
          onSelect={handleSelectImage} 
          initialFolder={folder} 
        />
      </Modal>
    </div>
  );
}