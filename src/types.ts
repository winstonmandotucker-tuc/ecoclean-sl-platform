export type ViewState =
  | 'landing'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'forgot'
  | 'portal-selection'
  | 'citizen-dashboard'
  | 'staff-dashboard'
  | 'supervisor-dashboard'
  | 'admin-dashboard'
  | 'super-admin-dashboard'
  | 'unauthorized';

export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'staff' | 'supervisor' | 'admin' | 'super-admin';
  roleLabel?: string;
  municipality?: string | null;
  municipalityId?: number | null;
  district?: string | null;
  profileImageUrl?: string | null;
}

export interface SuccessStory {
  id: string;
  title: string;
  location: string;
  description: string;
  impact: string;
  imageUrl?: string;
}

export interface Partner {
  name: string;
  type: string;
}
