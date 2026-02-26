import React from 'react';
import { X, Star, Coins, Weight, Image as ImageIcon, ArrowUpCircle, FileText } from 'lucide-react';

export default function DetailHeader({ item, config, onClose, onLevelUp, onExportPDF }) {
  const { entityName, title, getHeaderIcon, getHeaderColor, tableName } = config;
  const HeaderIcon = getHeaderIcon ? getHeaderIcon(item) : ImageIcon;
  const headerGradient = getHeaderColor ? getHeaderColor(item) : 'from-gray-600/30 to-gray-800/30';

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
        <div key="rarity" className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${rarityColors[item.rarity] || 'text-teal-400 border-teal-500/20'}`}>
          <Star size={10} fill="currentColor" /> {item.rarity}
        </div>
      );
    }

    if (item.market_value || item.value) {
      badges.push(
        <div key="value" className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase tracking-tighter">
          <Coins size={10} /> {item.market_value || item.value}
        </div>
      );
    }

    if (item.weight) {
      badges.push(
        <div key="weight" className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-300/20 bg-blue-300/10 text-blue-300 text-[10px] font-black uppercase tracking-tighter">
          <Weight size={10} /> {item.weight}
        </div>
      );
    }

    return badges;
  };

  return (
    <div className="relative h-44 shrink-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${headerGradient}`}>
        {item.image_url && <img src={item.image_url} alt="Couverture" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
      </div>
      
      {/* NOUVEAUX BOUTONS D'ACTIONS (Level Up & PDF) */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        {tableName === 'characters' && item.character_type === 'PJ' && (
          <>
            <button 
              onClick={() => onExportPDF && onExportPDF(item)} 
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <FileText size={16} /> Exporter PDF
            </button>
            <button 
              onClick={() => onLevelUp && onLevelUp(item)} 
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <ArrowUpCircle size={18} /> Niveau Supérieur
            </button>
          </>
        )}
        <button type="button" onClick={onClose} className="p-2 bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl transition-all border border-white/10 ml-2">
          <X size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between z-10 pointer-events-none">
         <div className="flex items-center gap-8 pointer-events-auto">
            <div className="w-20 h-20 rounded-[1.5rem] bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-2xl">
               <HeaderIcon size={40} className="text-teal-400" />
            </div>
            <div>
               <p className="text-teal-400 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
                 — {item.item_type || item.subtitle || title || entityName} —
               </p>
               <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                 {item.name} 
                 {tableName === 'characters' && <span className="text-xl text-amber-500 font-black border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full">Niv.{item.level}</span>}
               </h1>
               <div className="flex flex-wrap gap-2 mt-3">
                 {renderStatBadges()}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}