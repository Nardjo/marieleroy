<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const form = reactive({
  instagram: 'https://www.instagram.com/mari.eleroy94/',
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
          Réseaux sociaux
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Configurer les liens vers vos profils sociaux
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
      description="Les liens ont été mis à jour avec succès" />

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <UCard>
          <div class="space-y-6">
            <UFormField
              v-for="platform in socialPlatforms"
              :key="platform.key"
              :label="platform.label">
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
        <!-- Preview -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Aperçu</h3>
          </template>
          <div class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Liens actifs :
            </p>
            <div class="space-y-2">
              <div
                v-for="platform in socialPlatforms.filter(p => form[p.key as keyof typeof form])"
                :key="platform.key"
                class="flex items-center gap-2 text-sm">
                <UIcon :name="platform.icon" :class="`w-4 h-4 text-${platform.color}-600`" />
                <span class="text-gray-700 dark:text-gray-300">{{ platform.label }}</span>
              </div>
              <p v-if="!socialPlatforms.some(p => form[p.key as keyof typeof form])" class="text-sm text-gray-500">
                Aucun lien configuré
              </p>
            </div>
          </div>
        </UCard>

        <!-- Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Information</h3>
          </template>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              Les liens vers vos réseaux sociaux apparaîtront dans le footer du site.
            </p>
            <p>
              Laissez vide les champs des réseaux que vous n'utilisez pas.
            </p>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
