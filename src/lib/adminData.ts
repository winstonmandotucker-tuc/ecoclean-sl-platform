import { Report } from './citizenData';

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  capital: string;
  currency: string;
  phoneCode: string;
  agencyName: string;
  districts: string[];
  municipalities: Record<string, string[]>;
  wards: Record<string, string[]>;
  zones: string[];
  stats: {
    activeCitizens: number;
    activeStaff: number;
    activeSupervisors: number;
    totalReports: number;
    resolvedReports: number;
    slaCompliance: number; // percentage
    dailyWasteCollected: number; // in tons
    carbonMitigation: number; // in metric tons CO2eq
    plasticMitigationRate: number; // percentage
    airQualityIndex: number; // AQI value
    waterQualityIndex: number; // WQI value
    soilHealthIndex: number; // SHI value
  };
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'staff' | 'supervisor' | 'admin' | 'super-admin';
  countryCode: string;
  municipality: string;
  status: 'Active' | 'Suspended' | 'Pending';
  lastActive: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  countryCode: string;
  action: string;
  module: 'Reports' | 'Users' | 'Municipalities' | 'Security' | 'Settings' | 'RBAC' | 'Exports';
  ipAddress: string;
  status: 'Success' | 'Failed' | 'MFA Challenge';
}

export interface RBACRole {
  role: 'citizen' | 'staff' | 'supervisor' | 'admin';
  name: string;
  description: string;
  permissions: {
    reports: 'none' | 'view_own' | 'view_zone' | 'edit_zone' | 'full_control';
    users: 'none' | 'view_own' | 'view_all' | 'full_control';
    dispatch: 'none' | 'receive' | 'assign' | 'full_control';
    settings: 'none' | 'view' | 'full_control';
    analytics: 'none' | 'view_local' | 'view_national' | 'full_control';
    audit: boolean;
  };
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    capital: 'Freetown',
    currency: 'SLE',
    phoneCode: '+232',
    agencyName: 'EPA-SL (Environmental Protection Agency)',
    districts: ['Western Area Urban', 'Western Area Rural', 'Bo District', 'Kenema District', 'Bombali District'],
    municipalities: {
      'Western Area Urban': ['Freetown City Council (FCC)'],
      'Western Area Rural': ['Waterloo Rural District Council (WRDC)'],
      'Bo District': ['Bo City Council (BCC)'],
      'Kenema District': ['Kenema City Council (KCC)'],
      'Bombali District': ['Makeni City Council (MCC)'],
    },
    wards: {
      'Freetown City Council (FCC)': ['Ward 301 (Aberdeen)', 'Ward 302 (Lumley)', 'Ward 303 (Central)', 'Ward 304 (Calaba Town)'],
      'Waterloo Rural District Council (WRDC)': ['Ward 310', 'Ward 311'],
      'Bo City Council (BCC)': ['Ward 104', 'Ward 105'],
      'Kenema City Council (KCC)': ['Ward 201', 'Ward 202'],
      'Makeni City Council (MCC)': ['Ward 401', 'Ward 402'],
    },
    zones: ['Zone 1 (West-Central)', 'Zone 2 (East-South)', 'Zone A', 'Zone B', 'Zone C'],
    stats: {
      activeCitizens: 18420,
      activeStaff: 320,
      activeSupervisors: 45,
      totalReports: 1420,
      resolvedReports: 1210,
      slaCompliance: 88.5,
      dailyWasteCollected: 450,
      carbonMitigation: 120.4,
      plasticMitigationRate: 42,
      airQualityIndex: 45,
      waterQualityIndex: 72,
      soilHealthIndex: 81,
    }
  },
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    capital: 'Monrovia',
    currency: 'LRD',
    phoneCode: '+231',
    agencyName: 'EPA-Liberia (Environmental Protection Agency)',
    districts: ['Montserrado', 'Bong', 'Maryland', 'Nimba', 'Grand Bassa'],
    municipalities: {
      'Montserrado': ['Monrovia City Corporation (MCC)', 'Paynesville City Corporation (PCC)'],
      'Bong': ['Gbarnga City Council'],
      'Maryland': ['Harper City Council'],
      'Nimba': ['Sanniquellie City Council'],
      'Grand Bassa': ['Buchanan City Corporation'],
    },
    wards: {
      'Monrovia City Corporation (MCC)': ['Ward Clara Town', 'Ward West Point', 'Ward Sinkor', 'Ward Central'],
      'Paynesville City Corporation (PCC)': ['Ward PCC-East', 'Ward PCC-West'],
      'Gbarnga City Council': ['Ward Gbarnga 1', 'Ward Gbarnga 2'],
      'Harper City Corporation': ['Ward Harper 1'],
      'Sanniquellie City Council': ['Ward Sanni A'],
      'Buchanan City Corporation': ['Ward Buchanan 1'],
    },
    zones: ['Zone Central Monrovia', 'Bushrod Island Zone', 'Sinkor Zone', 'Paynesville Zone', 'Gbarnga Core Zone'],
    stats: {
      activeCitizens: 12450,
      activeStaff: 210,
      activeSupervisors: 28,
      totalReports: 980,
      resolvedReports: 760,
      slaCompliance: 81.2,
      dailyWasteCollected: 290,
      carbonMitigation: 74.8,
      plasticMitigationRate: 31,
      airQualityIndex: 52,
      waterQualityIndex: 64,
      soilHealthIndex: 78,
    }
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    capital: 'Accra',
    currency: 'GHS',
    phoneCode: '+233',
    agencyName: 'EPA-Ghana (Environmental Protection Agency)',
    districts: ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Central'],
    municipalities: {
      'Greater Accra': ['Accra Metropolitan Assembly (AMA)', 'Tema Metropolitan Assembly (TMA)'],
      'Ashanti': ['Kumasi Metropolitan Assembly (KMA)'],
      'Northern': ['Tamale Metropolitan Assembly'],
      'Western': ['Sekondi-Takoradi Metropolitan Assembly'],
      'Central': ['Cape Coast Metropolitan Assembly'],
    },
    wards: {
      'Accra Metropolitan Assembly (AMA)': ['Ward Adabraka', 'Ward Osu', 'Ward East Legon', 'Ward Chorkor'],
      'Tema Metropolitan Assembly (TMA)': ['Ward Community 1', 'Ward Community 4'],
      'Kumasi Metropolitan Assembly (KMA)': ['Ward Bantama', 'Ward Adum', 'Ward Asafo'],
      'Tamale Metropolitan Assembly': ['Ward Tamale Central', 'Ward Nyohini'],
      'Sekondi-Takoradi Metropolitan Assembly': ['Ward Takoradi Central', 'Ward Essikado'],
      'Cape Coast Metropolitan Assembly': ['Ward Kotokuraba'],
    },
    zones: ['Zone Accra Central', 'Zone Tema Harbour', 'Zone Kumasi Adum', 'Zone Tamale West', 'Zone Sekondi Core'],
    stats: {
      activeCitizens: 45600,
      activeStaff: 940,
      activeSupervisors: 110,
      totalReports: 4350,
      resolvedReports: 3980,
      slaCompliance: 92.4,
      dailyWasteCollected: 1100,
      carbonMitigation: 342.1,
      plasticMitigationRate: 58,
      airQualityIndex: 68,
      waterQualityIndex: 79,
      soilHealthIndex: 85,
    }
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    capital: 'Abuja',
    currency: 'NGN',
    phoneCode: '+234',
    agencyName: 'NESREA (National Environmental Standards Agency)',
    districts: ['Lagos State', 'Federal Capital Territory', 'Rivers State', 'Oyo State', 'Kano State'],
    municipalities: {
      'Lagos State': ['Lagos State Waste Management Authority (LAWMA)', 'Ikeja Local Government'],
      'Federal Capital Territory': ['Abuja Municipal Area Council (AMAC)'],
      'Rivers State': ['Port Harcourt Local Government (PHALGA)'],
      'Oyo State': ['Ibadan North Local Government'],
      'Kano State': ['Kano Municipal Local Government'],
    },
    wards: {
      'Lagos State Waste Management Authority (LAWMA)': ['Ward Victoria Island', 'Ward Ikoyi', 'Ward Lekki Phase 1', 'Ward Surulere', 'Ward Mushin'],
      'Ikeja Local Government': ['Ward Alausa', 'Ward Allen Avenue'],
      'Abuja Municipal Area Council (AMAC)': ['Ward Wuse II', 'Ward Garki', 'Ward Maitama', 'Ward Asokoro'],
      'Port Harcourt Local Government (PHALGA)': ['Ward Mile 1', 'Ward Mile 3', 'Ward D-Line'],
      'Ibadan North Local Government': ['Ward Bodija', 'Ward Samonda'],
      'Kano Municipal Local Government': ['Ward Kofar Nassarawa', 'Ward Sabon Gari'],
    },
    zones: ['Zone VI Island', 'Zone Ikeja Central', 'Zone Wuse II', 'Zone Garki I', 'Zone PH Waterfront', 'Zone Bodija Estate'],
    stats: {
      activeCitizens: 112400,
      activeStaff: 2450,
      activeSupervisors: 280,
      totalReports: 12900,
      resolvedReports: 11150,
      slaCompliance: 87.9,
      dailyWasteCollected: 3100,
      carbonMitigation: 890.5,
      plasticMitigationRate: 46,
      airQualityIndex: 84,
      waterQualityIndex: 58,
      soilHealthIndex: 74,
    }
  },
  {
    code: 'GN',
    name: 'Guinea',
    flag: '🇬🇳',
    capital: 'Conakry',
    currency: 'GNF',
    phoneCode: '+224',
    agencyName: 'MGEF (Ministère de l\'Environnement et des Forêts)',
    districts: ['Conakry', 'Nzérékoré', 'Kankan', 'Kindia', 'Labé'],
    municipalities: {
      'Conakry': ['Ville de Conakry (Mairie Central)', 'Commune de Kaloum', 'Commune de Ratoma'],
      'Nzérékoré': ['Commune Urbaine de Nzérékoré'],
      'Kankan': ['Commune Urbaine de Kankan'],
      'Kindia': ['Commune Urbaine de Kindia'],
      'Labé': ['Commune Urbaine de Labé'],
    },
    wards: {
      'Ville de Conakry (Mairie Central)': ['Ward Kaloum 1', 'Ward Boulbinet', 'Ward Sandervalia'],
      'Commune de Kaloum': ['Ward Almamya', 'Ward Tombo'],
      'Commune de Ratoma': ['Ward Kipé', 'Ward Taouyah', 'Ward Lambanyi'],
      'Commune Urbaine de Nzérékoré': ['Ward Commercial', 'Ward Dorota'],
      'Commune Urbaine de Kankan': ['Ward Kankan Koura', 'Ward Salamani'],
      'Commune Urbaine de Kindia': ['Ward Kenendé', 'Ward Tafory'],
      'Commune Urbaine de Labé': ['Ward Kouroula', 'Ward Tata'],
    },
    zones: ['Zone Kaloum Centre', 'Zone Kipé Residentiel', 'Zone Port de Conakry', 'Zone Marché Madina', 'Zone Kankan Centre'],
    stats: {
      activeCitizens: 9120,
      activeStaff: 150,
      activeSupervisors: 18,
      totalReports: 710,
      resolvedReports: 540,
      slaCompliance: 76.8,
      dailyWasteCollected: 180,
      carbonMitigation: 44.2,
      plasticMitigationRate: 23,
      airQualityIndex: 41,
      waterQualityIndex: 61,
      soilHealthIndex: 79,
    }
  },
  {
    code: 'GM',
    name: 'The Gambia',
    flag: '🇬🇲',
    capital: 'Banjul',
    currency: 'GMD',
    phoneCode: '+220',
    agencyName: 'NEA (National Environment Agency)',
    districts: ['Banjul', 'Kanifing Municipal', 'Brikama (West Coast)', 'Basse (Upper River)'],
    municipalities: {
      'Banjul': ['Banjul City Council (BCC)'],
      'Kanifing Municipal': ['Kanifing Municipal Council (KMC)'],
      'Brikama (West Coast)': ['Brikama Area Council (BAC)'],
      'Basse (Upper River)': ['Basse Area Council'],
    },
    wards: {
      'Banjul City Council (BCC)': ['Ward Half Die', 'Ward Soldier Town', 'Ward Portuguese Town'],
      'Kanifing Municipal Council (KMC)': ['Ward Bakau', 'Ward Latrikunda', 'Ward Serekunda', 'Ward Fajara'],
      'Brikama Area Council (BAC)': ['Ward Brikama Central', 'Ward Lamin', 'Ward Sukuta'],
      'Basse Area Council': ['Ward Basse Central', 'Ward Koba Kunda'],
    },
    zones: ['Zone Banjul Commercial', 'Zone Serekunda Market', 'Zone Fajara Estate', 'Zone Brikama Hub'],
    stats: {
      activeCitizens: 6150,
      activeStaff: 95,
      activeSupervisors: 12,
      totalReports: 420,
      resolvedReports: 360,
      slaCompliance: 85.7,
      dailyWasteCollected: 95,
      carbonMitigation: 26.5,
      plasticMitigationRate: 35,
      airQualityIndex: 38,
      waterQualityIndex: 69,
      soilHealthIndex: 83,
    }
  }
];

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'U-001',
    fullName: 'Dr. Josephus Johnson',
    email: 'admin.johnson@ecoclean.gov.sl',
    phone: '+232 77 123456',
    role: 'admin',
    countryCode: 'SL',
    municipality: 'Freetown City Council (FCC)',
    status: 'Active',
    lastActive: '2026-07-16 11:24'
  },
  {
    id: 'U-002',
    fullName: 'Mariama Sall',
    email: 'm.sall@fcc.gov.sl',
    phone: '+232 76 987654',
    role: 'supervisor',
    countryCode: 'SL',
    municipality: 'Freetown City Council (FCC)',
    status: 'Active',
    lastActive: '2026-07-16 10:15'
  },
  {
    id: 'U-003',
    fullName: 'Lamin Bangura',
    email: 'l.bangura@fcc.gov.sl',
    phone: '+232 30 112233',
    role: 'staff',
    countryCode: 'SL',
    municipality: 'Freetown City Council (FCC)',
    status: 'Active',
    lastActive: '2026-07-16 09:30'
  },
  {
    id: 'U-004',
    fullName: 'Kofi Mensah',
    email: 'kofi.mensah@ama.gov.gh',
    phone: '+233 24 5556677',
    role: 'supervisor',
    countryCode: 'GH',
    municipality: 'Accra Metropolitan Assembly (AMA)',
    status: 'Active',
    lastActive: '2026-07-16 11:05'
  },
  {
    id: 'U-005',
    fullName: 'Fatoumata Diallo',
    email: 'f.diallo@conakry.gov.gn',
    phone: '+224 62 111222',
    role: 'citizen',
    countryCode: 'GN',
    municipality: 'Ville de Conakry (Mairie Central)',
    status: 'Active',
    lastActive: '2026-07-15 17:42'
  },
  {
    id: 'U-006',
    fullName: 'Oluwaseun Adebayo',
    email: 'o.adebayo@lawma.gov.ng',
    phone: '+234 803 1112222',
    role: 'admin',
    countryCode: 'NG',
    municipality: 'Lagos State Waste Management Authority (LAWMA)',
    status: 'Active',
    lastActive: '2026-07-16 11:45'
  },
  {
    id: 'U-007',
    fullName: 'Jefferson Nimley',
    email: 'j.nimley@mcc.gov.lr',
    phone: '+231 88 4443322',
    role: 'staff',
    countryCode: 'LR',
    municipality: 'Monrovia City Corporation (MCC)',
    status: 'Suspended',
    lastActive: '2026-07-10 14:15'
  },
  {
    id: 'U-008',
    fullName: 'Ebrima Barrow',
    email: 'ebarima.barrow@kmc.gm',
    phone: '+220 99 555443',
    role: 'supervisor',
    countryCode: 'GM',
    municipality: 'Kanifing Municipal Council (KMC)',
    status: 'Pending',
    lastActive: '2026-07-16 08:00'
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-9021',
    timestamp: '2026-07-16 11:45:21',
    userEmail: 'admin.johnson@ecoclean.gov.sl',
    userRole: 'Administrator',
    countryCode: 'SL',
    action: 'Modified system-wide SLA compliance thresholds from 24h to 18h for High priority',
    module: 'Settings',
    ipAddress: '197.224.64.12',
    status: 'Success'
  },
  {
    id: 'AUD-9020',
    timestamp: '2026-07-16 11:38:10',
    userEmail: 'o.adebayo@lawma.gov.ng',
    userRole: 'Administrator',
    countryCode: 'NG',
    action: 'Authorized LAWMA Zone VI Island operational boundary revision',
    module: 'Municipalities',
    ipAddress: '102.89.44.18',
    status: 'Success'
  },
  {
    id: 'AUD-9019',
    timestamp: '2026-07-16 11:15:02',
    userEmail: 'kofi.mensah@ama.gov.gh',
    userRole: 'Supervisor',
    countryCode: 'GH',
    action: 'Escalated illegal dumping incident R-AMA-4402 to high-priority status',
    module: 'Reports',
    ipAddress: '197.251.12.98',
    status: 'Success'
  },
  {
    id: 'AUD-9018',
    timestamp: '2026-07-16 10:55:40',
    userEmail: 'unknown-intruder@mail.xyz',
    userRole: 'Guest',
    countryCode: 'LR',
    action: 'Failed password login attempt - User does not exist',
    module: 'Security',
    ipAddress: '41.223.110.14',
    status: 'Failed'
  },
  {
    id: 'AUD-9017',
    timestamp: '2026-07-16 10:30:15',
    userEmail: 'admin.johnson@ecoclean.gov.sl',
    userRole: 'Administrator',
    countryCode: 'SL',
    action: 'Exported GeoJSON GIS dataset of waste containers in Freetown Zone 1',
    module: 'Exports',
    ipAddress: '197.224.64.12',
    status: 'Success'
  },
  {
    id: 'AUD-9016',
    timestamp: '2026-07-16 09:12:33',
    userEmail: 'j.nimley@mcc.gov.lr',
    userRole: 'Field Staff',
    countryCode: 'LR',
    action: 'Attempted to override verification status of Monrovia Central skip R-LR-002',
    module: 'Reports',
    ipAddress: '197.228.14.50',
    status: 'Failed'
  },
  {
    id: 'AUD-9015',
    timestamp: '2026-07-16 08:45:00',
    userEmail: 'admin.johnson@ecoclean.gov.sl',
    userRole: 'Administrator',
    countryCode: 'SL',
    action: 'Updated RBAC configuration: Granted Supervisors write access to Municipal reports',
    module: 'RBAC',
    ipAddress: '197.224.64.12',
    status: 'Success'
  },
  {
    id: 'AUD-9014',
    timestamp: '2026-07-16 08:12:02',
    userEmail: 'm.sall@fcc.gov.sl',
    userRole: 'Supervisor',
    countryCode: 'SL',
    action: 'Approved completed sanitation work for reference EC-SL-2026-8172',
    module: 'Reports',
    ipAddress: '197.224.64.5',
    status: 'Success'
  }
];

