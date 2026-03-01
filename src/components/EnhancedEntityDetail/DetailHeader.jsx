import React from 'react';
import { X, Star, Coins, Weight, Image as ImageIcon, ArrowUpCircle, FileText, Shield, Zap } from 'lucide-react';

export default function DetailHeader({ item, config, onClose, onLevelUp, onExportPDF }) {
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
        <span key="rarity" className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${rarityColors[item.rarity] || 'text-silver bg-white/5 border-white/10'}`}>
          {item.rarity}
        </span>
      );
    }

    if (item.item_type || item.character_type) {
      badges.push(
        <span key="type" className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-silver text-[10px] font-black uppercase tracking-widest">
          {item.item_type || item.character_type}
        </span>
      );
    }

    return badges;
  };

  return (
    <div className="relative h-64 shrink-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${headerGradient}`}>
        {item.image_url && (
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
      </div>

      <div className="absolute top-6 right-8 flex items-center gap-3 z-20">
        {tableName === 'characters' && (
          <>
            <button 
              onClick={onExportPDF}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              <FileText size={16} /> PDF
            </button>
            <button 
              onClick={onLevelUp}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest animate-pulse hover:animate-none scale-105 active:scale-95"
            >
              <ArrowUpCircle size={18} /> Niveau Supérieur
            </button>
          </>
        )}
        <button 
          type="button" 
          onClick={onClose} 
          className="p-2 bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl transition-all border border-white/10 ml-2"
        >
          <X size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between z-10 pointer-events-none">
         <div className="flex items-center gap-8 pointer-events-auto">
            <div className="w-24 h-24 rounded-[2rem] bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <HeaderIcon size={48} className="text-teal-400 relative z-10" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                 <p className="text-teal-400 font-black text-[10px] tracking-[0.4em] uppercase">
                   — {item.item_type || item.subtitle || title || entityName} —
                 </p>
                 <div className="flex gap-2">
                   {renderStatBadges()}
                 </div>
               </div>
               <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                 {item.name} 
                 {tableName === 'characters' && (
                   <div className="flex items-center gap-2">
                     <span className="text-xl text-amber-500 font-black border border-amber-500/30 px-3 py-1 rounded-xl bg-amber-500/5">
                       NIV. {item.level || 1}
                     </span>
                     <span className="text-sm text-teal-400 font-black border border-teal-500/30 px-2 py-1 rounded-lg bg-teal-500/5" title="Bonus de Maîtrise">
                       +{proficiencyBonus} MAÎ
                     </span>
                   </div>
                 )}
               </h1>
            </div>
         </div>
      </div>
    </div>
  );
}