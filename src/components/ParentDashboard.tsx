import React, { useState } from 'react';
import { 
  Users, User, BookOpen, Calendar, CheckCircle2, Clock, Send, 
  Lock, CreditCard, Smartphone, Download, Search, AlertCircle, Sparkles, Check
} from 'lucide-react';
import { School, Child, Teacher, AttendanceLog, Homework } from '../types';

interface ParentDashboardProps {
  selectedSchool: School;
  associatedChildren: Child[];
  userEmail: string;
  teachers: Teacher[];
  attendanceLogs: AttendanceLog[];
  setAttendanceLogs: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
  unlockedBulletins: Record<string, boolean>;
  setUnlockedBulletins: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  studentGrades: Record<string, number>;
  setStudentGrades: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  studentHomework: Homework[];
  setStudentHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
  triggerNotification: (msg: string) => void;
}

export default function ParentDashboard({
  selectedSchool,
  associatedChildren,
  userEmail,
  teachers,
  attendanceLogs,
  setAttendanceLogs,
  unlockedBulletins,
  setUnlockedBulletins,
  studentGrades,
  setStudentGrades,
  studentHomework,
  setStudentHomework,
  triggerNotification
}: ParentDashboardProps) {
  
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [activeParentTab, setActiveParentTab] = useState<'suivi' | 'bulletin' | 'paiements' | 'messagerie'>('suivi');
  const [activeChildSubTab, setActiveChildSubTab] = useState<'notes' | 'presences' | 'devoirs'>('notes');

  // Justified local state (integrated into parent actions)
  const [justifiedAbsences, setJustifiedAbsences] = useState<Record<string, boolean>>({});

  // Payment states (For Bulletin)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [phoneOperator, setPhoneOperator] = useState('airtel');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment states (For Tuition Fees)
  const [isTuitionModalOpen, setIsTuitionModalOpen] = useState(false);
  const [tuitionAmount, setTuitionAmount] = useState('250');
  const [tuitionMethod, setTuitionMethod] = useState('airtel');
  const [tuitionPhone, setTuitionPhone] = useState('');
  const [tuitionLoading, setTuitionLoading] = useState(false);

  // Messagerie states
  const [selectedRecipientType, setSelectedRecipientType] = useState<'admin' | 'teacher'>('admin');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  
  const [messageThreads, setMessageThreads] = useState<any[]>([
    { id: 1, sender: 'Administration', text: "Bonjour, le dossier d'inscription pour votre enfant est validé.", time: "Hier, 14:30" },
    { id: 2, sender: 'Parent', text: "Merci pour l'information. Bonne journée.", time: "Hier, 15:12" },
    { id: 3, sender: 'M. Dubois', text: "Bonjour, Lucas Bernard montre une excellente participation ce trimestre.", time: "Lundi, 10:15" },
    { id: 4, sender: 'Administration', text: "Rappel : la réunion parents-professeurs a lieu ce vendredi à 16h.", time: "05/07/2026, 09:00" },
  ]);

  // Tuition Payments simulated DB
  const [tuitionPayments, setTuitionPayments] = useState<Record<string, { total: number, paid: number, history: any[] }>>({
    'child-1': { 
      total: 1500, 
      paid: 1000, 
      history: [
        { id: 1, type: 'Tranche Scolarité 1', amount: 500, method: 'Mobile Money (Orange)', date: '12/09/2025', status: 'Validé' },
        { id: 2, type: 'Tranche Scolarité 2', amount: 500, method: 'Carte Bancaire', date: '15/01/2026', status: 'Validé' },
      ]
    },
    'child-2': { 
      total: 1500, 
      paid: 500, 
      history: [
        { id: 1, type: 'Tranche Scolarité 1', amount: 500, method: 'Mobile Money (M-Pesa)', date: '10/09/2025', status: 'Validé' },
      ]
    },
    'child-3': { 
      total: 1200, 
      paid: 1200, 
      history: [
        { id: 1, type: 'Paiement Annuel Intégral', amount: 1200, method: 'Mobile Money (Airtel)', date: '08/09/2025', status: 'Validé' },
      ]
    },
  });

  const activeChild = associatedChildren[activeChildIndex];

  if (!activeChild) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-md border border-slate-100 max-w-xl mx-auto">
        <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-extrabold text-[#0F1B33]">Aucun enfant rattaché à votre compte</h3>
        <p className="text-sm text-slate-500 mt-1">Saisissez un nom lors de l'étape de confirmation pour lier un enfant.</p>
      </div>
    );
  }

  // Get active teachers for child
  const childTeachers = teachers; // For simulation, child has access to all active teachers

  // Calculated subject averages
  const mathsGrade = studentGrades[activeChild.name] !== undefined ? studentGrades[activeChild.name] : 14.5;
  const childGradesBreakdown = [
    { name: 'Mathématiques', grade: mathsGrade, coef: 4, teacher: 'M. Dubois', trend: 'up' },
    { name: 'Français', grade: 13.5, coef: 3, teacher: 'Mme. Martin', trend: 'stable' },
    { name: 'Physique-Chimie', grade: 15.0, coef: 2, teacher: 'M. Robert', trend: 'up' },
    { name: 'Histoire-Géographie', grade: 12.5, coef: 2, teacher: 'Mme. Durand', trend: 'down' },
    { name: 'Anglais', grade: 16.0, coef: 2, teacher: 'M. Petit', trend: 'up' },
  ];

  const totalCoef = childGradesBreakdown.reduce((sum, s) => sum + s.coef, 0);
  const totalPoints = childGradesBreakdown.reduce((sum, s) => sum + s.grade * s.coef, 0);
  const calculatedAverage = Math.round((totalPoints / totalCoef) * 10) / 10;

  // Absences count
  const childLogs = attendanceLogs.filter(log => log.studentName === activeChild.name);
  const lateCount = childLogs.filter(log => log.status === 'En retard').length;
  const absenceCount = justifiedAbsences[activeChild.id] ? 0 : 1;
  const attendanceRate = Math.round(((30 - absenceCount) / 30) * 100);

  // Homework pending count
  const childHomeworkList = studentHomework;
  const pendingHomeworkCount = childHomeworkList.filter(h => !h.done).length;

  // Bulletin unlock check
  const isUnlocked = unlockedBulletins[`${activeChild.id}-T3`] || false;

  // Handle messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;

    let contactName = "Administration";
    if (selectedRecipientType === 'teacher') {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      contactName = teacher ? `${teacher.name} (${teacher.subject})` : "Professeur";
    }

    const newMsg = {
      id: Date.now(),
      sender: 'Parent',
      recipient: contactName,
      text: messageInput,
      time: "Aujourd'hui, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessageThreads([...messageThreads, newMsg]);
    setMessageInput('');
    triggerNotification(`Message envoyé avec succès à : ${contactName} !`);

    // Simulated reply
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        sender: contactName,
        recipient: 'Parent',
        text: `Bien reçu votre message concernant ${activeChild.name}. Nous revenons vers vous dans les meilleurs délais.`,
        time: "Aujourd'hui, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessageThreads(prev => [...prev, replyMsg]);
      triggerNotification(`Nouveau message de : ${contactName} 💬`);
    }, 4000);
  };

  // Handle Justify Absence
  const handleJustifyAbsence = () => {
    setJustifiedAbsences(prev => ({ ...prev, [activeChild.id]: true }));
    triggerNotification("Absence justifiée avec succès auprès de l'établissement !");
  };

  // Handle Bulletin Payment Unlock
  const handleBulletinPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // basic validations
    if (paymentMethod === 'card' && cardNumber.replace(/\s/g, '').length !== 16) {
      alert("Veuillez saisir un numéro de carte valide à 16 chiffres.");
      return;
    }
    if (paymentMethod === 'mobile' && phoneNumber.trim().length < 9) {
      alert("Veuillez saisir un numéro de téléphone Mobile Money valide.");
      return;
    }

    setPaymentLoading(true);

    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentSuccess(true);
      
      // Save to central state
      setUnlockedBulletins(prev => ({
        ...prev,
        [`${activeChild.id}-T3`]: true
      }));

      triggerNotification("Paiement de 1$ validé ! Bulletin débloqué ✓");
    }, 1500);
  };

  // Handle Tuition Payment Versement
  const handleTuitionPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(tuitionAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Veuillez entrer un montant valide supérieur à 0.");
      return;
    }

    setTuitionLoading(true);

    setTimeout(() => {
      setTuitionLoading(false);
      setIsTuitionModalOpen(false);

      const record = tuitionPayments[activeChild.id] || { total: 1500, paid: 0, history: [] };
      const newPaid = Math.min(record.total, record.paid + amt);
      
      const newVersement = {
        id: Date.now(),
        type: `Versement Frais Scolaires`,
        amount: amt,
        method: tuitionPhone ? `Mobile Money (${tuitionMethod.toUpperCase()})` : `Paiement en Ligne`,
        date: new Date().toLocaleDateString('fr-FR'),
        status: 'Validé'
      };

      setTuitionPayments(prev => ({
        ...prev,
        [activeChild.id]: {
          ...record,
          paid: newPaid,
          history: [newVersement, ...record.history]
        }
      }));

      setTuitionPhone('');
      triggerNotification(`Versement de ${amt}$ enregistré avec succès !`);
    }, 1500);
  };

  // Filter threads for contact list search
  const filteredThreads = Array.from(new Set(messageThreads.map(m => m.sender === 'Parent' ? m.recipient : m.sender)))
    .map(c => String(c))
    .filter(contact => contact.toLowerCase().includes(searchContactQuery.toLowerCase()));

  // Active messages thread
  const activeChatPartner = searchContactQuery ? filteredThreads[0] || 'Administration' : 'Administration';
  const chatMessages = messageThreads.filter(m => 
    (m.sender === 'Parent' && m.recipient === activeChatPartner) ||
    (m.sender === activeChatPartner && m.recipient === 'Parent')
  );

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Children Selector pills */}
      <div className="flex flex-wrap gap-2.5 items-center justify-between border-b border-slate-150 pb-4">
        <div className="flex flex-wrap gap-2">
          {associatedChildren.map((child, index) => (
            <button
              key={child.id}
              onClick={() => {
                setActiveChildIndex(index);
                setPaymentSuccess(false);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition border ${
                activeChildIndex === index
                  ? 'bg-pink-500 text-white border-pink-500 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img
                src={child.avatarUrl}
                alt={child.name}
                referrerPolicy="no-referrer"
                className="h-5 w-5 rounded-full object-cover border border-white"
              />
              {child.name} ({child.className})
            </button>
          ))}
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
          <button 
            onClick={() => setActiveParentTab('suivi')}
            className={`px-3 py-1.5 rounded-lg transition ${activeParentTab === 'suivi' ? 'bg-white text-[#0F1B33] shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Suivi Enfant
          </button>
          <button 
            onClick={() => setActiveParentTab('bulletin')}
            className={`px-3 py-1.5 rounded-lg transition ${activeParentTab === 'bulletin' ? 'bg-white text-[#0F1B33] shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Bulletin Officiel
          </button>
          <button 
            onClick={() => setActiveParentTab('paiements')}
            className={`px-3 py-1.5 rounded-lg transition ${activeParentTab === 'paiements' ? 'bg-white text-[#0F1B33] shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Frais Scolaires
          </button>
          <button 
            onClick={() => setActiveParentTab('messagerie')}
            className={`px-3 py-1.5 rounded-lg transition ${activeParentTab === 'messagerie' ? 'bg-white text-[#0F1B33] shadow-xs' : 'text-slate-500 hover:text-[#0F1B33]'}`}
          >
            Messagerie 💬
          </button>
        </div>
      </div>

      {/* 2. CORE RENDERING PANELS BASED ON TAB */}

      {/* A. SUIVI ENFANT */}
      {activeParentTab === 'suivi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main child follow-up panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Child Stat Cards */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wider">État Académique de {activeChild.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50/70 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Moyenne 3e Trim</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1A56DB] mt-1 block">
                    {calculatedAverage.toFixed(1)}<span className="text-xs text-slate-400 font-normal">/20</span>
                  </span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Présences</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1 block">{attendanceRate}%</span>
                </div>
                <div className="bg-slate-50/70 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Devoirs À Faire</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-500 mt-1 block">{pendingHomeworkCount}</span>
                </div>
              </div>
            </div>

            {/* Sub-tabs Selection */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100">
              <div className="flex border-b border-slate-150 pb-3 mb-4 gap-4">
                <button
                  onClick={() => setActiveChildSubTab('notes')}
                  className={`text-xs font-bold pb-2 transition-all border-b-2 ${
                    activeChildSubTab === 'notes' ? 'border-[#1A56DB] text-[#1A56DB]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Notes & Moyennes Matière
                </button>
                <button
                  onClick={() => setActiveChildSubTab('presences')}
                  className={`text-xs font-bold pb-2 transition-all border-b-2 ${
                    activeChildSubTab === 'presences' ? 'border-[#1A56DB] text-[#1A56DB]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Suivi des Présences
                </button>
                <button
                  onClick={() => setActiveChildSubTab('devoirs')}
                  className={`text-xs font-bold pb-2 transition-all border-b-2 ${
                    activeChildSubTab === 'devoirs' ? 'border-[#1A56DB] text-[#1A56DB]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Cahier de Devoirs
                </button>
              </div>

              {/* Sub-tab 1: Notes & Moyennes (Calculated) */}
              {activeChildSubTab === 'notes' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Données issues directement de la grille de saisie en temps réel des professeurs.
                  </div>
                  {childGradesBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Enseignant : {item.teacher} • Coef. {item.coef}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-black text-slate-900 bg-white shadow-xs px-3 py-1 rounded-lg border border-slate-150">
                          {item.grade.toFixed(1)}/20
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Présences */}
              {activeChildSubTab === 'presences' && (
                <div className="space-y-3">
                  {/* Attendance Registers */}
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span>Calcul d'Assiduité : {attendanceRate}% • Retards enregistrés : {lateCount}</span>
                  </div>

                  {absenceCount > 0 ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 gap-4 mt-2">
                      <div>
                        <span className="inline-block bg-red-100 text-red-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Absence Non Justifiée ❌</span>
                        <h4 className="text-xs font-bold text-red-950 mt-1">Mardi 30 Juin - Journée Complète</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Motif requis par l'école pour clôturer le dossier de l'élève.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleJustifyAbsence}
                        className="bg-[#1A56DB] text-white hover:bg-blue-700 font-bold text-[11px] px-4 py-2 rounded-full cursor-pointer transition shadow-xs shrink-0 w-full sm:w-auto text-center"
                      >
                        Justifier en un clic ⚡
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/50 text-emerald-900 border border-emerald-100 rounded-2xl text-center text-xs font-semibold">
                      Toutes les absences scolaires de {activeChild.name} sont justifiées ✓
                    </div>
                  )}

                  {/* General daily logs scanned recently */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">Historique d'horodatage des scans (Aujourd'hui)</h4>
                    {childLogs.length > 0 ? (
                      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white overflow-hidden text-xs">
                        {childLogs.map((log) => (
                          <div key={log.id} className="p-3 flex justify-between items-center hover:bg-slate-50/50 transition">
                            <span className="font-semibold text-slate-800">Enregistré à {log.timestamp}</span>
                            <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                              log.status === 'Présent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>{log.status}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-3 text-[11px] text-slate-400 bg-slate-50 rounded-xl">
                        Aucun passage de scan enregistré pour aujourd'hui.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Devoirs */}
              {activeChildSubTab === 'devoirs' && (
                <div className="space-y-2">
                  {childHomeworkList.map((homework) => (
                    <div 
                      key={homework.id}
                      className={`flex items-start justify-between p-3 rounded-2xl border transition ${
                        homework.done 
                          ? 'bg-slate-50/50 border-slate-200/50 opacity-60' 
                          : 'bg-white border-slate-100 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${homework.done ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <div>
                          <span className="inline-block text-[9px] font-bold text-slate-400 uppercase font-mono">{homework.subject} • {homework.type}</span>
                          <h4 className={`text-xs font-bold text-slate-800 ${homework.done ? 'line-through text-slate-400' : ''}`}>{homework.title}</h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{homework.due}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* Right quick ID Card */}
          <div className="space-y-6">
            <div className="bg-[#0F1B33] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <img
                  src={activeChild.avatarUrl}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-full object-cover border-2 border-pink-500"
                />
                <div>
                  <h4 className="text-[9px] font-bold text-pink-400 font-mono tracking-wider">LIAISON ÉLÈVE</h4>
                  <div className="text-sm font-black text-white">{activeChild.name}</div>
                  <div className="text-[10px] text-slate-400 font-semibold font-mono">{activeChild.matricule}</div>
                </div>
              </div>

              <div className="mt-5 space-y-2 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Classe</span>
                  <span className="font-bold text-white">{activeChild.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Professeur Principal</span>
                  <span className="font-bold text-slate-100">M. Dubois (Maths)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Établissement</span>
                  <span className="font-bold text-slate-100 truncate max-w-[120px]">{selectedSchool.name}</span>
                </div>
              </div>
            </div>

            {/* General info */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Carnet de liaison récent</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Retrouvez les circulaires scolaires et demandes de signature en ligne. Les bulletins périodiques définitifs sont mis en ligne après chaque conseil trimestriel.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* B. BULLETIN OFFICIEL (PAYANT) */}
      {activeParentTab === 'bulletin' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-3xl mx-auto animate-fade-in">
          
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-black text-[#0F1B33]">Bulletin Scolaire de Fin d'Année</h3>
              <p className="text-xs text-slate-500">Trimestre 3 • Évaluation finale globale</p>
            </div>
            
            {/* Status indicators */}
            {isUnlocked ? (
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-extrabold border border-emerald-100 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" /> Accès Débloqué
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> Accès Restreint (1$)
              </span>
            )}
          </div>

          {/* Bulletin Sheet with Blurred layer */}
          <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            
            {/* The Sheet contents (Blurred if locked) */}
            <div className={`p-6 bg-white space-y-6 transition ${!isUnlocked ? 'blur-md md:blur-[6px] select-none pointer-events-none' : ''}`}>
              
              {/* Report Header */}
              <div className="flex justify-between text-xs font-bold border-b border-slate-150 pb-4">
                <div>
                  <div className="text-sm font-black text-[#0F1B33]">{selectedSchool.name}</div>
                  <div className="text-slate-400 font-mono text-[10px]">ANNEE SCOLAIRE 2025-2026</div>
                </div>
                <div className="text-right">
                  <div>Élève : <span className="text-[#0F1B33]">{activeChild.name}</span></div>
                  <div>Classe : <span className="text-slate-600">{activeChild.className}</span></div>
                  <div>Matricule : <span className="text-pink-500 font-mono font-bold">{activeChild.matricule}</span></div>
                </div>
              </div>

              {/* Grades Table */}
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase font-black text-[9px] tracking-wider border-b border-slate-150">
                    <th className="px-4 py-2.5">Discipline (Matières)</th>
                    <th className="px-4 py-2.5 text-center">Coef.</th>
                    <th className="px-4 py-2.5 text-center">Note Trim 3</th>
                    <th className="px-4 py-2.5 text-center">Moyenne Classe</th>
                    <th className="px-4 py-2.5">Appréciations du Professeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {childGradesBreakdown.map((item, idx) => (
                    <tr key={idx} className="font-medium text-slate-700">
                      <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-center text-slate-400 font-mono">{item.coef}</td>
                      <td className="px-4 py-3 text-center text-[#1A56DB] font-mono font-bold">{item.grade.toFixed(1)}/20</td>
                      <td className="px-4 py-3 text-center text-slate-400 font-mono">13.2/20</td>
                      <td className="px-4 py-3 text-slate-500 text-[11px] leading-relaxed">Excellent travail d'ensemble. Élève impliqué.</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* General Appreciations and averages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-150 pt-4 text-xs font-semibold">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 block mb-1">Moyenne Générale Trimestrielle</div>
                  <div className="text-2xl font-black text-slate-900">{calculatedAverage.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/20</span></div>
                  <div className="text-[10px] text-emerald-600 mt-1">✓ Admis en classe supérieure</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 block mb-1">Avis du Conseil de Classe</div>
                  <p className="text-slate-800 text-[11px] font-bold">Un trimestre exceptionnel à tous les égards. Félicitations du conseil de classe.</p>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">Signé le 07/07/2026 par le Principal</div>
                </div>
              </div>

            </div>

            {/* Overlaid Lock and Unlock button if locked */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-slate-900/10 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-sm flex flex-col items-center animate-scale">
                  <div className="h-12 w-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner mb-3">
                    <Lock className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0F1B33]">Accès Bulletin Protégé</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Les frais de mise à disposition des bulletins en format numérique officiel s'élèvent à <strong>1.00 $ USD</strong> par trimestre et par enfant.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentModalOpen(true);
                      setPaymentSuccess(false);
                    }}
                    className="mt-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-6 py-2.5 cursor-pointer transition shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1"
                  >
                    Débloquer le bulletin — 1$ →
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Action buttons if unlocked */}
          {isUnlocked && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  alert("Simulateur : Téléchargement du Bulletin PDF officiel lancé !");
                  triggerNotification("Téléchargement du bulletin lancé avec succès ✓");
                }}
                className="flex items-center gap-2 rounded-full bg-[#0F1B33] hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 cursor-pointer transition active:scale-95"
              >
                <Download className="h-4 w-4" /> Télécharger le PDF officiel →
              </button>
            </div>
          )}

        </div>
      )}

      {/* C. SUIVI DES PAIEMENTS COUT DE SCOLARITÉ */}
      {activeParentTab === 'paiements' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 max-w-2xl mx-auto animate-fade-in">
          
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1B33]">Portail de Frais Scolaires</h3>
              <p className="text-xs text-slate-500">Compte scolarité de {activeChild.name}</p>
            </div>
            <button
              onClick={() => setIsTuitionModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full cursor-pointer transition flex items-center gap-1 shadow-sm"
            >
              Effectuer un versement 💰
            </button>
          </div>

          {/* Financial summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Montant Annuel</span>
              <span className="text-xl font-black text-slate-800 block mt-1">${tuitionPayments[activeChild.id]?.total}.00</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Montant Versé</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">${tuitionPayments[activeChild.id]?.paid}.00</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Reste Dû</span>
              <span className="text-xl font-black text-red-500 block mt-1">
                ${(tuitionPayments[activeChild.id]?.total || 0) - (tuitionPayments[activeChild.id]?.paid || 0)}.00
              </span>
            </div>
          </div>

          {/* Payments list logs */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">Historique des versements scolaires</h4>
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white divide-y divide-slate-150 text-xs">
              {(tuitionPayments[activeChild.id]?.history || []).map((pay) => (
                <div key={pay.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition font-medium">
                  <div>
                    <div className="font-bold text-slate-800">{pay.type}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pay.date} • {pay.method}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#0F1B33] block">${pay.amount}.00</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mt-0.5">✓ {pay.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* D. MESSAGERIE AVEC L'ÉCOLE */}
      {activeParentTab === 'messagerie' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto h-[500px] flex animate-fade-in overflow-hidden">
          
          {/* Contact sidebar */}
          <div className="w-1/3 border-r border-slate-150 bg-slate-50/50 flex flex-col justify-start">
            
            {/* Search contacts bar */}
            <div className="p-3 border-b border-slate-150 bg-white">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 h-4.5 w-4.5 mt-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher contact..."
                  value={searchContactQuery}
                  onChange={(e) => setSearchContactQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border-2 border-slate-150 focus:border-[#1A56DB] rounded-lg focus:outline-none transition"
                />
              </div>
            </div>

            {/* Recipient select configuration */}
            <div className="p-2 border-b border-slate-150 bg-white space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-1">Nouvelle conversation avec :</div>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedRecipientType('admin')}
                  className={`flex-1 text-[10px] py-1 px-1.5 rounded-lg border font-bold ${
                    selectedRecipientType === 'admin' ? 'bg-[#0F1B33] text-white border-[#0F1B33]' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Admin 🏢
                </button>
                <button
                  onClick={() => setSelectedRecipientType('teacher')}
                  className={`flex-1 text-[10px] py-1 px-1.5 rounded-lg border font-bold ${
                    selectedRecipientType === 'teacher' ? 'bg-[#0F1B33] text-white border-[#0F1B33]' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Enseignant 🎓
                </button>
              </div>

              {selectedRecipientType === 'teacher' && (
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full text-[10px] font-semibold border-2 border-slate-150 rounded-lg p-1 bg-white focus:outline-none"
                >
                  <option value="">-- Choisir un enseignant --</option>
                  {childTeachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Contact entries */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
              <button className="w-full p-2.5 rounded-xl hover:bg-white text-left font-semibold text-xs border border-transparent hover:border-slate-100 transition shadow-xs bg-white border-slate-150">
                <div className="font-bold text-[#0F1B33]">{activeChatPartner}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Cliquez pour voir la conversation</div>
              </button>
            </div>
          </div>

          {/* Chat details thread */}
          <div className="flex-1 flex flex-col justify-between bg-white">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-xs text-[#0F1B33]">{activeChatPartner}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Canal Direct Sécurisé</span>
            </div>

            {/* Message bubbles bubble list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
              {chatMessages.length > 0 ? (
                chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'Parent' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                      msg.sender === 'Parent' 
                        ? 'bg-[#1A56DB] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.time}</span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Débutez une conversation directe en saisissant un message ci-dessous.
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-150 bg-white flex gap-2">
              <input
                type="text"
                placeholder={`Écrire un message à ${activeChatPartner}...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow text-xs px-4 py-2.5 border-2 border-slate-200 focus:border-[#1A56DB] rounded-full focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={messageInput.trim() === ''}
                className="h-10 w-10 shrink-0 bg-[#0F1B33] hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition cursor-pointer disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* 3. MODAL FOR BULLETIN PAYMENT UNLOCK (MOBILE & CARD)    */}
      {/* ======================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-[#0F1B33]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale relative text-left">
            
            <h4 className="text-base font-black text-[#0F1B33] mb-1">Passerelle de Paiement Sécurisé</h4>
            <p className="text-xs text-slate-500 mb-4">Débloquer le bulletin numérique trimestriel de {activeChild.name}</p>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-extrabold cursor-pointer transition ${
                  paymentMethod === 'card' ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-4 w-4" /> Carte Bancaire
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mobile')}
                className={`py-2 px-3 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-extrabold cursor-pointer transition ${
                  paymentMethod === 'mobile' ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="h-4 w-4" /> Mobile Money
              </button>
            </div>

            {/* Payment forms details */}
            <form onSubmit={handleBulletinPayment} className="space-y-4">
              
              {paymentMethod === 'card' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Numéro de Carte (Simulé)</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-mono font-bold"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">Exp</label>
                      <input type="text" placeholder="MM/AA" maxLength={5} className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB]" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">CVC</label>
                      <input type="password" placeholder="***" maxLength={3} className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB]" required />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Opérateur Mobile</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['airtel', 'orange', 'mpesa'].map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setPhoneOperator(op)}
                          className={`py-1.5 rounded-lg border-2 text-[10px] font-bold uppercase transition cursor-pointer ${
                            phoneOperator === op ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-150 text-slate-500'
                          }`}
                        >
                          {op === 'mpesa' ? 'M-Pesa' : op}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Numéro Mobile Money (9 chiffres)</label>
                    <div className="flex gap-1.5 items-center">
                      <span className="font-bold text-xs bg-slate-100 p-2.5 border border-slate-200 rounded-lg">+243</span>
                      <input
                        type="tel"
                        maxLength={9}
                        placeholder="812345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        className="flex-grow text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-bold font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Loader Success display */}
              {paymentLoading && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1A56DB] py-2">
                  <span className="animate-spin h-4 w-4 border-2 border-[#1A56DB] border-t-transparent rounded-full"></span>
                  <span>Sécurisation de la transaction d'un dollar...</span>
                </div>
              )}

              {paymentSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg border border-emerald-100 text-xs font-bold text-center">
                  ✓ Paiement réussi ! Bulletin déverrouillé.
                </div>
              )}

              {/* Action Buttons footer */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={paymentLoading}
                  className="rounded-full border-2 border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Fermer
                </button>
                {!paymentSuccess && (
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="rounded-full bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2 transition flex items-center gap-1"
                  >
                    Confirmer & Payer 1$
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 4. MODAL FOR TUITION PAIEMENT                           */}
      {/* ======================================================= */}
      {isTuitionModalOpen && (
        <div className="fixed inset-0 bg-[#0F1B33]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale relative text-left">
            <h4 className="text-base font-black text-[#0F1B33] mb-1">Versement Frais Scolaires</h4>
            <p className="text-xs text-slate-500 mb-4">Effectuer un paiement sur le solde scolarité de {activeChild.name}</p>

            <form onSubmit={handleTuitionPayment} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Montant du versement ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={tuitionAmount}
                  onChange={(e) => setTuitionAmount(e.target.value)}
                  className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-bold font-mono"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Opérateur Mobile Money</label>
                <div className="grid grid-cols-3 gap-2">
                  {['airtel', 'orange', 'mpesa'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setTuitionMethod(op)}
                      className={`py-1.5 rounded-lg border-2 text-[10px] font-bold uppercase transition cursor-pointer ${
                        tuitionMethod === op ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-150 text-slate-500'
                      }`}
                    >
                      {op === 'mpesa' ? 'M-Pesa' : op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Numéro Téléphone</label>
                <div className="flex gap-1.5 items-center">
                  <span className="font-bold text-xs bg-slate-100 p-2.5 border border-slate-200 rounded-lg">+243</span>
                  <input
                    type="tel"
                    maxLength={9}
                    placeholder="812345678"
                    value={tuitionPhone}
                    onChange={(e) => setTuitionPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-grow text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-[#1A56DB] font-bold font-mono"
                    required
                  />
                </div>
              </div>

              {tuitionLoading && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1A56DB] py-2">
                  <span className="animate-spin h-4 w-4 border-2 border-[#1A56DB] border-t-transparent rounded-full"></span>
                  <span>Simulation d'initiation USSD...</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTuitionModalOpen(false)}
                  className="rounded-full border-2 border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={tuitionLoading}
                  className="rounded-full bg-[#1A56DB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2 transition"
                >
                  Procéder au versement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
