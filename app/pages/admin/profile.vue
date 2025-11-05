<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(false)
const saved = ref(false)

const form = reactive({
  firstname: 'Marie',
  lastname: 'Leroy',
  email: 'marie@marieleroy.fr',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const saveProfile = async () => {
  loading.value = true
  try {
    // TODO: API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  loading.value = true
  try {
    // TODO: API call to change password
    await new Promise(resolve => setTimeout(resolve, 1000))
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  } catch (error) {
    console.error('Error changing password:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Mon compte
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Gérer vos informations personnelles
      </p>
    </div>

    <!-- Success Alert -->
    <UAlert
      v-if="saved"
      color="success"
      variant="soft"
      title="Modifications enregistrées"
      description="Vos informations ont été mises à jour avec succès" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile Info -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Informations personnelles</h3>
              <UButton
                color="primary"
                size="sm"
                icon="i-lucide-save"
                :loading="loading"
                @click="saveProfile">
                Enregistrer
              </UButton>
            </div>
          </template>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Prénom" required>
                <UInput v-model="form.firstname" size="lg" placeholder="Marie" />
              </UFormField>

              <UFormField label="Nom" required>
                <UInput v-model="form.lastname" size="lg" placeholder="Leroy" />
              </UFormField>
            </div>

            <UFormField label="Email" required>
              <UInput
                v-model="form.email"
                type="email"
                size="lg"
                placeholder="marie@marieleroy.fr"
                icon="i-lucide-mail" />
            </UFormField>
          </div>
        </UCard>

        <!-- Password Change -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Changer le mot de passe</h3>
              <UButton
                color="primary"
                size="sm"
                icon="i-lucide-save"
                :loading="loading"
                @click="changePassword">
                Mettre à jour
              </UButton>
            </div>
          </template>
          <div class="space-y-4">
            <UFormField label="Mot de passe actuel" required>
              <UInput
                v-model="form.currentPassword"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon="i-lucide-lock" />
            </UFormField>

            <UFormField label="Nouveau mot de passe" required>
              <UInput
                v-model="form.newPassword"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon="i-lucide-lock" />
            </UFormField>

            <UFormField label="Confirmer le nouveau mot de passe" required>
              <UInput
                v-model="form.confirmPassword"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon="i-lucide-lock" />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Account Info -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Informations du compte</h3>
          </template>
          <div class="space-y-3 text-sm">
            <div>
              <p class="text-gray-600 dark:text-gray-400">Rôle</p>
              <p class="font-medium text-gray-900 dark:text-white">Administrateur</p>
            </div>
            <div>
              <p class="text-gray-600 dark:text-gray-400">Dernière connexion</p>
              <p class="font-medium text-gray-900 dark:text-white">Aujourd'hui</p>
            </div>
          </div>
        </UCard>

        <!-- Security Tips -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Conseils de sécurité</h3>
          </template>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex gap-2">
              <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Utilisez un mot de passe fort avec au moins 8 caractères</p>
            </div>
            <div class="flex gap-2">
              <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Changez votre mot de passe régulièrement</p>
            </div>
            <div class="flex gap-2">
              <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Ne partagez jamais vos identifiants</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
