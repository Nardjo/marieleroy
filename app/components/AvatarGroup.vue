<template>
  <div class="flex flex-col md:flex-row items-center justify-center w-full gap-3 md:gap-4">
    <div v-if="displayAvatars.length > 0" class="flex flex-row items-center">
      <AnimatedTooltip :items="displayAvatars" />
      <div
        v-if="avatars.length > 5"
        class="group relative -mr-4 h-14 w-14 rounded-full border-2 border-white bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-default"
        style="z-index: 0">
        +{{ avatars.length - 5 }}
      </div>
    </div>
    <p class="text-lg text-primary-700 font-medium md:ml-2">{{ clientsText }}</p>
  </div>
</template>

<script setup lang="ts">
  interface Avatar {
    firstName: string
    lastName: string
    subtitle: string
    imageUrl?: string
  }

  interface Props {
    avatars?: Avatar[]
    clientsText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    avatars: () => [],
    clientsText: 'clients satisfaits',
  })

  // Transformer les avatars pour AnimatedTooltip
  const displayAvatars = computed(() => {
    return props.avatars.slice(0, 5).map((avatar, index) => ({
      id: index + 1,
      name: `${avatar.firstName} ${avatar.lastName}`,
      designation: avatar.subtitle,
      // Utiliser l'image uploadée ou générer un avatar par défaut
      image: avatar.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.firstName}${avatar.lastName}`,
    }))
  })
</script>
