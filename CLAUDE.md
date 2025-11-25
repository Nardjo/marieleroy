# CLAUDE.md

## Vue.js / Nuxt Tips

### Shorthand pour les props (Vue 3.4+)
Quand le nom de la prop correspond au nom de la variable, on peut utiliser le shorthand :
```vue
<!-- Au lieu de -->
<AvatarGroup :avatars="avatars" :clients-text="clientsText" />

<!-- On peut écrire -->
<AvatarGroup :avatars :clients-text :additional-clients-count />
```
