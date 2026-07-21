export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface Report {
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
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Verified' | 'Completed' | 'Rejected';
  date: string;
  photos: string[];
  video?: string;
  gps: GPSCoordinates;
  assignedTeam?: string;
}

export interface CollectionSchedule {
  id: string;
  district: string;
  municipality: string;
  zone: string;
  collectionDay: string;
  collectionTime: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  type: 'Report Update' | 'Announcement' | 'Collection Alert' | 'Environmental Alert' | 'Community Event';
  read: boolean;
  reportId?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Cleanup Campaign' | 'Community Event' | 'Environmental Awareness Program' | 'Volunteer Activities';
  date: string;
  time: string;
  location: string;
  organizer: string;
  volunteersJoined: number;
  userJoined: boolean;
  description: string;
  maxVolunteers: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'Shield' | 'Award' | 'Sparkles' | 'Users';
  earned: boolean;
  dateEarned?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  location: string;
  points: number;
  isCurrentUser?: boolean;
}

export const DISTRICTS = [
  'Bo District',
  'Bombali District',
  'Bonthe District',
  'Falaba District',
  'Kailahun District',
  'Kambia District',
  'Karene District',
  'Kenema District',
  'Koinadugu District',
  'Kono District',
  'Moyamba District',
  'Port Loko District',
  'Pujehun District',
  'Tonkolili District',
  'Western Area Urban',
  'Western Area Rural'
];

export const MUNICIPALITIES: Record<string, string[]> = {
  'Bo District': ['Bo City Council (BCC)', 'Bo District Council'],
  'Bombali District': ['Makeni City Council (MCC)', 'Bombali District Council'],
  'Bonthe District': ['Bonthe Municipal Council', 'Bonthe District Council'],
  'Falaba District': ['Falaba District Council'],
  'Kailahun District': ['Kailahun District Council'],
  'Kambia District': ['Kambia District Council'],
  'Karene District': ['Karene District Council'],
  'Kenema District': ['Kenema City Council (KCC)', 'Kenema District Council'],
  'Koinadugu District': ['Koinadugu District Council'],
  'Kono District': ['Koidu New Sembehun City Council', 'Kono District Council'],
  'Moyamba District': ['Moyamba District Council'],
  'Port Loko District': ['Port Loko City Council (PLCC)', 'Port Loko District Council'],
  'Pujehun District': ['Pujehun District Council'],
  'Tonkolili District': ['Tonkolili District Council'],
  'Western Area Urban': ['Freetown City Council (FCC)'],
  'Western Area Rural': ['Western Area Rural District Council']
};

