import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ImageUpload({ value, onChange, label = "Image", bucket = "images", maxSize = 5242880 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const processImageToWebP = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 1400;

        if (width > MAX_WIDTH) {
          height = Math.round((MAX_WIDTH / width) * height);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Erreur lors de la conversion de l\'image'));
            }
          },
          'image/webp',
          0.85
        );
      };

      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      setError(null);

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP');
      }

      const webpBlob = await processImageToWebP(file);

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = fileName;

      if (value) {
        await deleteImage(value);
      }

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, webpBlob, {
          contentType: 'image/webp'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('[ImageUpload] URL publique générée:', publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      if (!imageUrl) return;

      // Extraire le chemin du fichier depuis l'URL
      const urlParts = imageUrl.split(`/${bucket}/`);
      if (urlParts.length < 2) return;

      const filePath = urlParts[1];

      // Supprimer le fichier
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteImage(value);
      onChange('');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-soft-white">
        {label}
      </label>

      {/* Aperçu de l'image */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Aperçu"
            className="w-48 h-48 object-cover rounded-lg border-2 border-arcane border-opacity-50"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
            title="Supprimer l'image"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Zone d'upload */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-light text-night font-semibold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-silver disabled:text-night"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-night border-t-transparent"></div>
              <span>Upload en cours...</span>
            </>
          ) : (
            <>
              {value ? (
                <>
                  <Upload size={18} />
                  <span>Modifier l'image</span>
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  <span>Choisir une image</span>
                </>
              )}
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-90 text-white rounded-lg hover:bg-red-600 hover:bg-opacity-100 transition-all"
          >
            <X size={18} />
            <span>Supprimer</span>
          </button>
        )}
      </div>

      {/* Messages d'aide et d'erreur */}
      <div className="text-sm">
        {error && (
          <p className="text-red-400 flex items-center gap-1">
            <X size={16} />
            {error}
          </p>
        )}
        {!error && (
          <p className="text-silver opacity-70">
            Formats acceptés : JPG, PNG, GIF, WebP. Les images seront automatiquement converties en WebP et redimensionnées (max 1400px).
          </p>
        )}
      </div>
    </div>
  );
}
