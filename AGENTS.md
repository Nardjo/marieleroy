# Agent Guidelines for Marie Leroy Repository

## Build/Lint/Test Commands

**IMPORTANT: Always use `pnpm` instead of `npm` for this project**

```bash
pnpm dev           # Start dev server on http://localhost:3000
pnpm build         # Build for production
pnpm preview       # Preview production build
pnpm nuxt typecheck # Type checking (no script defined)
pnpm exec prettier --write . # Format code
pnpm exec eslint . --fix     # Fix linting issues
```

No test suite currently configured. Prettier/ESLint configured but no lint script in package.json.

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
