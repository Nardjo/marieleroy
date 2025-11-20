<script setup lang="ts">
  useHead({
    title: 'Image de séparation',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchImageSeparator, updateImageSeparator } = useImageSeparator()
  const toast = useToast()

  const form = reactive({
    desktopImage: '',
    mobileImage: '',
  })

  const loadSeparator = async () => {
    try {
      const data = await fetchImageSeparator()
      Object.assign(form, data)
      // Convert null to empty string for the input
      if (form.desktopImage === null) {
        form.desktopImage = ''
      }
      if (form.mobileImage === null) {
        form.mobileImage = ''
      }
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || "Impossible de charger l'image de séparation",
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveContent = async () => {
    try {
      const payload = {
        desktopImage: form.desktopImage && form.desktopImage.trim() !== '' ? form.desktopImage : null,
        mobileImage: form.mobileImage && form.mobileImage.trim() !== '' ? form.mobileImage : null,
      }
      await updateImageSeparator(payload)
      toast.add({
        title: 'Séparateur enregistré',
        description: "L'image de séparation a été mise à jour avec succès",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || "Impossible de sauvegarder l'image de séparation",
        color: 'error',
        duration: 5000,
      })
    }
  }

  const handleImageDelete = (field: 'desktopImage' | 'mobileImage') => {
    form[field] = ''
  }

  onMounted(() => {
    loadSeparator()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Image de séparation" description="Gérer les images de séparation entre les sections">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="2" />

    <div v-else>
      <UCard>
        <div class="space-y-6">
          <!-- Desktop Image -->
          <AdminImageUploadField
            v-model="form.desktopImage"
            label="Image Desktop"
            name="desktopImage"
            required
            hint="Format recommandé: 1920x500px. Formats acceptés: JPG, PNG, WebP, AVIF"
            @delete="() => handleImageDelete('desktopImage')" />

          <!-- Mobile Image -->
          <AdminImageUploadField
            v-model="form.mobileImage"
            label="Image Mobile"
            name="mobileImage"
            required
            hint="Format recommandé: 800x800px. Formats acceptés: JPG, PNG, WebP, AVIF"
            @delete="() => handleImageDelete('mobileImage')" />
        </div>
      </UCard>
    </div>
  </div>
</template>
