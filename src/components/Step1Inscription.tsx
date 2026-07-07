import React, { useState, useEffect } from 'react';
import { Mail, Lock, GraduationCap, Users, Award, Sparkles, Check, Chrome, Loader2, ShieldCheck } from 'lucide-react';
import { RoleType } from '../types';

interface Step1InscriptionProps {
  email: string;
  setEmail: (val: string) => void;
  role: RoleType | null;
  setRole: (role: RoleType) => void;
  onNext: () => void;
}

export default function Step1Inscription({ email, setEmail, role, setRole, onNext }: Step1InscriptionProps) {
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTouched, setIsTouched] = useState({ email: false, password: false });

  // Real-time validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid && role !== null;

  // Autocomplete / Google login simulation
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setEmail('pierre.dupont@gmail.com');
      setPassword('securePassword123');
      setRole('eleve');
      setIsGoogleLoading(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      
      {/* Step Header */}
      <div className="bg-[#0F1B33] px-6 py-5 text-white flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A56DB] text-xs font-bold">1</div>
          <span className="font-display font-bold text-sm sm:text-base">Étape 1 : Identifiants & Profil</span>
        </div>
        <div className="text-xs text-slate-400 font-mono">1 sur 3</div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Section Label */}
        <div className="flex flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FE] px-3 py-1 text-[10px] font-bold tracking-widest text-[#1A56DB] uppercase">
            <Sparkles className="h-3 w-3" />
            ◆ CRÉATION DE COMPTE
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1B33] mt-2">
            Commençons par votre identité
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Saisissez vos identifiants d’accès ou connectez-vous avec votre compte institutionnel Google.
          </p>
        </div>

        {/* Google Quick Sign in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] cursor-pointer disabled:opacity-75"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 text-[#1A56DB] animate-spin" />
          ) : (
            <Chrome className="h-5 w-5 text-red-500" />
          )}
          {isGoogleLoading ? 'Simulation de connexion...' : 'Continuer avec Google'}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-150"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 font-mono uppercase">OU</span>
          <div className="flex-grow border-t border-slate-150"></div>
        </div>

        {/* Email + Password fields */}
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
              Adresse Email Scolaire ou Personnelle
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                placeholder="ex: pierre.dupont@lycee.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setIsTouched(prev => ({ ...prev, email: true }))}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm transition focus:outline-none ${
                  isTouched.email && !isEmailValid
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : isEmailValid
                    ? 'border-emerald-500 focus:border-emerald-500'
                    : 'border-slate-200 focus:border-[#1A56DB]'
                }`}
              />
              {isEmailValid && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Check className="h-4.5 w-4.5 text-emerald-500" />
                </span>
              )}
            </div>
            {isTouched.email && !isEmailValid && (
              <p className="text-[11px] font-semibold text-red-500">
                Veuillez saisir une adresse email valide (ex: nom@domaine.fr).
              </p>
            )}
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
              Mot de Passe d'Accès
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                placeholder="Au moins 8 caractères requis"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setIsTouched(prev => ({ ...prev, password: true }))}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm transition focus:outline-none ${
                  isTouched.password && !isPasswordValid
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : isPasswordValid
                    ? 'border-emerald-500 focus:border-emerald-500'
                    : 'border-slate-200 focus:border-[#1A56DB]'
                }`}
              />
              {isPasswordValid && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <Check className="h-4.5 w-4.5 text-emerald-500" />
                </span>
              )}
            </div>
            {isTouched.password && !isPasswordValid ? (
              <p className="text-[11px] font-semibold text-red-500">
                Le mot de passe doit contenir au moins 8 caractères (actuellement : {password.length}).
              </p>
            ) : (
              <p className="text-[10px] text-slate-400">
                Choisissez un mot de passe robuste combinant chiffres, lettres et symboles.
              </p>
            )}
          </div>
        </div>

        {/* Role Selection section */}
        <div className="space-y-4 text-left">
          <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
            Sélectionnez votre Rôle sur EduSchool
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Rôle Élève */}
            <div
              id="role-eleve-card"
              onClick={() => setRole('eleve')}
              className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-row sm:flex-col items-center sm:text-center gap-4 ${
                role === 'eleve'
                  ? 'border-[#1A56DB] bg-sky-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-[#1A56DB]/50 bg-white'
              }`}
            >
              {/* Badge Élève = ciel */}
              <div className="h-12 w-12 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-left sm:text-center">
                <h3 className="font-display font-bold text-sm text-slate-900">Élève</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Accédez à vos cours, notes, et devoirs en ligne.</p>
              </div>
              {role === 'eleve' && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#1A56DB] text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Rôle Parent */}
            <div
              id="role-parent-card"
              onClick={() => setRole('parent')}
              className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-row sm:flex-col items-center sm:text-center gap-4 ${
                role === 'parent'
                  ? 'border-[#1A56DB] bg-pink-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-[#1A56DB]/50 bg-white'
              }`}
            >
              {/* Badge Parent = rose */}
              <div className="h-12 w-12 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left sm:text-center">
                <h3 className="font-display font-bold text-sm text-slate-900">Parent</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Suivez la scolarité et l'assiduité de vos enfants.</p>
              </div>
              {role === 'parent' && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#1A56DB] text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Rôle Enseignant/Prof */}
            <div
              id="role-professeur-card"
              onClick={() => setRole('professeur')}
              className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-row sm:flex-col items-center sm:text-center gap-4 ${
                role === 'professeur'
                  ? 'border-[#1A56DB] bg-amber-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-[#1A56DB]/50 bg-white'
              }`}
            >
              {/* Badge Enseignant = ambre */}
              <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left sm:text-center">
                <h3 className="font-display font-bold text-sm text-slate-900">Professeur</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Saisissez les notes, devoirs et gérez vos classes.</p>
              </div>
              {role === 'professeur' && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#1A56DB] text-white flex items-center justify-center">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Validation Warning when button disabled */}
        {!isFormValid && (
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 flex items-start gap-2 border border-slate-200">
            <span className="inline-block mt-0.5 text-amber-500">⚠️</span>
            <div className="text-left font-medium">
              Pour débloquer l'étape suivante, veuillez :
              <ul className="list-disc list-inside mt-1 font-normal space-y-0.5">
                {!isEmailValid && <li>Saisir un e-mail valide</li>}
                {!isPasswordValid && <li>Saisir un mot de passe d'au moins 8 caractères</li>}
                {role === null && <li>Sélectionner un profil de connexion (Élève/Parent/Prof)</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Submit Button Pilule */}
        <div className="pt-2 flex justify-end">
          <button
            id="step1-btn-continue"
            type="button"
            onClick={onNext}
            disabled={!isFormValid}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-10 py-4 font-semibold text-white transition shadow-md hover:bg-[#1E429F] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 cursor-pointer"
          >
            Continuer
            <span>→</span>
          </button>
        </div>

      </div>

    </div>
  );
}
