<template>
  <div class="flex flex-row items-center justify-center w-full">
    <AnimatedTooltip :items="people" />
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
    {
      id: 6,
      name: 'Lucas Bernard',
      designation: 'Entrepreneur',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    },
  ]
</script>
