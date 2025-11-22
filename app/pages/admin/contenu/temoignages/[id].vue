<script setup lang="ts">
  useHead({
    title: 'Modifier le témoignage',
  })

  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const { loading, fetchTestimonials, createTestimonial, updateTestimonial } = useTestimonials()
  const { refreshTestimonials } = useRefreshPublicData()
  const toast = useToast()

  const isNew = computed(() => route.params.id === 'nouveau')
  const testimonialId = computed(() => (isNew.value ? null : (route.params.id as string)))

  const form = reactive({
    title: '',
    quote: '',
    embedUrl: '',
    displayOrder: 0,
  })

  const loadTestimonial = async () => {
    if (isNew.value) {
      // For new testimonials, set displayOrder to the count of existing testimonials
      form.embedUrl = 'https://www.youtube.com/embed/'
      try {
        const testimonials = await fetchTestimonials()
        form.displayOrder = testimonials.length
      } catch (err) {
        form.displayOrder = 0
      }
      return
    }

    try {
      const testimonials = await fetchTestimonials()
      const testimonial = testimonials.find((t: any) => t.id === testimonialId.value)

      if (!testimonial) {
        toast.add({
          title: 'Témoignage introuvable',
          description: "Ce témoignage n'existe pas",
          color: 'error',
          icon: 'i-lucide-alert-circle',
          duration: 5000,
        })
        router.push('/admin/contenu/temoignages')
        return
      }

      Object.assign(form, testimonial)
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger le témoignage',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveTestimonial = async () => {
    try {
      if (isNew.value) {
        await createTestimonial(form)
        // Invalidate public testimonials cache to show updated data
        await refreshTestimonials()
        toast.add({
          title: 'Témoignage créé',
          description: 'Le témoignage a été ajouté avec succès',
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
      } else {
        await updateTestimonial(testimonialId.value!, form)
        // Invalidate public testimonials cache to show updated data
        await refreshTestimonials()
        toast.add({
          title: 'Témoignage modifié',
          description: 'Le témoignage a été mis à jour avec succès',
          color: 'success',
          icon: 'i-lucide-check',
          duration: 3000,
        })
      }
      router.push('/admin/contenu/temoignages')
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder le témoignage',
        color: 'error',
        duration: 5000,
      })
    }
  }

  onMounted(() => {
    loadTestimonial()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader
      :title="isNew ? 'Nouveau témoignage' : 'Modifier le témoignage'"
      :description="isNew ? 'Ajouter un nouveau témoignage vidéo' : 'Modifier un témoignage existant'">
      <template #actions>
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          @click="router.push('/admin/contenu/temoignages')">
          Retour
        </UButton>
        <UButton
          color="primary"
          size="lg"
          icon="i-lucide-save"
          :loading="loading"
          :disabled="!form.title || !form.quote || !form.embedUrl"
          @click="saveTestimonial">
          {{ isNew ? 'Créer' : 'Enregistrer' }}
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading && !isNew" :fields="4" />

    <div v-else>
      <UCard>
        <div class="space-y-6">
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
              placeholder="Ex: https://www.youtube.com/embed/xxxxx"
              type="url" />
            <template #help>
              <p class="text-sm text-gray-500 mt-1">
                Utilisez l'URL d'embed YouTube (format: https://www.youtube.com/embed/VIDEO_ID)
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
          <div v-if="form.embedUrl && form.embedUrl !== 'https://www.youtube.com/embed/'" class="border-t pt-6">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Aperçu de la vidéo :</p>
            <div class="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <iframe
                :src="form.embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
