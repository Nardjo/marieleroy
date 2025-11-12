<script setup lang="ts">
  definePageMeta({
    layout: 'admin',
  })

  const route = useRoute()
  const router = useRouter()
  const id = computed(() => Number(route.params.id))

  const loading = ref(false)
  const saved = ref(false)

  const testimonials = ref([
    {
      id: 1,
      title: 'Marie',
      quote: "Grâce à Marie, j'ai pu transformer ma communication et atteindre mes objectifs de manière efficace.",
      embedUrl: 'https://www.youtube.com/embed/KJNbhiD9YLg',
      order: 1,
    },
    {
      id: 2,
      title: 'Jessica',
      quote:
        'Un travail exceptionnel qui a dépassé toutes mes attentes. Ma marque a pris une toute nouvelle dimension.',
      embedUrl: 'https://www.youtube.com/embed/3enzfMLVIbo',
      order: 2,
    },
    {
      id: 3,
      title: 'Lilie',
      quote: "Marie a su capter l'essence de mon message et créer un contenu qui résonne vraiment avec mon audience.",
      embedUrl: 'https://www.youtube.com/embed/3Ah-CkKIKx8',
      order: 3,
    },
  ])

  const form = ref<any>(null)

  onMounted(() => {
    const testimonial = testimonials.value.find(t => t.id === id.value)
    if (testimonial) {
      form.value = { ...testimonial }
    } else {
      router.push('/admin/contenu/temoignages')
    }
  })

  const goBack = () => {
    router.push('/admin/contenu/temoignages')
  }

  const saveTestimonial = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const index = testimonials.value.findIndex(t => t.id === form.value.id)
      if (index !== -1) {
        testimonials.value[index] = { ...form.value }
      }

      saved.value = true
      setTimeout(() => {
        saved.value = false
        goBack()
      }, 1500)
    } catch (error) {
      console.error('Error saving testimonial:', error)
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Modifier le témoignage</h1>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Modifier les informations du témoignage</p>
      </div>
      <UButton color="primary" size="lg" icon="i-lucide-save" :loading="loading" @click="saveTestimonial">
        Enregistrer
      </UButton>
    </div>

    <UAlert v-if="saved" color="success" variant="soft" title="Modifications enregistrées" />

    <AdminTestimonialForm v-if="form" v-model:testimonial="form" :loading="loading" />
  </div>
</template>
