import React from 'react';
import { X, ArrowUpCircle, FileText, Edit, Image as ImageIcon } from 'lucide-react';

/**
 * DetailHeader - Standard PRESTIGE 4.5.1 (Big Type Edition)
 * CORRECTIFS TYPO (x1.5) :
 * 1. Sous-titre : text-[12px] (mobile) -> text-[15px] (desktop).
 * 2. Titre : text-3xl (mobile) -> text-5xl (desktop).
 * 3. Badges : text-[12px] (mobile) -> text-[15px] (desktop).
 */
export default function DetailHeader({ item, config, onClose, onLevelUp, onExportPDF, onEdit }) {
  const { entityName, title, getHeaderIcon, getHeaderColor, tableName } = config;
  const HeaderIcon = getHeaderIcon ? getHeaderIcon(item) : ImageIcon;
  const headerGradient = getHeaderColor ? getHeaderColor(item) : 'from-gray-600/30 to-gray-800/30';

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
        <span key="rarity" className={`px-2 py-0.5 md:px-3 md:py-1 rounded-lg border text-[12px] md:text-[15px] font-black uppercase tracking-widest ${rarityColors[item.rarity] || 'text-silver bg-white/5 border-white/10'}`}>
          {item.rarity}
        </span>
      );
    }
    if (item.character_type || item.item_type) {
      badges.push(
        <span key="type" className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg border border-white/10 bg-white/5 text-silver text-[12px] md:text-[15px] font-black uppercase tracking-widest">
          {item.character_type || item.item_type}
        </span>
      );
    }
    return badges;
  };

  return (
    <div className="relative h-32 md:h-44 shrink-0 overflow-hidden flex items-end p-6 md:p-8 border-b border-white/10">
      {/* BACKGROUND & OVERLAY */}
      <div className={`absolute inset-0 bg-gradient-to-br ${headerGradient}`}>
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#242643] via-[#242643]/80 to-transparent" />
      </div>

      {/* BARRE D'OUTILS */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-1.5 md:gap-4 z-20">
        {onExportPDF && (
          <button 
            onClick={onExportPDF}
            className="p-1.5 md:p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest"
          >
            <FileText size={16} className="md:w-[18px]" /> <span className="hidden lg:inline">PDF</span>
          </button>
        )}

        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-1.5 md:p-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-all border border-teal-500/30 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest"
          >
            <Edit size={16} className="md:w-[18px]" /> <span className="hidden lg:inline">Modifier</span>
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

      {/* TITRE ET IDENTITÉ */}
      <div className="relative z-10 w-full flex items-center gap-4 md:gap-6 pointer-events-none">
          <div className="flex items-center gap-4 md:gap-6 pointer-events-auto w-full">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-black/60 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md shrink-0">
               <HeaderIcon size={24} className="text-teal-400 md:w-[32px] md:h-[32px]" />
            </div>
            
            <div className="min-w-0 flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-1.5 md:mb-2">
                 <p className="text-teal-400 font-black text-[12px] md:text-[15px] tracking-[0.2em] md:tracking-widest uppercase truncate max-w-[200px] md:max-w-none">
                   — {item.subtitle || title || entityName} —
                 </p>
                 <div className="flex gap-2">
                   {renderStatBadges()}
                 </div>
               </div>
               
               <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight truncate leading-none drop-shadow-lg">
                 {item.name} 
                 {tableName === 'characters' && (
                   <span className="inline-flex items-center gap-1.5 ml-4">
                     <span className="text-sm md:text-lg bg-white/10 backdrop-blur-md text-white font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl border border-white/20 shadow-inner">
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