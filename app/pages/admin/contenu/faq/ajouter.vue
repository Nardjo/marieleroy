<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const loading = ref(false)
  const saved = ref(false)

  const form = ref({
    id: null,
    question: '',
    answer: '',
    order: 1,
  })

  const goBack = () => {
    router.push('/admin/contenu/faq')
  }

  const saveFaqItem = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      saved.value = true
      setTimeout(() => {
        saved.value = false
        goBack()
      }, 1500)
    } catch (error) {
      console.error('Error saving FAQ item:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="sm" @click="goBack" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ajouter une question</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Créer une nouvelle question pour la FAQ</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveFaqItem">
        Enregistrer
      </UButton>
    </div>

    <UAlert v-if="saved" color="success" variant="soft" title="Question créée avec succès" />

    <AdminFaqForm v-model:faq-item="form" :loading="loading" />
  </div>
</template>
