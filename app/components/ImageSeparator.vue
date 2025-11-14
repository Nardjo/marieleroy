<template>
  <section class="w-full">
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
        loading="lazy"
      />
      <!-- Desktop image (shown on medium and larger screens) -->
      <img
        v-if="desktopImage"
        :src="desktopImage"
        alt="Séparateur"
        class="hidden md:block w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
  // Fetch separator images from API
  const { data: separatorData } = await usePublicImageSeparator()

  const desktopImage = computed(() => separatorData.value?.desktopImage || '/images/separator.jpg')
  const mobileImage = computed(() => separatorData.value?.mobileImage || '/images/separator.jpg')
</script>
