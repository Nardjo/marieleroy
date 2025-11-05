<template>
  <div
    v-for="(item, idx) in items"
    :key="item.id"
    class="group relative -mr-4"
    @mouseenter="hoveredIndex = item.id"
    @mouseleave="hoveredIndex = null"
    @mousemove="handleMouseMove($event, idx)">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-60 translate-y-5"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-60 translate-y-5">
      <div
        v-if="hoveredIndex === item.id"
        class="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
        :style="{
          transform: `translateX(calc(-50% + ${translateX}px)) rotate(${rotate}deg)`,
        }">
        <div
          class="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        <div
          class="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
        <div class="relative z-30 text-base font-bold text-white whitespace-nowrap">
          {{ item.name }}
        </div>
        <div class="text-xs text-white whitespace-nowrap">{{ item.designation }}</div>
      </div>
    </Transition>
    <img
      :src="item.image"
      :alt="item.name"
      class="relative !m-0 h-14 w-14 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 cursor-pointer"
      height="56"
      width="56" />
  </div>
</template>

<script setup lang="ts">
  interface TooltipItem {
    id: number
    name: string
    designation: string
    image: string
  }

  defineProps<{
    items: TooltipItem[]
  }>()

  const hoveredIndex = ref<number | null>(null)
  const translateX = ref(0)
  const rotate = ref(0)

  const handleMouseMove = (event: MouseEvent, idx: number) => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const halfWidth = rect.width / 2
    const offsetX = event.clientX - rect.left

    // Calculate offset from center
    const offset = offsetX - halfWidth

    // Apply spring-like effect with constraints
    translateX.value = Math.max(-50, Math.min(50, offset * 0.5))
    rotate.value = Math.max(-45, Math.min(45, offset * 0.45))
  }
</script>
