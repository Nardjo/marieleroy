# Agent Guidelines for Marie Leroy Repository

## Git Workflow

**IMPORTANT: Never commit or push automatically without explicit user request**

- ❌ DO NOT run `git commit` unless explicitly asked
- ❌ DO NOT run `git push` unless explicitly asked
- ✅ Make code changes and wait for user to request commit
- ✅ Always ask before creating commits or pushing changes

## Build/Lint/Test Commands

**IMPORTANT: Always use `pnpm` instead of `npm` for this project**

```bash
# Development
pnpm dev                        # Start dev server on http://localhost:3000
pnpm build                      # Build for production (runs migrations + prisma generate)
pnpm preview                    # Preview production build

# Database
pnpm db:migrate                 # Run Prisma migrations (dev)
pnpm db:push                    # Push schema to DB without migration
pnpm db:generate                # Generate Prisma client
pnpm db:studio                  # Open Prisma Studio GUI
pnpm db:seed                    # Seed database with initial data
pnpm user:create                # Create admin user (interactive script)

# Code Quality
pnpm exec prettier --write .    # Format all files
pnpm exec eslint . --fix        # Fix linting issues
pnpm nuxt typecheck             # Run TypeScript type checking

# Testing
# No test suite currently configured (@nuxt/test-utils is installed but not configured)
```

## Code Style Guidelines

### Formatting (Prettier)

- No semicolons, single quotes, 2 spaces, 120 line width
- Arrow parens: avoid (`x => x` not `(x) => x`)
- Vue: indent script/style, bracket same line

### TypeScript

- Use `<script setup lang="ts">` for all Vue components
- Prefer interfaces over types for object shapes
- Avoid `any` - use proper typing or `unknown` with guards
- Use Nuxt auto-imports (no need to import `ref`, `computed`, `defineNuxtConfig`, etc.)

### Naming Conventions

- Files: kebab-case (`hero-section.vue`, `use-auth.ts`)
- Components: PascalCase in file names and usage (`Hero.vue`)
- Functions/Variables: camelCase (`fetchUser`, `isLoading`)
- Composables: prefix with `use` (`useAuth`, `useSmoothScroll`)

### Imports

- Leverage Nuxt auto-imports - don't import Vue APIs, components, or composables
- Group: external libraries → internal modules → relative imports
- Use type imports: `import type { User } from '@/types'`

### Vue/Nuxt Patterns

- Use Composition API with `<script setup lang="ts">`
- Use `$fetch` for API calls in composables
- Composables return objects with reactive refs and methods
- Use `navigateTo()` for programmatic navigation
- Use `useColorMode()` for theme management

### Error Handling

- Try-catch for async operations with specific error messages
- Extract error messages from response or fallback to generic
- Always handle navigation errors gracefully

### CSS/Theming (CRITICAL)

- **Never modify CSS import order** - `@import '@nuxt/ui'` MUST be last
- Use CSS variables from theme files (`--primary`, `--card`, etc.)
- All Tailwind color shades (50-950) must be mapped in `@theme inline`
- Use auto-generated font classes: `font-open-sans`, `font-dancing-script`
- Respect dual-theme architecture: `[data-theme='vitrine']` vs `[data-theme='admin']`

### Security

- Never commit secrets or API keys
- Validate user inputs in API routes
- Use server routes (`/server/api/*`) for secure operations

### Project-Specific

- This is a **dual-theme** project - vitrine (public) and admin have separate CSS files
- Admin panel pages are UI-only - backend APIs NOT implemented yet
- Database schema in `docker/init-scripts/01-init.sql` - Prisma NOT used for queries yet
- Authentication planned but not implemented - no middleware protection yet
- Prisma is configured with PostgreSQL - use Prisma Client for all database queries
- Uses Zod for schema validation in API routes (`z.object()` pattern)
- Authentication via `nuxt-auth-utils` with `useUserSession()` and `setUserSession()`
