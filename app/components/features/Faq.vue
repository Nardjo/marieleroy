<script setup lang="ts">
  const { sanitize } = useSanitize()

  // Fetch FAQ from API
  const { data: faqData } = await usePublicFaq()
  const { data: settings } = await usePublicSettings()

  const header = computed(() => {
    const h = faqData.value?.header || {
      title: 'Vos questions,',
      subtitle: 'mes réponses',
      description: 'Retrouvez les réponses aux questions les plus courantes sur mes services de copywriting',
    }
    return {
      ...h,
      description: sanitize(h.description),
    }
  })

  const faqItems = computed(() => {
    const items = faqData.value?.items || []
    return items.map(item => ({
      label: item.question,
      content: sanitize(item.answer),
    }))
  })

  const contactEmail = computed(() => {
    const email = settings.value?.site?.email
    return email ? `mailto:${email}?subject=Questions pour Marie Leroy` : '#'
  })
</script>

<template>
  <section id="faq" class="py-16 bg-primary-200">
    <div class="container mx-auto px-4 max-w-4xl">
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-help-circle" class="w-4 h-4" />
          Questions Fréquentes
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
          {{ header.title }}
          <span v-if="header.subtitle" class="text-primary-700">{{ header.subtitle }}</span>
        </h2>
        <div
          v-if="header.description"
          class="tiptap-content text-xl md:text-2xl italic font-semibold text-orange-600/80 font-sans max-w-2xl mx-auto"
          v-html="header.description" />
      </div>

      <UCard
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="shadow-lg !bg-primary-100">
        <UAccordion
          class="bg-primary-white"
          :items="faqItems"
          :ui="{
            root: 'space-y-0',
            trigger:
              'cursor-pointer group hover:bg-primary-200 transition-all duration-200 !px-4 rounded-t-lg data-[state=open]:bg-primary-200',
            content: 'bg-primary-200 rounded-b-lg',
            item: 'border-0 text-base',
            trailingIcon: '!text-primary-700',
          }"
          multiple>
          <template #default="{ item }">
            <div class="py-4">
              <span class="font-semibold !text-primary-900 text-lg">
                {{ item.label }}
              </span>
            </div>
          </template>
          <template #content="{ item }">
            <div class="tiptap-content text-primary-900 px-4 py-4" v-html="item.content" />
          </template>
        </UAccordion>
      </UCard>

      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mt-12">
        <CTASection
          title="Tu as d'autres questions ?"
          description="N'hésite pas à me contacter pour un échange personnalisé. Je suis là pour t'accompagner dans ton projet."
          button-text="Poser ma question"
          :button-to="contactEmail"
          :button-external="true"
          icon="i-lucide-message-circle"
          tracking-name="ask_question_cta"
          tracking-section="faq" />
      </div>
    </div>
  </section>
</template>
