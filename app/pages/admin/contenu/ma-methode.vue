<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const loading = ref(false)
  const saved = ref(false)

  const form = reactive({
    title: 'Comment je travaille',
    subtitle: 'étape par étape',
    description: 'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience',
    steps: [
      {
        id: 1,
        title: 'Consultation initiale',
        text: 'Nous commençons par une discussion approfondie pour comprendre vos objectifs, votre audience cible et vos attentes.',
      },
      {
        id: 2,
        title: 'Recherche et stratégie',
        text: "J'analyse votre marché, votre concurrence et votre audience pour développer une stratégie de contenu efficace.",
      },
      {
        id: 3,
        title: 'Rédaction et optimisation',
        text: "Je rédige votre contenu en utilisant des techniques de copywriting éprouvées pour maximiser l'impact et les conversions.",
      },
      {
        id: 4,
        title: 'Révisions et ajustements',
        text: "Je travaille avec vous pour affiner le contenu jusqu'à ce qu'il corresponde parfaitement à vos attentes et objectifs.",
      },
      {
        id: 5,
        title: 'Livraison et suivi',
        text: 'Je vous livre le contenu final et reste disponible pour des ajustements mineurs et pour répondre à vos questions.',
      },
    ],
  })

  const addStep = () => {
    form.steps.push({
      id: form.steps.length + 1,
      title: '',
      text: '',
    })
  }

  const removeStep = (index: number) => {
    form.steps.splice(index, 1)
    // Renumber steps
    form.steps.forEach((step, i) => {
      step.id = i + 1
    })
  }

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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ma méthode</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Gérer le processus de travail étape par étape</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
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

    <!-- Header Section -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">En-tête de la section</h3>
      </template>
      <div class="space-y-4">
        <UFormField label="Titre principal" required>
          <UInput v-model="form.title" size="lg" placeholder="Comment je travaille" />
        </UFormField>

        <UFormField label="Sous-titre">
          <UInput v-model="form.subtitle" size="lg" placeholder="étape par étape" />
        </UFormField>

        <UFormField label="Description">
          <UTextarea v-model="form.description" :rows="3" placeholder="Description de votre méthode de travail" />
        </UFormField>
      </div>
    </UCard>

    <!-- Steps Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Étapes du processus</h3>
        <UButton color="primary" variant="outline" icon="i-lucide-plus" @click="addStep">Ajouter une étape</UButton>
      </div>

      <div class="space-y-4">
        <UCard v-for="(step, index) in form.steps" :key="step.id">
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 space-y-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {{ step.id }}
                    </span>
                  </div>
                  <UFormField label="Titre de l'étape" class="flex-1">
                    <UInput v-model="step.title" size="lg" placeholder="Titre de l'étape" />
                  </UFormField>
                </div>

                <UFormField label="Description">
                  <UTextarea v-model="step.text" :rows="3" placeholder="Description détaillée de cette étape" />
                </UFormField>
              </div>

              <UButton
                v-if="form.steps.length > 1"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                size="sm"
                @click="removeStep(index)" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
