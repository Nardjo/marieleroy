# Prisma Database Setup

## Configuration

Le schéma Prisma est configuré avec un modèle `User` contenant:
- `id`: Identifiant unique (CUID)
- `email`: Email unique
- `firstName`: Prénom
- `lastName`: Nom de famille
- `createdAt`: Date de création
- `updatedAt`: Date de dernière modification

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
