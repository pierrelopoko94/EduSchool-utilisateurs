import React, { useState } from 'react';
import { 
  Award, BookOpen, Calendar, CheckCircle2, Clock, Send, 
  QrCode, Play, Sparkles, Check, Search, AlertCircle, Edit, Trash2, PlusCircle
} from 'lucide-react';
import { School, Child, Teacher, AttendanceLog, Homework } from '../types';

interface TeacherDashboardProps {
  selectedSchool: School;
  userEmail: string;
  teachers: Teacher[];
  attendanceLogs: AttendanceLog[];
  setAttendanceLogs: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
  studentGrades: Record<string, number>;
  setStudentGrades: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  studentHomework: Homework[];
  setStudentHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
  triggerNotification: (msg: string) => void;
}

export default function TeacherDashboard({
  selectedSchool,
  userEmail,
  teachers,
  attendanceLogs,
  setAttendanceLogs,
  studentGrades,
  setStudentGrades,
  studentHomework,
  setStudentHomework,
  triggerNotification
}: TeacherDashboardProps) {

  const [activeTeacherTab, setActiveTeacherTab] = useState<'classes' | 'scanner' | 'titulaire'>('classes');
  const [selectedClass, setSelectedClass] = useState('3ème A');

  // Scanner States
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [scannerSearchQuery, setScannerSearchQuery] = useState('');

  // Homework Publish States
  const [hwTitle, setHwTitle] = useState('');
  const [hwDue, setHwDue] = useState('Demain');
  const [hwType, setHwType] = useState('DM');

  // Conduct appraisals state (Titulaire)
  const [conductAppraisals, setConductAppraisals] = useState<Record<string, string>>({
    'Lucas Bernard': 'Excellent investissement, travail de grande qualité.',
    'Emma Bernard': 'Élève brillante et rigoureuse, félicitations.',
    'Chloé Moreau': 'Des progrès notables ce trimestre, poursuivez ainsi.',
    'Thomas Petit': 'Attention aux bavardages, le potentiel est là.',
    'Léa Bernard': 'Très bon trimestre, investissement sérieux.'
  });
  const [appraisalsLocked, setAppraisalsLocked] = useState<Record<string, boolean>>({});

  // Active Teacher identification
  // Dubois is default Maths teacher
  const currentTeacher = teachers.find(t => t.name.includes('Dubois')) || {
    id: 't-1',
    name: 'M. Dubois',
    subject: 'Mathématiques',
    status: 'titulaire',
    assignedClass: '3ème A'
  };

  const isTitulaire = currentTeacher.status === 'titulaire';

  // Simulated class student rosters
  const studentRosters: Record<string, { id: string, name: string, matricule: string }[]> = {
    '3ème A': [
      { id: 'child-1', name: 'Lucas Bernard', matricule: 'MAT-38491' },
      { id: 'child-4', name: 'Thomas Petit', matricule: 'MAT-29384' },
      { id: 'child-5', name: 'Léa Bernard', matricule: 'MAT-10293' },
    ],
    'Seconde 1': [
      { id: 'child-2', name: 'Emma Bernard', matricule: 'MAT-49201' },
    ],
    '4ème B': [
      { id: 'child-3', name: 'Chloé Moreau', matricule: 'MAT-78392' },
    ]
  };

  const activeStudents = studentRosters[selectedClass] || [];

  // Manual Grade Input Change Handler
  const handleGradeChange = (studentName: string, value: string) => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 0 || val > 20) return;
    
    setStudentGrades(prev => ({
      ...prev,
      [studentName]: val
    }));
    triggerNotification(`Note de ${studentName} mise à jour : ${val}/20 ✓`);
  };

  // QR scanner simulation handler
  const handleSimulateScan = () => {
    // Select student randomly from all associated class rosters
    const allStudents = Object.values(studentRosters).flat();
    const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];

    // Check if already scanned today
    const alreadyScanned = attendanceLogs.some(
      log => log.studentName === randomStudent.name && log.timestamp !== ''
    );

    if (alreadyScanned) {
      setScanStatus({
        type: 'error',
        message: `Échec : ${randomStudent.name} est déjà enregistré(e) aujourd'hui.`
      });
      triggerNotification(`⚠️ Double scan détecté pour ${randomStudent.name}`);
      return;
    }

    // Determine status (Late or Present randomly for fun)
    const isLate = Math.random() > 0.6;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AttendanceLog = {
      id: `a-${Date.now()}`,
      studentName: randomStudent.name,
      className: Object.keys(studentRosters).find(k => studentRosters[k].some(s => s.name === randomStudent.name)) || 'Classe',
      timestamp: timeNow,
      status: isLate ? 'En retard' : 'Présent'
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setScanStatus({
      type: 'success',
      message: `Enregistré : ${randomStudent.name} (${newLog.className}) est marqué(e) ${newLog.status} à ${timeNow}.`
    });
    triggerNotification(`Scan réussi : ${randomStudent.name} ✓`);
  };

  // Toggle log status (Presenter to Late)
  const handleToggleLogStatus = (logId: string) => {
    setAttendanceLogs(prev => prev.map(log => {
      if (log.id === logId) {
        const nextStatus = log.status === 'Présent' ? 'En retard' : 'Présent';
        triggerNotification(`Statut modifié pour ${log.studentName} : ${nextStatus}`);
        return { ...log, status: nextStatus };
      }
      return log;
    }));
  };

  // Delete Log
  const handleDeleteLog = (logId: string) => {
    setAttendanceLogs(prev => prev.filter(log => log.id !== logId));
    triggerNotification(`Passage supprimé ✓`);
  };

  // Publish Homework handler
  const handlePublishHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (hwTitle.trim() === '') return;

    const newHw: Homework = {
      id: Date.now(),
      subject: currentTeacher.subject,
      title: hwTitle,
      due: hwDue,
      done: false,
      type: hwType
    };

    setStudentHomework(prev => [newHw, ...prev]);
    setHwTitle('');
    triggerNotification(`Devoir de ${currentTeacher.subject} publié pour toutes les classes !`);
  };

  // Appraisals Lock Form Validation
  const handleValidateAppraisal = (studentName: string) => {
    setAppraisalsLocked(prev => ({ ...prev, [studentName]: true }));
    triggerNotification(`Appréciation validée pour ${studentName} ✓`);
  };

  // Validate and submit report cards to Director (Admin)
  const [allValidated, setAllValidated] = useState(false);
  const handleFinalBulletinSubmit = () => {
    setAllValidated(true);
    triggerNotification("CONSEIL : Tous les bulletins de la classe 3ème A ont été validés et transmis au Directeur ! 🛡️");
  };

  // Filter scanning logs
  const filteredScannerLogs = attendanceLogs.filter(log => 
    log.studentName.toLowerCase().includes(scannerSearchQuery.toLowerCase()) ||
    log.className.toLowerCase().includes(scannerSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* Profil and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FE] px-3 py-1 text-[10px] font-bold tracking-widest text-[#1A56DB] uppercase">
              🏆 ESPACE ENSEIGNANT
            </span>
            {isTitulaire ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 text-violet-800 px-2.5 py-0.5 text-[10px] font-bold">
                👑 TITULAIRE DE CLASSE ({currentTeacher.assignedClass})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold">
                Professeur régulier
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1B33] mt-1">Espace de {currentTeacher.name}</h2>
          <p className="text-xs text-slate-500">Matière principale dispensée : <strong>{currentTeacher.subject}</strong></p>
        </div>

        {/* Navigation Tab list */}
        <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
          <button 
            onClick={() => setActiveTeacherTab('classes')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTeacherTab === 'classes' ? 'bg-[#1A56DB] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Mes Classes & Notes
          </button>
          <button 
            onClick={() => setActiveTeacherTab('scanner')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTeacherTab === 'scanner' ? 'bg-[#1A56DB] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Scanner QR Présence 📱
          </button>
          {isTitulaire && (
            <button 
              onClick={() => setActiveTeacherTab('titulaire')}
              className={`px-3 py-1.5 rounded-lg transition ${activeTeacherTab === 'titulaire' ? 'bg-[#1A56DB] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
            >
              👑 Titularat Bulletins
            </button>
          )}
        </div>
      </div>

      {/* CORE SECTIONS */}

      {/* A. CLASSES & NOTES */}
      {activeTeacherTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main grading matrix table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Carnet de Cotation Trimestre 3</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Saisie directe pour la classe sélectionnée</p>
                </div>

                {/* Class selector */}
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="text-xs font-bold border-2 border-slate-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:border-[#1A56DB] cursor-pointer"
                >
                  <option value="3ème A">Classe : 3ème A</option>
                  <option value="Seconde 1">Classe : Seconde 1</option>
                  <option value="4ème B">Classe : 4ème B</option>
                </select>
              </div>

              {activeStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[9px] border-b border-slate-150">
                        <th className="px-4 py-3">Élève</th>
                        <th className="px-4 py-3">Matricule</th>
                        <th className="px-4 py-3 text-center">Note Trimestre 3 (/20)</th>
                        <th className="px-4 py-3">Saisie rapide</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeStudents.map((student) => {
                        const grade = studentGrades[student.name] !== undefined ? studentGrades[student.name] : 14.0;
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition font-medium text-slate-700">
                            <td className="px-4 py-3 font-bold text-slate-900">{student.name}</td>
                            <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{student.matricule}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="font-bold text-sm text-[#1A56DB] bg-slate-100 px-3 py-1 rounded-lg border border-slate-150 font-mono">
                                {grade.toFixed(1)}/20
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                placeholder="Note"
                                value={studentGrades[student.name] || ''}
                                onChange={(e) => handleGradeChange(student.name, e.target.value)}
                                className="w-20 p-1 px-2 border-2 border-slate-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-[#1A56DB]"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Aucun élève enregistré dans cette classe.
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: publish homework */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FE] px-2.5 py-1 text-[9px] font-bold tracking-widest text-[#1A56DB] uppercase mb-3">
                <PlusCircle className="h-3.5 w-3.5" /> Devoir à Publier
              </div>
              <h3 className="text-sm font-black text-[#0F1B33]">Assigner un travail scolaire</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Renseignez le travail à effectuer. Il sera immédiatement visible sur les tableaux de bord Parents et Élèves correspondants.
              </p>

              <form onSubmit={handlePublishHomework} className="space-y-3.5">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Intitulé / Sujet de l'exercice</label>
                  <input
                    type="text"
                    placeholder="ex: Exercices 4 et 5 p.120"
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-medium"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Date d'échéance</label>
                    <input
                      type="text"
                      placeholder="Demain"
                      value={hwDue}
                      onChange={(e) => setHwDue(e.target.value)}
                      className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Type d'Évaluation</label>
                    <select
                      value={hwType}
                      onChange={(e) => setHwType(e.target.value)}
                      className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#1A56DB]"
                    >
                      <option value="DM">DM Maison</option>
                      <option value="Devoir">Devoir sur table</option>
                      <option value="Quiz">Quiz de Vocabulaire</option>
                      <option value="Projet">Projet Pratique</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#1A56DB] hover:bg-blue-700 text-white font-bold text-xs py-3.5 cursor-pointer transition shadow-xs flex items-center justify-center gap-1"
                >
                  Publier aux classes →
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* B. SCANNER QR DE PRÉSENCE */}
      {activeTeacherTab === 'scanner' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 max-w-4xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left scanner preview panel */}
            <div className="space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Scanner d'Assiduité</h3>
              <p className="text-xs text-slate-500">
                Pointez l'objectif de la tablette vers le QR code figurant sur le badge de l'élève ou simulez-le pour alimenter les statistiques de présence.
              </p>

              {/* The interactive screen simulator */}
              <div className="relative aspect-video w-full rounded-2xl bg-slate-900 border-4 border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center">
                {isScannerActive ? (
                  <>
                    {/* Laser scanning sweep line */}
                    <div className="absolute inset-x-0 h-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce z-10" />
                    
                    {/* Corner decorators */}
                    <div className="absolute top-4 left-4 h-6 w-6 border-t-4 border-l-4 border-emerald-400" />
                    <div className="absolute top-4 right-4 h-6 w-6 border-t-4 border-r-4 border-emerald-400" />
                    <div className="absolute bottom-4 left-4 h-6 w-6 border-b-4 border-l-4 border-emerald-400" />
                    <div className="absolute bottom-4 right-4 h-6 w-6 border-b-4 border-r-4 border-emerald-400" />

                    <QrCode className="h-16 w-16 text-emerald-400 opacity-60 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase mt-4">CAM_01_FEED : CAPTURE EN COURS...</span>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <QrCode className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsScannerActive(true);
                        setScanStatus({ type: 'idle', message: '' });
                      }}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 transition active:scale-95 cursor-pointer"
                    >
                      Démarrer le Scanner ⚡
                    </button>
                  </div>
                )}
              </div>

              {/* Action and feedback states */}
              {isScannerActive && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateScan}
                      className="flex-1 rounded-full bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 transition"
                    >
                      Simuler un scan badge élève ⚡
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsScannerActive(false)}
                      className="rounded-full border-2 border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 hover:bg-slate-50"
                    >
                      Éteindre Caméra
                    </button>
                  </div>

                  {/* Scan results badge status */}
                  {scanStatus.type !== 'idle' && (
                    <div className={`p-3 rounded-xl border text-xs font-bold ${
                      scanStatus.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                        : 'bg-red-50 text-red-800 border-red-100'
                    }`}>
                      {scanStatus.type === 'success' ? '✓ ' : '⚠️ '}
                      {scanStatus.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right logs monitor panel */}
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Passages Journaliers</h3>
                
                <div className="relative">
                  <Search className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 h-3.5 w-3.5 mt-2" />
                  <input
                    type="text"
                    placeholder="Chercher élève..."
                    value={scannerSearchQuery}
                    onChange={(e) => setScannerSearchQuery(e.target.value)}
                    className="text-[10px] pl-6 pr-2 py-1 border border-slate-350 rounded-lg focus:outline-none bg-white font-medium"
                  />
                </div>
              </div>

              <div className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {filteredScannerLogs.length > 0 ? (
                  filteredScannerLogs.map((log) => (
                    <div key={log.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 transition">
                      <div>
                        <div className="font-bold text-slate-900">{log.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.className} • {log.timestamp}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleLogStatus(log.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.status === 'Présent' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                          title="Changer d'état"
                        >
                          {log.status}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1 hover:bg-red-50 text-red-500 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-slate-400 text-xs">
                    Aucun passage enregistré aujourd'hui.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* C. TITULARIAT CONSEIL (BULLETINS VALIDATION) */}
      {isTitulaire && activeTeacherTab === 'titulaire' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 max-w-4xl mx-auto animate-fade-in text-left">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1B33]">Portail de Validation Finale du Titulaire</h3>
              <p className="text-xs text-slate-500">Validation des livrets d'appréciation pour la classe : <strong>{currentTeacher.assignedClass}</strong></p>
            </div>
            
            {!allValidated ? (
              <button
                type="button"
                onClick={handleFinalBulletinSubmit}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-3 rounded-full cursor-pointer transition shadow-xs active:scale-95 flex items-center gap-1"
              >
                Tout Valider & Envoyer au Directeur ✓
              </button>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5">
                ✓ Bulletins validés et transmis au Directeur
              </span>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 leading-relaxed">
            📢 En tant que <strong>Titulaire de classe</strong>, vous disposez d'un pouvoir décisionnel final. Saisissez l'appréciation globale de conduite et d'investissement pour chaque élève ci-dessous. Vos saisies seront immédiatement répercutées sur les bulletins consultables par les parents.
          </div>

          <div className="space-y-4">
            {(studentRosters['3ème A'] || []).map((student) => {
              const grade = studentGrades[student.name] !== undefined ? studentGrades[student.name] : 14.0;
              const isLocked = appraisalsLocked[student.name];
              
              return (
                <div key={student.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">Moyenne Générale : {grade.toFixed(1)}/20</span>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Appréciation de conduite du Titulaire :</span>
                      {isLocked ? (
                        <p className="text-slate-800 italic bg-white p-2 border border-slate-200 rounded-lg text-xs leading-relaxed font-semibold">
                          "{conductAppraisals[student.name]}"
                        </p>
                      ) : (
                        <input
                          type="text"
                          value={conductAppraisals[student.name] || ''}
                          onChange={(e) => setConductAppraisals({ ...conductAppraisals, [student.name]: e.target.value })}
                          className="w-full text-xs p-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] bg-white"
                          placeholder="Saisir appréciation..."
                        />
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex sm:flex-col gap-2 justify-end">
                    {!isLocked ? (
                      <button
                        type="button"
                        onClick={() => handleValidateAppraisal(student.name)}
                        className="w-full sm:w-auto bg-[#1A56DB] text-white hover:bg-blue-700 font-bold text-[10px] px-3.5 py-2 rounded-full cursor-pointer transition text-center"
                      >
                        Enregistrer l'avis ✓
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center justify-center gap-1">
                        ✓ Enregistré
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
