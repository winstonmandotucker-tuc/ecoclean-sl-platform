import React from 'react';
import { 
  Building, BarChart2, TrendingUp, Users, CheckCircle, 
  Map, Fuel, Star, Award, ShieldAlert
} from 'lucide-react';
import { RegionPerformance } from '../../lib/supervisorData';

interface MunicipalityPerformanceProps {
  regions: RegionPerformance[];
}

export default function MunicipalityPerformance({ regions }: MunicipalityPerformanceProps) {
  
  // Calculate aggregate metrics across all municipalities
  const aggregateActive = regions.reduce((acc, r) => acc + r.activeReports, 0);
  const aggregateResolved = regions.reduce((acc, r) => acc + r.resolvedToday, 0);
  const aggregateWaste = regions.reduce((acc, r) => acc + r.wasteCollectedTons, 0);
  const aggregateCompliance = (regions.reduce((acc, r) => acc + r.slaCompliance, 0) / regions.length).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in" id="municipality-performance-center">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Municipality Performance Centre</h2>
          <p className="text-xs text-gray-500 mt-0.5">Compare regional council report flows, average response times and overall cleaning compliance</p>
        </div>
      </div>

      {/* Aggregate Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">National Active Load</span>
          <div>
            <h4 className="text-2xl font-black text-gray-800 leading-none">{aggregateActive} cases</h4>
            <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Currently unresolved in platform</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Completed Today</span>
          <div>
            <h4 className="text-2xl font-black text-emerald-600 leading-none">{aggregateResolved} tasks</h4>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1.5">Authorized clean states</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Avg SLA Compliance</span>
          <div>
            <h4 className="text-2xl font-black text-brand-primary leading-none">{aggregateCompliance}%</h4>
            <span className="text-[10px] text-brand-primary font-bold block mt-1.5">Exceeding national SLA ceiling</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Waste Reclaimed Today</span>
          <div>
            <h4 className="text-2xl font-black text-gray-800 leading-none">{aggregateWaste.toFixed(1)} Tons</h4>
            <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Diverted into regional landfills</span>
          </div>
        </div>
      </div>

      {/* Municipal Comparison Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regions.map((region) => {
          return (
            <div 
              key={region.id} 
              className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm space-y-5 hover:border-gray-300 transition-all"
            >
              
              {/* Card Title */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-none">{region.regionName}</h3>
                    <span className="text-[10px] text-gray-400 font-mono block mt-1">{region.municipality}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono tracking-wide uppercase rounded-lg border border-emerald-100">
                  Rating: {region.citizenSatisfaction} / 5.0
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Active Incidents</span>
                  <span className="text-sm font-black text-gray-800 font-mono">{region.activeReports} cases</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Resolved Today</span>
                  <span className="text-sm font-black text-emerald-600 font-mono">{region.resolvedToday} tasks</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Waste Reclaimed</span>
                  <span className="text-sm font-black text-gray-800 font-mono">{region.wasteCollectedTons} Tons</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Teams Deployed</span>
                  <span className="text-sm font-black text-gray-800 font-mono">{region.teamsDeployed} crews</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Avg Resolution</span>
                  <span className="text-sm font-black text-gray-800 font-mono">{region.averageResolutionTime}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Leader Rank</span>
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <Award className="w-3.5 h-3.5 fill-emerald-50" /> Top Performer
                  </span>
                </div>

              </div>

              {/* SLA compliance bar */}
              <div className="space-y-2 pt-3 border-t border-gray-150">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">SLA compliance index</span>
                  <span className="font-extrabold text-brand-primary">{region.slaCompliance}%</span>
                </div>
                
                {/* Horizontal meter */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-150">
                  <div 
                    className="h-full bg-brand-primary"
                    style={{ width: `${region.slaCompliance}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
