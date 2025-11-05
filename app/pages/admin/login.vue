<script setup lang="ts">
definePageMeta({
  layout: 'login',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // TODO: Implement better-auth login
    console.log('Login attempt:', { email: email.value })

    // Temporary: redirect to admin dashboard
    // await navigateTo('/admin')
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <UCard class="w-full max-w-md shadow-xl">
      <div class="space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <Logo :size="80" class="mx-auto mb-4" />
          <h1 class="text-2xl font-bold text-primary-900 dark:text-white">
            Administration
          </h1>
          <p class="text-primary-600 dark:text-gray-400">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        <!-- Error Alert -->
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          :close-button="{ icon: 'i-lucide-x', color: 'error', variant: 'link' }"
          @close="error = ''" />

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <UFormField label="Email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@marieleroy.fr"
              icon="i-lucide-mail"
              size="lg"
              required />
          </UFormField>

          <UFormField label="Mot de passe" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              required />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
            :disabled="loading">
            Se connecter
          </UButton>
        </form>

        <!-- Footer Links -->
        <div class="text-center">
          <NuxtLink
            to="/"
            class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            ← Retour au site
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>
