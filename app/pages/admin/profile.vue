<script setup lang="ts">
  useHead({
    title: 'Mon compte',
  })

  definePageMeta({
    layout: 'admin',
  })

  const { user, updateProfile, changePassword } = useAuth()
  const toast = useToast()

  const loadingProfile = ref(false)
  const loadingPassword = ref(false)

  const profileForm = reactive({
    firstName: '',
    lastName: '',
    email: '',
  })

  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Charger les données utilisateur au montage
  onMounted(() => {
    if (user.value) {
      profileForm.firstName = user.value.firstName || ''
      profileForm.lastName = user.value.lastName || ''
      profileForm.email = user.value.email || ''
    }
  })

  // Mettre à jour le formulaire quand l'utilisateur change
  watch(user, newUser => {
    if (newUser) {
      profileForm.firstName = newUser.firstName || ''
      profileForm.lastName = newUser.lastName || ''
      profileForm.email = newUser.email || ''
    }
  })

  const saveProfile = async () => {
    loadingProfile.value = true
    try {
      await updateProfile(profileForm)
      toast.add({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.add({
        title: 'Erreur de mise à jour',
        description: error?.data?.message || error?.statusMessage || 'Impossible de mettre à jour le profil',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    } finally {
      loadingProfile.value = false
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.add({
        title: 'Erreur de validation',
        description: 'Les mots de passe ne correspondent pas',
        color: 'error',
        icon: 'i-lucide-alert-circle',
        duration: 5000,
      })
      return
    }

    loadingPassword.value = true
    try {
      await changePassword(passwordForm)
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      toast.add({
        title: 'Mot de passe changé',
        description: 'Votre mot de passe a été mis à jour avec succès',
        color: 'success',
        icon: 'i-lucide-check-circle',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.add({
        title: 'Erreur de changement',
        description: error?.data?.message || error?.statusMessage || 'Impossible de changer le mot de passe',
        color: 'error',
        icon: 'i-lucide-x-circle',
        duration: 5000,
      })
    } finally {
      loadingPassword.value = false
    }
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mon compte</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Gérer vos informations personnelles</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile Info -->
        <UCard>
          <template #header>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 class="text-lg font-semibold">Informations personnelles</h3>
              <UButton
                color="primary"
                size="sm"
                icon="i-lucide-save"
                class="w-full sm:w-auto"
                :loading="loadingProfile"
                @click="saveProfile">
                Enregistrer
              </UButton>
            </div>
          </template>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Prénom" required>
                <UInput v-model="profileForm.firstName" size="lg" placeholder="Marie" />
              </UFormField>

              <UFormField label="Nom">
                <UInput v-model="profileForm.lastName" size="lg" placeholder="Leroy" />
              </UFormField>
            </div>

            <UFormField label="Email" required>
              <UInput
                v-model="profileForm.email"
                type="email"
                size="lg"
                placeholder="marie@marie-leroy.com"
                icon="i-lucide-mail" />
            </UFormField>
          </div>
        </UCard>

        <!-- Password Change -->
        <UCard>
          <template #header>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 class="text-lg font-semibold">Changer le mot de passe</h3>
              <UButton
                color="primary"
                size="sm"
                icon="i-lucide-save"
                class="w-full sm:w-auto"
                :loading="loadingPassword"
                @click="handlePasswordChange">
                Mettre à jour
              </UButton>
            </div>
          </template>
          <div class="space-y-4">
            <UFormField label="Mot de passe actuel" required>
              <UInput
                v-model="passwordForm.currentPassword"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon="i-lucide-lock" />
            </UFormField>

            <UFormField label="Nouveau mot de passe" required>
              <UInput
                v-model="passwordForm.newPassword"
                type="password"
                size="lg"
                placeholder="••••••••"
                icon="i-lucide-lock" />
              <template #hint>
                <span class="text-xs text-gray-500">Au moins 8 caractères</span>
              </template>
            </UFormField>

            <UFormField label="Confirmer le nouveau mot de passe" required>
              <UInput
                v-model="passwordForm.confirmPassword"
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
