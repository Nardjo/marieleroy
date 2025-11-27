<template>
  <h2
    class="font-dancing-script font-normal drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700"
    :class="{ 'min-w-fit min-h-30 whitespace-nowrap': !compact, 'leading-none': compact }"
    :style="{ fontSize: props.size + 'px' }">
    {{ minimal ? 'ML' : 'Marie Leroy' }}
  </h2>
</template>

<script setup lang="ts">
  const props = defineProps({
    size: {
      type: Number,
      default: 250,
    },
    minimal: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  })
</script>
