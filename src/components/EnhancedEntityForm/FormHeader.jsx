// src/components/EnhancedEntityForm/FormHeader.jsx
import React from 'react';
import { X, Sparkles } from 'lucide-react';

export default function FormHeader({ item, formData, config, onClose, onAutoGenerate }) {
  const entityName = config?.entityName || 'Entité';
  const Icon = config?.getHeaderIcon ? config.getHeaderIcon(formData || item) : null;
  const headerColor = config?.getHeaderColor ? config.getHeaderColor(formData || item) : 'from-slate-700/40 via-blue-900/30 to-slate-800/50';

  // Récupération sécurisée de l'image de fond et du niveau
  const bgImage = formData?.image_url || item?.image_url;
  const isCharacter = config?.tableName === 'characters';
  const level = formData?.level || item?.level;

  return (
    <div className="relative shrink-0 min-h-[180px] flex items-end p-8 border-b border-white/10 overflow-hidden">
      
      {/* IMAGE DE FOND & SUPERPOSITION DES DÉGRADÉS */}
      {bgImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-700" 
            style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${headerColor} mix-blend-multiply opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/80 to-transparent" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-r ${headerColor} opacity-30`} />
      )}

      {/* CONTENU DU HEADER */}
      <div className="relative z-10 w-full flex items-end justify-between">
        <div className="flex items-center gap-6">
          {Icon && (
            <div className="w-16 h-16 bg-black/60 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
              <Icon size={32} className="text-white" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4 drop-shadow-lg">
              {item?.id ? `Modifier ${entityName}` : `Créer ${entityName}`}
              
              {/* Affichage du niveau sécurisé (ne crashera plus si absent) */}
              {level && (
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-sm font-bold rounded-xl border border-white/20 shadow-inner">
                  Niv {level}
                </span>
              )}
            </h2>
            <p className="text-silver/80 text-sm font-black mt-2 tracking-widest uppercase drop-shadow-md">
              {formData?.name || item?.name || `Nouveau ${entityName}`}
            </p>
          </div>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="flex items-center gap-4">
          
          {/* Bouton Forge Arcanique (uniquement à la création d'un personnage) */}
          {!item?.id && isCharacter && onAutoGenerate && (
            <button
              type="button"
              onClick={onAutoGenerate}
              className="flex items-center gap-2 px-5 py-3 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-xl border border-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/20 font-black uppercase tracking-widest text-[10px] backdrop-blur-sm"
            >
              <Sparkles size={16} />
              Forge Automatique
            </button>
          )}

          <button 
            type="button" 
            onClick={onClose} 
            className="w-12 h-12 bg-black/50 hover:bg-red-500 text-silver hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10 hover:border-red-400 shadow-xl backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}