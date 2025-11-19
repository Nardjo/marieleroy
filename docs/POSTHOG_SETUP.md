# Configuration PostHog pour Marie Leroy

## ✅ Installation terminée

La configuration PostHog a été implémentée avec succès dans votre projet. Voici ce qui a été fait :

### 📦 Dépendances installées

- `nuxt-posthog` (module officiel Nuxt)
- `posthog-js` (SDK JavaScript)

### 🔧 Fichiers créés/modifiés

#### 1. Composables créés

- **`app/composables/useAnalytics.ts`** - Fonctions de tracking (CTAs et pages)
- **`app/composables/usePosthogAnalytics.ts`** - Récupération des analytics pour le dashboard

#### 2. Configuration

- **`nuxt.config.ts`**
  - Module `nuxt-posthog` ajouté
  - Configuration PostHog avec clé publique
  - CSP (Content Security Policy) mis à jour pour autoriser PostHog
  - Runtime config pour les clés API

- **`.env.example`** - Variables d'environnement documentées

#### 3. Composants mis à jour

- **`app/components/CTAButton.vue`** - Support du tracking avec props `tracking-name` et `tracking-section`
- **`app/components/CTASection.vue`** - Propagation des props de tracking
- **`app/components/features/Hero.vue`** - Tracking des CTAs hero
- **`app/components/features/Faq.vue`** - Tracking CTA FAQ
- **`app/components/features/Method.vue`** - Tracking CTA méthode
- **`app/components/features/Testimonials.vue`** - Tracking CTA témoignages
- **`app/pages/index.vue`** - Tracking page view homepage

## 🚀 Configuration requise

### 1. Créer un projet PostHog

1. Allez sur [PostHog Cloud](https://app.posthog.com/signup) (région EU)
2. Créez un nouveau projet
3. Récupérez votre **Project API Key** (commence par `phc_...`)

### 2. Obtenir les clés API (optionnel pour dashboard)

Pour afficher les analytics dans le dashboard admin :

1. Dans PostHog, allez dans **Settings** → **Project** → **Project API Key**
2. Notez le **Project ID**
3. Allez dans **Settings** → **User** → **Personal API Keys**
4. Créez une nouvelle clé personnelle (commence par `phx_...`)

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# PostHog Analytics - Client-side tracking (OBLIGATOIRE)
NUXT_PUBLIC_POSTHOG_KEY=phc_votre_cle_publique_ici

# PostHog Host (Region EU pour RGPD)
POSTHOG_HOST=https://eu.i.posthog.com

# PostHog API - Server-side analytics (OPTIONNEL - pour dashboard)
POSTHOG_PROJECT_ID=votre_project_id
POSTHOG_PERSONAL_API_KEY=phx_votre_cle_personnelle_ici
```

### 4. Déploiement en production (Coolify)

Dans Coolify, ajoutez ces variables d'environnement :

```
NUXT_PUBLIC_POSTHOG_KEY=phc_...
POSTHOG_HOST=https://eu.i.posthog.com
POSTHOG_PROJECT_ID=...
POSTHOG_PERSONAL_API_KEY=phx_...
```

## 📊 Événements trackés

### 1. Pages vues

- **Event**: `page_view`
- **Properties**:
  - `page_name`: Nom de la page (ex: "homepage")
  - `page`: Chemin de l'URL
  - `timestamp`: Date/heure ISO

### 2. Clics sur les CTAs

- **Event**: `cta_clicked`
- **Properties**:
  - `cta_name`: Nom unique du CTA
  - `button_text`: Texte du bouton
  - `variant`: Style du bouton (primary, secondary, outline, ghost)
  - `type`: Type de lien (internal, external)
  - `section`: Section de la page où se trouve le CTA
  - `destination`: URL de destination (si applicable)
  - `page`: Chemin de la page actuelle
  - `timestamp`: Date/heure ISO

### CTAs configurés

| CTA                                | Nom de tracking          | Section        |
| ---------------------------------- | ------------------------ | -------------- |
| "On discute ?" (Hero)              | `contact_cta`            | `hero`         |
| "Témoignages" (Hero)               | `scroll_to_testimonials` | `hero`         |
| "Poser ma question" (FAQ)          | `ask_question_cta`       | `faq`          |
| "Démarrer mon projet" (Méthode)    | `start_project_cta`      | `method`       |
| "Démarrer un projet" (Témoignages) | `start_project_cta`      | `testimonials` |

## 🎯 Utilisation dans de nouveaux composants

### Tracker un clic sur CTA

```vue
<CTAButton text="Mon CTA" :to="lien" tracking-name="mon_cta_unique" tracking-section="ma_section" />
```

### Tracker une page vue

```vue
<script setup lang="ts">
  const { trackPageView } = useAnalytics()

  onMounted(() => {
    trackPageView('nom_de_la_page', {
      source: 'direct',
      custom_property: 'valeur',
    })
  })
</script>
```

### Tracker un événement personnalisé

```vue
<script setup lang="ts">
  const { trackCTAClick } = useAnalytics()

  const handleCustomAction = () => {
    trackCTAClick('custom_event', {
      custom_property: 'valeur',
      autre_info: 123,
    })
  }
</script>
```

## 📈 Visualiser les données

### Dans PostHog

1. Connectez-vous à [PostHog EU](https://eu.posthog.com)
2. Sélectionnez votre projet "Marie Leroy"
3. Allez dans **Insights** pour créer des graphiques
4. Ou **Dashboards** pour créer un tableau de bord personnalisé

### Analyses recommandées

**1. Funnel de conversion**

- Page view → Scroll to testimonials → Contact CTA

**2. Popularité des CTAs**

- Événement : `cta_clicked`
- Groupe par : `cta_name`
- Graphique : Bar chart

**3. Utilisateurs uniques par jour**

- Événement : `page_view`
- Métrique : Unique users
- Intervalle : Daily

**4. Taux de conversion**

- % d'utilisateurs qui cliquent sur un CTA après avoir vu la page

## 🔒 Conformité RGPD

✅ **Hébergement EU** : Les données sont stockées en Europe (région EU de PostHog)

✅ **IP Anonymization** : PostHog anonymise automatiquement les IPs

Pour être totalement conforme :

1. Ajoutez une mention dans votre politique de confidentialité
2. Optionnel : Ajoutez un bandeau de consentement cookies avec [nuxt-cookie-control](https://www.npmjs.com/package/@dargmuesli/nuxt-cookie-control)

## 🧪 Tester en local

1. Assurez-vous d'avoir configuré `NUXT_PUBLIC_POSTHOG_KEY` dans `.env`
2. Lancez le serveur : `pnpm dev`
3. Ouvrez la console du navigateur (F12)
4. Naviguez sur le site et cliquez sur les CTAs
5. Vérifiez dans PostHog (Events → Live) que les événements arrivent

## 🆘 Support

- Documentation PostHog : https://posthog.com/docs
- Module Nuxt PostHog : https://github.com/gaetansenn/nuxt-posthog
- En cas de problème, vérifiez la console du navigateur pour les erreurs

## 📝 Notes importantes

- Le tracking est **désactivé automatiquement** si `NUXT_PUBLIC_POSTHOG_KEY` n'est pas défini
- Les événements sont envoyés uniquement côté client (pas de tracking SSR)
- PostHog identifie automatiquement les utilisateurs uniques via cookies/localStorage
- Les données sont disponibles en temps réel dans le dashboard PostHog
