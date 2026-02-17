import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Folder, Image as ImageIcon, Loader, RefreshCw } from 'lucide-react';
import { storageService, StorageFolder, ALLOWED_FOLDERS, FileObject } from '../services/storageService';

interface MediaLibraryProps {
  onSelect?: (url: string) => void; // Optionnel : si utilisé comme sélecteur
  initialFolder?: StorageFolder;    // Optionnel : pour forcer un dossier par défaut
}

export default function MediaLibrary({ onSelect, initialFolder = 'worlds' }: MediaLibraryProps) {
  const [currentFolder, setCurrentFolder] = useState<StorageFolder>(initialFolder);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Chargement des images
  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await storageService.listFiles(currentFolder);
      setFiles(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Changement de dossier -> Rechargement
  useEffect(() => {
    loadFiles();
  }, [currentFolder]);

  // Gestion de l'Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploading(true);
    const file = event.target.files[0];
    try {
      await storageService.uploadFile(currentFolder, file);
      await loadFiles(); // On rafraîchit la liste
    } catch (error) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  // Gestion de la Suppression
  const handleDelete = async (fileName: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image définitivement ?")) return;
    
    try {
      await storageService.deleteFile(currentFolder, fileName);
      setFiles(files.filter(f => f.name !== fileName));
    } catch (error) {
      alert("Impossible de supprimer l'image");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] bg-night/80 backdrop-blur-md border border-arcane/30 rounded-xl overflow-hidden shadow-2xl">
      
      {/* 1. SIDEBAR (Dossiers) */}
      <div className="w-full md:w-64 bg-black/40 border-r border-arcane/20 p-4 overflow-y-auto scrollbar-thin">
        <h3 className="text-cyan-light font-bold mb-4 flex items-center gap-2">
          <Folder size={18} /> Dossiers
        </h3>
        <ul className="space-y-1">
          {ALLOWED_FOLDERS.map((folder) => (
            <li key={folder}>
              <button
                onClick={() => setCurrentFolder(folder)}
                className={`w-full text-left px-4 py-2 rounded-md transition-all flex items-center gap-2 text-sm
                  ${currentFolder === folder 
                    ? 'bg-cyan-light/20 text-cyan-light border border-cyan-light/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-silver hover:bg-white/5 hover:text-white'
                  }`}
              >
                {/* Icône conditionnelle simple */}
                <span className="opacity-70">📂</span>
                <span className="capitalize">{folder}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. MAIN CONTENT (Grille & Upload) */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-arcane/20 bg-black/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-soft-white capitalize flex items-center gap-2">
            {currentFolder} <span className="text-sm font-normal text-silver">({files.length} fichiers)</span>
          </h2>
          
          <div className="flex gap-3">
             <button 
                onClick={loadFiles} 
                className="p-2 text-silver hover:text-cyan-light transition-colors"
                title="Actualiser"
             >
               <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
             </button>

             <label className={`
                flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all
                ${uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-arcane hover:bg-arcane/80 text-white shadow-lg hover:shadow-cyan-light/20'}
             `}>
               {uploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
               <span className="font-semibold">{uploading ? 'Envoi...' : 'Uploader'}</span>
               <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
               />
             </label>
          </div>
        </div>

        {/* Grille d'images */}
        <div className="flex-1 p-6 overflow-y-auto bg-black/20">
          {loading ? (
             <div className="flex items-center justify-center h-full text-cyan-light">
               <Loader size={48} className="animate-spin" />
             </div>
          ) : files.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-silver/40 border-2 border-dashed border-silver/10 rounded-xl">
               <ImageIcon size={64} className="mb-4 opacity-50" />
               <p>Ce dossier est vide.</p>
               <p className="text-sm">Uploadez une image pour commencer.</p>
             </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
               {files.map((file) => {
                 const publicUrl = storageService.getPublicUrl(currentFolder, file.name);
                 return (
                   <div key={file.name} className="group relative bg-night border border-arcane/30 rounded-lg overflow-hidden hover:border-cyan-light transition-all shadow-md hover:shadow-cyan-light/20 aspect-square flex flex-col">
                     
                     {/* Image Thumbnail */}
                     <div className="flex-1 overflow-hidden relative cursor-pointer bg-black/50"
                          onClick={() => onSelect && onSelect(publicUrl)}
                     >
                       <img 
                         src={publicUrl} 
                         alt={file.name} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                         loading="lazy"
                       />
                       
                       {/* Overlay au survol */}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {onSelect ? (
                            <span className="text-cyan-light font-bold border border-cyan-light px-3 py-1 rounded-full bg-black/50 backdrop-blur">
                              Sélectionner
                            </span>
                          ) : (
                            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-soft-white hover:text-cyan-light">
                              Voir en grand
                            </a>
                          )}
                       </div>
                     </div>

                     {/* Footer (Nom + Delete) */}
                     <div className="p-2 bg-night/90 flex justify-between items-center text-xs border-t border-arcane/20">
                       <span className="truncate text-silver max-w-[70%]" title={file.name}>
                         {file.name}
                       </span>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                         className="text-red-400 hover:text-red-200 p-1 hover:bg-red-500/20 rounded"
                         title="Supprimer"
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>

                   </div>
                 );
               })}
             </div>
          )}
        </div>

      </div>
    </div>
  );
}