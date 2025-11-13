<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, error, fetchFaqs, deleteFaq } = useFaq()
  const toast = useToast()

  const faqItems = ref([])

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
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="FAQ" description="Gérer les questions fréquemment posées">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-plus" @click="addFaqItem">Ajouter une question</UButton>
      </template>
    </AdminPageHeader>

    <!-- FAQ List -->
    <AdminSkeletonCardList v-if="loading" :count="5" />

    <!-- Empty State -->
    <AdminEmptyState
      v-else-if="faqItems.length === 0"
      icon="i-lucide-help-circle"
      title="Aucune question"
      description="Commencez par ajouter votre première question"
      button-label="Ajouter une question"
      button-icon="i-lucide-plus"
      @action="addFaqItem" />

    <!-- FAQ Cards -->
    <div v-else class="space-y-4">
      <UCard v-for="item in faqItems" :key="item.id" class="shadow-sm h-full flex flex-col">
        <div class="flex-1 space-y-3">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {{ item.question }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
              {{ item.answer }}
            </p>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <AdminCrudActions
              @edit="editFaqItem(item)"
              @delete="handleDelete(item.id)"
              confirm-message="Êtes-vous sûr de vouloir supprimer cette question ?" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
