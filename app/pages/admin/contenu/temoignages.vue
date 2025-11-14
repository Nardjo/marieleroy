<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const toast = useToast()

  const testimonials = ref<any[]>([])
  const showModal = ref(false)
  const editingId = ref<string | null>(null)

  const form = reactive({
    title: '',
    quote: '',
    embedUrl: '',
    displayOrder: 0,
  })

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

  const openCreateModal = () => {
    editingId.value = null
    form.title = ''
    form.quote = ''
    form.embedUrl = ''
    form.displayOrder = testimonials.value.length
    showModal.value = true
  }

  const openEditModal = (testimonial: any) => {
    editingId.value = testimonial.id
    form.title = testimonial.title
    form.quote = testimonial.quote
    form.embedUrl = testimonial.embedUrl
    form.displayOrder = testimonial.displayOrder
    showModal.value = true
  }

  const saveTestimonial = async () => {
    try {
      if (editingId.value) {
        await updateTestimonial(editingId.value, form)
        toast.add({
          title: 'Témoignage modifié',
          description: 'Le témoignage a été mis à jour avec succès',
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
      } else {
        await createTestimonial(form)
        toast.add({
          title: 'Témoignage créé',
          description: 'Le témoignage a été ajouté avec succès',
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
      }
      showModal.value = false
      await loadTestimonials()
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder le témoignage',
        color: 'error',
        duration: 5000,
      })
    }
  }

  const confirmDelete = async (id: string, title: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le témoignage "${title}" ?`)) {
      try {
        await deleteTestimonial(id)
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
        <UButton color="primary" size="lg" icon="i-lucide-plus" @click="openCreateModal">
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
            <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
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
                  <h3 class="text-xl font-bold text-gray-900">{{ testimonial.title }}</h3>
                  <span class="text-sm text-gray-500">Ordre: {{ testimonial.displayOrder }}</span>
                </div>
                <div class="flex gap-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-pencil"
                    @click="openEditModal(testimonial)" />
                  <UButton
                    color="error"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-trash-2"
                    @click="confirmDelete(testimonial.id, testimonial.title)" />
                </div>
              </div>
              <p class="text-gray-700 italic">"{{ testimonial.quote }}"</p>
            </div>
            <div class="mt-4 text-sm text-gray-500">
              <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ testimonial.embedUrl }}</code>
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

    <!-- Modal -->
    <UModal v-model="showModal" :ui="{ width: 'max-w-3xl' }">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ editingId ? 'Modifier le témoignage' : 'Nouveau témoignage' }}
          </h3>
        </template>

        <div class="space-y-4">
          <UFormField label="Titre / Nom du client" required>
            <UInput v-model="form.title" size="lg" placeholder="Ex: Marie, Jessica..." />
          </UFormField>

          <UFormField label="Citation / Témoignage" required>
            <UTextarea v-model="form.quote" :rows="4" placeholder="Le témoignage du client..." />
          </UFormField>

          <UFormField label="URL d'embed YouTube" required>
            <UInput
              v-model="form.embedUrl"
              size="lg"
              placeholder="Ex: https://youtube.com/embed/xxxxx"
              type="url" />
            <template #help>
              <p class="text-sm text-gray-500 mt-1">
                Utilisez l'URL d'embed YouTube (format: https://youtube.com/embed/VIDEO_ID)
              </p>
            </template>
          </UFormField>

          <UFormField label="Ordre d'affichage" required>
            <UInput v-model.number="form.displayOrder" type="number" size="lg" />
            <template #help>
              <p class="text-sm text-gray-500 mt-1">Les témoignages sont triés par ordre croissant</p>
            </template>
          </UFormField>

          <!-- Preview -->
          <div v-if="form.embedUrl" class="border-t pt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Aperçu de la vidéo :</p>
            <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                :src="form.embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="ghost" @click="showModal = false"> Annuler </UButton>
            <UButton
              color="primary"
              :loading="loading"
              :disabled="!form.title || !form.quote || !form.embedUrl"
              @click="saveTestimonial">
              {{ editingId ? 'Modifier' : 'Créer' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
