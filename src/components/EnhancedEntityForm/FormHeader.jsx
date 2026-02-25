import React from 'react';
import { X, Zap, Hammer } from 'lucide-react';

export default function FormHeader({ config, formData, item, onAutoGenerate, onClose }) {
  const { entityName, tableName, getHeaderColor, getHeaderIcon } = config;
  
  const HeaderIcon = getHeaderIcon ? getHeaderIcon(formData) : null;
  const headerColor = getHeaderColor ? getHeaderColor(formData) : 'from-teal-900/50 to-cyan-900/50';

  return (
    <div className="relative h-44 shrink-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${headerColor}`}>
        {formData.image_url && <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent" />
      </div>
      
      <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between z-10">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[1.5rem] bg-[#1a1d2d] border border-teal-500/30 flex items-center justify-center shadow-2xl">
               {HeaderIcon ? <HeaderIcon size={40} className="text-teal-400" /> : <Hammer size={40} className="text-teal-400" />}
            </div>
            <div>
               <p className="text-teal-400 font-black text-[10px] tracking-[0.4em] uppercase mb-2">
                 {item ? `Modification : ${entityName}` : `Inception : ${entityName}`}
               </p>
               <h1 className="text-4xl font-black text-white tracking-tighter">
                 {formData.name || (item ? 'Sans nom' : `Nouveau ${entityName}`)}
               </h1>
            </div>
         </div>
         
         {!item && tableName === 'characters' && (
           <button 
             type="button" 
             onClick={onAutoGenerate} 
             className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-500 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-95"
           >
             <Zap size={20} fill="currentColor" /> Forger le Destin
           </button>
         )}
      </div>
      <button type="button" onClick={onClose} className="absolute top-8 right-8 p-3 bg-black/40 hover:bg-white/10 text-white rounded-xl transition-all z-20 shadow-xl border border-white/10"><X size={20} /></button>
    </div>
  );
}