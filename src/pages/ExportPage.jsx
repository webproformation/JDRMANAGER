import { useState } from 'react';
import { 
  Download, FileSpreadsheet, FileText, CheckSquare, Square, 
  Loader2, AlertCircle, Database, ChevronRight, HardDriveDownload 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

const TABLES = [
  { name: 'worlds', label: 'Mondes', icon: '🌍' },
  { name: 'continents', label: 'Continents', icon: '🗺️' },
  { name: 'countries', label: 'Pays', icon: '🏴' },
  { name: 'cities', label: 'Villes', icon: '🏙️' },
  { name: 'villages', label: 'Villages', icon: '🏘️' },
  { name: 'locations', label: 'Lieux', icon: '📍' },
  { name: 'oceans', label: 'Océans', icon: '🌊' },
  { name: 'celestial_bodies', label: 'Corps célestes', icon: '🌙' },
  { name: 'deities', label: 'Divinités', icon: '⚡' },
  { name: 'races', label: 'Races', icon: '👥' },
  { name: 'monsters', label: 'Monstres', icon: '👹' },
  { name: 'animals', label: 'Animaux', icon: '🦁' },
  { name: 'plants', label: 'Plantes', icon: '🌿' },
  { name: 'minerals', label: 'Minéraux', icon: '💎' },
  { name: 'crafting_materials', label: 'Matériaux', icon: '🔨' },
  { name: 'items', label: 'Objets', icon: '🎒' },
  { name: 'magic_items', label: 'Objets magiques', icon: '✨' },
  { name: 'potions', label: 'Potions', icon: '🧪' },
  { name: 'recipes', label: 'Recettes', icon: '📖' },
  { name: 'guilds', label: 'Guildes', icon: '🛡️' },
  { name: 'sects', label: 'Sectes', icon: '🔥' },
  { name: 'languages', label: 'Langages', icon: '📜' },
  { name: 'character_classes', label: 'Classes', icon: '⚔️' },
  { name: 'class_features', label: 'Capacités', icon: '⚡' },
  { name: 'spells', label: 'Sorts', icon: '🌟' },
  { name: 'curses', label: 'Malédictions', icon: '💀' },
  { name: 'diseases', label: 'Maladies', icon: '🦠' },
  { name: 'calendars', label: 'Calendriers', icon: '📅' },
  { name: 'characters', label: 'Personnages', icon: '🧙' },
  { name: 'campaigns', label: 'Campagnes', icon: '🎲' }
];

export default function ExportPage() {
  const [selectedTables, setSelectedTables] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, table: '' });
  const [error, setError] = useState(null);

  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  const toggleTable = (tableName) => {
    setSelectedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const selectAll = () => setSelectedTables(TABLES.map(t => t.name));
  const deselectAll = () => setSelectedTables([]);

  const exportToCSV = (data, tableName) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tableName}_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = async (tableData) => {
    const workbook = XLSX.utils.book_new();
    tableData.forEach(({ tableName, data }) => {
      if (data && data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, tableName.substring(0, 31));
      }
    });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `multivers_backup_complet_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = async (format) => {
    if (selectedTables.length === 0) {
      setError('Veuillez sélectionner au moins un registre pour l\'extraction');
      return;
    }
    setIsExporting(true);
    setError(null);
    setProgress({ current: 0, total: selectedTables.length, table: '' });

    try {
      const tableData = [];
      for (let i = 0; i < selectedTables.length; i++) {
        const tableName = selectedTables[i];
        setProgress({ current: i + 1, total: selectedTables.length, table: tableName });
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) continue;
        if (format === 'csv') exportToCSV(data, tableName);
        else tableData.push({ tableName, data });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (format === 'excel' && tableData.length > 0) await exportToExcel(tableData);
      setTimeout(() => setIsExporting(false), 2000);
    } catch (err) {
      setError(`Échec du protocole d'extraction : ${err.message}`);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700 pb-24 md:pb-12" style={globalBackgroundStyle}>
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER PRESTIGE XXL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8 mt-16 md:mt-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#2DD4BF]/10 rounded-3xl border border-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.2)] backdrop-blur-sm">
              <Database size={40} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                Archives & <span className="text-[#2DD4BF]">Sauvegardes</span>
              </h1>
              <p className="text-silver/50 text-[10px] md:text-xs font-black tracking-[0.3em] mt-2 uppercase">
                Protocole d'extraction des données multiverselles
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/50 rounded-2xl p-5 flex items-start gap-4 animate-in slide-in-from-top-2">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-black uppercase text-xs tracking-widest">Alerte Système</p>
              <p className="text-red-200/80 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SÉLECTION DES TABLES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                   Sélection des Registres
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={selectAll} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                    Tout inclure
                  </button>
                  <button onClick={deselectAll} className="flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                    Réinitialiser
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2DD4BF]/20 scrollbar-track-transparent">
                {TABLES.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => toggleTable(table.name)}
                    disabled={isExporting}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group ${
                      selectedTables.includes(table.name)
                        ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/40 shadow-lg shadow-[#2DD4BF]/5'
                        : 'bg-black/20 border-white/5 hover:border-white/20'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`p-2 rounded-xl transition-colors ${selectedTables.includes(table.name) ? 'bg-[#2DD4BF]/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                      {selectedTables.includes(table.name) ? (
                        <CheckSquare className="w-5 h-5 text-[#2DD4BF]" />
                      ) : (
                        <Square className="w-5 h-5 text-silver/30" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xl mb-1">{table.icon}</span>
                      <span className={`text-xs font-black uppercase tracking-widest ${selectedTables.includes(table.name) ? 'text-white' : 'text-silver/60'}`}>
                        {table.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PANNEAU D'ACTION */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                <HardDriveDownload size={20} className="text-[#2DD4BF]" /> Paramètres
              </h2>

              <div className="space-y-6 mb-10">
                <div className="bg-[#1B2A3F]/50 rounded-2xl p-6 border border-white/5 shadow-inner">
                  <div className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-[0.2em] mb-2">Registres ciblés</div>
                  <div className="text-4xl font-black text-white drop-shadow-md">{selectedTables.length}</div>
                </div>

                {isExporting && (
                  <div className="bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 rounded-2xl p-6 space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-[#2DD4BF] animate-spin" />
                      <span className="text-xs font-black text-[#2DD4BF] uppercase tracking-widest">Extraction...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-bold text-silver/60 uppercase">
                        <span>{progress.table}</span>
                        <span>{progress.current} / {progress.total}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className="bg-[#2DD4BF] h-full transition-all duration-500 shadow-[0_0_10px_#2DD4BF]"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting || selectedTables.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 disabled:opacity-30 disabled:cursor-not-allowed text-[#1B2A3F] font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl hover:shadow-[#2DD4BF]/20 active:scale-95 group"
                >
                  <FileSpreadsheet className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Générer Excel
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting || selectedTables.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all border border-white/10 active:scale-95 group"
                >
                  <FileText className="w-5 h-5 group-hover:-rotate-12 transition-transform text-[#2DD4BF]" />
                  Générer CSV
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black text-silver/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Download size={14} /> Formats de Stockage
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-400 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-widest">Excel (.xlsx)</div>
                      <div className="text-[10px] text-silver/50 leading-relaxed mt-1">Archive consolidée : un onglet par table sélectionnée. Idéal pour la consultation.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-widest">CSV (.csv)</div>
                      <div className="text-[10px] text-silver/50 leading-relaxed mt-1">Fichiers individuels par table. Format universel pour le traitement de données.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}