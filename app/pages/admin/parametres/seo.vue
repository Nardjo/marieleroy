<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const loading = ref(false)
  const saved = ref(false)

  const form = reactive({
    metaTitle: 'Marie Leroy - Copywriter Professionnelle',
    metaDescription:
      'Copywriter professionnelle spécialisée en storytelling et marketing de contenu. Des mots qui convertissent, des messages qui résonnent.',
    ogImage: [] as File[],
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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">SEO</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Optimiser le référencement de votre site</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveSettings">
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
          </div>
        </UCard>

        <!-- Open Graph -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Image de partage</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Image de partage">
              <UFileUpload v-model="form.ogImage" accept="image/*" />
              <template #hint>
                <span class="text-xs text-gray-500">
                  Image affichée lors du partage sur les réseaux sociaux (1200x630px recommandé)
                </span>
              </template>
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
              <p class="text-green-700 dark:text-green-500 text-xs mt-1">www.marieleroy.fr</p>
              <p class="text-gray-600 dark:text-gray-400 text-xs mt-2 line-clamp-2">
                {{ form.metaDescription || 'Description du site' }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Social Preview -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Aperçu du partage</h3>
          </template>
          <div class="space-y-3">
            <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div
                    v-if="form.ogImage && form.ogImage.length > 0"
                    class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      :src="URL.createObjectURL(form.ogImage[0])"
                      alt="Image de partage"
                      class="w-full h-full object-cover"
                      @error="form.ogImage = []" />
                  </div>
                  <div
                    v-else
                    class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-image" class="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ form.metaTitle || 'Titre du site' }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ form.metaDescription || 'Description du site' }}
                  </p>
                  <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">www.marieleroy.fr</p>
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-500 text-center">Aperçu du partage sur les réseaux sociaux</p>
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
