<script setup lang="ts">
useHead({
  title: 'Dashboard Admin',
})

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <div class="space-y-8">
    <AdminDashboardAnalyticsCharts />
  </div>
</template>
