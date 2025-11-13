# Docker Setup

## Démarrage rapide

### Démarrer tous les services (DB + App)

```bash
docker-compose up -d
```

Cela va:
1. Démarrer PostgreSQL sur le port 5432
2. Attendre que la DB soit prête
3. Démarrer l'application Nuxt sur le port 3000
4. Appliquer automatiquement le schéma Prisma à la DB
5. Lancer le serveur de développement

### Démarrer uniquement la base de données

```bash
docker-compose up -d postgres
```

Puis en local:
```bash
pnpm install
pnpm db:push      # Appliquer le schéma à la DB
pnpm dev          # Démarrer l'app en local
```

## Commandes utiles

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Seulement l'app
docker-compose logs -f app

# Seulement postgres
docker-compose logs -f postgres
```

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime les données)

```bash
docker-compose down -v
```

### Rebuild les images

```bash
docker-compose up -d --build
```

### Exécuter des commandes dans les containers

```bash
# Shell dans le container de l'app
docker-compose exec app sh

# Prisma Studio
docker-compose exec app pnpm db:studio

# Migrations
docker-compose exec app pnpm db:migrate
```

## Variables d'environnement

Les variables sont définies dans `.env`:

- `POSTGRES_PASSWORD`: Mot de passe de la base de données
- `DATABASE_URL`: URL de connexion PostgreSQL
- `BETTER_AUTH_SECRET`: Secret pour Better Auth (minimum 32 caractères)
- `BETTER_AUTH_URL`: URL de base de l'application
- `NODE_ENV`: Environment (development/production)

## URLs

- Application: http://localhost:3000
- PostgreSQL: localhost:5432
- Prisma Studio: http://localhost:5555 (après `pnpm db:studio`)

## Développement

Pour le développement, deux options:

### Option 1: Tout dans Docker
```bash
docker-compose up -d
```
L'app se recharge automatiquement grâce au volume monté.

### Option 2: Seulement la DB dans Docker
```bash
docker-compose up -d postgres
pnpm dev
```
Plus rapide pour le rechargement à chaud.

## Production

Pour la production, créer un `docker-compose.prod.yml` et:

1. Utiliser `NODE_ENV=production`
2. Utiliser `pnpm build && pnpm preview` au lieu de `pnpm dev`
3. Générer un vrai `BETTER_AUTH_SECRET` sécurisé
4. Configurer des volumes persistants pour PostgreSQL
5. Utiliser un reverse proxy (nginx, Traefik) devant l'app
