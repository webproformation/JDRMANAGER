import { createClient } from '@supabase/supabase-js';

// On recrée le client ici pour être sûr (ou importe-le depuis ton fichier de config si tu en as un)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'images';

// Liste des dossiers autorisés (pour garder l'ordre)
export const ALLOWED_FOLDERS = [
  'worlds',
  'continents',
  'countries',
  'locations',
  'characters',
  'monsters',
  'plants',
  'items',
  'spells',
  'races',
  'classes',
  'campaigns'
] as const;

export type StorageFolder = typeof ALLOWED_FOLDERS[number];

export interface FileObject {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: Record<string, any> | null;
}

export const storageService = {
  /**
   * Récupère la liste des fichiers d'un dossier spécifique
   */
  async listFiles(folder: StorageFolder): Promise<FileObject[]> {
    const { data, error } = await supabase
      .storage
      .from(BUCKET)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Erreur listFiles:', error);
      throw error;
    }

    // On filtre les dossiers (.emptyFolderPlaceholder) pour ne garder que les fichiers
    return data.filter(file => file.id !== null);
  },

  /**
   * Upload un fichier dans un dossier spécifique
   */
  async uploadFile(folder: StorageFolder, file: File): Promise<string | null> {
    // Nettoyage du nom de fichier (enlève les caractères spéciaux)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file);

    if (error) {
      console.error('Erreur uploadFile:', error);
      throw error;
    }

    // On retourne l'URL publique
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Supprime un fichier
   */
  async deleteFile(folder: StorageFolder, fileName: string) {
    const { error } = await supabase
      .storage
      .from(BUCKET)
      .remove([`${folder}/${fileName}`]);

    if (error) {
      console.error('Erreur deleteFile:', error);
      throw error;
    }
  },

  /**
   * Obtient l'URL publique directe
   */
  getPublicUrl(folder: StorageFolder, fileName: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${folder}/${fileName}`);
    return data.publicUrl;
  }
};