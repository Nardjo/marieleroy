<script setup lang="ts">
const { items } = useNavigation()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-primary-100/20">

    <LayoutsAppHeader :items="items"/>

    <UMain class="flex-1">
      <slot/>
    </UMain>

    <LayoutsAppFooter :items="items"/>
  </div>
</template>
