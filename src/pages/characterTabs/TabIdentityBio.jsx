import React from 'react';
import { User, Sparkles, Scroll, Skull, Dices, Scale, Zap, Info, Camera, Heart } from 'lucide-react';
import { DEFAULT_RULESETS } from '../../data/ruleset_definitions/index';
import RulesetDynamicFields from '../../components/RulesetDynamicFields';
import CosmicInfluenceStatus from '../../components/CosmicInfluenceStatus';
import MultiSelectWithOther from '../../components/MultiSelectWithOther';

// --- CALCUL DE MORPHOLOGIE (Moteur PRESTIGE) ---
const generateMorphology = (sizeCat) => {
  let height, weight, speed, bmi;
  switch (sizeCat) {
    case 'small':
      height = Math.floor(Math.random() * (130 - 80 + 1)) + 80;
      bmi = Math.random() * (30 - 22) + 22; 
      weight = Math.round(bmi * Math.pow(height / 100, 2));
      speed = 7.5;
      break;
    case 'large':
      height = Math.floor(Math.random() * (300 - 220 + 1)) + 220;
      bmi = Math.random() * (35 - 25) + 25;
      weight = Math.round(bmi * Math.pow(height / 100, 2));
      speed = 12;
      break;
    case 'medium':
    default:
      height = Math.floor(Math.random() * (195 - 155 + 1)) + 155;
      bmi = Math.random() * (26 - 19) + 19;
      weight = Math.round(bmi * Math.pow(height / 100, 2));
      speed = 9;
      break;
  }
  return { height, weight, speed_m: speed };
};