export const DEFAULT_RBAC_RULES: RBACRole[] = [
  {
    role: 'citizen',
    name: 'Citizen Advocate',
    description: 'Civic engagement role. Can file reports, review their own dashboard and history, and claim civic points.',
    permissions: {
      reports: 'view_own',
      users: 'view_own',
      dispatch: 'none',
      settings: 'none',
      analytics: 'none',
      audit: false
    }
  },
  {
    role: 'staff',
    name: 'Field Sanitary Staff',
    description: 'Schedules and dispatches. Can view assigned checklist, update state with photo verification, and route details.',
    permissions: {
      reports: 'view_zone',
      users: 'view_own',
      dispatch: 'receive',
      settings: 'none',
      analytics: 'none',
      audit: false
    }
  },
  {
    role: 'supervisor',
    name: 'Municipal Supervisor',
    description: 'Local operational manager. Can allocate crews, override tasks, verify report completions, and review council metrics.',
    permissions: {
      reports: 'edit_zone',
      users: 'view_all',
      dispatch: 'assign',
      settings: 'none',
      analytics: 'view_local',
      audit: false
    }
  },
  {
    role: 'admin',
    name: 'National Administrator',
    description: 'Highest platform control. Full Secretariat oversight over West African expansion, audits, RBAC policies, and core configurations.',
    permissions: {
      reports: 'full_control',
      users: 'full_control',
      dispatch: 'full_control',
      settings: 'full_control',
      analytics: 'full_control',
      audit: true
    }
  }
];

