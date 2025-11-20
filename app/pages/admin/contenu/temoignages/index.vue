<script setup lang="ts">
  useHead({
    title: 'Témoignages',
  })

  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const { loading, fetchTestimonials, deleteTestimonial } = useTestimonials()
  const { refreshTestimonials } = useRefreshPublicData()
  const toast = useToast()

  const testimonials = ref<any[]>([])

  const loadTestimonials = async () => {
    try {
      testimonials.value = await fetchTestimonials()
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les témoignages',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const confirmDelete = async (id: string, title: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le témoignage "${title}" ?`)) {
      try {
        await deleteTestimonial(id)
        // Invalidate public testimonials cache to show updated data
        await refreshTestimonials()
        toast.add({
          title: 'Témoignage supprimé',
          description: 'Le témoignage a été supprimé avec succès',
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
        await loadTestimonials()
      } catch (error: any) {
        toast.add({
          title: 'Erreur',
          description: error?.message || 'Impossible de supprimer le témoignage',
          color: 'error',
          duration: 5000,
        })
      }
    }
  }

  onMounted(() => {
    loadTestimonials()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Témoignages" description="Gérer les témoignages vidéo">
      <template #actions>
        <UButton color="neutral" size="lg" icon="i-lucide-plus" @click="router.push('/admin/contenu/temoignages/nouveau')">
          Ajouter un témoignage
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Testimonials List -->
    <AdminSkeletonForm v-if="loading" :fields="3" />

    <div v-else class="grid grid-cols-1 gap-6">
      <UCard v-for="testimonial in testimonials" :key="testimonial.id">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Video Preview -->
          <div class="md:w-1/3">
            <div class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <iframe
                :src="testimonial.embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>

          <!-- Content -->
          <div class="md:w-2/3 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ testimonial.title }}</h3>
                  <span class="text-sm text-gray-500">Ordre: {{ testimonial.displayOrder }}</span>
                </div>
                <div class="flex gap-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-pencil"
                    @click="router.push(`/admin/contenu/temoignages/${testimonial.id}`)" />
                  <UButton
                    color="error"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-trash-2"
                    @click="confirmDelete(testimonial.id, testimonial.title)" />
                </div>
              </div>
              <p class="text-gray-700 dark:text-gray-300 italic">"{{ testimonial.quote }}"</p>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{{ testimonial.embedUrl }}</code>
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-if="testimonials.length === 0">
        <div class="text-center py-12 text-gray-500">
          <UIcon name="i-lucide-video" class="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p class="text-lg font-medium">Aucun témoignage</p>
          <p class="text-sm mt-2">Commencez par ajouter votre premier témoignage vidéo</p>
        </div>
      </UCard>
    </div>
  </div>
</template>
