// src/components/vtt-ui/VTTCounter.jsx
import React from 'react';

/**
 * VTTCounter - Contrôle numérique symétrique
 * @param {number} value - Valeur actuelle
 * @param {function} onChange - Retourne la nouvelle valeur (nombre)
 * @param {boolean} readOnly - Verrouille le composant
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @param {number} step - Incrément
 */
export default function VTTCounter({ 
  value, 
  onChange, 
  readOnly = false,
  min = 0,
  max = 9999,
  step = 1
}) {
  const currentValue = parseFloat(value) || 0;

  const handleUpdate = (newValue) => {
    if (readOnly) return;
    const clamped = Math.min(Math.max(newValue, min), max);
    onChange(clamped);
  };

  return (
    <div className={`vtt-counter-container h-[38px] ${readOnly ? 'opacity-70' : ''}`}>
      {!readOnly && (
        <button 
          type="button" 
          className="vtt-btn-counter vtt-btn-minus w-9 text-base" 
          onClick={(e) => { e.stopPropagation(); handleUpdate(currentValue - step); }}
        >
          -
        </button>
      )}
      <input
        type="number"
        readOnly={readOnly}
        value={value === 0 ? 0 : (value || '')}
        onChange={(e) => handleUpdate(parseFloat(e.target.value) || 0)}
        className="vtt-input-number text-[13px] font-normal"
      />
      {!readOnly && (
        <button 
          type="button" 
          className="vtt-btn-counter vtt-btn-plus w-9 text-base" 
          onClick={(e) => { e.stopPropagation(); handleUpdate(currentValue + step); }}
        >
          +
        </button>
      )}
    </div>
  );
}