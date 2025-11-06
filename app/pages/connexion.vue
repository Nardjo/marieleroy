<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'login',
})

const { login, loggedIn } = useAuth()

const siteName = ref('Marie Leroy')

if (loggedIn.value) {
  await navigateTo('/')
}

const schema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
})

type Schema = z.output<typeof schema>

const form = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)
const error = ref('')

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true
  error.value = ''

  try {
    await login({
      email: event.data.email,
      password: event.data.password,
    })

    await navigateTo('/')
  }
  catch (err: unknown) {
    error.value = (err as Error)?.message || 'Erreur de connexion. Vérifiez vos identifiants.'
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
  if (emailInput) {
    emailInput.focus()
  }
})
</script>

<template>
  <UCard class="shadow-xl">
    <UAuthForm
      :schema="schema"
      :fields="[
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'votre@email.com',
          icon: 'i-lucide-mail',
          size: 'lg',
        },
        {
          name: 'password',
          type: 'password',
          label: 'Mot de passe',
          placeholder: '••••••••',
          icon: 'i-lucide-lock',
          size: 'lg',
        },
      ]"
      :state="form"
      :loading="isLoading"
      :validate-on="[]"
      icon="i-lucide-log-in"
      :title="`${siteName} - Administration`"
      description="Connectez-vous pour accéder au panneau d'administration"
      submit-button="Se connecter"
      :submit-button-loading-text="'Connexion...'"
      @submit="handleSubmit"
    >
      <template #validation>
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          :close-button="{ variant: 'link' }"
          @close="error = ''"
        />
      </template>
    </UAuthForm>
  </UCard>

  <div class="text-center mt-8 space-y-3">
    <UButton
      to="/"
      variant="ghost"
      size="sm"
      icon="i-lucide-arrow-left"
      class="text-slate-600 dark:text-slate-400 hover:text-primary"
    >
      Retour au site
    </UButton>
  </div>
</template>
