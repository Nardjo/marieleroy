<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const { loading, fetchHeader, updateHeader } = useMethod()
  const toast = useToast()

  const form = reactive({
    title: '',
    subtitle: '',
    description: '',
  })

  onMounted(async () => {
    try {
      const header = await fetchHeader()
      Object.assign(form, header)
    } catch (error) {
      toast.add({
        title: 'Erreur',
        description: "Impossible de charger l'en-tête",
        color: 'error',
        duration: 5000,
      })
    }
  })

  const saveHeader = async () => {
    try {
      await updateHeader(form)
      toast.add({
        title: 'Enregistré',
        description: "L'en-tête a été mis à jour avec succès",
        color: 'success',
        icon: 'i-lucide-check',
        duration: 3000,
      })
      navigateTo('/admin/contenu/ma-methode')
    } catch (error: any) {
      toast.add({
        title: 'Erreur',
        description: error?.message || "Impossible de sauvegarder l'en-tête",
        color: 'error',
        duration: 5000,
      })
    }
  }

  const cancel = () => {
    navigateTo('/admin/contenu/ma-methode')
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <AdminPageHeader title="Modifier l'en-tête" description="Personnaliser l'introduction de votre méthode de travail">
      <template #actions>
        <UButton color="gray" variant="outline" size="lg" @click="cancel">Annuler</UButton>
        <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveHeader">
          Enregistrer
        </UButton>
      </template>
    </AdminPageHeader>

    <!-- Form -->
    <UCard>
      <div class="space-y-6">
        <UFormField label="Titre principal" required>
          <UInput v-model="form.title" size="lg" placeholder="Ex: Comment je travaille" :disabled="loading" />
        </UFormField>

        <UFormField label="Sous-titre" description="Optionnel - Affiché sous le titre principal">
          <UInput v-model="form.subtitle" size="lg" placeholder="Ex: étape par étape" :disabled="loading" />
        </UFormField>

        <UFormField label="Description" description="Optionnel - Texte d'introduction">
          <UTextarea
            v-model="form.description"
            :rows="4"
            placeholder="Décrivez votre approche et méthode de travail..."
            :disabled="loading" />
        </UFormField>
      </div>
    </UCard>
  </div>
</template>
