import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, RefreshCw, Calendar, Database, ShieldAlert } from 'lucide-react';
import { CountryConfig, COUNTRIES } from '../../lib/adminData';
import { reportExportService } from '../../lib/services';

interface DataExportSimulationProps {
  country: CountryConfig;
}

export default function DataExportSimulation({ country }: DataExportSimulationProps) {
  const [dataset, setDataset] = useState('reports');
  const [format, setFormat] = useState<'csv'|'pdf'|'json'|'geojson'>('csv');
  const [dateRange, setDateRange] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);

  const [error,setError]=useState('');
  const handleTriggerExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setExporting(true);
    setExportResult(null);

    setError('');
    try{
      const filename=await reportExportService.download(format,{dateRange});
      setExporting(false);
      setExportResult(filename);
    }catch(reason){setExporting(false);setError(reason instanceof Error?reason.message:'Export failed.');}
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Secretariat Extraction & Export Services</h2>
        <p className="text-xs text-gray-400 mt-1">
          Export authorized incident reports from MariaDB for spreadsheet, PDF, GIS, or structured-data analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Parameters Form */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3">
            <Database className="w-4.5 h-4.5 text-brand-primary" />
            <span>Extraction Parameters</span>
          </h3>

          <form onSubmit={handleTriggerExport} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Dataset Category</label>
                <select 
                  value={dataset}
                  onChange={e => setDataset(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                >
                  <option value="reports">Citizen Environmental Incidents</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Export Architecture Format</label>
                <select 
                  value={format}
                  onChange={e => setFormat(e.target.value as typeof format)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                >
                  <option value="csv">Excel-Compatible CSV Spreadsheet</option>
                  <option value="pdf">PDF Incident Register</option>
                  <option value="json">JSON Structured Schema Document</option>
                  <option value="geojson">GeoJSON GIS Feature Collection</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Time Constraint filter</label>
                <select 
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-primary focus:bg-white"
                >
                  <option value="all">Sovereign History (All Available)</option>
                  <option value="today">Today (Last 24 Hours)</option>
                  <option value="week">Current Sprint Period</option>
                  <option value="quarter">Active Financial Quarter</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 font-mono">Sovereignty Scope</label>
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-primary flex items-center gap-1.5 h-[38px]">
                  <span>{country.flag}</span>
                  <span>{country.name} Node Exclusive</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                disabled={exporting}
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                {exporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-brand-accent animate-spin" />
                    <span>Compiling Package...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-brand-accent" />
                    <span>Export Reports</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Download result */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-gray-50 pb-3 mb-4">
              <FileText className="w-4.5 h-4.5 text-brand-primary" />
              <span>Extraction Feed</span>
            </h3>

            {exporting && (
              <p className="text-xs text-gray-400 font-mono leading-relaxed animate-pulse">
                &gt; Querying authorized incident records...<br />
                &gt; Enforcing role and territorial scope...<br />
                &gt; Structuring report rows as {format.toUpperCase()}...
              </p>
            )}

            {exportResult && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold">
                    <span>Report export downloaded successfully and recorded in the audit log.</span>
                  </div>
                </div>

                <div className="border border-gray-100 p-3 bg-gray-50/50 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Compiled File Name</span>
                  <p className="text-[11px] font-mono font-extrabold text-gray-800 word-break">{exportResult}</p>
                </div>

                <button onClick={()=>void reportExportService.download(format,{dateRange})} className="w-full text-xs font-bold py-2 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors cursor-pointer">Download Again</button>
              </div>
            )}

            {!exporting && !exportResult && (
              <p className="text-xs text-gray-400 leading-relaxed text-center py-8">
                Initiate compilation on the left to package, sign, and download datasets.
              </p>
            )}
            {error&&<p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</p>}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-3 flex items-center gap-2 text-[10px] text-gray-400 font-mono">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
            <span>All exports are logged in national audit tracks.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
