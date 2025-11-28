<script setup lang="ts">
  useHead({
    title: 'Paramètres généraux',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSettings, updateSettings } = useSettings()
  const { refreshSettings } = useRefreshPublicData()
  const toast = useToast()

  const form = reactive({
    siteName: '',
    siteDescription: '',
    email: '',
    phone: '',
    address: '',
    ctaLink: '',
  })

  // Charger les paramètres au montage
  const loadSettings = async () => {
    try {
      const settings = await fetchSettings()
      form.siteName = settings.siteName || ''
      form.siteDescription = settings.siteDescription || ''
      form.email = settings.email || ''
      form.phone = settings.phone || ''
      form.address = settings.address || ''
      form.ctaLink = settings.cta_link || ''
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err)
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les paramètres',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadSettings()
  })

  const saveSettings = async () => {
    try {
      await updateSettings(form)
      // Invalidate public settings cache to show updated data
      await refreshSettings()
      toast.add({
        title: 'Paramètres enregistrés',
        description: 'Les paramètres ont été mis à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.add({
        title: 'Erreur de sauvegarde',
        description: error?.data?.message || 'Impossible de sauvegarder les paramètres',
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
    <AdminPageHeader title="Paramètres généraux" description="Configurer les informations principales du site">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveSettings">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="5" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Site Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Informations du site</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Nom du site" required>
              <UInput v-model="form.siteName" size="lg" placeholder="Marie Leroy" />
            </UFormField>

            <UFormField label="Description du site" required>
              <UTextarea
                v-model="form.siteDescription"
                :rows="3"
                placeholder="Une brève description de votre activité" />
            </UFormField>

            <UFormField label="Lien CTA (Call To Action)">
              <UInput
                v-model="form.ctaLink"
                type="url"
                size="lg"
                placeholder="https://calendly.com/marieleroy"
                icon="i-lucide-external-link" />
            </UFormField>
          </div>
        </UCard>

        <!-- Contact Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Informations de contact</h3>
          </template>
          <div class="space-y-4">
            <UFormField label="Email" required>
              <UInput
                v-model="form.email"
                type="email"
                size="lg"
                placeholder="contact@marie-leroy.com"
                icon="i-lucide-mail" />
            </UFormField>

            <UFormField label="Téléphone">
              <UInput v-model="form.phone" type="tel" size="lg" placeholder="+33 6 12 34 56 78" icon="i-lucide-phone" />
            </UFormField>

            <UFormField label="Adresse">
              <UInput v-model="form.address" size="lg" placeholder="Paris, France" icon="i-lucide-map-pin" />
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
            <p>
              Ces paramètres sont utilisés dans différentes parties du site, notamment dans le footer et les
              métadonnées.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
