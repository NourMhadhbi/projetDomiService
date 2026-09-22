# DomiService

**DomiService** est une plateforme web de mise en relation entre des **clients** et des **prestataires de services à domicile** (plombiers, électriciens, femmes de ménage, entreprises de service, etc.). L'application permet à un client de rechercher un intervenant, de consulter sa fiche, de prendre rendez-vous, de le noter/commenter, de le signaler ou de l'ajouter à ses favoris. Un espace **administrateur** permet de gérer l'ensemble de la plateforme (utilisateurs, services, signalements, statistiques).

Le projet est constitué de deux applications séparées :

- **`backend/`** : une API REST développée avec **Node.js / Express** et **Prisma ORM** (base de données **MySQL**).
- **`frontend/`** : une application **React (Vite)** avec **Redux Toolkit** pour la gestion d'état.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Rôles utilisateurs](#rôles-utilisateurs)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Modèle de données](#modèle-de-données)
- [Prérequis](#prérequis)
- [Installation](#installation)
  - [1. Cloner le projet](#1-cloner-le-projet)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Compte administrateur](#compte-administrateur)
- [Aperçu des routes API](#aperçu-des-routes-api)
- [Scripts disponibles](#scripts-disponibles)
- [Auteur](#auteur)

---

## Fonctionnalités

- Inscription / connexion (client, prestataire, entreprise), mot de passe oublié avec vérification par code
- Authentification par JSON Web Token (JWT) avec token d'accès et token de rafraîchissement
- Recherche et consultation des prestataires par service, avec localisation sur carte (Google Maps)
- Prise de rendez-vous avec calendrier interactif (FullCalendar)
- Gestion des rendez-vous (confirmation, annulation, historique)
- Système d'avis et de notes sur les prestataires
- Gestion des favoris et des intervenants bloqués
- Signalement d'un prestataire par un client
- Formulaire de contact / messagerie client–prestataire
- Notifications utilisateur
- Notifications par e-mail (Nodemailer) et par SMS (Twilio)
- Tableau de bord administrateur : gestion des utilisateurs, des services, des signalements et statistiques globales

## Rôles utilisateurs

L'application distingue quatre rôles (`enum Role` côté base de données) :

| Rôle          | Description                                                          |
|---------------|-----------------------------------------------------------------------|
| `CLIENT`      | Recherche des prestataires, prend rendez-vous, laisse des avis        |
| `PRESTATAIRE` | Propose un service, gère ses rendez-vous et son profil                |
| `ENTREPRISE`  | Variante « professionnelle » d'un prestataire (avec informations société) |
| `ADMIN`       | Supervise la plateforme (utilisateurs, services, signalements, stats) |

## Stack technique

**Backend**
- Node.js, Express 5
- Prisma ORM + MySQL
- JSON Web Token (`jsonwebtoken`) pour l'authentification
- `bcrypt` pour le hachage des mots de passe
- `nodemailer` pour l'envoi d'e-mails
- `twilio` pour l'envoi de SMS
- `node-cron` pour les tâches planifiées
- `redis` (cache / stockage temporaire, ex. codes de vérification)
- `cors`

**Frontend**
- React 19 + Vite
- Redux Toolkit + Redux Persist (gestion et persistance de l'état global)
- React Router DOM (navigation et routes protégées)
- Axios (appels API)
- React Bootstrap / Bootstrap 5 + Bootstrap Icons (interface)
- Material UI (MUI) + Material React Table
- FullCalendar (calendrier des rendez-vous)
- `@react-google-maps/api` (carte et géolocalisation)
- `@react-oauth/google` (connexion via Google)
- Formik + Yup (formulaires et validation)
- Recharts (statistiques admin sous forme de graphiques)
- SweetAlert2, Notistack (notifications/alertes UI)

## Architecture du projet

```
projetDomiService-master/
├── admin.txt                 # Identifiants de démonstration du compte administrateur
├── backend/                  # API REST (Express + Prisma)
│   ├── app.js                 # Point d'entrée de l'API et déclaration des routes
│   ├── package.json
│   ├── models/                # Modèles additionnels
│   ├── prisma/
│   │   ├── schema.prisma      # Schéma de la base de données
│   │   └── migrations/        # Historique des migrations Prisma
│   └── routes/                # Un fichier de routes par ressource métier
│       ├── utilisateur.route.js
│       ├── client.route.js
│       ├── prestataire.route.js
│       ├── entreprise.route.js
│       ├── service.route.js
│       ├── rendezVous.route.js
│       ├── avis.route.js
│       ├── signalement.route.js
│       ├── favorisPrestataire.route.js
│       ├── historiquePrestataire.route.js
│       ├── historiqueApp.route.js
│       ├── notification.route.js
│       ├── statistiquesAdmin.route.js
│       └── ContactMessage.route.js
│
└── frontend/                 # Application React (Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx           # Point d'entrée React
        ├── App.jsx            # Déclaration des routes de l'application
        ├── axios/Api.js       # Configuration de l'instance Axios (URL de l'API, token)
        ├── redux/store.js     # Store Redux
        ├── features/          # Slices Redux Toolkit (un par domaine métier)
        ├── services/          # Fonctions d'appel à l'API (une par domaine métier)
        └── composants/        # Composants et pages React
            ├── Accueil/            # Page d'accueil
            ├── Admin/              # Espace administrateur (dashboard, gestion)
            ├── auth/               # Routes protégées (PrivateRoute, RequireAdminRoute)
            ├── ContactPrestataire/ # Messagerie client ↔ prestataire
            ├── FichePrestataire/   # Fiche détaillée + calendrier de rendez-vous
            ├── Header/, Footer/    # Mise en page commune
            ├── Historique/         # Historique des visites/rendez-vous
            ├── Inscription/        # Formulaire d'inscription
            ├── ListDesAvis/        # Liste des avis
            ├── ListeDesRendezVous/ # Gestion des rendez-vous
            ├── ListePrestataires/  # Recherche/liste des prestataires, favoris, signalés
            ├── Password/           # Mot de passe oublié / réinitialisation
            └── ProfilUtilisateur/  # Profil utilisateur
```

## Modèle de données

La base de données (MySQL, via Prisma) s'articule autour des entités principales suivantes :

- **Utilisateur** : entité commune à tous les comptes (nom, prénom, e-mail, mot de passe, rôle, genre, image), spécialisée en `Client`, `Prestataire` ou `Admin`.
- **Client** : adresse, ville, téléphone, coordonnées GPS, rendez-vous, avis, favoris, historique, signalements.
- **Prestataire** : adresse, ville, tarif de déplacement, expérience, compétences, spécialité, service proposé (`Service`), coordonnées GPS ; peut être lié à une **Entreprise**.
- **Entreprise** : informations complémentaires d'un prestataire agissant en tant que société.
- **Service** : catégorie de service proposée sur la plateforme (nom, description, image).
- **RendezVous** : rendez-vous entre un client et un prestataire (date, lieu, raison, statut : `EN_ATTENTE`, `CONFIRME`, `TERMINE`, `ANNULE`).
- **Avis** : note et commentaire laissés par un client sur un prestataire.
- **Signalement** : signalement d'un prestataire par un client.
- **FavorisPrestataire** : gestion des prestataires favoris/bloqués par un client.
- **HistoriquePrestataire** / **HistoriqueApp** : historique de consultation des prestataires / de connexion à l'application.
- **Notification** : notifications envoyées à un utilisateur.

Le schéma complet est disponible dans [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

## Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/)
- Un serveur **MySQL** accessible (local ou distant)
- (Optionnel, pour les fonctionnalités complètes) un serveur **Redis**, un compte **Twilio** (SMS) et un compte e-mail compatible **Nodemailer**

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/<votre-compte>/projetDomiService.git
cd projetDomiService-master
```

### 2. Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` à la racine de `backend/` (voir la section [Variables d'environnement](#variables-denvironnement)), puis générez le client Prisma et appliquez les migrations sur votre base de données :

```bash
npx prisma generate
npx prisma migrate deploy
```

> En développement, vous pouvez utiliser `npx prisma migrate dev` pour créer/mettre à jour la base à partir du schéma.

Démarrez le serveur :

```bash
node app.js
```

Le serveur écoute par défaut sur `http://localhost:3001`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible par défaut sur `http://localhost:5173`.

> ⚠️ L'URL de l'API est actuellement codée en dur dans [`frontend/src/axios/Api.js`](frontend/src/axios/Api.js) (`http://localhost:3001/api/`). Adaptez cette valeur si votre backend tourne sur une autre adresse/port.

## Variables d'environnement

Le backend attend un fichier `.env` (non fourni dans le dépôt) contenant au minimum :

```env
# Base de données MySQL (Prisma)
DATABASE_URL="mysql://<utilisateur>:<mot_de_passe>@<hote>:3306/<nom_de_la_base>"

# Port du serveur (optionnel, 3001 par défaut)
PORT=3001

# JWT
SECRET=<clé_secrète_pour_le_token_d'accès>
REFRESH_TOKEN_SECRET=<clé_secrète_pour_le_token_de_rafraîchissement>

# Twilio (envoi de SMS)
TWILIO_ACCOUNT_SID=<votre_sid_twilio>
TWILIO_AUTH_TOKEN=<votre_token_twilio>
TWILIO_PHONE_NUMBER=<numéro_twilio>

# Redis (si utilisé pour le cache / codes de vérification)
REDIS_URL=<url_de_connexion_redis>
```

> ℹ️ **À corriger avant mise en production** : les identifiants du compte e-mail Nodemailer sont actuellement codés en dur dans [`backend/routes/utilisateur.route.js`](backend/routes/utilisateur.route.js). Il est fortement recommandé de les déplacer dans des variables d'environnement (`EMAIL_USER`, `EMAIL_PASS` par exemple) avant tout déploiement public, et de révoquer/régénérer le mot de passe actuellement exposé dans le code.

## Lancer le projet

Une fois le backend et le frontend installés et configurés :

```bash
# Terminal 1 — API
cd backend
node app.js

# Terminal 2 — Application web
cd frontend
npm run dev
```

Ouvrez ensuite `http://localhost:5173` dans votre navigateur.

## Compte administrateur

Un compte administrateur de démonstration est fourni dans [`admin.txt`](admin.txt) :

```json
{
  "identifiant": "admin@example.com",
  "motDePasse": "MotDePasseFort123"
}
```

> ⚠️ Ce compte est destiné au développement/tests uniquement. Pensez à créer un compte administrateur dédié et à supprimer ou modifier ces identifiants avant toute mise en production.

## Aperçu des routes API

Toutes les routes sont préfixées par `/api` (voir [`backend/app.js`](backend/app.js)) :

| Préfixe                          | Ressource                                   |
|-----------------------------------|----------------------------------------------|
| `/api/utilisateur`                | Authentification, gestion des utilisateurs   |
| `/api/utilisateur/prestataire`    | Gestion des prestataires                     |
| `/api/utilisateur/client`         | Gestion des clients                          |
| `/api/service`                    | Services proposés sur la plateforme          |
| `/api/rendezVous`                 | Prise et gestion des rendez-vous             |
| `/api/avis`                       | Avis et notes                                |
| `/api/historique`                 | Historique des visites de prestataires       |
| `/api/notification`               | Notifications utilisateur                    |
| `/api/statistiquesAdmin`          | Statistiques pour le tableau de bord admin   |
| `/api/historiqueApp`              | Historique de connexion à l'application      |
| `/api/favorisPres`                | Favoris / intervenants bloqués               |
| `/api/signalement`                | Signalement de prestataires                  |
| `/api/Contact`                    | Messages de contact client–prestataire       |

## Scripts disponibles

**Backend** (`backend/package.json`)

| Commande | Description |
|---|---|
| `node app.js` | Démarre le serveur Express |
| `npx prisma studio` | Interface graphique pour explorer/éditer la base de données |
| `npx prisma migrate dev` | Applique les migrations en développement |

**Frontend** (`frontend/package.json`)

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run build` | Génère la version de production |
| `npm run preview` | Prévisualise la version de production |
| `npm run lint` | Analyse le code avec ESLint |

## Auteur

Projet développé dans le cadre d'un stage / d'un projet académique (voir [`backend/package.json`](backend/package.json), nom interne du projet : `stage1annee`).
