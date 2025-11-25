<script setup lang="ts">
  import draggable from 'vuedraggable'

  useHead({
    title: 'Témoignages',
  })

  definePageMeta({
    layout: 'admin',
  })

  const router = useRouter()
  const { loading, fetchTestimonials, deleteTestimonial, fetchHeader, updateHeader, reorderTestimonials } =
    useTestimonials()
  const { refreshTestimonials } = useRefreshPublicData()
  const toast = useToast()

  const testimonials = ref<any[]>([])
  const isDragging = ref(false)
  const headerForm = reactive({
    title: '',
    subtitle: '',
    description: '',
  })

  // Tabs
  const route = useRoute()
  const tabs = [
    { label: 'En-tête', value: 'header', icon: 'i-lucide-heading' },
    { label: 'Témoignages', value: 'testimonials', icon: 'i-lucide-video' },
  ]
  const activeTab = ref((route.query.tab as string) || 'header')

  // Sync tab with URL
  watch(activeTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

  // Pagination
  const page = ref(1)
  const pageSize = 10

  const paginatedTestimonials = computed(() => {
    const start = (page.value - 1) * pageSize
    const end = start + pageSize
    return testimonials.value.slice(start, end)
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

  const editTestimonial = (id: string) => {
    router.push(`/admin/contenu/temoignages/${id}`)
  }

  // Gestion du drag & drop pour réordonner
  const onDragStart = () => {
    isDragging.value = true
  }

  const onDragEnd = async () => {
    isDragging.value = false

    // Sauvegarder l'ordre après un drag
    const reorderedTestimonials = testimonials.value.map((testimonial, index) => ({
      id: testimonial.id,
      displayOrder: index + 1,
    }))

    try {
      await reorderTestimonials(reorderedTestimonials)
      await refreshTestimonials()
      toast.add({
        title: 'Ordre mis à jour',
        description: "L'ordre des témoignages a été sauvegardé",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 2000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: "Impossible de sauvegarder l'ordre",
        color: 'error',
        duration: 3000,
      })
      await loadTestimonials() // Recharger l'ordre original
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
        <UButton
          v-if="activeTab === 'header'"
          color="primary"
          size="lg"
          icon="i-lucide-save"
          :loading="loading"
          @click="saveHeader">
          Enregistrer
        </UButton>
        <UButton
          v-else
          color="neutral"
          size="lg"
          icon="i-lucide-plus"
          @click="router.push('/admin/contenu/temoignages/ajouter')">
          Ajouter un témoignage
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
    </template>

    <!-- Content with Tabs -->
    <template v-else>
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- Header Tab -->
          <div v-if="item.value === 'header'" class="space-y-6 pt-6">
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

            <!-- Bouton Enregistrer en bas (desktop seulement) -->
            <div class="hidden md:flex justify-end pt-6 pb-6">
              <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
                Enregistrer
              </UButton>
            </div>
          </div>

          <!-- Testimonials Tab -->
          <div v-else-if="item.value === 'testimonials'" class="space-y-6 pt-6">
            <!-- Testimonials Table with Drag & Drop -->
            <UCard v-if="testimonials.length > 0">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="w-12 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"></th>
                      <th class="w-16 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ordre</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Titre</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Citation</th>
                      <th class="w-24 px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <draggable
                    v-model="testimonials"
                    tag="tbody"
                    item-key="id"
                    handle=".drag-handle"
                    animation="200"
                    @start="onDragStart"
                    @end="onDragEnd">
                    <template #item="{ element: testimonial, index }">
                      <tr
                        class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        :class="{ 'opacity-50': isDragging }">
                        <td class="px-4 py-3">
                          <UIcon
                            name="i-lucide-grip-vertical"
                            class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                        </td>
                        <td class="px-4 py-3">
                          <span class="font-medium text-gray-900 dark:text-white">{{ index + 1 }}</span>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex flex-col">
                            <span class="font-semibold text-gray-900 dark:text-white">{{ testimonial.title }}</span>
                            <span v-if="testimonial.subtitle" class="text-sm text-gray-500">{{ testimonial.subtitle }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <p class="text-gray-600 dark:text-gray-400 italic line-clamp-2 max-w-md">
                            "{{ testimonial.quote }}"
                          </p>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center justify-end gap-2">
                            <UButton
                              color="neutral"
                              variant="ghost"
                              size="sm"
                              class="cursor-pointer"
                              icon="i-lucide-pencil"
                              @click="editTestimonial(testimonial.id)" />
                            <UButton
                              color="error"
                              variant="ghost"
                              size="sm"
                              class="cursor-pointer"
                              icon="i-lucide-trash-2"
                              @click="confirmDelete(testimonial.id, testimonial.title)" />
                          </div>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="testimonials.length > pageSize" class="flex justify-between items-center mt-4 px-4 pb-4">
                <p class="text-sm text-gray-500">
                  {{ (page - 1) * pageSize + 1 }} - {{ Math.min(page * pageSize, testimonials.length) }} sur {{ testimonials.length }}
                </p>
                <UPagination v-model:page="page" :total="testimonials.length" :items-per-page="pageSize" />
              </div>
            </UCard>

            <!-- Empty State -->
            <AdminEmptyState
              v-else
              icon="i-lucide-video"
              title="Aucun témoignage"
              description="Commencez par ajouter votre premier témoignage vidéo"
              button-label="Ajouter un témoignage"
              button-icon="i-lucide-plus"
              @action="router.push('/admin/contenu/temoignages/ajouter')" />
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
