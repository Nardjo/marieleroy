<script setup lang="ts">
  import draggable from 'vuedraggable'

  useHead({
    title: 'Ma méthode',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchSteps, deleteStep, reorderSteps, fetchHeader, updateHeader } = useMethod()
  const { refreshMethod } = useRefreshPublicData()
  const toast = useToast()

  const steps = ref([])
  const isDragging = ref(false)
  const headerForm = reactive({
    title: '',
    subtitle: '',
    description: '',
  })

  // Tabs
  const route = useRoute()
  const router = useRouter()
  const tabs = [
    { label: 'En-tête', value: 'header', icon: 'i-lucide-heading' },
    { label: 'Les étapes', value: 'steps', icon: 'i-lucide-list-ordered' },
  ]
  const activeTab = ref((route.query.tab as string) || 'header')

  // Sync tab with URL
  watch(activeTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } })
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
      // Invalidate public method cache to show updated data
      await refreshMethod()
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
      // Invalidate public method cache to show updated data
      await refreshMethod()
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
      // Invalidate public method cache to show updated data
      await refreshMethod()
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
        <UButton
          v-if="activeTab === 'header'"
          color="primary"
          size="lg"
          icon="i-lucide-save"
          :loading="loading"
          @click="saveHeader">
          Enregistrer
        </UButton>
        <UButton
          v-else
          color="neutral"
          size="lg"
          icon="i-lucide-plus"
          @click="addStep">
          Ajouter une étape
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
    </template>

    <!-- Content with Tabs -->
    <template v-else>
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- Header Tab -->
          <div v-if="item.value === 'header'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-6">
                <UFormField label="Titre principal" required>
                  <UInput v-model="headerForm.title" size="lg" placeholder="Ex: Comment je travaille" />
                </UFormField>

                <UFormField label="Sous-titre" description="Optionnel - Affiché sous le titre principal">
                  <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: étape par étape" />
                </UFormField>

                <UFormField label="Description" description="Optionnel - Texte d'introduction">
                  <AdminRichTextEditor
                    v-model="headerForm.description"
                    placeholder="Décrivez votre approche et méthode de travail..."
                    min-height="120px" />
                </UFormField>
              </div>
            </UCard>

            <!-- Bouton Enregistrer en bas (desktop seulement) -->
            <div class="hidden md:flex justify-end pt-6 pb-6">
              <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
                Enregistrer
              </UButton>
            </div>
          </div>

          <!-- Steps Tab -->
          <div v-else-if="item.value === 'steps'" class="space-y-6 pt-6">
            <!-- Empty State -->
            <AdminEmptyState
              v-if="steps.length === 0"
              icon="i-lucide-list-ordered"
              title="Aucune étape"
              description="Commencez par ajouter votre première étape"
              button-label="Ajouter une étape"
              button-icon="i-lucide-plus"
              @action="addStep" />

            <!-- Steps Table with Drag & Drop -->
            <UCard v-else>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="w-12 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"></th>
                      <th class="w-16 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ordre</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Titre</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                      <th class="w-24 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <draggable
                    v-model="steps"
                    tag="tbody"
                    item-key="id"
                    handle=".drag-handle"
                    animation="200"
                    @start="onDragStart"
                    @end="onDragEnd">
                    <template #item="{ element: step, index }">
                      <tr
                        class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        :class="{ 'opacity-50': isDragging }">
                        <td class="px-4 py-3">
                          <UIcon
                            name="i-lucide-grip-vertical"
                            class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        </td>
                        <td class="px-4 py-3">
                          <span class="font-medium text-gray-900 dark:text-white">{{ index + 1 }}</span>
                        </td>
                        <td class="px-4 py-3">
                          <span class="font-semibold text-gray-900 dark:text-white">{{ step.title }}</span>
                        </td>
                        <td class="px-4 py-3">
                          <p class="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                            {{ step.description }}
                          </p>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center justify-end gap-2">
                            <UButton
                              color="neutral"
                              variant="ghost"
                              size="sm"
                              class="cursor-pointer"
                              icon="i-lucide-pencil"
                              @click="editStep(step)" />
                            <UButton
                              color="error"
                              variant="ghost"
                              size="sm"
                              class="cursor-pointer"
                              icon="i-lucide-trash-2"
                              @click="handleDelete(step.id)" />
                          </div>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
