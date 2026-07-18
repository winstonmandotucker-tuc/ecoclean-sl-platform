export interface StaffTask {
  id: string;
  referenceNumber: string;
  title: string;
  category: string;
  description: string;
  location: string;
  district: string;
  municipality: string;
  ward: string;
  zone: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Assigned' | 'Accepted' | 'Traveling' | 'In Progress' | 'Verification Pending' | 'Completed';
  date: string;
  deadline: string;
  photosBefore: string[];
  photosAfter: string[];
  gps: { lat: number; lng: number; x: number; y: number }; // x,y are coordinates for our interactive SVG map
  assignedSupervisor: string;
  notes: string[];
  fuelEstimate?: string;
  vesselNo?: string;
}

export interface StaffSchedule {
  id: string;
  title: string;
  type: 'Regular collection' | 'High priority cleanup' | 'Supervisor audit' | 'Community cleanup';
  date: string;
  time: string;
  location: string;
  zone: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  vessel: string;
}

export interface StaffNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  type: 'New Assignment' | 'Supervisor Message' | 'System Alert' | 'Environmental Alert' | 'Schedule Update';
  read: boolean;
  taskId?: string;
}

export interface StaffPerformance {
  completedTasks: number;
  averageCompletionTime: string; // e.g. "2.4 hours"
  citizenSatisfaction: number; // e.g. 4.8
  performanceRating: string; // e.g. "Outstanding"
  monthlyTrends: { month: string; tasks: number; satisfaction: number }[];
  achievements: { id: string; name: string; description: string; dateEarned: string; icon: string }[];
}

export const DISTRICT_MAP_COORDS = [
  { name: 'Western Urban', x: 14, y: 44, fullName: 'Western Area Urban (Freetown)' },
  { name: 'Western Rural', x: 20, y: 48, fullName: 'Western Area Rural (Waterloo)' },
  { name: 'Port Loko', x: 26, y: 36, fullName: 'Port Loko District' },
  { name: 'Kambia', x: 25, y: 18, fullName: 'Kambia District' },
  { name: 'Karene', x: 38, y: 22, fullName: 'Karene District' },
  { name: 'Bombali', x: 45, y: 28, fullName: 'Bombali District (Makeni)' },
  { name: 'Koinadugu', x: 62, y: 24, fullName: 'Koinadugu District' },
  { name: 'Falaba', x: 68, y: 14, fullName: 'Falaba District' },
  { name: 'Tonkolili', x: 48, y: 43, fullName: 'Tonkolili District' },
  { name: 'Kono', x: 74, y: 41, fullName: 'Kono District (Koidu)' },
  { name: 'Moyamba', x: 33, y: 56, fullName: 'Moyamba District' },
  { name: 'Bo', x: 47, y: 60, fullName: 'Bo District' },
  { name: 'Bonthe', x: 28, y: 73, fullName: 'Bonthe District' },
  { name: 'Pujehun', x: 53, y: 79, fullName: 'Pujehun District' },
  { name: 'Kenema', x: 66, y: 63, fullName: 'Kenema District' },
  { name: 'Kailahun', x: 84, y: 54, fullName: 'Kailahun District' }
];

