import React from 'react';
import { Wind, Droplet, ShieldAlert, Leaf, Compass, ThermometerSun, AlertOctagon } from 'lucide-react';
import { CountryConfig } from '../../lib/adminData';

interface EnvironmentalIntelligenceProps {
  country: CountryConfig;
}

export default function EnvironmentalIntelligence({ country }: EnvironmentalIntelligenceProps) {
  const stats = country.stats;

  // Function to evaluate AQI
  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', desc: 'Air quality is satisfactory; air pollution poses little or no risk.' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-100', desc: 'Acceptable air quality; moderate risk for highly sensitive individuals.' };
    return { label: 'Unhealthy', color: 'text-red-600 bg-red-50 border-red-100', desc: 'General public may experience health effects; sensitive groups more severe.' };
  };

  // Function to evaluate WQI (Water quality index, usually 0-100, higher is better)
  const getWqiStatus = (wqi: number) => {
    if (wqi >= 80) return { label: 'Excellent', color: 'text-teal-600 bg-teal-50 border-teal-100' };
    if (wqi >= 65) return { label: 'Good/Acceptable', color: 'text-blue-600 bg-blue-50 border-blue-100' };
    return { label: 'Critical Risk', color: 'text-red-600 bg-red-50 border-red-100' };
  };

  const aqiInfo = getAqiStatus(stats.airQualityIndex);
  const wqiInfo = getWqiStatus(stats.waterQualityIndex);

  // Environmental risks specific to country
  const countryRisks: Record<string, { hazard: string; location: string; details: string; severity: 'Moderate' | 'High' | 'Critical' }[]> = {
    'SL': [
      { hazard: 'Water pollution runoff', location: 'Kroo Bay Estuary, Freetown', details: 'Severe plastic choke causing ocean plastic debris inflows', severity: 'Critical' },
      { hazard: 'Waste Burning Toxic Gaseous Emissions', location: 'Kingtom Reclamation, Freetown', details: 'Illegal open burning causing temporary spikes in PM2.5 levels', severity: 'High' }
    ],
    'LR': [
      { hazard: 'Coastal plastic leaching', location: 'West Point Beachline, Monrovia', details: 'Heavy plastic accumulation threatening marine ecosystem', severity: 'Critical' }
    ],
    'GH': [
      { hazard: 'Toxic chemical e-waste burning', location: 'Agbogbloshie, Accra', details: 'Inhalation hazard due to open burning of heavy copper casings', severity: 'Critical' }
    ],
    'NG': [
      { hazard: 'Industrial effluent canal runoff', location: 'Lagos Lagoon waterways', details: 'Chemical film accumulation affecting water quality indices', severity: 'High' },
      { hazard: 'Methane pocket expansion', location: 'Olusosun Dump, Lagos State', details: 'Saturated dump emitting high levels of greenhouse gases', severity: 'Critical' }
    ],
    'GN': [
      { hazard: 'Low garbage collection coverage', location: 'Madina Market, Conakry', details: 'Decomposition causing severe bacterial risk factors', severity: 'High' }
    ],
    'GM': [
      { hazard: 'Decaying organic seaside piles', location: 'Banjul Fish Packaging Plant', details: 'Bacterial spillover risks to local marine estuary', severity: 'Moderate' }
    ]
  };

  const risks = countryRisks[country.code] || countryRisks['SL'];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Environmental Intelligence Board</h2>
        <p className="text-xs text-gray-400 mt-1">
          Real-time diagnostics of air quality, water pollution indices, soil health, and environmental risk alerts for {country.name}.
        </p>
      </div>

      {/* Main Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Air Quality (AQI) Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Atmospheric Node</span>
            <Wind className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900">{stats.airQualityIndex}</span>
            <span className="text-xs text-gray-400 font-mono">PM2.5 / AQI</span>
          </div>

          <div className={`border p-3 rounded-xl space-y-1.5 ${aqiInfo.color}`}>
            <span className="text-xs font-extrabold block">Air Status: {aqiInfo.label}</span>
            <p className="text-[10px] leading-relaxed opacity-90">{aqiInfo.desc}</p>
          </div>
        </div>

        {/* Water Quality (WQI) Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Hydrological Node</span>
            <Droplet className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900">{stats.waterQualityIndex}</span>
            <span className="text-xs text-gray-400 font-mono">WQI / 100</span>
          </div>

          <div className={`border p-3 rounded-xl space-y-1.5 ${wqiInfo.color}`}>
            <span className="text-xs font-extrabold block">Water Status: {wqiInfo.label}</span>
            <p className="text-[10px] leading-relaxed opacity-90">
              Evaluated based on bacterial counts, single-use plastic pollution, and chemical turbidity in estuaries.
            </p>
          </div>
        </div>

        {/* Soil & Land Health Index */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Terrestrial Node</span>
            <Leaf className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900">{stats.soilHealthIndex}</span>
            <span className="text-xs text-gray-400 font-mono">SHI / 100</span>
          </div>

          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-3 rounded-xl space-y-1.5">
            <span className="text-xs font-extrabold block">Soil Status: Saturation Acceptable</span>
            <p className="text-[10px] leading-relaxed opacity-90">
              Assesses toxic leachate diffusion, heavy metal absorption levels near dumps, and composting fertility.
            </p>
          </div>
        </div>
      </div>

      {/* Risks and Hazards Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
          <ShieldAlert className="w-5 h-5 text-brand-primary" />
          <span>Active Jurisdictional Hazard Warnings</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((risk, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-brand-primary/20 transition-all flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono">{risk.hazard}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                    risk.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {risk.severity} Severity
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono mt-1">Location: {risk.location}</p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{risk.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
