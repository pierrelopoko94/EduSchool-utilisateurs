import React from 'react';
import { BookOpen, GraduationCap, ArrowRight, Play } from 'lucide-react';
import { RoleType } from '../types';

interface HeaderProps {
  currentStep: number;
  setStep: (step: number) => void;
  role: RoleType | null;
  setRole: (role: RoleType) => void;
}

export default function Header({ currentStep, setStep, role, setRole }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-[#0F1B33] text-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo EduSchool */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A56DB] text-white shadow-md">
            <div className="relative">
              <BookOpen className="h-5 w-5" />
              <GraduationCap className="absolute -top-2.5 -right-2.5 h-4.5 w-4.5 rotate-12 text-[#EAF1FE]" />
            </div>
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight">
              Edu<span className="text-[#1A56DB]">School</span>
            </span>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">SaaS Multi-Écoles</div>
          </div>
        </div>

        {/* Demo Mode / Quick Navigation */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 p-1 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            MODE DÉMO :
          </span>
          
          <button
            onClick={() => setStep(0)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              currentStep === 0
                ? 'bg-[#1A56DB] text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Accueil
          </button>
          
          <button
            onClick={() => setStep(1)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              currentStep === 1
                ? 'bg-[#1A56DB] text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Étape 1: Profil
          </button>
          
          <button
            onClick={() => setStep(2)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              currentStep === 2
                ? 'bg-[#1A56DB] text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Étape 2: École
          </button>
          
          <button
            onClick={() => setStep(3)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              currentStep === 3
                ? 'bg-[#1A56DB] text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Étape 3: Accès
          </button>
          
          <button
            onClick={() => {
              if (!role) setRole('eleve');
              setStep(4);
            }}
            className={`rounded-full px-3 py-1 font-medium transition ${
              currentStep === 4
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Espace Tableau de Bord
          </button>
        </div>

        {/* Mobile quick access or step summary */}
        <div className="flex items-center gap-2">
          {/* Active Badge Status - Interactive Switcher */}
          <div className="rounded-full bg-slate-800 pl-3 pr-1 py-1 text-xs font-semibold text-slate-300 flex items-center gap-1 border border-slate-700">
            <span className="text-slate-400">Rôle :</span>
            {role ? (
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
                className="bg-transparent text-xs font-bold border-none text-emerald-400 focus:outline-none cursor-pointer pr-2 capitalize font-mono"
              >
                <option value="eleve" className="text-slate-800">Élève 🎓</option>
                <option value="parent" className="text-slate-800">Parent 👥</option>
                <option value="professeur" className="text-slate-800">Professeur 🏆</option>
              </select>
            ) : (
              <span className="text-slate-500 pr-2">Aucun</span>
            )}
          </div>
          
          {/* Quick simulation buttons for evaluator */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-40"
              title="Précédent"
            >
              ←
            </button>
            <span className="text-xs font-mono font-bold text-[#1A56DB]">{currentStep}/4</span>
            <button
              onClick={() => setStep(Math.min(4, currentStep + 1))}
              disabled={currentStep === 4}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 disabled:opacity-40"
              title="Suivant"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
