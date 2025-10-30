<template>
  <div
    ref="box"
    class="relative overflow-hidden w-full h-full rounded-lg shadow-xl"
    @mouseenter="enter"
    @mouseleave="leave">
    <img
      :src="src"
      alt=""
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
      :class="imgClass" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ src: string }>()

const box = ref<HTMLElement>()
const imgClass = ref('scale-[1.15]') // zoom 15 % au repos

function side(e: MouseEvent) {
  const r = box.value!.getBoundingClientRect()
  const x = (e.clientX - r.left - r.width / 2) * (r.width > r.height ? r.height / r.width : 1)
  const y = (e.clientY - r.top - r.height / 2) * (r.height > r.width ? r.width / r.height : 1)
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 180) / 90 + 3) % 4
}

const shift = ['-translate-y-6', 'translate-x-6', 'translate-y-6', '-translate-x-6'] // 1.5 rem

const enter = (e: MouseEvent) => {
  imgClass.value = `scale-[1.15] ${shift[side(e)]}` // commence décalé
  requestAnimationFrame(() => (imgClass.value = 'scale-[1.15]')) // recentre
}

const leave = (e: MouseEvent) => {
  imgClass.value = `scale-[1.15] ${shift[side(e)]}` // repart vers la sortie
}
</script>
