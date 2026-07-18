import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, ShieldAlert, Truck, Signal, RefreshCw, 
  MapPin, Clock, Fuel, Bell, CheckCircle, Info
} from 'lucide-react';
import { FieldStaff } from '../../lib/supervisorData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapProvider } from '../../lib/mapConfig';

const DISTRICT_GPS: Record<string, { lat: number; lng: number }> = {
  'Western Urban': { lat: 8.484, lng: -13.234 },
  'Western Rural': { lat: 8.338, lng: -13.071 },
  'Bo': { lat: 7.962, lng: -11.740 },
  'Bombali': { lat: 8.882, lng: -12.043 },
  'Kenema': { lat: 7.873, lng: -11.186 },
  'Port Loko': { lat: 9.066, lng: -12.787 },
  'Kambia': { lat: 9.125, lng: -12.918 },
  'Karene': { lat: 9.583, lng: -12.200 },
  'Koinadugu': { lat: 9.516, lng: -11.550 },
  'Falaba': { lat: 9.851, lng: -11.121 },
  'Tonkolili': { lat: 8.750, lng: -11.950 },
  'Kono': { lat: 8.641, lng: -10.970 },
  'Moyamba': { lat: 8.158, lng: -12.431 },
  'Bonthe': { lat: 7.526, lng: -12.505 },
  'Pujehun': { lat: 7.219, lng: -11.524 },
  'Kailahun': { lat: 8.276, lng: -10.573 }
};

interface LiveOperationsMonitorProps {
  staff: FieldStaff[];
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  vessel: string;
  operator: string;
  status: string;
  type: 'info' | 'warning' | 'success' | 'alert';
}

