<script setup lang="ts">
  interface Props {
    modelValue: string | null | undefined
    label?: string
    name?: string
    required?: boolean
    accept?: string
    maxSize?: number
    endpoint?: string
    placeholder?: string
    error?: string | boolean
    hint?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Vidéo',
    name: 'video',
    required: false,
    accept: 'video/*',
    maxSize: 50 * 1024 * 1024, // 50MB
    endpoint: '/api/upload/video',
    placeholder: 'https://exemple.com/video.mp4',
    error: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    'delete': []
  }>()

  const { isUploading, uploadVideo } = useVideoUpload()

  // Garder l'ancienne valeur pendant l'upload pour éviter les erreurs de validation
  const previousValue = ref<string | null>(null)

  const onFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement

    if (!target || !target.files || target.files.length === 0) {
      return
    }

    const file = target.files[0]

    if (file) {
      try {
        // Sauvegarder l'ancienne valeur avant l'upload
        previousValue.value = props.modelValue || null

        const response = await uploadVideo(file, props.endpoint)
        if (response && response.url) {
          emit('update:modelValue', response.url)
          previousValue.value = null // Reset après succès
          useToast().add({
            title: 'Vidéo uploadée',
            description: "La vidéo a été uploadée avec succès",
            color: 'success',
            icon: 'i-lucide-check',
          })
        }
      } catch (error: any) {
        console.error('Erreur upload vidéo:', error)
        // Restaurer l'ancienne valeur en cas d'erreur
        if (previousValue.value) {
          emit('update:modelValue', previousValue.value)
        }
        previousValue.value = null
        useToast().add({
          title: "Erreur d'upload",
          description: error.message || "Erreur lors de l'upload de la vidéo",
          color: 'error',
          icon: 'i-lucide-alert-circle',
        })
      }
    }
  }

  const removeVideo = async () => {
    if (!props.modelValue) {
      return
    }

    try {
      // Appeler l'endpoint de suppression
      await $fetch('/api/upload/delete', {
        method: 'POST',
        body: { url: props.modelValue },
      })

      // Vider le champ après suppression réussie
      emit('update:modelValue', null)
      emit('delete')

      useToast().add({
        title: 'Vidéo supprimée',
        description: 'La vidéo a été supprimée avec succès',
        color: 'success',
        icon: 'i-lucide-check',
      })
    } catch (error: any) {
      console.error('Erreur suppression vidéo:', error)
      useToast().add({
        title: 'Erreur de suppression',
        description: error.message || 'Impossible de supprimer la vidéo',
        color: 'error',
        icon: 'i-lucide-alert-circle',
      })
    }
  }
</script>

<template>
  <UFormField :label="label" :name="name" :error="error" class="w-full">
    <div class="space-y-3">
      <div
        v-if="!modelValue"
        class="flex items-center gap-3 p-3 border rounded-lg transition-colors duration-200"
        :class="
          error
            ? 'border-red-500 dark:border-red-400 ring-1 ring-red-500/20 dark:ring-red-400/20 bg-red-50 dark:bg-red-900/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'
        ">
        <div class="flex-1">
          <UInput
            :id="`file-upload-${name}`"
            type="file"
            :accept="accept"
            :disabled="isUploading"
            class="hidden"
            @change="onFileChange" />
          <label
            :for="`file-upload-${name}`"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': isUploading }">
            <UIcon name="i-lucide-video" class="w-4 h-4" :class="error ? 'text-red-500' : 'text-gray-500'" />
            <span :class="error ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
              {{ isUploading ? 'Upload en cours...' : 'Choisir une vidéo' }}
            </span>
          </label>
          <p v-if="error && !modelValue" class="text-xs text-red-500 mt-1">
            {{ typeof error === 'string' ? error : 'Ce champ est requis' }}
          </p>
        </div>
      </div>

      <div
        v-if="modelValue"
        class="flex flex-col gap-3 p-3 border rounded-lg"
        :class="
          error
            ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10'
            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
        ">
        <!-- Video Preview -->
        <div class="aspect-video rounded-lg overflow-hidden bg-black">
          <video :key="modelValue" :src="modelValue" controls class="w-full h-full">
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Vidéo sélectionnée</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ modelValue }}</p>
          </div>
          <UButton color="error" variant="soft" size="sm" @click="removeVideo">
            <UIcon name="i-lucide-trash" class="w-4 h-4 mr-1" />
            Supprimer
          </UButton>
        </div>
      </div>
    </div>
    <template v-if="hint" #help>
      <p class="text-sm text-gray-500 mt-1">{{ hint }}</p>
    </template>
  </UFormField>
</template>
