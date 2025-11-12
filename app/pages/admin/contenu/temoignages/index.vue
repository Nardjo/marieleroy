<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const loading = ref(false)
  const saved = ref(false)

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
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Témoignages</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Gérer les témoignages vidéo de vos clients</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-plus" @click="addTestimonial">Ajouter un témoignage</UButton>
    </div>

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
              <UButton color="neutral" variant="outline" icon="i-lucide-edit" @click="editTestimonial(testimonial)">
                Modifier
              </UButton>
              <UButton color="error" variant="ghost" icon="i-lucide-trash-2" @click="deleteTestimonial(testimonial.id)">
                Supprimer
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <UCard v-if="testimonials.length === 0" class="shadow-sm">
        <div class="text-center py-12">
          <UIcon name="i-lucide-message-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucun témoignage</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Commencez par ajouter votre premier témoignage</p>
          <UButton color="primary" icon="i-lucide-plus" @click="addTestimonial">Ajouter un témoignage</UButton>
        </div>
      </UCard>
    </div>

    <!-- Edit Modal -->
    <UModal v-model:open="isModalOpen" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <div class="p-6 space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ editingTestimonial?.id ? 'Modifier' : 'Ajouter' }} un témoignage
          </h2>

          <div v-if="editingTestimonial" class="space-y-4">
            <UFormField label="Nom du client" required>
              <UInput v-model="editingTestimonial.title" size="lg" placeholder="Marie" />
            </UFormField>

            <UFormField label="Citation" required>
              <UTextarea v-model="editingTestimonial.quote" :rows="4" placeholder="Une phrase clé du témoignage..." />
            </UFormField>

            <UFormField label="URL d'embed YouTube" required>
              <UInput v-model="editingTestimonial.embedUrl" size="lg" placeholder="https://www.youtube.com/embed/..." />
              <template #hint>
                <span class="text-xs text-gray-500">Utilisez le format: https://www.youtube.com/embed/VIDEO_ID</span>
              </template>
            </UFormField>

            <!-- Preview -->
            <div v-if="editingTestimonial.embedUrl" class="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                :src="editingTestimonial.embedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="outline" @click="closeModal">Annuler</UButton>
            <UButton color="primary" :loading="loading" @click="saveTestimonial">Enregistrer</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
