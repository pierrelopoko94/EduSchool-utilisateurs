import React, { useState } from 'react';
import { 
  GraduationCap, Users, Award, BookOpen, Calendar, 
  CheckCircle2, Clock, FileText, Send, User, 
  ChevronRight, Plus, Check, Star, RefreshCw, BarChart2, Bell, Shield
} from 'lucide-react';
import { School, RoleType, Child, Teacher, AttendanceLog, Homework } from '../types';
import ParentDashboard from './ParentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';

interface DashboardPreviewProps {
  selectedSchool: School;
  role: RoleType;
  associatedChildren: Child[];
  userEmail: string;
  onReset: () => void;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  attendanceLogs: AttendanceLog[];
  setAttendanceLogs: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
  unlockedBulletins: Record<string, boolean>;
  setUnlockedBulletins: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  studentGrades: Record<string, number>;
  setStudentGrades: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  studentHomework: Homework[];
  setStudentHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
}

export default function DashboardPreview({
  selectedSchool,
  role,
  associatedChildren,
  userEmail,
  onReset,
  teachers,
  setTeachers,
  attendanceLogs,
  setAttendanceLogs,
  unlockedBulletins,
  setUnlockedBulletins,
  studentGrades,
  setStudentGrades,
  studentHomework,
  setStudentHomework
}: DashboardPreviewProps) {
  const [notification, setNotification] = useState<string | null>(null);

  // Trigger temporary toast notification
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Student specific handlers
  const handleToggleHomework = (id: number) => {
    setStudentHomework(prev => prev.map(h => 
      h.id === id ? { ...h, done: !h.done } : h
    ));
    const h = studentHomework.find(h => h.id === id);
    if (h) {
      triggerNotification(`Devoir de ${h.subject} marqué comme ${!h.done ? 'terminé ✔️' : 'non terminé'}`);
    }
  };

  const completedHomeworkCount = studentHomework.filter(h => h.done).length;
  const homeworkPercentage = Math.round((completedHomeworkCount / studentHomework.length) * 100);

  // Average student grades
  const studentAverageValue = studentGrades['Lucas Bernard'] !== undefined ? studentGrades['Lucas Bernard'] : 14.5;

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-[#0F1B33] text-white px-5 py-3 rounded-full shadow-2xl border border-[#1A56DB] flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 ${
            role === 'eleve' ? 'bg-sky-500' :
            role === 'parent' ? 'bg-pink-500' :
            role === 'professeur' ? 'bg-amber-500' :
            'bg-violet-500'
          }`}>
            {role === 'eleve' && <GraduationCap className="h-7 w-7" />}
            {role === 'parent' && <Users className="h-6 w-6" />}
            {role === 'professeur' && <Award className="h-6 w-6" />}
            {role === 'admin' && <Shield className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1B33]">
                {role === 'eleve' && "Portail Élève"}
                {role === 'parent' && "Suivi Parent d'Élève"}
                {role === 'professeur' && "Console Enseignant"}
                {role === 'admin' && "Espace Direction"}
              </h2>
              <span className="text-[10px] font-mono bg-blue-50 text-[#1A56DB] px-2 py-0.5 rounded-full font-bold">
                Espace Actif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="font-bold text-[#0F1B33]">{selectedSchool.name}</span>
              <span>•</span>
              <span className="font-mono text-[10px]">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Quick Back Reset Action */}
        <button
          onClick={onReset}
          className="rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F1B33] text-xs font-bold px-5 py-3 transition cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Réinitialiser la simulation
        </button>
      </div>

      {/* RENDER CHOSEN PORTAL VIEW */}

      {/* 1. PORTAL ELEVE (🎓) */}
      {role === 'eleve' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-left">
          {/* Left panel: student stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stat widgets */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
              <h3 className="text-sm font-extrabold text-[#0F1B33] uppercase tracking-wider mb-4">Mes Indicateurs Académiques</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ma Moyenne</span>
                  <span className="text-2xl font-black text-[#1A56DB] mt-1 block">
                    {studentAverageValue.toFixed(1)}/20
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Avancement Devoirs</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">{homeworkPercentage}%</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rang Estimé</span>
                  <span className="text-2xl font-black text-amber-500 mt-1 block">4e/28</span>
                </div>
              </div>
            </div>

            {/* Student homework lists */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-extrabold text-[#0F1B33] uppercase tracking-wider">Cahier de Textes & Devoirs à rendre</h3>
                <span className="text-xs font-mono font-bold text-slate-400">{completedHomeworkCount}/{studentHomework.length} rendus</span>
              </div>

              <div className="space-y-3">
                {studentHomework.map((hw) => (
                  <div 
                    key={hw.id}
                    onClick={() => handleToggleHomework(hw.id)}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                      hw.done 
                        ? 'bg-emerald-50/20 border-emerald-150/40 opacity-75' 
                        : 'bg-slate-50/50 border-slate-200/50 hover:border-[#1A56DB]/30 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1.5 h-4.5 w-4.5 rounded flex items-center justify-center border transition ${
                        hw.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                      }`}>
                        {hw.done && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="inline-block text-[9px] font-bold text-slate-400 uppercase tracking-wider">{hw.subject} • {hw.type}</span>
                        <h4 className={`text-xs font-extrabold text-slate-800 mt-0.5 ${hw.done ? 'line-through text-slate-400 font-medium' : ''}`}>{hw.title}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-150">{hw.due}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column: Schedule */}
          <div className="space-y-6">
            <div className="bg-[#0F1B33] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A56DB]/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-[9px] font-bold text-sky-400 font-mono tracking-widest">MON COMPTE ÉLÈVE</h4>
                  <div className="text-sm font-black text-white">Lucas Bernard</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Classe de 3ème A</div>
                </div>
              </div>
            </div>

            {/* Generated QR Code Badge (Assiduité) */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center gap-1.5 self-start">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Badge QR d'Assiduité</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center relative group">
                <div className="h-28 w-28 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-5 gap-0.5 h-full w-full opacity-95">
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                    <div className="bg-slate-200 rounded-xs"></div>
                    <div className="bg-[#0F1B33] rounded-xs"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#0F1B33]/90 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl flex flex-col items-center justify-center p-2 text-white text-[10px] font-semibold">
                  <span className="font-mono text-[10px] text-emerald-400">MAT-2026-001</span>
                  <span className="text-[8px] text-slate-300 mt-1 text-center px-1">Scanner d'assiduité scolaire</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Généré automatiquement dès confirmation de votre inscription. Présentez ce badge à vos professeurs pour le scan de présence.
              </p>
            </div>

            {/* Courses schedules */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-100">
              <h4 className="text-xs font-extrabold text-[#0F1B33] uppercase tracking-wider mb-3">Emploi du temps - Aujourd'hui</h4>
              <div className="space-y-3 text-xs">
                <div className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition">
                  <span className="font-mono text-slate-400 font-bold pt-0.5">08:00</span>
                  <div>
                    <h5 className="font-bold text-slate-800">Mathématiques</h5>
                    <p className="text-[10px] text-slate-400 font-medium">M. Dubois • Salle 102</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition">
                  <span className="font-mono text-slate-400 font-bold pt-0.5">10:15</span>
                  <div>
                    <h5 className="font-bold text-slate-800">Français</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Mme. Martin • Salle 204</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition">
                  <span className="font-mono text-slate-400 font-bold pt-0.5">14:00</span>
                  <div>
                    <h5 className="font-bold text-slate-800">Histoire-Géographie</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Mme. Durand • Salle 105</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PORTAL PARENT (👥) - MODULARIZED */}
      {role === 'parent' && (
        <ParentDashboard
          selectedSchool={selectedSchool}
          associatedChildren={associatedChildren}
          userEmail={userEmail}
          teachers={teachers}
          attendanceLogs={attendanceLogs}
          setAttendanceLogs={setAttendanceLogs}
          unlockedBulletins={unlockedBulletins}
          setUnlockedBulletins={setUnlockedBulletins}
          studentGrades={studentGrades}
          setStudentGrades={setStudentGrades}
          studentHomework={studentHomework}
          setStudentHomework={setStudentHomework}
          triggerNotification={triggerNotification}
        />
      )}

      {/* 3. PORTAL TEACHER (🏆) - MODULARIZED */}
      {role === 'professeur' && (
        <TeacherDashboard
          selectedSchool={selectedSchool}
          userEmail={userEmail}
          teachers={teachers}
          attendanceLogs={attendanceLogs}
          setAttendanceLogs={setAttendanceLogs}
          studentGrades={studentGrades}
          setStudentGrades={setStudentGrades}
          studentHomework={studentHomework}
          setStudentHomework={setStudentHomework}
          triggerNotification={triggerNotification}
        />
      )}

      {/* 4. PORTAL ADMIN (🛡️) - MODULARIZED */}
      {role === 'admin' && (
        <AdminDashboard
          selectedSchool={selectedSchool}
          teachers={teachers}
          setTeachers={setTeachers}
          triggerNotification={triggerNotification}
        />
      )}

    </div>
  );
}
