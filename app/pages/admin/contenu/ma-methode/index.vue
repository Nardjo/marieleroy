<script setup lang="ts">
  import draggable from 'vuedraggable'

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSteps, deleteStep, reorderSteps, fetchHeader, updateHeader } = useMethod()
  const toast = useToast()

  const steps = ref([])
  const isDragging = ref(false)
  const headerForm = reactive({
    title: '',
    subtitle: '',
    description: '',
  })

  const loadSteps = async () => {
    try {
      steps.value = await fetchSteps()
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les étapes',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const loadHeader = async () => {
    try {
      const header = await fetchHeader()
      Object.assign(headerForm, header)
    } catch (error) {
      console.error("Erreur lors du chargement de l'en-tête:", error)
    }
  }

  const saveHeader = async () => {
    try {
      await updateHeader(headerForm)
      toast.add({
        title: 'En-tête enregistré',
        description: "L'en-tête a été mis à jour avec succès",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || "Impossible de sauvegarder l'en-tête",
        color: 'error',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadHeader()
    loadSteps()
  })

  const editHeader = () => {
    navigateTo('/admin/contenu/ma-methode/header')
  }

  const addStep = () => {
    navigateTo('/admin/contenu/ma-methode/ajouter')
  }

  const editStep = (step: any) => {
    navigateTo(`/admin/contenu/ma-methode/${step.id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) return

    try {
      await deleteStep(id)
      toast.add({
        title: 'Étape supprimée',
        description: "L'étape a été supprimée avec succès",
        color: 'success',
        icon: 'i-lucide-trash-2',
        duration: 3000,
      })
      await loadSteps()
    } catch (error: any) {
      toast.add({
        title: 'Erreur de suppression',
        description: error?.message || "Impossible de supprimer l'étape",
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    }
  }

  // Gestion du drag & drop pour réordonner
  const onDragStart = () => {
    isDragging.value = true
  }

  const onDragEnd = async () => {
    isDragging.value = false

    // Toujours sauvegarder l'ordre après un drag, car vuedraggable a déjà mis à jour le tableau
    const reorderedSteps = steps.value.map((step, index) => ({
      id: step.id,
      stepOrder: index + 1,
    }))

    try {
      await reorderSteps(reorderedSteps)
      toast.add({
        title: 'Ordre mis à jour',
        description: "L'ordre des étapes a été sauvegardé",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 2000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: "Impossible de sauvegarder l'ordre",
        color: 'error',
        duration: 3000,
      })
      await loadSteps() // Recharger l'ordre original
    }
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Ma méthode" description="Gérer votre processus de travail étape par étape">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" @click="saveHeader" :loading="loading">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>
    <!-- Loading State -->
    <template v-if="loading">
      <UCard>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i">
            <USkeleton class="h-4 w-24 mb-2" />
            <USkeleton class="h-10 w-full" />
          </div>
        </div>
      </UCard>
      <AdminSkeletonCardList :count="3" />
    </template>

    <!-- Content -->
    <template v-else>
      <UCard>
        <div class="space-y-6">
          <UFormField label="Titre principal" required>
            <UInput v-model="headerForm.title" size="lg" placeholder="Ex: Comment je travaille" />
          </UFormField>

          <UFormField label="Sous-titre" description="Optionnel - Affiché sous le titre principal">
            <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: étape par étape" />
          </UFormField>

          <UFormField label="Description" description="Optionnel - Texte d'introduction">
            <UTextarea
              v-model="headerForm.description"
              :rows="4"
              placeholder="Décrivez votre approche et méthode de travail..." />
          </UFormField>
        </div>
      </UCard>

      <!-- Steps List -->
      <div class="space-y-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Les étapes</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Personnalisez Les étapes de votre méthode de travail
            </p>
          </div>
          <UButton color="neutral" size="lg" icon="i-lucide-plus" class="w-full sm:w-auto" @click="addStep">
            Ajouter une étape
          </UButton>
        </div>

        <!-- Empty State -->
        <AdminEmptyState
          v-if="steps.length === 0"
          icon="i-lucide-list-ordered"
          title="Aucune étape"
          description="Commencez par ajouter votre première étape"
          button-label="Ajouter une étape"
          button-icon="i-lucide-plus"
          @action="addStep" />

        <!-- Steps Cards -->
        <draggable
          v-else
          v-model="steps"
          item-key="id"
          handle=".drag-handle"
          animation="200"
          @start="onDragStart"
          @end="onDragEnd">
          <template #item="{ element: step, index }">
            <UCard class="shadow-sm mb-4" :class="{ 'opacity-50': isDragging }">
              <div class="flex items-start gap-4">
                <!-- Drag Handle & Number -->
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-lucide-grip-vertical"
                    class="drag-handle cursor-move text-gray-400 hover:text-gray-600 transition-colors" />
                  <div
                    class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {{ index + 1 }}
                    </span>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ step.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ step.description }}
                  </p>
                </div>

                <!-- Actions -->
                <AdminCrudActions @edit="editStep(step)" @delete="handleDelete(step.id)" />
              </div>
            </UCard>
          </template>
        </draggable>
      </div>

      <!-- Bouton Enregistrer en bas (desktop seulement) -->
      <div class="hidden md:flex justify-end pt-6 pb-6">
        <UButton color="primary" size="lg" icon="i-lucide-save" @click="saveHeader" :loading="loading">
          Enregistrer
        </UButton>
      </div>
    </template>
  </div>
</template>
