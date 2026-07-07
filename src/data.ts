import { School, Child } from './types';

export const SIMULATED_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Complexe Scolaire Saint-Joseph',
    code: 'JO-PARIS-75001',
    location: 'Paris, France (75001)',
    type: 'Maternelle, Primaire & Collège'
  },
  {
    id: 'school-2',
    name: 'Lycée Saint-Vincent',
    code: 'VI-LYON-69002',
    location: 'Lyon, France (69002)',
    type: 'Lycée Général & Technique'
  },
  {
    id: 'school-3',
    name: 'Collège Saint-Benoît',
    code: 'BE-LILLE-59000',
    location: 'Lille, France (59000)',
    type: 'Collège d\'enseignement secondaire'
  },
  {
    id: 'school-4',
    name: 'EduSchool International',
    code: 'ED-NICE-06000',
    location: 'Nice, France (06000)',
    type: 'Établissement International Bilingue'
  }
];

export const SIMULATED_CHILDREN: Child[] = [
  {
    id: 'child-1',
    name: 'Lucas Bernard',
    matricule: 'MAT-2026-001',
    className: '6ème A',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'child-2',
    name: 'Emma Bernard',
    matricule: 'MAT-2026-002',
    className: '4ème B',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'child-3',
    name: 'Chloé Moreau',
    matricule: 'MAT-2026-003',
    className: 'CM2',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'child-4',
    name: 'Thomas Petit',
    matricule: 'MAT-2026-004',
    className: 'Seconde 1',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'child-5',
    name: 'Léa Bernard',
    matricule: 'MAT-2026-005',
    className: '3ème C',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
  }
];
