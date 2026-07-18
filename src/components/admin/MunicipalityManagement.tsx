import React, { useState } from 'react';
import { Building2, Plus, Trash2, MapPin, CheckSquare, Layers, ShieldCheck } from 'lucide-react';
import { CountryConfig, COUNTRIES } from '../../lib/adminData';

interface MunicipalityManagementProps {
  country: CountryConfig;
  onUpdateCountryStats: (countryCode: string, fields: Partial<CountryConfig['stats']>) => void;
}

export default function MunicipalityManagement({ country, onUpdateCountryStats }: MunicipalityManagementProps) {
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  
  // State for adding wards/municipalities dynamically
  const [zonesList, setZonesList] = useState<string[]>(country.zones);
  const [muniList, setMuniList] = useState<string[]>(
    Object.values(country.municipalities).flat()
  );

  // Re-sync lists when country switches
  React.useEffect(() => {
    setZonesList(country.zones);
    setMuniList(Object.values(country.municipalities).flat());
  }, [country]);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;

    const updatedZones = [...zonesList, newZoneName];
    setZonesList(updatedZones);
    setNewZoneName('');
    setShowAddZone(false);

    // Increment count as simulated persistence
    onUpdateCountryStats(country.code, {
      totalReports: country.stats.totalReports + 5 // Simulates registering a new zone
    });
  };

  const handleDeleteZone = (zoneName: string) => {
    if (confirm(`Are you sure you want to retire zone "${zoneName}"? This will re-route active dispatch trucks to neighboring zones.`)) {
      setZonesList(zonesList.filter(z => z !== zoneName));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Municipal Jurisdiction Oversight</h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure sovereign councils, zoning codes, and operational ward boundaries in {country.name}.
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddZone(!showAddZone)}
          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-brand-accent" />
          <span>Add Operational Zone</span>
        </button>
      </div>

      {/* Add Zone Inline Form */}
      {showAddZone && (
        <form onSubmit={handleAddZone} className="bg-emerald-50/20 border border-brand-primary/10 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">Establish New Zone boundary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 font-mono">Zone Name / Designation Code</label>
              <input 
                type="text" 
                required
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
                placeholder="e.g. Zone 4 (Wilberforce & Hill Station)"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setShowAddZone(false)}
                className="text-xs font-bold px-3 py-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-primary text-white hover:bg-brand-secondary cursor-pointer"
              >
                Establish Boundary
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Municipal Councils List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-primary" />
              <span>Sovereign Councils ({muniList.length})</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Primary regional planning councils in this nation</p>
          </div>

          <div className="space-y-3">
            {muniList.map((muni, idx) => (
              <div key={idx} className="border border-gray-50 bg-gray-50/20 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-gray-800 text-xs block">{muni}</span>
                  <span className="text-[9px] font-mono text-gray-400 block uppercase mt-0.5">
                    {country.name} Charter Council
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-brand-primary border border-emerald-100 px-2 py-0.5 rounded uppercase">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Districts & Wards Hierarchy */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-primary" />
              <span>Provincial Districts ({country.districts.length})</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Districts and local administrative regions</p>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {country.districts.map((dist, idx) => {
              // Find matching council or default
              const munis = country.municipalities[dist] || [];
              const wards = munis.length > 0 ? (country.wards[munis[0]] || []) : [];

              return (
                <div key={idx} className="border border-gray-100 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-gray-800 text-xs">{dist}</span>
                    <span className="text-[9px] font-mono text-gray-400">{wards.length} Wards</span>
                  </div>
                  
                  {wards.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {wards.map((w, wIdx) => (
                        <span key={wIdx} className="text-[9px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                          {w.includes(' ') ? w.split(' ')[0] + ' ' + w.split(' ')[1] : w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Zone Allocations & Dispatch Routing */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <span>Zone Operational Nodes ({zonesList.length})</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Designated sweep zones for sanitation trucks</p>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {zonesList.map((zone, idx) => (
              <div key={idx} className="border border-gray-100 p-3 rounded-xl flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold text-gray-700">{zone}</span>
                </div>
                <button 
                  onClick={() => handleDeleteZone(zone)}
                  className="w-6 h-6 rounded-lg text-gray-400 hover:text-brand-error hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex items-center gap-2 bg-emerald-50/10 p-3 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-brand-primary" />
            <div>
              <p className="text-[10px] font-bold text-gray-800">Zone Routing Compliance</p>
              <p className="text-[9px] text-gray-400">All boundaries sync instantly to mobile GPS terminals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
