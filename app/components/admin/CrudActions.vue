<template>
  <div class="flex items-center gap-2">
    <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-edit" @click="$emit('edit')">Modifier</UButton>
    <UButton color="error" variant="ghost" size="sm" icon="i-lucide-trash-2" @click="handleDelete">Supprimer</UButton>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    confirmMessage?: string
  }>()

  const emit = defineEmits<{
    edit: []
    delete: []
  }>()

  const handleDelete = () => {
    if (confirm(props.confirmMessage || 'Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      emit('delete')
    }
  }
</script>
