<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, error, fetchTestimonials, deleteTestimonial } = useTestimonials()
  const toast = useToast()

  const testimonials = ref([])

  // Charger les témoignages
  const loadTestimonials = async () => {
    try {
      testimonials.value = await fetchTestimonials()
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err)
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger les témoignages',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadTestimonials()
  })

  const addTestimonial = () => {
    navigateTo('/admin/contenu/temoignages/ajouter')
  }

  const editTestimonial = (testimonial: any) => {
    navigateTo(`/admin/contenu/temoignages/${testimonial.id}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return

    try {
      await deleteTestimonial(id)
      toast.add({
        title: 'Témoignage supprimé',
        description: 'Le témoignage a été supprimé définitivement',
        color: 'success',
        icon: 'i-lucide-trash-2',
        duration: 3000,
      })
      await loadTestimonials() // Recharger la liste
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast.add({
        title: 'Erreur de suppression',
        description: error?.data?.message || 'Impossible de supprimer le témoignage',
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
    <AdminPageHeader title="Témoignages" description="Gérer les témoignages vidéo de vos clients">
      <template #actions>
        <UButton color="primary" size="lg" icon="i-lucide-plus" @click="addTestimonial">Ajouter un témoignage</UButton>
      </template>
    </AdminPageHeader>

    <!-- Testimonials List -->
    <div class="grid grid-cols-1 gap-6">
      <UCard v-for="testimonial in testimonials" :key="testimonial.id" class="shadow-sm">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Video Preview -->
          <div class="md:w-80 aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              :src="testimonial.embedUrl"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>

          <!-- Content -->
          <div class="flex-1 space-y-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{ testimonial.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mt-2 italic">"{{ testimonial.quote }}"</p>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <AdminCrudActions
                @edit="editTestimonial(testimonial)"
                @delete="handleDelete(testimonial.id)"
                confirm-message="Êtes-vous sûr de vouloir supprimer ce témoignage ?" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <AdminEmptyState
        v-if="testimonials.length === 0 && !loading"
        icon="i-lucide-message-circle"
        title="Aucun témoignage"
        description="Commencez par ajouter votre premier témoignage"
        button-label="Ajouter un témoignage"
        button-icon="i-lucide-plus"
        @action="addTestimonial" />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
    </div>
  </div>
</template>
