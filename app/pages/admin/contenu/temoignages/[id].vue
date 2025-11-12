<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const id = computed(() => route.params.id as string)

  const { fetchTestimonial, updateTestimonial, loading } = useTestimonials()
  const toast = useToast()

  const form = ref<any>(null)

  // Charger le témoignage
  onMounted(async () => {
    try {
      const testimonial = await fetchTestimonial(id.value)
      if (testimonial) {
        form.value = {
          title: testimonial.title,
          quote: testimonial.quote,
          embedUrl: testimonial.embedUrl,
          displayOrder: testimonial.displayOrder,
        }
      } else {
        router.push('/admin/contenu/temoignages')
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      router.push('/admin/contenu/temoignages')
    }
  })

  const goBack = () => {
    router.push('/admin/contenu/temoignages')
  }

  const saveTestimonial = async () => {
    try {
      // Only send the fields that can be updated
      const updateData = {
        title: form.value.title,
        quote: form.value.quote,
        embedUrl: form.value.embedUrl,
        displayOrder: form.value.displayOrder,
      }
      await updateTestimonial(id.value, updateData)

      toast.add({
        title: 'Modifications enregistrées',
        description: 'Le témoignage a été mis à jour avec succès',
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
        description: error?.data?.message || 'Impossible de mettre à jour le témoignage',
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Modifier le témoignage</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Modifier les informations du témoignage</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveTestimonial">
        Enregistrer
      </UButton>
    </div>

    <AdminTestimonialForm v-if="form" v-model:testimonial="form" :loading="loading" />
  </div>
</template>
