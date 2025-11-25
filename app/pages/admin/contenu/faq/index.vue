<script setup lang="ts">
  useHead({
    title: 'FAQ',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchFaqs, deleteFaq, fetchHeader, updateHeader } = useFaq()
  const { refreshFaq } = useRefreshPublicData()
  const toast = useToast()

  const faqItems = ref([])
  const headerForm = reactive({
    title: '',
    subtitle: '',
    description: '',
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
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="FAQ" description="Gérer l'en-tête et les questions fréquemment posées">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
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
      <!-- Header Form -->
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

      <!-- FAQ List Section -->
      <div class="space-y-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Les questions</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez les questions fréquemment posées
            </p>
          </div>
          <UButton color="neutral" size="lg" icon="i-lucide-plus" class="w-full sm:w-auto" @click="addFaqItem">
            Ajouter une question
          </UButton>
        </div>
      </div>

      <!-- Empty State -->
      <AdminEmptyState
        v-if="faqItems.length === 0"
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

      <!-- Bouton Enregistrer en bas (desktop seulement) -->
      <div class="hidden md:flex justify-end pt-6 pb-6">
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
          Enregistrer
        </UButton>
      </div>
    </template>
  </div>
</template>
