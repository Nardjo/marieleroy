<template>
  <div :id="id" class="mb-16 md:mb-24">
    <div class="flex flex-col md:flex-row items-center" :class="{ 'md:flex-row-reverse': reverse }">
      <div class="w-full md:w-1/2 p-6 flex flex-col justify-center">
        <h3 class="text-xl font-semibold !text-primary-400 mb-3">{{ title }}</h3>
        <p class="">{{ text }}</p>
      </div>

      <div v-if="img" class="w-full md:w-1/2 aspect-video">
        <img class="w-full h-full object-cover rounded-lg" :src="img" :alt="title" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1454493246676-c0e063828dce?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})
</script>
