import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * MediaScreensaver - Standard PRESTIGE 4.5.9 (PUR & IMMERSIF)
 * Vue de diaporama immersive avec pile de photos accumulées.
 * CORRECTIF : Suppression totale des contrôles en haut à droite pour une immersion pure.
 */
export default function MediaScreensaver({ isOpen, onClose }) {
  const [allImages, setAllImages] = useState([]);
  const [stack, setStack] = useState([]); 
  const [loading, setLoading] = useState(true);
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
      rotation: Math.random() * 60 - 30, // De -30° à 30°
      offsetX: Math.random() * 40 - 20, 
      offsetY: Math.random() * 40 - 20, 
    };

    setStack(prev => {
      const newStack = [...prev, nextPhoto];
      return newStack.slice(-12); // On garde 12 photos max
    });

    setCurrentIndex(prev => (prev + 1) % allImages.length);
  }, [allImages, currentIndex]);

  // 3. Cycle d'animation automatique (4 secondes)
  useEffect(() => {
    let interval;
    if (isOpen && !loading && allImages.length > 0) {
      interval = setInterval(() => {
        dropNextPhoto();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isOpen, loading, dropNextPhoto, allImages.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center overflow-hidden bg-[#08090f] animate-in fade-in duration-1000">
      
      {/* Fond Dégradé Prestige */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#242643] via-[#1a1d2d] to-[#08090f]" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Légende Bas Gauche (Conservée pour l'identité visuelle) */}
      <div className="absolute bottom-10 left-10 z-[700] flex items-center gap-4">
        <div className="p-3 bg-[#2dd4bf]/10 rounded-2xl border border-[#2dd4bf]/20">
          <Sparkles className="text-[#2dd4bf]" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-[0.4em]">Chroniques Visuelles</span>
          <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">
            {allImages.length > 0 ? `${currentIndex + 1} / ${allImages.length}` : 'Archives vides'}
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
              {/* Cadre photo Prestige */}
              <div className="bg-white p-2 shadow-[0_40px_80px_rgba(0,0,0,0.7)] border border-black/5 ring-1 ring-black/5">
                <div className="relative overflow-hidden w-[450px] md:w-[700px] aspect-video bg-black">
                  <img 
                    src={photo.url} 
                    alt="Memory" 
                    className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                </div>
                
                <div className="mt-4 flex justify-between items-center opacity-30">
                    <span className="text-[7px] font-black text-black uppercase tracking-widest">Visual Chronicle V4.5.9</span>
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