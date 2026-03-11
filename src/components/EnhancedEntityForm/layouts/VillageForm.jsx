import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';

export default function VillageForm({ formData, activeTab, handleChange, setFormData, config, contentRef, readOnly = false }) {
  const currentTab = config.tabs.find(t => t.id === activeTab);
  
  const scrollContent = (direction) => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: direction === 'up' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const renderFieldByName = (name, span = "md:col-span-1") => {
    const field = currentTab?.fields?.find(f => f.name === name);
    if (!field) return null;
    return (
      <div key={field.name} className={span}>
        <FieldRenderer 
          field={field} 
          formData={formData} 
          handleChange={handleChange} 
          setFormData={setFormData} 
          readOnly={readOnly} 
          onFullChange={(newFull) => setFormData(newFull)} 
        />
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Boutons de navigation latérale */}
      <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden lg:flex">
        <button type="button" onClick={() => scrollContent('up')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronUp size={20} /></button>
        <button type="button" onClick={() => scrollContent('down')} className="p-3 bg-white/5 hover:bg-slate-500/20 text-silver/40 hover:text-slate-400 rounded-full border border-white/5 transition-all shadow-xl"><ChevronDown size={20} /></button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. GÉNÉRAL : 3 COLONNES RÉELLES (Image | Nom+Surnom+Règles | Monde+Pays) */}
        {activeTab === 'general' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Col 1 : Image */}
              <div>{renderFieldByName('image_url', 'w-full')}</div>
              
              {/* Col 2 : Nom, Surnom, Règles */}
              <div className="space-y-6">
                {renderFieldByName('name', 'w-full')}
                {renderFieldByName('subtitle', 'w-full')}
                {renderFieldByName('ruleset_id', 'w-full')}
              </div>

              {/* Col 3 : Monde, Pays */}
              <div className="space-y-6">
                {renderFieldByName('world_id', 'w-full')}
                {renderFieldByName('country_id', 'w-full')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
              {renderFieldByName('description', 'w-full')}
              {renderFieldByName('dynamic_geo', 'w-full')}
            </div>
          </div>
        )}

        {/* 2. INFRASTRUCTURE : Grille 3 + 3 (Taille, Emplacement, Fondation | Architecture, Eau, Assainissement) */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              {['area', 'exact_location', 'founded'].map(n => renderFieldByName(n))}
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {['architecture', 'water_supply', 'sanitation'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* 3. LIEUX & QUARTIERS : Grille 3 + 2 (Lieux, Temples, Guildes | Marchés, Tavernes) */}
        {activeTab === 'places' && (
          <div className="space-y-8">
             <div className="grid grid-cols-3 gap-6">
                {['landmarks', 'temples', 'guildhalls'].map(n => renderFieldByName(n))}
             </div>
             <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                {['markets', 'taverns_inns'].map(n => renderFieldByName(n))}
             </div>
          </div>
        )}

        {/* 4. SOCIÉTÉ : Grille 3 + 3 (Habitants, Population, Gouvernement | Classes, Criminalité, Factions) */}
        {activeTab === 'society' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              {['demographics', 'population', 'government'].map(n => renderFieldByName(n))}
            </div>
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
               {['social_classes', 'crime_rate', 'factions'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}

        {/* 5. ÉCONOMIE & BUTINS : 2 colonnes */}
        {activeTab === 'economy_tab' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {renderFieldByName('economy', 'w-full')}
            {renderFieldByName('treasures', 'w-full')}
          </div>
        )}

        {/* 6. GALERIE */}
        {activeTab === 'gallery' && (
          <div className="w-full">{renderFieldByName('village_images', 'w-full')}</div>
        )}

        {/* 7. MJ : Secrets/Dangers puis Histoire/Notes */}
        {activeTab === 'gm' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-10">
              {['gm_secrets_village', 'dangers'].map(n => renderFieldByName(n))}
            </div>
            <div className="grid grid-cols-2 gap-10 border-t border-white/5 pt-8">
              {['history', 'notes'].map(n => renderFieldByName(n))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}