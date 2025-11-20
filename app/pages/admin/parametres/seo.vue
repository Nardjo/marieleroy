<script setup lang="ts">
  useHead({
    title: 'SEO',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSeoSettings, updateSeoSettings } = useSeo()
  const { uploadImage } = useImageUpload()
  const toast = useToast()

  const form = reactive({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
  })

  const selectedFiles = ref<File[]>([])
  const uploading = ref(false)

  // Charger les paramètres SEO au montage
  const loadSeoSettings = async () => {
    try {
      const settings = await fetchSeoSettings()
      if (settings) {
        form.metaTitle = settings.metaTitle || ''
        form.metaDescription = settings.metaDescription || ''
        form.ogImage = settings.ogImage || ''
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err)
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les paramètres SEO',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadSeoSettings()
  })

  // Watcher pour uploader l'image dès qu'elle est sélectionnée
  watch(selectedFiles, async newFiles => {
    if (newFiles && newFiles.length > 0) {
      uploading.value = true
      try {
        const result = (await uploadImage(newFiles[0])) as { url: string }
        form.ogImage = result.url
        selectedFiles.value = [] // Clear selection

        toast.add({
          title: 'Image téléchargée',
          description: "L'image a été uploadée avec succès",
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
      } catch (error: any) {
        toast.add({
          title: 'Erreur',
          description: error.message || "Impossible de télécharger l'image",
          color: 'error',
          icon: 'i-lucide-alert-circle',
          duration: 5000,
        })
      } finally {
        uploading.value = false
      }
    }
  })

  const saveSettings = async () => {
    try {
      await updateSeoSettings(form)
      toast.add({
        title: 'Paramètres SEO enregistrés',
        description: 'Les paramètres SEO ont été mis à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.add({
        title: 'Erreur de sauvegarde',
        description: error?.data?.message || 'Impossible de sauvegarder les paramètres SEO',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    }
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">SEO</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Optimiser le référencement de votre site</p>
    </div>

    <!-- Desktop Save Button -->
    <div class="hidden md:flex gap-3 mb-6 justify-end">
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveSettings">
        Enregistrer
      </UButton>
    </div>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="3" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-28 md:pb-0">
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
            <UFormField label="Sélectionner une image">
              <div class="flex gap-4 items-center">
                <div class="flex-shrink-0">
                  <div v-if="form.ogImage" class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img :src="form.ogImage" alt="Image OG" class="w-full h-full object-cover" width="80" height="80" />
                  </div>
                  <div v-else class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <UIcon name="i-lucide-image" class="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div class="flex-1">
                  <UFileUpload v-model="selectedFiles" accept="image/*" :loading="uploading" />
                </div>
              </div>
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
                  <div v-if="form.ogImage" class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      :src="form.ogImage"
                      alt="Image de partage"
                      class="w-full h-full object-cover"
                      width="64"
                      height="64" />
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

    <!-- Mobile Sticky Save Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-default p-4 md:hidden z-40">
      <div class="flex gap-3 justify-end">
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveSettings">
          Enregistrer
        </UButton>
      </div>
    </div>
  </div>
</template>
