<template>
  <UModal v-model="show" size="xl" overlay>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      <div
        v-for="(card, i) in cards"
        :key="card.title"
        @mouseenter="hovered = i"
        @mouseleave="hovered = null"
        @click="open(card.videoUrl)"
        :class="[
          'rounded-lg relative overflow-hidden h-60 md:h-85 w-full transition-all duration-300 ease-out cursor-pointer',
          hovered !== null && hovered !== i ? 'blur-xs scale-[0.98]' : '',
        ]">
        <NuxtImg
          :src="card.imageUrl"
          :alt="card.title"
          class="w-full h-full object-cover"
          loading="lazy"
          width="400"
          height="340"
          format="webp"
          quality="80" />
        <div
          :class="[
            'absolute inset-0 bg-black/20 flex items-end py-8 px-4 transition-opacity duration-300',
            hovered === i ? 'opacity-100' : 'opacity-0',
          ]">
          <span
            class="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
            {{ card.title }}
          </span>
        </div>
      </div>
    </div>

    <template #content>
      <div class="relative w-full aspect-video">
        <iframe v-if="videoUrl" :src="videoUrl" class="absolute inset-0 w-full h-full rounded" allowfullscreen />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface Card {
    title: string
    imageUrl: string
    videoUrl: string
  }

  defineProps<{ cards: Card[] }>()

  const hovered = ref<number | null>(null)
  const show = ref(false)
  const videoUrl = ref<string | null>(null)

  function open(src: string) {
    videoUrl.value = src
    show.value = true
  }
</script>
