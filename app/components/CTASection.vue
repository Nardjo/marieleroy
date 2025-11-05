<template>
  <div class="text-center">
    <UCard class="inline-block max-w-2xl shadow-xl" :class="cardBgClass" :variant="variant">
      <div class="p-8">
        <Icon v-if="icon" :name="icon" class="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-primary-900 mb-4">
          {{ title }}
        </h3>
        <p class="text-primary-700 mb-6">
          {{ description }}
        </p>
        <CTAButton
          :text="buttonText"
          :size="buttonSize"
          :to="buttonTo"
          :external="buttonExternal"
          @click="$emit('cta-click')" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title: string
    description: string
    buttonText: string
    buttonTo?: string
    buttonExternal?: boolean
    icon?: string
    variant?: 'outline' | 'solid' | 'soft' | 'subtle'
    buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    cardBgClass?: string
  }

  withDefaults(defineProps<Props>(), {
    variant: 'subtle',
    buttonSize: 'lg',
    icon: undefined,
    buttonTo: undefined,
    buttonExternal: false,
    cardBgClass: 'bg-white',
  })

  defineEmits<{
    'cta-click': []
  }>()
</script>
