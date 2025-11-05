<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const stats = ref([
  {
    label: 'Total Témoignages',
    value: '3',
    icon: 'i-lucide-message-circle',
    color: 'primary',
  },
  {
    label: 'Questions FAQ',
    value: '8',
    icon: 'i-lucide-help-circle',
    color: 'blue',
  },
  {
    label: 'Étapes Méthode',
    value: '5',
    icon: 'i-lucide-workflow',
    color: 'green',
  },
])

const quickActions = [
  {
    label: 'Gérer les témoignages',
    description: 'Ajouter ou modifier les témoignages vidéo',
    icon: 'i-lucide-message-circle',
    to: '/admin/contenu/temoignages',
    color: 'primary',
  },
  {
    label: 'Modifier la FAQ',
    description: 'Gérer les questions fréquemment posées',
    icon: 'i-lucide-help-circle',
    to: '/admin/contenu/faq',
    color: 'blue',
  },
  {
    label: 'Paramètres du site',
    description: 'Configurer les informations générales',
    icon: 'i-lucide-settings',
    to: '/admin/parametres',
    color: 'gray',
  },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Tableau de bord
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Bienvenue dans votre espace d'administration
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="stat in stats" :key="stat.label" class="shadow-sm">
        <div class="flex items-center gap-4">
          <div :class="`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`">
            <UIcon :name="stat.icon" :class="`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`" />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Actions rapides
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="block">
          <UCard class="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <div class="flex items-start gap-4">
              <div :class="`p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`">
                <UIcon :name="action.icon" :class="`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ action.label }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ action.description }}
                </p>
              </div>
              <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-gray-400" />
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity Section (Placeholder) -->
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Activité récente
      </h2>
      <UCard class="shadow-sm">
        <div class="text-center py-8">
          <UIcon name="i-lucide-activity" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            Aucune activité récente pour le moment
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