export default function LiveOperationsMonitor({ staff }: LiveOperationsMonitorProps) {
  const [selectedVessel, setSelectedVessel] = useState<FieldStaff | null>(staff[0] || null);
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: 'log-1', timestamp: '09:42:15', vessel: 'Compactor SL-02', operator: 'Joseph Kamara', status: 'In Route: Speeds at 22 km/h near Congo Town', type: 'info' },
    { id: 'log-2', timestamp: '09:40:02', vessel: 'Hook-Truck SL-09', operator: 'Amadu Bangura', status: 'Stationary: Crane deployed at Kroo Town bridge canal', type: 'warning' },
    { id: 'log-3', timestamp: '09:35:11', vessel: 'Sweeper SL-04', operator: 'Fatmata Fofanah', status: 'Active: Sweeping speed 6 km/h at Bo bypass', type: 'success' },
    { id: 'log-4', timestamp: '09:22:45', vessel: 'Flatbed truck SL-11', operator: 'Alusine Condeh', status: 'In Route: Speeds 42 km/h near Kenema plaza', type: 'info' }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [8.4844, -11.7401],
      zoom: 8,
      zoomControl: false
    });

    mapRef.current = map;

    L.tileLayer(mapProvider.tileUrl, {
      attribution: mapProvider.attribution
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Map Markers based on staff status
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const createHtmlIcon = (color: string, isSelected: boolean) => {
      const size = isSelected ? 'w-6 h-6' : 'w-4.5 h-4.5';
      const pulseSize = isSelected ? 'w-10 h-10' : 'w-8 h-8';
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute ${pulseSize} rounded-full bg-${color}/20 animate-ping"></div>
            <div class="${size} rounded-full bg-${color} border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        className: 'custom-vessel-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    staff.forEach((member, idx) => {
      const isOnline = member.status !== 'Offline';
      if (!isOnline) return;

      const gps = DISTRICT_GPS[member.district];
      if (!gps) return;

      // Add small offset based on index so multiple vehicles in same district don't overlap
      const latOffset = (idx % 3 - 1) * 0.015;
      const lngOffset = (idx % 2 - 0.5) * 0.015;
      const lat = gps.lat + latOffset;
      const lng = gps.lng + lngOffset;

      const isSelected = selectedVessel?.id === member.id;
      const color = isSelected ? 'emerald-500' : 'blue-500';

      const icon = createHtmlIcon(color, isSelected);
      const marker = L.marker([lat, lng], { icon });

      marker.bindPopup(`
        <div class="p-1.5 font-sans space-y-1 text-slate-800">
          <span class="bg-blue-50 border border-blue-150 text-blue-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">${member.vessel}</span>
          <h5 class="text-xs font-black mt-1">Operator: ${member.name}</h5>
          <p class="text-[10px] text-gray-500">District: ${member.district} (${member.municipality})</p>
          <div class="pt-1.5 border-t border-gray-100 flex justify-between text-[9px] font-mono">
            <span>SLA STATE:</span>
            <span class="text-emerald-600 font-bold">${member.status}</span>
          </div>
        </div>
      `, { maxWidth: 200 });

      marker.on('click', () => {
        setSelectedVessel(member);
        mapRef.current?.panTo([lat, lng]);
      });

      markersLayerRef.current?.addLayer(marker);

      // Pan to selected vessel on load or update
      if (isSelected) {
        mapRef.current.setView([lat, lng], 11);
      }
    });

  }, [staff, selectedVessel]);

  // Simulate incoming live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const activeStaff = staff.filter(s => s.status !== 'Offline');
      if (activeStaff.length === 0) return;

      const randomMember = activeStaff[Math.floor(Math.random() * activeStaff.length)];
      const randomSpeeds = Math.floor(15 + Math.random() * 35);
      const randomMinutes = new Date().toLocaleTimeString();

      const newLog: TelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: randomMinutes,
        vessel: randomMember.vessel,
        operator: randomMember.name,
        status: Math.random() > 0.4 
          ? `Moving: Operational speeds at ${randomSpeeds} km/h near ${randomMember.district}`
          : `Sensor report: Fuel balance nominal at ${randomMember.fuelBalance}`,
        type: Math.random() > 0.8 ? 'alert' : 'info'
      };

      setLogs(prev => [newLog, ...prev.slice(0, 7)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [staff]);

  const triggerLivePing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Add a fresh diagnostic log
      const newLog: TelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        vessel: selectedVessel?.vessel || 'Diagnostic Unit',
        operator: selectedVessel?.name || 'System Auto-Ping',
        status: `Diagnostic trace OK: GIS handshakes confirmed. GPS accuracy within ±3 meters.`,
        type: 'success'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 1200);
  };

  const getLogColor = (type: TelemetryLog['type']) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'alert': return 'text-red-600 bg-red-50 border-red-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="live-operations-monitor">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">Live Operations Monitor</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-sans">Real-time GPS vehicle tracking, telemetry diagnostics and rolling sensor streams</p>
        </div>

        <button 
          onClick={triggerLivePing}
          disabled={isRefreshing}
          className="px-4 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-150 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer text-gray-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Pinging GIS...' : 'Ping Live Satellites'}</span>
        </button>
      </div>

      {/* Main Grid: Live GIS Map & Roll log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Live Vessel Map Track */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active stats bar */}
          <div className="grid grid-cols-3 gap-3 bg-white border border-gray-200/80 p-3.5 rounded-2xl shadow-sm text-center">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Vehicles Tracked</span>
              <span className="block text-base font-black text-gray-800 font-mono mt-0.5">
                {staff.filter(s => s.status !== 'Offline').length} units
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Average Fuel</span>
              <span className="block text-base font-black text-brand-primary font-mono mt-0.5">
                66.4%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">GPS Signal</span>
              <span className="block text-base font-black text-emerald-600 font-mono mt-0.5 flex items-center justify-center gap-1">
                <Signal className="w-4 h-4 text-emerald-500" /> Excellent
              </span>
            </div>
          </div>
          {/* Interactive Live Tracking Map Container */}
          <div className="relative border border-slate-800 rounded-3xl bg-slate-950 overflow-hidden h-[380px] flex flex-col z-0">
            <div ref={mapContainerRef} className="w-full h-full flex-1" style={{ minHeight: '320px' }} />

            {/* Selected Vessel HUD details (Heads Up Display) */}
            {selectedVessel && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-emerald-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight">{selectedVessel.vessel}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">Operator: <span className="font-bold text-gray-200">{selectedVessel.name}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex gap-4 md:gap-6 text-xs text-gray-400 font-mono">
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold">Vessel State</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> On Duty
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold">Fuel balance</span>
                    <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                      <Fuel className="w-3.5 h-3.5 text-gray-500" /> {selectedVessel.fuelBalance}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Rolling Telemetry Feed */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1">
              <Clock className="w-4 h-4 text-brand-primary" /> Rolling Sensor Stream
            </h3>
            <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-150 text-[9px] text-gray-400 rounded-lg font-mono font-bold animate-pulse">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-3 border border-gray-100 rounded-xl space-y-1 bg-gray-50/50 hover:bg-gray-50 transition-all text-xs"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span className="font-bold text-gray-600">{log.vessel}</span>
                  <span>{log.timestamp}</span>
                </div>
                
                <p className="text-gray-700 leading-normal font-medium">{log.status}</p>
                
                <span className="inline-block text-[9px] text-gray-400 font-mono font-semibold">
                  Operator: {log.operator}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="p-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-primary leading-normal font-medium">
                Vessels transmit telemetry over Freetown FCC base-band repeaters. Live location calculations are simulated on district maps.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
