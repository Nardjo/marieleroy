<script setup lang="ts">
  useHead({
    title: 'Modifier la question',
  })

  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const id = computed(() => route.params.id as string)

  const { fetchFaq, updateFaq, loading } = useFaq()
  const toast = useToast()

  const form = ref<any>(null)

  onMounted(async () => {
    try {
      const faq = await fetchFaq(id.value)
      if (faq) {
        form.value = {
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          displayOrder: faq.displayOrder,
        }
      } else {
        router.push('/admin/contenu/faq')
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      toast.add({
        title: 'Erreur de chargement',
        description: 'Impossible de charger la question',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
      router.push('/admin/contenu/faq')
    }
  })

  const goBack = () => {
    router.push('/admin/contenu/faq')
  }

  const saveFaqItem = async () => {
    try {
      const updateData = {
        question: form.value.question,
        answer: form.value.answer,
        displayOrder: form.value.displayOrder,
      }
      await updateFaq(id.value, updateData)

      toast.add({
        title: 'Modifications enregistrées',
        description: 'La question a été mise à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
      setTimeout(() => {
        goBack()
      }, 1500)
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.add({
        title: 'Erreur de mise à jour',
        description: error?.data?.message || 'Impossible de mettre à jour la question',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    }
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Title and Description -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="sm" @click="goBack" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Modifier la question</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Modifier les informations de la question FAQ</p>
    </div>

    <!-- Desktop Save Button -->
    <div class="hidden md:flex gap-3 mb-6 justify-end">
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveFaqItem">
        Enregistrer
      </UButton>
    </div>

    <!-- Form Content -->
    <AdminFaqForm v-if="form" v-model:faq-item="form" :loading="loading" />

    <!-- Mobile Sticky Save Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-card border-t border-default p-4 md:hidden z-40">
      <div class="flex gap-3 justify-end">
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveFaqItem">
          Enregistrer
        </UButton>
      </div>
    </div>

    <!-- Mobile padding for sticky button -->
    <div class="h-24 md:h-0" />
  </div>
</template>
