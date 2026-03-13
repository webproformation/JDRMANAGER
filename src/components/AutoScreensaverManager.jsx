import React, { useState, useEffect, useRef } from 'react';
import MediaScreensaver from './MediaScreensaver';

/**
 * AutoScreensaverManager - Standard PRESTIGE 4.2
 * Surveille l'inactivité globale et déclenche l'économiseur.
 * Se coupe instantanément au moindre mouvement ou interaction.
 */
export default function AutoScreensaverManager() {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);
  
  // Seuil d'inactivité : 60 secondes (60000ms)
  const INACTIVITY_LIMIT = 60000; 

  /**
   * Réinitialise le compte à rebours et ferme l'économiseur si actif.
   * Cette fonction est déclenchée par toute activité utilisateur.
   */
  const handleActivity = () => {
    // Si l'économiseur est affiché, on le ferme immédiatement
    setIsActive(false);

    // On nettoie le timer en cours pour en relancer un propre
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // On vérifie la préférence utilisateur stockée dans le localStorage
    const isEnabled = localStorage.getItem('prestige_auto_screensaver') === 'true';
    
    if (isEnabled) {
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, INACTIVITY_LIMIT);
    }
  };

  useEffect(() => {
    // Liste des événements considérés comme une activité "vivante"
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    // Initialisation au montage du composant
    handleActivity();

    // Ajout des écouteurs d'événements sur la fenêtre globale
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Nettoyage à la destruction du composant
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []); // Dépendances vides pour ne pas ré-attacher les écouteurs inutilement

  return (
    <MediaScreensaver 
      isOpen={isActive} 
      onClose={() => setIsActive(false)} 
    />
  );
}