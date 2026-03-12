import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Trash2, Folder, Image as ImageIcon, Loader, RefreshCw, 
  ChevronRight, Plus, FolderPlus, Search, HardDrive, ArrowUp, ArrowDown,
  LayoutGrid, Globe, X, Save, CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import VTTDialog from './VTTDialog';
import VTTSelect from './vtt-ui/VTTSelect';

const noScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

export default function MediaLibrary({ onSelect, worldIdFilter = null }) {
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
  const gridRef = useRef(null);

  const [dialog, setDialog] = useState({ 
    isOpen: false, type: 'confirm', title: '', message: '', onConfirm: () => {}, placeholder: '', defaultValue: '' 
  });

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

  const addFolder = (parentId = null) => {
    setDialog({
      isOpen: true, type: 'prompt', title: 'Nouvelle Catégorie', message: 'Nom du dossier :', 
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

  // --- LOGIQUE DE TÉLÉCHARGEMENT CORRIGÉE (ANTI-ERREUR 400) ---
  const handleUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload physique dans le storage
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
        if (uploadError) throw uploadError;

        // RÉCUPÉRATION SÉCURISÉE DE L'URL PUBLIQUE
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

        // Insertion en base avec l'URL formatée correctement
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
    await supabase.from('media_items').update({
      name: selectedItem.name, legend: selectedItem.legend,
      folder_id: selectedItem.folder_id, world_id: selectedItem.world_id
    }).eq('id', selectedItem.id);
    setIsEditing(false);
    fetchFiles();
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

      {/* SIDEBAR GAUCHE EXPLORATEUR */}
      <div className="w-full lg:w-64 bg-[#08090f]/40 border-r border-white/5 flex flex-col min-h-0 shrink-0">
        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h3 className="text-[#2DD4BF] text-[7px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <HardDrive size={10} /> Explorateur
          </h3>
          <button onClick={() => addFolder(null)} className="p-1 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-md hover:bg-[#2DD4BF]/20 border border-[#2DD4BF]/20">
            <FolderPlus size={11} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={noScrollbarStyle}>
          <div className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${!currentFolderId ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`} onClick={() => setCurrentFolderId(null)}>
            <LayoutGrid size={11} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Global</span>
          </div>
          <div className="pt-2 border-t border-white/5 mt-2">{renderFolderTree(null)}</div>
        </div>
      </div>

      {/* CENTRE : GRILLE DE MÉDIAS */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-2.5 border-b border-white/5 bg-black/10 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" size={12} />
              <input type="text" placeholder="Filtrer les archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-md pl-7 pr-3 py-1.5 text-[10px] focus:ring-1 focus:ring-[#2DD4BF]/50 outline-none h-7 text-white" />
            </div>
            <div className="w-28">
              <VTTSelect value={selectedWorld} options={[{value: 'all', label: 'Mondes'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={setSelectedWorld} />
            </div>
          </div>
          <label className={`flex items-center gap-1.5 px-3 py-1 rounded-md cursor-pointer font-black uppercase text-[8px] h-7 transition-all ${uploading ? 'bg-gray-600 cursor-wait' : 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/20'}`}>
            {uploading ? <Loader size={11} className="animate-spin" /> : <Upload size={11} />}
            <span>{uploading ? 'Envoi...' : 'Upload'}</span>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div ref={gridRef} className="flex-1 overflow-y-auto p-4 pr-5" style={noScrollbarStyle}>
          {filteredFiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic space-y-2">
              <ImageIcon size={40} />
              <p className="text-[10px] uppercase tracking-widest font-black">Aucun actif trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  onClick={() => { setSelectedItem(file); setIsEditing(true); }} 
                  className={`group relative bg-[#1B2A3F]/40 rounded-lg overflow-hidden border transition-all aspect-square cursor-pointer ${selectedItem?.id === file.id ? 'border-[#2DD4BF] ring-1 ring-[#2DD4BF]/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'border-white/5 hover:border-[#2DD4BF]/40'}`}
                >
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700" />
                  {selectedItem?.id === file.id && <div className="absolute top-1 right-1 p-0.5 bg-[#2DD4BF] rounded-full text-black shadow-lg animate-in zoom-in"><CheckCircle2 size={10} /></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INSPECTEUR DROIT : DÉTAILS DE L'ACTIF */}
      {isEditing && selectedItem && (
        <div className="w-full lg:w-64 bg-[#0c0e18]/90 backdrop-blur-3xl border-l border-white/10 flex flex-col min-h-0 animate-in slide-in-from-right duration-300 z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
          <div className="p-2.5 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="text-[#2DD4BF] text-[7px] font-black uppercase tracking-widest">Détails de l'Actif</h3>
            <button onClick={() => setIsEditing(false)} className="text-white/20 hover:text-white transition-colors"><X size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4" style={noScrollbarStyle}>
            <div className="aspect-video rounded-md overflow-hidden border border-white/5 bg-black/40 shadow-inner">
              <img src={selectedItem.url} className="w-full h-full object-contain" alt="Aperçu" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-widest mb-1 block ml-1">Nom du fichier</label>
                <input type="text" value={selectedItem.name || ''} onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-md px-2 py-1.5 text-[10px] text-white outline-none focus:border-teal-500/50" />
              </div>

              <div>
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-widest mb-1 block ml-1">Légende / Note</label>
                <textarea rows={2} value={selectedItem.legend || ''} onChange={(e) => setSelectedItem({...selectedItem, legend: e.target.value})} className="w-full bg-black/20 border border-white/5 rounded-md px-2 py-1.5 text-[10px] text-white outline-none focus:border-teal-500/50 resize-none" placeholder="Ajouter une note..." />
              </div>

              <div>
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-widest mb-1 block ml-1">Lien Monde</label>
                <VTTSelect value={selectedItem.world_id || 'all'} options={[{value: 'all', label: 'Aucun lien'}, ...worlds.map(w => ({value: w.id, label: w.name}))]} onChange={(val) => setSelectedItem({...selectedItem, world_id: val === 'all' ? null : val})} />
              </div>
              <div>
                <label className="text-[7px] font-black text-[#2DD4BF]/50 uppercase tracking-widest mb-1 block ml-1">Dossier / Catégorie</label>
                <VTTSelect value={selectedItem.folder_id || ''} options={[{value: '', label: 'Global'}, ...getFolderOptions(null)]} onChange={(val) => setSelectedItem({...selectedItem, folder_id: val || null})} />
              </div>
            </div>
          </div>
          <div className="p-2.5 border-t border-white/5 bg-black/20 flex flex-col gap-2">
            {onSelect && (
               <button 
                onClick={() => onSelect(selectedItem.url)}
                className="w-full flex items-center justify-center gap-1.5 bg-teal-500 text-black rounded-md font-black uppercase text-[8px] h-9 hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/10"
              >
                <CheckCircle2 size={12} /> Confirmer la sélection
              </button>
            )}
            
            <div className="flex gap-2">
              <button onClick={() => {
                setDialog({
                  isOpen: true, type: 'confirm', title: 'Supprimer image', message: 'Effacer définitivement cet actif de la bibliothèque ?',
                  onConfirm: async () => {
                    await supabase.from('media_items').delete().eq('id', selectedItem.id);
                    setSelectedItem(null); setIsEditing(false); fetchFiles();
                  }
                });
              }} className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-all shadow-lg"><Trash2 size={14} /></button>
              
              <button onClick={saveMediaInfo} className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 text-white/40 border border-white/10 rounded-md font-black uppercase text-[8px] h-9 hover:bg-white/10 hover:text-white transition-all shadow-lg"><Save size={11} /> Sauvegarder les infos</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}