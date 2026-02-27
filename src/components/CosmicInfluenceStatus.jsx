// src/components/CosmicInfluenceStatus.jsx
import React, { useState, useEffect } from 'react';
import { Compass, Star, Clock, Moon, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CosmicInfluenceStatus({ character }) {
  const [influences, setInfluences] = useState([]);
  const [worldInfo, setWorldInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCosmicData() {
      if (!character?.world_id) return;
      
      const { data: world } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', character.world_id)
        .single();
      setWorldInfo(world);

      const { data: allHoroscopes } = await supabase
        .from('horoscopes')
        .select('*, celestial_bodies(name)')
        .eq('world_id', character.world_id);
      
      if (allHoroscopes && world) {
        const months = world.calendar_config?.months || [];

        const active = allHoroscopes.filter(h => {
          if (h.scale === 'natal' && character.birth_date) {
            return character.birth_date.includes(h.start_date) || character.data?.zodiac === h.name;
          }
          if (h.scale === 'year' && h.start_date === String(world.current_year)) return true;
          if (h.scale === 'month') {
            const currentMonthName = months[world.current_month - 1]?.name;
            return h.name === currentMonthName || h.start_date === String(world.current_month);
          }
          if (h.scale === 'day' && h.start_date === String(world.current_day)) return true;
          if (h.scale === 'hour' && h.start_date === String(world.current_hour)) return true;
          return false;
        });

        setInfluences(active);
      }
      setLoading(false);
    }
    fetchCosmicData();
  }, [character]);

  const totalMod = influences.reduce((acc, curr) => acc + (curr.data?.celestial_configs?.global_modifier || 0), 0);

  if (loading) return <div className="p-8 text-center text-silver/20 animate-pulse uppercase tracking-widest text-xs">Consultation des Astres...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-[#0f111a] rounded-[2rem] p-8 border border-purple-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 text-purple-500">
          <Compass size={140} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-2">
                {character?.ruleset_id === 'starfinder' || character?.ruleset_id === 'cyberpunk' ? 'Résonance Énergétique' : 'Thème Astral'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star size={12}/> Né le {character?.birth_date || 'Inconnu'} à {character?.birth_hour || '??'}h
                </span>
                {worldInfo && (
                  <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12}/> Temps du Monde : J{worldInfo.current_day} / M{worldInfo.current_month} / A{worldInfo.current_year}
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-black/60 px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-center shadow-inner">
              <span className="text-[10px] font-black text-silver/40 uppercase mb-1">Modificateur Global</span>
              <span className={`text-4xl font-black ${totalMod >= 0 ? 'text-green-400' : 'text-red-400'} drop-shadow-md`}>
                {totalMod > 0 ? `+${totalMod}` : totalMod}%
              </span>
            </div>
          </div>

          <p className="text-[10px] text-silver/40 font-bold uppercase tracking-widest border-t border-white/5 pt-4">
            Influences cumulées sur l'ensemble des compétences et jets de dés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {influences.map((inf, idx) => (
          <div key={idx} className="bg-[#151725] p-5 rounded-2xl border border-white/5 flex items-center gap-5 transition-all hover:bg-white/5 group">
            <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${inf.scale === 'natal' ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/5' : 'bg-purple-500/20 text-purple-400 shadow-purple-500/5'}`}>
              {inf.scale === 'natal' ? <Star size={24}/> : <Moon size={24}/>}
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">{inf.name}</h4>
              <p className="text-[10px] text-silver/50 font-bold uppercase flex items-center gap-2">
                <span className="text-teal-500/70">{inf.scale}</span> • {inf.celestial_bodies?.name || 'Astre dominant'}
              </p>
            </div>
            <div className={`ml-auto text-sm font-black ${inf.data?.celestial_configs?.global_modifier >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
              {inf.data?.celestial_configs?.global_modifier > 0 ? '+' : ''}{inf.data?.celestial_configs?.global_modifier}%
            </div>
          </div>
        ))}
        {influences.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
            <Sparkles size={32} className="mx-auto text-silver/10 mb-4" />
            <p className="text-[10px] text-silver/30 font-black uppercase tracking-widest">Le ciel est muet pour ce héros aujourd'hui</p>
          </div>
        )}
      </div>
    </div>
  );
}