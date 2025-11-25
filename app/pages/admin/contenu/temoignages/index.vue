<script setup lang="ts">
  useHead({
    title: 'Témoignages',
  })

  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const { loading, fetchTestimonials, deleteTestimonial, fetchHeader, updateHeader } = useTestimonials()
  const { refreshTestimonials } = useRefreshPublicData()
  const toast = useToast()

  const testimonials = ref<any[]>([])
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
      await refreshTestimonials()
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
    loadHeader()
    loadTestimonials()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Témoignages" description="Gérer l'en-tête et les témoignages vidéo">
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
          <div v-for="i in 4" :key="i">
            <USkeleton class="h-4 w-24 mb-2" />
            <USkeleton class="h-10 w-full" />
          </div>
        </div>
      </UCard>
      <AdminSkeletonForm :fields="3" />
    </template>

    <!-- Content -->
    <template v-else>
      <!-- Header Form -->
      <UCard>
        <div class="space-y-6">
          <UFormField label="Titre principal" required>
            <UInput v-model="headerForm.title" size="lg" placeholder="Ex: Ce que disent mes clients," />
          </UFormField>

          <UFormField label="Sous-titre" description="Optionnel - Affiché sous le titre principal">
            <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: leurs résultats" />
          </UFormField>

          <UFormField label="Description" description="Optionnel - Texte d'introduction">
            <AdminRichTextEditor
              v-model="headerForm.description"
              placeholder="Décrivez la section témoignages..."
              min-height="120px" />
          </UFormField>
        </div>
      </UCard>

      <!-- Testimonials List Section -->
      <div class="space-y-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Les témoignages</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Gérez vos témoignages vidéo
            </p>
          </div>
          <UButton color="neutral" size="lg" icon="i-lucide-plus" class="w-full sm:w-auto" @click="router.push('/admin/contenu/temoignages/ajouter')">
            Ajouter un témoignage
          </UButton>
        </div>
      </div>

      <!-- Testimonials List -->
      <div class="grid grid-cols-1 gap-6">
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

      <!-- Bouton Enregistrer en bas (desktop seulement) -->
      <div class="hidden md:flex justify-end pt-6 pb-6">
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
          Enregistrer
        </UButton>
      </div>
    </template>
  </div>
</template>
