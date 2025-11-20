<script setup lang="ts">
  useHead({
    title: 'À propos',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchAbout, updateAbout } = useAbout()
  const { refreshAbout } = useRefreshPublicData()
  const toast = useToast()

  const form = reactive({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  })

  const loadAbout = async () => {
    try {
      const data = await fetchAbout()
      Object.assign(form, data)
      // Convert null to empty string for the input
      if (form.imageUrl === null) {
        form.imageUrl = ''
      }
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger la section',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveContent = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        subtitle: form.subtitle && form.subtitle.trim() !== '' ? form.subtitle : null,
        imageUrl:
          form.imageUrl && typeof form.imageUrl === 'string' && form.imageUrl.trim() !== '' ? form.imageUrl : null,
      }
      await updateAbout(payload)
      // Invalidate public about cache to show updated data
      await refreshAbout()
      toast.add({
        title: 'Section enregistrée',
        description: 'La section "À propos" a été mise à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder la section',
        color: 'error',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadAbout()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="À propos" description="Gérer le contenu de la section À propos">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="4" />

    <div v-else>
      <UCard>
        <div class="space-y-4">
          <AdminImageUploadField
            v-model="form.imageUrl"
            label="Image de profil"
            name="imageUrl"
            hint="Format recommandé: 800x800px (image carrée)" />

          <UFormField label="Titre" required>
            <UInput v-model="form.title" size="lg" placeholder="Titre de la section" />
          </UFormField>

          <UFormField label="Sous-titre">
            <UInput v-model="form.subtitle" size="lg" placeholder="Sous-titre (optionnel)" />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea v-model="form.description" :rows="8" placeholder="Votre présentation..." />
          </UFormField>
        </div>
      </UCard>
    </div>
  </div>
</template>
