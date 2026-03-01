import React from 'react';
import { X, Zap, Hammer, Save, Loader } from 'lucide-react';

export default function FormHeader({ config, formData, item, onAutoGenerate, onClose, loading }) {
  const { entityName, tableName, getHeaderColor, getHeaderIcon } = config;
  
  const HeaderIcon = getHeaderIcon ? getHeaderIcon(formData) : null;
  const headerColor = getHeaderColor ? getHeaderColor(formData) : 'from-teal-900/50 to-cyan-900/50';

  // Calcul automatique du bonus de maîtrise pour l'affichage
  const proficiencyBonus = formData.level ? Math.floor((formData.level - 1) / 4) + 2 : 2;

  return (
    <div className="relative h-56 shrink-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${headerColor}`}>
        {formData.image_url && (
          <img 
            src={formData.image_url} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
      </div>

      {/* BARRE D'OUTILS SUPÉRIEURE REGROUPÉE */}
      <div className="absolute top-6 right-8 flex items-center gap-3 z-20">
        {!item && tableName === 'characters' && (
          <button 
            type="button" 
            onClick={onAutoGenerate} 
            className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 border border-amber-500/30 transition-all"
          >
            <Zap size={16} fill="currentColor" /> Générer
          </button>
        )}

        <button 
          type="submit" 
          form="entity-form"
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-teal-900/20 transition-all disabled:opacity-50"
        >
          {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          Sauvegarder
        </button>

        <div className="w-px h-8 bg-white/10 mx-1" />

        <button 
          type="button" 
          onClick={onClose} 
          className="p-2.5 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-all border border-white/10"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between z-10 pointer-events-none">
         <div className="flex items-center gap-8 pointer-events-auto">
            <div className="w-24 h-24 rounded-[2rem] bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-2xl">
               {HeaderIcon ? <HeaderIcon size={48} className="text-teal-400" /> : <Hammer size={48} className="text-teal-400" />}
            </div>
            <div>
               <p className="text-teal-400 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
                 — {item ? `Modification : ${entityName}` : `Inception : ${entityName}`} —
               </p>
               <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                 {formData.name || (item ? 'Sans nom' : `Nouveau ${entityName}`)}
                 {tableName === 'characters' && (
                   <div className="flex items-center gap-2">
                     <span className="text-xl text-amber-500 font-black border border-amber-500/30 px-3 py-1 rounded-xl bg-amber-500/5">
                       NIV. {formData.level || 1}
                     </span>
                     <span className="text-sm text-teal-400 font-black border border-teal-500/30 px-2 py-1 rounded-lg bg-teal-500/5">
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