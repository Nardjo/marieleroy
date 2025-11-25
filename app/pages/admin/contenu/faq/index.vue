<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import { useSortable } from '@vueuse/integrations/useSortable'

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
  watch(activeTab, newTab => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

  // Table columns
  const columns: TableColumn<any>[] = [
    { id: 'order', header: 'Ordre' },
    { id: 'question', header: 'Question' },
    { id: 'answer', header: 'Réponse' },
    { id: 'actions', header: 'Actions' },
  ]

  // Drag and drop
  let currentTbody: HTMLElement | null = null
  let sortableInstance: ReturnType<typeof useSortable> | null = null

  const initSortable = () => {
    if (activeTab.value !== 'questions' || faqItems.value.length === 0) return

    const tbody = document.querySelector('.faq-tbody') as HTMLElement | null
    if (!tbody) return

    // Ne réinitialiser que si le tbody a changé
    if (tbody !== currentTbody) {
      // Détruire l'ancienne instance
      if (sortableInstance) {
        sortableInstance.stop()
      }

      currentTbody = tbody
      // Ne pas passer faqItems pour éviter les conflits de réactivité Vue
      sortableInstance = useSortable(tbody, [], {
        animation: 150,
        onEnd: (evt: any) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            // Réordonner manuellement le tableau
            const items = [...faqItems.value]
            const [moved] = items.splice(oldIndex, 1)
            items.splice(newIndex, 0, moved)
            faqItems.value = items

            saveOrder()
          }
        },
      })
    }
  }

  watch([activeTab, () => faqItems.value.length], () => {
    nextTick(() => setTimeout(initSortable, 50))
  }, { immediate: true })

  onUpdated(() => {
    if (activeTab.value === 'questions' && faqItems.value.length > 0) {
      nextTick(initSortable)
    }
  })

  onUnmounted(() => {
    if (sortableInstance) {
      sortableInstance.stop()
    }
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

  // Sauvegarder l'ordre après un drag
  const saveOrder = async () => {
    const reorderedFaqItems = faqItems.value.map((faq, index) => ({
      id: faq.id,
      displayOrder: index + 1,
    }))

    try {
      await reorderFaqs(reorderedFaqItems)
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
      await loadFaqs()
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
        <UButton v-else color="neutral" size="lg" icon="i-lucide-plus" @click="addFaqItem">
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

                <UFormField label="Sous-titre">
                  <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: mes réponses" />
                </UFormField>

                <UFormField label="Description">
                  <AdminRichTextEditor
                    v-model="headerForm.description"
                    placeholder="Décrivez la section FAQ..."
                    min-height="120px" />
                </UFormField>
              </div>
            </UCard>
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
              <UTable ref="table" :data="faqItems" :columns="columns" :ui="{ tbody: 'faq-tbody' }" class="flex-1">
                <template #order-cell="{ row }">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ faqItems.indexOf(row.original) + 1 }}
                  </span>
                </template>

                <template #question-cell="{ row }">
                  <span class="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {{ row.original.question }}
                  </span>
                </template>

                <template #answer-cell="{ row }">
                  <p class="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
                    {{ row.original.answer }}
                  </p>
                </template>

                <template #actions-cell="{ row }">
                  <div class="flex items-center justify-end gap-2">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      class="cursor-pointer"
                      icon="i-lucide-pencil"
                      @click="editFaqItem(row.original)" />
                    <UButton
                      color="error"
                      variant="ghost"
                      size="sm"
                      class="cursor-pointer"
                      icon="i-lucide-trash-2"
                      @click="handleDelete(row.original.id)" />
                  </div>
                </template>
              </UTable>
            </UCard>
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
