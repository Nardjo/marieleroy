<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const form = reactive({
  siteName: 'Marie Leroy',
  siteDescription: 'Copywriter professionnelle - Des mots qui convertissent, des messages qui résonnent',
  email: 'contact@marieleroy.fr',
  phone: '+33 6 12 34 56 78',
  address: 'Paris, France',
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
          Paramètres généraux
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Configurer les informations principales du site
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
      description="Les paramètres ont été mis à jour avec succès" />

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                placeholder="contact@marieleroy.fr"
                icon="i-lucide-mail" />
            </UFormField>

            <UFormField label="Téléphone">
              <UInput
                v-model="form.phone"
                type="tel"
                size="lg"
                placeholder="+33 6 12 34 56 78"
                icon="i-lucide-phone" />
            </UFormField>

            <UFormField label="Adresse">
              <UInput
                v-model="form.address"
                size="lg"
                placeholder="Paris, France"
                icon="i-lucide-map-pin" />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Links -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Liens rapides</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/admin/parametres/reseaux-sociaux"
              color="neutral"
              variant="outline"
              block
              icon="i-lucide-share-2">
              Réseaux sociaux
            </UButton>
            <UButton
              to="/admin/parametres/seo"
              color="neutral"
              variant="outline"
              block
              icon="i-lucide-search">
              SEO
            </UButton>
          </div>
        </UCard>

        <!-- Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Information</h3>
          </template>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Ces paramètres sont utilisés dans différentes parties du site, notamment dans le footer et les métadonnées.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
