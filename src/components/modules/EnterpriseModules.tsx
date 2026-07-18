import React, { useState, useEffect } from 'react';
import { operationalStore } from '../../lib/operationalStore';
import { 
  Truck, ShieldAlert, Users, Award, Calendar, Layers, MapPin, 
  Trash2, Battery, AlertTriangle, Radio, Settings, HelpCircle, FileText, 
  Terminal, Search, Plus, Filter, RefreshCw, Send, CheckCircle, Clock, 
  Building, Map, DollarSign, Briefcase, Eye, Key, ShieldCheck, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiKeyService } from '../../lib/services';

// ==========================================
// TYPES AND INTERFACES FOR STATE
// ==========================================

export interface FleetVehicle {
  id: string;
  plate: string;
  type: 'Compactor Truck' | 'Hook Loader' | 'Coastal Vessel' | 'Tricycle' | 'Utility Van';
  driver: string;
  fuel: number; // percentage
  status: 'Active' | 'Maintenance' | 'Standby' | 'Offline';
  health: 'Healthy' | 'Service Due' | 'Critical';
  municipality: string;
  lastRoute: string;
}

export interface SmartBin {
  id: string;
  location: string;
  capacity: number; // percentage
  status: 'Empty' | 'Half Full' | 'Full' | 'Overflowing';
  battery: number; // percentage
  lastCollected: string;
  ward: string;
}

export interface DisasterIncident {
  id: string;
  type: 'Flooding' | 'Landslide' | 'Tidal Surge' | 'Chemical Spill' | 'Illegal Industrial Dump';
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Reported' | 'First Responders Active' | 'Resolved' | 'Contained';
  reportedAt: string;
  responders: string[];
}

export interface CleanupEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  volunteersCount: number;
  maxVolunteers: number;
  pointsReward: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  registered: boolean;
}

export interface AssetRecord {
  id: string;
  name: string;
  category: 'Heavy Equipment' | 'PPE' | 'Tools' | 'Electronics' | 'Office Supply';
  purchaseDate: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  assignedTo: string;
  value: number;
}

export interface Contractor {
  id: string;
  name: string;
  service: string;
  coverage: string;
  slaTarget: number; // e.g. 95%
  slaActual: number; // e.g. 97.2%
  status: 'Active' | 'Under Review' | 'Suspended';
  budget: number;
}

export interface DocumentHub {
  id: string;
  title: string;
  category: 'Legislation' | 'Manual' | 'Training' | 'Safety' | 'Report';
  author: string;
  publishedDate: string;
  fileSize: string;
}

// ==========================================
// DEFAULT SEED DATA
// ==========================================

const DEFAULT_FLEET: FleetVehicle[] = [
  { id: 'FV-401', plate: 'SL-FCC-012', type: 'Compactor Truck', driver: 'Alpha Sesay', fuel: 82, status: 'Active', health: 'Healthy', municipality: 'Freetown City Council (FCC)', lastRoute: 'Lumley Bypass - Kroo Town' },
  { id: 'FV-402', plate: 'SL-FCC-015', type: 'Hook Loader', driver: 'Mohamed Kamara', fuel: 45, status: 'Active', health: 'Healthy', municipality: 'Freetown City Council (FCC)', lastRoute: 'Cotton Tree - Kingtom Dumpsite' },
  { id: 'FV-403', plate: 'SL-BCC-044', type: 'Compactor Truck', driver: 'Ibrahim Mansaray', fuel: 95, status: 'Standby', health: 'Healthy', municipality: 'Bo City Council (BCC)', lastRoute: 'Bo Central Market' },
  { id: 'FV-404', plate: 'SL-KCC-091', type: 'Coastal Vessel', driver: 'Sahr Gando', fuel: 68, status: 'Active', health: 'Service Due', municipality: 'Freetown City Council (FCC)', lastRoute: 'Aberdeen - Murray Town Coast' },
  { id: 'FV-405', plate: 'SL-MCC-003', type: 'Tricycle', driver: 'Kadiatu Bangura', fuel: 20, status: 'Maintenance', health: 'Critical', municipality: 'Makeni City Council (MCC)', lastRoute: 'Makeni Highway Ward' },
  { id: 'FV-406', plate: 'SL-KCC-102', type: 'Utility Van', driver: 'David Koroma', fuel: 72, status: 'Offline', health: 'Healthy', municipality: 'Kenema City Council (KCC)', lastRoute: 'Kenema East Sector' }
];

const DEFAULT_SMART_BINS: SmartBin[] = [
  { id: 'SB-001', location: 'Kroo Town Road Market', capacity: 92, status: 'Overflowing', battery: 84, lastCollected: '2026-07-15 08:30', ward: 'Ward 301' },
  { id: 'SB-002', location: 'Cotton Tree Junction', capacity: 48, status: 'Half Full', battery: 95, lastCollected: '2026-07-16 06:15', ward: 'Ward 302' },
  { id: 'SB-003', location: 'Aberdeen Beach Walkway', capacity: 85, status: 'Full', battery: 72, lastCollected: '2026-07-15 18:45', ward: 'Ward 305' },
  { id: 'SB-004', location: 'Bo Central Market Square', capacity: 12, status: 'Empty', battery: 91, lastCollected: '2026-07-16 10:00', ward: 'Bo Ward 1' },
  { id: 'SB-005', location: 'Makeni Plaza Entrance', capacity: 62, status: 'Half Full', battery: 18, lastCollected: '2026-07-14 14:20', ward: 'Makeni Ward 4' },
  { id: 'SB-006', location: 'Kenema Highway Terminal', capacity: 96, status: 'Overflowing', battery: 89, lastCollected: '2026-07-15 12:10', ward: 'Kenema Ward 2' }
];

const DEFAULT_DISASTER_INCIDENTS: DisasterIncident[] = [
  { id: 'DI-101', type: 'Flooding', location: 'Kroo Bay Slum Sector A', severity: 'Critical', status: 'First Responders Active', reportedAt: '2026-07-16 11:32', responders: ['FCC Emergency Response Unit', 'Red Cross SL'] },
  { id: 'DI-102', type: 'Landslide', location: 'Regent Mountain Pass', severity: 'High', status: 'Reported', reportedAt: '2026-07-16 12:05', responders: ['National Security Office (ONS)'] },
  { id: 'DI-103', type: 'Tidal Surge', location: 'Hamilton Fishing Beach Wharf', severity: 'Medium', status: 'Contained', reportedAt: '2026-07-15 16:40', responders: ['Maritime Safety Division'] },
  { id: 'DI-104', type: 'Illegal Industrial Dump', location: 'Cline Town Industrial Estate', severity: 'High', status: 'Resolved', reportedAt: '2026-07-14 09:15', responders: ['EPA Sierra Leone Inspectors'] }
];

