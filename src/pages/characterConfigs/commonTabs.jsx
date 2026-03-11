// src/pages/characterConfigs/commonTabs.jsx
import React from 'react';
import { User, Sparkles, Scroll, Skull, Dices } from 'lucide-react';
import { DEFAULT_RULESETS } from '../../data/rulesets';
import CosmicInfluenceStatus from '../../components/CosmicInfluenceStatus';

// --- CALCUL SAVANT DE MORPHOLOGIE (Basé sur l'IMC) ---
const generateMorphology = (sizeCat) => {
  let height, weight, speed, bmi;
  switch (sizeCat) {
    case 'small':
      height = Math.floor(Math.random() * (130 - 80 + 1)) + 80;
      bmi = Math.random() * (30 - 20) + 20; 
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
      height = Math.floor(Math.random() * (200 - 150 + 1)) + 150; 
      bmi = Math.random() * (28 - 18) + 18; 
      weight = Math.round(bmi * Math.pow(height / 100, 2));
      speed = 9;
      break;
  }
  return { height, weight, speed_m: speed };
};

export const identityTab = {
  id: 'identity',
  label: 'Système & Identité',
  icon: User,
  columns: 3, // NOUVEAUTÉ : On active la grille à 3 colonnes !
  fields: [
    // Ligne 1 : Nom, Système, Monde
    { name: 'name', label: 'Nom du Héros', type: 'text', required: true, placeholder: 'Nom...' },
    { name: 'ruleset_id', label: 'Système de Règles', type: 'select', required: true, options: Object.entries(DEFAULT_RULESETS).map(([id, cfg]) => ({ value: id, label: cfg.name })) },
    { name: 'world_id', label: 'Monde d\'Origine', type: 'relation', table: 'worlds', required: true },
    
    // Ligne 2 : Race, Classe, Sous-Classe
    { name: 'race_id', label: 'Race / Origine', type: 'relation', table: 'races', required: true },
    { name: 'class_id', label: 'Classe / Vocation', type: 'relation', table: 'character_classes', required: true },
    { name: 'subclass_id', label: 'Archétype (Sous-Classe)', type: 'relation', table: 'subclasses', filterBy: 'class_id', filterValue: 'class_id' },
    
    // Ligne 3 : Type, Alignement, Sexe (Niveau retiré !)
    { name: 'character_type', label: 'Type', type: 'select', options: [{ value: 'PJ', label: 'PJ' }, { value: 'PNJ', label: 'PNJ' }] },
    { name: 'alignment', label: 'Alignement', type: 'text', placeholder: 'Ex: Loyal Bon' },
    { name: 'sex', label: 'Sexe / Genre', type: 'select', options: [{value:'M', label:'Masculin'}, {value:'F', label:'Féminin'}, {value:'X', label:'Autre'}] },

    // Le Bloc Morphologie (Il s'étendra sur les 3 colonnes car c'est un 'custom')
    { 
      name: 'physical_attributes_custom', 
      isVirtual: true,
      label: 'Physiologie & Mobilité', 
      type: 'custom', 
      render: (_, item) => {
        const sizes = { small: 'Petite (P)', medium: 'Moyenne (M)', large: 'Grande (G)' };
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center shadow-inner">
                <span className="text-[9px] text-silver/60 font-black uppercase tracking-widest block mb-1">Taille</span>
                <span className="text-white font-black text-sm">{sizes[item.data?.size_cat || 'medium']}</span>
             </div>
             <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center shadow-inner">
                <span className="text-[9px] text-silver/60 font-black uppercase tracking-widest block mb-1">Hauteur</span>
                <span className="text-white font-black text-sm">{item.data?.height || 170} cm</span>
             </div>
             <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-center shadow-inner">
                <span className="text-[9px] text-silver/60 font-black uppercase tracking-widest block mb-1">Poids</span>
                <span className="text-white font-black text-sm">{item.data?.weight || 70} kg</span>
             </div>
             <div className="bg-teal-900/20 p-3 rounded-2xl border border-teal-500/30 text-center shadow-inner">
                <span className="text-[9px] text-teal-500/80 font-black uppercase tracking-widest block mb-1">Vitesse</span>
                <span className="text-teal-400 font-black text-sm">{item.data?.speed_m || 9} m</span>
             </div>
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
          <div className="bg-[#151725] p-5 rounded-2xl border border-white/5 mb-4 shadow-inner">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <label className="text-[10px] font-black uppercase text-silver/40 tracking-widest">
                Physiologie & Mobilité
              </label>
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); handleSizeChange(formData.data?.size_cat || 'medium'); }}
                className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors uppercase font-black tracking-widest"
              >
                <Dices size={14} /> Relancer Morphologie
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-silver/60 mb-1 ml-1">Catégorie</span>
                <select 
                  value={formData.data?.size_cat || 'medium'}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="bg-black/40 text-white text-sm font-bold border border-white/10 rounded-xl px-3 outline-none focus:border-teal-500/50 h-[46px]"
                >
                  <option value="small">Petite (P)</option>
                  <option value="medium">Moyenne (M)</option>
                  <option value="large">Grande (G)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-silver/60 mb-1 ml-1">Hauteur (cm)</span>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('height', formData.data?.height || 170, -1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full flex items-center justify-center">-</button>
                  <input type="number" value={formData.data?.height || 170} onChange={(e) => updateData('height', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center text-white font-bold text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('height', formData.data?.height || 170, 1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full flex items-center justify-center">+</button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-silver/60 mb-1 ml-1">Poids (kg)</span>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('weight', formData.data?.weight || 70, -1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full flex items-center justify-center">-</button>
                  <input type="number" value={formData.data?.weight || 70} onChange={(e) => updateData('weight', parseInt(e.target.value) || 0)} className="w-full bg-transparent text-center text-white font-bold text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('weight', formData.data?.weight || 70, 1); }} className="px-4 hover:bg-white/10 text-silver font-black transition-colors h-full flex items-center justify-center">+</button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase text-teal-500/80 mb-1 ml-1">Vitesse (m)</span>
                <div className="flex items-center bg-teal-900/10 border border-teal-500/30 rounded-xl overflow-hidden h-[46px]">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('speed_m', formData.data?.speed_m || 9, -1.5); }} className="px-4 hover:bg-teal-500/20 text-teal-400 font-black transition-colors h-full flex items-center justify-center">-</button>
                  <input type="number" step="0.5" value={formData.data?.speed_m || 9} onChange={(e) => updateData('speed_m', parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-center text-teal-300 font-black text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <button type="button" onClick={(e) => { e.preventDefault(); handleNumChange('speed_m', formData.data?.speed_m || 9, 1.5); }} className="px-4 hover:bg-teal-500/20 text-teal-400 font-black transition-colors h-full flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    },
    { name: 'image_url', label: 'Portrait', type: 'image' }
  ]
};

export const cosmicTab = {
  id: 'cosmic',
  label: 'Destin & Astres',
  icon: Sparkles,
  fields: [
    { name: 'birth_date', label: 'Date de Naissance', type: 'text', placeholder: 'Ex: 14-03-1284' },
    { name: 'birth_hour', label: 'Heure de Naissance', type: 'number', placeholder: '0-23' },
    { 
      name: 'cosmic_status', 
      isVirtual: true,
      label: 'Influence des Astres', 
      type: 'custom', 
      render: (_, item) => <CosmicInfluenceStatus character={item} />, 
      component: ({ formData }) => <CosmicInfluenceStatus character={formData} /> 
    }
  ]
};

export const bioTab = {
  id: 'bio',
  label: 'Biographie & Histoire',
  icon: Scroll,
  fields: [
    { name: 'backstory', label: 'Histoire & Origines', type: 'textarea', rows: 6, placeholder: 'Récit de vie...' },
    { name: 'personality', label: 'Traits de Personnalité', type: 'textarea', rows: 3, placeholder: 'Caractère...' },
    { name: 'description', label: 'Apparence Physique', type: 'textarea', rows: 3, placeholder: 'Traits distinctifs...' }
  ]
};

export const gmTab = {
  id: 'gm',
  label: 'MJ (Secret)',
  icon: Skull,
  fields: [
    { name: 'gm_notes', label: 'Notes MJ', type: 'textarea', rows: 6, placeholder: 'Secrets sur le personnage...' }
  ]
};