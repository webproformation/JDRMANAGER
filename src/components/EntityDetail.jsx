import { X } from 'lucide-react';

export default function EntityDetail({ item, onClose, fields, allFields }) {
  if (!item) return null;

  const getDisplayValue = (fieldKey, value) => {
    if (!allFields) return value;

    const fieldDef = allFields.find(f => f.key === fieldKey);
    if (!fieldDef || !fieldDef.options) return value;

    const option = fieldDef.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-night bg-opacity-95 backdrop-blur-md rounded-lg border border-arcane border-opacity-50 shadow-2xl shadow-arcane max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-night bg-opacity-90 backdrop-blur-md border-b border-arcane border-opacity-50 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-cyan-light">{item.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-arcane hover:bg-opacity-40 rounded-full transition-all text-soft-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {item.image_url && (
            <div className="mb-6">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-64 object-cover rounded-lg shadow-lg border border-arcane border-opacity-30"
              />
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {fields.map((field) => {
              const value = item[field.key];
              if (!value) return null;

              const displayValue = getDisplayValue(field.key, value);

              return (
                <div key={field.key}>
                  <h3 className="text-lg font-semibold text-cyan-light mb-2">
                    {field.label}
                  </h3>
                  <div className="text-soft-white whitespace-pre-wrap bg-night bg-opacity-60 border border-arcane border-opacity-30 p-4 rounded-lg">
                    {displayValue}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-arcane border-opacity-30 text-sm text-silver">
            <p>Créé le: {new Date(item.created_at).toLocaleDateString('fr-FR')}</p>
            {item.updated_at && (
              <p>Modifié le: {new Date(item.updated_at).toLocaleDateString('fr-FR')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
