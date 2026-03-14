import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Trash2, Folder, Image as ImageIcon, Loader, RefreshCw, 
  ChevronRight, Plus, FolderPlus, Search, HardDrive, ArrowUp, ArrowDown,
  LayoutGrid, Globe, X, Save, CheckCircle2, List, Edit2, Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect';

const noScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

/**
 * MediaLibrary - Standard PRESTIGE 4.5.9 (AUTO-OPTIMIZE & HEADER MIRROR)
 * - Compression : Max 1600px (Largeur/Hauteur) + Conversion WebP.
 * - UI : Header aligné sur EntityList (Alignement droit mobile).
 */
export default function MediaLibrary({ onSelect, worldIdFilter = null }) {
  // --- ÉTATS ---
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [files, setFiles] = useState([]);
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorld, setSelectedWorld] = useState(worldIdFilter || 'all');
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); 
  const gridRef = useRef(null);

  const [dialog, setDialog] = useState({ 
    isOpen: false, type: 'confirm', title: '', message: '', onConfirm: () => {}, placeholder: '', defaultValue: '' 
  });

  // --- CHARGEMENT ---
  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { fetchFiles(); }, [currentFolderId, selectedWorld]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [fRes, wRes] = await Promise.all([
        supabase.from('media_folders').select('*').order('order_index', { ascending: true }),
        supabase.from('worlds').select('id, name')
      ]);
      setFolders(fRes.data || []);
      setWorlds(wRes.data || []);
    } finally { setLoading(false); }
  };

  const fetchFiles = async () => {
    let query = supabase.from('media_items').select('*');
    if (currentFolderId) query = query.eq('folder_id', currentFolderId);
    if (selectedWorld !== 'all') query = query.eq('world_id', selectedWorld);
    const { data } = await query;
    setFiles(data || []);
  };

  // --- MOTEUR D'OPTIMISATION PRESTIGE (1600px + WEBP) ---
  const optimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1600;

          // Calcul chirurgical du redimensionnement
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Conversion WebP haute performance
          canvas.toBlob((blob) => {
            if (blob) {
              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              resolve(new File([blob], newFileName, { type: 'image/webp' }));
            } else {
              reject(new Error("Échec de la conversion Canvas"));
            }
          }, 'image/webp', 0.85); // Qualité optimale
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // --- ACTIONS ---
  const sanitizeFileName = (name) => {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, ''); 
  };

  const handleUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        let file = selectedFiles[i];

        // Optimisation automatique si c'est une image
        if (file.type.startsWith('image/')) {
          file = await optimizeImage(file);
        }

        const fileExt = "webp";
        const cleanBaseName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
        const fileName = `${Date.now()}-${cleanBaseName}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

        await supabase.from('media_items').insert([{
          name: file.name.replace('.webp', ''), 
          url: publicUrl,
          folder_id: currentFolderId, 
          world_id: selectedWorld === 'all' ? null : selectedWorld
        }]);
      }
      fetchFiles();
    } catch (err) { console.error("Erreur Upload:", err); } finally { setUploading(false); }
  };

  const saveMediaInfo = async () => {
    if (!selectedItem) return;
    const { error } = await supabase.from('media_items').update({
      name: selectedItem.name, 
      legend: selectedItem.legend,
      folder_id: selectedItem.folder_id, 
      world_id: selectedItem.world_id === 'all' ? null : selectedItem.world_id
    }).eq('id', selectedItem.id);
    if (!error) { setIsEditing(false); fetchFiles(); }
  };

  const deleteFile = (id) => {
    setDialog({
      isOpen: true, type: 'confirm', title: 'Destruction Archive', message: 'Effacer définitivement ce visuel ?',
      onConfirm: async () => {
        await supabase.from('media_items').delete().eq('id', id);
        if (selectedItem?.id === id) { setSelectedItem(null); setIsEditing(false); }
        fetchFiles();
      }
    });
  };

  // --- DOSSIERS & ARBORESCENCE ---
  const addFolder = (parentId = null) => {
    setDialog({
      isOpen: true, type: 'prompt', title: parentId ? 'Sous-catégorie' : 'Nouvelle Catégorie', message: 'Nom du dossier :', 
      onConfirm: async (name) => {
        if (!name) return;
        const { data } = await supabase.from('media_folders').insert([{
          name, parent_id: parentId, order_index: folders.filter(f => f.parent_id === parentId).length
        }]).select();
        if (data) setFolders([...folders, data[0]]);
      }
    });
  };

  const moveFolderOrder = async (folder, direction) => {
    const siblings = folders.filter(f => f.parent_id === folder.parent_id);
    const currentIndex = siblings.findIndex(f => f.id === folder.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= siblings.length) return;
    const targetFolder = siblings[newIndex];
    await Promise.all([
      supabase.from('media_folders').update({ order_index: targetFolder.order_index }).eq('id', folder.id),
      supabase.from('media_folders').update({ order_index: folder.order_index }).eq('id', targetFolder.id)
    ]);
    fetchInitialData();
  };

  const getFolderOptions = (parentId = null, level = 0) => {
    let options = [];
    folders.filter(f => f.parent_id === parentId).forEach(folder => {
      options.push({ value: folder.id, label: `${'— '.repeat(level)}${folder.name}` });
      options = [...options, ...getFolderOptions(folder.id, level + 1)];
    });
    return options;
  };

  const renderFolderTree = (parentId = null, level = 0) => {
    return folders
      .filter(f => f.parent_id === parentId)
      .map(folder => {
        const isExpanded = expandedFolders[folder.id];
        const isActive = currentFolderId === folder.id;
        const hasChildren = folders.some(f => f.parent_id === folder.id);
        return (
          <div key={folder.id} className="space-y-0.5">
            <div 
              className={`group flex items-center justify-between p-1 rounded-lg transition-all cursor-pointer border ${
                isActive ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#2DD4BF]' : 'border-transparent text-white/30 hover:bg-white/5 hover:text-white'
              }`}
              style={{ marginLeft: `${level * 6}px` }} 
              onClick={() => setCurrentFolderId(folder.id)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <button onClick={(e) => { e.stopPropagation(); setExpandedFolders(prev => ({...prev, [folder.id]: !prev[folder.id]})); }} className={`transition-transform ${isExpanded ? 'rotate-90' : ''} ${!hasChildren ? 'opacity-0' : ''}`}><ChevronRight size={10} /></button>
                <Folder size={11} className={isActive ? 'text-[#2DD4BF]' : 'text-white/20'} />
                <span className="truncate text-[9px] font-bold uppercase tracking-widest">{folder.name}</span>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 gap-0.5 ml-2 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); moveFolderOrder(folder, 'up'); }} className="p-0.5 hover:text-[#2DD4BF]"><ArrowUp size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveFolderOrder(folder, 'down'); }} className="p-0.5 hover:text-[#2DD4BF]"><ArrowDown size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); addFolder(folder.id); }} className="p-0.5 hover:text-[#2DD4BF]"><Plus size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); setDialog({ isOpen: true, type: 'confirm', title: 'Supprimer dossier', message: 'Effacer cette catégorie ?', onConfirm: async () => { await supabase.from('media_folders').delete().eq('id', folder.id); fetchInitialData(); } }); }} className="p-0.5 hover:text-red-400"><Trash2 size={10} /></button>
              </div>
            </div>
            {isExpanded && renderFolderTree(folder.id, level + 1)}
          </div>
        );
      });
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 pt-4 md:p-8 md:pt-8 space-y-6 w-full max-w-[1920px] mx-auto bg-transparent animate-in fade-in duration-700">
      <VTTDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />

      {/* --- HEADER PRESTIGE MIROIR (V4.3.6 Logic) --- */}
      <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-6 mb-2 border-b border-white/5 pb-6">
        <div className="p-3 bg-[#2DD4BF]/10 rounded-2xl border border-[#2DD4BF]/20 shadow-[0_0_20px_rgba(45,212,191,0.15)] shrink-0 order-first md:order-none transition-transform hover:scale-110">
          <HardDrive size={28} className="text-[#2DD4BF] drop-shadow-[0_0_5px_#2DD4BF]" />
        </div>

        <div className="flex-1 text-right md:text-left w-full relative">
          <h1 className="text-[28px] xs:text-[32px] md:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_12px_rgba(45,212,191,0.35)] leading-none">
            <span>Médiathèque</span>
            {selectedWorld !== 'all' && (
              <span className="text-[#2DD4BF] drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">
                <span className="hidden md:inline mx-4 text-white/10">|</span>
                <span className="md:hidden"> • </span>
                {worlds.find(w => w.id === selectedWorld)?.name}
              </span>
            )}
          </h1>
          <p className="text-silver/50 text-[10px] md:text-[11px] font-black tracking-[0.4em] mt-2 uppercase">
            Archives Visuelles du Multivers
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full min-h-[600px] bg-[#16192a]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all relative">
        
        {/* --- SIDEBAR GAUCHE (Desktop) --- */}
        <div className="hidden lg:flex w-64 bg-[#08090f]/40 border-r border-white/5 flex-col shrink-0">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="text-[#2DD4BF] text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Filter size={14} /> Dossiers</h3>
            <button onClick={() => addFolder(null)} className="p-1.5 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-lg border border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20 transition-all"><FolderPlus size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1" style={noScrollbarStyle}>
            <div className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all ${!currentFolderId ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`} onClick={() => setCurrentFolderId(null)}>
              <LayoutGrid size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Tout voir</span>
            </div>
            <div className="pt-4 border-t border-white/5 mt-4">{renderFolderTree(null)}</div>
          </div>
        </div>

        {/* --- ZONE CONTENU --- */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-white/5 bg-black/10 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* SELECT MOBILE CATÉGORIES */}
              <div className="lg:hidden flex-1 min-w-[150px]">
                <VTTSelect value={currentFolderId || ''} options={[{value: '', label: 'Toutes les Catégories'}, ...getFolderOptions(null)]} onChange={(val) => setCurrentFolderId(val || null)} />
              </div>
              <div className="flex-1 lg:flex-none lg:w-48">
                <VTTSelect value={selectedWorld} options={[{value: 'all', label: 'Tous les Mondes'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={setSelectedWorld} />
              </div>
              <label className={`flex items-center gap-2 px-6 rounded-xl cursor-pointer font-black uppercase text-[9px] h-10 transition-all shadow-xl ${uploading ? 'bg-slate-700' : 'bg-[#2DD4BF] text-black hover:bg-[#2DD4BF]/80 active:scale-95'}`}>
                {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                <span className="hidden sm:inline">Importer</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-black/40 rounded-xl border border-white/5 p-1 shrink-0">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#2DD4BF] text-black' : 'text-white/20 hover:text-white'}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#2DD4BF] text-black' : 'text-white/20 hover:text-white'}`}><List size={14} /></button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input type="text" placeholder="Filtrer les archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[11px] text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none h-10 transition-all shadow-inner placeholder:text-white/10" />
              </div>
            </div>
          </div>

          <div ref={gridRef} className="flex-1 overflow-y-auto p-4 sm:p-6" style={noScrollbarStyle}>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-teal-500/30 gap-4 animate-pulse">
                <RefreshCw size={40} className="animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Récupération des ondes visuelles...</span>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6" : "space-y-2"}>
                {filteredFiles.map((file) => (
                  viewMode === 'grid' ? (
                    <div key={file.id} onClick={() => { setSelectedItem(file); setIsEditing(true); }} className={`group relative bg-[#1B2A3F]/40 rounded-2xl overflow-hidden border transition-all aspect-square cursor-pointer ${selectedItem?.id === file.id ? 'border-[#2DD4BF] ring-2 ring-[#2DD4BF]/20 shadow-2xl' : 'border-white/5 hover:border-[#2DD4BF]/40'}`}>
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      {selectedItem?.id === file.id && <div className="absolute top-3 right-3 p-1 bg-[#2DD4BF] rounded-full text-black shadow-2xl animate-in zoom-in"><CheckCircle2 size={16} /></div>}
                    </div>
                  ) : (
                    <div key={file.id} onClick={() => { setSelectedItem(file); setIsEditing(true); }} className={`flex items-center gap-4 p-2 rounded-xl border transition-all cursor-pointer ${selectedItem?.id === file.id ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                      <img src={file.url} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{file.name}</div>
                        <div className="text-[9px] text-white/30 uppercase">{worlds.find(w => w.id === file.world_id)?.name || 'Global'}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- INSPECTEUR DROIT --- */}
        {isEditing && selectedItem && (
          <div className="fixed inset-0 lg:relative lg:inset-auto w-full lg:w-[420px] bg-[#0c0e18]/98 backdrop-blur-3xl border-l border-white/10 flex flex-col min-h-0 animate-in slide-in-from-right duration-500 z-[100] shadow-[-30px_0_60px_rgba(0,0,0,0.9)]">
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/40">
              <h3 className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-[0.2em]">Inspecteur d'Archive</h3>
              <button onClick={() => setIsEditing(false)} className="text-white/20 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8" style={noScrollbarStyle}>
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl flex items-center justify-center">
                <img src={selectedItem.url} className="w-full h-full object-contain p-2" alt="Preview" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Nom du fichier</label>
                  <input type="text" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[12px] text-white outline-none focus:border-teal-500/50 transition-all shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Assignation Monde</label>
                  <VTTSelect upward value={selectedItem.world_id || 'all'} options={[{value: 'all', label: 'Aucun lien'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={(val) => setSelectedItem({...selectedItem, world_id: val === 'all' ? null : val})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Dossier / Catégorie</label>
                  <VTTSelect upward value={selectedItem.folder_id || ''} options={[{value: '', label: 'Global'}, ...getFolderOptions(null)]} onChange={(val) => setSelectedItem({...selectedItem, folder_id: val || null})} />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 pb-12">
                {onSelect && (
                   <button onClick={() => onSelect(selectedItem.url)} className="w-full flex items-center justify-center gap-2 bg-[#2DD4BF] text-black rounded-xl font-black uppercase text-[11px] h-14 hover:bg-[#2DD4BF]/80 active:scale-95 shadow-lg shadow-[#2DD4BF]/20 transition-all">
                    <CheckCircle2 size={20} /> Sélectionner ce visuel
                  </button>
                )}
                <div className="flex gap-3">
                  <button onClick={() => deleteFile(selectedItem.id)} className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all shadow-xl active:scale-95"><Trash2 size={22} /></button>
                  <button onClick={saveMediaInfo} className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white/40 border border-white/10 rounded-xl font-black uppercase text-[11px] h-14 hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"><Save size={20} /> Mettre à jour</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}