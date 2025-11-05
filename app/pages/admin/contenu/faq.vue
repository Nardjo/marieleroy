<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const faqItems = ref([
  {
    id: 1,
    question: 'Quels types de contenus rédigez-vous ?',
    answer: 'Je rédige une variété de contenus : pages de vente, articles de blog, newsletters, descriptions de produits, et bien plus encore. Chaque contenu est adapté à vos besoins spécifiques.',
    order: 1,
  },
  {
    id: 2,
    question: 'Quel est votre processus de travail ?',
    answer: 'Mon processus se déroule en 5 étapes : consultation initiale, recherche et stratégie, rédaction et optimisation, révisions, et livraison finale avec suivi.',
    order: 2,
  },
  {
    id: 3,
    question: 'Combien de temps prend un projet ?',
    answer: 'Le délai varie selon la complexité et l\'ampleur du projet. Un article de blog prend généralement 3-5 jours, tandis qu\'une page de vente complète peut nécessiter 1-2 semaines.',
    order: 3,
  },
])

const editingItem = ref<any>(null)
const isModalOpen = ref(false)

const openAddModal = () => {
  editingItem.value = {
    id: null,
    question: '',
    answer: '',
    order: faqItems.value.length + 1,
  }
  isModalOpen.value = true
}

const openEditModal = (item: any) => {
  editingItem.value = { ...item }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingItem.value = null
}

const saveFaqItem = async () => {
  loading.value = true
  try {
    // TODO: API call to save FAQ item
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingItem.value.id) {
      // Update existing
      const index = faqItems.value.findIndex(item => item.id === editingItem.value.id)
      if (index !== -1) {
        faqItems.value[index] = { ...editingItem.value }
      }
    } else {
      // Add new
      faqItems.value.push({
        ...editingItem.value,
        id: Math.max(...faqItems.value.map(item => item.id)) + 1,
      })
    }

    closeModal()
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } catch (error) {
    console.error('Error saving FAQ item:', error)
  } finally {
    loading.value = false
  }
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
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          FAQ
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Gérer les questions fréquemment posées
        </p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-plus"
        @click="openAddModal">
        Ajouter une question
      </UButton>
    </div>

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="La question a été mise à jour avec succès" />

    <!-- FAQ List -->
    <div class="space-y-4">
      <UCard v-for="item in faqItems" :key="item.id" class="shadow-sm">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ item.question }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mt-2">
                {{ item.answer }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              icon="i-lucide-edit"
              @click="openEditModal(item)">
              Modifier
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              size="sm"
              icon="i-lucide-trash-2"
              @click="deleteFaqItem(item.id)">
              Supprimer
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <UCard v-if="faqItems.length === 0" class="shadow-sm">
        <div class="text-center py-12">
          <UIcon name="i-lucide-help-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune question
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Commencez par ajouter votre première question
          </p>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            @click="openAddModal">
            Ajouter une question
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Preview -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Aperçu</h3>
      </template>
      <div class="space-y-2">
        <UButton
          to="/#faq"
          target="_blank"
          color="neutral"
          variant="outline"
          block
          icon="i-lucide-external-link">
          Voir sur le site
        </UButton>
      </div>
    </UCard>

    <!-- Edit Modal -->
    <UModal v-model:open="isModalOpen" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <div class="p-6 space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ editingItem?.id ? 'Modifier' : 'Ajouter' }} une question
          </h2>

          <div v-if="editingItem" class="space-y-4">
            <UFormField label="Question" required>
              <UInput
                v-model="editingItem.question"
                size="lg"
                placeholder="Quelle est votre question ?" />
            </UFormField>

            <UFormField label="Réponse" required>
              <UTextarea
                v-model="editingItem.answer"
                :rows="6"
                placeholder="La réponse à cette question..." />
            </UFormField>
          </div>

          <div class="flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="outline"
              @click="closeModal">
              Annuler
            </UButton>
            <UButton
              color="primary"
              :loading="loading"
              @click="saveFaqItem">
              Enregistrer
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
