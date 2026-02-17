export default function StaticSelect({ value, onChange, label, options, required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-soft-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg focus:ring-2 focus:ring-cyan-light focus:border-cyan-light transition-all hover:border-opacity-60 cursor-pointer"
      >
        <option value="" className="bg-night text-silver">
          {placeholder || 'Sélectionner...'}
        </option>
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            className="bg-night text-soft-white py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
