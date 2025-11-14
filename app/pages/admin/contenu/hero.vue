<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchHero, updateHero } = useHero()
  const { uploadVideo } = useVideoUpload()
  const toast = useToast()

  const form = reactive({
    subtitle: '',
    description: '',
    videoUrl: '',
  })

  const fileInput = ref<HTMLInputElement>()
  const uploading = ref(false)

  const loadHero = async () => {
    try {
      const data = await fetchHero()
      Object.assign(form, data)
      // Convert null to empty string for the input
      if (form.videoUrl === null) {
        form.videoUrl = ''
      }
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger le Hero',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveContent = async () => {
    try {
      const payload = {
        subtitle: form.subtitle,
        description: form.description,
        videoUrl: form.videoUrl && form.videoUrl.trim() !== '' ? form.videoUrl : null,
      }
      await updateHero(payload)
      toast.add({
        title: 'Hero enregistré',
        description: 'La section Hero a été mise à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder le Hero',
        color: 'error',
        duration: 5000,
      })
    }
  }

  const handleVideoUpload = async () => {
    const file = fileInput.value?.files?.[0]
    if (!file) return

    // Vérifier la taille (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.add({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 50MB',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
      return
    }

    uploading.value = true
    try {
      const result = (await uploadVideo(file)) as { url: string }
      form.videoUrl = result.url

      toast.add({
        title: 'Vidéo téléchargée',
        description: 'La vidéo a été uploadée avec succès',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error.message || "Impossible de télécharger la vidéo",
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    } finally {
      uploading.value = false
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const removeVideo = () => {
    form.videoUrl = ''
  }

  onMounted(() => {
    loadHero()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Hero" description="Gérer le contenu de la section Hero (page d'accueil)">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="3" />

    <div v-else class="max-w-4xl">
      <UCard>
        <div class="space-y-4">
          <UFormField label="Vidéo Hero" required>
            <div class="space-y-3">
              <input ref="fileInput" type="file" accept="video/*" class="hidden" @change="handleVideoUpload" />

              <div v-if="form.videoUrl" class="space-y-2">
                <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video :src="form.videoUrl" controls class="w-full h-full object-cover">
                    Votre navigateur ne supporte pas la vidéo.
                  </video>
                </div>
                <div class="flex gap-2">
                  <UButton color="neutral" size="sm" block :loading="uploading" @click="triggerFileInput">
                    Changer la vidéo
                  </UButton>
                  <UButton color="error" variant="ghost" size="sm" @click="removeVideo">
                    Supprimer
                  </UButton>
                </div>
              </div>

              <UButton v-else color="neutral" block :loading="uploading" @click="triggerFileInput">
                <UIcon name="i-lucide-upload" class="mr-2" />
                Télécharger une vidéo
              </UButton>
            </div>
            <template #help>
              <p class="text-sm text-gray-500 mt-1">
                Formats acceptés: MP4, WebM, OGG, MOV. Taille maximale: 50MB
              </p>
            </template>
          </UFormField>

          <UFormField label="Sous-titre" required>
            <UInput v-model="form.subtitle" size="lg" placeholder="Ex: Copywriter Professionnelle" />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea v-model="form.description" :rows="4" placeholder="Phrase d'accroche..." />
          </UFormField>
        </div>
      </UCard>
    </div>
  </div>
</template>
