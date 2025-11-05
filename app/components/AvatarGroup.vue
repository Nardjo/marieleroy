<template>
  <div class="flex flex-col md:flex-row items-center justify-center w-full gap-3 md:gap-4">
    <div class="flex flex-row items-center">
      <AnimatedTooltip :items="people" />
      <div
        class="group relative -mr-4 h-14 w-14 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-default"
        style="z-index: 0">
        +2
      </div>
    </div>
    <p class="text-lg text-primary-700 font-medium md:ml-2">clients satisfaits</p>
  </div>
</template>

<script setup lang="ts">
  const people = [
    {
      id: 1,
      name: 'Sophie Martin',
      designation: 'Entrepreneur',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      designation: 'Coach',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    },
    {
      id: 3,
      name: 'Julie Laurent',
      designation: 'Consultante',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie',
    },
    {
      id: 4,
      name: 'Marc Petit',
      designation: 'Freelance',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc',
    },
    {
      id: 5,
      name: 'Camille Roux',
      designation: 'Business Owner',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camille',
    },
  ]
</script>
