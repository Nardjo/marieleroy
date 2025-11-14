<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchHero, updateHero } = useHero()
  const toast = useToast()

  const form = reactive({
    subtitle: '',
    description: '',
    videoUrl: '',
  })

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
        videoUrl: form.videoUrl && typeof form.videoUrl === 'string' && form.videoUrl.trim() !== '' ? form.videoUrl : null,
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
          <!-- Video Upload Field -->
          <AdminVideoUploadField
            v-model="form.videoUrl"
            label="Vidéo Hero"
            name="videoUrl"
            required
            hint="Formats acceptés: MP4, WebM, OGG, MOV. Taille maximale: 50MB" />

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
