import React from 'react';
import { Skull, Swords, Heart, Shield, Activity, Scroll, TreePine, Zap, Target, Eye } from 'lucide-react';

/**
 * MonstersLayout - Standard PRESTIGE 4.2 CIBLÉ
 * Unité visuelle "Monde" pour le Lore, Gigantisme ciblé pour le Combat.
 */
export default function MonstersLayout({ config, activeTab, renderFieldValue, formData }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // --- SYSTÈME DE STYLES UNIFIÉ ---
  
  // Libellé Sarcelle standard
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  
  // BOX STANDARD (Miroir Monde) : 13px normal
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center text-[13px] text-white/90";
  
  // BOX NARRATIVE (Miroir Monde) : 13px normal
  const textAreaBoxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-5 min-h-[120px] items-start text-[13px] leading-relaxed text-silver/90 shadow-inner";

  // BOX COMBAT GÉANTE (Ciblée) : 32px font-black
  const combatStatBoxStyle = "bg-black/20 backdrop-blur-sm rounded-2xl border-2 border-teal-500/10 p-4 justify-center text-[32px] font-black h-28 shadow-2xl flex items-center text-white tracking-tighter";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ==================================================================
          ONGLET 1 : GÉNÉRAL (Standard Monde)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            
            <div className="md:col-span-4 h-full min-h-[380px]">
              <label className={labelStyle}>Spécimen Identifié</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl relative">
                {renderFieldValue(activeTabData.fields.find(f => f.name === 'image_url'))}
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-5 h-full content-start">
                {[
                  { id: 'name', label: 'Désignation' },
                  { id: 'subtitle', label: 'Titre de Légende' },
                  { id: 'ruleset_id', label: 'Système' },
                  { id: 'world_id', label: 'Origine Planaire' },
                  { id: 'type', label: 'Classification' },
                  { id: 'size', label: 'Gabarit' },
                  { id: 'alignment', label: 'Alignement' }
                ].map(item => {
                  const f = activeTabData.fields.find(field => field.name === item.id);
                  return f ? (
                    <div key={item.id}>
                      <label className={labelStyle}>{item.label}</label>
                      <div className={boxStyle}>{renderFieldValue(f)}</div>
                    </div>
                  ) : null;
                })}
              </div>
              
              <div className="mt-2">
                <label className={labelStyle}>Capacités Système</label>
                <div className="p-1 bg-white/5 rounded-2xl border border-white/5">
                   <div className="bg-teal-500/5 p-6 rounded-xl border border-teal-500/10">
                      {renderFieldValue(activeTabData.fields.find(f => f.name === 'dynamic_monster_fields'))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-10">
            <label className={labelStyle}>Description Fondamentale</label>
            <div className={textAreaBoxStyle}>
              {renderFieldValue(activeTabData.fields.find(f => f.name === 'description'))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLET 2 : COMBAT (Gros & Gras Uniquement ici)
          ================================================================== */}
      {activeTab === 'combat' && (
        <div className="space-y-12">
          
          <div className="w-full">
            <label className={labelStyle}>Architecture des Attributs</label>
            <div className="p-1 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl">
               <div className="bg-black/30 p-10 rounded-[2.3rem]">
                  {renderFieldValue(activeTabData.fields.find(f => f.name === 'stats'))}
               </div>
            </div>
          </div>

          {/* GRILLE GÉANTE POUR LES 3 STATS CLÉS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'armor_class', label: 'Classe d\'Armure', icon: Shield },
              { id: 'hit_points', label: 'Points de Vie', icon: Heart },
              { id: 'challenge_rating', label: 'Facteur de Danger', icon: Activity }
            ].map(stat => (
              <div key={stat.id}>
                <label className={labelStyle}>{stat.label}</label>
                <div className={combatStatBoxStyle}>
                  {renderFieldValue(activeTabData.fields.find(f => f.name === stat.id))}
                </div>
              </div>
            ))}
          </div>

          {/* TRAITS ET ACTIONS (Retour au standard Monde) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-10 border-t border-white/5">
            <div className="md:col-span-5 space-y-10">
              <div>
                <label className={labelStyle}>Traits & Facultés Passives</label>
                <div className={boxStyle + " min-h-[140px] items-start p-5"}>
                  {renderFieldValue(activeTabData.fields.find(f => f.name === 'abilities'))}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Manifestations Légendaires</label>
                <div className="bg-teal-500/5 p-6 rounded-2xl border border-teal-500/10 text-[13px] text-teal-200/60 italic shadow-inner">
                  {renderFieldValue(activeTabData.fields.find(f => f.name === 'legendary_actions'))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-7">
              <label className={labelStyle}>Répertoire d'Attaques & Actions</label>
              <div className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 text-[15px] text-silver/90 whitespace-pre-wrap leading-loose">
                {renderFieldValue(activeTabData.fields.find(f => f.name === 'actions'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          ONGLETS ÉCOLOGIE & LORE (Standard Monde)
          ================================================================== */}
      {['ecology', 'lore', 'gm'].includes(activeTab) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {activeTabData.fields.map(f => (
            <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
              <label className={labelStyle}>{f.label}</label>
              <div className={boxStyle + " min-h-[100px] items-start p-5"}>
                {renderFieldValue(f)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GALERIE */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <label className={labelStyle}>Archives Visuelles du Spécimen</label>
          <div className="p-2 bg-white/5 rounded-[3rem] border border-white/5">
             <div className="p-10">{renderFieldValue(activeTabData.fields[0])}</div>
          </div>
        </div>
      )}
    </div>
  );
}