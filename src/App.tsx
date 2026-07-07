import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Step1Inscription from './components/Step1Inscription';
import Step2Rejoindre from './components/Step2Rejoindre';
import Step3Confirmation from './components/Step3Confirmation';
import DashboardPreview from './components/DashboardPreview';
import InspectionPanel from './components/InspectionPanel';
import { RoleType, School, Child, Teacher, AttendanceLog, Homework } from './types';
import { SIMULATED_SCHOOLS } from './data';
import { CheckCircle2, Award, Users, GraduationCap, RefreshCw } from 'lucide-react';

export default function App() {
  // App States
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolCodeInput, setSchoolCodeInput] = useState<string>('');
  const [associatedChildren, setAssociatedChildren] = useState<Child[]>([]);

  // Central Shared States
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 't-1', name: 'M. Dubois', subject: 'Mathématiques', status: 'titulaire', assignedClass: '3ème A' },
    { id: 't-2', name: 'Mme. Martin', subject: 'Français', status: 'normal', assignedClass: '' },
    { id: 't-3', name: 'M. Robert', subject: 'Physique-Chimie', status: 'normal', assignedClass: '' },
    { id: 't-4', name: 'Mme. Durand', subject: 'Histoire-Géographie', status: 'normal', assignedClass: '' },
    { id: 't-5', name: 'M. Petit', subject: 'Anglais', status: 'titulaire', assignedClass: 'Seconde 1' },
  ]);

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    { id: 'a-1', studentName: 'Lucas Bernard', className: '6ème A', timestamp: '08:31:45', status: 'Présent' },
    { id: 'a-2', studentName: 'Emma Bernard', className: '4ème B', timestamp: '08:34:12', status: 'Présent' },
  ]);

  const [unlockedBulletins, setUnlockedBulletins] = useState<Record<string, boolean>>({});

  const [studentGrades, setStudentGrades] = useState<Record<string, number>>({
    'Lucas Bernard': 14.5,
    'Emma Bernard': 16.0,
    'Chloé Moreau': 12.0,
    'Thomas Petit': 9.5,
    'Léa Bernard': 15.0
  });

  const [studentHomework, setStudentHomework] = useState<Homework[]>([
    { id: 1, subject: 'Mathématiques', title: 'Exercices 4 et 5 p.120 (Dérivées)', due: 'Demain', done: false, type: 'DM' },
    { id: 2, subject: 'Histoire-Géographie', title: 'Fiche de lecture sur la Guerre Froide', due: 'Dans 3 jours', done: true, type: 'Devoir' },
    { id: 3, subject: 'SVT', title: 'Schéma de la cellule végétale légendé', due: 'Dans 5 jours', done: false, type: 'Dessin' },
    { id: 4, subject: 'Anglais', title: 'Vocabulary Quiz Unit 4', due: 'Lundi prochain', done: false, type: 'Quiz' },
  ]);

  // Page title sync
  useEffect(() => {
    document.title = "EduSchool - Rejoindre une école";
  }, []);

  // Reset helper
  const handleReset = () => {
    setCurrentStep(0);
    setUserEmail('');
    setRole(null);
    setSelectedSchool(null);
    setSchoolCodeInput('');
    setAssociatedChildren([]);
    // Reset shared state
    setUnlockedBulletins({});
    setAttendanceLogs([
      { id: 'a-1', studentName: 'Lucas Bernard', className: '6ème A', timestamp: '08:31:45', status: 'Présent' },
      { id: 'a-2', studentName: 'Emma Bernard', className: '4ème B', timestamp: '08:34:12', status: 'Présent' },
    ]);
    setStudentGrades({
      'Lucas Bernard': 14.5,
      'Emma Bernard': 16.0,
      'Chloé Moreau': 12.0,
      'Thomas Petit': 9.5,
      'Léa Bernard': 15.0
    });
    setTeachers([
      { id: 't-1', name: 'M. Dubois', subject: 'Mathématiques', status: 'titulaire', assignedClass: '3ème A' },
      { id: 't-2', name: 'Mme. Martin', subject: 'Français', status: 'normal', assignedClass: '' },
      { id: 't-3', name: 'M. Robert', subject: 'Physique-Chimie', status: 'normal', assignedClass: '' },
      { id: 't-4', name: 'Mme. Durand', subject: 'Histoire-Géographie', status: 'normal', assignedClass: '' },
      { id: 't-5', name: 'M. Petit', subject: 'Anglais', status: 'titulaire', assignedClass: 'Seconde 1' },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative pb-16">
      
      {/* Top sticky Navbar with Demo modes */}
      <Header 
        currentStep={currentStep} 
        setStep={setCurrentStep} 
        role={role} 
        setRole={(r) => setRole(r)} 
      />

      {/* STEP PROGRESS BAR (For Step 1, 2, and 3) */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div className="bg-white border-b border-slate-100 py-4 shadow-xs">
          <div className="mx-auto max-w-2xl px-4 flex justify-between items-center text-xs font-semibold text-slate-500">
            <button 
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 transition ${currentStep === 1 ? 'text-[#1A56DB] font-extrabold' : 'hover:text-[#1A56DB]'}`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-[#1A56DB] text-white' : 'bg-slate-100'}`}>1</span>
              <span>Identifiants</span>
            </button>
            <div className="h-0.5 bg-slate-150 flex-1 mx-4 max-w-[40px] sm:max-w-[80px]"></div>
            
            <button 
              onClick={() => {
                if (userEmail && role) setCurrentStep(2);
              }}
              disabled={!userEmail || !role}
              className={`flex items-center gap-1.5 transition disabled:opacity-50 disabled:pointer-events-none ${currentStep === 2 ? 'text-[#1A56DB] font-extrabold' : 'hover:text-[#1A56DB]'}`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-[#1A56DB] text-white' : 'bg-slate-100'}`}>2</span>
              <span>Rattachement</span>
            </button>
            <div className="h-0.5 bg-slate-150 flex-1 mx-4 max-w-[40px] sm:max-w-[80px]"></div>
            
            <button 
              onClick={() => {
                if (userEmail && role && selectedSchool && schoolCodeInput === selectedSchool.code) setCurrentStep(3);
              }}
              disabled={!userEmail || !role || !selectedSchool || schoolCodeInput !== selectedSchool.code}
              className={`flex items-center gap-1.5 transition disabled:opacity-50 disabled:pointer-events-none ${currentStep === 3 ? 'text-[#1A56DB] font-extrabold' : 'hover:text-[#1A56DB]'}`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-[#1A56DB] text-white' : 'bg-slate-100'}`}>3</span>
              <span>Confirmation</span>
            </button>
          </div>
        </div>
      )}

      {/* CORE SCREENS ROUTING */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {/* 0. HERO ACCUEIL SCREEN */}
        {currentStep === 0 && (
          <HeroSection onStart={() => setCurrentStep(1)} />
        )}

        {/* 1. INCRIPTION & PROFILE SCREEN (Render with delicate dots-pattern background wrapper) */}
        {currentStep === 1 && (
          <div className="relative py-8 md:py-14 px-4 flex-1 flex flex-col justify-center">
            {/* Dots background around general form context */}
            <div className="absolute inset-0 dots-pattern pointer-events-none" />
            <div className="relative z-10 w-full">
              <Step1Inscription 
                email={userEmail}
                setEmail={setUserEmail}
                role={role}
                setRole={(r) => setRole(r)}
                onNext={() => setCurrentStep(2)}
              />
            </div>
          </div>
        )}

        {/* 2. REJOINDRE L'ÉCOLE SCREEN (Render with delicate dots-pattern background wrapper) */}
        {currentStep === 2 && (
          <div className="relative py-8 md:py-14 px-4 flex-1 flex flex-col justify-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" />
            <div className="relative z-10 w-full">
              <Step2Rejoindre 
                selectedSchool={selectedSchool}
                setSelectedSchool={setSelectedSchool}
                schoolCodeInput={schoolCodeInput}
                setSchoolCodeInput={setSchoolCodeInput}
                onPrev={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            </div>
          </div>
        )}

        {/* 3. CONFIRMATION SCREEN (Render with delicate dots-pattern background wrapper) */}
        {currentStep === 3 && (
          <div className="relative py-8 md:py-14 px-4 flex-1 flex flex-col justify-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" />
            <div className="relative z-10 w-full">
              <Step3Confirmation 
                selectedSchool={selectedSchool || SIMULATED_SCHOOLS[0]}
                role={role || 'eleve'}
                associatedChildren={associatedChildren}
                setAssociatedChildren={setAssociatedChildren}
                onPrev={() => setCurrentStep(2)}
                onFinish={() => setCurrentStep(4)}
              />
            </div>
          </div>
        )}

        {/* 4. WORKSPACE DASHBOARD PREVIEW SCREEN */}
        {currentStep === 4 && (
          <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex-1 flex flex-col justify-start">
            <DashboardPreview 
              selectedSchool={selectedSchool || SIMULATED_SCHOOLS[0]}
              role={role || 'eleve'}
              associatedChildren={associatedChildren}
              userEmail={userEmail || 'pierre.dupont@gmail.com'}
              onReset={handleReset}
              teachers={teachers}
              setTeachers={setTeachers}
              attendanceLogs={attendanceLogs}
              setAttendanceLogs={setAttendanceLogs}
              unlockedBulletins={unlockedBulletins}
              setUnlockedBulletins={setUnlockedBulletins}
              studentGrades={studentGrades}
              setStudentGrades={setStudentGrades}
              studentHomework={studentHomework}
              setStudentHomework={setStudentHomework}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0F1B33] text-slate-400 py-6 border-t border-slate-800 text-xs text-center font-sans">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EduSchool Inc. Tous droits réservés. Charte d'accessibilité multi-établissements.</p>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Démo EduSchool - CGU"); }} className="hover:text-white transition">CGU</a>
            <span>•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Démo EduSchool - Confidentialité"); }} className="hover:text-white transition">Confidentialité</a>
            <span>•</span>
            <button 
              onClick={handleReset}
              className="text-[#1A56DB] hover:underline font-semibold cursor-pointer"
            >
              Réinitialiser la Démo
            </button>
          </div>
        </div>
      </footer>

      {/* REAL-TIME COLLAPSIBLE STATE DIAGNOSTICS MONITOR (Outil d'inspection) */}
      <InspectionPanel 
        currentStep={currentStep}
        role={role}
        selectedSchool={selectedSchool}
        schoolCodeInput={schoolCodeInput}
        associatedChildren={associatedChildren}
        userEmail={userEmail}
      />

    </div>
  );
}