const DEFAULT_CLEANUP_EVENTS: CleanupEvent[] = [
  { id: 'EV-501', title: 'Aberdeen Beach Tidal Cleanup', date: '2026-07-20', location: 'Aberdeen Beach, Freetown', volunteersCount: 142, maxVolunteers: 200, pointsReward: 150, status: 'Upcoming', registered: false },
  { id: 'EV-502', title: 'Kroo Town Drainage Clearing', date: '2026-07-17', location: 'Kroo Town Road, Freetown', volunteersCount: 88, maxVolunteers: 100, pointsReward: 200, status: 'Upcoming', registered: true },
  { id: 'EV-503', title: 'Bo School Green Tree Drive', date: '2026-07-15', location: 'Bo School Campus Ground', volunteersCount: 50, maxVolunteers: 50, pointsReward: 100, status: 'Completed', registered: false },
  { id: 'EV-504', title: 'Makeni Plaza Recyclathon', date: '2026-07-16', location: 'Central Clock Tower Plaza', volunteersCount: 120, maxVolunteers: 150, pointsReward: 120, status: 'Active', registered: false }
];

const DEFAULT_ASSETS: AssetRecord[] = [
  { id: 'AS-801', name: 'Scania Compactor Vessel V1', category: 'Heavy Equipment', purchaseDate: '2024-05-12', condition: 'Excellent', assignedTo: 'Freetown Coastal Fleet', value: 85000 },
  { id: 'AS-802', name: 'Rugged GPS Tracking Receiver G-12', category: 'Electronics', purchaseDate: '2025-02-18', condition: 'Good', assignedTo: 'Bo Crew Supervisor', value: 450 },
  { id: 'AS-803', name: 'Steel Protective Boots & Hazmat Pack', category: 'PPE', purchaseDate: '2025-11-05', condition: 'Fair', assignedTo: 'Makeni Waste Crew 3', value: 180 },
  { id: 'AS-804', name: 'Aluminium Heavy Street Sweep Rakes', category: 'Tools', purchaseDate: '2026-01-10', condition: 'Excellent', assignedTo: 'Kenema Sanitation Division', value: 75 }
];

const DEFAULT_CONTRACTORS: Contractor[] = [
  { id: 'CO-201', name: 'Masada Waste Management', service: 'Sovereign Solid Waste Collection', coverage: 'Western Area Urban (Freetown)', slaTarget: 95, slaActual: 97.4, status: 'Active', budget: 120000 },
  { id: 'CO-202', name: 'Salone Eco-Contractors Ltd', service: 'Plastic Recycling Processing', coverage: 'Bo & Kenema Districts', slaTarget: 92, slaActual: 89.5, status: 'Under Review', budget: 45000 },
  { id: 'CO-203', name: 'West Africa Coastal Salvage', service: 'Coastal & Ocean Debris Removal', coverage: 'Sierra Leone Peninsula', slaTarget: 90, slaActual: 94.8, status: 'Active', budget: 75000 }
];

const DEFAULT_DOCUMENTS: DocumentHub[] = [
  { id: 'DOC-01', title: 'National Environmental Protection Act 2022', category: 'Legislation', author: 'EPA Sierra Leone', publishedDate: '2022-10-15', fileSize: '4.2 MB' },
  { id: 'DOC-02', title: 'Standard Operating Manual: Coastal Waste Handling', category: 'Manual', author: 'Ministry of Environment', publishedDate: '2024-03-01', fileSize: '1.8 MB' },
  { id: 'DOC-03', title: 'Public Health Sanitation Guidelines: Municipalities', category: 'Manual', author: 'Ministry of Health & Sanitation', publishedDate: '2023-07-20', fileSize: '2.5 MB' },
  { id: 'DOC-04', title: 'Community Volunteer Training & Safety Pack', category: 'Training', author: 'ECOCLEAN SL Education', publishedDate: '2025-11-12', fileSize: '850 KB' }
];

// ==========================================
// SHARED UTILS / HELPERS
// ==========================================

export function useEnterpriseData() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [smartBins, setSmartBins] = useState<SmartBin[]>([]);
  const [disasterIncidents, setDisasterIncidents] = useState<DisasterIncident[]>([]);
  const [cleanupEvents, setCleanupEvents] = useState<CleanupEvent[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [documents, setDocuments] = useState<DocumentHub[]>([]);

  useEffect(() => {
    // Fleet
    const cachedFleet = operationalStore.getItem('eco_fleet');
    if (cachedFleet) setFleet(JSON.parse(cachedFleet));
    else { setFleet(DEFAULT_FLEET); operationalStore.setItem('eco_fleet', JSON.stringify(DEFAULT_FLEET)); }

    // Smart Bins
    const cachedBins = operationalStore.getItem('eco_bins');
    if (cachedBins) setSmartBins(JSON.parse(cachedBins));
    else { setSmartBins(DEFAULT_SMART_BINS); operationalStore.setItem('eco_bins', JSON.stringify(DEFAULT_SMART_BINS)); }

    // Disaster
    const cachedDisaster = operationalStore.getItem('eco_disaster');
    if (cachedDisaster) setDisasterIncidents(JSON.parse(cachedDisaster));
    else { setDisasterIncidents(DEFAULT_DISASTER_INCIDENTS); operationalStore.setItem('eco_disaster', JSON.stringify(DEFAULT_DISASTER_INCIDENTS)); }

    // Cleanup Events
    const cachedEvents = operationalStore.getItem('eco_events');
    if (cachedEvents) setCleanupEvents(JSON.parse(cachedEvents));
    else { setCleanupEvents(DEFAULT_CLEANUP_EVENTS); operationalStore.setItem('eco_events', JSON.stringify(DEFAULT_CLEANUP_EVENTS)); }

    // Assets
    const cachedAssets = operationalStore.getItem('eco_assets');
    if (cachedAssets) setAssets(JSON.parse(cachedAssets));
    else { setAssets(DEFAULT_ASSETS); operationalStore.setItem('eco_assets', JSON.stringify(DEFAULT_ASSETS)); }

    // Contractors
    const cachedContractors = operationalStore.getItem('eco_contractors');
    if (cachedContractors) setContractors(JSON.parse(cachedContractors));
    else { setContractors(DEFAULT_CONTRACTORS); operationalStore.setItem('eco_contractors', JSON.stringify(DEFAULT_CONTRACTORS)); }

    // Documents
    const cachedDocs = operationalStore.getItem('eco_docs');
    if (cachedDocs) setDocuments(JSON.parse(cachedDocs));
    else { setDocuments(DEFAULT_DOCUMENTS); operationalStore.setItem('eco_docs', JSON.stringify(DEFAULT_DOCUMENTS)); }
  }, []);

  const updateFleet = (newFleet: FleetVehicle[]) => {
    setFleet(newFleet);
    operationalStore.setItem('eco_fleet', JSON.stringify(newFleet));
  };

  const updateSmartBins = (newBins: SmartBin[]) => {
    setSmartBins(newBins);
    operationalStore.setItem('eco_bins', JSON.stringify(newBins));
  };

  const updateDisaster = (newDis: DisasterIncident[]) => {
    setDisasterIncidents(newDis);
    operationalStore.setItem('eco_disaster', JSON.stringify(newDis));
  };

  const updateCleanupEvents = (newEv: CleanupEvent[]) => {
    setCleanupEvents(newEv);
    operationalStore.setItem('eco_events', JSON.stringify(newEv));
  };

  const updateAssets = (newAssets: AssetRecord[]) => {
    setAssets(newAssets);
    operationalStore.setItem('eco_assets', JSON.stringify(newAssets));
  };

  const updateContractors = (newConts: Contractor[]) => {
    setContractors(newConts);
    operationalStore.setItem('eco_contractors', JSON.stringify(newConts));
  };

  const updateDocuments = (newDocs: DocumentHub[]) => {
    setDocuments(newDocs);
    operationalStore.setItem('eco_docs', JSON.stringify(newDocs));
  };

  return {
    fleet, updateFleet,
    smartBins, updateSmartBins,
    disasterIncidents, updateDisaster,
    cleanupEvents, updateCleanupEvents,
    assets, updateAssets,
    contractors, updateContractors,
    documents, updateDocuments
  };
}

