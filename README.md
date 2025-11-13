# Marie Leroy - Site Portfolio

Site web professionnel pour Marie Leroy, coach et professionnelle.

## Stack Technique

- **Framework**: Nuxt 4 (Vue 3)
- **UI**: Nuxt UI + Tailwind CSS 4
- **Base de données**: PostgreSQL + Prisma ORM
- **Authentification**: nuxt-auth-utils
- **Déploiement**: Docker + Coolify

## Fonctionnalités

- ✅ Page d'accueil avec présentation
- ✅ Section "À propos"
- ✅ Présentation de la méthode de travail
- ✅ Témoignages vidéo clients
- ✅ FAQ
- ✅ Formulaire de contact
- ✅ Panneau d'administration complet
- ✅ Gestion des contenus (CRUD)
- ✅ Upload d'images
- ✅ Paramètres SEO
- ✅ Responsive design
- ✅ Mode sombre

## Prérequis

- Node.js 20+
- pnpm (recommandé)
- Docker & Docker Compose (pour le développement)
- PostgreSQL 16

## Installation Locale

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd marieleroy
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration des variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs:

```bash
# Database
DATABASE_URL=postgresql://admin:changeme@localhost:5433/marieleroy

# Auth Secret (générer avec: openssl rand -base64 32)
NUXT_SESSION_PASSWORD=your-dev-secret-at-least-32-chars

# Site
SITE_NAME=Marie Leroy
SITE_URL=http://localhost:3000
```

### 4. Démarrer avec Docker Compose

```bash
docker-compose up -d
```

Cela démarre:
- PostgreSQL sur le port 5433
- L'application Nuxt sur le port 3000

### 5. Initialiser la base de données

```bash
# Dans le container ou en local
pnpm db:push

# Seed des données de démonstration (optionnel)
pnpm db:seed
```

### 6. Créer un utilisateur admin

```bash
pnpm user:create
```

Suivez les instructions pour créer votre compte.

### 7. Accéder à l'application

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **API**: http://localhost:3000/api
- **Prisma Studio**: `pnpm db:studio`

## Développement

### Scripts disponibles

```bash
# Développement
pnpm dev                 # Démarrer le serveur dev

# Base de données
pnpm db:generate        # Générer le client Prisma
pnpm db:push            # Pousser le schéma vers la DB
pnpm db:migrate         # Créer une migration
pnpm db:studio          # Ouvrir Prisma Studio
pnpm db:seed            # Seed la base de données

# Build
pnpm build              # Build pour production
pnpm preview            # Preview du build

# Utilisateurs
pnpm user:create        # Créer un utilisateur admin
```

### Structure du projet

```
marieleroy/
├── app/
│   ├── components/     # Composants Vue
│   ├── composables/    # Composables Vue
│   ├── layouts/        # Layouts Nuxt
│   ├── pages/          # Pages et routes
│   └── public/         # Assets publics
├── server/
│   ├── api/            # Routes API
│   ├── middleware/     # Middleware serveur
│   └── utils/          # Utilitaires serveur
├── prisma/
│   ├── schema.prisma   # Schéma de la DB
│   └── seed.ts         # Données de seed
├── scripts/            # Scripts utilitaires
├── uploads/            # Fichiers uploadés (gitignored)
└── docker-compose.yml  # Config Docker dev
```

## Déploiement sur Coolify

Voir le guide détaillé: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Résumé rapide

1. **Connecter le dépôt Git** dans Coolify
2. **Ajouter un service PostgreSQL**
3. **Configurer les variables d'environnement**:
   ```bash
   NODE_ENV=production
   DATABASE_URL=<auto-généré-par-coolify>
   NUXT_SESSION_PASSWORD=<générer-avec-openssl>
   SITE_URL=https://votre-domaine.com
   UPLOAD_DIR=/app/uploads
   ```
4. **Configurer un volume persistant** pour `/app/uploads`
5. **Déployer**

### Générer un secret sécurisé

```bash
./scripts/generate-secret.sh
```

Ou manuellement:

```bash
openssl rand -base64 32
```

## Production (Docker auto-hébergé)

Si vous préférez auto-héberger sans Coolify:

```bash
# Build et démarrage
docker-compose -f docker-compose.prod.yml up -d

# Créer l'admin
docker exec -it marieleroy_app_prod pnpm user:create
```

## Tests

```bash
# Tests unitaires
pnpm test

# E2E tests
pnpm test:e2e
```

## Administration

### Accès au panneau admin

URL: `/admin`

Fonctionnalités:
- Gestion des témoignages
- Gestion de la FAQ
- Édition de la section "À propos"
- Configuration de la méthode de travail
- Paramètres du site
- Réseaux sociaux
- SEO

### Sécurité

- ✅ Authentification requise pour l'admin
- ✅ Sessions sécurisées avec cookies httpOnly
- ✅ Validation Zod sur toutes les entrées
- ✅ Hashing bcrypt des mots de passe
- ✅ Protection CSRF
- ✅ Sanitization des uploads

## Technologies Utilisées

### Frontend
- Nuxt 4
- Vue 3 (Composition API)
- Nuxt UI (Headless UI + Tailwind)
- VueUse Motion (animations)
- Lucide Icons

### Backend
- Nitro (serveur Nuxt)
- Prisma ORM
- PostgreSQL
- nuxt-auth-utils
- Zod (validation)
- bcryptjs (hashing)

### DevOps
- Docker
- Docker Compose
- Coolify (déploiement)

## Support

Pour toute question ou problème:
- Vérifier la [documentation de déploiement](./DEPLOYMENT.md)
- Consulter les logs: `docker logs marieleroy_app`
- Ouvrir une issue sur GitHub

## License

Privé - Tous droits réservés
