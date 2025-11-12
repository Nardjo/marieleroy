# Admin Setup Guide

## Structure

### Layouts

- **login.vue**: Layout pour la page de connexion
- **admin.vue**: Layout principal de l'administration avec sidebar et navigation

### Pages

#### Authentication

- **/connexion**: Page de connexion

#### Dashboard

- **/admin**: Tableau de bord principal avec statistiques et actions rapides

#### Content Management

- **/admin/contenu/a-propos**: Gestion de la section "À propos"
- **/admin/contenu/ma-methode**: Gestion des étapes de la méthode de travail
- **/admin/contenu/temoignages**: Gestion des témoignages vidéo
- **/admin/contenu/faq**: Gestion des questions fréquentes

#### Settings

- **/admin/parametres**: Paramètres généraux du site
- **/admin/parametres/reseaux-sociaux**: Configuration des liens sociaux
- **/admin/parametres/seo**: Configuration SEO et analytics

#### Profile

- **/admin/profile**: Gestion du profil utilisateur

## Database

### Docker Setup

1. Start PostgreSQL:

```bash
docker-compose up -d
```

2. Check logs:

```bash
docker-compose logs -f postgres
```

3. Connect to database:

```bash
docker exec -it marieleroy_postgres psql -U admin -d marieleroy
```

### Tables

#### Users & Auth

- `users`: User accounts
- `sessions`: Active sessions

#### Content

- `about_section`: About section content
- `method_header`: Method section header
- `method_steps`: Method process steps
- `testimonials`: Video testimonials
- `faq_items`: FAQ questions and answers

#### Settings

- `site_settings`: General site settings
- `social_links`: Social media links
- `seo_settings`: SEO configuration

## Next Steps

### 1. Install Better Auth

```bash
npm install better-auth
```

### 2. Configure Better Auth

Create `/server/lib/auth.ts`:

```typescript
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  database: {
    provider: 'postgres',
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
})
```

### 3. Create API Endpoints

Create server routes in `/server/api/` for:

- Authentication (login, logout, session)
- Content management (CRUD operations)
- Settings management

### 4. Create Composables

Create `/composables/useAuth.ts` for authentication helpers

### 5. Add Middleware

Create `/middleware/auth.ts` to protect admin routes

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Then update the values:

- `POSTGRES_PASSWORD`: Strong password for PostgreSQL
- `DATABASE_URL`: Connection string
- `BETTER_AUTH_SECRET`: Random 32+ character string

## Development Workflow

1. Start Docker:

```bash
docker-compose up -d
```

2. Start Nuxt dev server:

```bash
npm run dev
```

3. Access admin:

- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin

## Security Notes

⚠️ **Important**:

- Change the default admin password in the database
- Use strong passwords in production
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting on login endpoint
- Add CSRF protection
- Enable database backups

## TODO

- [ ] Implement better-auth integration
- [ ] Create API endpoints
- [ ] Add image upload functionality
- [ ] Implement form validation
- [ ] Add loading states
- [ ] Create error handling
- [ ] Add success notifications
- [ ] Implement middleware protection
- [ ] Add unit tests
- [ ] Create deployment documentation