export const WASTE_CATEGORIES = [
  'Illegal Dumping',
  'Overflowing Waste Bin',
  'Blocked Drainage',
  'Missed Collection',
  'Waste Burning',
  'Hazardous Waste',
  'Construction Waste',
  'Other'
];

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export const DEFAULT_REPORTS: Report[] = [
  {
    id: 'R-9041',
    referenceNumber: 'EC-SL-2026-9041',
    title: 'Illegal Dumping at Kroo Town Corner',
    category: 'Illegal Dumping',
    description: 'Extensive household garbage and plastic piles are blocking the walkway. Animals are tearing up bags causing bad odors and public hazard.',
    location: 'Kroo Town Road, Freetown',
    district: 'Western Area Urban',
    municipality: 'Freetown City Council (FCC)',
    ward: 'Ward 301',
    zone: 'Zone 1 (Aberdeen & Central)',
    priority: 'High',
    status: 'In Progress',
    date: '2026-07-15',
    photos: ['/assets/demo-waste.svg'],
    gps: { lat: 8.4844, lng: -13.2344 },
    assignedTeam: 'Freetown Sanitary Crew Alpha'
  },
  {
    id: 'R-8172',
    referenceNumber: 'EC-SL-2026-8172',
    title: 'Clogged Drainage near Lumley Market',
    category: 'Blocked Drainage',
    description: 'Main gutter completely packed with single-use plastics and plastic beverage bottles. Rainwater is overflowing onto Lumley Market stalls.',
    location: 'Lumley Market, Freetown',
    district: 'Western Area Urban',
    municipality: 'Freetown City Council (FCC)',
    ward: 'Ward 302',
    zone: 'Zone 2 (Lumley & Aberdeen)',
    priority: 'High',
    status: 'Completed',
    date: '2026-07-14',
    photos: ['/assets/demo-waste.svg'],
    gps: { lat: 8.4682, lng: -13.2721 },
    assignedTeam: 'FCC Drainage Team B'
  },
  {
    id: 'R-1123',
    referenceNumber: 'EC-SL-2026-1123',
    title: 'Overflowing Skip Bin Central Bo',
    category: 'Overflowing Waste Bin',
    description: 'The green communal dumpster has not been emptied in over a week. Trash is piled three feet high around the bin and spilling into the street.',
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
];

export const DEFAULT_SCHEDULES: CollectionSchedule[] = [
  {
    id: 'sch-1',
    district: 'Western Area Urban',
    municipality: 'Freetown City Council (FCC)',
    zone: 'Zone 1 (Aberdeen)',
    collectionDay: 'Monday, Thursday',
    collectionTime: '07:00 AM - 11:00 AM'
  },
  {
    id: 'sch-2',
    district: 'Western Area Urban',
    municipality: 'Freetown City Council (FCC)',
    zone: 'Zone 2 (Lumley)',
    collectionDay: 'Tuesday, Friday',
    collectionTime: '08:00 AM - 12:00 PM'
  },
  {
    id: 'sch-3',
    district: 'Western Area Urban',
    municipality: 'Freetown City Council (FCC)',
    zone: 'Zone 3 (Calaba Town)',
    collectionDay: 'Wednesday, Saturday',
    collectionTime: '09:00 AM - 01:00 PM'
  },
  {
    id: 'sch-4',
    district: 'Bo District',
    municipality: 'Bo City Council (BCC)',
    zone: 'Zone Central A',
    collectionDay: 'Monday, Wednesday',
    collectionTime: '07:30 AM - 11:30 AM'
  },
  {
    id: 'sch-5',
    district: 'Kenema District',
    municipality: 'Kenema City Council (KCC)',
    zone: 'Zone Market Area',
    collectionDay: 'Tuesday, Saturday',
    collectionTime: '08:00 AM - 12:00 PM'
  },
  {
    id: 'sch-6',
    district: 'Bombali (Makeni) District',
    municipality: 'Makeni City Council (MCC)',
    zone: 'Zone MCC-4',
    collectionDay: 'Wednesday, Friday',
    collectionTime: '07:00 AM - 11:00 AM'
  },
  {
    id: 'sch-7',
    district: 'Western Area Rural',
    municipality: 'Waterloo Rural District Council (WRDC)',
    zone: 'Waterloo Station & Market',
    collectionDay: 'Tuesday, Friday',
    collectionTime: '06:00 AM - 10:00 AM'
  }
];

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'nt-1',
    title: 'Report Completed & Verified!',
    body: 'Your report EC-SL-2026-8172 (Clogged Drainage - Lumley Market) has been cleared. The ward inspector verified the clean state. +50 Reward Points have been credited!',
    date: 'Today, 08:30 AM',
    type: 'Report Update',
    read: false,
    reportId: 'EC-SL-2026-8172'
  },
  {
    id: 'nt-2',
    title: 'Heavy Rain Environmental Alert',
    body: 'Sierra Leone Met Office warns of sudden heavy rain in the Western Area. Please ensure all household drainage channels are free of plastic bottles to prevent flash floods.',
    date: 'Today, 06:15 AM',
    type: 'Environmental Alert',
    read: false
  },
  {
    id: 'nt-3',
    title: 'Beach Cleanup Campaign Saturday',
    body: 'Join the "Aberdeen Beach Coastal Cleanup" this Saturday at 07:00 AM. Free gloves, pickers, breakfast, and certificates. Let’s beat plastic pollution!',
    date: 'Yesterday, 14:20',
    type: 'Community Event',
    read: true
  },
  {
    id: 'nt-4',
    title: 'FCC Waste Collection Adjustments',
    body: 'Due to ongoing road work on Kissy Bypass, Thursday collection times for Ward 401 will temporarily shift from 07:00 AM to 11:00 AM.',
    date: '2 days ago',
    type: 'Collection Alert',
    read: true
  }
];