export const identityTab = {
  id: 'identity',
  label: 'Identité & Système',
  icon: User,
  fields: [
    // --- COLONNE 1 : VISUEL ---
    { name: 'image_url', label: 'Portrait du Héros', type: 'image', bucket: 'portraits' },

    // --- COLONNE 2 : IDENTITÉ ---
    { name: 'name', label: 'Nom de la Légende', type: 'text', required: true, placeholder: 'Ex: Valerius l\'Audacieux...' },
    { 
      name: 'alignment', 
      label: 'Alignement', 
      type: 'custom', 
      component: (p) => <MultiSelectWithOther {...p} options={['Loyal Bon', 'Neutre Bon', 'Chaotique Bon', 'Loyal Neutre', 'Neutre Absolu', 'Chaotique Neutre', 'Loyal Mauvais', 'Neutre Mauvais', 'Chaotique Mauvais']} /> 
    },
    { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
    { 
      name: 'character_type', 
      label: 'Statut du Personnage', 
      type: 'custom',
      component: (p) => <MultiSelectWithOther {...p} options={['PJ (Héros)', 'PNJ Majeur', 'PNJ Mineur', 'Antagoniste']} />
    },
    { name: 'level', label: 'Niveau Actuel', type: 'number', required: true },
    { 
      name: 'sex', 
      label: 'Sexe / Genre', 
      type: 'custom',
      component: (p) => <MultiSelectWithOther {...p} options={['Masculin', 'Féminin', 'Non-binaire', 'Androgyne', 'Asexué']} />
    },

    // --- COLONNE 3 : ORIGINES ---
    { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
    { name: 'race_id', label: 'Race / Ascendance', type: 'relation', table: 'races', required: true },
    { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
    { name: 'subclass_id', label: 'Archétype (Spécialisation)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },

    // --- SECTION PHYSIOLOGIE (FULL WIDTH SOUS LE HEADER) ---
    { 
      name: 'physical_attributes_custom', 
      isVirtual: true,
      label: 'Physiologie & Mobilité', 
      type: 'custom', 
      render: (_, item) => {
        const sizes = { small: 'Petite', medium: 'Moyenne', large: 'Grande' };
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Taille', val: sizes[item.data?.size_cat || 'medium'], icon: Scale },
               { label: 'Hauteur', val: `${item.data?.height || 170} cm`, icon: Info },
               { label: 'Poids', val: `${item.data?.weight || 70} kg`, icon: Heart },
               { label: 'Vitesse', val: `${item.data?.speed_m || 9} m`, icon: Zap, color: 'text-teal-400' }
             ].map((box, i) => (
               <div key={i} className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center group hover:border-[#2DD4BF]/20 transition-colors">
                  <span className="text-[9px] text-silver/40 font-black uppercase tracking-[0.2em] block mb-2">{box.label}</span>
                  <div className={`flex items-center justify-center gap-2 font-black text-sm ${box.color || 'text-white'}`}>
                    <box.icon size={12} className="opacity-40" /> {box.val}
                  </div>
               </div>
             ))}
          </div>
        );
      },
      component: ({ formData, onFullChange }) => {
        const updateData = (key, val) => {
           onFullChange({ ...formData, data: { ...formData.data, [key]: val } });
        };
        const handleNumChange = (key, current, delta, min = 0) => {
           const val = parseFloat(current || 0) + delta;
           updateData(key, Math.max(min, val));
        };
        const handleSizeChange = (newSize) => {
           const autoStats = generateMorphology(newSize);
           onFullChange({ 
             ...formData, 
             data: { ...formData.data, size_cat: newSize, ...autoStats } 
           });
        };

        return (
          <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 mb-6 shadow-inner relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2DD4BF]/10 rounded-xl text-[#2DD4BF]">
                  <Scale size={18} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Scanner Physiologique</h4>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); handleSizeChange(formData.data?.size_cat || 'medium'); }}
                className="flex items-center gap-2 text-[9px] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/20 transition-all uppercase font-black tracking-widest active:scale-95"
              >
                <Dices size={14} /> Recalibrer Bio-stats
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Catégorie */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-silver/40 ml-1">Catégorie de Taille</span>
                <select 
                  value={formData.data?.size_cat || 'medium'}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="w-full bg-black/40 text-white text-xs font-black uppercase tracking-widest border border-white/10 rounded-xl px-4 h-[46px] outline-none focus:border-[#2DD4BF]/50 transition-colors"
                >
                  <option value="small">Petite (P)</option>
                  <option value="medium">Moyenne (M)</option>
                  <option value="large">Grande (G)</option>
                </select>
              </div>

              {/* Hauteur */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-silver/40 ml-1">Hauteur (cm)</span>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('height', formData.data?.height || 170, -1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full">-</button>
                  <input type="number" value={formData.data?.height || 170} onChange={(e) => updateData('height', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center text-white font-black text-sm outline-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('height', formData.data?.height || 170, 1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full">+</button>
                </div>
              </div>

              {/* Poids */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-silver/40 ml-1">Masse (kg)</span>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('weight', formData.data?.weight || 70, -1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full">-</button>
                  <input type="number" value={formData.data?.weight || 70} onChange={(e) => updateData('weight', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center text-white font-black text-sm outline-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('weight', formData.data?.weight || 70, 1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full">+</button>
                </div>
              </div>

              {/* Vitesse */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-[#2DD4BF]/60 ml-1">Célérité (m)</span>
                <div className="flex items-center bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('speed_m', formData.data?.speed_m || 9, -1.5); }} className="px-4 hover:bg-[#2DD4BF]/10 text-[#2DD4BF] font-black transition-colors h-full">-</button>
                  <input type="number" step="0.5" value={formData.data?.speed_m || 9} onChange={(e) => updateData('speed_m', parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-center text-[#2DD4BF] font-black text-sm outline-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('speed_m', formData.data?.speed_m || 9, 1.5); }} className="px-4 hover:bg-[#2DD4BF]/10 text-[#2DD4BF] font-black transition-colors h-full">+</button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  ]
};

export const cosmicTab = {
  id: 'cosmic',
  label: 'Astrologie',
  icon: Sparkles,
  fields: [
    { name: 'birth_date', label: 'Cycle de Naissance', type: 'text', placeholder: 'Ex: 14 du mois des Moissons, an 1284...' },
    { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
    { 
      name: 'cosmic_status', 
      isVirtual: true,
      label: 'Influence Stellaires', 
      type: 'custom', 
      render: (_, item) => <CosmicInfluenceStatus character={item} />, 
      component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
    }
  ]
};

export const bioTab = {
  id: 'bio',
  label: 'Biographie',
  icon: Scroll,
  fields: [
    { name: 'backstory', label: 'Chroniques du Passé', type: 'textarea', rows: 8, placeholder: 'Récit de vie, tragédies et gloires passées...' },
    { name: 'personality', label: 'Psyché & Tempérament', type: 'textarea', rows: 3, placeholder: 'Traits de caractère, idéaux, liens et défauts...' },
    { name: 'description', label: 'Description Visuelle', type: 'textarea', rows: 3, placeholder: 'Cicatrices, tatouages, aura, démarche...' }
  ]
};

export const gmTab = {
  id: 'gm',
  label: 'Notes MJ',
  icon: Skull,
  fields: [
    { name: 'gm_notes', label: 'Secrets de la Destinée', type: 'textarea', rows: 10, placeholder: 'Informations secrètes, complots et révélations à venir...' }
  ]
};