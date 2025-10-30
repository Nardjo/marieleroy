<script setup lang="ts">
const { items } = useNavigation()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-primary-100/20">

    <LayoutsAppHeader :items="items"/>


    <div class="flex-1">
      <slot/>
    </div>

    <LayoutsAppFooter :items="items"/>
  </div>
</template>