export const DEFAULT_STAFF_TASKS: StaffTask[] = [
  {
    id: 'T-101',
    referenceNumber: 'EC-SL-2026-9041',
    title: 'Clear Congo Town Market Overflow',
    category: 'Overflowing Municipal Bin',
    description: 'Extensive waste spill and organic debris blocking traffic and creating severe odors near the entrance of Congo Town market.',
    location: 'Congo Town Market, Main Entrance',
    district: 'Western Urban',
    municipality: 'Freetown City Council (FCC)',
    ward: 'Ward 382',
    zone: 'Zone 4 (West)',
    priority: 'High',
    status: 'In Progress',
    date: '2026-07-16 07:30',
    deadline: 'Today, 14:00',
    photosBefore: [
      '/assets/demo-waste.svg',
      '/assets/demo-waste.svg'
    ],
    photosAfter: [],
    gps: { lat: 8.4842, lng: -13.2514, x: 14, y: 44 },
    assignedSupervisor: 'Inspector Fofanah',
    notes: [
      'Crew dispatched with Compactor SL-02.',
      'Citizen reported heavy plastic waste mixed with bio-waste.'
    ],
    fuelEstimate: '15 Liters',
    vesselNo: 'Compactor SL-02'
  },
  {
    id: 'T-102',
    referenceNumber: 'EC-SL-2026-8732',
    title: 'Dumb Buster: Kroo Town Canal Blockage',
    category: 'Drainage Plastic Blockage',
    description: 'Large pile of plastic bottles and shopping bags blocking drainage flow into Kroo Bay. Flooding hazard with high priority.',
    location: 'Kroo Town Bridge Canal, Freetown',
    district: 'Western Urban',
    municipality: 'Freetown City Council (FCC)',
    ward: 'Ward 378',
    zone: 'Zone 2 (Central)',
    priority: 'High',
    status: 'Assigned',
    date: '2026-07-16 08:15',
    deadline: 'Today, 17:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [],
    gps: { lat: 8.4901, lng: -13.2384, x: 15, y: 41 },
    assignedSupervisor: 'Superintendent Kamara',
    notes: [
      'Requires standard cleanup crew plus hook-truck to lift heavy debris barriers.',
      'Silt accumulation reported around canal entrance.'
    ],
    fuelEstimate: '22 Liters',
    vesselNo: 'Hook-Truck SL-09'
  },
  {
    id: 'T-103',
    referenceNumber: 'EC-SL-2026-6124',
    title: 'Bo Landfill Access Route Sweeping',
    category: 'Illegal Roadside Dumping',
    description: 'A line of illegal household trash dumping stretching 100 meters along the secondary highway leading to Bo regional landfill.',
    location: 'Highway Bypass, Bo Central',
    district: 'Bo',
    municipality: 'Bo City Council (BCC)',
    ward: 'Ward 104',
    zone: 'Sector 3',
    priority: 'Medium',
    status: 'Accepted',
    date: '2026-07-15 11:20',
    deadline: 'Tomorrow, 12:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [],
    gps: { lat: 7.9628, lng: -11.7402, x: 47, y: 60 },
    assignedSupervisor: 'District Officer Koroma',
    notes: [
      'Sweeper vehicle SL-04 assigned.',
      'Coordinate with regional traffic marshals to guarantee crew safety along high-speed lane.'
    ],
    fuelEstimate: '35 Liters',
    vesselNo: 'Sweeper SL-04'
  },
  {
    id: 'T-104',
    referenceNumber: 'EC-SL-2026-5521',
    title: 'Kenema Plaza Metal Waste Collection',
    category: 'Hazardous Waste Spillage',
    description: 'Scrap metal shavings and industrial off-cuts dumped behind Kenema commercial plaza. Safety hazard for pedestrians.',
    location: 'Kenema Commercial Plaza Lane 2',
    district: 'Kenema',
    municipality: 'Kenema City Council (KCC)',
    ward: 'Ward 201',
    zone: 'Zone 1 (East)',
    priority: 'High',
    status: 'Completed',
    date: '2026-07-15 09:10',
    deadline: '2026-07-15 17:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [
      '/assets/demo-waste.svg'
    ],
    gps: { lat: 7.8761, lng: -11.1874, x: 66, y: 63 },
    assignedSupervisor: 'Officer Gbondo',
    notes: [
      'Task completed safely. Metal waste relocated to specialized recycling grid.',
      'Owner of shop issued general notice for safe disposal.'
    ],
    fuelEstimate: '18 Liters',
    vesselNo: 'Flatbed truck SL-11'
  },
  {
    id: 'T-105',
    referenceNumber: 'EC-SL-2026-3392',
    title: 'Makeni Plaza Commercial Bins Emptying',
    category: 'Overflowing Municipal Bin',
    description: 'Two central municipal bins overflowing near the central Makeni commercial line, causing waste scatter across sidewalks.',
    location: 'Central Plaza Market, Makeni',
    district: 'Bombali',
    municipality: 'Makeni City Council (MCC)',
    ward: 'Ward 08',
    zone: 'Zone A',
    priority: 'Medium',
    status: 'Assigned',
    date: '2026-07-16 09:00',
    deadline: 'Today, 18:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [],
    gps: { lat: 8.8845, lng: -12.0431, x: 45, y: 28 },
    assignedSupervisor: 'Officer Turay',
    notes: [
      'Standard route collection.'
    ],
    fuelEstimate: '12 Liters',
    vesselNo: 'Compactor SL-15'
  },
  {
    id: 'T-106',
    referenceNumber: 'EC-SL-2026-4410',
    title: 'Lungi Coastal Beach Plastic Cleanup',
    category: 'Coastal Plastic Blockage',
    description: 'Heavy fishing nets and microplastics accumulated over high tide, disrupting nesting grounds and fisherman docking areas.',
    location: 'Lungi Fishing Wharf Beach',
    district: 'Port Loko',
    municipality: 'Port Loko District Council',
    ward: 'Ward L22',
    zone: 'Lungi Sector',
    priority: 'Low',
    status: 'Traveling',
    date: '2026-07-16 06:45',
    deadline: 'Today, 16:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [],
    gps: { lat: 8.6184, lng: -13.1952, x: 26, y: 36 },
    assignedSupervisor: 'Superintendent Kamara',
    notes: [
      'Requires 3 manual sweepers and beach rakes.',
      'Sacks for collection provided.'
    ],
    fuelEstimate: '20 Liters',
    vesselNo: 'Pickup SL-33'
  },
  {
    id: 'T-107',
    referenceNumber: 'EC-SL-2026-1219',
    title: 'Kambia Border Highway Trash Clearance',
    category: 'Illegal Roadside Dumping',
    description: 'Bulk household refuse bags dumped in the ditch along the border highway. Impacting water flow in agricultural canals.',
    location: 'Border Road, Kambia',
    district: 'Kambia',
    municipality: 'Kambia District Council',
    ward: 'Ward K02',
    zone: 'Zone 5',
    priority: 'Medium',
    status: 'Completed',
    date: '2026-07-14 08:30',
    deadline: '2026-07-14 16:00',
    photosBefore: [
      '/assets/demo-waste.svg'
    ],
    photosAfter: [
      '/assets/demo-waste.svg'
    ],
    gps: { lat: 9.1245, lng: -12.9182, x: 25, y: 18 },
    assignedSupervisor: 'District Officer Bangura',
    notes: [
      'Cleared cleanly. Drainage flow fully restored.'
    ],
    fuelEstimate: '40 Liters',
    vesselNo: 'Flatbed truck SL-01'
  }
];

