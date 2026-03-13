import React, { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * MediaScreensaver - Standard PRESTIGE 4.2 FINAL
 * Vue de diaporama immersive avec pile de photos accumulées.
 * Style : Photos physiques, cadre fin, rotation et accumulation aléatoires.
 */
export default function MediaScreensaver({ isOpen, onClose }) {
  const [allImages, setAllImages] = useState([]);
  const [stack, setStack] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Chargement des images depuis la table 'media_items'
  useEffect(() => {
    const fetchMedia = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('media_items')
          .select('url')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setAllImages(data.map(img => img.url));
        }
      } catch (err) {
        console.error("Erreur de chargement des archives :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [isOpen]);

  // 2. Logique de chute d'une nouvelle photo
  const dropNextPhoto = useCallback(() => {
    if (allImages.length === 0) return;

    const nextPhoto = {
      url: allImages[currentIndex],
      id: Date.now(),
      // --- MODIFICATION : Angle aléatoire plus important (Plage de 60° au lieu de 20°) ---
      rotation: Math.random() * 60 - 30, // De -30° à 30°
      offsetX: Math.random() * 40 - 20, // Décalage horizontal
      offsetY: Math.random() * 40 - 20, // Décalage vertical
    };

    // Cette logique de pile avec transformations aléatoires crée l'effet visuel où chaque photo semble être 'jetée' sur une table, avec une position et une orientation uniques, comme illustré dans le diagramme ci-dessous.
    // 
    setStack(prev => {
      const newStack = [...prev, nextPhoto];
      // On garde 12 photos max pour l'effet d'accumulation sans ramer
      return newStack.slice(-12);
    });

    setCurrentIndex(prev => (prev + 1) % allImages.length);
  }, [allImages, currentIndex]);

  // 3. Cycle d'animation (4 secondes)
  useEffect(() => {
    let interval;
    if (isOpen && !isPaused && !loading && allImages.length > 0) {
      interval = setInterval(() => {
        dropNextPhoto();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPaused, loading, dropNextPhoto, allImages.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center overflow-hidden bg-[#08090f] animate-in fade-in duration-1000">
      
      {/* Fond Dégradé Prestige */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#242643] via-[#1a1d2d] to-[#08090f]" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Interface Sarcelle */}
      <div className="absolute top-10 right-10 flex items-center gap-6 z-[700]">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[#2dd4bf] transition-all backdrop-blur-xl"
        >
          {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
        </button>
        <button 
          onClick={onClose}
          className="p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-red-400 transition-all backdrop-blur-xl"
        >
          <X size={24} />
        </button>
      </div>

      <div className="absolute bottom-10 left-10 z-[700] flex items-center gap-4">
        <div className="p-3 bg-[#2dd4bf]/10 rounded-2xl border border-[#2dd4bf]/20">
          <Sparkles className="text-[#2dd4bf]" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-[0.4em]">Chroniques Visuelles</span>
          <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">
            {allImages.length > 0 ? `${currentIndex + 1} / ${allImages.length} Souvenirs` : 'Archives vides'}
          </span>
        </div>
      </div>

      {/* Zone de chute des photos */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        {loading ? (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <RefreshCw className="text-[#2dd4bf] animate-spin" size={48} strokeWidth={3} />
            <span className="text-[#2dd4bf]/50 font-black uppercase tracking-[0.3em] text-[11px]">Extraction du Lore visuel...</span>
          </div>
        ) : (
          stack.map((photo) => (
            <div
              key={photo.id}
              className="absolute animate-in fade-in zoom-in-90 duration-1000 ease-out"
              style={{
                transform: `rotate(${photo.rotation}deg) translate(${photo.offsetX}px, ${photo.offsetY}px)`,
              }}
            >
              {/* --- MODIFICATION : Cadre blanc plus fin (p-2 au lieu de p-4) et ombre légèrement adoucie --- */}
              <div className="bg-white p-2 shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-black/5 ring-1 ring-black/5">
                {/* --- MODIFICATION : Taille des photos plus importante (w-[450px] md:w-[700px]) --- */}
                <div className="relative overflow-hidden w-[450px] md:w-[700px] aspect-video bg-black">
                  <img 
                    src={photo.url} 
                    alt="Memory" 
                    className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                  />
                  {/* Reflet papier glacé */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                </div>
                
                <div className="mt-4 flex justify-between items-center opacity-30">
                    <span className="text-[7px] font-black text-black uppercase tracking-widest">Visual Chronicle V4.2 FINAL</span>
                    <span className="text-[7px] font-mono text-black select-none">ID-{photo.id.toString().slice(-4)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fallback si aucune image */}
      {!loading && allImages.length === 0 && (
        <div className="flex flex-col items-center gap-4 opacity-20">
          <X size={64} className="text-white" />
          <p className="text-white font-black uppercase tracking-widest text-xs text-center">
            Aucun média détecté dans la table <br/>
            <span className="text-[#2dd4bf]">public.media_items</span>
          </p>
        </div>
      )}
    </div>
  );
}