<template>
  <section v-if="hasImages" class="w-full">
    <div
      v-motion
      :initial="{ opacity: 0, scale: 1.1 }"
      :visible-once="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
      class="w-full h-70 md:h-[500px] lg:h-[500px] overflow-hidden drop-shadow-xl">
      <!-- Mobile image (shown on small screens) -->
      <img
        v-if="mobileImage"
        :src="mobileImage"
        alt="Séparateur"
        class="block md:hidden w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
        width="640"
        height="280" />
      <!-- Desktop image (shown on medium and larger screens) -->
      <img
        v-if="desktopImage"
        :src="desktopImage"
        alt="Séparateur"
        class="hidden md:block w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
        width="1920"
        height="500" />
    </div>
  </section>
</template>

<script setup lang="ts">
  // Fetch separator images from API
  const { data: separatorData } = await usePublicImageSeparator()

  const desktopImage = computed(() => separatorData.value?.desktopImage || null)
  const mobileImage = computed(() => separatorData.value?.mobileImage || null)
  const hasImages = computed(() => !!(desktopImage.value || mobileImage.value))
</script>
