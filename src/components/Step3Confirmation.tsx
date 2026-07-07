import React, { useState } from 'react';
import { 
  Check, ShieldCheck, Search, Plus, Trash2, ArrowRight, 
  Users, Sparkles, AlertCircle, Building, Smartphone, Mail, Lock, CheckCircle2 
} from 'lucide-react';
import { School, RoleType, Child } from '../types';
import { SIMULATED_CHILDREN } from '../data';

interface Step3ConfirmationProps {
  selectedSchool: School;
  role: RoleType;
  associatedChildren: Child[];
  setAssociatedChildren: (children: Child[]) => void;
  onPrev: () => void;
  onFinish: () => void;
}

// Student codes mapped to simulated children
const STUDENT_CODES: Record<string, string> = {
  'child-1': 'ELV-4M9P', // Lucas Bernard
  'child-2': 'ELV-8R2T', // Emma Bernard
  'child-3': 'ELV-3K1W', // Chloé Moreau
  'child-4': 'ELV-9Y5H', // Thomas Petit
  'child-5': 'ELV-7V4X', // Léa Bernard
};

export default function Step3Confirmation({
  selectedSchool,
  role,
  associatedChildren,
  setAssociatedChildren,
  onPrev,
  onFinish
}: Step3ConfirmationProps) {
  // Linking state variables
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [foundChild, setFoundChild] = useState<Child | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // 6-digit verification code state variables
  const [isLinkingPhase, setIsLinkingPhase] = useState(role === 'parent');
  const [generatedCode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [enteredCode, setEnteredCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Search child by student code
  const handleVerifyStudentCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setSuccessMessage('');
    setFoundChild(null);

    const input = studentCodeInput.trim().toUpperCase();
    if (!input) {
      setCodeError('Veuillez saisir un code élève.');
      return;
    }

    // Match code
    const matchedEntry = Object.entries(STUDENT_CODES).find(([_, code]) => code === input);
    if (!matchedEntry) {
      setCodeError('Ce code élève est introuvable dans cet établissement.');
      return;
    }

    const childId = matchedEntry[0];
    const child = SIMULATED_CHILDREN.find((c) => c.id === childId);

    if (!child) {
      setCodeError('Une erreur est survenue lors de la récupération des données de l\'élève.');
      return;
    }

    // Check if already added
    const isAlreadyAdded = associatedChildren.some((added) => added.id === child.id);
    if (isAlreadyAdded) {
      setCodeError(`${child.name} est déjà associé(e) à votre compte.`);
      return;
    }

    setFoundChild(child);
  };

  const handleConfirmAndLink = () => {
    if (foundChild) {
      setAssociatedChildren([...associatedChildren, foundChild]);
      setSuccessMessage(`✓ ${foundChild.name} a été associé(e) avec succès !`);
      setFoundChild(null);
      setStudentCodeInput('');
    }
  };

  const handleRemoveChild = (id: string) => {
    setAssociatedChildren(associatedChildren.filter((child) => child.id !== id));
    setSuccessMessage('');
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');

    if (enteredCode.trim() === generatedCode) {
      setIsConfirmed(true);
      setVerificationError('');
    } else {
      setVerificationError('Le code saisi est incorrect. Veuillez vérifier et réessayer.');
    }
  };

  // Role Badge Configuration
  const getRoleBadge = () => {
    switch (role) {
      case 'eleve':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold text-sky-800">
            <span className="h-2 w-2 rounded-full bg-sky-500"></span>
            Élève
          </span>
        );
      case 'parent':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3.5 py-1 text-xs font-bold text-pink-800">
            <span className="h-2 w-2 rounded-full bg-pink-500"></span>
            Parent d'Élève
          </span>
        );
      case 'professeur':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Enseignant / Professeur
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-xs font-bold text-violet-800">
            <span className="h-2 w-2 rounded-full bg-violet-500"></span>
            Directeur
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      
      {/* Step Header */}
      <div className="bg-[#0F1B33] px-6 py-5 text-white flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!isLinkingPhase && role === 'parent') {
                setIsLinkingPhase(true);
              } else {
                onPrev();
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 transition text-xs font-bold"
          >
            ←
          </button>
          <span className="font-display font-bold text-sm sm:text-base">
            {isLinkingPhase ? "Étape 3 : Rapprochement Familial" : "Étape 3 : Code de Confirmation"}
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {role === 'parent' ? (isLinkingPhase ? '3a sur 3' : '3b sur 3') : '3 sur 3'}
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* 1. PARENT CHILDREN LINKING PHASE */}
        {role === 'parent' && isLinkingPhase ? (
          <div className="space-y-6 text-left">
            
            {/* Header label */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FE] px-2.5 py-1 text-[9px] font-bold tracking-widest text-[#1A56DB] uppercase mb-1">
                <Users className="h-3 w-3" />
                ◆ RAPPROCHEMENT FAMILIAL
              </div>
              <h3 className="text-lg font-black text-[#0F1B33]">
                Associez vos enfants scolarisés
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Saisissez le <strong>Code Élève</strong> unique fourni par l'établissement pour relier un ou plusieurs enfants à votre espace de suivi.
              </p>
            </div>

            {/* School & Role recap card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#1A56DB] flex items-center justify-center shrink-0">
                  <Building className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-[#0F1B33] truncate">{selectedSchool.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{selectedSchool.location}</p>
                </div>
              </div>
              <div className="shrink-0 self-start sm:self-auto">
                {getRoleBadge()}
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyStudentCode} className="space-y-3">
              <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
                Code Élève Individuel (Format: ELV-XXXX)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={studentCodeInput}
                    onChange={(e) => {
                      setStudentCodeInput(e.target.value.toUpperCase());
                      setCodeError('');
                    }}
                    placeholder="Saisir le Code Élève (ex: ELV-4M9P)"
                    className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-slate-200 focus:border-[#1A56DB] text-sm focus:outline-none transition font-mono tracking-wider font-semibold placeholder:font-sans placeholder:tracking-normal"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-[#1A56DB] hover:bg-[#1E429F] text-white px-6 py-3 font-semibold text-xs uppercase tracking-wide transition active:scale-95 cursor-pointer shrink-0"
                >
                  Vérifier le code
                </button>
              </div>

              {/* Linking messages */}
              {codeError && (
                <div className="text-xs text-red-500 font-semibold flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              {successMessage && !foundChild && (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-fade-in">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
            </form>

            {/* Found child panel */}
            {foundChild && (
              <div className="bg-blue-50/60 border-2 border-blue-100 rounded-2xl p-4 space-y-4 animate-scale">
                <div className="flex items-center gap-3.5">
                  <img
                    src={foundChild.avatarUrl}
                    alt={foundChild.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <span className="inline-block bg-[#1A56DB] text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                      Élève trouvé
                    </span>
                    <h4 className="text-sm font-black text-[#0F1B33] mt-0.5">{foundChild.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold font-mono">
                      Classe : {foundChild.className} • Matricule : {foundChild.matricule}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setFoundChild(null)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndLink}
                    className="rounded-full bg-[#1A56DB] hover:bg-[#1E429F] text-white px-5 py-2 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Confirmer et lier cet enfant
                  </button>
                </div>
              </div>
            )}

            {/* List of associated children */}
            {associatedChildren.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Enfants liés à votre espace ({associatedChildren.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {associatedChildren.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm animate-fade-in hover:border-slate-300"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={child.avatarUrl}
                          alt={child.name}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-full object-cover border border-white shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#0F1B33] truncate">{child.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold font-mono mt-0.5">
                            {child.className} • {child.matricule}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveChild(child.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer shrink-0"
                        title="Détacher cet enfant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
                <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p className="font-extrabold text-xs text-slate-600">Aucun enfant n'est lié pour le moment.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Veuillez lier au moins un enfant pour pouvoir valider l'accès.</p>
              </div>
            )}

            {/* Cheat Sheet Box for testing */}
            <div className="bg-[#EAF1FE]/40 border border-blue-100 rounded-2xl p-4 text-xs">
              <span className="font-bold text-[#1A56DB] uppercase text-[10px] tracking-wider block mb-2">
                💡 Codes élèves de démo pour tester :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SIMULATED_CHILDREN.map(c => {
                  const isLinked = associatedChildren.some(ac => ac.id === c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={isLinked}
                      onClick={() => {
                        setStudentCodeInput(STUDENT_CODES[c.id] || '');
                        setCodeError('');
                        setFoundChild(null);
                      }}
                      className={`text-left p-2 rounded-lg border transition text-[11px] flex justify-between items-center ${
                        isLinked 
                          ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-[#1A56DB] hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-800 block truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.className}</span>
                      </div>
                      <code className="bg-blue-50 text-[#1A56DB] px-1.5 py-0.5 rounded font-mono font-bold text-[10px] shrink-0">
                        {STUDENT_CODES[c.id]}
                      </code>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Step / Footer actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={onPrev}
                className="rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition text-sm cursor-pointer"
              >
                Retour
              </button>

              <button
                type="button"
                disabled={associatedChildren.length === 0}
                onClick={() => setIsLinkingPhase(false)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-[#1A56DB] px-8 py-3.5 font-bold text-white transition shadow-md hover:bg-[#1E429F] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
              >
                Continuer vers le code de confirmation
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        ) : (
          
          /* 2. 6-DIGIT CODE CONFIRMATION PHASE (ALL ROLES) */
          <div className="space-y-6 text-left">
            
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold tracking-widest text-emerald-800 uppercase mb-1">
                <ShieldCheck className="h-3 w-3" />
                ◆ AUTHENTICATION À DOUBLE FACTEUR (SIMULÉ)
              </div>
              <h3 className="text-lg font-black text-[#0F1B33]">
                Confirmez votre inscription
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Saisissez le code d'activation à 6 chiffres pour valider votre compte.
              </p>
            </div>

            {/* SIMULATED SMS / EMAIL NOTIFICATION POPUP */}
            <div className="relative overflow-hidden bg-[#0F1B33] text-white rounded-2xl p-4 sm:p-5 border-l-4 border-[#1A56DB] shadow-lg animate-pulse-slow">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="flex items-start gap-3 relative z-10">
                <div className="h-9 w-9 rounded-full bg-[#1A56DB]/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 font-mono tracking-wider uppercase">SIMULATEUR DE COMPTE</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">À l'instant</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-0.5">Message d'activation EduSchool :</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Votre code de confirmation de démo est <strong className="text-amber-400 font-mono text-sm px-1.5 py-0.5 bg-slate-800/80 rounded border border-slate-700">{generatedCode}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* CONFIRMATION FORM */}
            {!isConfirmed ? (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
                    Saisir le code d'activation reçu
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setEnteredCode(val);
                        setVerificationError('');
                        
                        // Auto trigger on 6 digits
                        if (val === generatedCode) {
                          setIsConfirmed(true);
                          setVerificationError('');
                        }
                      }}
                      placeholder="• • • • • •"
                      className="text-center font-mono text-xl tracking-[0.6em] font-black w-full py-3 rounded-xl border-2 border-slate-200 focus:border-[#1A56DB] focus:outline-none transition"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#1A56DB] hover:bg-[#1E429F] text-white px-6 font-bold text-xs uppercase tracking-wide transition active:scale-95 cursor-pointer shrink-0"
                    >
                      Valider
                    </button>
                  </div>
                </div>

                {verificationError && (
                  <div className="text-xs text-red-500 font-semibold flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </form>
            ) : (
              /* CONFIRMED VISUAL DISPLAY */
              <div className="bg-emerald-50/50 border-2 border-emerald-150 rounded-2xl p-5 text-center flex flex-col items-center animate-scale space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md border-2 border-emerald-200 animate-bounce">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-900">✓ Compte confirmé avec succès !</h4>
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    Votre accès d'établissement est configuré et sécurisé. Vos identifiants ont été validés.
                  </p>
                </div>
              </div>
            )}

            {/* Quick helper for codes when waiting */}
            {!isConfirmed && (
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  Tapez le code <strong>{generatedCode}</strong> ci-dessus pour confirmer immédiatement votre compte de démo.
                </p>
              </div>
            )}

            {/* BUTTONS FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  if (role === 'parent') {
                    setIsLinkingPhase(true);
                  } else {
                    onPrev();
                  }
                }}
                disabled={isConfirmed}
                className="rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Retour
              </button>

              <button
                id="step3-btn-access"
                type="button"
                onClick={onFinish}
                disabled={!isConfirmed}
                className="group flex items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-8 py-4 font-semibold text-white transition shadow-md hover:bg-[#1E429F] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 cursor-pointer text-sm"
              >
                Accéder à mon espace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
