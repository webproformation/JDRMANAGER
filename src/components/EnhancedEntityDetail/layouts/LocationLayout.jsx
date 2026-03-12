import React from 'react';
import { Shield, ShoppingBag, Skull, History, CalendarDays } from 'lucide-react';

// Import du moteur de chronologie autonome V4.3
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * LocationLayout - Version Prestige 3.0
 * Structure optimisée pour les lieux remarquables, ruines et points d'intérêt.
 * Intégration de la Chronique Temporelle V4.3 (Autonome) [cite: 2026-03-12].
 */
export default function LocationLayout({ item, config, activeTab, renderFieldValue }) {
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
          1. GÉNÉRAL : 3 COLONNES RÉELLES (Image | Nom+Surnom+Règles | Monde+Pays)
          ================================================================== */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Col 1 : Image principale */}
            <div className="h-full min-h-[300px]">
              <label className={labelStyle}>Visuel du Lieu</label>
              <div className="h-[calc(100%-22px)] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 : Nom, Surnom, Règles */}
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Nom du lieu</label>
                <div className="bg-gradient-to-r from-amber-500/20 to-transparent rounded-xl border border-white/10 p-4 text-xl font-black text-white uppercase tracking-wider">
                  {renderFieldValue(getField('name'))}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Surnom ou Type précis</label>
                <div className={boxStyle}>{renderFieldValue(getField('subtitle'))}</div>
              </div>
              <div>
                <label className={labelStyle}>Système de Règles local</label>
                <div className={boxStyle}>{renderFieldValue(getField('ruleset_id'))}</div>
              </div>
            </div>

            {/* Col 3 : Monde, Pays */}
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Monde</label>
                <div className={boxStyle}>{renderFieldValue(getField('world_id'))}</div>
              </div>
              <div>
                <label className={labelStyle}>Pays / Région</label>
                <div className={boxStyle}>{renderFieldValue(getField('country_id'))}</div>
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
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 shadow-inner">
                {renderFieldValue(getField('dynamic_geo'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. EXPLORATION : Grille 3 + 2
          ================================================================== */}
      {activeTab === 'exploration' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['location_type', 'accessibility', 'climate'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {['visibility', 'area'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. HISTOIRE (Mise à jour V4.3 Contextuelle)
          ================================================================== */}
      {activeTab === 'history_tab' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Mémoire des Pierres & Chroniques du Monde</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-amber-500/10 bg-[#151725]/60 p-1 shadow-2xl">
              <div className="bg-amber-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-amber-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE : Le Moteur V4.3 en Mode Lecture */}
                <HistoryChronicleEditor 
                  worldId={item?.world_id} 
                  entityId={item?.id}      
                  entityType="location"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          4. SERVICES & COMMERCES : Grille 3 colonnes
          ================================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <ShoppingBag size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Services Disponibles</h4>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {['artisans', 'merchants', 'inns_accommodation'].map(name => (
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
          5. DANGERS & TRÉSORS : Grille 1 + 2
          ================================================================== */}
      {activeTab === 'dangers' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Skull size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Menaces & Récompenses</h4>
          </div>
          <div className="w-full">
            <label className={labelStyle}>Niveau de danger</label>
            <div className={boxStyle + " font-black text-red-500 uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]"}>
              {renderFieldValue(getField('danger_level'))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {['encounters', 'treasures'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[120px] items-start py-3 leading-relaxed"}>
                  {renderFieldValue(getField(name))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          6. GALERIE
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="w-full">
           {renderFieldValue(getField('location_images'))}
        </div>
      )}

      {/* ==================================================================
          7. MJ : Archives Secrètes
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Shield size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Archives Secrètes MJ</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Secrets du lieu</label>
              <div className={boxStyle + " min-h-[150px] items-start py-3 text-red-200/80 leading-relaxed italic"}>
                {renderFieldValue(getField('gm_secrets_location'))}
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