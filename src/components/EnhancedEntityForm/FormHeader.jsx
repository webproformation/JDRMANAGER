import React from 'react';
import { X, Sparkles, Trash2, Image as ImageIcon } from 'lucide-react';

/**
 * FormHeader - Standard PRESTIGE 4.4.9 (Safe-Edit Edition)
 * En-tête du formulaire avec protection anti-suppression accidentelle.
 * CORRECTIFS : 
 * 1. Bouton Supprimer : Isolé en haut à gauche.
 * 2. Responsive : h-32 (mobile) -> h-44 (desktop).
 * 3. Fusion : Dégradé vers le bleu formulaire #242643.
 */
export default function FormHeader({ item, formData, config, onClose, onAutoGenerate, onDelete }) {
  const entityName = config?.entityName || 'Entité';
  const Icon = config?.getHeaderIcon ? config.getHeaderIcon(formData || item) : ImageIcon;
  const headerColor = config?.getHeaderColor ? config.getHeaderColor(formData || item) : 'from-slate-700/40 via-blue-900/30 to-slate-800/50';

  const bgImage = formData?.image_url || item?.image_url;
  const isCharacter = config?.tableName === 'characters';
  const level = formData?.level || item?.level;

  return (
    <div className="relative shrink-0 h-32 md:h-44 flex items-end p-6 md:p-8 border-b border-white/10 overflow-hidden">
      
      {/* IMAGE DE FOND & SUPERPOSITION */}
      {bgImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-700" 
            style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${headerColor} mix-blend-multiply opacity-80`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#242643] via-[#242643]/80 to-transparent" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-r ${headerColor} opacity-30`} />
      )}

      {/* BOUTON SUPPRIMER : ISOLATION TOP-LEFT (Sécurité UX) */}
      {item?.id && onDelete && (
        <div className="absolute top-4 left-4 z-20">
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all shadow-xl backdrop-blur-md group"
            title="Supprimer définitivement"
          >
            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* CONTENU DU HEADER */}
      <div className="relative z-10 w-full flex items-end justify-between">
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          {Icon && (
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/60 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md shrink-0">
              <Icon size={24} className="text-white md:w-[32px] md:h-[32px]" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg truncate">
              {item?.id ? `Modifier ${entityName}` : `Créer ${entityName}`}
              
              {level && (
                <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/10 backdrop-blur-md text-white text-[10px] md:text-sm font-bold rounded-lg border border-white/20 shadow-inner">
                  Niv {level}
                </span>
              )}
            </h2>
            <p className="text-silver/80 text-[10px] md:text-sm font-black mt-1 md:mt-2 tracking-[0.2em] md:tracking-widest uppercase drop-shadow-md truncate">
              {formData?.name || item?.name || `Nouveau ${entityName}`}
            </p>
          </div>
        </div>

        {/* BOUTONS D'ACTION TOP-RIGHT */}
        <div className="absolute top-4 right-4 md:static flex items-center gap-2 md:gap-4 shrink-0">
          
          {!item?.id && isCharacter && onAutoGenerate && (
            <button
              type="button"
              onClick={onAutoGenerate}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-xl border border-purple-500/30 transition-all font-black uppercase tracking-widest text-[9px] backdrop-blur-sm"
            >
              <Sparkles size={14} />
              Forge Auto
            </button>
          )}

          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-red-500 text-silver hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10 shadow-xl backdrop-blur-sm"
          >
            <X size={20} md:size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}