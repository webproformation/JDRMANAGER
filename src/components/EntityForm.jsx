import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ImageUpload from './ImageUpload';
import RelationSelect from './RelationSelect';

export default function EntityForm({ tableName, item, onClose, onSave, fields }) {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const initialData = {};
      fields.forEach(field => {
        initialData[field.key] = field.default || '';
      });
      setFormData(initialData);
    }
  }, [item, fields]);

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const dataToSave = {
        ...formData
      };

      if (!item) {
        dataToSave.created_by = user?.id;
      }

      let savedData;
      if (item) {
        // Utiliser l'Edge Function pour les mises à jour
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-entity`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            tableName,
            id: item.id,
            data: dataToSave
          })
        });

        const result = await response.json();

        if (!response.ok || result.error) {
          throw new Error(result.error || 'Erreur lors de la mise à jour');
        }

        savedData = result.data;
      } else {
        // Pour les insertions, utiliser Supabase directement
        const { data, error } = await supabase
          .from(tableName)
          .insert([dataToSave])
          .select()
          .maybeSingle();

        if (error) throw error;
        savedData = data;
      }

      onSave(savedData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-night bg-opacity-95 backdrop-blur-md rounded-lg border border-arcane border-opacity-50 shadow-2xl shadow-arcane max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-night bg-opacity-90 backdrop-blur-md border-b border-arcane border-opacity-50 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-cyan-light">
            {item ? 'Modifier' : 'Créer'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-arcane hover:bg-opacity-40 rounded-full transition-all text-soft-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field.key}>
                {field.key === 'image_url' || field.type === 'image' ? (
                  <ImageUpload
                    value={formData[field.key] || ''}
                    onChange={(value) => handleChange(field.key, value)}
                    label={field.label}
                  />
                ) : field.type === 'relation' ? (
                  <RelationSelect
                    tableName={field.relationTable}
                    value={formData[field.key] || ''}
                    onChange={(value) => handleChange(field.key, value)}
                    label={field.label}
                    required={field.required}
                    filterBy={field.filterBy}
                    filterValue={field.filterValue || formData[field.filterBy]}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <>
                    <label className="block text-sm font-semibold text-soft-white mb-2">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        rows={field.rows || 4}
                        className="w-full px-4 py-2 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg focus:ring-2 focus:ring-cyan-light focus:border-cyan-light transition-all placeholder-silver placeholder-opacity-50"
                        placeholder={field.placeholder}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-2 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg focus:ring-2 focus:ring-cyan-light focus:border-cyan-light transition-all"
                      >
                        <option value="" className="bg-night">Sélectionner...</option>
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value} className="bg-night">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        required={field.required}
                        className="w-full px-4 py-2 bg-night bg-opacity-60 border border-arcane border-opacity-40 text-soft-white rounded-lg focus:ring-2 focus:ring-cyan-light focus:border-cyan-light transition-all placeholder-silver placeholder-opacity-50"
                        placeholder={field.placeholder}
                      />
                    )}

                    {field.help && (
                      <p className="text-sm text-silver opacity-70 mt-1">{field.help}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-light text-night font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-cyan-light disabled:bg-silver disabled:text-night"
            >
              <Save size={20} />
              <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-arcane bg-opacity-40 text-soft-white rounded-lg hover:bg-opacity-60 transition-all border border-arcane border-opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
