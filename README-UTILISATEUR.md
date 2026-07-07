# EduSchool — Espace Élève, Parent & Professeur (MVP)

Ce document définit les spécifications de la version **MVP (Minimum Viable Product)** de la plateforme utilisateur multi-rôles d'EduSchool (Fichier 2). Il liste les objectifs, le périmètre, les exclusions et la feuille de route d'évolution pour les rôles d'Élèves, de Parents et de Professeurs.

---

## 1. Objectif du MVP

Le MVP de l'**Espace Utilisateur (Élève/Parent/Professeur)** d'EduSchool a pour but de valider en situation réelle les parcours de consultation et d'évaluation scolaire. En quelques secondes, un utilisateur doit pouvoir s'affilier à son école, accéder à son espace dédié pour consulter les notes et performances (élèves & parents) ou enregistrer les notes d'évaluation continue directement depuis une interface mobile-first intuitive (professeurs).

---

## 2. Périmètre MVP — Fonctionnalités Indispensables

Afin de garantir un produit simple, robuste et livrable rapidement, les fonctionnalités du MVP sont limitées aux suivantes :

*   **Inscription Simplifiée & Affiliation** : Parcours d'inscription fluide avec rattachement immédiat à un établissement scolaire grâce au **Code Établissement** fourni par l'administration.
*   **Espace Élève (Consultation)** : Visualisation de l'emploi du temps quotidien, historique des notes obtenues par matière et prévisualisation du bulletin périodique.
*   **Espace Parent (Rapprochement familial)** : Association d'un ou plusieurs enfants à son compte unique grâce au **Code Élève** (ex: `ELV-4M9P`), puis consultation des moyennes de l'enfant et de sa situation d'assiduité globale.
*   **Espace Professeur (Évaluation continue)** : Liste des classes attribuées, accès direct aux fiches d'élèves, et module de saisie rapide des notes d'évaluation pour les matières enseignées.

---

## 3. Reporté en Phase 2 / Phase 3 (Hors MVP)

Les fonctionnalités suivantes ne sont pas jugées indispensables pour lancer le produit initial et sont ainsi reportées pour simplifier le développement :

*   **Paiement du Bulletin à 1$** *(Phase 3)* : Le déblocage payant du bulletin par les parents via Mobile Money ou SMS surtaxé est une innovation majeure mais nécessite d'importants accords avec les opérateurs télécoms nationaux. Le bulletin sera consultable gratuitement au lancement.
*   **Scanner de Présence QR Code** *(Phase 2)* : Bien que le badge QR soit généré par défaut pour illustrer la vision d'assiduité d'EduSchool, l'application de scan côté enseignant et la synchronisation en temps réel de la présence physique sont reportées en Phase 2.
*   **Messagerie Intégrée Parents-École** *(Phase 2)* : Le canal de discussion directe et d'envoi de pièces jointes (justificatifs d'absence, convocations) sera remplacé par les canaux traditionnels (SMS, appels) au lancement.
*   **Double distinction de Statut Enseignant (Normal vs Titulaire)** *(Phase 2)* : Dans le MVP, tous les professeurs accèdent à la saisie de note standard pour leurs classes attribuées, sans gestion complexe de rôles croisés de professeurs principaux ("titulaires").
*   **Distribution Multi-canal automatisée des codes** *(Phase 3)* : La diffusion automatique des codes élèves par SMS ou WhatsApp nécessite des passerelles tierces coûteuses. Au départ, l'administration distribuera les codes sur papier ou par courriel.
*   **Vérification par Code de Confirmation à 6 chiffres (2FA Réel)** *(Phase 2)* : Le flux visuel à 6 chiffres simulé dans le prototype actuel est conservé pour l'esthétique du parcours utilisateur, mais l'intégration technique avec un service d'envoi d'OTP SMS réel (comme Twilio) est reportée pour accélérer la livraison.

---

## 4. Tableau Récapitulatif du Périmètre

| Fonctionnalité | Rôle concerné | Statut | Justification |
| :--- | :--- | :--- | :--- |
| **Inscription & Choix du Rôle** | Tous | **MVP** | Élément fondateur pour aiguiller l'utilisateur vers son tableau de bord spécifique. |
| **Saisie de code école** | Tous | **MVP** | Permet l'ancrage territorial et l'association des données de l'établissement. |
| **Saisie de notes en ligne** | Professeur | **MVP** | Fonctionnalité majeure pour alimenter le bulletin en données réelles. |
| **Suivi académique (Notes/Bulletin)** | Élève / Parent | **MVP** | Démontre la transparence et la valeur de suivi de la plateforme. |
| **Rapprochement par Code Élève** | Parent | **MVP** | Assure l'accès sécurisé aux seules notes de ses propres enfants. |
| **Scanner QR d'assiduité** | Professeur | **Phase 2** | Demande un ajustement de l'UX en conditions réelles de classe (luminosité, rapidité). |
| **Messagerie & Chat** | Parent / École | **Phase 2** | Peut être géré par des outils existants (WhatsApp) lors de la V1. |
| **Paiement de bulletin (1$)** | Parent | **Phase 3** | Forte complexité réglementaire, requiert une base utilisateur déjà installée. |
| **Envoi OTP SMS réel (2FA)** | Tous | **Phase 2** | Uniquement simulé au lancement pour ne pas dépendre d'abonnements télécoms externes. |

---

## 5. Roadmap d'Évolution (Utilisateur)

### Phase 1 : Collecte & Restitution (MVP actuel)
*   Affiliation des élèves, parents et professeurs à l'établissement scolaire.
*   Saisie de notes d'évaluation en direct par les professeurs sur leur mobile ou ordinateur.
*   Consultation en direct des moyennes et relevés par les élèves et leurs parents.

### Phase 2 : Communication & Présence
*   Module de pointage d'assiduité par scan rapide de badge QR d'élèves par l'enseignant.
*   Messagerie directe asynchrone parent-professeur pour le suivi de comportement.
*   Module de justification d'absence en ligne avec téléversement de certificat médical.

### Phase 3 : Monétisation & Notification Multi-canal
*   Déverrouillage payant sécurisé du bulletin final (1$) via Mobile Money pour l'autofinancement des serveurs scolaires.
*   Notifications push d'absence ou de nouvelle note reçues par SMS ou canal WhatsApp automatisé.
*   Espace de devoirs en ligne (cahier de texte partagé et dépôt d'exercices).

---

## 6. Stack Technique

L'application utilisateur s'appuie sur la même base technologique performante que l'espace d'administration pour simplifier la maintenance et le déploiement :

*   **Framework** : React 18+ propulsé par Vite pour une navigation instantanée et fluide.
*   **Styling** : Tailwind CSS, configuré pour une approche ultra-mobile-first afin que parents et élèves consultent leurs espaces depuis leur téléphone portable sans aucune contrainte d'affichage.
*   **Librairie d'icônes** : Lucide React (standardisé pour l'ensemble des éléments de contrôle).
*   **Composants d'Animation** : Motion pour garantir un rendu dynamique lors des changements d'écrans de l'onboarding.

---

## 7. Note de Démonstration

Ce projet est un prototype interactif à visée démonstrative. Il permet de simuler en temps réel les interactions croisées entre un enseignant qui saisit une note de devoir et un parent qui la consulte instantanément. L'ensemble des flux d'authentification par code et d'association d'élèves est simulé localement à l'aide de données d'exemple types.
