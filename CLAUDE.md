# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marie Leroy's professional website built with Nuxt 4, featuring a public showcase site (vitrine) and an admin panel for content management. The project uses a dual-theme architecture with separate designs for public and admin interfaces.

## Development Commands

```bash
# Install dependencies (use --legacy-peer-deps if npm has conflicts)
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start PostgreSQL database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker logs marieleroy_postgres
```

## Tech Stack Architecture

### Core Framework
- **Nuxt 4** with Vue 3 Composition API
- **Tailwind CSS v4** with @theme inline directive for theming
- **Nuxt UI v4** for component library
- **TypeScript** for type safety

### Key Modules
- `@nuxt/fonts` - Google Fonts integration (Open Sans, Dancing Script)
- `@nuxt/image` - Optimized image handling
- `@nuxtjs/device` - Device detection utilities

### Database
- PostgreSQL 17 via Docker
- Database schema in `docker/init-scripts/01-init.sql`
- Tables: users, sessions, about_section, method_steps, testimonials, faq_items, social_links, seo_settings, site_settings

## Dual-Theme Architecture

**CRITICAL**: This project uses TWO completely separate themes with different CSS files.

### Vitrine (Public Site) Theme
- **Layout**: `app/layouts/default.vue`
- **CSS**: `app/assets/css/vitrine.css`
- **Theme attribute**: `data-theme="vitrine"`
- **Colors**: Warm beige/terracotta palette (#c79e7d primary)
- **Font**: Open Sans for body, Dancing Script for branding
- **Routes**: `/` (homepage with Hero, Method, Testimonials, FAQ sections)

### Admin Theme
- **Layouts**: `app/layouts/admin.vue` (dashboard), `app/layouts/login.vue` (auth)
- **CSS**: `app/assets/css/admin.css`
- **Theme attribute**: `data-theme="admin"`
- **Colors**: Professional blue palette (#0ea5e9 primary)
- **Features**: Dark mode support, collapsible sidebar
- **Routes**: `/admin/*` (dashboard, content management, settings)

### CSS Import Order (CRITICAL)

To prevent Nuxt UI from overriding custom theme variables, CSS files MUST follow this exact order:

```css
@import 'tailwindcss';

@theme inline {
  /* Map CSS variables for Tailwind v4 */
  --color-primary: var(--primary);
  --color-primary-50: var(--primary-50);
  /* ... ALL color shades 50-950 must be mapped ... */
}

[data-theme='vitrine'] {
  /* Define actual color values */
  --primary: #c79e7d;
  --primary-50: #fdfcfb;
  /* ... */
}

@layer base { /* base styles */ }
@layer utilities { /* custom utilities */ }

@import '@nuxt/ui';  /* ← MUST be at the end! */
```

**Why**: `@nuxt/ui` has default theme values that will override custom variables if imported too early.

## Tailwind CSS v4 Color Configuration

Tailwind v4 with `@theme inline` requires ALL color shades to be explicitly mapped:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  /* ... map EVERY shade 50-950 for primary, secondary, etc. */
}
```

When using `bg-primary-100`, Tailwind looks for `--color-primary-100` in `@theme inline`, NOT just `--color-primary`.

## Font Configuration

Fonts are managed by `@nuxt/fonts` module configured in `nuxt.config.ts`. This auto-generates Tailwind classes:

- `'Open Sans'` → generates `font-open-sans` class
- `'Dancing Script'` → generates `font-dancing-script` class

**Usage**:
```vue
<h1 class="font-dancing-script">Calligraphy text</h1>
<p class="font-open-sans">Body text</p>
```

## Admin Panel Structure

The admin panel is structured but NOT yet connected to backend APIs:

### Content Management Pages
- `/admin/contenu/a-propos` - About section editor
- `/admin/contenu/ma-methode` - Method steps management (add/remove/reorder)
- `/admin/contenu/temoignages` - Video testimonials (YouTube embeds)
- `/admin/contenu/faq` - FAQ items management

### Settings Pages
- `/admin/parametres` - General site settings
- `/admin/parametres/reseaux-sociaux` - Social media links
- `/admin/parametres/seo` - SEO meta tags and analytics

### TODO: Backend Integration
- Authentication with better-auth (planned, not implemented)
- API routes in `/server/api/*` (need to be created)
- Form submissions currently mock data
- Middleware protection for admin routes (not yet implemented)

## Layout System

**3 Layouts**:
1. `default.vue` - Public site with fixed header (auto-hide on scroll down)
2. `login.vue` - Minimal auth layout
3. `admin.vue` - Dashboard with sidebar (desktop) / drawer (mobile)

Layouts automatically set:
- `data-theme` attribute on `<html>`
- Import their respective CSS theme file
- Force light mode for vitrine, allow dark mode toggle for admin

## Component Patterns

### Nuxt UI Component Overrides
Configure in `app/app.config.ts` to ensure components use theme CSS variables:

```typescript
export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: '!bg-card',  // Force cards to use --card variable
      },
    },
  },
})
```

### Color Mode Management
```typescript
const colorMode = useColorMode()

// In vitrine layouts
onMounted(() => {
  colorMode.preference = 'light'
  document.documentElement.classList.remove('dark')
})

// In admin layout
colorMode.preference = 'system' // Allows dark mode toggle
```

## Database Schema Highlights

Key tables defined in `docker/init-scripts/01-init.sql`:

- `users` - Authentication (better-auth integration planned)
- `about_section` - Hero/about content with image, skills array
- `method_steps` - Ordered steps (step_order field for sorting)
- `testimonials` - Video testimonials (video_url, title, quote)
- `faq_items` - FAQ with order field
- `social_links` - Social media (platform, url, icon)
- `seo_settings` - Meta tags, OG tags, analytics IDs
- `site_settings` - Key-value pairs (site_name, etc.)

## Common Pitfalls

1. **Theme not applying**: Check CSS import order - `@import '@nuxt/ui'` must be LAST
2. **Color shade classes not working**: Ensure ALL shades (50-950) are mapped in `@theme inline`
3. **Font not loading**: Use auto-generated classes like `font-dancing-script`, not custom ones
4. **Admin routes accessible without auth**: Middleware not yet implemented
5. **Form submissions failing**: API routes need to be created in `/server/api/`

## File Organization

```
app/
├── assets/css/
│   ├── tailwind.css (base Tailwind import only)
│   ├── vitrine.css (public theme - beige/terracotta)
│   └── admin.css (admin theme - blue, with dark mode)
├── components/
│   ├── features/ (Hero, Method, Testimonials, FAQ)
│   ├── CTAButton.vue, CTASection.vue
│   └── Logo.vue (Dancing Script font)
├── layouts/
│   ├── default.vue (vitrine layout)
│   ├── admin.vue (dashboard layout)
│   └── login.vue (auth layout)
├── pages/
│   ├── index.vue (homepage)
│   └── admin/ (admin panel pages)
└── composables/
    ├── useNavigation.ts
    └── useSmoothScroll.ts

docker/
└── init-scripts/
    └── 01-init.sql (PostgreSQL schema)
```

## Environment Variables

Required for production:
- `POSTGRES_PASSWORD` - Database password
- Better-auth variables (when implemented):
  - `AUTH_SECRET`
  - `DATABASE_URL`
