<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSocialLinks, updateSocialLinks } = useSettings()
  const toast = useToast()

  const form = reactive({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  })

  const socialPlatforms = [
    { key: 'instagram', label: 'Instagram', icon: 'i-lucide-instagram', color: 'pink' },
    { key: 'facebook', label: 'Facebook', icon: 'i-lucide-facebook', color: 'blue' },
    { key: 'twitter', label: 'Twitter / X', icon: 'i-lucide-twitter', color: 'sky' },
    { key: 'linkedin', label: 'LinkedIn', icon: 'i-lucide-linkedin', color: 'blue' },
    { key: 'youtube', label: 'YouTube', icon: 'i-lucide-youtube', color: 'red' },
    { key: 'tiktok', label: 'TikTok', icon: 'i-lucide-music', color: 'slate' },
  ]

  // Charger les liens sociaux au montage
  const loadSocialLinks = async () => {
    try {
      const links = await fetchSocialLinks()
      form.instagram = links.instagram || ''
      form.facebook = links.facebook || ''
      form.twitter = links.twitter || ''
      form.linkedin = links.linkedin || ''
      form.youtube = links.youtube || ''
      form.tiktok = links.tiktok || ''
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err)
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les réseaux sociaux',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadSocialLinks()
  })

  const saveSettings = async () => {
    try {
      await updateSocialLinks(form)
      toast.add({
        title: 'Liens enregistrés',
        description: 'Les liens ont été mis à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.add({
        title: 'Erreur de sauvegarde',
        description: error?.data?.message || 'Impossible de sauvegarder les liens',
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
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Réseaux sociaux</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Configurer les liens vers vos profils sociaux</p>
    </div>

    <!-- Desktop Save Button -->
    <div class="hidden md:flex gap-3 mb-6">
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveSettings">
        Enregistrer
      </UButton>
    </div>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="6" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-28 md:pb-0">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <UCard>
          <div class="space-y-6">
            <UFormField v-for="platform in socialPlatforms" :key="platform.key" :label="platform.label">
              <UInput
                v-model="form[platform.key as keyof typeof form]"
                size="lg"
                :placeholder="`URL de votre profil ${platform.label}`"
                :icon="platform.icon" />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Information</h3>
          </template>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Les liens vers vos réseaux sociaux apparaîtront dans le footer du site.</p>
            <p>Laissez vide les champs des réseaux que vous n'utilisez pas.</p>
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
