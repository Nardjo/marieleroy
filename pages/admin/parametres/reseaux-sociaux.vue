<template>
  <UForm :schema="schema" :state="form" @submit="onSubmit">
    <div class="space-y-6">
      <!-- Other cards above -->

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Image de partage</h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Image de partage" name="ogImage">
            <UFileUpload v-model="form.ogImage" accept="image/*" />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Other cards below -->
    </div>
  </UForm>
</template>

<script setup lang="ts">
  const form = ref({
    ogImage: null,
  })

  const schema = {
    ogImage: { type: 'file', required: false },
  }

  const onSubmit = async (data: any) => {
    // Handle form submission
  }
</script>
