<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const form = reactive({
  title: 'Qui suis-je?',
  subtitle: 'Votre copywriter professionnelle',
  description: '',
  imageUrl: '',
  skills: [] as string[],
})

const saveContent = async () => {
  loading.value = true
  try {
    // TODO: API call to save content
    await new Promise(resolve => setTimeout(resolve, 1000))
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } catch (error) {
    console.error('Error saving content:', error)
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
          À propos
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gérer le contenu de la section "À propos"
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-save"
        :loading="loading"
        @click="saveContent">
        Enregistrer
      </UButton>
    </div>

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="Le contenu a été mis à jour avec succès" />

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <UTextarea
                v-model="form.description"
                :rows="8"
                placeholder="Votre présentation..." />
            </UFormField>
          </div>
        </UCard>

        <!-- Skills Section -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Compétences</h3>
          </template>
          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ajoutez vos compétences principales (une par ligne)
            </p>
            <UTextarea
              :model-value="form.skills.join('\n')"
              @update:model-value="form.skills = ($event as string).split('\n').filter(Boolean)"
              :rows="6"
              placeholder="Ex: Copywriting&#10;Storytelling&#10;Marketing de contenu" />
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
            <UButton color="neutral" block>
              Télécharger une image
            </UButton>
          </div>
        </UCard>

        <!-- Preview -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Aperçu</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/#about"
              target="_blank"
              color="neutral"
              variant="outline"
              block
              icon="i-lucide-external-link">
              Voir sur le site
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
