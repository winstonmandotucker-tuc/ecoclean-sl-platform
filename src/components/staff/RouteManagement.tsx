import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Map, Search, Layers, Navigation, ZoomIn, ZoomOut, Check, Pin, MapPin, 
  Eye, Route, Circle, ListFilter, AlertCircle, Sparkles, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { StaffTask, DISTRICT_MAP_COORDS } from '../../lib/staffData';
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

interface RouteManagementProps {
  tasks: StaffTask[];
  onExecuteTask: (taskId: string) => void;
}

export default function RouteManagement({ tasks, onExecuteTask }: RouteManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  // Layer states
  const [showDistricts, setShowDistricts] = useState(true);
  const [showMunicipals, setShowMunicipals] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showClustering, setShowClustering] = useState(false);

  // Zoom factor
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapCenter, setMapCenter] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;
      const matchesDistrict = !selectedDistrict || task.district === selectedDistrict;
      return matchesSearch && matchesPriority && matchesStatus && matchesDistrict;
    });
  }, [tasks, searchQuery, selectedPriority, selectedStatus, selectedDistrict]);

  // Tasks mapped by district
  const districtStats = useMemo(() => {
    const stats: Record<string, { total: number; high: number; inProgress: number; completed: number }> = {};
    DISTRICT_MAP_COORDS.forEach(d => {
      stats[d.name] = { total: 0, high: 0, inProgress: 0, completed: 0 };
    });

    tasks.forEach(task => {
      if (stats[task.district]) {
        stats[task.district].total += 1;
        if (task.priority === 'High') stats[task.district].high += 1;
        if (task.status === 'In Progress') stats[task.district].inProgress += 1;
        if (task.status === 'Completed') stats[task.district].completed += 1;
      }
    });

    return stats;
  }, [tasks]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
    if (zoomLevel <= 1) {
      setMapCenter({ x: 0, y: 0 });
      setSelectedDistrict(null);
    }
  };

  const handleDistrictClick = (districtName: string) => {
    if (selectedDistrict === districtName) {
      setSelectedDistrict(null);
    } else {
      setSelectedDistrict(districtName);
      // Zoom in slightly on selection
      setZoomLevel(1.3);
      // Center map towards district
      const d = DISTRICT_MAP_COORDS.find(item => item.name === districtName);
      if (d) {
        setMapCenter({
          x: (50 - d.x) * 4,
          y: (50 - d.y) * 4
        });
      }
    }
  };

  const activeTaskForPins = useMemo(() => {
    return filteredTasks.filter(t => t.status !== 'Completed');
  }, [filteredTasks]);

  // Find a path through the tasks (sorted roughly West to East to make a route line)
  const sortedRouteTasks = useMemo(() => {
    return [...activeTaskForPins].sort((a, b) => a.gps.x - b.gps.x);
  }, [activeTaskForPins]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [8.4844, -11.7401],
      zoom: 8,
      zoomControl: false,
    });

    mapRef.current = map;

    L.tileLayer(mapProvider.tileUrl, {
      attribution: mapProvider.attribution
    }).addTo(map);

    layersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map view & overlays
  useEffect(() => {
    if (!mapRef.current || !layersGroupRef.current) return;

    layersGroupRef.current.clearLayers();

    // 1. Zoom and Center based on selection
    if (selectedDistrict && DISTRICT_GPS[selectedDistrict]) {
      const { lat, lng } = DISTRICT_GPS[selectedDistrict];
      mapRef.current.setView([lat, lng], 11);
    } else {
      mapRef.current.setView([8.4844, -11.7401], 8);
    }

    // Custom icon helper
    const createHtmlIcon = (color: string, numberValue?: string | number) => {
      const inner = numberValue !== undefined 
        ? `<span class="text-white text-[10px] font-black font-mono">${numberValue}</span>`
        : `<div class="w-1.5 h-1.5 rounded-full bg-white"></div>`;
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-${color}/20 animate-pulse"></div>
            <div class="w-4.5 h-4.5 rounded-full bg-${color} border-2 border-white shadow-md flex items-center justify-center">
              ${inner}
            </div>
          </div>
        `,
        className: 'custom-leaflet-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // 2. Plot District boundaries/markers if requested
    if (showDistricts) {
      DISTRICT_MAP_COORDS.forEach((district) => {
        const gps = DISTRICT_GPS[district.name];
        if (!gps) return;

        const isSelected = selectedDistrict === district.name;
        const stats = districtStats[district.name];
        const activeCount = stats ? (stats.total - stats.completed) : 0;

        // Draw simple circular sector area
        const circle = L.circle([gps.lat, gps.lng], {
          radius: isSelected ? 12000 : 7000,
          color: isSelected ? '#10b981' : '#334155',
          weight: 1.5,
          fillColor: isSelected ? '#10b981' : '#334155',
          fillOpacity: isSelected ? 0.25 : 0.08
        });

        circle.on('click', () => {
          handleDistrictClick(district.name);
        });

        // Add to layer group
        layersGroupRef.current?.addLayer(circle);

        // Hover effect helper
        circle.on('mouseover', () => setHoveredDistrict(district.name));
        circle.on('mouseout', () => setHoveredDistrict(null));
      });
    }

    // 3. Plot Task Clustering / Individual Markers
    if (showClustering) {
      // Draw cluster circles for districts with active tasks
      DISTRICT_MAP_COORDS.forEach((district) => {
        const gps = DISTRICT_GPS[district.name];
        if (!gps) return;

        const stats = districtStats[district.name];
        const activeCount = stats ? (stats.total - stats.completed) : 0;
        if (activeCount === 0) return;

        const clusterMarker = L.marker([gps.lat + 0.02, gps.lng + 0.02], {
          icon: createHtmlIcon('red-600', activeCount)
        });

        clusterMarker.bindPopup(`
          <div class="p-1 font-sans text-xs text-slate-800">
            <h5 class="font-bold">${district.fullName}</h5>
            <p class="text-[10px] text-gray-500 mt-0.5">Active tasks clustered here: <b>${activeCount}</b></p>
          </div>
        `);

        layersGroupRef.current?.addLayer(clusterMarker);
      });
    } else {
      // Plot individual tasks
      filteredTasks.forEach((task) => {
        const isHigh = task.priority === 'High';
        const isCompleted = task.status === 'Completed';
        const isProgress = task.status === 'In Progress' || task.status === 'Traveling';

        let color = 'emerald-500';
        if (isCompleted) color = 'gray-400';
        else if (isHigh) color = 'red-500';
        else if (isProgress) color = 'amber-500';

        const taskIcon = createHtmlIcon(color);
        const marker = L.marker([task.gps.lat, task.gps.lng], { icon: taskIcon });

        marker.bindPopup(`
          <div class="p-2 font-sans space-y-1.5 text-slate-800 w-48">
            <div class="flex justify-between items-center text-[9px]">
              <span class="bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-mono font-bold">${task.id}</span>
              <span class="font-bold text-red-600">${task.priority} Priority</span>
            </div>
            <h5 class="text-xs font-black leading-tight">${task.title}</h5>
            <p class="text-[10px] text-gray-500 leading-normal">${task.location}</p>
            <div class="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[9px] font-mono">
              <span>SLA status:</span>
              <span class="font-bold uppercase text-brand-primary">${task.status}</span>
            </div>
          </div>
        `, { maxWidth: 220 });

        marker.on('click', () => {
          // Centering the clicked task
          mapRef.current?.panTo([task.gps.lat, task.gps.lng]);
        });

        layersGroupRef.current?.addLayer(marker);
      });
    }

    // 4. Plot polyline route linking active tasks in longitude order
    if (showRoutes && sortedRouteTasks.length > 1) {
      const latlngs = sortedRouteTasks.map(t => [t.gps.lat, t.gps.lng] as [number, number]);
      const polyline = L.polyline(latlngs, {
        color: '#10b981',
        weight: 2.5,
        dashArray: '8, 6',
        opacity: 0.8
      });

      layersGroupRef.current?.addLayer(polyline);
    }

  }, [filteredTasks, showDistricts, showRoutes, showClustering, selectedDistrict]);

  return (
    <div className="space-y-6">
      
      {/* Top filter and toggle bar */}
      <div className="bg-white rounded-3xl border border-gray-250/80 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dispatch points, reference codes, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:bg-white focus:border-brand-primary text-gray-800"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white text-gray-700 font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white text-gray-700 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Traveling">Traveling</option>
              <option value="In Progress">In Progress</option>
              <option value="Verification Pending">Verification Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Clear selection if district is selected */}
        {selectedDistrict && (
          <button
            onClick={() => {
              setSelectedDistrict(null);
              setZoomLevel(1);
              setMapCenter({ x: 0, y: 0 });
            }}
            className="text-xs font-bold text-brand-primary bg-brand-accent/20 border border-brand-accent/30 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-accent/30 cursor-pointer"
          >
            <span>District: {selectedDistrict}</span>
            <span className="text-[9px] bg-brand-primary text-white rounded-full w-4 h-4 flex items-center justify-center">×</span>
          </button>
        )}
      </div>

      {/* Main Grid Layout (Map Left, Task List Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Container Column */}
        <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[500px]">
          
          {/* Floating HUD controls */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2.5">
            <div className="bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-2 max-w-xs">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                <Layers className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">GIS Map Layers</span>
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-300 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={showDistricts} 
                    onChange={() => setShowDistricts(!showDistricts)}
                    className="accent-brand-primary"
                  />
                  <span>District Boundaries</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-300 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={showMunicipals} 
                    onChange={() => setShowMunicipals(!showMunicipals)}
                    className="accent-brand-primary"
                  />
                  <span>Municipal Boundaries</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-300 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={showRoutes} 
                    onChange={() => setShowRoutes(!showRoutes)}
                    className="accent-brand-primary"
                  />
                  <span>Navigation Route Tracks</span>
                </label>
                <label className="flex items-center gap-2 text-[11px] font-medium text-slate-300 cursor-pointer hover:text-white">
                  <input 
                    type="checkbox" 
                    checked={showClustering} 
                    onChange={() => setShowClustering(!showClustering)}
                    className="accent-brand-primary"
                  />
                  <span>Task Clustering (Bubble)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-6 left-6 z-10 flex items-center bg-white border border-gray-200 rounded-xl shadow-md p-1 gap-1">
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono font-bold text-gray-400 px-1 border-r border-l border-gray-100">
              {Math.round(zoomLevel * 100)}%
            </div>
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* District Tooltip Hover / Info */}
          <div className="absolute top-6 right-6 z-10 max-w-xs">
            {hoveredDistrict ? (
              <div className="bg-white/95 backdrop-blur-md border border-gray-250 p-4 rounded-2xl shadow-xl space-y-2 animate-fade-in">
                <span className="text-[10px] font-bold font-mono tracking-wider text-brand-primary uppercase">District Information</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{DISTRICT_MAP_COORDS.find(d => d.name === hoveredDistrict)?.fullName}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">District Area watch</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px]">TOTAL TASKS</span>
                    <span className="font-bold text-gray-800 font-mono text-xs">{districtStats[hoveredDistrict]?.total || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">HIGH PRIORITY</span>
                    <span className="font-bold text-red-600 font-mono text-xs">{districtStats[hoveredDistrict]?.high || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">IN PROGRESS</span>
                    <span className="font-bold text-brand-primary font-mono text-xs">{districtStats[hoveredDistrict]?.inProgress || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">RESOLVED</span>
                    <span className="font-bold text-brand-success font-mono text-xs">{districtStats[hoveredDistrict]?.completed || 0}</span>
                  </div>
                </div>
              </div>
            ) : selectedDistrict ? (
              <div className="bg-brand-primary text-white border border-emerald-950 p-4 rounded-2xl shadow-xl space-y-1 animate-fade-in">
                <span className="text-[9px] font-bold font-mono tracking-wider text-brand-accent uppercase">Selected Focus Zone</span>
                <h4 className="text-sm font-bold truncate">{DISTRICT_MAP_COORDS.find(d => d.name === selectedDistrict)?.fullName}</h4>
                <p className="text-[11px] text-emerald-100/80">Filtered tasks shown in side-panel</p>
                <div className="pt-2 flex justify-between items-center text-xs text-brand-accent font-bold">
                  <span>Active Tasks: {districtStats[selectedDistrict]?.total - districtStats[selectedDistrict]?.completed || 0}</span>
                  <button 
                    onClick={() => {
                      setSelectedDistrict(null);
                      setZoomLevel(1);
                      setMapCenter({ x: 0, y: 0 });
                    }} 
                    className="underline text-[10px] hover:text-white"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-3.5 rounded-2xl shadow-md text-xs text-gray-500 max-w-[200px]">
                <p className="leading-relaxed">
                  Hover over a district region to view stats. Click to lock and filter assignments.
                </p>
              </div>
            )}
          </div>

          {/* Map Title Overlay */}
          <div className="absolute bottom-6 right-6 z-10 text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-bold text-gray-400">SIERRA LEONE TELEMETRY GRID</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">Scale: Regional GPS Relay Matrix</p>
          </div>

          {/* THE REAL WORLD LEAFLET CONTAINER */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden min-h-[440px] relative z-0">
            <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '440px' }} />
          </div>
        </div>

        {/* Task sidebar selection list */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* List Header stats */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900">
                  {selectedDistrict ? `${selectedDistrict} Zone` : 'National Grid Tasks'}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Showing {filteredTasks.length} matching dispatch points
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl text-center">
                <span className="text-xs font-black text-brand-primary font-mono block">
                  {filteredTasks.filter(t => t.status !== 'Completed').length}
                </span>
                <span className="text-[8px] font-bold text-brand-primary block uppercase tracking-wider leading-none">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Scrollable Tasks List */}
          <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[420px] pr-1.5">
            {filteredTasks.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-gray-800">No matching routes or tasks</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Try refining your search queries or resetting your locked district area filters.
                  </p>
                </div>
                {selectedDistrict && (
                  <button
                    onClick={() => {
                      setSelectedDistrict(null);
                      setZoomLevel(1);
                      setMapCenter({ x: 0, y: 0 });
                    }}
                    className="text-[10px] font-bold text-brand-primary underline"
                  >
                    Clear Locked District
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isHigh = task.priority === 'High';
                const isCompleted = task.status === 'Completed';
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 relative group ${
                      isCompleted 
                        ? 'border-gray-150 opacity-75' 
                        : isHigh 
                        ? 'border-red-100 hover:border-red-300' 
                        : 'border-emerald-100 hover:border-brand-primary/30'
                    }`}
                  >
                    {/* Badge top */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-black bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                          {task.id}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'High' 
                            ? 'bg-red-50 text-red-600 border border-red-100/50' 
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100/50'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted 
                          ? 'bg-emerald-50 text-brand-success' 
                          : 'bg-brand-primary/10 text-brand-primary'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    {/* Task Title & Loc */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-brand-primary transition-colors leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                        <span className="truncate">{task.location}</span>
                      </p>
                    </div>

                    {/* Footer Details */}
                    <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>Ref: {task.referenceNumber}</span>
                      <span>Est: {task.fuelEstimate || 'N/A'}</span>
                    </div>

                    {/* Execute action overlay */}
                    <div className="pt-2">
                      {isCompleted ? (
                        <div className="w-full bg-emerald-50 text-brand-success text-[10px] font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Task Completed & Verified</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onExecuteTask(task.id)}
                          className="w-full bg-gray-50 hover:bg-brand-primary hover:text-white text-gray-700 font-bold text-[10px] py-2 rounded-xl border border-gray-150 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Execute Workflow</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Route optimization CTA */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-4.5 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-brand-accent">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">AI Route Optimization</h4>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Consolidate high-priority dispatches into a GPS-optimized fuel loop across active Sierra Leone sectors.
            </p>
            <button 
              onClick={() => {
                // Mock route sync
                alert('GPS Collection Loop generated! 4 high-priority tasks linked across FCC/WRDC borders. Coordinates synced to Compactor SL-02.');
              }}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-brand-primary/10"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Synthesize GPS Fuel Route</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
