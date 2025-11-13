# Déploiement Coolify - Marie Leroy

## Configuration rapide

### 1. Créer le service dans Coolify

1. **New Resource** → **Docker Image**
2. Connecter le dépôt Git (main branch)

### 2. Ajouter PostgreSQL

**+ Add Database** → PostgreSQL 17

Coolify génère automatiquement `DATABASE_URL`

### 3. Variables d'environnement ⚠️ IMPORTANT

**DÉCOCHER "Available at Buildtime" pour NODE_ENV!**

```bash
# RUNTIME ONLY (décocher Buildtime!)
NODE_ENV=production

# Auth (générer: openssl rand -base64 32)
NUXT_SESSION_PASSWORD=votre-secret-32-chars-min

# Site
SITE_URL=https://votre-domaine.com
UPLOAD_DIR=/app/uploads
```

### 4. Volume persistant

**Storages** → Ajouter:
- Source: `/app/uploads`
- Destination: `/data/marieleroy/uploads`

### 5. Domaine

**Domains** → Ajouter domaine + activer SSL

### 6. Déployer

Cliquer **Deploy** (2-5 min)

## Post-déploiement

### Créer l'admin

Dans Coolify → **Execute Command**:

```bash
pnpm user:create
```

## Troubleshooting

### Build timeout / échec

**Cause**: `NODE_ENV=production` en buildtime

**Solution**:
1. Environment Variables → `NODE_ENV`
2. **DÉCOCHER** "Available at Buildtime"
3. Redéployer

### App ne démarre pas

Vérifier logs Coolify:
- `DATABASE_URL` existe?
- `NUXT_SESSION_PASSWORD` défini (32+ chars)?
- Prisma migrations OK?

### Uploads ne marchent pas

Vérifier volume `/app/uploads` monté

## Checklist

- [ ] PostgreSQL ajouté
- [ ] `DATABASE_URL` auto-générée
- [ ] `NODE_ENV=production` (RUNTIME uniquement!)
- [ ] `NUXT_SESSION_PASSWORD` configurée
- [ ] `SITE_URL` configurée
- [ ] Volume `/app/uploads` monté
- [ ] Domaine + SSL
- [ ] Deploy réussi
- [ ] Admin créé
- [ ] Health check OK (`/api/health`)
