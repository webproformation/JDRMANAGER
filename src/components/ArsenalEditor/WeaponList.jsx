import React from 'react';
import { Sword, Trash2 } from 'lucide-react';

export default function WeaponList({ weapons, onRemoveWeapon }) {
  if (!weapons || weapons.length === 0) {
    return (
      <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-lg text-silver/20 text-xs italic">
        Aucune arme équipée. Cherchez dans l'arsenal.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {weapons.map((weapon, idx) => (
        <div key={idx} className="bg-[#1a1d2d] border border-white/5 rounded-lg p-3 flex items-center justify-between group hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Sword size={16} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{weapon.name}</div>
              <div className="text-[10px] text-silver/60 flex gap-2">
                <span className="bg-white/5 px-1.5 rounded text-teal-200">Toucher: <strong className="text-white">{weapon.stats?.atk || '?'}</strong></span>
                <span className="bg-white/5 px-1.5 rounded text-orange-200">Dégâts: <strong className="text-white">{weapon.stats?.dmg || '?'}</strong></span>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => onRemoveWeapon(idx)}
            className="p-2 text-silver/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}