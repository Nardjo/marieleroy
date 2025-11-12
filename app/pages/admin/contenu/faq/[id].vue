<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const id = computed(() => Number(route.params.id))

  const loading = ref(false)
  const saved = ref(false)

  const faqItems = ref([
    {
      id: 1,
      question: 'Quels types de contenus rédigez-vous ?',
      answer:
        'Je rédige une variété de contenus : pages de vente, articles de blog, newsletters, descriptions de produits, et bien plus encore. Chaque contenu est adapté à vos besoins spécifiques.',
      order: 1,
    },
    {
      id: 2,
      question: 'Quel est votre processus de travail ?',
      answer:
        'Mon processus se déroule en 5 étapes : consultation initiale, recherche et stratégie, rédaction et optimisation, révisions, et livraison finale avec suivi.',
      order: 2,
    },
    {
      id: 3,
      question: 'Combien de temps prend un projet ?',
      answer:
        "Le délai varie selon la complexité et l'ampleur du projet. Un article de blog prend généralement 3-5 jours, tandis qu'une page de vente complète peut nécessiter 1-2 semaines.",
      order: 3,
    },
  ])

  const form = ref<any>(null)

  onMounted(() => {
    const faqItem = faqItems.value.find(item => item.id === id.value)
    if (faqItem) {
      form.value = { ...faqItem }
    } else {
      router.push('/admin/contenu/faq')
    }
  })

  const goBack = () => {
    router.push('/admin/contenu/faq')
  }

  const saveFaqItem = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const index = faqItems.value.findIndex(item => item.id === form.value.id)
      if (index !== -1) {
        faqItems.value[index] = { ...form.value }
      }

      saved.value = true
      setTimeout(() => {
        saved.value = false
        goBack()
      }, 1500)
    } catch (error) {
      console.error('Error saving FAQ item:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <UButton color="neutral" variant="ghost" icon="i-lucide-arrow-left" size="sm" @click="goBack" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Modifier la question</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Modifier les informations de la question FAQ</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveFaqItem">
        Enregistrer
      </UButton>
    </div>

    <UAlert v-if="saved" color="success" variant="soft" title="Modifications enregistrées" />

    <AdminFaqForm v-if="form" v-model:faq-item="form" :loading="loading" />
  </div>
</template>
