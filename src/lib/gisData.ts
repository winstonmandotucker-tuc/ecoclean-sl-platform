export interface GeoNode {
  id: string;
  name: string;
  type: 'country' | 'province' | 'district' | 'municipality' | 'ward' | 'zone';
  population?: number;
  areaSqKm?: number;
  children?: GeoNode[];
}

export interface GISRoute {
  id: string;
  name: string;
  province: string;
  pathD: string; // SVG path definition
  color: string;
  vehicle: string;
  status: 'In Progress' | 'Standby' | 'Completed';
  coverage: string;
}

export interface GISHotspot {
  id: string;
  name: string;
  x: number; // SVG canvas coordinate
  y: number;
  intensity: 'Critical' | 'High' | 'Medium';
  volume: string; // e.g. "8.5 tons"
  category: string;
  reportedDate: string;
}

export interface EnvironmentalRiskArea {
  id: string;
  name: string;
  type: 'Flood Zone' | 'Landslide Risk' | 'Leachate Runoff' | 'Erosion Hazard';
  cx: number; // Center X
  cy: number; // Center Y
  rx: number; // Radius X
  ry: number; // Radius Y
  severity: 'Extreme' | 'High' | 'Moderate';
  description: string;
}

// Full geographical hierarchy for Sierra Leone matching user requirements
export const INITIAL_SIERRA_LEONE_HIERARCHY: GeoNode = {
  id: 'SL-01',
  name: 'Sierra Leone',
  type: 'country',
  population: 8500000,
  areaSqKm: 71740,
  children: [
    {
      id: 'SL-PR-01',
      name: 'Western Area',
      type: 'province',
      population: 1500000,
      areaSqKm: 557,
      children: [
        {
          id: 'SL-DT-01',
          name: 'Western Urban',
          type: 'district',
          children: [
            {
              id: 'SL-MU-01',
              name: 'Freetown City Council (FCC)',
              type: 'municipality',
              children: [
                {
                  id: 'SL-WD-01',
                  name: 'Ward 301 (Aberdeen)',
                  type: 'ward',
                  children: [
                    { id: 'SL-ZN-01', name: 'Zone 1 (Kroo Bay Drainage)', type: 'zone' },
                    { id: 'SL-ZN-02', name: 'Zone 2 (Murray Town)', type: 'zone' }
                  ]
                },
                {
                  id: 'SL-WD-02',
                  name: 'Ward 302 (Lumley)',
                  type: 'ward',
                  children: [
                    { id: 'SL-ZN-03', name: 'Zone 3 (Juba)', type: 'zone' }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'SL-DT-02',
          name: 'Western Rural',
          type: 'district',
          children: [
            {
              id: 'SL-MU-02',
              name: 'Waterloo Rural District Council (WRDC)',
              type: 'municipality',
              children: [
                { id: 'SL-WD-03', name: 'Ward 310', type: 'ward', children: [] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'SL-PR-02',
      name: 'Northern Province',
      type: 'province',
      population: 2500000,
      areaSqKm: 35936,
      children: [
        {
          id: 'SL-DT-03',
          name: 'Bombali',
          type: 'district',
          children: [
            {
              id: 'SL-MU-03',
              name: 'Makeni City Council (MCC)',
              type: 'municipality',
              children: [
                { id: 'SL-WD-04', name: 'Ward 401 (Central)', type: 'ward', children: [] }
              ]
            }
          ]
        },
        { id: 'SL-DT-04', name: 'Tonkolili', type: 'district', children: [] },
        { id: 'SL-DT-05', name: 'Kambia', type: 'district', children: [] },
        { id: 'SL-DT-06', name: 'Karene', type: 'district', children: [] },
        { id: 'SL-DT-07', name: 'Falaba', type: 'district', children: [] }
      ]
    },
    {
      id: 'SL-PR-03',
      name: 'North Western Province',
      type: 'province',
      population: 1200000,
      areaSqKm: 13539,
      children: [
        { id: 'SL-DT-08', name: 'Port Loko', type: 'district', children: [] }
      ]
    },
    {
      id: 'SL-PR-04',
      name: 'Southern Province',
      type: 'province',
      population: 1800000,
      areaSqKm: 19694,
      children: [
        {
          id: 'SL-DT-09',
          name: 'Bo',
          type: 'district',
          children: [
            {
              id: 'SL-MU-04',
              name: 'Bo City Council (BCC)',
              type: 'municipality',
              children: [
                { id: 'SL-WD-05', name: 'Ward 104', type: 'ward', children: [] }
              ]
            }
          ]
        },
        { id: 'SL-DT-10', name: 'Bonthe', type: 'district', children: [] },
        { id: 'SL-DT-11', name: 'Moyamba', type: 'district', children: [] },
        { id: 'SL-DT-12', name: 'Pujehun', type: 'district', children: [] }
      ]
    },
    {
      id: 'SL-PR-05',
      name: 'Eastern Province',
      type: 'province',
      population: 1600000,
      areaSqKm: 15553,
      children: [
        {
          id: 'SL-DT-13',
          name: 'Kenema',
          type: 'district',
          children: [
            {
              id: 'SL-MU-05',
              name: 'Kenema City Council (KCC)',
              type: 'municipality',
              children: [
                { id: 'SL-WD-06', name: 'Ward 201', type: 'ward', children: [] }
              ]
            }
          ]
        },
        { id: 'SL-DT-14', name: 'Kailahun', type: 'district', children: [] },
        { id: 'SL-DT-15', name: 'Kono', type: 'district', children: [] }
      ]
    }
  ]
};

// SVG Paths representing the stylized provinces of Sierra Leone
// Map canvas box of 500x450
export const PROVINCE_PATHS = [
  {
    id: 'SL-PR-01',
    name: 'Western Area',
    d: 'M 40,225 C 42,220 46,220 48,225 C 50,235 48,245 42,250 C 38,245 36,235 40,225 Z',
    color: 'fill-teal-500/10 stroke-teal-500 hover:fill-teal-500/25',
    activeColor: 'fill-teal-500/30 stroke-teal-400',
    centerX: 43,
    centerY: 235
  },
  {
    id: 'SL-PR-03',
    name: 'North Western Province',
    d: 'M 40,210 L 80,140 L 130,130 L 170,170 L 140,230 L 90,220 Z',
    color: 'fill-sky-500/10 stroke-sky-500 hover:fill-sky-500/25',
    activeColor: 'fill-sky-500/30 stroke-sky-400',
    centerX: 105,
    centerY: 180
  },
  {
    id: 'SL-PR-02',
    name: 'Northern Province',
    d: 'M 130,130 L 210,60 L 330,60 L 350,150 L 260,200 L 170,170 Z',
    color: 'fill-emerald-500/10 stroke-emerald-500 hover:fill-emerald-500/25',
    activeColor: 'fill-emerald-500/30 stroke-emerald-400',
    centerX: 240,
    centerY: 120
  },
  {
    id: 'SL-PR-05',
    name: 'Eastern Province',
    d: 'M 350,150 L 440,160 L 470,240 L 430,330 L 310,290 L 260,200 Z',
    color: 'fill-amber-500/10 stroke-amber-500 hover:fill-amber-500/25',
    activeColor: 'fill-amber-500/30 stroke-amber-400',
    centerX: 380,
    centerY: 230
  },
  {
    id: 'SL-PR-04',
    name: 'Southern Province',
    d: 'M 140,230 L 260,200 L 310,290 L 290,390 L 190,380 L 110,310 Z',
    color: 'fill-indigo-500/10 stroke-indigo-500 hover:fill-indigo-500/25',
    activeColor: 'fill-indigo-500/30 stroke-indigo-400',
    centerX: 210,
    centerY: 300
  }
];

// Moving Sanitation/Dispatch Routes inside Freetown and other districts
export const VECTOR_ROUTES: GISRoute[] = [
  {
    id: 'RT-01',
    name: 'FCC Coastal Loop #1',
    province: 'Western Area',
    pathD: 'M 42,225 C 60,210 100,215 138,230 C 120,270 70,260 42,225',
    color: '#3b82f6',
    vehicle: 'Compactor SL-104',
    status: 'In Progress',
    coverage: 'Aberdeen, Murray Town & King Tom Landfill'
  },
  {
    id: 'RT-02',
    name: 'MCC Makeni Central Express',
    province: 'Northern Province',
    pathD: 'M 190,120 L 240,110 L 280,140 L 210,150 Z',
    color: '#10b981',
    vehicle: 'Skip Loader SL-209',
    status: 'Standby',
    coverage: 'Makeni Plaza, Clock Tower & Rogbaneh'
  },
  {
    id: 'RT-03',
    name: 'BCC Bo-Kenema Arterial Link',
    province: 'Southern Province',
    pathD: 'M 210,300 C 230,290 270,295 300,305 C 290,340 240,350 210,300',
    color: '#f59e0b',
    vehicle: 'Hauler SL-088',
    status: 'Completed',
    coverage: 'Bo Central and Highway Reclamation Site'
  }
];

export const STATIC_HOTSPOTS: GISHotspot[] = [
  {
    id: 'HS-01',
    name: 'Aberdeen Roundabout Waste Pile',
    x: 43,
    y: 228,
    intensity: 'High',
    volume: '4.2 Tons',
    category: 'Illegal Dumping',
    reportedDate: '2026-07-15'
  },
  {
    id: 'HS-02',
    name: 'Kroo Bay Estuary Backlog',
    x: 52,
    y: 237,
    intensity: 'Critical',
    volume: '12.8 Tons',
    category: 'Organic Overflow',
    reportedDate: '2026-07-16'
  },
  {
    id: 'HS-03',
    name: 'Makeni Market Transit Overflow',
    x: 235,
    y: 115,
    intensity: 'Medium',
    volume: '2.1 Tons',
    category: 'Mixed Commercial',
    reportedDate: '2026-07-14'
  },
  {
    id: 'HS-04',
    name: 'Bo Town Highway Scrap Pile',
    x: 215,
    y: 298,
    intensity: 'Critical',
    volume: '9.4 Tons',
    category: 'Hazardous/E-Waste',
    reportedDate: '2026-07-16'
  }
];

export const ENVIRONMENTAL_RISK_AREAS: EnvironmentalRiskArea[] = [
  {
    id: 'RS-01',
    name: 'Kroo Bay Slum Flooding Zone',
    type: 'Flood Zone',
    cx: 48,
    cy: 242,
    rx: 15,
    ry: 15,
    severity: 'Extreme',
    description: 'Highly vulnerable estuary slums prone to municipal plastic clogging and torrential backwash.'
  },
  {
    id: 'RS-02',
    name: 'Granville Brook Silt Runoff',
    type: 'Leachate Runoff',
    cx: 82,
    cy: 228,
    rx: 25,
    ry: 12,
    severity: 'High',
    description: 'Active chemical leachate seepage reaching coastal aquifers.'
  },
  {
    id: 'RS-03',
    name: 'Regent Mudslide Catchment',
    type: 'Landslide Risk',
    cx: 60,
    cy: 262,
    rx: 18,
    ry: 18,
    severity: 'Extreme',
    description: 'Active structural hazard and steep contour zones. Strict enforcement zone.'
  }
];
