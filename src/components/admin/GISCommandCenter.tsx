import React, { useState, useEffect, useRef } from 'react';
import { operationalStore } from '../../lib/operationalStore';
import { 
  MapPin, Trash2, ShieldCheck, Map, Truck, Settings2, Info, Plus, 
  ChevronRight, ChevronDown, Lock, Unlock, Eye, EyeOff, Search, 
  Compass, AlertTriangle, Shield, Check, X, Database, RefreshCw, BarChart3, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CountryConfig } from '../../lib/adminData';
import { Report } from '../../lib/citizenData';
import { 
  GeoNode, GISRoute, GISHotspot, EnvironmentalRiskArea,
  INITIAL_SIERRA_LEONE_HIERARCHY, PROVINCE_PATHS, VECTOR_ROUTES, 
  STATIC_HOTSPOTS, ENVIRONMENTAL_RISK_AREAS 
} from '../../lib/gisData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapProvider } from '../../lib/mapConfig';

const svgToGps = (x: number, y: number) => {
  const lat = 8.4844 + (y - 235) * -0.012;
  const lng = -13.2344 + (x - 45) * 0.008;
  return { lat, lng };
};

interface GISCommandCenterProps {
  country: CountryConfig;
}

export default function GISCommandCenter({ country }: GISCommandCenterProps) {
  // Persistent GIS hierarchy state
  const [hierarchy, setHierarchy] = useState<GeoNode>(() => {
    const saved = operationalStore.getItem('ecoclean_gis_hierarchy');
    return saved ? JSON.parse(saved) : INITIAL_SIERRA_LEONE_HIERARCHY;
  });

  // Active reports state linked with app-wide reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = operationalStore.getItem('ecoclean_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Layer switches
  const [layers, setLayers] = useState({
    hotspots: true,
    collectionZones: true,
    municipalityBounds: true,
    districtBounds: true,
    collectionRoutes: true,
    staffLocations: false, // Default false to showcase security restriction
    riskAreas: true,
    heatmap: false,
    analytics: true
  });

  // Operational clearance for staff tracking
  const [hasClearance, setHasClearance] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [clearanceError, setClearanceError] = useState(false);

  // Selected administrative or telemetry elements
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [focusedTelemetry, setFocusedTelemetry] = useState<{
    id: string;
    name: string;
    type: string;
    details: Record<string, string | number>;
  } | null>(null);

  // Map reporting state
  const [reportingModeActive, setReportingModeActive] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{ x: number; y: number; lat?: number; lng?: number } | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Illegal Dumping');
  const [reportPriority, setReportPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [reportSuccessMsg, setReportSuccessMsg] = useState(false);

  // Hierarchical explorer tree expanded states (by node ID)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'SL-01': true,
    'SL-PR-01': true
  });

  // Builder node modal or slideover fields
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [parentNodeId, setParentNodeId] = useState<string | null>(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'province' | 'district' | 'municipality' | 'ward' | 'zone'>('zone');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const reportingModeRef = useRef(reportingModeActive);
  useEffect(() => {
    reportingModeRef.current = reportingModeActive;
  }, [reportingModeActive]);

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

    layersGroupRef.current = L.layerGroup().addTo(map);

    map.on('click', (e) => {
      if (!reportingModeRef.current) return;
      const { lat, lng } = e.latlng;
      const x = Math.round((lng + 13.2344) / 0.008 + 45);
      const y = Math.round((lat - 8.4844) / -0.012 + 235);
      setClickedCoords({ lat, lng, x, y });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Synchronize Leaflet map overlays
  useEffect(() => {
    if (!mapRef.current || !layersGroupRef.current) return;

    layersGroupRef.current.clearLayers();

    // 1. Zoom and Center based on selectedProvince
    if (selectedProvince) {
      const prov = PROVINCE_PATHS.find(p => p.id === selectedProvince);
      if (prov) {
        const { lat, lng } = svgToGps(prov.centerX, prov.centerY);
        mapRef.current.setView([lat, lng], 10);
      }
    }

    const createHtmlIcon = (color: string, iconHtml?: string) => {
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-${color}/20 animate-pulse"></div>
            <div class="w-4.5 h-4.5 rounded-full bg-${color} border-2 border-white shadow-md flex items-center justify-center">
              ${iconHtml || '<div class="w-1.5 h-1.5 rounded-full bg-white"></div>'}
            </div>
          </div>
        `,
        className: 'custom-leaflet-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // 2. Plot Provinces
    PROVINCE_PATHS.forEach((prov) => {
      const isSelected = selectedProvince === prov.id;
      const { lat, lng } = svgToGps(prov.centerX, prov.centerY);

      const circle = L.circle([lat, lng], {
        radius: isSelected ? 35000 : 25000,
        color: isSelected ? '#10b981' : '#334155',
        weight: 1.5,
        fillColor: isSelected ? '#10b981' : '#334155',
        fillOpacity: isSelected ? 0.22 : 0.06
      });

      circle.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (reportingModeRef.current) return;
        setSelectedProvince(prov.id === selectedProvince ? null : prov.id);
      });

      layersGroupRef.current?.addLayer(circle);
    });

    // 3. District Bounds
    if (layers.districtBounds) {
      const districts = [
        { name: 'Western District', center: [8.484, -13.234], radius: 20000 },
        { name: 'Bombali District', center: [8.882, -12.043], radius: 35000 },
        { name: 'Bo District', center: [7.962, -11.740], radius: 30000 },
        { name: 'Kenema District', center: [7.873, -11.186], radius: 32000 }
      ];

      districts.forEach(d => {
        const circle = L.circle(d.center as [number, number], {
          radius: d.radius,
          color: '#f97316',
          weight: 1,
          dashArray: '5, 5',
          fill: false
        });
        layersGroupRef.current?.addLayer(circle);
      });
    }

    // 4. Municipality Bounds
    if (layers.municipalityBounds) {
      const municipalities = [
        { name: 'Freetown City Council', center: [8.484, -13.234], radius: 10000 },
        { name: 'Makeni City Council', center: [8.882, -12.043], radius: 12000 },
        { name: 'Bo City Council', center: [7.962, -11.740], radius: 11000 },
        { name: 'Kenema City Council', center: [7.873, -11.186], radius: 11500 }
      ];

      municipalities.forEach(m => {
        const circle = L.circle(m.center as [number, number], {
          radius: m.radius,
          color: '#0ea5e9',
          weight: 1.2,
          dashArray: '4, 2',
          fill: false
        });
        layersGroupRef.current?.addLayer(circle);
      });
    }

    // 5. Collection Zones
    if (layers.collectionZones) {
      const zones = [
        { name: 'Zone A', center: [8.475, -13.245], radius: 5000 },
        { name: 'Zone B', center: [8.875, -12.055], radius: 6000 },
        { name: 'Zone C', center: [7.955, -11.750], radius: 5500 }
      ];

      zones.forEach(z => {
        const circle = L.circle(z.center as [number, number], {
          radius: z.radius,
          color: '#14b8a6',
          weight: 0.8,
          fillColor: '#14b8a6',
          fillOpacity: 0.12
        });
        layersGroupRef.current?.addLayer(circle);
      });
    }

    // 6. Heatmap
    if (layers.heatmap) {
      const heatSources = [
        { center: [8.484, -13.234], radius: 15000 },
        { center: [7.962, -11.740], radius: 12000 },
        { center: [8.882, -12.043], radius: 8000 }
      ];

      heatSources.forEach(h => {
        const circle = L.circle(h.center as [number, number], {
          radius: h.radius,
          color: '#ef4444',
          weight: 0,
          fillColor: '#ef4444',
          fillOpacity: 0.35
        });
        layersGroupRef.current?.addLayer(circle);
      });
    }

    // 7. Dispatch Routes
    if (layers.collectionRoutes) {
      const routePaths = [
        {
          id: 'RT-01',
          name: 'FCC Coastal Loop #1',
          color: '#3b82f6',
          coords: [
            [8.490, -13.280],
            [8.488, -13.260],
            [8.475, -13.245],
            [8.482, -13.230],
            [8.484, -13.220]
          ]
        },
        {
          id: 'RT-02',
          name: 'MCC Makeni Central Express',
          color: '#10b981',
          coords: [
            [8.880, -12.060],
            [8.890, -12.040],
            [8.875, -12.030],
            [8.882, -12.043]
          ]
        },
        {
          id: 'RT-03',
          name: 'BCC Bo-Kenema Link',
          color: '#f59e0b',
          coords: [
            [7.962, -11.740],
            [7.910, -11.450],
            [7.873, -11.186]
          ]
        }
      ];

      routePaths.forEach(r => {
        const polyline = L.polyline(r.coords as [number, number][], {
          color: r.color,
          weight: 2.5,
          opacity: 0.8,
          dashArray: '6, 4'
        });
        layersGroupRef.current?.addLayer(polyline);
      });
    }

    // 8. Hazards / Risk Areas
    if (layers.riskAreas) {
      ENVIRONMENTAL_RISK_AREAS.forEach((risk) => {
        const { lat, lng } = svgToGps(risk.cx, risk.cy);

        const circle = L.circle([lat, lng], {
          radius: Math.max(risk.rx, risk.ry) * 200,
          color: '#a855f7',
          weight: 1.5,
          fillColor: '#a855f7',
          fillOpacity: 0.15
        });

        circle.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <span class="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">${risk.type}</span>
            <h5 class="font-extrabold text-slate-800 mt-1">${risk.name}</h5>
            <p class="text-[10px] text-gray-500 mt-1">${risk.description}</p>
          </div>
        `);

        circle.on('click', () => {
          setFocusedTelemetry({
            id: risk.id,
            name: risk.name,
            type: 'Environmental Risk Area',
            details: {
              'Hazard Type': risk.type,
              Severity: risk.severity,
              Description: risk.description
            }
          });
        });

        layersGroupRef.current?.addLayer(circle);
      });
    }

    // 9. Hotspots (Static & Citizen reports)
    if (layers.hotspots) {
      // Static Hotspots
      STATIC_HOTSPOTS.forEach((hs) => {
        const { lat, lng } = svgToGps(hs.x, hs.y);
        const color = hs.intensity === 'Critical' ? 'red-600' : 'red-500';

        const marker = L.marker([lat, lng], { icon: createHtmlIcon(color) });

        marker.on('click', () => {
          setFocusedTelemetry({
            id: hs.id,
            name: hs.name,
            type: 'Waste Hotspot',
            details: {
              Volume: hs.volume,
              Intensity: hs.intensity,
              Category: hs.category,
              'Date Identified': hs.reportedDate
            }
          });
        });

        layersGroupRef.current?.addLayer(marker);
      });

      // Dynamic reports
      reports.forEach((rep) => {
        if (!rep.gps) return;
        const marker = L.marker([rep.gps.lat, rep.gps.lng], { icon: createHtmlIcon('amber-500') });

        marker.on('click', () => {
          setFocusedTelemetry({
            id: rep.id,
            name: rep.title,
            type: `Citizen Incident (${rep.priority} Priority)`,
            details: {
              Category: rep.category,
              Status: rep.status,
              District: rep.district,
              Jurisdiction: rep.municipality,
              GPS: `${rep.gps.lat}°N, ${rep.gps.lng}°W`,
              Date: rep.date
            }
          });
        });

        layersGroupRef.current?.addLayer(marker);
      });
    }

    // 10. Staff Locations
    if (layers.staffLocations && hasClearance) {
      const staffMembers = [
        { id: 'ST-501', name: 'Operational Dispatch Truck #04', lat: 8.484, lng: -13.234 },
        { id: 'ST-502', name: 'Bo Collection Team #1', lat: 7.962, lng: -11.740 }
      ];

      staffMembers.forEach((member) => {
        const marker = L.marker([member.lat, member.lng], { icon: createHtmlIcon('emerald-500') });

        marker.on('click', () => {
          setFocusedTelemetry({
            id: member.id,
            name: member.name,
            type: 'Staff Telemetry',
            details: {
              Personnel: member.id === 'ST-501' ? 'Officer Alpha S. Bangura' : 'Supervisor Joe Demby',
              Speed: member.id === 'ST-501' ? '22 km/h' : 'Stationary (Collection Point)',
              Tonnage: member.id === 'ST-501' ? '4.8 / 10 Tons Capacity' : '8.2 / 8 Tons (Overload Alert)',
              Status: member.id === 'ST-501' ? 'En Route to Kingtom Landfill' : 'Compacting waste'
            }
          });
        });

        layersGroupRef.current?.addLayer(marker);
      });
    }

    // 11. Crosshair pin for Reporting mode active click
    if (reportingModeActive && clickedCoords) {
      const targetLat = clickedCoords.lat || svgToGps(clickedCoords.x || 0, clickedCoords.y || 0).lat;
      const targetLng = clickedCoords.lng || svgToGps(clickedCoords.x || 0, clickedCoords.y || 0).lng;

      const crosshairIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 border-2 border-dashed border-amber-500 rounded-full animate-spin-slow"></div>
            <div class="absolute w-8 h-8 border border-dashed border-amber-500 rounded-full"></div>
            <div class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-xl"></div>
          </div>
        `,
        className: 'crosshair-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const crosshairMarker = L.marker([targetLat, targetLng], { icon: crosshairIcon });
      layersGroupRef.current?.addLayer(crosshairMarker);
    }

  }, [selectedProvince, layers, reports, hasClearance, reportingModeActive, clickedCoords]);

  // Load and sync reports on mount

  // Load and sync reports on mount
  useEffect(() => {
    const syncReports = () => {
      const saved = operationalStore.getItem('ecoclean_reports');
      if (saved) {
        setReports(JSON.parse(saved));
      }
    };
    syncReports();
    window.addEventListener('storage', syncReports);
    return () => window.removeEventListener('storage', syncReports);
  }, []);

  // Sync hierarchy with localStorage
  const saveHierarchy = (newHierarchy: GeoNode) => {
    setHierarchy(newHierarchy);
    operationalStore.setItem('ecoclean_gis_hierarchy', JSON.stringify(newHierarchy));
  };

  // Toggle tree node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Security authorization trigger
  const handleClearanceAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === '1234') {
      setHasClearance(true);
      setLayers(prev => ({ ...prev, staffLocations: true }));
      setClearanceError(false);
      setPasscodeInput('');
    } else {
      setClearanceError(true);
      setTimeout(() => setClearanceError(false), 2000);
    }
  };

  // Render a recursive tree node for future-proof smart city hierarchy
  const renderTree = (node: GeoNode, depth = 0) => {
    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedProvince === node.id || (node.type === 'province' && selectedProvince === node.id);

    return (
      <div key={node.id} className="select-none font-sans" id={`node-${node.id}`}>
        <div 
          className={`flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors text-xs font-medium cursor-pointer ${
            isSelected ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-100/60' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
          onClick={() => {
            if (node.type === 'province') {
              setSelectedProvince(node.id === selectedProvince ? null : node.id);
            }
            if (hasChildren) toggleNode(node.id);
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            ) : (
              <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </span>
            )}
            
            <span className="truncate">{node.name}</span>
            <span className="text-[9px] font-mono font-bold text-gray-400 bg-gray-50 border px-1.5 py-0.2 rounded uppercase shrink-0 scale-90">
              {node.type}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setParentNodeId(node.id);
              // Auto-determine next logical subtype in Country -> Province -> District -> Municipality -> Ward -> Zone
              const childTypes: Record<string, 'province' | 'district' | 'municipality' | 'ward' | 'zone'> = {
                country: 'province',
                province: 'district',
                district: 'municipality',
                municipality: 'ward',
                ward: 'zone',
                zone: 'zone'
              };
              setNewNodeType(childTypes[node.type] || 'zone');
              setIsAddingNode(true);
            }}
            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
            title={`Add child to ${node.name}`}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5 border-l border-gray-100 ml-3">
            {node.children?.map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Handle direct map report submission
  const handleMapReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickedCoords || !reportTitle.trim()) return;

    // Simulate coordinates within SL grid based on SVG X/Y offsets
    const lat = clickedCoords.lat || parseFloat((8.4844 + (clickedCoords.y - 235) * -0.012).toFixed(4));
    const lng = clickedCoords.lng || parseFloat((-13.2344 + (clickedCoords.x - 45) * 0.008).toFixed(4));

    const newReportId = `R-SL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: Report = {
      id: newReportId,
      referenceNumber: `EC-${Math.floor(100000 + Math.random() * 900000)}`,
      title: reportTitle,
      category: reportCategory,
      description: `Logged directly via GIS Smart Map interface at coordinates Latitude: ${lat}, Longitude: ${lng}.`,
      location: `GIS GPS Coordinates: ${lat}, ${lng}`,
      district: 'Western Area Urban',
      municipality: 'Freetown City Council (FCC)',
      ward: 'Ward 301 (Aberdeen)',
      zone: 'Zone 1 (Kroo Bay Drainage)',
      priority: reportPriority,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      photos: ['/assets/demo-waste.svg'],
      gps: { lat, lng }
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    operationalStore.setItem('ecoclean_reports', JSON.stringify(updatedReports));

    // Clear and show success
    setReportTitle('');
    setReportSuccessMsg(true);
    setTimeout(() => {
      setReportSuccessMsg(false);
      setClickedCoords(null);
      setReportingModeActive(false);
    }, 2500);

    // Plot a dynamic temporary telemetry detail
    setFocusedTelemetry({
      id: newReportId,
      name: reportTitle,
      type: 'Citizen Report',
      details: {
        Category: reportCategory,
        Priority: reportPriority,
        Status: 'Logged (Pending Intake)',
        GPS: `${lat}°N, ${lng}°W`,
        Date: newReport.date
      }
    });
  };

  // Add child node in future expansion explorer
  const handleAddHierarchyNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim() || !parentNodeId) return;

    const findAndAdd = (node: GeoNode): boolean => {
      if (node.id === parentNodeId) {
        if (!node.children) node.children = [];
        node.children.push({
          id: `SL-${newNodeType.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newNodeName,
          type: newNodeType,
          children: []
        });
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findAndAdd(child)) return true;
        }
      }
      return false;
    };

    const newHierarchy = { ...hierarchy };
    findAndAdd(newHierarchy);
    saveHierarchy(newHierarchy);

    setNewNodeName('');
    setIsAddingNode(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Smart GIS Header Banner */}
      <div className="bg-slate-900 border border-slate-950 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Secretariat Command Hub
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">National GIS & Smart Mapping Platform</h2>
          <p className="text-xs text-slate-400">
            Advanced spatial analytics, collection route optimization, and direct map reporting for Sierra Leone.
          </p>
        </div>

        <button 
          onClick={() => {
            saveHierarchy(INITIAL_SIERRA_LEONE_HIERARCHY);
            operationalStore.removeItem('ecoclean_reports');
            setReports([]);
            setFocusedTelemetry(null);
            setHasClearance(false);
          }}
          className="text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset GIS Cache</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Hierarchy Explorer & Node Creator */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex flex-col min-h-[400px]">
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Smart Expansion Hierarchy</span>
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                Country ➔ Province ➔ District ➔ Municipality ➔ Ward ➔ Zone. Scalable without database updates.
              </p>
            </div>

            {/* Hierarchy Tree Explorer */}
            <div className="flex-1 overflow-y-auto space-y-1 max-h-[350px] pr-1">
              {renderTree(hierarchy)}
            </div>

            {/* Future Expansion Info Code Block */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Scalability Guarantee</span>
              </div>
              <p className="leading-normal">
                Any added subdivisions immediately register as active routing nodes in dispatch logic.
              </p>
            </div>
          </div>

          {/* Map Controls & Layer Toggles */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings2 className="w-4 h-4 text-emerald-600" />
              <span>Map Overlay Layers</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { key: 'hotspots', label: 'Waste Hotspots', color: 'bg-red-500' },
                { key: 'collectionZones', label: 'Collection Zones', color: 'bg-teal-500' },
                { key: 'municipalityBounds', label: 'Municipal Bounds', color: 'bg-sky-500' },
                { key: 'districtBounds', label: 'District Boundaries', color: 'bg-orange-500' },
                { key: 'collectionRoutes', label: 'Dispatches & Routes', color: 'bg-blue-600' },
                { key: 'riskAreas', label: 'Environmental Risks', color: 'bg-purple-600' },
                { key: 'heatmap', label: 'Thermal Heap Map', color: 'bg-amber-500' },
                { key: 'analytics', label: 'Floating Metrics', color: 'bg-indigo-600' }
              ].map(layer => (
                <button
                  key={layer.key}
                  onClick={() => setLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key] }))}
                  className="w-full flex items-center justify-between text-xs font-bold py-1 px-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />
                    <span>{layer.label}</span>
                  </span>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${layers[layer.key as keyof typeof layers] ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${layers[layer.key as keyof typeof layers] ? 'translate-x-4' : ''}`} />
                  </div>
                </button>
              ))}

              {/* Staff Telemetry - Guarded Layer */}
              <div className="border-t border-gray-100 pt-2.5 mt-1">
                <div className="flex items-center justify-between text-xs font-bold py-1 px-1.5 text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Field Staff GPS</span>
                  </span>
                  
                  {hasClearance ? (
                    <button
                      onClick={() => setLayers(prev => ({ ...prev, staffLocations: !prev.staffLocations }))}
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors ${layers.staffLocations ? 'bg-emerald-500' : 'bg-gray-200'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${layers.staffLocations ? 'translate-x-4' : ''}`} />
                    </button>
                  ) : (
                    <span className="text-[9px] font-mono font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  )}
                </div>

                {!hasClearance && (
                  <form onSubmit={handleClearanceAuth} className="mt-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-2">
                    <div className="text-[10px] text-gray-500 font-medium">
                      Requires supervisor security clearance.
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="password"
                        placeholder="Enter Pin (1234)"
                        value={passcodeInput}
                        onChange={(e) => setPasscodeInput(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 focus:border-emerald-500 rounded-lg py-1 px-2 text-xs font-mono focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Unlock
                      </button>
                    </div>
                    {clearanceError && (
                      <span className="text-[9px] text-red-500 font-bold block">Invalid Supervisor Code!</span>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Interactive GIS Vector Map & Inspector */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-950 rounded-3xl overflow-hidden shadow-xl flex flex-col min-h-[500px] relative">
            
            {/* Top Interactive Banner Inside Map Frame */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pointer-events-none">
              <div className="bg-slate-950/85 border border-slate-800 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] text-slate-300 font-mono flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-400">VECTOR GRID CONTEXT:</span>
                <span>Freetown Center (8.484°N, 13.234°W)</span>
              </div>

              <div className="flex items-center gap-2 self-end pointer-events-auto">
                <button
                  onClick={() => {
                    setReportingModeActive(!reportingModeActive);
                    setClickedCoords(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border cursor-pointer ${
                    reportingModeActive 
                      ? 'bg-red-500 text-white border-red-400' 
                      : 'bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-600'
                  }`}
                >
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  <span>{reportingModeActive ? 'Exit Reporting' : 'Report Waste on Map'}</span>
                </button>
              </div>
            </div>

            {/* Instruction Banner if Reporting Mode is active */}
            {reportingModeActive && !clickedCoords && (
              <div className="absolute top-18 left-1/2 -translate-x-1/2 bg-amber-500/90 border border-amber-400 backdrop-blur-sm text-slate-950 px-4 py-2 rounded-full text-xs font-bold font-mono text-center shadow-lg animate-bounce z-10">
                🎯 Click anywhere on the map grid below to target waste pile coordinates
              </div>
            )}

            {/* VECTOR MAP LEAFLET CANVAS */}
            <div className="flex-1 relative bg-slate-950 flex flex-col min-h-[440px] z-0">
              <div ref={mapContainerRef} className="w-full h-full flex-1" style={{ minHeight: '440px' }} />
            </div>

            {/* 12. FLOATING REAL-TIME ANALYTICS OVERLAYS (Toggleable) */}
            {layers.analytics && (
              <div className="absolute bottom-16 right-4 left-4 sm:left-auto sm:w-80 bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 text-white space-y-3 shadow-2xl z-10">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COMMAND METRICS OVERLAY</span>
                  </span>
                  <button 
                    onClick={() => setLayers(prev => ({ ...prev, analytics: false }))}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/65 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Live SLA Match</span>
                    <span className="text-sm font-extrabold text-emerald-400">94.2%</span>
                  </div>
                  <div className="bg-slate-900/65 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Active Hotspots</span>
                    <span className="text-sm font-extrabold text-red-400">{STATIC_HOTSPOTS.length + reports.filter(r=>r.status==='Pending').length}</span>
                  </div>
                  <div className="bg-slate-900/65 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Active Dispatches</span>
                    <span className="text-sm font-extrabold text-sky-400">3 Crews</span>
                  </div>
                  <div className="bg-slate-900/65 border border-slate-800/80 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Sovereign State</span>
                    <span className="text-sm font-extrabold text-white">Sierra Leone</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom GIS Legend & Summary */}
            <div className="bg-slate-950 border-t border-slate-800/80 px-6 py-3.5 text-[10px] text-slate-400 font-mono flex flex-wrap justify-between items-center gap-4 z-10">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Hotspots</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Sanitary Zones</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Municipal Bounds</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Live Trucks</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Hazards</span>
              </div>
              <div>
                <span>Displaying {STATIC_HOTSPOTS.length + reports.length} Spatial Telemetry Nodes</span>
              </div>
            </div>
          </div>

          {/* Double Grid for Direct map report and focused telemetry details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Direct Map Reporting intake form */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                <span>Geotagged Incident Intake</span>
              </h3>

              {reportingModeActive ? (
                clickedCoords ? (
                  <form onSubmit={handleMapReportSubmit} className="space-y-4">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl font-mono text-xs text-gray-600 space-y-1">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Grid Offsets Locked</div>
                      <div>Latitude: {clickedCoords.lat?.toFixed(5) || clickedCoords.x}</div>
                      <div>Longitude: {clickedCoords.lng?.toFixed(5) || clickedCoords.y}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Estimated Coordinates Validated ➔ 8.484°N, -13.234°W</div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">Incident Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Overflowing Central Dumpster"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-gray-800 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Category</label>
                        <select
                          value={reportCategory}
                          onChange={(e) => setReportCategory(e.target.value)}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-700 font-semibold cursor-pointer"
                        >
                          <option>Illegal Dumping</option>
                          <option>Overflowing Waste Bin</option>
                          <option>Hazardous Accumulation</option>
                          <option>Toxic Leakage</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Response Priority</label>
                        <select
                          value={reportPriority}
                          onChange={(e) => setReportPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-700 font-semibold cursor-pointer"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setClickedCoords(null)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Re-target Coordinate
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md shadow-emerald-600/10 transition-colors cursor-pointer"
                      >
                        Submit Geotagged Report
                      </button>
                    </div>

                    {reportSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-fade-in">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Incident logged in Secretariat database! 50 Eco-Points distributed.</span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-8 text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl">
                    <MapPin className="w-8 h-8 mx-auto text-emerald-500/40 animate-bounce" />
                    <div className="text-xs font-bold text-gray-700">Awaiting Coordinate Lock</div>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Please click on any quadrant or province of the vector GIS grid above to lock the incident telemetry offsets.
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <Compass className="w-8 h-8 mx-auto text-gray-400/65" />
                  <div className="text-xs font-bold text-gray-600">Reporting Mode Inactive</div>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Toggle the "Report Waste on Map" button in the map header to lock new real-time incidents directly onto the GIS canvas.
                  </p>
                </div>
              )}
            </div>

            {/* Focused Telemetry Detailed Panel */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Real-Time Node Telemetry</span>
                </h3>

                {focusedTelemetry ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                          {focusedTelemetry.type}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 mt-1.5">{focusedTelemetry.name}</h4>
                      </div>
                      <span className="font-mono text-[9px] text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded shrink-0">
                        {focusedTelemetry.id}
                      </span>
                    </div>

                    <div className="bg-gray-50 border border-gray-100/80 rounded-xl p-3.5 space-y-2.5 font-mono text-[10px]">
                      {Object.entries(focusedTelemetry.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-0.5 border-b border-gray-100 last:border-b-0 last:pb-0">
                          <span className="text-gray-400 font-bold uppercase">{key}:</span>
                          <span className="text-gray-800 font-extrabold text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Info className="w-8 h-8 mx-auto text-gray-400/65" />
                    <div className="text-xs font-bold text-gray-600">No Telemetry Focused</div>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Select any active waste hotspot, hazard ellipse, or dispatch vehicle on the map to streams live metric details.
                    </p>
                  </div>
                )}
              </div>

              {focusedTelemetry && (
                <button
                  onClick={() => setFocusedTelemetry(null)}
                  className="w-full text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-2 rounded-xl transition-colors cursor-pointer mt-4"
                >
                  Clear Inspection Telemetry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slideover / Modal for Adding Node to the Hierarchy Tree */}
      <AnimatePresence>
        {isAddingNode && parentNodeId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full border border-gray-200 p-6 space-y-4 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddingNode(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="bg-emerald-50 text-emerald-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  Hierarchy Builder Nodes
                </span>
                <h3 className="text-base font-extrabold text-gray-900 mt-1">Insert Administrative Subdivision</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Add dynamic subdivisions under parent node ID: <span className="font-mono font-bold text-emerald-700">{parentNodeId}</span>
                </p>
              </div>

              <form onSubmit={handleAddHierarchyNode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Subdivision Type</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-700 font-bold cursor-pointer"
                  >
                    <option value="province">Province/Region</option>
                    <option value="district">District</option>
                    <option value="municipality">Municipality/Council</option>
                    <option value="ward">Constituency/Ward</option>
                    <option value="zone">Zone/Quarter</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Subdivision Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ward 403 or Zone 4 (Aberdeen Extension)"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs font-semibold text-gray-800 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNode(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/10 transition-colors cursor-pointer"
                  >
                    Insert Node Unit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
