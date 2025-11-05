<template>
  <section class="w-full">
    <div
      v-motion
      :initial="{ opacity: 0, scale: 1.1 }"
      :visible-once="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
      class="w-full h-70 md:h-[500px] lg:h-[500px] overflow-hidden drop-shadow-xl">
      <img
        src="/images/separator.jpg"
        alt="Séparateur"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  </section>
</template>

<script setup lang="ts"></script>
