<script setup lang="ts">
import { ref, onMounted, computed, watch, defineAsyncComponent } from 'vue'
import { useColorMode } from '#imports'

// Lazy load ApexCharts only when needed (admin only)
const VueApexCharts = defineAsyncComponent(() =>
  import('vue3-apexcharts').then(module => module.default)
)

const hasData = computed(() => {
  return analyticsData.value.pageViews.length > 0 && analyticsData.value.contactClicks.length > 0
})

const isLoading = ref(false)
const selectedPeriod = ref('day')
const analyticsData = ref<{
  pageViews: Array<{ date: string; count: number }>
  contactClicks: Array<{ date: string; count: number }>
  totalPageViews: number
  totalContactClicks: number
  conversionRate: number
  period: string
}>({
  pageViews: [],
  contactClicks: [],
  totalPageViews: 0,
  totalContactClicks: 0,
  conversionRate: 0,
  period: 'par jour',
})

const periodItems = [
  { label: 'Par jour', value: 'day' },
  { label: 'Par semaine', value: 'week' },
  { label: 'Par mois', value: 'month' },
  { label: 'Par année', value: 'year' },
]

const getPeriodLabel = (period: string) => {
  switch (period) {
    case 'day':
      return '7 jours'
    case 'week':
      return '12 semaines'
    case 'month':
      return '12 mois'
    case 'year':
      return '5 ans'
    default:
      return '7 jours'
  }
}

const pageViewsSeries = computed(() => [
  {
    name: 'Vues de pages',
    data: analyticsData.value.pageViews.map(item => item.count),
  },
])

const contactClicksSeries = computed(() => [
  {
    name: 'Clics sur contact',
    data: analyticsData.value.contactClicks.map(item => item.count),
  },
])

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString)

  switch (selectedPeriod.value) {
    case 'week': {
      const weekNumber = getWeekNumber(date)
      return `Sem ${weekNumber}`
    }
    case 'month':
      return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    case 'year':
      return date.getFullYear().toString()
    default:
      return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
  }
}

const getWeekNumber = (date: Date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

const pageViewsOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 400,
    toolbar: {
      show: false,
    },
    background: 'transparent',
    foreColor: useColorMode().value === 'dark' ? '#F3F4F6' : '#111827',
  },
  colors: ['#3B82F6'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    show: true,
    borderColor: useColorMode().value === 'dark' ? '#374151' : '#E5E7EB',
    strokeDashArray: 3,
  },
  xaxis: {
    categories: analyticsData.value.pageViews.map(item => formatDateLabel(item.date)),
    labels: {
      style: {
        colors: useColorMode().value === 'dark' ? '#9CA3AF' : '#6B7280',
        fontSize: '12px',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: useColorMode().value === 'dark' ? '#9CA3AF' : '#6B7280',
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    theme: useColorMode().value === 'dark' ? 'dark' : 'light',
    y: {
      formatter: (value: number) => value.toLocaleString('fr-FR'),
    },
  },
  title: {
    text: 'Vues de pages',
    align: 'left',
    style: {
      fontSize: '18px',
      fontWeight: '600',
      color: useColorMode().value === 'dark' ? '#F3F4F6' : '#111827',
    },
  },
}))

const contactClicksOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 400,
    toolbar: {
      show: false,
    },
    background: 'transparent',
    foreColor: useColorMode().value === 'dark' ? '#F3F4F6' : '#111827',
  },
  colors: ['#10B981'],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '70%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: true,
    borderColor: useColorMode().value === 'dark' ? '#374151' : '#E5E7EB',
    strokeDashArray: 3,
  },
  xaxis: {
    categories: analyticsData.value.contactClicks.map(item => formatDateLabel(item.date)),
    labels: {
      style: {
        colors: useColorMode().value === 'dark' ? '#9CA3AF' : '#6B7280',
        fontSize: '12px',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: useColorMode().value === 'dark' ? '#9CA3AF' : '#6B7280',
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    theme: useColorMode().value === 'dark' ? 'dark' : 'light',
    y: {
      formatter: (value: number) => value.toLocaleString('fr-FR'),
    },
  },
  title: {
    text: 'Clics sur contact',
    align: 'left',
    style: {
      fontSize: '18px',
      fontWeight: '600',
      color: useColorMode().value === 'dark' ? '#F3F4F6' : '#111827',
    },
  },
}))

