import React from 'react';
import { 
  Shield, History, CalendarDays, Crown, Sun, Moon, Zap, Sparkles, 
  Scroll, Zap as PowerIcon, Users 
} from 'lucide-react';

// Import du moteur de chronologie autonome V4.3
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * DeityLayout - Version Prestige 3.0
 * Visualisation majestueuse des divinités et de leurs interventions temporelles.
 * Intégration de la Chronique Divine V4.3 (Autonome) [cite: 2026-03-12].
 */
export default function DeityLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // Correction PRESTIGE : Autorisation explicite du champ virtuel de chronologie
  const visibleFields = activeTabData?.fields.filter(f => 
    !f.isVirtual || f.component || f.type === 'world_history_editor'
  ) || [];
  
  const labelStyle = "text-[9px] font-black text-teal-500/50 uppercase tracking-[0.25em] mb-1.5 block ml-1";
  const boxStyle = "bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center w-full";

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          1. IDENTITÉ DIVINE : 3 COLONNES RÉELLES (Avatar | Détails | Monde)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Col 1 : Avatar Divin */}
            <div className="md:col-span-4 h-full min-h-[350px]">
              <label className={labelStyle}>Manifestation Visuelle</label>
              <div className="h-[calc(100%-24px)] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 & 3 : Rang, Alignement et Domaines */}
            <div className="md:col-span-8 grid grid-cols-3 gap-5 h-full content-start">
              <div className="col-span-3">
                <label className={labelStyle}>Nom de la Divinité</label>
                <div className="bg-gradient-to-r from-teal-500/20 to-transparent rounded-xl border border-white/10 p-5 text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                  <Sparkles className="text-teal-400" size={24} />
                  {renderFieldValue(getField('name'))}
                </div>
              </div>

              {['title', 'divine_rank', 'alignment', 'ruleset_id', 'pantheon', 'world_id'].map(name => (
                <div key={name}>
                  <label className={labelStyle}>{getField(name)?.label}</label>
                  <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
                </div>
              ))}
              
              <div className="col-span-3 grid grid-cols-2 gap-5 mt-2">
                {['domains', 'portfolio'].map(name => (
                  <div key={name}>
                    <label className={labelStyle}>{getField(name)?.label}</label>
                    <div className={boxStyle + " min-h-[60px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
                  </div>
                ))}
              </div>

              {/* Propriétés Système */}
              <div className="col-span-3 mt-4">
                 {renderFieldValue(getField('dynamic_deity_fields'))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
            <div>
              <label className={labelStyle}>Description & Mythes</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4 text-silver/80 leading-relaxed"}>
                {renderFieldValue(getField('description'))}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Apparence Terrestre</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4 text-teal-100/60 italic"}>
                {renderFieldValue(getField('appearance'))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelStyle}>Symbole Sacré</label>
              <div className={boxStyle + " font-bold text-teal-400"}>{renderFieldValue(getField('symbol'))}</div>
            </div>
            <div>
              <label className={labelStyle}>Signification</label>
              <div className={boxStyle}>{renderFieldValue(getField('sacred_symbol_description'))}</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. CULTE & DOGME : Structure 3+2
          ================================================================== */}
      {activeTab === 'worship' && (
        <div className="space-y-12">
          <div className="w-full">
            {renderFieldValue(getField('data'))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['favored_weapon', 'holy_days', 'clergy_alignments'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['rituals', 'worshippers', 'typical_worshippers'].map(name => (
                <div key={name}>
                  <label className={labelStyle}>{getField(name)?.label}</label>
                  <div className={boxStyle + " min-h-[100px] items-start py-3 leading-relaxed"}>{renderFieldValue(getField(name))}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['divine_servants', 'temples'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[100px] items-start py-3 leading-relaxed"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. ACTES & CHRONOLOGIE : Le Moteur V4.3 en Mode Majestueux
          ================================================================== */}
      {activeTab === 'history_tab' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Mémoire de l'Éternité & Actes Divins</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-[#151725]/60 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-teal-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE : Le Moteur V4.3 */}
                <HistoryChronicleEditor 
                  worldId={item?.world_id} 
                  entityId={item?.id}      
                  entityType="deity"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          4. POUVOIRS & ARTEFACTS : Structure 3+2
          ================================================================== */}
      {activeTab === 'powers' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['sacred_artifacts', 'granted_powers', 'divine_spells'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[120px] items-start py-4 leading-relaxed"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
            {['avatar_description', 'manifestations'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[120px] items-start py-4 text-teal-100/50 italic leading-relaxed"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          5. RELATIONS : Divinités Alliées & Ennemies
          ================================================================== */}
      {activeTab === 'relations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {['allies', 'enemies'].map(name => (
            <div key={name}>
              <label className={labelStyle}>{getField(name)?.label}</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4 leading-relaxed"}>{renderFieldValue(getField(name))}</div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================================
          6. GALERIE SACRÉE
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="w-full">
           {renderFieldValue(getField('deity_images'))}
        </div>
      )}

      {/* ==================================================================
          7. SECRETS MJ : Intrigues & Archives MJ
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10 space-y-8 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Shield size={18} />
            <h4 className="text-xs font-black uppercase tracking-widest">Archives Interdites du MJ</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['gm_notes', 'gm_secret_plots', 'gm_conspiracies'].map(name => (
              <div key={name}>
                <label className={labelStyle + " text-red-400/60"}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[150px] items-start py-4 text-red-100/70 border-red-500/10"}>
                  {renderFieldValue(getField(name))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-red-500/10">
             <label className={labelStyle + " text-red-400/60"}>Visualisations de Complots</label>
             {renderFieldValue(getField('gm_secret_images'))}
          </div>
        </div>
      )}
    </div>
  );
}