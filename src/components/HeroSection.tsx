import React, { useState } from 'react';
import { Sparkles, Users, Award, ShieldCheck, ArrowRight, HelpCircle, BookOpen } from 'lucide-react';
const studentHeroImg = "/src/assets/images/student_hero_portrait_1783423693371.jpg";

interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="animate-fade-in w-full bg-[#EAF1FE] py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100 flex flex-col md:flex-row">
          
          {/* COLONNE GAUCHE (Avec motif de points décoratif LÉGER exclusif à cette colonne) */}
          <div className="relative w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100">
            {/* Dots background limited strictly to the left column wrapper */}
            <div className="absolute inset-0 dots-pattern pointer-events-none" />
            
            {/* Left Content Container (Relative to stay above dots) */}
            <div className="relative z-10 flex flex-col items-start">
              {/* Étiquette Section Pilule */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF1FE] px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-[#1A56DB] uppercase">
                <Sparkles className="h-3 w-3" />
                ◆ REJOINDRE VOTRE ÉCOLE
              </div>
              
              {/* Titre principal */}
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-[#0F1B33] sm:text-5xl">
                Rejoignez votre école <br />
                <span className="text-[#1A56DB]">en quelques clics</span>
              </h1>
              
              {/* Sous-titre */}
              <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-md">
                Bienvenue sur <span className="font-semibold text-[#0F1B33]">EduSchool</span>, le portail scolaire unifié de nouvelle génération. Connectez-vous instantanément en tant qu’élève, parent ou enseignant pour accéder à vos cours, notes et activités.
              </p>
              
              {/* CTA Boutons Pilule */}
              <div className="mt-8 flex flex-wrap gap-4 items-center w-full sm:w-auto">
                <button
                  id="hero-btn-start"
                  onClick={onStart}
                  className="group flex items-center justify-center gap-2 rounded-full bg-[#1A56DB] px-8 py-4 font-semibold text-white transition-all shadow-md hover:bg-[#1E429F] hover:shadow-lg active:scale-95 text-sm sm:text-base cursor-pointer"
                >
                  Commencer
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  id="hero-btn-info"
                  onClick={() => setShowLearnMore(!showLearnMore)}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 text-sm"
                >
                  {showLearnMore ? 'Fermer l\'aide' : 'En savoir plus'}
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Collapsible Info Section */}
              {showLearnMore && (
                <div className="mt-6 p-4 rounded-2xl bg-[#EAF1FE]/70 border border-[#1A56DB]/10 text-xs text-slate-600 space-y-2 animate-fade-in">
                  <p className="font-semibold text-[#1A56DB] flex items-center gap-1.5">
                    <Award className="h-4 w-4" /> Comment ça marche ?
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Renseignez votre profil de connexion (adresse email et mot de passe).</li>
                    <li>Sélectionnez votre rôle (Élève, Parent ou Professeur).</li>
                    <li>Recherchez votre établissement scolaire par son nom officiel.</li>
                    <li>Saisissez le code d'établissement unique fourni par votre école.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE (STRICTEMENT UNIE SANS AUCUN MOTIF DE POINTS) */}
          <div className="relative w-full md:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center min-h-[350px] md:min-h-[480px]">
            {/* Halo de lumière bleu circulaire en arrière-plan */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-blue-100 blur-3xl opacity-60 pointer-events-none" />

            {/* Container principal de l'image */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Cadre d'image arrondi sophistiqué avec ombre */}
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-slate-100">
                <img
                  src={studentHeroImg}
                  alt="Portrait Élève EduSchool"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* STAT CARD FLOTTANTE 1 (Élèves connectés) */}
              <div className="absolute -top-4 -left-6 z-20 bg-[#0F1B33] text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="h-9 w-9 rounded-xl bg-[#1A56DB] flex items-center justify-center">
                  <Users className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white tracking-tight">50 000+</div>
                  <div className="text-[10px] text-slate-300 font-medium">Élèves connectés</div>
                </div>
              </div>

              {/* STAT CARD FLOTTANTE 2 (Parents actifs) */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 animate-bounce" style={{ animationDuration: '5.5s' }}>
                <div className="h-9 w-9 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Award className="h-4.5 w-4.5 text-pink-600" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-extrabold text-slate-900">8 000+</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Parents actifs</div>
                </div>
              </div>

              {/* Badge de sécurité discret */}
              <div className="absolute bottom-4 left-4 z-20 bg-[#EAF1FE]/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-blue-200">
                <ShieldCheck className="h-3.5 w-3.5 text-[#1A56DB]" />
                <span className="text-[9px] font-bold text-[#1A56DB] uppercase tracking-wider">Connexion Chiffrée SSL</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
