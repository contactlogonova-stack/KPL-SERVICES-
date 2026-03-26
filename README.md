<div align="center">
  <img src="https://i.postimg.cc/vZQQ6y8s/logo.png" alt="KPL SERVICES Logo" width="200"/>
  <h1>KPL SERVICES</h1>
  <p><strong>KPL Events & Surprise - Toujours à votre service</strong></p>
  <p>Votre agence événementielle de premier choix pour des expériences inoubliables.</p>
</div>

---

## 📝 À propos du projet

**KPL SERVICES** est une application web vitrine et de gestion conçue pour une agence événementielle. Elle permet aux clients de découvrir les prestations proposées (décoration, surprises, coordination, location de matériel), de consulter les différents packs tarifaires, d'explorer les réalisations passées, et d'effectuer des demandes de réservation en ligne. 

L'application inclut également un **tableau de bord administrateur** complet et sécurisé permettant de gérer le contenu du site (galerie, témoignages, réalisations) ainsi que les interactions clients (messages de contact, demandes de réservation).

## ✨ Fonctionnalités principales

- **Multilingue (FR/EN)** : Support complet du français et de l'anglais pour une clientèle internationale.
- **Système de Réservation** : Formulaire interactif en plusieurs étapes pour faciliter les demandes de réservation de packs (Mariage, Anniversaire, etc.).
- **Galerie & Réalisations** : Affichage dynamique et filtrable des projets passés pour inspirer les futurs clients.
- **Tableau de Bord Administrateur** : Interface privée et sécurisée (via Supabase Auth) pour gérer les réservations, les messages, et le contenu public.
- **Design Responsive** : Interface moderne, élégante et fluide, parfaitement adaptée à tous les écrans (mobile, tablette, desktop).
- **Animations** : Transitions fluides et animations d'apparition pour une expérience utilisateur premium.

## 🛠️ Stack Technique

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS
- **Routage** : React Router v6
- **Animations** : Framer Motion (`motion/react`)
- **Icônes** : Lucide React
- **Internationalisation** : React i18next
- **Backend / Base de données** : Supabase (PostgreSQL, Authentication, Storage)

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
   ```bash
   git clone <votre-url-de-depot>
   cd kpl-services
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez vos clés de configuration Supabase (nécessaires pour la base de données PostgreSQL et l'authentification) :
   ```env
   VITE_SUPABASE_URL=votre_supabase_url
   VITE_SUPABASE_ANON_KEY=votre_supabase_anon_key
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000` (ou le port indiqué dans votre terminal).

## 📦 Scripts disponibles

- `npm run dev` : Lance le serveur de développement avec rechargement à chaud.
- `npm run build` : Compile l'application pour la production dans le dossier `dist/`.
- `npm run preview` : Prévisualise le build de production localement.
- `npm run lint` : Vérifie les erreurs de syntaxe et le respect des règles de code (ESLint).

## 👨‍💻 Crédits

Conçu et développé par **[Logonova Agency](https://logonova.site)**.
