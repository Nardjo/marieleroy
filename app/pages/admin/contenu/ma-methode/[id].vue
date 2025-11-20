<script setup lang="ts">
  useHead({
    title: "Modifier l'étape",
  })

  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const { loading, fetchStep, updateStep } = useMethod()
  const { refreshMethod } = useRefreshPublicData()
  const toast = useToast()

  const stepId = route.params.id as string
  const form = reactive({
    title: '',
    description: '',
    stepOrder: 1,
  })

  onMounted(async () => {
    try {
      const step = await fetchStep(stepId)
      Object.assign(form, step)
    } catch (error) {
      toast.add({
        title: 'Erreur',
        description: "Impossible de charger l'étape",
        color: 'error',
        duration: 5000,
      })
      navigateTo('/admin/contenu/ma-methode')
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
      await updateStep(stepId, form)
      // Invalidate public method cache to show updated data
      await refreshMethod()
      toast.add({
        title: 'Étape modifiée',
        description: "L'étape a été mise à jour avec succès",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
      navigateTo('/admin/contenu/ma-methode')
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || "Impossible de modifier l'étape",
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
    <AdminPageHeader title="Modifier l'étape" description="Mettre à jour les informations de cette étape">
      <template #actions>
        <UButton color="gray" variant="outline" size="lg" @click="cancel">Annuler</UButton>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveStep">
          Enregistrer
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
