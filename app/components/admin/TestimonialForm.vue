<script setup lang="ts">
  interface Testimonial {
    id?: string
    title: string
    quote: string
    embedUrl: string
    displayOrder: number
  }

  interface Props {
    testimonial: Testimonial
    loading?: boolean
  }

  interface Emits {
    (e: 'update:testimonial', value: Testimonial): void
    (e: 'save'): void
    (e: 'cancel'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const emit = defineEmits<Emits>()

  const localForm = computed({
    get: () => props.testimonial,
    set: value => emit('update:testimonial', value),
  })

  const updateField = (field: keyof Testimonial, value: any) => {
    emit('update:testimonial', { ...props.testimonial, [field]: value })
  }
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 space-y-6">
      <UCard>
        <div class="space-y-4">
          <UFormField label="Nom du client" required>
            <UInput
              :model-value="localForm.title"
              @update:model-value="updateField('title', $event)"
              size="lg"
              placeholder="Marie" />
          </UFormField>

          <UFormField label="Citation" required>
            <UTextarea
              :model-value="localForm.quote"
              @update:model-value="updateField('quote', $event)"
              :rows="4"
              placeholder="Une phrase clé du témoignage..." />
          </UFormField>

          <UFormField label="URL d'embed YouTube" required>
            <UInput
              :model-value="localForm.embedUrl"
              @update:model-value="updateField('embedUrl', $event)"
              size="lg"
              placeholder="https://www.youtube.com/embed/..." />
            <template #hint>
              <span class="text-xs text-gray-500">Utilisez le format: https://www.youtube.com/embed/VIDEO_ID</span>
            </template>
          </UFormField>

          <UFormField label="Ordre d'affichage" required>
            <UInput
              :model-value="localForm.displayOrder"
              @update:model-value="updateField('displayOrder', Number($event))"
              type="number"
              size="lg"
              placeholder="1" />
            <template #hint>
              <span class="text-xs text-gray-500">Position du témoignage dans la liste (1 = premier)</span>
            </template>
          </UFormField>
        </div>
      </UCard>
    </div>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Aperçu vidéo</h3>
        </template>
        <div
          v-if="localForm.embedUrl && localForm.embedUrl !== 'https://www.youtube.com/embed/'"
          class="aspect-video rounded-lg overflow-hidden bg-gray-100">
          <iframe
            :src="localForm.embedUrl"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
        <div v-else class="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
          <UIcon name="i-lucide-video" class="w-12 h-12 text-gray-400" />
        </div>
      </UCard>
    </div>
  </div>
</template>
