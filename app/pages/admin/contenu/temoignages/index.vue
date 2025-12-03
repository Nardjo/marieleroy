<script setup lang="ts">
  import { useSortable } from '@vueuse/integrations/useSortable'

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
  const headerForm = reactive({
    title: '',
    subtitle: '',
    description: '',
    ctaTitle: '',
    ctaDescription: '',
    ctaButtonText: '',
    ctaButtonUrl: '',
    ctaUseDefaultUrl: true,
    ctaUseEmail: false,
    ctaEmailSubject: '',
  })

  // CTA link type for radio buttons
  const ctaLinkType = computed({
    get: () => {
      if (headerForm.ctaUseEmail) return 'email'
      if (headerForm.ctaUseDefaultUrl) return 'default'
      return 'custom'
    },
    set: (value: string) => {
      headerForm.ctaUseDefaultUrl = value === 'default'
      headerForm.ctaUseEmail = value === 'email'
    },
  })

  // Tabs
  const route = useRoute()
  const tabs = [
    { label: 'En-tête', value: 'header', icon: 'i-lucide-heading' },
    { label: 'Témoignages', value: 'testimonials', icon: 'i-lucide-video' },
    { label: 'CTA', value: 'cta', icon: 'i-lucide-mouse-pointer-click' },
  ]
  const activeTab = ref((route.query.tab as string) || 'header')

  // Sync tab with URL
  watch(activeTab, newTab => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

  // Table columns
  const columns = [
    { id: 'order', header: 'Ordre' },
    { id: 'title', header: 'Titre' },
    { id: 'quote', header: 'Citation' },
    { id: 'actions', header: 'Actions' },
  ]

  // Drag and drop
  let currentTbody: HTMLElement | null = null
  let sortableInstance: ReturnType<typeof useSortable> | null = null

  const initSortable = () => {
    if (activeTab.value !== 'testimonials' || testimonials.value.length === 0) return

    const tbody = document.querySelector('.testimonials-tbody') as HTMLElement | null
    if (!tbody) return

    if (tbody !== currentTbody) {
      if (sortableInstance) {
        sortableInstance.stop()
      }

      currentTbody = tbody
      // Ne pas passer testimonials pour éviter les conflits de réactivité Vue
      sortableInstance = useSortable(tbody, [], {
        animation: 150,
        onEnd: (evt: any) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            // Réordonner manuellement le tableau
            const items = [...testimonials.value]
            const [moved] = items.splice(oldIndex, 1)
            items.splice(newIndex, 0, moved)
            testimonials.value = items

            saveOrder()
          }
        },
      })
    }
  }

  watch([activeTab, () => testimonials.value.length], () => {
    nextTick(() => setTimeout(initSortable, 50))
  }, { immediate: true })

  onUpdated(() => {
    if (activeTab.value === 'testimonials' && testimonials.value.length > 0) {
      nextTick(initSortable)
    }
  })

  onUnmounted(() => {
    if (sortableInstance) {
      sortableInstance.stop()
    }
  })

  const loadHeader = async () => {
    try {
      const header = await fetchHeader()
      Object.assign(headerForm, {
        title: header.title || '',
        subtitle: header.subtitle || '',
        description: header.description || '',
        ctaTitle: header.ctaTitle || '',
        ctaDescription: header.ctaDescription || '',
        ctaButtonText: header.ctaButtonText || '',
        ctaButtonUrl: header.ctaButtonUrl || '',
        ctaUseDefaultUrl: header.ctaUseDefaultUrl ?? true,
        ctaUseEmail: header.ctaUseEmail ?? false,
        ctaEmailSubject: header.ctaEmailSubject || '',
      })
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

  // Sauvegarder l'ordre après un drag
  const saveOrder = async () => {
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
      await loadTestimonials()
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
          v-if="activeTab === 'header' || activeTab === 'cta'"
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

                <UFormField label="Sous-titre">
                  <UInput v-model="headerForm.subtitle" size="lg" placeholder="Ex: leurs résultats" />
                </UFormField>

                <UFormField label="Description">
                  <AdminRichTextEditor
                    v-model="headerForm.description"
                    placeholder="Décrivez la section témoignages..."
                    min-height="120px" />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Testimonials Tab -->
          <div v-else-if="item.value === 'testimonials'" class="space-y-6 pt-6">
            <!-- Testimonials Table with Drag & Drop -->
            <UCard v-if="testimonials.length > 0">
              <UTable :data="testimonials" :columns="columns" :ui="{ tbody: 'testimonials-tbody' }">
                <template #order-cell="{ row }">
                  <span class="font-medium text-gray-900 dark:text-white">{{ testimonials.indexOf(row.original) + 1 }}</span>
                </template>

                <template #title-cell="{ row }">
                  <div class="flex flex-col">
                    <span class="font-semibold text-gray-900 dark:text-white">{{ row.original.title }}</span>
                    <span v-if="row.original.subtitle" class="text-sm text-gray-500">{{ row.original.subtitle }}</span>
                  </div>
                </template>

                <template #quote-cell="{ row }">
                  <p class="text-gray-600 dark:text-gray-400 italic line-clamp-2 max-w-md">
                    "{{ row.original.quote }}"
                  </p>
                </template>

                <template #actions-cell="{ row }">
                  <div class="flex items-center justify-end gap-2">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      class="cursor-pointer"
                      icon="i-lucide-pencil"
                      @click="editTestimonial(row.original.id)" />
                    <UButton
                      color="error"
                      variant="ghost"
                      size="sm"
                      class="cursor-pointer"
                      icon="i-lucide-trash-2"
                      @click="confirmDelete(row.original.id, row.original.title)" />
                  </div>
                </template>
              </UTable>
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

          <!-- CTA Tab -->
          <div v-else-if="item.value === 'cta'" class="space-y-6 pt-6">
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Call to Action</h3>
              </template>
              <div class="space-y-4">
                <UFormField label="Titre du CTA">
                  <UInput v-model="headerForm.ctaTitle" size="lg" placeholder="Tu veux faire passer ton business au niveau supérieur ?" />
                </UFormField>

                <UFormField label="Description du CTA">
                  <UInput v-model="headerForm.ctaDescription" size="lg" placeholder="Parle-moi de ton projet..." />
                </UFormField>

                <UFormField label="Texte du bouton">
                  <UInput v-model="headerForm.ctaButtonText" size="lg" placeholder="Réserve ton appel offert" />
                </UFormField>

                <UFormField label="Type de lien">
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="option in [
                        { label: 'CTA par défaut', value: 'default', icon: 'i-lucide-link' },
                        { label: 'Email', value: 'email', icon: 'i-lucide-mail' },
                        { label: 'URL personnalisée', value: 'custom', icon: 'i-lucide-external-link' },
                      ]"
                      :key="option.value"
                      type="button"
                      class="flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left"
                      :class="ctaLinkType === option.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
                      @click="ctaLinkType = option.value">
                      <Icon :name="option.icon" class="w-4 h-4 shrink-0" :class="ctaLinkType === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'" />
                      <span class="text-sm font-medium" :class="ctaLinkType === option.value ? 'text-primary-700 dark:text-white' : 'text-gray-600 dark:text-gray-400'">{{ option.label }}</span>
                    </button>
                  </div>
                </UFormField>

                <UFormField v-if="ctaLinkType === 'email'" label="Objet du mail" hint="Objet pré-rempli dans le mail">
                  <UInput v-model="headerForm.ctaEmailSubject" size="lg" placeholder="Question pour Marie Leroy" />
                </UFormField>

                <UFormField v-if="ctaLinkType === 'custom'" label="URL personnalisée">
                  <UInput v-model="headerForm.ctaButtonUrl" size="lg" placeholder="https://..." />
                </UFormField>
              </div>
            </UCard>
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