// ==========================================
// MODULE 1: FLEET MANAGEMENT
// ==========================================

export function FleetManagementView() {
  const { fleet, updateFleet } = useEnterpriseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New vehicle form states
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState<FleetVehicle['type']>('Compactor Truck');
  const [newDriver, setNewDriver] = useState('');
  const [newMunicipality, setNewMunicipality] = useState('Freetown City Council (FCC)');

  const stats = {
    total: fleet.length,
    active: fleet.filter(v => v.status === 'Active').length,
    maintenance: fleet.filter(v => v.status === 'Maintenance').length,
    fuelAvg: Math.round(fleet.reduce((acc, v) => acc + v.fuel, 0) / (fleet.length || 1)),
    healthy: fleet.filter(v => v.health === 'Healthy').length
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newDriver) return;

    const newVehicle: FleetVehicle = {
      id: `FV-${Math.floor(400 + Math.random() * 99)}`,
      plate: newPlate,
      type: newType,
      driver: newDriver,
      fuel: 100,
      status: 'Standby',
      health: 'Healthy',
      municipality: newMunicipality,
      lastRoute: 'Not Assigned yet'
    };

    updateFleet([newVehicle, ...fleet]);
    setShowAddModal(false);
    setNewPlate('');
    setNewDriver('');
  };

  const toggleStatus = (id: string) => {
    const statuses: FleetVehicle['status'][] = ['Active', 'Standby', 'Maintenance', 'Offline'];
    const updated = fleet.map(v => {
      if (v.id === id) {
        const nextIdx = (statuses.indexOf(v.status) + 1) % statuses.length;
        return { ...v, status: statuses[nextIdx] };
      }
      return v;
    });
    updateFleet(updated);
  };

  const triggerMaintenance = (id: string) => {
    const updated = fleet.map(v => {
      if (v.id === id) {
        return { 
          ...v, 
          status: v.status === 'Maintenance' ? 'Standby' as const : 'Maintenance' as const,
          health: v.status === 'Maintenance' ? 'Healthy' as const : 'Service Due' as const
        };
      }
      return v;
    });
    updateFleet(updated);
  };

  const filteredFleet = fleet.filter(v => {
    const matchesSearch = v.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-primary" />
            National Fleet & Vessel Supervisor
          </h2>
          <p className="text-xs text-gray-500">Track heavy compactors, tricycles, and marine cleanup vessels across municipalities.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Fleet Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Total Vessels/Trucks</p>
          <p className="text-2xl font-black text-brand-primary mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Active En Route</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">In Maintenance</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{stats.maintenance}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Average Fuel Reserve</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats.fuelAvg}%</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Health Score</p>
          <p className="text-2xl font-black text-teal-600 mt-1">{Math.round((stats.healthy/stats.total) * 100)}%</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search driver, plate, type..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {['All', 'Active', 'Standby', 'Maintenance', 'Offline'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === st ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-primary'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFleet.map(vehicle => (
            <motion.div 
              key={vehicle.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-brand-accent/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
                      <Truck className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{vehicle.plate}</h4>
                      <p className="text-[10px] font-mono text-gray-400">{vehicle.id} &bull; {vehicle.type}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    vehicle.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    vehicle.status === 'Maintenance' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    vehicle.status === 'Standby' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-medium">Duty Driver</span>
                    <span className="text-xs font-bold text-gray-700">{vehicle.driver}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-medium">Jurisdiction</span>
                    <span className="text-[10px] font-bold text-gray-600 truncate block">{vehicle.municipality.split(' (')[0]}</span>
                  </div>
                </div>

                {/* Fuel gauge & Health indicator */}
                <div className="space-y-2 mt-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500 font-medium">Fuel Level</span>
                    <span className="font-mono font-bold text-gray-700">{vehicle.fuel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        vehicle.fuel > 50 ? 'bg-emerald-500' : vehicle.fuel > 20 ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                      }`}
                      style={{ width: `${vehicle.fuel}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-gray-200/50">
                    <span className="text-gray-500 font-medium">System Health</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      vehicle.health === 'Healthy' ? 'text-emerald-600' :
                      vehicle.health === 'Service Due' ? 'text-amber-500' : 'text-red-500 animate-pulse'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        vehicle.health === 'Healthy' ? 'bg-emerald-500' :
                        vehicle.health === 'Service Due' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {vehicle.health}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex gap-2 mt-5 pt-3 border-t border-gray-100 justify-end">
                <button
                  onClick={() => toggleStatus(vehicle.id)}
                  className="text-[10px] font-bold text-gray-600 hover:text-brand-primary bg-gray-50 hover:bg-emerald-50/40 border border-gray-200 rounded-lg px-2 py-1.5 transition-all cursor-pointer"
                >
                  Cycle Status
                </button>
                <button
                  onClick={() => triggerMaintenance(vehicle.id)}
                  className={`text-[10px] font-bold border rounded-lg px-2 py-1.5 transition-all cursor-pointer ${
                    vehicle.status === 'Maintenance' 
                      ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                      : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-600'
                  }`}
                >
                  {vehicle.status === 'Maintenance' ? 'Complete Repair' : 'Send to Shop'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 w-full max-w-md relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-primary" /> Register New Vessel/Truck
            </h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Plate Number / Vessel Serial</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SL-FCC-028" 
                  value={newPlate}
                  onChange={e => setNewPlate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Vehicle/Vessel Class</label>
                <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value as FleetVehicle['type'])}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="Compactor Truck">Compactor Truck</option>
                  <option value="Hook Loader">Hook Loader</option>
                  <option value="Coastal Vessel">Coastal Vessel</option>
                  <option value="Tricycle">Tricycle</option>
                  <option value="Utility Van">Utility Van</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Assigned Driver Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Samuel Kargbo" 
                  value={newDriver}
                  onChange={e => setNewDriver(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Target Municipal Council</label>
                <select 
                  value={newMunicipality}
                  onChange={e => setNewMunicipality(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="Freetown City Council (FCC)">Freetown City Council (FCC)</option>
                  <option value="Bo City Council (BCC)">Bo City Council (BCC)</option>
                  <option value="Kenema City Council (KCC)">Kenema City Council (KCC)</option>
                  <option value="Makeni City Council (MCC)">Makeni City Council (MCC)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Save Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 2: SMART BIN MANAGEMENT
// ==========================================

export function SmartBinView() {
  const { smartBins, updateSmartBins } = useEnterpriseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCap, setFilterCap] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newLocation, setNewLocation] = useState('');
  const [newWard, setNewWard] = useState('Ward 301');

  const handleAddBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation) return;

    const newBin: SmartBin = {
      id: `SB-${Math.floor(100 + Math.random() * 899)}`,
      location: newLocation,
      capacity: 0,
      status: 'Empty',
      battery: 100,
      lastCollected: 'Never Registered',
      ward: newWard
    };

    updateSmartBins([newBin, ...smartBins]);
    setShowAddModal(false);
    setNewLocation('');
  };

  const dispatchCollection = (id: string) => {
    const updated = smartBins.map(bin => {
      if (bin.id === id) {
        return {
          ...bin,
          capacity: 0,
          status: 'Empty' as const,
          lastCollected: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return bin;
    });
    updateSmartBins(updated);
    alert(`Smart Bin ${id} collection request dispatched. Cleared to 0% capacity.`);
  };

  const pingTelemetry = (id: string) => {
    alert(`Sending diagnostic sonar pulse to IoT Sensor ${id}... Echo successful! Sensor response: 200 OK. Battery, volume levels synchronized.`);
  };

  const stats = {
    total: smartBins.length,
    overflowing: smartBins.filter(b => b.status === 'Overflowing').length,
    full: smartBins.filter(b => b.status === 'Full').length,
    avgBattery: Math.round(smartBins.reduce((acc, b) => acc + b.battery, 0) / (smartBins.length || 1))
  };

  const filteredBins = smartBins.filter(b => {
    const matchesSearch = b.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterCap === 'All') return matchesSearch;
    if (filterCap === 'Overflowing') return matchesSearch && b.status === 'Overflowing';
    if (filterCap === 'Critical') return matchesSearch && (b.status === 'Full' || b.status === 'Overflowing');
    return matchesSearch && b.status === 'Empty';
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-brand-primary" />
            Smart IoT Public Bin Network
          </h2>
          <p className="text-xs text-gray-500">Monitor real-time fill level telemetry, battery status, and locations of public waste bins.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Deploy IoT Bin
        </button>
      </div>

      {/* Bin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">IoT Bins Online</p>
          <p className="text-2xl font-black text-brand-primary mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Overflow Warning</p>
          <p className="text-2xl font-black text-red-500 mt-1">{stats.overflowing}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Near Full (80%+)</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{stats.full}</p>
        </div>
        <div className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Avg Node Battery</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.avgBattery}%</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search location or Bin ID..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {['All', 'Overflowing', 'Critical', 'Empty'].map(cap => (
            <button
              key={cap}
              onClick={() => setFilterCap(cap)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterCap === cap ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-primary'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBins.map(bin => (
            <motion.div 
              key={bin.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-brand-accent/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-primary flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{bin.id}</h4>
                      <p className="text-[10px] font-mono text-gray-400">{bin.ward}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    bin.status === 'Overflowing' ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' :
                    bin.status === 'Full' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    bin.status === 'Half Full' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {bin.status}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {bin.location}
                  </span>
                </div>

                {/* Level visualization */}
                <div className="mt-4 space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <div className="flex justify-between text-[10px] font-medium mb-1">
                      <span className="text-gray-500">Fill Capacity</span>
                      <span className="text-gray-700 font-bold">{bin.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          bin.capacity >= 90 ? 'bg-red-500' : bin.capacity >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.capacity}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-gray-200/60">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-gray-400" /> Sensor Battery
                    </span>
                    <span className={`font-bold ${bin.battery < 20 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>{bin.battery}%</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Collected
                    </span>
                    <span className="font-mono text-gray-600 font-bold">{bin.lastCollected}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5 pt-3 border-t border-gray-100 justify-end">
                <button
                  onClick={() => pingTelemetry(bin.id)}
                  className="text-[10px] font-bold text-gray-600 hover:text-brand-primary bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded-lg px-2 py-1.5 transition-all cursor-pointer"
                >
                  Ping IoT Telemetry
                </button>
                <button
                  disabled={bin.capacity === 0}
                  onClick={() => dispatchCollection(bin.id)}
                  className={`text-[10px] font-bold border rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                    bin.capacity === 0 
                      ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'bg-brand-primary hover:bg-brand-secondary border-brand-primary text-white shadow-sm'
                  }`}
                >
                  Empty Bin
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Deploy modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 w-full max-w-md relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-brand-primary" /> Deploy New Smart IoT Bin
            </h3>
            <form onSubmit={handleAddBin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Geographic Placement Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lumley Roundabout, Freetown" 
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Municipal Ward Section</label>
                <select 
                  value={newWard}
                  onChange={e => setNewWard(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="Ward 301">Ward 301 (Kroo Town)</option>
                  <option value="Ward 302 (Cotton Tree)">Ward 302 (Cotton Tree)</option>
                  <option value="Ward 305 (Aberdeen)">Ward 305 (Aberdeen)</option>
                  <option value="Bo Ward 1">Bo Ward 1</option>
                  <option value="Makeni Ward 4">Makeni Ward 4</option>
                  <option value="Kenema Ward 2">Kenema Ward 2</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Deploy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 3: DISASTER RESPONSE CENTER
// ==========================================

export function DisasterResponseView() {
  const { disasterIncidents, updateDisaster } = useEnterpriseData();
  const [showSOSModal, setShowSOSModal] = useState(false);
  
  // Emergency Form State
  const [emerType, setEmerType] = useState<DisasterIncident['type']>('Flooding');
  const [emerLoc, setEmerLoc] = useState('');
  const [emerSev, setEmerSev] = useState<DisasterIncident['severity']>('High');

  const triggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emerLoc) return;

    const newIncident: DisasterIncident = {
      id: `DI-${Math.floor(200 + Math.random() * 99)}`,
      type: emerType,
      location: emerLoc,
      severity: emerSev,
      status: 'Reported',
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      responders: ['National Emergency Center (HQ)']
    };

    updateDisaster([newIncident, ...disasterIncidents]);
    setShowSOSModal(false);
    setEmerLoc('');
    alert(`🚨 RED LEVEL EMERGENCY POSTED! Broadcast sent to standard GSM towers and first responder nodes. GPS dispatched.`);
  };

  const dispatchResponders = (id: string, responderName: string) => {
    const updated = disasterIncidents.map(inc => {
      if (inc.id === id) {
        const list = inc.responders.includes(responderName) ? inc.responders : [...inc.responders, responderName];
        return {
          ...inc,
          status: 'First Responders Active' as const,
          responders: list
        };
      }
      return inc;
    });
    updateDisaster(updated);
  };

  const markResolved = (id: string) => {
    const updated = disasterIncidents.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status: 'Resolved' as const
        };
      }
      return inc;
    });
    updateDisaster(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
            Disaster Response & Emergency Dispatch
          </h2>
          <p className="text-xs text-gray-500">Coordinated environmental emergency deck. Track floods, landslides, coastal anomalies, and hazardous spills.</p>
        </div>
        <button 
          onClick={() => setShowSOSModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
        >
          <AlertTriangle className="w-4.5 h-4.5" /> Broadcast National SOS Alert
        </button>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-150 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-500 uppercase">Critical Warnings</span>
            <p className="text-3xl font-black text-red-600 mt-1">{disasterIncidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length}</p>
          </div>
          <p className="text-[10px] text-red-500/80 mt-4 leading-none font-medium">Requires immediate military / municipal intervention.</p>
        </div>

        <div className="bg-amber-50 border border-amber-150 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Active Responders</span>
            <p className="text-3xl font-black text-amber-600 mt-1">
              {Array.from(new Set(disasterIncidents.flatMap(i => i.responders))).length} Groups
            </p>
          </div>
          <p className="text-[10px] text-amber-500/80 mt-4 leading-none font-medium">Mobilized EPA, Military, Red Cross, and local crew assets.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-150 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Incident Containment Rate</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {Math.round((disasterIncidents.filter(i => i.status === 'Resolved' || i.status === 'Contained').length / (disasterIncidents.length || 1)) * 100)}%
            </p>
          </div>
          <p className="text-[10px] text-emerald-500/80 mt-4 leading-none font-medium">Proving immediate hazard control compliance scores.</p>
        </div>
      </div>

      {/* Emergency Logs */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700 font-mono">Emergency Incident Control Feed</span>
          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-ping" /> SATELLITE COMMS LINK SECURE
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {disasterIncidents.map(inc => (
            <div key={inc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                    inc.severity === 'Critical' ? 'bg-red-600 text-white animate-pulse' :
                    inc.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {inc.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-gray-900">{inc.type} Incident</span>
                  <span className="text-[10px] text-gray-400 font-mono">{inc.id}</span>
                </div>

                <div className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {inc.location}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Clock className="w-3.5 h-3.5" /> Registered: {inc.reportedAt}
                </div>

                {inc.responders.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-gray-400 font-medium">On Ground:</span>
                    {inc.responders.map((resp, i) => (
                      <span key={i} className="text-[9px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-150">
                        {resp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inc.status !== 'Resolved' && (
                  <>
                    <button
                      onClick={() => dispatchResponders(inc.id, 'EPA Regional Strike Team')}
                      className="bg-gray-50 hover:bg-emerald-50/40 text-gray-700 hover:text-brand-primary border border-gray-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Deploy EPA Team
                    </button>
                    <button
                      onClick={() => dispatchResponders(inc.id, 'Sovereign Emergency Medicals')}
                      className="bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Deploy Medicals
                    </button>
                    <button
                      onClick={() => markResolved(inc.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Close SOS Case
                    </button>
                  </>
                )}
                {inc.status === 'Resolved' && (
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    <CheckCircle className="w-4.5 h-4.5" /> Closed & Restored
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 w-full max-w-md relative z-10">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-5 h-5" /> Broadcast Emergency Incident
            </h3>
            <form onSubmit={triggerSOS} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Emergency Category</label>
                <select 
                  value={emerType}
                  onChange={e => setEmerType(e.target.value as DisasterIncident['type'])}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="Flooding">Flooding & Coastal Backwash</option>
                  <option value="Landslide">Landslide & Slope Slippage</option>
                  <option value="Tidal Surge">Ocean Tidal Surge / Maritime Risk</option>
                  <option value="Chemical Spill">Chemical / Medical Waste Dump</option>
                  <option value="Illegal Industrial Dump">Illegal Industrial Dumping Area</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Precise Location Coordinate / Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kroo Bay Slum Sector B, coastal drainages" 
                  value={emerLoc}
                  onChange={e => setEmerLoc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Disaster Severity Level</label>
                <select 
                  value={emerSev}
                  onChange={e => setEmerSev(e.target.value as DisasterIncident['severity'])}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                >
                  <option value="Medium">Medium (Local Sector Impacted)</option>
                  <option value="High">High (Immediate Area Evacuation Potential)</option>
                  <option value="Critical">Critical (Severe Risk to Human Life & Habitat)</option>
                </select>
              </div>

              <div className="bg-red-50 border border-red-150 p-3.5 rounded-xl text-[11px] text-red-600 font-semibold leading-relaxed">
                ⚠️ NOTICE: Broadcasting this SOS triggers direct emergency notifications on all regional staff terminals and automatically records GPS coordinates onto the National Ops Map.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowSOSModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Authorize SOS Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 4: COMMUNITY ENGAGEMENT (VOLUNTEERS)
// ==========================================

export function CommunityEngagementView() {
  const { cleanupEvents, updateCleanupEvents } = useEnterpriseData();
  const [points, setPoints] = useState<number>(280);

  useEffect(() => {
    const saved = operationalStore.getItem('ecoclean_citizen_points');
    if (saved) setPoints(parseInt(saved, 10));
  }, []);

  const handleRegisterEvent = (id: string) => {
    const updated = cleanupEvents.map(ev => {
      if (ev.id === id) {
        const isReg = !ev.registered;
        if (isReg) {
          // Add points
          const newPts = points + ev.pointsReward;
          setPoints(newPts);
          operationalStore.setItem('ecoclean_citizen_points', String(newPts));
          alert(`🎉 Registered for "${ev.title}"! Earned +${ev.pointsReward} Civic Action points on reservation.`);
        } else {
          const newPts = Math.max(0, points - ev.pointsReward);
          setPoints(newPts);
          operationalStore.setItem('ecoclean_citizen_points', String(newPts));
        }
        return {
          ...ev,
          registered: isReg,
          volunteersCount: isReg ? ev.volunteersCount + 1 : ev.volunteersCount - 1
        };
      }
      return ev;
    });
    updateCleanupEvents(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            Civic Participation & Volunteer Campaigns
          </h2>
          <p className="text-xs text-gray-500">Engage local citizens, coordinate weekly recycling drives, and reward sanitation champions.</p>
        </div>
        <div className="bg-brand-accent/30 border border-brand-primary/20 rounded-2xl px-4 py-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-primary" />
          <div>
            <span className="text-[9px] text-gray-400 block font-mono font-extrabold uppercase leading-none">Your Civic Score</span>
            <span className="text-sm font-black text-brand-primary leading-none block mt-0.5">{points} Pts</span>
          </div>
        </div>
      </div>

      {/* Campaigns list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cleanupEvents.map(ev => (
          <div 
            key={ev.id} 
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-brand-accent transition-all relative overflow-hidden"
          >
            {ev.registered && (
              <div className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl font-mono">
                REGISTERED OK
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 justify-between flex-wrap">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  ev.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' :
                  ev.status === 'Active' ? 'bg-amber-50 text-amber-600 animate-pulse' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {ev.status} Action
                </span>
                <span className="text-xs text-brand-primary font-mono font-bold">+{ev.pointsReward} Civic Points</span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mt-3">{ev.title}</h3>
              
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" /> {ev.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {ev.location}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Volunteer Capacity</span>
                  <span className="font-bold text-gray-700">{ev.volunteersCount} / {ev.maxVolunteers}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, (ev.volunteersCount / ev.maxVolunteers) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
              {ev.status === 'Completed' ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4.5 h-4.5" /> Event Concluded Successfully
                </span>
              ) : (
                <button
                  onClick={() => handleRegisterEvent(ev.id)}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    ev.registered
                      ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100/50'
                      : 'bg-brand-primary hover:bg-brand-secondary text-white shadow-sm'
                  }`}
                >
                  {ev.registered ? 'Cancel Registration' : 'Volunteer for Event'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MODULE 5: ASSET MANAGEMENT
// ==========================================

export function AssetManagementView() {
  const { assets, updateAssets } = useEnterpriseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<AssetRecord['category']>('Heavy Equipment');
  const [newCond, setNewCond] = useState<AssetRecord['condition']>('Excellent');
  const [newValue, setNewValue] = useState('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newValue) return;

    const newAsset: AssetRecord = {
      id: `AS-${Math.floor(800 + Math.random() * 199)}`,
      name: newName,
      category: newCat,
      purchaseDate: new Date().toISOString().split('T')[0],
      condition: newCond,
      assignedTo: 'Central Operations Storage',
      value: Number(newValue)
    };

    updateAssets([newAsset, ...assets]);
    setShowAddModal(false);
    setNewName('');
    setNewValue('');
  };

  const cycleCondition = (id: string) => {
    const conditions: AssetRecord['condition'][] = ['Excellent', 'Good', 'Fair', 'Poor'];
    const updated = assets.map(asset => {
      if (asset.id === id) {
        const nextIdx = (conditions.indexOf(asset.condition) + 1) % conditions.length;
        return { ...asset, condition: conditions[nextIdx] };
      }
      return asset;
    });
    updateAssets(updated);
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-primary" />
            Operations Asset Registry
          </h2>
          <p className="text-xs text-gray-500">Track industrial dump equipment, supervisor electronics, protective gears, and sweep tools.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Register Asset
        </button>
      </div>

      {/* Asset List table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 pl-9 pr-4 py-1.5 rounded-xl text-xs focus:outline-none"
            />
          </div>
          <span className="text-xs text-gray-400 font-mono">Inventory Value: <span className="font-bold text-gray-700">${assets.reduce((acc, a) => acc + a.value, 0).toLocaleString()}</span></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-mono border-b border-gray-100 uppercase tracking-wider text-[9px]">
              <tr>
                <th className="p-4">Asset ID</th>
                <th className="p-4">Name / Class</th>
                <th className="p-4">Category</th>
                <th className="p-4">Lifecycle / Condition</th>
                <th className="p-4">Assigned Location</th>
                <th className="p-4">Value (USD)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono font-bold text-gray-400">{asset.id}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-800 block">{asset.name}</span>
                    <span className="text-[10px] text-gray-400 block font-medium">Acquired: {asset.purchaseDate}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded text-[10px]">
                      {asset.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => cycleCondition(asset.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        asset.condition === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        asset.condition === 'Good' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        asset.condition === 'Fair' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-red-50 text-red-600 border border-red-100'
                      }`}
                      title="Click to cycle status condition"
                    >
                      {asset.condition}
                    </button>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{asset.assignedTo}</td>
                  <td className="p-4 font-mono font-bold text-gray-700">${asset.value.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        const person = prompt('Assign this asset to operator/location:', asset.assignedTo);
                        if (person) {
                          const updated = assets.map(a => a.id === asset.id ? { ...a, assignedTo: person } : a);
                          updateAssets(updated);
                        }
                      }}
                      className="text-brand-primary font-bold hover:underline"
                    >
                      Re-Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-6 w-full max-w-md relative z-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-primary" /> Register Assets & Equipment
            </h3>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Asset Model Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Caterpillar compactor vessel model X" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Inventory Category</label>
                <select 
                  value={newCat}
                  onChange={e => setNewCat(e.target.value as AssetRecord['category'])}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none"
                >
                  <option value="Heavy Equipment">Heavy Equipment (Compactors, Trucks)</option>
                  <option value="Electronics">Electronics (IoT trackers, tablets, desktop nodes)</option>
                  <option value="PPE">PPE (Gloves, hazmat gears, hard boots)</option>
                  <option value="Tools">Tools (Rakes, steel brooms, wheelbarrows)</option>
                  <option value="Office Supply">Office Supply (Printers, desks)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Condition</label>
                  <select 
                    value={newCond}
                    onChange={e => setNewCond(e.target.value as AssetRecord['condition'])}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Asset Value (USD)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 1500" 
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-secondary text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  Save Asset Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 6: CONTRACTOR MANAGEMENT
// ==========================================

export function ContractorManagementView() {
  const { contractors, updateContractors } = useEnterpriseData();
  const [searchTerm, setSearchTerm] = useState('');

  const toggleContractStatus = (id: string) => {
    const states: Contractor['status'][] = ['Active', 'Under Review', 'Suspended'];
    const updated = contractors.map(cont => {
      if (cont.id === id) {
        const nextIdx = (states.indexOf(cont.status) + 1) % states.length;
        return { ...cont, status: states[nextIdx] };
      }
      return cont;
    });
    updateContractors(updated);
  };

  const filteredContractors = contractors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Building className="w-5 h-5 text-brand-primary" />
          Sovereign Contractors & Service Agreements
        </h2>
        <p className="text-xs text-gray-500">Monitor external waste agreements, budget distributions, and live compliance ratings against SLA thresholds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredContractors.map(cont => (
          <div 
            key={cont.id} 
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-brand-accent transition-colors"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{cont.name}</h3>
                  <span className="text-[10px] font-mono text-gray-400">{cont.id} &bull; Service Agreement</span>
                </div>
                <button
                  onClick={() => toggleContractStatus(cont.id)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                    cont.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    cont.status === 'Under Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-red-50 text-red-600 border border-red-100'
                  }`}
                >
                  {cont.status}
                </button>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Services:</span>
                  <span className="font-semibold text-gray-700">{cont.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage:</span>
                  <span className="font-semibold text-gray-700">{cont.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract Value:</span>
                  <span className="font-mono font-bold text-emerald-600">${cont.budget.toLocaleString()} / Annually</span>
                </div>
              </div>

              {/* SLA rating display */}
              <div className="mt-5 space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="text-gray-500">SLA Compliance Rating</span>
                  <span className={`font-bold ${cont.slaActual >= cont.slaTarget ? 'text-emerald-600' : 'text-red-500'}`}>
                    {cont.slaActual}% (Target: {cont.slaTarget}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cont.slaActual >= cont.slaTarget ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${cont.slaActual}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-2">
              <button
                onClick={() => {
                  const val = prompt('Enter new contract budget annual allocation:', String(cont.budget));
                  if (val && !isNaN(Number(val))) {
                    const updated = contractors.map(c => c.id === cont.id ? { ...c, budget: Number(val) } : c);
                    updateContractors(updated);
                  }
                }}
                className="text-[10px] font-bold text-gray-600 hover:text-brand-primary bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 transition-all"
              >
                Modify Budget
              </button>
              <button
                onClick={() => {
                  alert(`Generating active performance report for ${cont.name}. Dispatching compliance report PDF simulator to administrative email.`);
                }}
                className="bg-brand-primary hover:bg-brand-secondary text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
              >
                Inspect Compliance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MODULE 7: KNOWLEDGE HUB
// ==========================================

export function KnowledgeHubView() {
  const { documents } = useEnterpriseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || doc.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const triggerDownload = (title: string) => {
    alert(`Initiating secure SSL download for: ${title}. Preparing PDF package in background.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-primary" />
          Environmental Knowledge & Policy Hub
        </h2>
        <p className="text-xs text-gray-500">Centralized sovereign documentation database. Store legal acts, operator safety guidelines, and training materials.</p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search legislation, manuals..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none"
          />
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {['All', 'Legislation', 'Manual', 'Training', 'Safety'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCat === cat ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-brand-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/20 text-brand-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-brand-primary bg-brand-accent/20 px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 pt-1">{doc.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium font-mono">Published by {doc.author} &bull; {doc.publishedDate} &bull; {doc.fileSize}</p>
                </div>
              </div>
              <button
                onClick={() => triggerDownload(doc.title)}
                className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-3 py-2 rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Download PDF ({doc.fileSize})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 8: PUBLIC API PLATFORM
// ==========================================

export function PublicApiView() {
  const [apiKey, setApiKey] = useState<string>('No active key provisioned');
  const [requestsCount, setRequestsCount] = useState<number>(34200);

  const generateNewKey = async () => {
    const { data } = await apiKeyService.rotate();
    setApiKey(data.key);
    alert('A new ECOCLEAN credential was securely generated. Store it now; it will not be shown again.');
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-primary" />
          Sovereign Public GIS & Telemetry API Portal
        </h2>
        <p className="text-xs text-gray-500">Provide NGO partners, researchers, and developers with open GIS coordinates, air diagnostics, and smart-bin fill stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 md:col-span-2">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Your Developer Token</h3>
            <p className="text-xs text-gray-400">Keep this secret. This token authorizes secure external client calls to ECOCLEAN’s spatial database.</p>
          </div>

          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              readOnly 
              value={apiKey}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-[10px] text-gray-600 focus:outline-none"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                alert('Copied credential token to clipboard!');
              }}
              className="bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-primary border border-brand-accent/30 text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              Copy Key
            </button>
            <button
              onClick={generateNewKey}
              className="bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              Rotate Key
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-mono">
            <span>Rate Limit: <span className="font-bold text-gray-700">10,000 reqs/min</span></span>
            <span>Total Requests Month: <span className="font-bold text-gray-700">{requestsCount.toLocaleString()}</span></span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 text-white border border-gray-800 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-brand-accent">Endpoint Diagnostics</span>
            <h4 className="text-xs font-bold">GET /api/v1/spatial/bins</h4>
            <p className="text-[10px] text-gray-400">Fetch live coordinates and fill capacities of all smart IoT containers in Freetown.</p>
          </div>

          <div className="bg-gray-950 p-2.5 rounded-xl border border-gray-800 font-mono text-[9px] text-emerald-400 overflow-x-auto mt-4">
            {`{
  "status": "success",
  "total_bins": 850,
  "nodes": [
    {
      "bin_id": "SB-001",
      "gps": [8.4842, -13.2514],
      "capacity_fill": 92,
      "sensor_battery": 84
    }
  ]
}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 9: NATIONAL OPERATIONS CENTER
// ==========================================

export function NationalOperationsCenterView() {
  const { fleet, smartBins, disasterIncidents } = useEnterpriseData();
  const [activeFeeds, setActiveFeeds] = useState<string[]>([
    'HQ: Terminal linked to Western Area Urban command.',
    'IoT: Smart Bin SB-001 near Freetown Market reporting capacity exceeding 90%.',
    'Emergency: Responders active at Kroo Bay flooding sector.',
    'System: Fleet vehicle FV-401 fuel refilled to 82%.'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        `System: Live GIS sync completed.`,
        `IoT: Ping diagnostics to node SB-003 responded OK.`,
        `Supervisor: New dispatch order recorded on vessel FV-404.`,
        `Alert: High ocean tide alert sent to peninsula ports.`
      ];
      setActiveFeeds(prev => [msgs[Math.floor(Math.random() * msgs.length)], ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 bg-slate-900 p-6 rounded-3xl text-white border border-slate-950 shadow-md">
        <div className="space-y-1">
          <span className="text-brand-accent text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-brand-accent animate-ping" /> Sovereign Command Node
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">National Smart City Operations Center</h2>
          <p className="text-xs text-slate-400">Consolidated live dashboard integrating fleet telematics, IoT sensors, emergency coordinates, and community impact.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 font-mono text-[10px] text-slate-300">
            <span>SATELLITE SYNC: <span className="text-emerald-400 font-bold">100% ONLINE</span></span>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">National Fleet Vessels</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-black text-slate-800">{fleet.length}</p>
            <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-0.5">
              <Truck className="w-3.5 h-3.5" /> {fleet.filter(f => f.status === 'Active').length} Active
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">IoT Sensor Matrix</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-black text-slate-800">{smartBins.length} Nodes</p>
            <span className="text-xs font-mono text-red-500 font-semibold flex items-center gap-0.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {smartBins.filter(b => b.status === 'Overflowing').length} Overfills
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Emergency Incidents</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-black text-red-600">{disasterIncidents.filter(i => i.status !== 'Resolved').length} Active</p>
            <span className="text-xs font-mono text-amber-500 font-semibold">
              {disasterIncidents.filter(i => i.severity === 'Critical').length} Critical
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-2">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Eco System Clean-Score</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-black text-brand-primary">94.8%</p>
            <span className="text-xs font-mono text-emerald-600 font-semibold">Excellent</span>
          </div>
        </div>
      </div>

      {/* Map simulator & terminal logs split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operations map simulator */}
        <div className="bg-slate-950 text-white rounded-3xl p-5 border border-slate-900 lg:col-span-2 relative overflow-hidden flex flex-col justify-between aspect-video min-h-[350px]">
          {/* Animated radar overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,160,71,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

          <div className="flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <h4 className="text-xs font-mono font-bold text-slate-300">DYNAMIC NATIONAL SPATIAL TRACKER</h4>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[9px] font-mono text-brand-accent">
              SCALE: SIERRA LEONE SOVEREIGN
            </div>
          </div>

          {/* Interactive Mock Map Graphics */}
          <div className="flex-1 flex items-center justify-center relative my-4">
            
            {/* National Outline Simulation */}
            <div className="w-64 h-64 border border-brand-accent/20 rounded-full flex items-center justify-center animate-pulse relative">
              <div className="absolute inset-8 border border-emerald-500/10 rounded-full" />
              <div className="absolute inset-16 border border-emerald-500/20 rounded-full" />
              <div className="absolute inset-24 border border-emerald-500/15 rounded-full" />
              
              {/* Animated Map Pins */}
              <div className="absolute top-1/4 left-1/3 text-center">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full block animate-ping" />
                <span className="text-[8px] font-mono text-slate-400 font-bold block mt-1">Kroo Bay Flood (SOS)</span>
              </div>

              <div className="absolute top-1/2 left-1/4 text-center">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full block" />
                <span className="text-[8px] font-mono text-slate-400 font-bold block mt-1">Vessel FV-401 (Lumley)</span>
              </div>

              <div className="absolute bottom-1/3 right-1/3 text-center">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full block" />
                <span className="text-[8px] font-mono text-slate-400 font-bold block mt-1">Bin SB-001 (Market)</span>
              </div>

              <div className="absolute top-1/3 right-1/4 text-center">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full block" />
                <span className="text-[8px] font-mono text-slate-400 block font-bold mt-1">Bo Central Node</span>
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono z-10 pt-2 border-t border-slate-900">
            <span>LAYERS: [IoT telemetry, Fleet Routes, Emergency SOS]</span>
            <span className="text-emerald-400">LAT/LNG: FREETOWN CONTROL BASE</span>
          </div>
        </div>

        {/* Live operational log feeds */}
        <div className="bg-slate-950 text-slate-300 p-5 rounded-3xl border border-slate-900 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-900">
              <span className="text-[10px] font-bold tracking-wider text-slate-500">REAL-TIME OPERATIONAL LOGS</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            <div className="space-y-3 mt-4">
              {activeFeeds.map((feed, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[9px] text-slate-500 block">{new Date().toLocaleTimeString()}</span>
                  <p className="text-[11px] leading-relaxed text-slate-300 font-semibold">{feed}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
            <button
              onClick={() => {
                const cmd = prompt('Issue override radio signal text:');
                if (cmd) {
                  setActiveFeeds(prev => [`Control Priority Directive: "${cmd}"`, ...prev]);
                  alert('Radio overrides transmitted.');
                }
              }}
              className="bg-brand-primary hover:bg-brand-secondary text-white font-mono text-[10px] font-bold py-2 rounded-xl transition-all text-center cursor-pointer"
            >
              Issue Radio Priority Signal
            </button>
            <p className="text-[9px] text-slate-600 text-center uppercase tracking-wider font-bold">Encrypted 256-bit sovereign satellite tunnel</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// PUBLIC TRANSPARENCY VIEW (PORTAL)
// ==========================================

export function PublicTransparencyView() {
  const { fleet, smartBins, disasterIncidents } = useEnterpriseData();

  const metrics = {
    connectedCitizens: '25,000+',
    totalReports: '10,420',
    resolvedCount: '9,812',
    responseRate: '94.2%',
    activeVolunteers: '4,500+',
    carbonSaved: '14.5 Tons'
  };

  const municipalScores = [
    { name: 'Freetown City Council', district: 'Western Area Urban', score: 96.2, grade: 'A+', resolved: '5,420', activeCrews: 42 },
    { name: 'Bo City Council', district: 'Bo District', score: 92.4, grade: 'A', resolved: '2,110', activeCrews: 18 },
    { name: 'Kenema City Council', district: 'Kenema District', score: 88.5, grade: 'B+', resolved: '1,340', activeCrews: 12 },
    { name: 'Makeni City Council', district: 'Bombali District', score: 84.8, grade: 'B', resolved: '942', activeCrews: 8 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-800">
      
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-brand-accent/40 text-brand-primary text-[10px] font-extrabold font-mono uppercase px-3 py-1 rounded-full border border-brand-primary/15">
          Sovereign Public Transparency Deck
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">National Environmental Scorecard</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Authorized open data channel displaying real-time compliance rankings, municipal sanitary grades, resolution speeds, and community cleanup milestones.
        </p>
      </div>

      {/* Metrics bento */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Citizens Joined</p>
          <p className="text-2xl font-black text-brand-primary mt-2">{metrics.connectedCitizens}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Issues Reported</p>
          <p className="text-2xl font-black text-brand-primary mt-2">{metrics.totalReports}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Issues Resolved</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{metrics.resolvedCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Resolution Speed</p>
          <p className="text-2xl font-black text-brand-primary mt-2">{metrics.responseRate}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">Eco Volunteers</p>
          <p className="text-2xl font-black text-teal-600 mt-2">{metrics.activeVolunteers}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center flex flex-col justify-between">
          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">CO₂ Footprint Saved</p>
          <p className="text-2xl font-black text-blue-600 mt-2">{metrics.carbonSaved}</p>
        </div>
      </div>

      {/* Municipal League Table */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">National Council League Table</h3>
          <p className="text-xs text-gray-500 mt-1">Councils are scored and graded weekly on: SLA resolution rate, community volunteer participation, clean waste reduction, response time, and local system health.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {municipalScores.map((score, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-150 p-6 rounded-2xl shadow-sm hover:border-brand-accent transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-brand-primary bg-brand-accent/20 px-2 py-0.5 rounded">
                  Rank #{idx + 1} &bull; {score.district}
                </span>
                <h4 className="text-base font-bold text-slate-800 pt-1">{score.name}</h4>
                <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] text-gray-500">
                  <div>
                    <span>Issues Cleared:</span>
                    <span className="font-mono font-extrabold text-slate-700 block mt-0.5">{score.resolved} Cases</span>
                  </div>
                  <div>
                    <span>Active Field Teams:</span>
                    <span className="font-mono font-extrabold text-slate-700 block mt-0.5">{score.activeCrews} Crew Groups</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">Clean-Score</span>
                  <span className="text-xl font-black text-brand-primary font-mono block">{score.score}%</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-accent/30 text-brand-primary flex items-center justify-center font-black text-lg">
                  {score.grade}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen feedback / pledge */}
      <div className="bg-gradient-to-br from-brand-primary to-green-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <Heart className="w-12 h-12 text-brand-accent mx-auto animate-pulse" />
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our National Clean Pledge</h3>
          <p className="text-emerald-100/80 leading-relaxed text-sm">
            "We believe a clean, hygienic community is a baseline human right. Through open metrics, coordinated local volunteering, smart IoT alerts, and sovereign government cooperation, we commit to preserving the health and natural beauty of our country for generations to come."
          </p>
          <div className="pt-2">
            <span className="font-mono text-xs text-brand-accent">ECOCLEAN SL TRANSPARENCY DECK &bull; SIGNED BY COUNCILS</span>
          </div>
        </div>
      </div>

    </div>
  );
}
