<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchAbout, updateAbout } = useAbout()
  const { uploadImage } = useImageUpload()
  const toast = useToast()

  const form = reactive({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  })

  const fileInput = ref<HTMLInputElement>()
  const uploading = ref(false)

  const loadAbout = async () => {
    try {
      const data = await fetchAbout()
      Object.assign(form, data)
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
      // Clean empty strings and null to undefined for optional fields
      const payload = {
        title: form.title,
        description: form.description,
        subtitle: form.subtitle && form.subtitle.trim() !== '' ? form.subtitle : undefined,
        imageUrl: form.imageUrl && form.imageUrl.trim() !== '' ? form.imageUrl : undefined,
      }
      console.log('💾 Payload to send:', payload)
      await updateAbout(payload)
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

  const handleImageUpload = async () => {
    const file = fileInput.value?.files?.[0]
    if (!file) return

    uploading.value = true
    try {
      const result = (await uploadImage(file)) as { url: string }
      form.imageUrl = result.url

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
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }

  const triggerFileInput = () => {
    fileInput.value?.click()
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
    <AdminSkeletonForm v-if="loading" :fields="3" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <div class="space-y-4">
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

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Image -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Image de profil</h3>
          </template>
          <div class="space-y-4">
            <div v-if="form.imageUrl" class="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img :src="form.imageUrl" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div v-else class="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <UIcon name="i-lucide-image" class="w-12 h-12 text-gray-400" />
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            <UButton color="neutral" block :loading="uploading" @click="triggerFileInput">
              Télécharger une image
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
