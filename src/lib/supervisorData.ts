import { Report } from './citizenData';
import { StaffTask } from './staffData';

export interface FieldStaff {
  id: string;
  name: string;
  role: 'Driver' | 'Collector' | 'Sweeper' | 'Heavy Operator';
  status: 'Active' | 'On Duty' | 'Offline' | 'In Training';
  vessel: string;
  phone: string;
  district: string;
  municipality: string;
  rating: number;
  completedTasks: number;
  activeTaskId?: string;
  fuelBalance: string; // e.g., "75%"
  gps: { lat: number; lng: number };
}

export interface SLAMetric {
  id: string;
  taskId: string;
  taskTitle: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedDate: string;
  deadlineDate: string;
  elapsedMinutes: number;
  remainingMinutes: number;
  status: 'Safe' | 'Warning' | 'Breached' | 'Met';
}

export interface SupervisorNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  type: 'SLA Alert' | 'New Report' | 'Verification Request' | 'Fuel Request' | 'System Message';
  read: boolean;
  referenceId?: string; // Report ID or Task ID
}

export interface RegionPerformance {
  id: string;
  regionName: string;
  municipality: string;
  activeReports: number;
  resolvedToday: number;
  averageResolutionTime: string; // e.g. "3.5 hrs"
  slaCompliance: number; // percentage
  citizenSatisfaction: number; // scale 1-5
  teamsDeployed: number;
  wasteCollectedTons: number;
}

export const DEFAULT_FIELD_STAFF: FieldStaff[] = [
  {
    id: 'ST-201',
    name: 'Joseph Kamara',
    role: 'Driver',
    status: 'Active',
    vessel: 'Compactor SL-02',
    phone: '+232 77 410291',
    district: 'Western Urban',
    municipality: 'Freetown City Council (FCC)',
    rating: 4.9,
    completedTasks: 42,
    activeTaskId: 'T-101',
    fuelBalance: '82%',
    gps: { lat: 8.4842, lng: -13.2514 }
  },
  {
    id: 'ST-202',
    name: 'Amadu Bangura',
    role: 'Heavy Operator',
    status: 'Active',
    vessel: 'Hook-Truck SL-09',
    phone: '+232 76 892103',
    district: 'Western Urban',
    municipality: 'Freetown City Council (FCC)',
    rating: 4.7,
    completedTasks: 31,
    activeTaskId: 'T-102',
    fuelBalance: '45%',
    gps: { lat: 8.4901, lng: -13.2384 }
  },
  {
    id: 'ST-203',
    name: 'Fatmata Fofanah',
    role: 'Sweeper',
    status: 'On Duty',
    vessel: 'Sweeper SL-04',
    phone: '+232 33 223344',
    district: 'Bo',
    municipality: 'Bo City Council (BCC)',
    rating: 4.8,
    completedTasks: 28,
    activeTaskId: 'T-103',
    fuelBalance: '65%',
    gps: { lat: 7.9628, lng: -11.7402 }
  },
  {
    id: 'ST-204',
    name: 'Sahr Mattia',
    role: 'Collector',
    status: 'Offline',
    vessel: 'Pickup SL-11',
    phone: '+232 78 512239',
    district: 'Kono',
    municipality: 'Koidu New Sembehun City Council',
    rating: 4.5,
    completedTasks: 19,
    fuelBalance: '90%',
    gps: { lat: 8.6432, lng: -10.9682 }
  },
  {
    id: 'ST-205',
    name: 'Alusine Condeh',
    role: 'Driver',
    status: 'Active',
    vessel: 'Flatbed truck SL-11',
    phone: '+232 30 710928',
    district: 'Kenema',
    municipality: 'Kenema City Council (KCC)',
    rating: 4.6,
    completedTasks: 35,
    activeTaskId: 'T-104',
    fuelBalance: '50%',
    gps: { lat: 7.8761, lng: -11.1874 }
  }
];

export const DEFAULT_SUPERVISOR_NOTIFICATIONS: SupervisorNotification[] = [
  {
    id: 'SVN-01',
    title: 'SLA Breach Threat: Kroo Town Bridge',
    body: 'Task T-102 (Kroo Town Canal Blockage) priority is HIGH. SLA deadline expires in 45 minutes.',
    date: '10 mins ago',
    type: 'SLA Alert',
    read: false,
    referenceId: 'T-102'
  },
  {
    id: 'SVN-02',
    title: 'Verification Request: Lungi Beach',
    body: 'Operator Amadu Bangura has uploaded "after" evidence photos for Task T-106. Approval requested.',
    date: '30 mins ago',
    type: 'Verification Request',
    read: false,
    referenceId: 'T-106'
  },
  {
    id: 'SVN-03',
    title: 'New Waste Incident Reported',
    body: 'Citizen logged an "Overflowing Skip Bin" report near Central Bo (Ref: EC-SL-2026-1123).',
    date: '1 hour ago',
    type: 'New Report',
    read: false,
    referenceId: 'R-1123'
  },
  {
    id: 'SVN-04',
    title: 'Fuel Dispatch Authorization Required',
    body: 'Operator Joseph Kamara requested 20L diesel fuel allowance code for Compactor SL-02.',
    date: '2 hours ago',
    type: 'Fuel Request',
    read: true,
    referenceId: 'T-101'
  },
  {
    id: 'SVN-05',
    title: 'Monsoon Flooding Alert',
    body: 'Environmental Protection Agency Sierra Leone issued storm surge warns for coastal Freetown. Ensure all drainage operations are synchronized.',
    date: '5 hours ago',
    type: 'System Message',
    read: true
  }
];

export const DEFAULT_REGION_PERFORMANCE: RegionPerformance[] = [
  {
    id: 'RP-01',
    regionName: 'Western Urban (Freetown)',
    municipality: 'Freetown City Council (FCC)',
    activeReports: 24,
    resolvedToday: 12,
    averageResolutionTime: '2.8 hrs',
    slaCompliance: 94.2,
    citizenSatisfaction: 4.8,
    teamsDeployed: 8,
    wasteCollectedTons: 14.5
  },
  {
    id: 'RP-02',
    regionName: 'Bo District',
    municipality: 'Bo City Council (BCC)',
    activeReports: 8,
    resolvedToday: 4,
    averageResolutionTime: '4.1 hrs',
    slaCompliance: 88.5,
    citizenSatisfaction: 4.4,
    teamsDeployed: 3,
    wasteCollectedTons: 6.2
  },
  {
    id: 'RP-03',
    regionName: 'Kenema District',
    municipality: 'Kenema City Council (KCC)',
    activeReports: 5,
    resolvedToday: 3,
    averageResolutionTime: '3.6 hrs',
    slaCompliance: 90.0,
    citizenSatisfaction: 4.6,
    teamsDeployed: 2,
    wasteCollectedTons: 4.8
  },
  {
    id: 'RP-04',
    regionName: 'Bombali (Makeni)',
    municipality: 'Makeni City Council (MCC)',
    activeReports: 6,
    resolvedToday: 2,
    averageResolutionTime: '4.9 hrs',
    slaCompliance: 85.0,
    citizenSatisfaction: 4.2,
    teamsDeployed: 2,
    wasteCollectedTons: 3.5
  }
];

export const SLA_PRIORITY_TIMES = {
  High: 240, // 4 hours in minutes
  Medium: 720, // 12 hours in minutes
  Low: 1440 // 24 hours in minutes
};
