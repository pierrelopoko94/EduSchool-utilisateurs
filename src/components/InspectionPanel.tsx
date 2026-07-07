import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, CheckCircle, Database, ShieldAlert, X } from 'lucide-react';
import { School, RoleType, Child } from '../types';

interface InspectionPanelProps {
  currentStep: number;
  role: RoleType | null;
  selectedSchool: School | null;
  schoolCodeInput: string;
  associatedChildren: Child[];
  userEmail: string;
}

export default function InspectionPanel({
  currentStep,
  role,
  selectedSchool,
  schoolCodeInput,
  associatedChildren,
  userEmail
}: InspectionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Status mapping
  const stepLabels = [
    '0 - Écran d\'Accueil (Héros)',
    '1 - Inscription & Rôle',
    '2 - Rattachement Établissement',
    '3 - Confirmation d\'Accès',
    '4 - Espace Tableau de Bord'
  ];

  return (
    <>
      {/* FLOATING TRIGGER BADGE / MINIMIZED STATE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#0F1B33] hover:bg-slate-800 text-white px-5 py-3 shadow-2xl border border-[#1A56DB]/50 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Terminal className="h-4 w-4 text-[#1A56DB] animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-tight">Inspecteur d'État</span>
          <ChevronUp className="h-4 w-4 text-slate-400" />
        </button>
      )}

      {/* FULL PANEL / MAXIMIZED STATE */}
      {isOpen && (
        <div className={`fixed z-50 bg-[#0F1B33] text-slate-200 border-t border-slate-800 transition-all shadow-2xl font-mono text-xs text-left ${
          /* Responsive Layout: Full screen drawer on mobile, bottom pane on desktop */
          'inset-x-0 bottom-0 md:h-80 h-full flex flex-col'
        }`}>
          
          {/* Header */}
          <div className="bg-[#0b1424] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="h-4 w-4 text-[#1A56DB]" />
              <span className="font-extrabold text-white tracking-wider text-xs uppercase"> EduSchool • Console d'État en Direct (Demo Helper)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <CheckCircle className="h-3 w-3" /> Réactif
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Masquer la console"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Panel Content body */}
          <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 custom-scrollbar">
            
            {/* Column 1: JSON Representation */}
            <div className="space-y-2">
              <h4 className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>⚡ Store Reducer State</span>
                <span className="text-[9px] text-[#1A56DB] font-normal">JSON</span>
              </h4>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] text-emerald-400 overflow-x-auto select-all max-h-48 md:max-h-56 custom-scrollbar leading-tight font-mono">
{JSON.stringify({
  app_id: "EduSchool-SaaS-3.5",
  current_step: currentStep,
  user: {
    email: userEmail || "Non renseigné",
    password_len: userEmail ? 12 : 0,
    role: role || "null"
  },
  institution: selectedSchool ? {
    id: selectedSchool.id,
    name: selectedSchool.name,
    code_input: schoolCodeInput || "null",
    code_status: selectedSchool ? (schoolCodeInput === selectedSchool.code ? "VERIFIED" : "MISMATCH") : "WAITING"
  } : null,
  family_relations: role === 'parent' ? associatedChildren.map(c => ({
    name: c.name,
    uid: c.matricule,
    grade: c.className
  })) : []
}, null, 2)}
              </pre>
            </div>

            {/* Column 2: Step validations */}
            <div className="space-y-3">
              <h4 className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-800 pb-1">
                ⚙️ Validations par Étape
              </h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span>Étape 0 : Écran Héros</span>
                  <span className="text-emerald-400 font-bold">✓ Toujours Éligible</span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span>Étape 1 : Email & Rôle</span>
                  {userEmail && userEmail.includes('@') && role ? (
                    <span className="text-emerald-400 font-bold">✓ Validé</span>
                  ) : (
                    <span className="text-amber-500 font-bold">⌛ En attente</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span>Étape 2 : Code Établissement</span>
                  {selectedSchool && schoolCodeInput === selectedSchool.code ? (
                    <span className="text-emerald-400 font-bold">✓ Validé ({selectedSchool.code})</span>
                  ) : (
                    <span className="text-red-400 font-bold">✗ Requis</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-850">
                  <span>Étape 3 : Confirmation & Enfants</span>
                  {role === 'parent' ? (
                    associatedChildren.length > 0 ? (
                      <span className="text-emerald-400 font-bold">✓ {associatedChildren.length} associé(s)</span>
                    ) : (
                      <span className="text-amber-400 font-bold">▲ Optionnel</span>
                    )
                  ) : (
                    <span className="text-slate-500">Non Applicable</span>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: SaaS Multi-tenant settings */}
            <div className="space-y-3">
              <h4 className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-800 pb-1">
                🎛️ Diagnostics Multi-Écoles
              </h4>
              <div className="space-y-2 text-[11px] text-slate-300">
                <p className="leading-tight">
                  <strong className="text-white">Tenant :</strong> default_edu_cluster_eu
                </p>
                <p className="leading-tight">
                  <strong className="text-white">Passerelle API :</strong> <span className="text-blue-400 underline">https://api.eduschool.io/v1</span>
                </p>
                <p className="leading-tight">
                  <strong className="text-white">Routage d'accès :</strong>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {role === 'eleve' && '→ /workspace/student/grades'}
                    {role === 'parent' && '→ /workspace/parent/children'}
                    {role === 'professeur' && '→ /workspace/teacher/grades'}
                    {!role && '→ /auth/select-role'}
                  </span>
                </p>
                <div className="bg-[#1A56DB]/10 text-[#1A56DB] p-2.5 rounded-lg border border-[#1A56DB]/20 text-[10px] flex items-start gap-1.5 leading-snug mt-1">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Ceci est un environnement de démonstration local. Aucune donnée n'est envoyée à l'extérieur.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer inside expanded panel */}
          <div className="bg-[#0b1424] px-4 py-2 text-[10px] text-slate-500 border-t border-slate-800 text-center font-mono">
            EduSchool Registre SaaS v3.5.2 • Développé en React & Tailwind CSS
          </div>

        </div>
      )}
    </>
  );
}