export const DEFAULT_EVENTS: CommunityEvent[] = [
  {
    id: 'ev-1',
    title: 'Aberdeen Beach Coastal Cleanup',
    category: 'Cleanup Campaign',
    date: 'Saturday, July 18, 2026',
    time: '07:00 AM - 10:30 AM',
    location: 'Aberdeen Beach Roundabout, Freetown',
    organizer: 'Ecoclean Secretariat & Green Salone NGO',
    volunteersJoined: 42,
    userJoined: false,
    description: 'Together with community youth councils, we are organizing a full sweep of the Aberdeen coastline to recover micro-plastics and ocean waste debris. Clean environment, healthy beach! Gloves, rakes, t-shirts, and light breakfast are provided.',
    maxVolunteers: 100
  },
  {
    id: 'ev-2',
    title: 'Domestic Composting & Recycling Seminar',
    category: 'Environmental Awareness Program',
    date: 'Wednesday, July 22, 2026',
    time: '04:00 PM - 06:00 PM',
    location: 'Congo Town Market Square, Freetown',
    organizer: 'Ministry of Health & Sanitation',
    volunteersJoined: 18,
    userJoined: false,
    description: 'Educational seminar targeting local business owners and market associations. Learn how to segregate organic waste and turn it into high-nutrient farm compost. Help reduce the load on our city dumps.',
    maxVolunteers: 50
  },
  {
    id: 'ev-3',
    title: 'Kroo Town Road Drainage Sweep',
    category: 'Volunteer Activities',
    date: 'Saturday, July 25, 2026',
    time: '07:30 AM - 11:00 AM',
    location: 'Kroo Town Road Market Area',
    organizer: 'Kroo Town Youth Empowerment Association',
    volunteersJoined: 29,
    userJoined: false,
    description: 'Manual desilting and trash clearing of the main storm water gutters along Kroo Town Road before the August peak monsoon rain. A highly active physical volunteer effort.',
    maxVolunteers: 80
  }
];

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'bd-1',
    name: 'Clean Community Champion',
    description: 'Earned by participating in at least one volunteer community cleanup campaign.',
    iconName: 'Users',
    earned: false
  },
  {
    id: 'bd-2',
    name: 'Top Reporter',
    description: 'Earned by submitting three or more verified waste reports.',
    iconName: 'Award',
    earned: false
  },
  {
    id: 'bd-3',
    name: 'Environmental Advocate',
    description: 'Successfully accumulate more than 200 environmental reward points.',
    iconName: 'Sparkles',
    earned: true,
    dateEarned: '2026-07-14'
  },
  {
    id: 'bd-4',
    name: 'Community Volunteer',
    description: 'Register and confirm volunteer slot for any upcoming environmental awareness program.',
    iconName: 'Shield',
    earned: false
  }
];

export const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Fatmata Sesay', location: 'Freetown', points: 1250 },
  { rank: 2, name: 'Mohamed Kamara', location: 'Bo', points: 980 },
  { rank: 3, name: 'Alusine Condeh', location: 'Kenema', points: 840 },
  { rank: 4, name: 'Isatu Bangura', location: 'Makeni', points: 790 },
  { rank: 5, name: 'Sahr Mattia', location: 'Kono', points: 620 },
  { rank: 6, name: 'Mariama Kallon', location: 'Waterloo', points: 510 },
  { rank: 7, name: 'Abdul Koroma', location: 'Port Loko', points: 430 }
];
