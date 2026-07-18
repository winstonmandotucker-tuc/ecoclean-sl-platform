import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, Search, Layers, Calendar, Info, Bell, CheckCircle2, Navigation, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report } from '../../lib/citizenData';
import { mapProvider } from '../../lib/mapConfig';

interface CitizenReportMapProps {
  reports: Report[];
}

export default function CitizenReportMap({ reports }: CitizenReportMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvents, setShowEvents] = useState(true);
  const [showDisposalZones, setShowDisposalZones] = useState(true);
  const [focusedReport, setFocusedReport] = useState<Report | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Static Safe Disposal Zones in Sierra Leone (Freetown, Bo, Makeni)
  const disposalZones = [
    { id: 'DP-01', name: 'Kingtom Commercial Dump & Sorting Hub', lat: 8.4890, lng: -13.2500, type: 'Official Landfill', capacity: '90%' },
    { id: 'DP-02', name: 'Granville Brook Regional Landfill & Recycling Site', lat: 8.4831, lng: -13.2045, type: 'Transfer Station', capacity: '75%' },
    { id: 'DP-03', name: 'Lumley Community Recycling Center', lat: 8.4550, lng: -13.2720, type: 'Recycling Hub', capacity: '40%' },
    { id: 'DP-04', name: 'Bo Waste-to-Energy Compost Pit', lat: 7.9600, lng: -11.7380, type: 'Composting Site', capacity: '55%' },
    { id: 'DP-05', name: 'Makeni Transit Disposal Bin', lat: 8.8810, lng: -12.0420, type: 'Collection Point', capacity: '85%' }
  ];

  // Static Community Volunteer Cleanup Campaigns
  const cleanups = [
    { id: 'CL-01', title: 'Aberdeen Beach Plastic Harvesting Campaign', lat: 8.4980, lng: -13.2950, date: 'Saturday, 9:00 AM', volunteers: 48 },
    { id: 'CL-02', title: 'Kroo Bay Drainage De-clogging volunteer drive', lat: 8.4862, lng: -13.2420, date: 'Sunday, 8:30 AM', volunteers: 124 },
    { id: 'CL-03', title: 'Bo Clocktower Street Cleaning Festival', lat: 7.9620, lng: -11.7410, date: 'Next Saturday', volunteers: 35 }
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    // Freetown centroid default
    const map = L.map(mapContainerRef.current, {
      center: [8.4844, -13.2344],
      zoom: 13,
      zoomControl: false
    });

    mapRef.current = map;

    L.tileLayer(mapProvider.tileUrl, {
      attribution: mapProvider.attribution
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Marker Layer Group
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Filter Reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Re-render Markers when state changes
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Custom DivIcon Helper
    const createHtmlIcon = (bgColor: string, ringColor: string, isBig = false) => {
      const size = isBig ? 'w-6.5 h-6.5' : 'w-4.5 h-4.5';
      const pulseSize = isBig ? 'w-10 h-10' : 'w-8 h-8';
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute ${pulseSize} rounded-full ${ringColor} animate-pulse"></div>
            <div class="${size} rounded-full ${bgColor} border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // 1. Plot Filtered Reports
    filteredReports.forEach(rep => {
      let iconColor = 'bg-yellow-500';
      let pulseColor = 'bg-yellow-500/20';

      if (rep.status === 'Completed' || rep.status === 'Verified') {
        iconColor = 'bg-emerald-500';
        pulseColor = 'bg-emerald-500/20';
      } else if (rep.status === 'In Progress') {
        iconColor = 'bg-blue-500';
        pulseColor = 'bg-blue-500/20';
      } else if (rep.priority === 'High') {
        iconColor = 'bg-red-500';
        pulseColor = 'bg-red-500/20';
      }

      const reportIcon = createHtmlIcon(iconColor, pulseColor, false);
      const marker = L.marker([rep.gps.lat, rep.gps.lng], { icon: reportIcon });

      marker.on('click', () => {
        setFocusedReport(rep);
        mapRef.current?.panTo([rep.gps.lat, rep.gps.lng]);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Plot Cleanup Campaigns
    if (showEvents) {
      cleanups.forEach(campaign => {
        const campaignIcon = createHtmlIcon('bg-purple-600', 'bg-purple-600/25', true);
        const marker = L.marker([campaign.lat, campaign.lng], { icon: campaignIcon });

        marker.bindPopup(`
          <div class="p-2 font-sans space-y-1 text-slate-800">
            <span class="bg-purple-50 border border-purple-100 text-purple-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">Cleanup Campaign</span>
            <h5 class="text-xs font-bold leading-snug mt-1">${campaign.title}</h5>
            <p class="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
              <span>📅 ${campaign.date}</span>
              <span class="font-bold">•</span>
              <span>👥 ${campaign.volunteers} Volunteers Joined</span>
            </p>
          </div>
        `, { maxWidth: 220 });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Plot Safe Disposal Sites
    if (showDisposalZones) {
      disposalZones.forEach(zone => {
        const binIcon = createHtmlIcon('bg-sky-500', 'bg-sky-500/20', true);
        const marker = L.marker([zone.lat, zone.lng], { icon: binIcon });

        marker.bindPopup(`
          <div class="p-2 font-sans space-y-1 text-slate-800">
            <span class="bg-sky-50 border border-sky-100 text-sky-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase block w-max">Safe Disposal Hub</span>
            <h5 class="text-xs font-bold leading-tight mt-1">${zone.name}</h5>
            <p class="text-[10px] text-gray-500 font-medium">Type: ${zone.type}</p>
            <div class="flex justify-between items-center text-[9px] font-mono mt-1 pt-1.5 border-t border-gray-100">
              <span class="text-gray-400">CURRENT CAPACITY:</span>
              <span class="font-bold text-red-600">${zone.capacity}</span>
            </div>
          </div>
        `, { maxWidth: 220 });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // Centering helper: if focused report changes, center on it
    if (focusedReport) {
      mapRef.current.setView([focusedReport.gps.lat, focusedReport.gps.lng], 14);
    }
  }, [filteredReports, showEvents, showDisposalZones]);

  const handlePanToUserLocation = () => {
    if (mapRef.current) {
      // Simulate citizen current location in Kroo Bay/freetown center
      mapRef.current.setView([8.4844, -13.2344], 14);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="citizen-report-map-root">
      
      {/* Top filter and header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Public GIS Report Map</h2>
          <p className="text-xs text-gray-500 mt-0.5">Track reported issues, volunteer cleanups, and eco-certified waste hubs across Sierra Leone</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showEvents} 
              onChange={() => setShowEvents(!showEvents)} 
              className="accent-brand-primary"
            />
            <span>Cleanup Drives</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showDisposalZones} 
              onChange={() => setShowDisposalZones(!showDisposalZones)} 
              className="accent-brand-primary"
            />
            <span>Disposal Hubs</span>
          </label>
          <button
            onClick={handlePanToUserLocation}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-150 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer text-gray-700"
          >
            <Compass className="w-4 h-4 text-brand-primary shrink-0" />
            <span>My Simulated GPS</span>
          </button>
        </div>
      </div>

      {/* Main Grid Map Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Canvas Column */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-4 shadow-sm flex flex-col relative min-h-[500px]">
          
          {/* Custom controls HUD inside Map Container */}
          <div className="absolute top-8 left-8 z-10 flex flex-col sm:flex-row gap-3 pointer-events-none w-[calc(100%-4rem)]">
            <div className="bg-slate-950/85 backdrop-blur-md text-white border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-2 pointer-events-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono text-slate-300">GPS ACCURACY RANGE: ±4 METERS</span>
            </div>

            <div className="flex items-center gap-2 max-w-sm pointer-events-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reported points..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 shadow-lg rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-brand-primary text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Actual Leaflet Container */}
          <div 
            ref={mapContainerRef} 
            className="flex-1 w-full rounded-2xl overflow-hidden min-h-[440px] z-0" 
          />
        </div>

        {/* Sidebar details */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Quick Stats Summary */}
          <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-brand-primary" /> Filter Spatial Incidents
              </h4>
              <span className="px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-lg font-mono">
                {filteredReports.length} Plotted
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setFocusedReport(null);
                  }}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:bg-white"
                >
                  <option value="All">All Categories</option>
                  <option>Illegal Dumping</option>
                  <option>Overflowing Waste Bin</option>
                  <option>Hazardous Accumulation</option>
                  <option>Toxic Leakage</option>
                  <option>E-Waste Hazard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setFocusedReport(null);
                  }}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="In Progress">Active Crews</option>
                  <option value="Completed">Completed Cleanup</option>
                </select>
              </div>
            </div>
          </div>

          {/* Focused Inspection HUD */}
          {focusedReport ? (
            <div className="bg-white border-2 border-brand-primary/20 rounded-3xl p-5 shadow-md space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    focusedReport.status === 'Completed' || focusedReport.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                      : 'bg-yellow-50 text-yellow-600 border border-yellow-100/50'
                  }`}>
                    {focusedReport.status}
                  </span>
                  <span className="font-mono text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    {focusedReport.id}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 leading-snug">{focusedReport.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">District: <span className="text-gray-700 font-bold">{focusedReport.district}</span> • Category: <span className="text-gray-700 font-bold">{focusedReport.category}</span></p>
                </div>

                <div className="rounded-xl overflow-hidden bg-gray-50 border h-24 relative">
                  <img 
                    src={focusedReport.photos[0]} 
                    alt="Dumping Area" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                  "{focusedReport.description}"
                </p>

                <div className="pt-2 border-t border-gray-100 text-[10px] font-mono text-gray-400 flex justify-between items-center">
                  <span>GPS: {focusedReport.gps.lat}, {focusedReport.gps.lng}</span>
                  <span>Reported: {focusedReport.date}</span>
                </div>
              </div>

              <button
                onClick={() => setFocusedReport(null)}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 font-bold text-xs py-2 rounded-xl mt-4 cursor-pointer"
              >
                Clear Map Focus
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm space-y-3.5 flex-1 flex flex-col justify-center text-center">
              <Compass className="w-10 h-10 mx-auto text-brand-accent/60" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-accent">GIS Inspection Hub</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto mt-1.5">
                  Click on any incident marker (yellow/red dots) or cleanup volunteers (purple pins) directly on the Leaflet map to inspect active telemetry.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
