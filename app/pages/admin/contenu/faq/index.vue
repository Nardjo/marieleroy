<script setup lang="ts">
  import draggable from 'vuedraggable'

  useHead({
    title: 'FAQ',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchFaqs, deleteFaq, fetchHeader, updateHeader, reorderFaqs } = useFaq()
  const { refreshFaq } = useRefreshPublicData()
  const toast = useToast()

  const faqItems = ref<any[]>([])
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
    { label: 'Les questions', value: 'questions', icon: 'i-lucide-help-circle' },
  ]
  const activeTab = ref((route.query.tab as string) || 'header')

  // Sync tab with URL
  watch(activeTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

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
      await refreshFaq()
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

  // Charger les FAQs au montage
  const loadFaqs = async () => {
    try {
      faqItems.value = await fetchFaqs()
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err)
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les questions',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadHeader()
    loadFaqs()
  })

  const addFaqItem = () => {
    navigateTo('/admin/contenu/faq/ajouter')
  }

  const editFaqItem = (item: any) => {
    navigateTo(`/admin/contenu/faq/${item.id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

    try {
      await deleteFaq(id)
      await refreshFaq()
      toast.add({
        title: 'Question supprimée',
        description: 'La question a été supprimée définitivement',
        color: 'success',
        icon: 'i-lucide-trash-2',
        duration: 3000,
      })
      await loadFaqs()
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast.add({
        title: 'Erreur de suppression',
        description: error?.data?.message || 'Impossible de supprimer la question',
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

    // Sauvegarder l'ordre après un drag
    const reorderedFaqs = faqItems.value.map((faq, index) => ({
      id: faq.id,
      displayOrder: index + 1,
    }))

    try {
      await reorderFaqs(reorderedFaqs)
      await refreshFaq()
      toast.add({
        title: 'Ordre mis à jour',
        description: "L'ordre des questions a été sauvegardé",
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
      await loadFaqs() // Recharger l'ordre original
    }
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="FAQ" description="Gérer l'en-tête et les questions fréquemment posées">
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
          @click="addFaqItem">
          Ajouter une question
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
                  <UInput v-model="headerForm.title" size="lg" placeholder="Ex: Vos questions," />
                </UFormField>

                <UFormField label="Sous-titre" description="Optionnel - Affiché sous le titre principal">
                  <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: mes réponses" />
                </UFormField>

                <UFormField label="Description" description="Optionnel - Texte d'introduction">
                  <AdminRichTextEditor
                    v-model="headerForm.description"
                    placeholder="Décrivez la section FAQ..."
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

          <!-- Questions Tab -->
          <div v-else-if="item.value === 'questions'" class="space-y-6 pt-6">
            <!-- Empty State -->
            <AdminEmptyState
              v-if="faqItems.length === 0"
              icon="i-lucide-help-circle"
              title="Aucune question"
              description="Commencez par ajouter votre première question"
              button-label="Ajouter une question"
              button-icon="i-lucide-plus"
              @action="addFaqItem" />

            <!-- FAQ Table with Drag & Drop -->
            <UCard v-else>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="w-12 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"></th>
                      <th class="w-16 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ordre</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Question</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Réponse</th>
                      <th class="w-24 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <draggable
                    v-model="faqItems"
                    tag="tbody"
                    item-key="id"
                    handle=".drag-handle"
                    animation="200"
                    @start="onDragStart"
                    @end="onDragEnd">
                    <template #item="{ element: faq, index }">
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
                          <span class="font-semibold text-gray-900 dark:text-white line-clamp-2">{{ faq.question }}</span>
                        </td>
                        <td class="px-4 py-3">
                          <p class="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                            {{ faq.answer }}
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
                              @click="editFaqItem(faq)" />
                            <UButton
                              color="error"
                              variant="ghost"
                              size="sm"
                              class="cursor-pointer"
                              icon="i-lucide-trash-2"
                              @click="handleDelete(faq.id)" />
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
