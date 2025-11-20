<script setup lang="ts">
  useHead({
    title: 'Ajouter une étape',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSteps, createStep } = useMethod()
  const { refreshMethod } = useRefreshPublicData()
  const toast = useToast()

  const form = reactive({
    title: '',
    description: '',
    stepOrder: 1,
  })

  onMounted(async () => {
    try {
      const steps = await fetchSteps()
      // Définir l'ordre comme le prochain numéro
      form.stepOrder = steps.length + 1
    } catch (error) {
      console.error('Erreur lors du chargement des étapes:', error)
    }
  })

  const saveStep = async () => {
    if (!form.title || !form.description) {
      toast.add({
        title: 'Formulaire incomplet',
        description: 'Veuillez remplir tous les champs obligatoires',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
        duration: 3000,
      })
      return
    }

    try {
      await createStep(form)
      // Invalidate public method cache to show updated data
      await refreshMethod()
      toast.add({
        title: 'Étape créée',
        description: 'La nouvelle étape a été ajoutée avec succès',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
      navigateTo('/admin/contenu/ma-methode')
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || "Impossible de créer l'étape",
        color: 'error',
        duration: 5000,
      })
    }
  }

  const cancel = () => {
    navigateTo('/admin/contenu/ma-methode')
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Ajouter une étape" description="Créer une nouvelle étape dans votre processus">
      <template #actions>
        <UButton color="gray" variant="outline" size="lg" @click="cancel">Annuler</UButton>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveStep">
          Créer l'étape
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <UCard>
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
              {{ form.stepOrder }}
            </span>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-500">Étape {{ form.stepOrder }}</p>
            <p class="text-xs text-gray-400">Cette étape sera ajoutée à la fin de la liste</p>
          </div>
        </div>

        <UFormField label="Titre de l'étape" required>
          <UInput v-model="form.title" size="lg" placeholder="Ex: Consultation initiale" :disabled="loading" />
        </UFormField>

        <UFormField label="Description" required>
          <UTextarea
            v-model="form.description"
            :rows="4"
            placeholder="Décrivez cette étape en détail..."
            :disabled="loading" />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
