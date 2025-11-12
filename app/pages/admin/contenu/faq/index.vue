<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, saved, showSuccess } = useAdminCrud()

  const faqItems = ref([
    {
      id: 1,
      question: 'Quels types de contenus rédigez-vous ?',
      answer:
        'Je rédige une variété de contenus : pages de vente, articles de blog, newsletters, descriptions de produits, et bien plus encore. Chaque contenu est adapté à vos besoins spécifiques.',
      order: 1,
    },
    {
      id: 2,
      question: 'Quel est votre processus de travail ?',
      answer:
        'Mon processus se déroule en 5 étapes : consultation initiale, recherche et stratégie, rédaction et optimisation, révisions, et livraison finale avec suivi.',
      order: 2,
    },
    {
      id: 3,
      question: 'Combien de temps prend un projet ?',
      answer:
        "Le délai varie selon la complexité et l'ampleur du projet. Un article de blog prend généralement 3-5 jours, tandis qu'une page de vente complète peut nécessiter 1-2 semaines.",
      order: 3,
    },
  ])

  const addFaqItem = () => {
    navigateTo('/admin/contenu/faq/ajouter')
  }

  const editFaqItem = (item: any) => {
    navigateTo(`/admin/contenu/faq/${item.id}`)
  }

  const deleteFaqItem = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

    try {
      // TODO: API call to delete FAQ item
      await new Promise(resolve => setTimeout(resolve, 500))
      faqItems.value = faqItems.value.filter(item => item.id !== id)
    } catch (error) {
      console.error('Error deleting FAQ item:', error)
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

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="La question a été mise à jour avec succès" />

    <!-- FAQ List -->
    <div class="space-y-4">
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
              @delete="deleteFaqItem(item.id)"
              confirm-message="Êtes-vous sûr de vouloir supprimer cette question ?" />
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <AdminEmptyState
        v-if="faqItems.length === 0"
        icon="i-lucide-help-circle"
        title="Aucune question"
        description="Commencez par ajouter votre première question"
        button-label="Ajouter une question"
        button-icon="i-lucide-plus"
        @action="addFaqItem" />
    </div>
  </div>
</template>