export const DEFAULT_SYSTEM_CONFIG = {
  appName: 'ECOCLEAN SL',
  version: '2.4.1-Secretariat-Enterprise',
  enforceMfaForAdmins: true,
  dailyAutoBackup: true,
  logLevel: 'Detailed-Debug',
  defaultSlaHighHours: 18,
  defaultSlaMediumHours: 36,
  defaultSlaLowHours: 72,
  allowAnonymousReports: false,
  integrations: {
    mapProvider: 'ECOCLEAN Configured Tile Service',
    intelligenceServices: 'ECOCLEAN Internal Provider Adapter',
    nationalSmsGateway: 'Active (Sierra Leone, Liberia, Ghana)',
    iotSensorsGateway: 'Active (LoraWAN Container Monitors)'
  },
  notifications: [
    {
      id: 'N-MAS-101',
      title: 'National Anti-Dumping Policy 2026 Enforced',
      body: 'All municipal councils are directed to enforce zero-tolerance and levy structural fines for public littering.',
      date: '2026-07-16',
      target: 'All Citizens & Staff',
      author: 'Dr. Josephus Johnson (Secretariat)',
      status: 'Sent'
    },
    {
      id: 'N-MAS-102',
      title: 'System Maintenance Window Scheduled',
      body: 'Database indices rebuilding will occur on Sunday between 02:00 UTC and 04:00 UTC.',
      date: '2026-07-15',
      target: 'Supervisors & Staff',
      author: 'System Operations Team',
      status: 'Scheduled'
    }
  ]
};

