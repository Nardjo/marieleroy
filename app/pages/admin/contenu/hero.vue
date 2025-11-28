<script setup lang="ts">
  import draggable from 'vuedraggable'

  useHead({
    title: 'Hero',
  })

  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const { loading, fetchHero, updateHero } = useHero()
  const { refreshHero } = useRefreshPublicData()
  const toast = useToast()

  // Tabs
  const tabs = [
    { label: 'Section Hero', value: 'hero', icon: 'i-lucide-layout' },
    { label: 'Avatars clients', value: 'avatars', icon: 'i-lucide-users' },
  ]
  const activeTab = ref((route.query.tab as string) || 'hero')

  // Sync tab with URL
  watch(activeTab, newTab => {
    router.replace({ query: { ...route.query, tab: newTab } })
  })

  interface Avatar {
    firstName: string
    lastName: string
    subtitle: string
    imageUrl: string | null
  }

  const form = reactive({
    subtitle: '',
    description: '',
    videoUrl: '',
    posterUrl: '' as string | null,
    avatars: [] as Avatar[],
    additionalClientsCount: 0,
  })

  const loadHero = async () => {
    try {
      const data = await fetchHero()
      Object.assign(form, data)
      // Convert null to empty string/array for inputs
      if (form.videoUrl === null) {
        form.videoUrl = ''
      }
      if (form.posterUrl === null) {
        form.posterUrl = ''
      }
      if (!form.avatars) {
        form.avatars = []
      }
    } catch (err: any) {
      toast.add({
        title: 'Erreur de chargement',
        description: err?.message || 'Impossible de charger le Hero',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
    }
  }

  const saveContent = async () => {
    try {
      // Garder uniquement les avatars avec au minimum prénom, nom et sous-titre
      const filteredAvatars = form.avatars
        .filter(avatar => avatar.firstName?.trim() && avatar.lastName?.trim() && avatar.subtitle?.trim())
        .slice(0, 5) // Limiter à 5 avatars maximum

      const payload = {
        subtitle: form.subtitle,
        description: form.description,
        videoUrl:
          form.videoUrl && typeof form.videoUrl === 'string' && form.videoUrl.trim() !== '' ? form.videoUrl : null,
        posterUrl:
          form.posterUrl && typeof form.posterUrl === 'string' && form.posterUrl.trim() !== '' ? form.posterUrl : null,
        avatars: filteredAvatars,
        additionalClientsCount: form.additionalClientsCount,
      }

      await updateHero(payload)
      // Invalidate public hero cache to show updated data
      await refreshHero()
      toast.add({
        title: 'Hero enregistré',
        description: 'La section Hero a été mise à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || 'Impossible de sauvegarder le Hero',
        color: 'error',
        duration: 5000,
      })
    }
  }

  const addAvatar = () => {
    form.avatars.push({
      firstName: '',
      lastName: '',
      subtitle: '',
      imageUrl: null,
    })
  }

  const removeAvatar = async (index: number) => {
    const avatar = form.avatars[index]

    // Si l'URL n'est pas vide, supprimer le fichier
    if (avatar.imageUrl && avatar.imageUrl.trim() !== '') {
      try {
        await $fetch('/api/upload/delete', {
          method: 'POST',
          body: { url: avatar.imageUrl },
        })
      } catch (error) {
        console.error("Erreur lors de la suppression de l'avatar:", error)
      }
    }

    form.avatars.splice(index, 1)
  }

  onMounted(() => {
    loadHero()
  })
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Hero" description="Gérer le contenu de la section Hero (page d'accueil)">
      <template #actions>
        <UButton
          v-if="activeTab === 'avatars'"
          color="neutral"
          size="lg"
          icon="i-lucide-plus"
          :disabled="form.avatars.length >= 5"
          @click="addAvatar">
          Ajouter un avatar
        </UButton>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
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
    </template>

    <!-- Content with Tabs -->
    <template v-else>
      <UTabs v-model="activeTab" :items="tabs" class="w-full">
        <template #content="{ item }">
          <!-- Hero Section Tab -->
          <div v-if="item.value === 'hero'" class="space-y-6 pt-6">
            <UCard>
              <div class="space-y-4">
                <!-- Video Upload Field -->
                <AdminVideoUploadField
                  v-model="form.videoUrl"
                  label="Vidéo Hero"
                  name="videoUrl"
                  required
                  hint="Formats acceptés: MP4, WebM, OGG, MOV. Taille maximale: 50MB" />

                <!-- Poster Upload Field -->
                <AdminImageUploadField
                  v-model="form.posterUrl"
                  label="Image poster (mobile)"
                  name="posterUrl"
                  hint="Image affichée avant le chargement de la vidéo sur mobile (1920x1080px recommandé)" />

                <UFormField label="Sous-titre" required>
                  <UInput v-model="form.subtitle" size="lg" placeholder="Ex: Copywriter Professionnelle" />
                </UFormField>

                <UFormField label="Description" required>
                  <AdminRichTextEditor v-model="form.description" placeholder="Phrase d'accroche..." />
                </UFormField>
              </div>
            </UCard>
          </div>

          <!-- Avatars Tab -->
          <div v-else-if="item.value === 'avatars'" class="space-y-6 pt-6">
            <!-- Empty State -->
            <AdminEmptyState
              v-if="form.avatars.length === 0"
              icon="i-lucide-users"
              title="Aucun avatar"
              description="Ajoutez des avatars clients pour la section Hero"
              button-label="Ajouter un avatar"
              button-icon="i-lucide-plus"
              @action="addAvatar" />

            <!-- Avatar Edit Cards -->
            <draggable
              v-else
              v-model="form.avatars"
              item-key="index"
              class="space-y-4"
              handle=".drag-handle"
              :animation="200">
              <template #item="{ element: avatar, index }">
                <UCard class="!bg-gray-100 dark:!bg-gray-900">
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Icon name="i-lucide-grip-vertical" class="w-5 h-5" />
                        </div>
                        <h4 class="font-medium">Avatar {{ index + 1 }}</h4>
                      </div>
                      <UButton
                        color="error"
                        variant="soft"
                        size="sm"
                        icon="i-lucide-trash"
                        @click="removeAvatar(index)">
                        Supprimer
                      </UButton>
                    </div>
                  </template>
                  <div class="space-y-4">
                    <AdminImageUploadField
                      v-model="form.avatars[index].imageUrl"
                      label="Photo"
                      :name="`avatar-image-${index}`"
                      hint="Format recommandé: 100x100px (image carrée)" />

                    <div class="grid grid-cols-2 gap-4">
                      <UFormField label="Prénom" required>
                        <UInput v-model="form.avatars[index].firstName" placeholder="Marie" />
                      </UFormField>

                      <UFormField label="Nom" required>
                        <UInput v-model="form.avatars[index].lastName" placeholder="Dupont" />
                      </UFormField>
                    </div>

                    <UFormField label="Sous-titre" required>
                      <UInput v-model="form.avatars[index].subtitle" placeholder="Entrepreneure" />
                    </UFormField>
                  </div>
                </UCard>
              </template>
            </draggable>

            <!-- Compteur clients additionnels -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">Nombre de clients additionnels</h3>
              </template>
              <UFormField
                label='Nombre affiché dans le "+X"'
                hint="Ce nombre s'affichera après les avatars (ex: +10 pour afficher '+10')">
                <UInput v-model.number="form.additionalClientsCount" type="number" min="0" size="lg" placeholder="0" />
              </UFormField>
            </UCard>
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>