export const DEFAULT_STAFF_SCHEDULES: StaffSchedule[] = [
  {
    id: 'S-201',
    title: 'Western Area West-Zone Collection Loop',
    type: 'Regular collection',
    date: '2026-07-16',
    time: '07:00 - 13:00',
    location: 'Congo Town, Wilkinson Road, Aberdeen',
    zone: 'Zone 4',
    status: 'In Progress',
    vessel: 'Compactor SL-02'
  },
  {
    id: 'S-202',
    title: 'Kroo Town Drainage Clearing Patrol',
    type: 'High priority cleanup',
    date: '2026-07-16',
    time: '14:00 - 17:00',
    location: 'Kroo Town Bridge Canal, Freetown',
    zone: 'Zone 2',
    status: 'Upcoming',
    vessel: 'Hook-Truck SL-09'
  },
  {
    id: 'S-203',
    title: 'Makeni Plaza Route Clearance',
    type: 'Regular collection',
    date: '2026-07-17',
    time: '08:00 - 14:00',
    location: 'Central Plaza Market, Makeni',
    zone: 'Zone A',
    status: 'Upcoming',
    vessel: 'Compactor SL-15'
  },
  {
    id: 'S-204',
    title: 'Bo Regional Landfill Highway Patrol',
    type: 'High priority cleanup',
    date: '2026-07-17',
    time: '10:00 - 16:00',
    location: 'Highway Bypass, Bo Central',
    zone: 'Sector 3',
    status: 'Upcoming',
    vessel: 'Sweeper SL-04'
  }
];

export const DEFAULT_STAFF_NOTIFICATIONS: StaffNotification[] = [
  {
    id: 'SN-01',
    title: 'Urgent Dispatch: Kroo Town Bridge Canal',
    body: 'You have been assigned to clear a major drainage plastic blockage at Kroo Town Bridge. High priority. Deadline: Today 17:00.',
    date: 'Today, 08:15',
    type: 'New Assignment',
    read: false,
    taskId: 'T-102'
  },
  {
    id: 'SN-02',
    title: 'Fuel Voucher Approved',
    body: 'Supervisor Fofanah approved your 15L fuel voucher for Compactor SL-02. Code: SL-FUL-9014.',
    date: 'Today, 07:45',
    type: 'Supervisor Message',
    read: false,
    taskId: 'T-101'
  },
  {
    id: 'SN-03',
    title: 'Heavy Rain Warning',
    body: 'Sierra Leone Meteorological Agency warns of heavy rainfall in the Western Area this afternoon. Secure all open compactor covers and remain cautious on coastal routes.',
    date: 'Today, 06:00',
    type: 'Environmental Alert',
    read: true
  },
  {
    id: 'SN-04',
    title: 'Shift Calendar Updated',
    body: 'Your schedule for Friday 2026-07-17 has been updated with the Bo Regional Landfill Sweeping shift.',
    date: 'Yesterday, 18:30',
    type: 'Schedule Update',
    read: true
  }
];

export const DEFAULT_STAFF_PERFORMANCE: StaffPerformance = {
  completedTasks: 42,
  averageCompletionTime: '2.2 hours',
  citizenSatisfaction: 4.9,
  performanceRating: 'Outstanding',
  monthlyTrends: [
    { month: 'Apr', tasks: 32, satisfaction: 4.6 },
    { month: 'May', tasks: 38, satisfaction: 4.7 },
    { month: 'Jun', tasks: 45, satisfaction: 4.8 },
    { month: 'Jul', tasks: 42, satisfaction: 4.9 }
  ],
  achievements: [
    {
      id: 'ACH-01',
      name: 'Eagle Eye',
      description: 'Logged 20 photo verifications with 100% compliance rate.',
      dateEarned: '2026-06-20',
      icon: 'Camera'
    },
    {
      id: 'ACH-02',
      name: 'Rapid Responder',
      description: 'Cleared an urgent flood-inducing blockage in less than 90 minutes.',
      dateEarned: '2026-07-02',
      icon: 'Zap'
    },
    {
      id: 'ACH-03',
      name: 'Safe Driver',
      description: 'Completed 1,000 kilometers of urban collection routes without a fuel efficiency anomaly.',
      dateEarned: '2026-07-10',
      icon: 'Truck'
    }
  ]
};