// Mock data generator - to be replaced with real PostHog data
const generateMockData = (period: string) => {
  const days = getDaysForPeriod(period)
  const dataPoints = period === 'day' ? 7 : period === 'week' ? 12 : period === 'month' ? 12 : 5

  const pageViews = []
  const contactClicks = []

  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date()

    if (period === 'day') {
      date.setDate(date.getDate() - i)
    } else if (period === 'week') {
      date.setDate(date.getDate() - (i * 7))
    } else if (period === 'month') {
      date.setMonth(date.getMonth() - i)
    } else if (period === 'year') {
      date.setFullYear(date.getFullYear() - i)
    }

    pageViews.push({
      date: date.toISOString(),
      count: Math.floor(Math.random() * 100) + 50,
    })

    contactClicks.push({
      date: date.toISOString(),
      count: Math.floor(Math.random() * 20) + 5,
    })
  }

  const totalPageViews = pageViews.reduce((sum, item) => sum + item.count, 0)
  const totalContactClicks = contactClicks.reduce((sum, item) => sum + item.count, 0)

  return {
    pageViews,
    contactClicks,
    totalPageViews,
    totalContactClicks,
    conversionRate: totalPageViews > 0 ? totalContactClicks / totalPageViews : 0,
    period: periodItems.find(p => p.value === period)?.label.toLowerCase() || 'par jour',
  }
}

const getDaysForPeriod = (period: string) => {
  switch (period) {
    case 'day':
      return 7
    case 'week':
      return 84
    case 'month':
      return 365
    case 'year':
      return 1825
    default:
      return 7
  }
}

const refreshData = async () => {
  isLoading.value = true
  try {
    // TODO: Replace with real PostHog API call
    await new Promise(resolve => setTimeout(resolve, 500))
    analyticsData.value = generateMockData(selectedPeriod.value)
  } catch (error) {
    console.error('Erreur lors du chargement des données analytics:', error)
  } finally {
    isLoading.value = false
  }
}

watch(selectedPeriod, async () => {
  await refreshData()
})

onMounted(async () => {
  await refreshData()
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h2>
        <p class="text-gray-600 dark:text-gray-400">Données {{ analyticsData.period }}</p>
      </div>
      <div class="flex items-center gap-3">
        <USelect
          v-model="selectedPeriod"
          :items="periodItems"
          class="w-35"
          placeholder="Sélectionner une période"
          :disabled="isLoading" />
        <UButton icon="i-lucide-refresh-cw" variant="outline" size="sm" :loading="isLoading" @click="refreshData">
          Rafraîchir
        </UButton>
      </div>
    </div>

    <!-- Info message -->
    <UAlert
      title="Données de démonstration"
      description="Les données affichées sont des données de démonstration. Configurez PostHog pour voir les vraies données d'analytics."
      icon="i-lucide-info"
      color="info"
      variant="soft"
      class="mb-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Vues de pages ({{ getPeriodLabel(selectedPeriod) }})
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ isLoading ? '...' : analyticsData.totalPageViews.toLocaleString('fr-FR') }}
            </p>
          </div>
          <UIcon name="i-lucide-eye" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
              Clics contact ({{ getPeriodLabel(selectedPeriod) }})
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ isLoading ? '...' : analyticsData.totalContactClicks.toLocaleString('fr-FR') }}
            </p>
          </div>
          <UIcon name="i-lucide-mouse-pointer-click" class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de conversion</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ isLoading ? '...' : `${(analyticsData.conversionRate * 100).toFixed(1)}%` }}
            </p>
          </div>
          <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
      </UCard>
    </div>

    <div class="space-y-8">
      <UCard>
        <div v-if="isLoading" class="h-96 flex items-center justify-center">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <ClientOnly>
          <VueApexCharts
            v-if="!isLoading && hasData"
            type="line"
            :options="pageViewsOptions"
            :series="pageViewsSeries"
            height="400" />
          <template #fallback>
            <div class="h-96 flex items-center justify-center">
              <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 text-gray-400" />
            </div>
          </template>
        </ClientOnly>
      </UCard>

      <UCard>
        <div v-if="isLoading" class="h-96 flex items-center justify-center">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <ClientOnly>
          <VueApexCharts
            v-if="!isLoading && hasData"
            type="bar"
            :options="contactClicksOptions"
            :series="contactClicksSeries"
            height="400" />
          <template #fallback>
            <div class="h-96 flex items-center justify-center">
              <UIcon name="i-lucide-bar-chart-3" class="w-12 h-12 text-gray-400" />
            </div>
          </template>
        </ClientOnly>
      </UCard>
    </div>
  </div>
</template>
