<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const { createTestimonial, loading } = useTestimonials()
  const toast = useToast()

  const form = ref({
    title: '',
    quote: '',
    embedUrl: '',
    displayOrder: 0,
  })

  const goBack = () => {
    router.push('/admin/contenu/temoignages')
  }

  const saveTestimonial = async () => {
    try {
      await createTestimonial(form.value)

      toast.add({
        title: 'Témoignage créé',
        description: 'Le nouveau témoignage a été ajouté avec succès',
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
        description: error?.data?.message || 'Impossible de créer le témoignage',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    }
  }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="sm" @click="goBack" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ajouter un témoignage</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Créer un nouveau témoignage vidéo</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveTestimonial">
        Enregistrer
      </UButton>
    </div>

    <AdminTestimonialForm v-model:testimonial="form" :loading="loading" />
  </div>
</template>
