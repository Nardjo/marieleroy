# Déploiement sur Coolify

Ce guide explique comment déployer l'application Marie Leroy sur Coolify.

## Prérequis

- Un serveur Coolify configuré
- Un nom de domaine pointant vers votre serveur
- Accès à votre dépôt Git

## Configuration Coolify

### 1. Créer un nouveau projet

Dans Coolify, créez un nouveau projet de type "Docker Compose" ou "Dockerfile".

### 2. Lier le dépôt Git

- Connectez votre dépôt GitHub/GitLab
- Sélectionnez la branche à déployer (généralement `main`)

### 3. Configurer la base de données PostgreSQL

Dans Coolify, ajoutez un service PostgreSQL:
- **Type**: PostgreSQL 16
- **Database Name**: `marieleroy`
- **Username**: (généré automatiquement)
- **Password**: (généré automatiquement)

Coolify générera automatiquement une variable `DATABASE_URL`.

### 4. Variables d'environnement requises

Dans Coolify, configurez les variables d'environnement suivantes:

#### Variables obligatoires

```bash
# Node Environment
NODE_ENV=production

# Auth Session Secret (IMPORTANT: générer avec: openssl rand -base64 32)
NUXT_SESSION_PASSWORD=votre-secret-genere-ici-min-32-chars

# Site Configuration
SITE_NAME=Marie Leroy
SITE_URL=https://marieleroy.fr

# File Upload Directory
UPLOAD_DIR=/app/uploads
```

#### Variables optionnelles

```bash
# Email (pour les notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=votre-email@example.com
SMTP_PASSWORD=votre-mot-de-passe
SMTP_FROM=noreply@marieleroy.fr

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXX-X
GOOGLE_TAG_MANAGER_ID=GTM-XXXXX
```

### 5. Configurer le volume persistant pour les uploads

Dans Coolify, créez un volume persistant:
- **Source**: `/app/uploads` (dans le container)
- **Destination**: `/data/uploads` (sur l'hôte)

Cela garantit que les fichiers uploadés ne seront pas perdus lors des redéploiements.

### 6. Configurer le domaine

- Ajoutez votre nom de domaine dans Coolify
- Activez le SSL automatique (Let's Encrypt)

### 7. Port et Health Check

Le Dockerfile est configuré avec:
- **Port**: 3000
- **Health Check**: `/api/health` (vérifié automatiquement)

### 8. Déployer

Cliquez sur "Deploy" dans Coolify. Le processus:

1. Clone le dépôt
2. Build l'image Docker (multi-stage)
3. Exécute les migrations Prisma (`db:push`)
4. Démarre l'application

## Post-déploiement

### Créer le premier utilisateur admin

Connectez-vous au container via Coolify et exécutez:

```bash
pnpm user:create
```

Suivez les instructions pour créer votre compte administrateur.

### Seed des données (optionnel)

Si vous voulez ajouter des données de démonstration:

```bash
pnpm db:seed
```

## Troubleshooting

### L'application ne démarre pas

1. Vérifiez les logs dans Coolify
2. Assurez-vous que `DATABASE_URL` est correctement configurée
3. Vérifiez que `NUXT_SESSION_PASSWORD` est défini (min 32 caractères)
4. Vérifiez que `SITE_URL` correspond à votre domaine

### Les uploads ne fonctionnent pas

1. Vérifiez que le volume `/app/uploads` est bien monté
2. Vérifiez les permissions du dossier uploads

### Problèmes de base de données

1. Vérifiez que le service PostgreSQL est actif
2. Testez la connexion avec `DATABASE_URL`
3. Vérifiez les logs Prisma dans les logs de l'application

## Redéploiement

Pour redéployer:
1. Push vos changements sur Git
2. Coolify redéploiera automatiquement (si auto-deploy activé)
3. Ou cliquez sur "Redeploy" dans Coolify

## Rollback

En cas de problème, utilisez la fonction "Rollback" de Coolify pour revenir à une version précédente.

## Performance

Le Dockerfile utilise un build multi-stage optimisé:
- **Build time**: ~5-8 minutes
- **Image size**: ~300-400 MB (optimisé)
- **Memory usage**: ~200-300 MB en production

## Sécurité

- ✅ Variables d'environnement cryptées dans Coolify
- ✅ SSL/TLS automatique avec Let's Encrypt
- ✅ Health checks configurés
- ✅ Secrets séparés du code source
- ✅ Image Alpine minimale
