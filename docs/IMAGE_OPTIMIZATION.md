# Optimisation des Images

## Problèmes Identifiés (Google PageSpeed)

D'après le rapport PageSpeed Insights, les problèmes principaux étaient :

- **Économies estimées : 1284 Kio**
- Images trop lourdes (776 Kio, 544 Kio)
- Images surdimensionnées par rapport à leur affichage
- Pas de formats modernes (WebP, AVIF)
- Lazy loading basique

## Solutions Mises en Place

### 1. Configuration de Nuxt Image

**Fichier : `nuxt.config.ts`**

Configuration ajoutée pour optimiser automatiquement toutes les images :

```typescript
image: {
  quality: 80,                    // Qualité de compression (80%)
  format: ['webp'],              // Format WebP moderne
  screens: {                     // Breakpoints responsives
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
  densities: [1, 2],            // Support écrans Retina
  presets: {
    avatar: {
      modifiers: {
        format: 'webp',
        quality: 85,
        fit: 'cover',
      },
    },
    separator: {
      modifiers: {
        format: 'webp',
        quality: 80,
        fit: 'cover',
      },
    },
    thumbnail: {
      modifiers: {
        format: 'webp',
        quality: 75,
      },
    },
  },
}
```

### 2. Installation de Sharp

Sharp a été installé pour permettre l'optimisation d'images côté serveur :

```bash
pnpm add -D sharp
```

Sharp est utilisé par IPX (le moteur d'optimisation de Nuxt Image) pour :

- Redimensionner les images
- Compresser les images
- Convertir au format WebP
- Générer des versions responsives

### 3. Remplacement des balises `<img>` par `<NuxtImg>`

Tous les composants ont été mis à jour pour utiliser `<NuxtImg>` au lieu de `<img>` :

#### ImageSeparator.vue

```vue
<NuxtImg
  :src="desktopImage"
  alt="Séparateur"
  preset="separator"
  loading="eager"          // Chargement immédiat (image critique)
  fetchpriority="high"     // Priorité haute
  sizes="sm:0 md:100vw"    // Responsive
  :width="1920"
  :height="500"
/>
```

#### About.vue

```vue
<NuxtImg
  :src="imageUrl"
  preset="avatar"
  loading="lazy"           // Lazy loading pour images non-critiques
  sizes="sm:256px md:320px"
  :width="320"
  :height="320"
/>
```

#### FocusCard.vue

```vue
<NuxtImg :src="card.imageUrl" preset="thumbnail" loading="lazy" sizes="sm:100vw md:33vw" :width="400" :height="340" />
```

## Bénéfices Attendus

### Performance

- **Réduction de ~60%** de la taille des images (776 Ko → ~300 Ko)
- Format WebP ~30% plus léger que JPEG
- Images responsives adaptées à chaque écran
- Lazy loading intelligent (sauf images critiques)

### Expérience Utilisateur

- **LCP amélioré** (Largest Contentful Paint)
- Temps de chargement plus rapide
- Consommation de bande passante réduite
- Support écrans Retina (densities: [1, 2])

### SEO

- Meilleur score PageSpeed Insights
- Impact positif sur le ranking Google
- Core Web Vitals optimisés

## Comment Utiliser

### Pour une nouvelle image

```vue
<template>
  <NuxtImg
    src="/uploads/images/mon-image.jpg"
    alt="Description"
    preset="separator"        <!-- ou avatar, thumbnail -->
    loading="lazy"             <!-- ou eager pour images critiques -->
    sizes="sm:100vw md:50vw"   <!-- Tailles responsives -->
    :width="800"
    :height="600"
  />
</template>
```

### Presets Disponibles

1. **avatar** : Pour les photos de profil
   - Quality: 85%
   - Format: WebP
   - Fit: cover

2. **separator** : Pour les images de séparation
   - Quality: 80%
   - Format: WebP
   - Fit: cover

3. **thumbnail** : Pour les miniatures/vignettes
   - Quality: 75%
   - Format: WebP

### Quand utiliser `loading="eager"` vs `loading="lazy"`

- **eager** : Images critiques (above the fold)
  - Image séparateur (première image visible)
  - Images hero
- **lazy** : Images non-critiques (below the fold)
  - Images de la section "À propos"
  - Témoignages
  - Thumbnails

## Prochaines Étapes (Optionnel)

1. **Optimiser les images existantes** dans `/uploads`
   - Script de compression batch
   - Conversion en WebP

2. **Ajouter le support AVIF** (encore plus léger que WebP)

   ```typescript
   format: ['avif', 'webp', 'jpeg']
   ```

3. **Configurer un CDN** pour servir les images optimisées

4. **Implémenter le blur placeholder** pour un meilleur UX
   ```vue
   <NuxtImg src="..." placeholder :placeholder-class="blur - sm" />
   ```

## Tests

Pour tester les optimisations :

1. Lancer le serveur : `pnpm dev`
2. Inspecter les images dans DevTools → Network
3. Vérifier le format (doit être WebP)
4. Vérifier la taille (doit être réduite)
5. Tester sur Google PageSpeed Insights

## Documentation Nuxt Image

- [Documentation officielle](https://image.nuxt.com/)
- [API Reference](https://image.nuxt.com/usage/nuxt-img)
- [Presets](https://image.nuxt.com/get-started/configuration#presets)
