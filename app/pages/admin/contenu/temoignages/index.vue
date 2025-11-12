<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, saved, showSuccess } = useAdminCrud()

  const testimonials = ref([
    {
      id: 1,
      title: 'Marie',
      quote: "Grâce à Marie, j'ai pu transformer ma communication et atteindre mes objectifs de manière efficace.",
      embedUrl: 'https://www.youtube.com/embed/KJNbhiD9YLg',
      order: 1,
    },
    {
      id: 2,
      title: 'Jessica',
      quote:
        'Un travail exceptionnel qui a dépassé toutes mes attentes. Ma marque a pris une toute nouvelle dimension.',
      embedUrl: 'https://www.youtube.com/embed/3enzfMLVIbo',
      order: 2,
    },
    {
      id: 3,
      title: 'Lilie',
      quote: "Marie a su capter l'essence de mon message et créer un contenu qui résonne vraiment avec mon audience.",
      embedUrl: 'https://www.youtube.com/embed/3Ah-CkKIKx8',
      order: 3,
    },
  ])

  const addTestimonial = () => {
    navigateTo('/admin/contenu/temoignages/ajouter')
  }

  const editTestimonial = (testimonial: any) => {
    navigateTo(`/admin/contenu/temoignages/${testimonial.id}`)
  }

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return

    try {
      // TODO: API call to delete testimonial
      await new Promise(resolve => setTimeout(resolve, 500))
      testimonials.value = testimonials.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Error deleting testimonial:', error)
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

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="Le témoignage a été mis à jour avec succès" />

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
                @delete="deleteTestimonial(testimonial.id)"
                confirm-message="Êtes-vous sûr de vouloir supprimer ce témoignage ?" />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <AdminEmptyState
        v-if="testimonials.length === 0"
        icon="i-lucide-message-circle"
        title="Aucun témoignage"
        description="Commencez par ajouter votre premier témoignage"
        button-label="Ajouter un témoignage"
        button-icon="i-lucide-plus"
        @action="addTestimonial" />
    </div>
  </div>
</template>
