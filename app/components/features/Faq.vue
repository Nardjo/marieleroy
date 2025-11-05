<template>
  <section id="faq" class="py-16 bg-primary-200">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="text-center mb-12">
        <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-4">
          <Icon name="i-lucide-help-circle" class="w-4 h-4"/>
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

      <UCard class="shadow-lg !bg-primary-100">
        <UAccordion
            class="bg-primary-100"
            :items="faqItems"
            :ui="{
            root: 'space-y-0',
            trigger:
            'cursor-pointer group hover:bg-primary-200 transition-colors duration-200 !px-4 rounded-t-lg data-[state=open]:bg-primary-200',
            content:'bg-primary-200 rounded-b-lg',
            item: 'border-0 text-base',
            trailingIcon:'!text-primary-600',
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
              <p v-if="item.content" class="text-primary-700 leading-relaxed">
                {{ item.content }}
              </p>
              <div v-if="item.slot === 'collaboration'" class="mt-2">
                <p class="text-primary-700 mb-4 leading-relaxed">Pour démarrer une collaboration, c'est simple :</p>
                <ol class="list-decimal pl-5 space-y-2 text-primary-700 leading-relaxed">
                  <li>Contactez-moi via le formulaire de contact ou par email</li>
                  <li>Nous planifierons un appel de découverte gratuit de 30 minutes</li>
                  <li>Je vous enverrai une proposition détaillée avec tarifs et délais</li>
                  <li>Après votre validation, nous démarrerons le projet</li>
                </ol>
                <CTAButton class="mt-6" text="Me contacter" size="md" icon="i-lucide-mail"/>
              </div>
            </div>
          </template>
        </UAccordion>
      </UCard>

      <!-- CTA Section -->
      <div class="mt-12">
        <CTASection
            title="Vous avez d'autres questions ?"
            description="N'hésitez pas à me contacter pour un échange personnalisé. Je suis là pour vous accompagner dans votre projet."
            button-text="Poser ma question"
            icon="i-lucide-message-circle"
            @cta-click="console.log('CTA clicked')"/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqItems = ref<any[]>([
  {
    label: 'Quel est votre processus de travail ?',
    iconName: 'i-lucide-workflow',
    content:
        "Mon processus commence par une consultation initiale pour comprendre vos besoins, suivie d'une recherche approfondie de votre marché et de votre audience. Ensuite, je rédige le contenu en utilisant des techniques de copywriting éprouvées, puis nous procédons à des révisions jusqu'à ce que le résultat soit parfait.",
  },
  {
    label: 'Combien coûtent vos services ?',
    iconName: 'i-lucide-euro',
    content:
        'Mes tarifs varient selon la complexité et la longueur du projet. Je propose des forfaits pour les pages de vente, les emails, et les contenus de blog. Contactez-moi pour obtenir un devis personnalisé adapté à vos besoins spécifiques.',
  },
  {
    label: 'Quels types de projets acceptez-vous ?',
    iconName: 'i-lucide-file-text',
    content:
        "Je travaille sur une variété de projets de copywriting : pages de vente, emails marketing, contenus de blog, descriptions de produits, scripts vidéo, et plus encore. Si vous avez un projet de rédaction persuasive, n'hésitez pas à me contacter.",
  },
  {
    label: 'Quel est votre délai de livraison ?',
    iconName: 'i-lucide-clock',
    content:
        'Les délais dépendent de la taille et de la complexité du projet. En général, une page de vente prend 7-10 jours, un email 2-3 jours, et un article de blog 3-5 jours. Je peux également travailler sur des délais plus courts moyennant un supplément.',
  },
  {
    label: 'Comment démarrer une collaboration ?',
    iconName: 'i-lucide-handshake',
    slot: 'collaboration',
    content: '',
  },
])
</script>
