<script setup lang="ts">
  const { sanitize } = useSanitize()
  const { data: about } = await usePublicAbout()

  const title = computed(() => about.value?.title || 'Marie Leroy')
  const subtitle = computed(() => about.value?.subtitle || 'mon parcours')
  const description = computed(() => sanitize(about.value?.description || ''))
  const imageUrl = useFullImageUrl(() => about.value?.imageUrl)
</script>

<template>
  <section id="about" class="py-16 bg-white">
    <div class="mx-auto px-4 max-w-6xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-user" class="w-4 h-4" />
          À propos
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {{ title }},
          <span class="text-primary-700">{{ subtitle }}</span>
        </h2>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
        <UPageCard spotlight class="shadow-lg !bg-primary-100 [--spotlight-color:#8b6239] [--spotlight-size:600px]">
          <div class="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center p-6">
            <!-- Texte à gauche -->
            <div class="flex-1 tiptap-content text-primary-700 leading-relaxed" v-html="description" />

            <!-- Avatar à droite -->
            <div v-if="imageUrl" class="flex- shrink-0">
              <NuxtImg
                :src="imageUrl"
                :alt="title"
                class="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-200"
                loading="lazy"
                width="320"
                height="320"
                preset="avatar"
                sizes="xs:256px md:320px"
                format="webp"
                quality="85" />
            </div>
          </div>
        </UPageCard>
      </div>
    </div>
  </section>
</template>
