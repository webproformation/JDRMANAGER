import React from 'react';
import { Shield, History, CalendarDays, Map, Building2, Users, DollarSign } from 'lucide-react';

// LE CORRECTIF EST ICI : Import du moteur autonome V4.2
import HistoryChronicleEditor from '../../HistoryChronicleEditor';

/**
 * CityLayout - Version Prestige 3.0
 * Structure chirurgicale pour la visualisation des cités.
 * Intégration de la Chronique Urbaine V4.2 (Autonome) [cite: 2026-03-12].
 */
export default function CityLayout({ item, config, activeTab, renderFieldValue }) {
  const activeTabData = config.tabs.find(t => t.id === activeTab);
  
  // Correction PRESTIGE : On autorise explicitement le type 'world_history_editor' à s'afficher 
  // même s'il est 'isVirtual: true'
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
              <label className={labelStyle}>Visuel de la Cité</label>
              <div className="h-[calc(100%-22px)] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/20">
                {renderFieldValue(getField('image_url'))}
              </div>
            </div>
            
            {/* Col 2 : Nom, Surnom, Règles */}
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelStyle}>Nom de la cité</label>
                <div className="bg-gradient-to-r from-slate-500/20 to-transparent rounded-xl border border-white/10 p-4 text-xl font-black text-white uppercase tracking-wider">
                  {renderFieldValue(getField('name'))}
                </div>
              </div>
              <div>
                <label className={labelStyle}>Surnom</label>
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
                <label className={labelStyle}>Pays</label>
                <div className={boxStyle}>{renderFieldValue(getField('country_id'))}</div>
              </div>
            </div>
          </div>
          
          {/* Description et Propriétés Système en dessous */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <label className={labelStyle}>Description générale</label>
              <div className={boxStyle + " min-h-[120px] items-start py-4 text-silver/80 leading-relaxed"}>
                {renderFieldValue(getField('description'))}
              </div>
            </div>
            <div>
              <label className={labelStyle}>Propriétés Système</label>
              <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 shadow-inner">
                {renderFieldValue(getField('dynamic_geo'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          2. INFRASTRUCTURE : 2 lignes de 3 colonnes (3+3)
          ================================================================== */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['area', 'founded', 'water_supply'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
            {['sanitation', 'architecture', 'defenses'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[80px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          3. QUARTIERS ET LIEUX : 7 champs -> 3, 2, 2
          ================================================================== */}
      {activeTab === 'districts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['districts', 'landmarks', 'temples'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[100px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {['guildhalls', 'markets'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[80px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['inns_taverns', 'notable_locations'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[80px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          4. SOCIÉTÉ : 6 champs -> 2 lignes de 3 colonnes (3+3)
          ================================================================== */}
      {activeTab === 'society' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {['population', 'demographics', 'government'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
            {['social_classes', 'crime_rate', 'factions'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[100px] items-start py-3"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================
          5. ÉCONOMIE : Full width
          ================================================================== */}
      {activeTab === 'economy' && (
        <div className="w-full">
          <label className={labelStyle}>Économie générale</label>
          <div className={boxStyle + " min-h-[200px] items-start py-4 leading-relaxed"}>{renderFieldValue(getField('economy'))}</div>
        </div>
      )}

      {/* ==================================================================
          6. HISTOIRE (Mise à jour V4.2 Contextuelle)
          ================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
          <div className="w-full">
            <label className={labelStyle}>Chroniques des Temps Anciens & Modernes</label>
            <div className="rounded-[3.5rem] overflow-hidden border border-teal-500/10 bg-[#151725]/60 p-1 shadow-2xl">
              <div className="bg-teal-500/5 p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <CalendarDays size={120} className="text-teal-400" />
                </div>
                
                {/* L'INJECTION MAGIQUE DIRECTE : Le Moteur V4.2 en Mode Lecture */}
                <HistoryChronicleEditor 
                  worldId={item?.world_id} // Indispensable pour le calendrier
                  entityId={item?.id}      // L'ID de la cité
                  entityType="city"
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================
          7. GALERIE
          ================================================================== */}
      {activeTab === 'gallery' && (
        <div className="w-full">
           {renderFieldValue(getField('city_images'))}
        </div>
      )}

      {/* ==================================================================
          8. MJ : Archives Secrètes
          ================================================================== */}
      {activeTab === 'gm' && (
        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/10 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <Shield size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Archives Secrètes MJ</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['gm_secrets_city', 'notes'].map(name => (
              <div key={name}>
                <label className={labelStyle}>{getField(name)?.label}</label>
                <div className={boxStyle + " min-h-[150px] items-start py-3 leading-relaxed"}>{renderFieldValue(getField(name))}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}