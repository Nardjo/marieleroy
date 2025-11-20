<script setup lang="ts">
  import { z } from 'zod'
  import type { FormSubmitEvent } from '#ui/types'

  useHead({
    title: 'Connexion',
  })

  definePageMeta({
    layout: 'login',
  })

  const { loggedIn } = useUserSession()

  const siteName = ref('Marie Leroy')

  if (loggedIn.value) {
    await navigateTo('/admin')
  }

  const rememberedEmail = useCookie('remembered-email', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })

  const schema = z.object({
    email: z
      .string({ required_error: "L'email est requis" })
      .min(1, "L'email est requis")
      .email("Format d'email invalide"),
    password: z.string({ required_error: 'Le mot de passe est requis' }).min(1, 'Le mot de passe est requis'),
    remember: z.boolean().optional().default(false),
  })

  z.setErrorMap((issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) {
      if (issue.expected === 'string') {
        return { message: 'Ce champ est requis' }
      }
    }
    return { message: ctx.defaultError }
  })

  type Schema = z.output<typeof schema>

  const form = reactive({
    email: rememberedEmail.value || '',
    password: '',
    remember: !!rememberedEmail.value,
  })
  const isLoading = ref(false)
  const error = ref('')

  const fields = [
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email',
      placeholder: 'votre@email.com',
      icon: 'i-lucide-mail',
      size: 'lg' as const,
      defaultValue: rememberedEmail.value || '',
    },
    {
      name: 'password',
      type: 'password' as const,
      label: 'Mot de passe',
      placeholder: '••••••••',
      icon: 'i-lucide-lock',
      size: 'lg' as const,
    },
    {
      name: 'remember',
      type: 'checkbox' as const,
      label: 'Se souvenir de moi',
      defaultValue: !!rememberedEmail.value,
    },
  ]

  const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: event.data.email,
          password: event.data.password,
        },
      })

      if (response.success) {
        if (event.data.remember) {
          rememberedEmail.value = event.data.email
        } else {
          rememberedEmail.value = null
        }

        await navigateTo('/admin', { replace: true, external: true })
      }
    } catch (err: any) {
      error.value = err.data?.statusMessage || 'Erreur de connexion. Vérifiez vos identifiants.'
    } finally {
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
  <div>
    <UCard class="shadow-xl">
      <UAuthForm
        :key="rememberedEmail || 'no-email'"
        :schema="schema"
        :fields="fields"
        :state="form"
        :loading="isLoading"
        :validate-on="[]"
        icon="i-lucide-log-in"
        :title="`${siteName} - Administration`"
        description="Connectez-vous pour accéder au panneau d'administration"
        submit-button="Se connecter"
        :submit-button-loading-text="'Connexion...'"
        @submit="handleSubmit">
        <template #validation>
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="error"
            :close-button="{ variant: 'link' }"
            @close="error = ''" />
        </template>
      </UAuthForm>
    </UCard>

    <div class="text-center mt-8 space-y-3">
      <UButton
        to="/"
        variant="ghost"
        size="sm"
        icon="i-lucide-arrow-left"
        class="text-slate-600 dark:text-slate-400 hover:text-primary">
        Retour au site
      </UButton>
    </div>
  </div>
</template>
