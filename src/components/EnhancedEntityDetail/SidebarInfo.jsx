import React from 'react';
import { ShieldAlert, Lock, EyeOff } from 'lucide-react';

export default function SidebarInfo({ item, gmFields, renderFieldValue }) {
  if (!gmFields || gmFields.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* HEADER SIDEBAR MJ */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400/80">
            Archives Secrètes
          </h3>
          <p className="text-[8px] font-bold text-silver/20 uppercase tracking-widest flex items-center gap-1">
            <Lock size={8} /> Réservé au Maître du Jeu
          </p>
        </div>
      </div>

      {/* LISTE DES SECRETS - CORRECTION ANTI-CRASH */}
      <div className="space-y-6">
        {gmFields.map((field) => {
          const value = item[field.name];
          if (!value) return null;

          return (
            <div key={field.name} className="group">
              {/* LABEL SECRET ULTRA-COMPACT */}
              <label className="text-[9px] font-black text-red-400/40 uppercase tracking-[0.25em] mb-2 block flex items-center gap-2 group-hover:text-red-400/60 transition-colors">
                <EyeOff size={10} /> {field.label}
              </label>

              {/* VALEUR SECRÈTE : Utilisation du renderFieldValue pour gérer les objets JSON sans crash */}
              <div className="bg-red-500/5 rounded-xl border border-red-500/10 p-4 shadow-inner group-hover:bg-red-500/10 transition-all">
                <div className="text-red-200/70 text-[13px] leading-relaxed font-normal italic">
                  {/* renderFieldValue doit être passé par le parent EnhancedEntityDetail */}
                  {renderFieldValue ? renderFieldValue(field) : String(value)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER DE SÉCURITÉ */}
      <div className="pt-8 opacity-20">
        <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mb-4" />
        <p className="text-[7px] text-center font-black uppercase tracking-[0.4em] text-red-500">
          Cryptage de Niveau 5 - Protocole MJ Actif
        </p>
      </div>
    </div>
  );
}