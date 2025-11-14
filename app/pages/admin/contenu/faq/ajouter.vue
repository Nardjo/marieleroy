<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const { createFaq, loading } = useFaq()
  const toast = useToast()

  const form = ref({
    id: null,
    question: '',
    answer: '',
    displayOrder: 1,
  })

  const goBack = () => {
    router.push('/admin/contenu/faq')
  }

  const saveFaqItem = async () => {
    try {
      await createFaq(form.value)

      toast.add({
        title: 'Question créée',
        description: 'La nouvelle question a été ajoutée avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
      setTimeout(() => {
        goBack()
      }, 1500)
    } catch (error: any) {
      console.error('Erreur lors de la création:', error)
      toast.add({
        title: 'Erreur de création',
        description: error?.data?.message || 'Impossible de créer la question',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    }
  }
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="sm" @click="goBack" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ajouter une question</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Créer une nouvelle question pour la FAQ</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        icon="i-lucide-save"
        class="w-full md:w-auto"
        :loading="loading"
        @click="saveFaqItem">
        Enregistrer
      </UButton>
    </div>

    <AdminFaqForm v-model:faq-item="form" :loading="loading" />
  </div>
</template>