// Generates simulated report datasets for other countries to support switching country view cleanly
export function getCountryReports(countryCode: string): Report[] {
  // Let's create mock reports situated in different countries
  const baseReports: Record<string, Report[]> = {
    'SL': [
      {
        id: 'R-SL-9041',
        referenceNumber: 'EC-SL-2026-9041',
        title: 'Illegal Dumping at Kroo Town Corner',
        category: 'Illegal Dumping',
        description: 'Extensive household garbage and plastic piles are blocking the walkway. Animals are tearing up bags causing bad odors.',
        location: 'Kroo Town Road, Freetown',
        district: 'Western Area Urban',
        municipality: 'Freetown City Council (FCC)',
        ward: 'Ward 301 (Aberdeen)',
        zone: 'Zone 1 (West-Central)',
        priority: 'High',
        status: 'In Progress',
        date: '2026-07-15',
        photos: ['/assets/demo-waste.svg'],
        gps: { lat: 8.4844, lng: -13.2344 },
        assignedTeam: 'Freetown Sanitary Crew Alpha'
      },
      {
        id: 'R-SL-8172',
        referenceNumber: 'EC-SL-2026-8172',
        title: 'Clogged Drainage near Lumley Market',
        category: 'Blocked Drainage',
        description: 'Main gutter completely packed with single-use plastics and plastic beverage bottles.',
        location: 'Lumley Market, Freetown',
        district: 'Western Area Urban',
        municipality: 'Freetown City Council (FCC)',
        ward: 'Ward 302 (Lumley)',
        zone: 'Zone 1 (West-Central)',
        priority: 'High',
        status: 'Completed',
        date: '2026-07-14',
        photos: ['/assets/demo-waste.svg'],
        gps: { lat: 8.4682, lng: -13.2721 },
        assignedTeam: 'FCC Drainage Team B'
      },
      {
        id: 'R-SL-1123',
        referenceNumber: 'EC-SL-2026-1123',
        title: 'Overflowing Skip Bin Central Bo',
        category: 'Overflowing Waste Bin',
        description: 'The green communal dumpster has not been emptied in over a week. Trash is piled three feet high.',
        location: 'Bo Town Central, Bo',
        district: 'Bo District',
        municipality: 'Bo City Council (BCC)',
        ward: 'Ward 104',
        zone: 'Zone A',
        priority: 'Medium',
        status: 'Pending',
        date: '2026-07-16',
        photos: [],
        gps: { lat: 7.9628, lng: -11.7401 }
      }
    ],
    'LR': [
      {
        id: 'R-LR-001',
        referenceNumber: 'EC-LR-2026-0110',
        title: 'Unchecked Plastic Heap at Clara Town',
        category: 'Illegal Dumping',
        description: 'Over 2 tons of single-use bottles and shopping bags blocking the community path near Clara Town school.',
        location: 'Clara Town High Street, Monrovia',
        district: 'Montserrado',
        municipality: 'Monrovia City Corporation (MCC)',
        ward: 'Ward Clara Town',
        zone: 'Bushrod Island Zone',
        priority: 'High',
        status: 'Pending',
        date: '2026-07-16',
        photos: ['/assets/demo-waste.svg'],
        gps: { lat: 6.3312, lng: -10.7981 }
      },
      {
        id: 'R-LR-002',
        referenceNumber: 'EC-LR-2026-0042',
        title: 'Overflowing Skip Central Sinkor',
        category: 'Overflowing Waste Bin',
        description: 'Industrial skip overflowing for 5 days. Liquid runoff leaching onto the sidewalk causing an environmental hazard.',
        location: 'Tubman Boulevard, Sinkor',
        district: 'Montserrado',
        municipality: 'Monrovia City Corporation (MCC)',
        ward: 'Ward Sinkor',
        zone: 'Sinkor Zone',
        priority: 'Medium',
        status: 'In Progress',
        date: '2026-07-14',
        photos: [],
        gps: { lat: 6.2915, lng: -10.7712 },
        assignedTeam: 'Monrovia Waste Team C'
      }
    ],
    'GH': [
      {
        id: 'R-GH-001',
        referenceNumber: 'EC-GH-2026-1011',
        title: 'E-Waste Dumping near Agbogbloshie Sector',
        category: 'Hazardous Waste',
        description: 'Broken computer cases, cathode tubes and copper wiring burning openly, releasing high volumes of black acrid smoke.',
        location: 'Agbogbloshie, Accra',
        district: 'Greater Accra',
        municipality: 'Accra Metropolitan Assembly (AMA)',
        ward: 'Ward Chorkor',
        zone: 'Zone Accra Central',
        priority: 'High',
        status: 'In Progress',
        date: '2026-07-16',
        photos: ['/assets/demo-waste.svg'],
        gps: { lat: 5.5451, lng: -0.2241 },
        assignedTeam: 'AMA Hazardous Unit Alpha'
      },
      {
        id: 'R-GH-002',
        referenceNumber: 'EC-GH-2026-1082',
        title: 'Clogged Sewer Main at East Legon',
        category: 'Blocked Drainage',
        description: 'Major drainage channel behind the shopping mall completely blocked with sand, silt, and commercial trash.',
        location: 'East Legon Extension, Accra',
        district: 'Greater Accra',
        municipality: 'Accra Metropolitan Assembly (AMA)',
        ward: 'Ward East Legon',
        zone: 'Zone Airport',
        priority: 'Medium',
        status: 'Completed',
        date: '2026-07-12',
        photos: [],
        gps: { lat: 5.6322, lng: -0.1654 },
        assignedTeam: 'AMA Drainage Task Force'
      }
    ],
    'NG': [
      {
        id: 'R-NG-001',
        referenceNumber: 'EC-NG-2026-3041',
        title: 'Industrial Runoff Spillage near Victoria Island',
        category: 'Hazardous Waste',
        description: 'Oily chemical substance leaking from a broken drum near the water canal, generating a yellow chemical film.',
        location: 'Adeola Odeku St, Victoria Island, Lagos',
        district: 'Lagos State',
        municipality: 'Lagos State Waste Management Authority (LAWMA)',
        ward: 'Ward Victoria Island',
        zone: 'Zone VI Island',
        priority: 'High',
        status: 'Pending',
        date: '2026-07-16',
        photos: [],
        gps: { lat: 6.4281, lng: 3.4219 }
      },
      {
        id: 'R-NG-002',
        referenceNumber: 'EC-NG-2026-3098',
        title: 'Illegal Tire Dumping in Ikeja Industrial Zone',
        category: 'Illegal Dumping',
        description: 'Over 150 heavy tires dumped on a vacant lot, collecting stagnant water and breeding high volumes of mosquitoes.',
        location: 'Obafemi Awolowo Way, Ikeja',
        district: 'Lagos State',
        municipality: 'Ikeja Local Government',
        ward: 'Ward Allen Avenue',
        zone: 'Zone Ikeja Central',
        priority: 'Medium',
        status: 'In Progress',
        date: '2026-07-15',
        photos: ['/assets/demo-waste.svg'],
        gps: { lat: 6.5912, lng: 3.3512 },
        assignedTeam: 'LAWMA Rapid Response 4'
      }
    ],
    'GN': [
      {
        id: 'R-GN-001',
        referenceNumber: 'EC-GN-2026-0041',
        title: 'Caniveau Bouché à Kaloum',
        category: 'Blocked Drainage',
        description: 'Trash blockage of several storm drains in front of the ministry, causing immediate flood risks for low offices.',
        location: 'Avenue de la République, Kaloum, Conakry',
        district: 'Conakry',
        municipality: 'Commune de Kaloum',
        ward: 'Ward Almamya',
        zone: 'Zone Kaloum Centre',
        priority: 'High',
        status: 'Pending',
        date: '2026-07-16',
        photos: [],
        gps: { lat: 9.5092, lng: -13.7121 }
      }
    ],
    'GM': [
      {
        id: 'R-GM-001',
        referenceNumber: 'EC-GM-2026-0012',
        title: 'Fish Waste Dumping near Banjul Coastline',
        category: 'Hazardous Waste',
        description: 'Organic fish waste and decay piles dumped on public beach sands near the packaging plant, creating extreme odor.',
        location: 'Banjul Public Beach Road, Banjul',
        district: 'Banjul',
        municipality: 'Banjul City Council (BCC)',
        ward: 'Ward Half Die',
        zone: 'Zone Banjul Port',
        priority: 'High',
        status: 'In Progress',
        date: '2026-07-16',
        photos: [],
        gps: { lat: 13.4431, lng: -16.5712 },
        assignedTeam: 'BCC Coastline Sanitary Crew'
      }
    ]
  };

  return baseReports[countryCode] || baseReports['SL'];
}
