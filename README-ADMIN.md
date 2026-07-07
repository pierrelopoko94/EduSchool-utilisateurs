# EduSchool — Espace Direction & Administration (MVP)

Ce document définit les spécifications de la version **MVP (Minimum Viable Product)** de la plateforme d'administration d'établissement scolaire d'EduSchool (Fichier 1). Il clarifie le périmètre fonctionnel immédiat requis pour démontrer la valeur du produit tout en réduisant le temps de mise sur le marché (Time-To-Market), et segmente les fonctionnalités avancées pour les phases ultérieures.

---

## 1. Objectif du MVP

Le MVP de l'**Espace Direction & Administration** vise à fournir aux directeurs et fondateurs d'écoles un outil simple et instantané pour numériser leur structure. Il doit permettre de créer virtuellement l'établissement, de piloter les indicateurs d'assiduité généraux, et d'affecter les enseignants et leurs charges de cours afin d'établir la structure de base nécessaire aux espaces élèves, parents, et professeurs.

---

## 2. Périmètre MVP — Fonctionnalités Indispensables

Pour cette première version, seules les fonctionnalités clés apportant une valeur de démonstration immédiate et structurant l'école sont retenues :

*   **Onboarding Express de l'Établissement** : Saisie simple du nom, localisation, type (Primaire/Secondaire) et génération automatique du code d'établissement unique de l'école.
*   **Tableau de Bord de Pilotage Standard** : Vue d'ensemble contenant les indicateurs macroscopiques (nombre d'élèves, de professeurs inscrits, taux de présence global moyen).
*   **Registre & Affectation du Personnel** : Liste simplifiée des enseignants avec attribution de leur matière principale et affectation à une classe.
*   **Visualisation de l'Emploi du Temps** : Grille horaire de base sous forme de fiches par classe pour s'assurer de la cohérence de l'occupation des locaux et des disponibilités.
*   **Génération de Badge QR d'Assiduité** : Outil permettant de visualiser et d'attribuer un code QR de présence unique pour chaque élève de la base de démonstration.

---

## 3. Reporté en Phase 2 / Phase 3 (Hors MVP)

Certaines fonctionnalités, bien que présentes dans la démonstration interactive, sont reportées pour l'implémentation d'un produit réel afin de simplifier le premier livrable :

*   **Rapports Statistiques Approfondis (D3/Recharts complexes)** *(Phase 2)* : Les graphiques d'analyse prédictive et les filtres multicritères d'assiduité historique ne sont pas bloquants pour le lancement initial.
*   **Module de Comptabilité & Suivi des Frais de Scolarité** *(Phase 3)* : La facturation des frais scolaires, les relances automatiques et les passerelles de paiement bancaires réclament des développements complexes et de lourdes certifications de sécurité.
*   **Imports de Masse Excel/CSV** *(Phase 2)* : Le peuplement de la base élèves/professeurs se fera manuellement ou via des scripts de démonstration pré-configurés au démarrage.
*   **Journal de Logs d'Audit Système & Sécurité** *(Phase 3)* : Suivi de la traçabilité complète des actions administratives, indispensable à terme mais secondaire pour valider l'adéquation produit-marché (Product-Market Fit).

---

## 4. Tableau Récapitulatif du Périmètre

| Fonctionnalité | Rôle / Module | Statut | Justification |
| :--- | :--- | :--- | :--- |
| **Création d'établissement** | Configuration | **MVP** | Indispensable pour générer l'identité de l'école et le code établissement d'affiliation. |
| **Vue d'ensemble des statistiques** | Directeur | **MVP** | Offre une valeur perçue immédiate dès la première connexion (KPIs de base). |
| **Registre des Enseignants** | Personnel | **MVP** | Requis pour structurer l'affectation des matières et classes. |
| **Grille Horaire (Consultation)** | Planification | **MVP** | Démontre la capacité d'organisation structurelle de l'établissement. |
| **Génération Badge QR** | Présence | **MVP** | Permet d'alimenter manuellement ou par simulation le suivi d'assiduité. |
| **Gestion des notes et bulletins** | Directeur | **Phase 2** | La validation finale et l'édition de masse des bulletins peuvent être gérées par les profs titulaires dans un premier temps. |
| **Paiements Mobiles intégrés** | Comptabilité | **Phase 3** | Complexité d'intégration technique et réglementaire élevée. |
| **Imports/Exports CSV** | Données | **Phase 2** | Peut être contourné au début par une saisie manuelle ou un peuplement par défaut. |

---

## 5. Roadmap d'Évolution (Admin)

### Phase 1 : Cœur Métier & Configuration (MVP actuel)
*   Initialisation et onboarding des écoles.
*   Configuration manuelle de la liste des professeurs et attribution des classes.
*   Génération des codes élèves et codes d'établissement.

### Phase 2 : Automatisation & Communication
*   Importation en un clic de la liste des élèves depuis un fichier Excel/CSV.
*   Module de validation des appréciations des bulletins soumis par les enseignants titulaires.
*   Édition et export des bulletins scolaires officiels au format PDF.

### Phase 3 : Services Financiers & Notifications
*   Passerelle d'encaissement des frais de scolarité par Mobile Money et Cartes Bancaires.
*   Rapports financiers de l'établissement (frais perçus, impayés, salaires enseignants).
*   Logs d'audit de sécurité complets pour la traçabilité des modifications.

---

## 6. Stack Technique

La plateforme d'administration repose sur une architecture moderne, fluide et performante :

*   **Framework** : React 18+ propulsé par Vite pour une exécution ultra-rapide côté client (SPA).
*   **Styling** : Tailwind CSS pour un design épuré, des espacements rigoureux et une adaptabilité parfaite aux tablettes et ordinateurs.
*   **Librairie d'icônes** : Lucide React (standardisé pour l'ensemble des éléments de contrôle).
*   **Composants d'Animation** : Motion (anciennement Framer Motion) pour des micro-transitions fluides.

---

## 7. Note de Démonstration

Ce projet est un prototype hautement interactif conçu pour valider l'expérience utilisateur (UX) et le parcours métier. Les données affichées sont simulées localement afin d'offrir une fluidité parfaite et de permettre de tester tous les rôles instantanément sans configuration de serveur de base de données complexe.
