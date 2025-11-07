<template>
  <section id="about" class="py-16 bg-white ">
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
          Qui suis-je,
          <span class="text-primary-600">mon parcours</span>
        </h2>
        <p class="text-primary-700 max-w-2xl mx-auto">
          Une copywriter passionnée par les mots qui convertissent et les histoires qui résonnent
        </p>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
        <UPageCard
          spotlight
          class="shadow-lg bg-primary-100 [--spotlight-color:#8b6239] [--spotlight-size:600px]">
          <div class="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center p-6">
            <!-- Texte à gauche -->
            <div class="flex-1 space-y-6">
              <p class="text-primary-700 leading-relaxed">
                Je suis une copywriter spécialisée dans la création de contenus persuasifs qui convertissent les visiteurs
                en clients. Avec plus de 5 ans d'expérience dans le domaine, j'ai aidé des dizaines d'entreprises à
                améliorer leur communication et à augmenter leurs ventes grâce à des textes efficaces.
              </p>
              <p class="text-primary-700 leading-relaxed">
                Mon approche combine une compréhension approfondie des principes de persuasion, une recherche minutieuse
                de votre marché cible, et une écriture claire et engageante. Je m'adapte à votre voix de marque pour créer
                un contenu authentique qui résonne avec votre audience.
              </p>
              <p class="text-primary-700 leading-relaxed">
                Que vous ayez besoin d'emails qui génèrent des clics, de pages de vente qui convertissent, ou de contenus
                de blog qui établissent votre autorité, je peux vous aider à atteindre vos objectifs.
              </p>
            </div>

            <!-- Avatar à droite -->
            <div class="flex-shrink-0">
              <img
                src="/images/hero.jpg"
                alt="Marie Leroy"
                class="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-200" />
            </div>
          </div>
        </UPageCard>
      </div>
    </div>
  </section>
</template>
