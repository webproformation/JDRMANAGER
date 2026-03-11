import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Check } from 'lucide-react';

export default function LanguageCheckboxSelector({ value, onChange, readOnly = false }) {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // On transforme la chaîne "Langue 1, Langue 2" en tableau pour la gestion interne
  const selectedList = value ? value.split(', ').filter(v => v.trim() !== '') : [];

  useEffect(() => {
    const fetchLanguages = async () => {
      const { data, error } = await supabase
        .from('languages')
        .select('name')
        .order('name', { ascending: true });
      
      if (!error && data) setLanguages(data);
      setLoading(false);
    };
    fetchLanguages();
  }, []);

  const toggleLanguage = (langName) => {
    if (readOnly) return;
    
    let newList;
    if (selectedList.includes(langName)) {
      newList = selectedList.filter(l => l !== langName);
    } else {
      newList = [...selectedList, langName];
    }
    
    // On renvoie une chaîne séparée par des virgules pour la colonne TEXT de la DB
    onChange(newList.join(', '));
  };

  if (loading) return (
    <div className="flex items-center gap-2 text-silver/40 text-[10px] uppercase tracking-widest p-4">
      <Loader2 size={14} className="animate-spin" /> Chargement des langues...
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-1">
      {languages.map((lang) => {
        const isChecked = selectedList.includes(lang.name);
        return (
          <button
            key={lang.name}
            type="button"
            disabled={readOnly}
            onClick={() => toggleLanguage(lang.name)}
            className={`
              flex items-center gap-3 p-3 rounded-xl border transition-all text-left
              ${isChecked 
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                : 'bg-white/5 border-white/5 text-silver/60 hover:border-white/10 hover:bg-white/10'
              }
              ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-5 h-5 rounded-md border flex items-center justify-center transition-all
              ${isChecked ? 'bg-teal-500 border-teal-500' : 'border-white/20 bg-black/20'}
            `}>
              {isChecked && <Check size={12} className="text-white" strokeWidth={4} />}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              {lang.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}