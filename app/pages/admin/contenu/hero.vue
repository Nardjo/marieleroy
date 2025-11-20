<script setup lang="ts">
  import draggable from 'vuedraggable'

  useHead({
    title: 'Hero',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchHero, updateHero } = useHero()
  const toast = useToast()

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
    avatars: [] as Avatar[],
  })

  const loadHero = async () => {
    try {
      const data = await fetchHero()
      Object.assign(form, data)
      // Convert null to empty string/array for inputs
      if (form.videoUrl === null) {
        form.videoUrl = ''
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
      const filteredAvatars = form.avatars.filter(
        avatar => avatar.firstName?.trim() && avatar.lastName?.trim() && avatar.subtitle?.trim(),
      )

      const payload = {
        subtitle: form.subtitle,
        description: form.description,
        videoUrl:
          form.videoUrl && typeof form.videoUrl === 'string' && form.videoUrl.trim() !== '' ? form.videoUrl : null,
        avatars: filteredAvatars,
      }

      await updateHero(payload)
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
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <AdminSkeletonForm v-if="loading" :fields="5" />

    <div v-else class="space-y-6">
      <UCard>
        <div class="space-y-4">
          <!-- Video Upload Field -->
          <AdminVideoUploadField
            v-model="form.videoUrl"
            label="Vidéo Hero"
            name="videoUrl"
            required
            hint="Formats acceptés: MP4, WebM, OGG, MOV. Taille maximale: 50MB" />

          <UFormField label="Sous-titre" required>
            <UInput v-model="form.subtitle" size="lg" placeholder="Ex: Copywriter Professionnelle" />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea v-model="form.description" :rows="4" placeholder="Phrase d'accroche..." />
          </UFormField>
        </div>
      </UCard>

      <!-- Avatars Section -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Avatars clients</h3>
            <UButton color="neutral" size="sm" icon="i-lucide-plus" @click="addAvatar">Ajouter un avatar</UButton>
          </div>
        </template>
        <div class="space-y-4">
          <draggable
            v-if="form.avatars.length > 0"
            v-model="form.avatars"
            item-key="index"
            class="space-y-6"
            handle=".drag-handle"
            :animation="200">
            <template #item="{ element: avatar, index }">
              <UCard class="!bg-gray-200 dark:!bg-gray-950">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Icon name="i-lucide-grip-vertical" class="w-5 h-5" />
                      </div>
                      <h4 class="font-medium">Avatar {{ index + 1 }}</h4>
                    </div>
                    <UButton color="error" variant="soft" size="sm" icon="i-lucide-trash" @click="removeAvatar(index)">
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

          <div v-else class="text-center py-8 text-gray-500">
            Aucun avatar ajouté. Cliquez sur "Ajouter un avatar" pour commencer.
          </div>

          <!-- Bouton en bas de la liste -->
          <div class="flex justify-end pt-4">
            <UButton color="neutral" size="lg" icon="i-lucide-plus" @click="addAvatar">Ajouter un avatar</UButton>
          </div>
        </div>
      </UCard>

      <!-- Bouton Enregistrer en bas (desktop seulement) -->
      <div class="hidden md:flex justify-end pt-6 pb-6">
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveContent">
          Enregistrer
        </UButton>
      </div>
    </div>
  </div>
</template>
