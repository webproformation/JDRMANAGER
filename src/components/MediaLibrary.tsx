import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Trash2, Folder, Image as ImageIcon, Loader, RefreshCw, 
  ChevronRight, Plus, FolderPlus, Search, HardDrive, ArrowUp, ArrowDown,
  LayoutGrid, Globe, X, Save, CheckCircle2, List, Edit2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect';

const noScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

export default function MediaLibrary({ onSelect, worldIdFilter = null }) {
  // --- ÉTATS (INTÉGRAUX) ---
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

  // --- CHARGEMENT DES DONNÉES ---
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

  // --- SÉCURITÉ & NETTOYAGE ---
  const sanitizeFileName = (name: string) => {
    return name
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^a-z0-9.-]/g, ''); 
  };

  // --- ACTIONS ACTIFS ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const cleanBaseName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
        const fileName = `${Date.now()}-${cleanBaseName}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

        await supabase.from('media_items').insert([{
          name: file.name.split('.')[0], 
          url: publicUrl,
          folder_id: currentFolderId, 
          world_id: selectedWorld === 'all' ? null : selectedWorld
        }]);
      }
      fetchFiles();
    } catch (err) {
      console.error("Erreur Upload Prestige:", err);
    } finally { setUploading(false); }
  };

  const saveMediaInfo = async () => {
    if (!selectedItem) return;
    const { error } = await supabase.from('media_items').update({
      name: selectedItem.name, 
      legend: selectedItem.legend,
      folder_id: selectedItem.folder_id, 
      world_id: selectedItem.world_id === 'all' ? null : selectedItem.world_id
    }).eq('id', selectedItem.id);

    if (!error) {
      setIsEditing(false);
      fetchFiles();
    }
  };

  const deleteFile = async (id: string) => {
    setDialog({
      isOpen: true, type: 'confirm', title: 'Destruction Archive', message: 'Effacer définitivement ce visuel ?',
      onConfirm: async () => {
        await supabase.from('media_items').delete().eq('id', id);
        if (selectedItem?.id === id) { setSelectedItem(null); setIsEditing(false); }
        fetchFiles();
      }
    });
  };

  // --- ACTIONS DOSSIERS ---
  const addFolder = (parentId = null) => {
    setDialog({
      isOpen: true, type: 'prompt', title: parentId ? 'Sous-catégorie' : 'Nouvelle Catégorie', 
      message: 'Nom du dossier :', 
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

  // --- RENDU ARBORESCENCE ---
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
                <button onClick={(e) => { e.stopPropagation(); setExpandedFolders(prev => ({...prev, [folder.id]: !prev[folder.id]})); }} className={`transition-transform ${isExpanded ? 'rotate-90' : ''} ${!hasChildren ? 'opacity-0' : ''}`}>
                  <ChevronRight size={10} />
                </button>
                <Folder size={11} className={isActive ? 'text-[#2DD4BF]' : 'text-white/20'} />
                <span className="truncate text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">{folder.name}</span>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 gap-0.5 ml-2 shrink-0">
                <button onClick={(e) => { e.stopPropagation(); moveFolderOrder(folder, 'up'); }} className="p-0.5 hover:text-[#2DD4BF]"><ArrowUp size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveFolderOrder(folder, 'down'); }} className="p-0.5 hover:text-[#2DD4BF]"><ArrowDown size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); addFolder(folder.id); }} className="p-0.5 hover:text-[#2DD4BF]"><Plus size={10} /></button>
                <button onClick={(e) => { e.stopPropagation(); 
                  setDialog({
                    isOpen: true, type: 'confirm', title: 'Supprimer dossier', message: 'Effacer cette catégorie ?',
                    onConfirm: async () => { await supabase.from('media_folders').delete().eq('id', folder.id); fetchInitialData(); }
                  });
                }} className="p-0.5 hover:text-red-400"><Trash2 size={10} /></button>
              </div>
            </div>
            {isExpanded && renderFolderTree(folder.id, level + 1)}
          </div>
        );
      });
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[520px] bg-[#16192a]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all relative">
      <VTTDialog {...dialog} onClose={() => setDialog({ ...dialog, isOpen: false })} />

      {/* --- SIDEBAR GAUCHE : EXPLORATEUR --- */}
      <div className="w-full lg:w-64 bg-[#08090f]/40 border-r border-white/5 flex flex-col min-h-0 shrink-0">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="text-[#2DD4BF] text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <HardDrive size={12} /> Bibliothèque
          </h3>
          <div className="flex items-center gap-1">
            <button onClick={() => addFolder(null)} className="p-1.5 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-md border border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20 transition-all">
              <FolderPlus size={14} />
            </button>
            <button onClick={fetchInitialData} className="p-1.5 text-white/20 hover:text-white transition-colors">
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1" style={noScrollbarStyle}>
          <div className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${!currentFolderId ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white'}`} onClick={() => setCurrentFolderId(null)}>
            <LayoutGrid size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Tout voir</span>
          </div>
          <div className="pt-3 border-t border-white/5 mt-3">{renderFolderTree(null)}</div>
        </div>
      </div>

      {/* --- ZONE CENTRALE : CONTENU --- */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-white/5 bg-black/10 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex bg-black/40 rounded-xl border border-white/5 p-1 shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#2DD4BF] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}><LayoutGrid size={14} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#2DD4BF] text-black shadow-lg' : 'text-white/20 hover:text-white'}`}><List size={14} /></button>
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
              <input type="text" placeholder="Filtrer les archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[11px] text-white focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none h-10 transition-all" />
            </div>
            <div className="w-40">
              <VTTSelect value={selectedWorld} options={[{value: 'all', label: 'Tous les Mondes'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={setSelectedWorld} />
            </div>
          </div>
          <label className={`flex items-center gap-2 px-6 py-2 rounded-xl cursor-pointer font-black uppercase text-[9px] h-10 transition-all shadow-xl ${uploading ? 'bg-slate-700 cursor-wait' : 'bg-[#2DD4BF] text-black hover:bg-[#2DD4BF]/80 active:scale-95'}`}>
            {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>Importer</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div ref={gridRef} className="flex-1 overflow-y-auto p-6 scroll-smooth" style={noScrollbarStyle}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <div key={file.id} onClick={() => { setSelectedItem(file); setIsEditing(true); }} className={`group relative bg-[#1B2A3F]/40 rounded-2xl overflow-hidden border transition-all aspect-square cursor-pointer ${selectedItem?.id === file.id ? 'border-[#2DD4BF] ring-2 ring-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.3)] scale-[0.98]' : 'border-white/5 hover:border-[#2DD4BF]/40'}`}>
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  {selectedItem?.id === file.id && <div className="absolute top-3 right-3 p-1 bg-[#2DD4BF] rounded-full text-black shadow-2xl animate-in zoom-in"><CheckCircle2 size={16} /></div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div key={file.id} onClick={() => { setSelectedItem(file); setIsEditing(true); }} className={`flex items-center gap-4 p-2 rounded-xl border transition-all cursor-pointer ${selectedItem?.id === file.id ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                  <img src={file.url} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{file.name}</div>
                    <div className="text-[9px] text-white/30 uppercase">{worlds.find(w => w.id === file.world_id)?.name || 'Global'}</div>
                  </div>
                  <div className="flex gap-2 pr-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedItem(file); setIsEditing(true); }} className="p-2 bg-white/5 text-white/40 hover:text-[#2DD4BF] rounded-lg transition-all"><Edit2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }} className="p-2 bg-red-500/10 text-red-400/60 hover:text-red-400 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- INSPECTEUR DROIT FIGÉ : IMAGE FULL & ACTIONS CENTRÉES --- */}
      {isEditing && selectedItem && (
        <div className="w-full lg:w-[480px] bg-[#0c0e18]/98 backdrop-blur-3xl border-l border-white/10 flex flex-col min-h-0 animate-in slide-in-from-right duration-500 z-50 shadow-[-30px_0_60px_rgba(0,0,0,0.9)]">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
            <h3 className="text-[#2DD4BF] text-[8px] font-black uppercase tracking-[0.2em]">Inspecteur</h3>
            <button onClick={() => setIsEditing(false)} className="text-white/20 hover:text-white transition-colors p-1"><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8" style={noScrollbarStyle}>
            {/* IMAGE : TOUTE LA LARGEUR & CENTRÉE VERTICALEMENT DANS SON BLOC */}
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl flex items-center justify-center group relative shrink-0">
              <img src={selectedItem.url} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[8px] text-[#2DD4BF] font-black uppercase tracking-widest border border-white/5">
                {selectedItem.url.split('.').pop()}
              </div>
            </div>

            {/* GRILLE DES CHAMPS 2x2 */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="space-y-2">
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Nom du fichier</label>
                <input type="text" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white outline-none focus:border-teal-500/50 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Légende / Notes</label>
                <input type="text" value={selectedItem.legend || ''} onChange={(e) => setSelectedItem({...selectedItem, legend: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white outline-none focus:border-teal-500/50 transition-all" placeholder="..." />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Assignation Monde</label>
                <VTTSelect upward value={selectedItem.world_id || 'all'} options={[{value: 'all', label: 'Aucun lien'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={(val) => setSelectedItem({...selectedItem, world_id: val === 'all' ? null : val})} />
              </div>

              <div className="space-y-2 relative">
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-[0.2em] ml-1">Dossier / Catégorie</label>
                <VTTSelect upward value={selectedItem.folder_id || ''} options={[{value: '', label: 'Global'}, ...getFolderOptions(null)]} onChange={(val) => setSelectedItem({...selectedItem, folder_id: val || null})} />
              </div>
            </div>

            {/* ACTIONS : IMMÉDIATEMENT SOUS LES CHAMPS DANS LE SCROLL */}
            <div className="flex flex-col gap-4 pt-4">
              {onSelect && (
                 <button 
                  onClick={() => onSelect(selectedItem.url)}
                  className="w-full flex items-center justify-center gap-2 bg-[#2DD4BF] text-black rounded-xl font-black uppercase text-[10px] h-12 hover:bg-[#2DD4BF]/80 transition-all shadow-lg shadow-[#2DD4BF]/20 active:scale-95"
                >
                  <CheckCircle2 size={18} /> Utiliser cette image
                </button>
              )}
              
              <div className="flex gap-3">
                <button onClick={() => deleteFile(selectedItem.id)} className="p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all shadow-xl active:scale-95"><Trash2 size={20} /></button>
                <button onClick={saveMediaInfo} className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white/40 border border-white/10 rounded-xl font-black uppercase text-[10px] h-12 hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"><Save size={18} /> Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}