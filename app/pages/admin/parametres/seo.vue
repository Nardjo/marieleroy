<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const form = reactive({
  metaTitle: 'Marie Leroy - Copywriter Professionnelle',
  metaDescription: 'Copywriter professionnelle spécialisée en storytelling et marketing de contenu. Des mots qui convertissent, des messages qui résonnent.',
  metaKeywords: 'copywriter, rédaction web, storytelling, marketing de contenu, copywriting, freelance',
  ogImage: '',
  twitterCard: 'summary_large_image',
  robotsTxt: 'index, follow',
  googleAnalyticsId: '',
  googleTagManagerId: '',
})

const saveSettings = async () => {
  loading.value = true
  try {
    // TODO: API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          SEO
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Optimiser le référencement de votre site
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-save"
        :loading="loading"
        @click="saveSettings">
        Enregistrer
      </UButton>
    </div>

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="Les paramètres SEO ont été mis à jour avec succès" />

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Meta Tags -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Balises Meta</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Titre Meta" required>
              <UInput
                v-model="form.metaTitle"
                size="lg"
                placeholder="Titre de votre site (60 caractères max)"
                :maxlength="60" />
              <template #hint>
                <span class="text-xs">{{ form.metaTitle.length }}/60 caractères</span>
              </template>
            </UFormField>

            <UFormField label="Description Meta" required>
              <UTextarea
                v-model="form.metaDescription"
                :rows="3"
                placeholder="Description de votre site (160 caractères max)"
                :maxlength="160" />
              <template #hint>
                <span class="text-xs">{{ form.metaDescription.length }}/160 caractères</span>
              </template>
            </UFormField>

            <UFormField label="Mots-clés">
              <UInput
                v-model="form.metaKeywords"
                size="lg"
                placeholder="mot1, mot2, mot3..." />
              <template #hint>
                <span class="text-xs text-gray-500">Séparez les mots-clés par des virgules</span>
              </template>
            </UFormField>
          </div>
        </UCard>

        <!-- Open Graph -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Open Graph & Réseaux sociaux</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Image OG (URL)">
              <UInput
                v-model="form.ogImage"
                size="lg"
                placeholder="https://example.com/image.jpg"
                icon="i-lucide-image" />
              <template #hint>
                <span class="text-xs text-gray-500">
                  Image affichée lors du partage sur les réseaux sociaux (1200x630px recommandé)
                </span>
              </template>
            </UFormField>

            <UFormField label="Type de carte Twitter">
              <USelect
                v-model="form.twitterCard"
                size="lg"
                :options="[
                  { label: 'Summary (petite image)', value: 'summary' },
                  { label: 'Summary Large Image (grande image)', value: 'summary_large_image' },
                ]" />
            </UFormField>
          </div>
        </UCard>

        <!-- Indexation -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Indexation</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Directives Robots">
              <USelect
                v-model="form.robotsTxt"
                size="lg"
                :options="[
                  { label: 'Index, Follow (recommandé)', value: 'index, follow' },
                  { label: 'No Index, No Follow', value: 'noindex, nofollow' },
                  { label: 'Index, No Follow', value: 'index, nofollow' },
                  { label: 'No Index, Follow', value: 'noindex, follow' },
                ]" />
            </UFormField>
          </div>
        </UCard>

        <!-- Analytics -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Analytics & Tracking</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Google Analytics ID">
              <UInput
                v-model="form.googleAnalyticsId"
                size="lg"
                placeholder="G-XXXXXXXXXX"
                icon="i-lucide-bar-chart" />
            </UFormField>

            <UFormField label="Google Tag Manager ID">
              <UInput
                v-model="form.googleTagManagerId"
                size="lg"
                placeholder="GTM-XXXXXXX"
                icon="i-lucide-tag" />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Preview -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Aperçu Google</h3>
          </template>
          <div class="space-y-3">
            <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p class="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">
                {{ form.metaTitle || 'Titre du site' }}
              </p>
              <p class="text-green-700 dark:text-green-500 text-xs mt-1">
                www.marieleroy.fr
              </p>
              <p class="text-gray-600 dark:text-gray-400 text-xs mt-2 line-clamp-2">
                {{ form.metaDescription || 'Description du site' }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Tips -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Conseils SEO</h3>
          </template>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex gap-2">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Titre: 50-60 caractères optimal</p>
            </div>
            <div class="flex gap-2">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Description: 150-160 caractères optimal</p>
            </div>
            <div class="flex gap-2">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Utilisez des mots-clés pertinents</p>
            </div>
            <div class="flex gap-2">
              <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Image OG: 1200x630px recommandé</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
