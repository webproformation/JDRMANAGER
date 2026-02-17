import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckSquare, Square, Loader2, AlertCircle } from 'lucide-react';
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
  { name: 'celestialbodies', label: 'Corps célestes', icon: '🌙' },
  { name: 'deities', label: 'Divinités', icon: '⚡' },
  { name: 'races', label: 'Races', icon: '👥' },
  { name: 'monsters', label: 'Monstres', icon: '👹' },
  { name: 'animals', label: 'Animaux', icon: '🦁' },
  { name: 'plants', label: 'Plantes', icon: '🌿' },
  { name: 'minerals', label: 'Minéraux', icon: '💎' },
  { name: 'craftingmaterials', label: 'Matériaux', icon: '🔨' },
  { name: 'items', label: 'Objets', icon: '🎒' },
  { name: 'magicitems', label: 'Objets magiques', icon: '✨' },
  { name: 'potions', label: 'Potions', icon: '🧪' },
  { name: 'recipes', label: 'Recettes', icon: '📖' },
  { name: 'guilds', label: 'Guildes', icon: '🛡️' },
  { name: 'sects', label: 'Sectes', icon: '🔥' },
  { name: 'languages', label: 'Langages', icon: '📜' },
  { name: 'characterclasses', label: 'Classes', icon: '⚔️' },
  { name: 'classfeatures', label: 'Capacités', icon: '⚡' },
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

  const toggleTable = (tableName) => {
    setSelectedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const selectAll = () => {
    setSelectedTables(TABLES.map(t => t.name));
  };

  const deselectAll = () => {
    setSelectedTables([]);
  };

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
    link.download = `${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToExcel = async (tableData) => {
    const workbook = XLSX.utils.book_new();

    tableData.forEach(({ tableName, data }) => {
      if (data && data.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(data);

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + '1';
          if (!worksheet[address]) continue;
          worksheet[address].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: 'CCCCCC' } }
          };
        }

        const colWidths = {};
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: R, c: C });
            if (!worksheet[address]) continue;

            const cell = worksheet[address];
            const value = cell.v ? String(cell.v) : '';
            const length = value.length;

            if (!colWidths[C] || colWidths[C] < length) {
              colWidths[C] = Math.min(length + 2, 50);
            }
          }
        }

        worksheet['!cols'] = Object.keys(colWidths).map(c => ({
          wch: colWidths[c]
        }));

        XLSX.utils.book_append_sheet(workbook, worksheet, tableName.substring(0, 31));
      }
    });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export_complet_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = async (format) => {
    if (selectedTables.length === 0) {
      setError('Veuillez sélectionner au moins une table');
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

        const { data, error } = await supabase
          .from(tableName)
          .select('*');

        if (error) {
          console.error(`Erreur lors de l'export de ${tableName}:`, error);
          continue;
        }

        if (format === 'csv') {
          exportToCSV(data, tableName);
        } else {
          tableData.push({ tableName, data });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (format === 'excel' && tableData.length > 0) {
        await exportToExcel(tableData);
      }

      setProgress({ current: selectedTables.length, total: selectedTables.length, table: 'Terminé' });

      setTimeout(() => {
        setIsExporting(false);
        setProgress({ current: 0, total: 0, table: '' });
      }, 2000);

    } catch (err) {
      setError(`Erreur lors de l'export: ${err.message}`);
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Export des données
          </h1>
          <p className="text-slate-400">
            Exportez vos tables de base de données au format Excel ou CSV
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Erreur</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Sélectionner les tables</h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Tout sélectionner
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Tout désélectionner
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {TABLES.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => toggleTable(table.name)}
                    disabled={isExporting}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      selectedTables.includes(table.name)
                        ? 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30'
                        : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                    } ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {selectedTables.includes(table.name) ? (
                      <CheckSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-2xl">{table.icon}</span>
                    <span className="font-medium text-left">{table.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Actions d'export</h2>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Tables sélectionnées</div>
                  <div className="text-3xl font-bold text-blue-400">{selectedTables.length}</div>
                </div>

                {isExporting && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-sm font-medium text-blue-400">Export en cours...</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      {progress.table && `Table: ${progress.table}`}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2 text-center">
                      {progress.current} / {progress.total}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting || selectedTables.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-green-500/20"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  {isExporting ? 'Export en cours...' : 'Exporter en Excel'}
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting || selectedTables.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/20"
                >
                  <FileText className="w-5 h-5" />
                  {isExporting ? 'Export en cours...' : 'Exporter en CSV'}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Formats disponibles
                </h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-start gap-2">
                    <FileSpreadsheet className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                    <div>
                      <div className="font-medium text-slate-300">Excel (.xlsx)</div>
                      <div className="text-xs">Toutes les tables dans un seul fichier, un onglet par table</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                    <div>
                      <div className="font-medium text-slate-300">CSV (.csv)</div>
                      <div className="text-xs">Un fichier CSV par table sélectionnée</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.9);
        }
      `}</style>
    </div>
  );
}
