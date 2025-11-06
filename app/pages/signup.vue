<template>
  <div>
    <UCard>
      <template #header>
        <h2 class="text-xl font-bold text-center">Créer un compte</h2>
      </template>

      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Nom complet" name="name" required>
          <UInput
            v-model="state.name"
            type="text"
            placeholder="Marie Leroy"
            icon="i-lucide-user"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="votre@email.com"
            icon="i-lucide-mail"
            size="lg"
          />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password" required>
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormGroup>

        <UButton
          type="submit"
          size="lg"
          block
          :loading="loading"
          :disabled="loading"
        >
          Créer mon compte
        </UButton>
      </UForm>

      <UAlert
        v-if="error"
        color="red"
        variant="soft"
        :title="error"
        class="mt-4"
      />

      <UAlert
        v-if="success"
        color="green"
        variant="soft"
        title="Compte créé avec succès !"
        description="Redirection vers la page de connexion..."
        class="mt-4"
      />
    </UCard>

    <div class="text-center mt-4 space-y-2">
      <p class="text-sm text-gray-600">
        Vous avez déjà un compte ?
        <UButton variant="link" to="/login" class="p-0">
          Se connecter
        </UButton>
      </p>
      <UButton
        variant="link"
        color="gray"
        to="/"
        icon="i-lucide-arrow-left"
      >
        Retour à l'accueil
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { signUp } = await import('~/utils/auth-client')

const state = reactive({
  name: '',
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const onSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const result = await signUp.email({
      email: state.email,
      password: state.password,
      name: state.name,
    })

    if (result.error) {
      error.value = result.error.message || "Erreur lors de l'inscription"
    } else {
      success.value = true
      // Redirection vers login après succès
      setTimeout(() => {
        navigateTo('/login')
      }, 1500)
    }
  } catch (e: any) {
    console.error('Signup error:', e)
    error.value = e.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}
</script>
