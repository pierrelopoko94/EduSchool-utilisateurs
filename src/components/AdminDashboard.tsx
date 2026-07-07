import React, { useState } from 'react';
import { 
  Shield, Users, BookOpen, Calendar, Check, AlertCircle, Sparkles, UserCheck, RefreshCw 
} from 'lucide-react';
import { School, Teacher } from '../types';

interface AdminDashboardProps {
  selectedSchool: School;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  triggerNotification: (msg: string) => void;
}

export default function AdminDashboard({
  selectedSchool,
  teachers,
  setTeachers,
  triggerNotification
}: AdminDashboardProps) {

  const [activeAdminTab, setActiveAdminTab] = useState<'teachers' | 'schedule'>('teachers');
  const [assignError, setAssignError] = useState<string | null>(null);

  // Simulated schedule dataset
  const [scheduleData, setScheduleData] = useState<any[]>([
    { id: 1, day: 'Lundi', time: '08h00 - 10h00', subject: 'Mathématiques', class: '3ème A', teacher: 'M. Dubois', room: 'Salle 102' },
    { id: 2, day: 'Lundi', time: '10h15 - 12h15', subject: 'Français', class: '3ème A', teacher: 'Mme. Martin', room: 'Salle 204' },
    { id: 3, day: 'Mardi', time: '08h00 - 10h00', subject: 'Physique-Chimie', class: '4ème B', teacher: 'M. Robert', room: 'Labo A' },
    { id: 4, day: 'Mardi', time: '14h00 - 16h00', subject: 'Histoire-Géo', class: 'Seconde 1', teacher: 'Mme. Durand', room: 'Salle 105' },
    { id: 5, day: 'Mercredi', time: '09h00 - 11h00', subject: 'Anglais', class: '3ème A', teacher: 'M. Petit', room: 'Salle 201' },
  ]);

  // Handle Teacher Status Change
  const handleStatusChange = (teacherId: string, nextStatus: 'titulaire' | 'normal') => {
    setAssignError(null);
    setTeachers(prev => prev.map(t => {
      if (t.id === teacherId) {
        if (nextStatus === 'normal') {
          triggerNotification(`Statut de ${t.name} modifié : Enseignant Normal.`);
          return { ...t, status: 'normal', assignedClass: '' };
        } else {
          // If turning to titulaire, it'll default to no class assigned yet until they select one
          return { ...t, status: 'titulaire' };
        }
      }
      return t;
    }));
  };

  // Handle Class Assignment with Titulaire Constraints Validation
  const handleClassAssignment = (teacherId: string, assignedClass: string) => {
    setAssignError(null);
    if (assignedClass === '') {
      setTeachers(prev => prev.map(t => {
        if (t.id === teacherId) {
          return { ...t, assignedClass: '' };
        }
        return t;
      }));
      return;
    }

    // Look for duplicate titulars for the target class
    const duplicate = teachers.find(
      t => t.id !== teacherId && t.status === 'titulaire' && t.assignedClass === assignedClass
    );

    if (duplicate) {
      const errMsg = `Conflit : ${duplicate.name} est déjà Enseignant Titulaire assigné à la classe ${assignedClass}. Un seul titulaire est autorisé par classe.`;
      setAssignError(errMsg);
      triggerNotification(`⚠️ ${errMsg}`);
      return;
    }

    // Success, update teacher
    setTeachers(prev => prev.map(t => {
      if (t.id === teacherId) {
        const updated = { ...t, assignedClass };
        triggerNotification(`✓ ${t.name} est désormais l'Enseignant Titulaire de la classe ${assignedClass} !`);
        return updated;
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold tracking-widest text-violet-800 uppercase">
            🛡️ ESPACE DIRECTION & ADMIN
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1B33] mt-1">Tableau de Bord Directeur</h2>
          <p className="text-xs text-slate-500">Pilotage administratif de l'établissement : <strong>{selectedSchool.name}</strong></p>
        </div>

        {/* Navigation list */}
        <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
          <button 
            onClick={() => setActiveAdminTab('teachers')}
            className={`px-3 py-1.5 rounded-lg transition ${activeAdminTab === 'teachers' ? 'bg-[#1A56DB] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Gérer les Enseignants
          </button>
          <button 
            onClick={() => setActiveAdminTab('schedule')}
            className={`px-3 py-1.5 rounded-lg transition ${activeAdminTab === 'schedule' ? 'bg-[#1A56DB] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Grille Horaires 📅
          </button>
        </div>
      </div>

      {/* CORE SCREENS */}

      {/* A. MANAGE TEACHERS (WITH CONFLICT CHECK) */}
      {activeAdminTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-6">
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Registre du Personnel Enseignant</h3>
              <p className="text-xs text-slate-400 mt-0.5">Affectation des rôles de titulariat par classe.</p>
            </div>
            <div className="text-[10px] font-bold uppercase text-[#1A56DB] bg-[#EAF1FE] px-3 py-1.5 rounded-full">
              Source de vérité partagée ⚡
            </div>
          </div>

          {/* Validation conflict Banner */}
          {assignError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-2xl flex items-start gap-2 text-xs font-semibold animate-scale">
              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{assignError}</span>
            </div>
          )}

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-black text-[9px] border-b border-slate-150">
                  <th className="px-4 py-3">Enseignant</th>
                  <th className="px-4 py-3">Discipline</th>
                  <th className="px-4 py-3">Statut administratif</th>
                  <th className="px-4 py-3">Classe attribuée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 transition text-slate-700">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                        {teacher.name.charAt(0)}
                      </span>
                      {teacher.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{teacher.subject}</td>
                    <td className="px-4 py-3">
                      <select
                        value={teacher.status}
                        onChange={(e) => handleStatusChange(teacher.id, e.target.value as 'titulaire' | 'normal')}
                        className="p-1 px-2 border-2 border-slate-200 rounded-lg text-[11px] font-bold focus:outline-none focus:border-[#1A56DB] bg-white cursor-pointer"
                      >
                        <option value="normal">Professeur régulier</option>
                        <option value="titulaire">👑 Titulaire de classe</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {teacher.status === 'titulaire' ? (
                        <select
                          value={teacher.assignedClass}
                          onChange={(e) => handleClassAssignment(teacher.id, e.target.value)}
                          className="p-1 px-2 border-2 border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold focus:outline-none focus:border-[#1A56DB] bg-emerald-50/20 cursor-pointer"
                        >
                          <option value="">-- Assigner Classe --</option>
                          <option value="3ème A">3ème A</option>
                          <option value="Seconde 1">Seconde 1</option>
                          <option value="CM2">CM2</option>
                          <option value="4ème B">4ème B</option>
                          <option value="Terminale S">Terminale S</option>
                        </select>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Non applicable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* B. VISUAL GRID SCHEDULE */}
      {activeAdminTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Planification des Grilles Horaires</h3>
            <p className="text-xs text-slate-400 mt-0.5">Emploi du temps général par matière, jour et salle de classe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.map((slot) => (
              <div key={slot.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="bg-[#EAF1FE] text-[#1A56DB] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{slot.day}</span>
                    <span className="text-slate-400 font-mono text-[10px] font-bold">{slot.time}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#0F1B33] mt-2">{slot.subject}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Classe : <strong>{slot.class}</strong> • Enseignant : {slot.teacher}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-150 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                  <span>Local : {slot.room}</span>
                  <span className="text-emerald-600">✓ Programmation Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
