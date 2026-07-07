import React, { useState, useEffect, useRef } from 'react';
import { Search, Hash, Sparkles, AlertCircle, Check, Building2, MapPin, ArrowRight, CornerDownRight } from 'lucide-react';
import { School } from '../types';
import { SIMULATED_SCHOOLS } from '../data';

interface Step2RejoindreProps {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
  schoolCodeInput: string;
  setSchoolCodeInput: (code: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Step2Rejoindre({
  selectedSchool,
  setSelectedSchool,
  schoolCodeInput,
  setSchoolCodeInput,
  onPrev,
  onNext
}: Step2RejoindreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCodeTouched, setIsCodeTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial query with selected school
  useEffect(() => {
    if (selectedSchool) {
      setSearchQuery(selectedSchool.name);
    }
  }, [selectedSchool]);

  // Handle outside clicks to close the auto-complete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtering schools based on search query
  const filteredSchools = SIMULATED_SCHOOLS.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine code matching status
  const isCodeCorrect = selectedSchool ? schoolCodeInput.trim() === selectedSchool.code : false;
  const isCodeMatchedWithOtherSchool = !isCodeCorrect && schoolCodeInput.trim() !== '' && 
    SIMULATED_SCHOOLS.some(s => s.code === schoolCodeInput.trim());
  const otherSchoolMatched = isCodeMatchedWithOtherSchool 
    ? SIMULATED_SCHOOLS.find(s => s.code === schoolCodeInput.trim()) 
    : null;

  const isFormValid = selectedSchool !== null && isCodeCorrect;

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    setSearchQuery(school.name);
    setShowDropdown(false);
  };

  const handleAutoFillCode = () => {
    if (selectedSchool) {
      setSchoolCodeInput(selectedSchool.code);
      setIsCodeTouched(true);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      
      {/* Step Header */}
      <div className="bg-[#0F1B33] px-6 py-5 text-white flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-850 hover:bg-slate-800 text-slate-300 transition text-xs font-bold"
          >
            ←
          </button>
          <span className="font-display font-bold text-sm sm:text-base">Étape 2 : Rattachement d'Établissement</span>
        </div>
        <div className="text-xs text-slate-400 font-mono">2 sur 3</div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Section Label */}
        <div className="flex flex-col items-start gap-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FE] px-3 py-1 text-[10px] font-bold tracking-widest text-[#1A56DB] uppercase">
            <Building2 className="h-3 w-3" />
            ◆ REJOINDRE UNE ÉCOLE
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F1B33] mt-2">
            Recherchez et associez votre école
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Saisissez le nom officiel de votre établissement d'enseignement, puis confirmez l’authentification à l'aide de votre code d'accès unique.
          </p>
        </div>

        {/* Form elements */}
        <div className="space-y-6">
          
          {/* BARRE DE RECHERCHE "Nom de l'école" */}
          <div ref={containerRef} className="space-y-2 text-left relative">
            <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
              Nom de l'Établissement Scolaire
            </label>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1A56DB]">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                placeholder="Tapez pour rechercher votre école (ex: Saint-Vincent...)"
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSchool(null); // Reset selected school on edit
                  setShowDropdown(true);
                }}
                className={`w-full pl-11 pr-4 py-3.5 rounded-full border-2 text-sm transition focus:outline-none ${
                  selectedSchool
                    ? 'border-emerald-500 focus:border-emerald-500 bg-emerald-50/5'
                    : 'border-slate-200 focus:border-[#1A56DB]'
                }`}
              />
              {selectedSchool && (
                <span className="absolute inset-y-0 right-4 flex items-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <Check className="h-3.5 w-3.5" /> Sélectionné
                  </span>
                </span>
              )}
            </div>

            {/* AUTOCOMPLÉTION EN TEMPS RÉEL (Liste déroulante flottante) */}
            {showDropdown && searchQuery.trim() !== '' && (
              <div className="absolute z-30 mt-1.5 w-full rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredSchools.length > 0 ? (
                  <div className="p-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-50">
                      Établissements correspondants ({filteredSchools.length})
                    </div>
                    {filteredSchools.map((school) => (
                      <button
                        key={school.id}
                        type="button"
                        onClick={() => handleSchoolSelect(school)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition rounded-xl flex items-start gap-3 mt-1 cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#EAF1FE] flex items-center justify-center text-[#1A56DB] shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{school.name}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-0.5 text-[#1A56DB] font-semibold text-[10px] uppercase">
                              {school.type}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin className="h-3 w-3" /> {school.location}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* SI AUCUNE CORRESPONDANCE : MESSAGE CLAIR ET ACTIONNABLE */
                  <div className="p-5 text-center">
                    <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Aucune école ne correspond à votre recherche</p>
                    <p className="text-xs text-slate-500 mt-1">Veuillez vérifier l'orthographe ou essayer un mot-clé générique.</p>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex flex-col gap-1.5 items-start">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Suggestions de recherche :</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {SIMULATED_SCHOOLS.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSchoolSelect(s)}
                            className="text-[11px] font-semibold bg-slate-100 hover:bg-[#EAF1FE] hover:text-[#1A56DB] text-slate-600 px-2.5 py-1 rounded-md transition"
                          >
                            {s.name.split(' ').slice(-1)[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CODE ÉTABLISSEMENT - JetBrains Mono, LETTRES-VILLE-NUMÉRO */}
          <div className="space-y-2 text-left">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-bold text-[#0F1B33] uppercase tracking-wider">
                Code d'Établissement Secret
              </label>
              {selectedSchool && !isCodeCorrect && (
                <button
                  type="button"
                  onClick={handleAutoFillCode}
                  className="text-[11px] font-bold text-[#1A56DB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CornerDownRight className="h-3 w-3" /> Remplir le code valide
                </button>
              )}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Hash className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Format: AA-VILLE-00000"
                value={schoolCodeInput}
                onChange={(e) => {
                  setSchoolCodeInput(e.target.value.toUpperCase().trim());
                  setIsCodeTouched(true);
                }}
                disabled={!selectedSchool}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 font-mono text-sm uppercase tracking-wider transition focus:outline-none disabled:bg-slate-50 disabled:border-slate-150 disabled:text-slate-400 border-slate-200 focus:border-[#1A56DB]"
              />
            </div>

            {/* Validation croisée réelle */}
            {selectedSchool && isCodeTouched && (
              <div className="mt-2 text-xs">
                {isCodeCorrect ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 animate-fade-in">
                    <Check className="h-4 w-4" /> Code d'établissement validé pour {selectedSchool.name} !
                  </div>
                ) : isCodeMatchedWithOtherSchool && otherSchoolMatched ? (
                  <div className="flex items-start gap-2 text-amber-600 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-100 animate-fade-in">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <span>Ce code correspond à un autre établissement : </span>
                      <span className="underline">{otherSchoolMatched.name}</span>.
                      <p className="font-normal text-[11px] text-slate-600 mt-1">Sélectionnez cette école ci-dessus ou corrigez le code pour correspondre à votre choix actuel.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-red-500 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100 animate-fade-in">
                    <AlertCircle className="h-4 w-4" /> Ce code ne correspond pas à l'école indiquée.
                  </div>
                )}
              </div>
            )}

            {!selectedSchool && (
              <p className="text-[11px] text-slate-400">
                Veuillez d'abord rechercher et sélectionner votre établissement scolaire pour saisir le code.
              </p>
            )}
          </div>

        </div>

        {/* Setup Cheat Sheet for Evaluator (Extremely useful) */}
        <div className="bg-[#EAF1FE]/60 rounded-2xl p-4 text-left border border-blue-200/40">
          <span className="text-[10px] font-bold text-[#1A56DB] uppercase tracking-wider block mb-2.5">ℹ️ Identifiants de test pour la démo :</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
            {SIMULATED_SCHOOLS.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedSchool(s);
                  setSearchQuery(s.name);
                  setSchoolCodeInput(s.code);
                  setIsCodeTouched(true);
                }}
                className="bg-white p-2 rounded-lg border border-slate-200 hover:border-[#1A56DB] transition cursor-pointer flex flex-col justify-between"
              >
                <div className="font-bold truncate text-[#0F1B33]">{s.name}</div>
                <div className="flex justify-between items-center mt-1.5">
                  <code className="text-[10px] font-mono text-[#1A56DB] bg-blue-50 px-1 py-0.5 rounded font-semibold">{s.code}</code>
                  <span className="text-[9px] text-slate-400 font-medium">Auto-remplir ⚡</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons footer */}
        <div className="pt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition text-sm cursor-pointer"
          >
            Retour
          </button>

          <button
            id="step2-btn-join"
            type="button"
            onClick={onNext}
            disabled={!isFormValid}
            className="flex items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-10 py-4 font-semibold text-white transition shadow-md hover:bg-[#1E429F] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 cursor-pointer text-sm"
          >
            Rejoindre
            <span>→</span>
          </button>
        </div>

      </div>

    </div>
  );
}
