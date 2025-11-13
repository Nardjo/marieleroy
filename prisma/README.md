# Prisma Database Setup

## Configuration

Le schéma Prisma est configuré avec Better Auth et contient les modèles suivants:

### User
- `id`: Identifiant unique (CUID)
- `email`: Email unique
- `emailVerified`: Email vérifié (boolean)
- `name`: Nom complet
- `firstName`: Prénom (optionnel)
- `lastName`: Nom de famille (optionnel)
- `image`: URL de l'avatar (optionnel)
- `createdAt`: Date de création
- `updatedAt`: Date de dernière modification
- Relations: `sessions[]`, `accounts[]`

### Session
- Gère les sessions utilisateur
- Lié à un utilisateur via `userId`

### Account
- Gère les comptes et providers d'authentification
- Support du mot de passe hashé
- Lié à un utilisateur via `userId`

### Verification
- Gère les tokens de vérification (email, reset password, etc.)

## Scripts disponibles

```bash
# Générer le client Prisma
pnpm db:generate

# Créer et appliquer une migration
pnpm db:migrate

# Pousser le schéma vers la DB (sans migration)
pnpm db:push

# Ouvrir Prisma Studio (interface graphique)
pnpm db:studio
```

## Utilisation dans Nuxt

Le client Prisma est disponible via `~/server/utils/prisma`:

```typescript
// Dans une API route
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()
  return users
})
```

## API Routes disponibles

- `GET /api/users` - Liste tous les utilisateurs
- `POST /api/users` - Créer un nouvel utilisateur

### Exemple POST request:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Better Auth

L'application utilise Better Auth pour l'authentification avec email et mot de passe.

### Configuration

Les variables d'environnement requises sont:
- `BETTER_AUTH_SECRET`: Clé secrète (minimum 32 caractères)
- `BETTER_AUTH_URL`: URL de base de l'application (ex: http://localhost:3000)
- `DATABASE_URL`: URL de connexion PostgreSQL

### Routes d'authentification

Better Auth expose automatiquement les routes suivantes:
- `POST /api/auth/sign-up/email` - Inscription avec email/password
- `POST /api/auth/sign-in/email` - Connexion avec email/password
- `POST /api/auth/sign-out` - Déconnexion
- `GET /api/auth/session` - Récupérer la session courante

### Utilisation côté client

```typescript
import { signIn, signUp, signOut, useSession } from '~/utils/auth-client'

// Inscription
await signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
})

// Connexion
await signIn.email({
  email: 'user@example.com',
  password: 'password123'
})

// Déconnexion
await signOut()

// Récupérer la session
const session = useSession()
```

### Page de test

Une page de test est disponible à `/auth/test` pour tester l'authentification.
