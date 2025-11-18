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
          Vos questions,
          <span class="text-primary-600">mes réponses</span>
        </h2>
        <p class="text-primary-700 max-w-2xl mx-auto">
          Retrouvez les réponses aux questions les plus courantes sur mes services de copywriting
        </p>
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
            trailingIcon: '!text-primary-600',
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
            <div class="px-6 pb-6">
              <p v-if="item.content" class="text-primary-700 leading-relaxed whitespace-pre-line">
                {{ item.content }}
              </p>
            </div>
          </template>
        </UAccordion>
      </UCard>

      <!-- CTA Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="mt-12">
        <CTASection
          title="Vous avez d'autres questions ?"
          description="N'hésitez pas à me contacter pour un échange personnalisé. Je suis là pour vous accompagner dans votre projet."
          button-text="Poser ma question"
          :button-to="ctaLink"
          :button-external="true"
          icon="i-lucide-message-circle"
          tracking-name="ask_question_cta"
          tracking-section="faq" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  // Fetch FAQ from API
  const { data: faqData } = await usePublicFaq()
  const { data: settings } = await usePublicSettings()

  const faqItems = computed(() => {
    const items = faqData.value || []
    return items.map(item => ({
      label: item.question,
      content: item.answer,
    }))
  })

  const ctaLink = computed(() => settings.value?.site?.ctaLink || '#')
</script>
