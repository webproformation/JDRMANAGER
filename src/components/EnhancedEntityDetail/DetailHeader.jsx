import React from 'react';
import { X, ArrowUpCircle, FileText, Edit, Image as ImageIcon } from 'lucide-react';

/**
 * DetailHeader - Standard PRESTIGE 4.4.7 (Ultra-Compact Responsive)
 * En-tête immersif avec adaptation chirurgicale pour mobile.
 * CORRECTIFS : 
 * 1. Hauteur : h-28 (mobile) -> h-64 (desktop) pour faire remonter le contenu au maximum.
 * 2. Icône : w-10 (mobile) -> w-24 (desktop).
 * 3. Titre : text-lg (mobile) -> text-5xl (desktop).
 * 4. Espacement : bottom-2 sur mobile pour coller au bord.
 */
export default function DetailHeader({ item, config, onClose, onLevelUp, onExportPDF, onEdit }) {
  const { entityName, title, getHeaderIcon, getHeaderColor, tableName } = config;
  const HeaderIcon = getHeaderIcon ? getHeaderIcon(item) : ImageIcon;
  const headerGradient = getHeaderColor ? getHeaderColor(item) : 'from-gray-600/30 to-gray-800/30';

  // Calcul automatique du bonus de maîtrise D&D 5e
  const proficiencyBonus = item.level ? Math.floor((item.level - 1) / 4) + 2 : 2;

  const renderStatBadges = () => {
    const badges = [];
    if (item.rarity) {
      const rarityColors = {
        'Commun': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
        'Peu commun': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'Rare': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        'Très rare': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        'Légendaire': 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      };
      badges.push(
        <span key="rarity" className={`px-2 py-0.5 md:px-3 md:py-1 rounded-lg border text-[8px] md:text-[10px] font-black uppercase tracking-widest ${rarityColors[item.rarity] || 'text-silver bg-white/5 border-white/10'}`}>
          {item.rarity}
        </span>
      );
    }
    if (item.character_type || item.item_type) {
      badges.push(
        <span key="type" className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg border border-white/10 bg-white/5 text-silver text-[8px] md:text-[10px] font-black uppercase tracking-widest">
          {item.character_type || item.item_type}
        </span>
      );
    }
    return badges;
  };

  return (
    <div className="relative h-28 md:h-64 shrink-0 overflow-hidden">
      {/* BACKGROUND & OVERLAY */}
      <div className={`absolute inset-0 bg-gradient-to-br ${headerGradient}`}>
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        {/* Dégradé de fusion vers le bleu profond #242643 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#242643] via-[#242643]/40 to-transparent" />
      </div>

      {/* BARRE D'OUTILS SUPÉRIEURE REGROUPÉE (Optimisée Mobile h-28) */}
      <div className="absolute top-2 right-4 md:top-6 md:right-8 flex items-center gap-1 md:gap-2 z-20">
        {onExportPDF && (
          <button 
            onClick={onExportPDF}
            className="p-1 md:p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest"
            title="Exporter en PDF"
          >
            <FileText size={14} className="md:w-[18px]" /> <span className="hidden lg:inline">PDF</span>
          </button>
        )}

        {tableName === 'characters' && onLevelUp && (
          <button 
            onClick={onLevelUp}
            className="p-1 md:p-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white rounded-xl transition-all shadow-lg flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest active:scale-95"
          >
            <ArrowUpCircle size={14} className="md:w-[18px]" /> <span className="hidden lg:inline">Niveau Supérieur</span>
          </button>
        )}

        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-1 md:p-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-all border border-teal-500/30 flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest"
          >
            <Edit size={14} className="md:w-[18px]" /> <span className="hidden lg:inline">Modifier</span>
          </button>
        )}

        <div className="w-px h-5 md:h-8 bg-white/10 mx-1 hidden sm:block" />

        <button 
          type="button" 
          onClick={onClose} 
          className="p-1 md:p-2.5 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-all border border-white/10"
        >
          <X size={16} md:size={20} />
        </button>
      </div>

      {/* TITRE ET IDENTITÉ (Layout Responsive Ultra-Compact) */}
      <div className="absolute bottom-2 left-6 right-6 md:bottom-8 md:left-10 md:right-10 flex items-end justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-3 md:gap-8 pointer-events-auto w-full">
            {/* Icône redimensionnée pour mobile h-28 */}
            <div className="w-10 h-10 md:w-24 md:h-24 rounded-xl md:rounded-[2rem] bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
               <HeaderIcon size={20} className="text-teal-400 md:w-[48px] md:h-[48px]" />
            </div>
            
            <div className="min-w-0 flex-1">
               <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-2">
                 <p className="text-teal-400 font-black text-[6px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase truncate max-w-[120px] md:max-w-none">
                   — {item.subtitle || title || entityName} —
                 </p>
                 <div className="flex gap-1">
                   {renderStatBadges()}
                 </div>
               </div>
               
               {/* Titre avec réduction automatique sur mobile */}
               <h1 className="text-lg md:text-5xl font-black text-white tracking-tighter truncate leading-tight">
                 {item.name} 
                 {tableName === 'characters' && (
                   <span className="inline-flex items-center gap-1 ml-2">
                     <span className="text-[10px] md:text-xl text-amber-500 font-black border border-amber-500/30 px-1.5 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-xl bg-amber-500/5">
                       NIV. {item.level || 1}
                     </span>
                   </span>
                 )}
               </h1>
            </div>
          </div>
      </div>
    </div>
  );
}