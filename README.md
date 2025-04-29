# LOOM - Les Ours Occitanie Méditerranée

## 🚀 Vue d'ensemble

LOOM est une application web moderne pour l'association Les Ours Occitanie Méditerranée, construite avec React et TypeScript.

## 🛠️ Stack Technique

### Frontend
- **Framework**: React 18 avec TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **UI Components**: Shadcn/ui (basé sur Radix UI)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

### Backend & Services
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Stockage**: Supabase Storage
- **API**: REST avec Supabase

## 📁 Structure du Projet

```
src/
├── components/         # Composants réutilisables
│   ├── admin/         # Composants spécifiques à l'admin
│   ├── auth/          # Composants d'authentification
│   ├── ui/            # Composants UI de base
│   └── shared/        # Composants partagés
├── contexts/          # Contextes React
├── hooks/             # Hooks personnalisés
├── lib/               # Utilitaires et configurations
├── pages/             # Pages de l'application
│   ├── admin/         # Pages du panneau d'administration
│   ├── auth/          # Pages d'authentification
│   └── public/        # Pages publiques
└── types/             # Types TypeScript
```

## 🔐 Authentification

- Système d'authentification complet avec Supabase
- Rôles utilisateurs : Admin et Utilisateur standard
- Protection des routes admin avec `RequireAuth` et `RequireAdmin`
- Gestion des sessions persistantes

## 🎨 Fonctionnalités Principales

### Public
- Galerie de photos
- Liste des événements
- Articles et actualités
- Page "Monsieur Ours"
- Liste des partenaires
- Formulaire de contact
- Redirection vers HelloAsso (adhésion et boutique)

### Administration
- Dashboard avec statistiques
- Gestion des articles (CRUD)
- Gestion des événements (CRUD)
- Gestion de la galerie photos
- Gestion des utilisateurs
- Gestion des tickets de contact

## 🔄 Navigation

- Navigation forcée avec rechargement complet pour garantir la stabilité de la connexion Supabase
- Titres de page dynamiques pour chaque route
- Protection des routes sensibles

## 🚀 Déploiement

Le site est déployé sur Vercel avec les configurations suivantes :
- Build automatique à chaque push
- Variables d'environnement pour les clés Supabase
- Optimisation des performances

## 🔧 Configuration Requise

```bash
# Variables d'environnement (.env)
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## 📦 Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

## 🛠️ Maintenance

- Mise à jour régulière des dépendances
- Sauvegarde automatique de la base de données Supabase
- Monitoring des performances via Vercel Analytics

## 📝 Notes Techniques

- Utilisation de React Query pour la gestion du cache et des requêtes
- Optimisation des images avec Supabase Storage
- Gestion des erreurs globalisée
- Support multilingue (préparé pour internationalisation)

## 🔍 SEO

- Meta tags dynamiques
- Sitemap généré automatiquement
- Structure sémantique HTML5
- Optimisation des images et du contenu

## 🤝 Contribution

1. Fork du projet
2. Création d'une branche (`git checkout -b feature/AmazingFeature`)
3. Commit des changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouverture d'une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
