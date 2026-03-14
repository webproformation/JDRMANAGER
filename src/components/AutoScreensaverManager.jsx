import React, { useState, useEffect, useRef } from 'react';
import MediaScreensaver from './MediaScreensaver';

/**
 * AutoScreensaverManager - Standard PRESTIGE 4.5.9
 * Surveillance d'inactivité globale et déclenchement du mode immersif.
 * * MODIFICATIONS :
 * - Arrêt instantané sur : Clavier (n'importe quelle touche), Souris, Tactile et Scroll.
 * - Réinitialisation du cycle de veille à chaque interaction.
 */
export default function AutoScreensaverManager() {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);
  
  // Seuil d'inactivité : 60 secondes (60000ms)
  const INACTIVITY_LIMIT = 60000; 

  /**
   * handleActivity
   * Ferme l'économiseur si actif et relance le compte à rebours de veille.
   */
  const handleActivity = () => {
    // 1. Si l'économiseur est affiché, on le coupe immédiatement au premier signal
    setIsActive(false);

    // 2. On nettoie le timer précédent pour éviter les déclenchements multiples
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 3. On vérifie si l'option est activée dans les réglages utilisateur
    const isEnabled = localStorage.getItem('prestige_auto_screensaver') === 'true';
    
    if (isEnabled) {
      // On lance le nouveau compte à rebours vers le mode veille
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, INACTIVITY_LIMIT);
    }
  };

  useEffect(() => {
    /**
     * Liste exhaustive des signaux d'activité :
     * - mousemove : Mouvement de souris
     * - mousedown : Clics
     * - keydown   : N'importe quelle touche du clavier
     * - touchstart: Toucher sur mobile/tablette
     * - scroll    : Utilisation de la molette ou du défilement
     */
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    // Initialisation du premier timer au chargement
    handleActivity();

    // Montage des écouteurs globaux sur la fenêtre (window)
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Nettoyage strict au démontage du composant
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return (
    <MediaScreensaver 
      isOpen={isActive} 
      onClose={() => setIsActive(false)} 
    />
  );
}