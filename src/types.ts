/**
 * Types definition for the EduSchool registration process
 */

export type RoleType = 'eleve' | 'parent' | 'professeur' | 'admin';

export interface School {
  id: string;
  name: string;
  code: string;
  location: string;
  type: string;
}

export interface Child {
  id: string;
  name: string;
  matricule: string;
  className: string;
  avatarUrl: string;
}

export interface UserRegistration {
  email: string;
  password?: string;
  role: RoleType | null;
  isGoogleUser: boolean;
  googleName?: string;
}

export interface DemoState {
  currentStep: number; // 0 = Hero, 1 = Inscription, 2 = Rejoindre, 3 = Confirmation, 4 = Dashboard
  role: RoleType | null;
  selectedSchool: School | null;
  schoolCodeInput: string;
  associatedChildren: Child[];
  userEmail: string;
  isRegistered: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: 'titulaire' | 'normal';
  assignedClass?: string;
}

export interface AttendanceLog {
  id: string;
  studentName: string;
  className: string;
  timestamp: string;
  status: 'Présent' | 'En retard';
}

export interface Homework {
  id: number;
  subject: string;
  title: string;
  due: string;
  done: boolean;
  type: string;
}
