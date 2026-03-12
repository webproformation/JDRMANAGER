import React from 'react';
import { Shield, Waves, Anchor, History, CalendarDays, Droplets, Skull } from 'lucide-react';

// Import du moteur de chronologie autonome V4.3
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * OceanLayout - Version Prestige 3.0
 * Structure optimisée pour les étendues maritimes et abyssales.
 * Intégration de la Chronique des Mers V4.3 (Autonome) [cite: 2026-03-12].
 */
export default function OceanLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // Correction PRESTIGE : On autorise explicitement le moteur d'histoire virtuel
  const visibleFields = activeTabData?.fields.filter(f => 
    !f.isVirtual || f.component || f.type === 'world_history_editor'
  ) || [];
  
  const labelStyle = "text-[9px] font-black text-slate-400/60 uppercase tracking-[0.25em] mb-1 block ml-1";
  const boxStyle = "bg-[#151725]/40 rounded-xl border border-white/5 p-3 shadow-inner min-h-[44px] flex items-center w-full";

  const getField = (name) => visibleFields.find(f => f.name === name);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ==================================================================
          1. GÉNÉRAL : 3 COLONNES RÉELLES (Image | Nom+Surnom+Règles | Monde)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Col 1 : Image principale */}
            <div className="h-full min-h-[300px]">
              <label className={labelStyle}>Visuel Maritime</label>
              <div className="h-[calc(100%-22px)] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 : Nom, Surnom, Règles */}
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Nom de l'Océan</label>
                <div className="bg-gradient-to-r from-blue-500/20 to-transparent rounded-xl border border-white/10 p-4 text-xl font-black text-white uppercase tracking-wider">
                  {renderFieldValue(getField('name'))}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Titre ou Surnom</label>
                <div className={boxStyle}>{renderFieldValue(getField('subtitle'))}</div>
              </div>
              <div>
                <label className={labelStyle}>Système de Règles</label>
                <div className={boxStyle}>{renderFieldValue(getField('ruleset_id'))}</div>
              </div>
            </div>

            {/* Col 3 : Monde */}
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Monde</label>
                <div className={boxStyle}>{renderFieldValue(getField('world_id'))}</div>
              </div>
            </div>
          </div>
          
          {/* Description et Propriétés Système en dessous */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <label className={labelStyle}>Description</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4 text-silver/80 leading-relaxed"}>
                {renderFieldValue(getField('description'))}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Propriétés Système</label>
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 shadow-inner">
                {renderFieldValue(getField('dynamic_geo'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. ENVIRONNEMENT MARIN : Grille 4 colonnes
          ================================================================== */}
      {activeTab === 'environment' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Droplets size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Caractéristiques Physiques</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['area', 'depth', 'water_temp', 'visibility'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[80px] items-start py-3"}>
                  {renderFieldValue(getField(name))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. NAVIGATION & FLUX : Grille 3 colonnes
          ================================================================== */}
      {activeTab === 'navigation' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Anchor size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Flux & Ressources</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['currents', 'routes', 'resources'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[100px] items-start py-3 leading-relaxed text-silver/80"}>
                  {renderFieldValue(getField(name))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          4. HISTOIRE (Mise à jour V4.3 Contextuelle)
          ================================================================== */}
      {activeTab === 'history_tab' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Mémoire des Flots & Chroniques du Monde</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-cyan-500/10 bg-[#151725]/60 p-1 shadow-2xl">
              <div className="bg-cyan-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-cyan-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE : Le Moteur V4.3 en Mode Lecture */}
                <HistoryChronicleEditor 
                  worldId={item?.world_id} 
                  entityId={item?.id}      
                  entityType="ocean"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          5. DANGERS RÉPERTORIÉS
          ================================================================== */}
      {activeTab === 'hazards_tab' && (
        <div className="w-full">
           <div className="flex items-center gap-2 mb-2 text-red-500">
             <Skull size={14} />
             <h4 className="text-[10px] font-black uppercase tracking-widest">Menaces des Profondeurs</h4>
           </div>
           <label className={labelStyle}>Risques & Phénomènes</label>
           <div className={boxStyle + " min-h-[150px] items-start py-4 text-red-400 bg-red-500/5 border-red-500/10 leading-relaxed"}>
             {renderFieldValue(getField('hazards'))}
           </div>
        </div>
      )}

      {/* ==================================================================
          6. GALERIE
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="w-full">
           {renderFieldValue(getField('ocean_images'))}
        </div>
      )}

      {/* ==================================================================
          7. MJ : Secrets & Notes
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Shield size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Archives Secrètes MJ</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Secrets des profondeurs</label>
              <div className={boxStyle + " min-h-[150px] items-start py-3 text-red-200/80 leading-relaxed italic"}>
                {renderFieldValue(getField('gm_secrets_ocean'))}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Notes diverses</label>
              <div className={boxStyle + " min-h-[150px] items-start py-3 text-red-100/40"}>
                {renderFieldValue(getField('notes'))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}