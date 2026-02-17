import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function FilterBar({ filters, onFilterChange }) {
  const [filterOptions, setFilterOptions] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, [filters]);

  const loadFilterOptions = async () => {
    const options = {};

    for (const filter of filters) {
      if (filter.type === 'relation') {
        try {
          const { data } = await supabase
            .from(filter.relationTable)
            .select('id, name')
            .order('name');

          options[filter.key] = data || [];
        } catch (error) {
          console.error(`Error loading ${filter.relationTable}:`, error);
          options[filter.key] = [];
        }
      }
    }

    setFilterOptions(options);
  };

  const handleFilterChange = (filterKey, value) => {
    onFilterChange({ [filterKey]: value });
  };

  const activeFiltersCount = filters.reduce((count, filter) => {
    return count + (filter.value ? 1 : 0);
  }, 0);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg hover:bg-opacity-80 transition-all"
      >
        <Filter size={18} />
        <span>Filtres</span>
        {activeFiltersCount > 0 && (
          <span className="bg-cyan-light text-night px-2 py-0.5 rounded-full text-xs font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-night bg-opacity-40 backdrop-blur-sm rounded-lg border border-arcane border-opacity-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-semibold text-soft-white mb-2">
                  {filter.label}
                </label>

                <div className="relative">
                  <select
                    value={filter.value || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg focus:ring-2 focus:ring-cyan-light focus:border-cyan-light transition-all text-sm appearance-none"
                  >
                    <option value="">Tous</option>
                    {filter.type === 'relation' && filterOptions[filter.key]?.map(option => (
                      <option key={option.id} value={option.id} className="bg-night">
                        {option.name}
                      </option>
                    ))}
                    {filter.type === 'select' && filter.options?.map(option => (
                      <option key={option.value} value={option.value} className="bg-night">
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {filter.value && (
                    <button
                      onClick={() => handleFilterChange(filter.key, '')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-silver hover:text-soft-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                filters.forEach(filter => handleFilterChange(filter.key, ''));
              }}
              className="mt-4 text-sm text-cyan-light hover:text-cyan-light hover:opacity-80 transition-opacity"
            >
              Réinitialiser tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
