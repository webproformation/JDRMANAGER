import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RelationSelect({ 
  table,      // Nouveau standard
  tableName,  // Support rétro-compatible (au cas où)
  value, 
  onChange, 
  placeholder = "Sélectionner...", 
  filterBy, 
  filterValue,
  required
}) {
  // On prend 'table' en priorité, sinon 'tableName'
  const targetTable = table || tableName;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- SECURITÉ CRITIQUE ---
    // Si aucune table n'est définie, on ne lance PAS la requête.
    // Cela stoppe net l'erreur 404 ".../rest/v1/undefined"
    if (!targetTable) return;

    fetchOptions();
  }, [targetTable, filterBy, filterValue]);

  const fetchOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from(targetTable)
        .select('id, name')
        .order('name', { ascending: true });

      if (filterBy && filterValue) {
        query = query.eq(filterBy, filterValue);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOptions(data || []);
    } catch (err) {
      console.error(`[RelationSelect] Erreur chargement ${targetTable}:`, err);
      setError("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  // Style "Abyssal" (Teal/Dark)
  const baseClass = "w-full bg-[#151725] border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder-silver/30 outline-none appearance-none cursor-pointer disabled:opacity-50";

  // Si pas de config, on affiche une petite alerte visuelle au lieu de planter
  if (!targetTable) {
    return (
        <div className="text-red-400 text-xs p-2 border border-red-500/20 rounded bg-red-500/10 flex items-center gap-2">
            <AlertCircle size={12} />
            <span>Erreur config : Table manquante</span>
        </div>
    );
  }

  return (
    <div className="relative w-full">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
        className={baseClass}
        disabled={loading}
        required={required}
      >
        <option value="" className="text-silver/50 bg-[#1a1d2d]">
          {loading ? "Chargement..." : placeholder}
        </option>
        
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="text-white bg-[#1a1d2d]">
            {opt.name}
          </option>
        ))}
      </select>

      {/* Icône à droite */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-silver/50">
        {loading ? (
            <Loader size={16} className="animate-spin text-teal-500" />
        ) : (
            <ChevronDown size={16} />
        )}
      </div>
    </div>
  );
}