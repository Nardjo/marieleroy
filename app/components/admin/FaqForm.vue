<script setup lang="ts">
  interface FaqItem {
    id: number | null
    question: string
    answer: string
    order: number
  }

  interface Props {
    faqItem: FaqItem
    loading?: boolean
  }

  interface Emits {
    (e: 'update:faqItem', value: FaqItem): void
    (e: 'save'): void
    (e: 'cancel'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const emit = defineEmits<Emits>()

  const localForm = computed({
    get: () => props.faqItem,
    set: value => emit('update:faqItem', value),
  })

  const updateField = (field: keyof FaqItem, value: any) => {
    emit('update:faqItem', { ...props.faqItem, [field]: value })
  }
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <div class="space-y-4">
        <UFormField label="Question" required>
          <UInput
            :model-value="localForm.question"
            @update:model-value="updateField('question', $event)"
            size="lg"
            placeholder="Quelle est votre question ?" />
        </UFormField>

        <UFormField label="Réponse" required>
          <UTextarea
            :model-value="localForm.answer"
            @update:model-value="updateField('answer', $event)"
            :rows="6"
            placeholder="La réponse à cette question..." />
        </UFormField>

        <UFormField label="Ordre d'affichage" required>
          <UInput
            :model-value="localForm.order"
            @update:model-value="updateField('order', Number($event))"
            type="number"
            size="lg"
            placeholder="1" />
          <template #hint>
            <span class="text-xs text-gray-500">Position de la question dans la liste (1 = première)</span>
          </template>
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
