<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'
  import '~/assets/css/admin.css'

  const colorMode = useColorMode()
  const route = useRoute()
  const siteName = ref('Administation')

  // Set theme attribute on html element
  useHead({
    htmlAttrs: {
      'data-theme': 'admin',
    },
    title: computed(() => `Admin ${siteName.value}`),
    titleTemplate: () => `Admin ${siteName.value}`,
  })

  const { user } = useAuth()
  const { logout } = useAuth()

  // Mobile drawer state
  const isOpen = ref(false)
  const toggleDrawer = () => (isOpen.value = !isOpen.value)
  const closeDrawer = () => (isOpen.value = false)

  onMounted(() => {
    colorMode.preference = 'system'
  })

  // Navigation items
  const navigationItems = computed((): NavigationMenuItem[] => [
    {
      label: 'Tableau de bord',
      icon: 'i-lucide-layout-dashboard',
      to: '/admin',
      active: route.path === '/admin',
    },
    {
      label: 'Contenu du site',
      icon: 'i-lucide-book-open',
      children: [
        {
          label: 'Hero',
          icon: 'i-lucide-home',
          to: '/admin/contenu/hero',
          active: route.path === '/admin/contenu/hero',
        },
        {
          label: 'Témoignages',
          icon: 'i-lucide-message-circle',
          to: '/admin/contenu/temoignages',
          active: route.path === '/admin/contenu/temoignages',
        },
        {
          label: 'Image de séparation',
          icon: 'i-lucide-image',
          to: '/admin/contenu/image-separation',
          active: route.path === '/admin/contenu/image-separation',
        },
        {
          label: 'Ma méthode',
          icon: 'i-lucide-workflow',
          to: '/admin/contenu/ma-methode',
          active: route.path === '/admin/contenu/ma-methode',
        },
        {
          label: 'À propos',
          icon: 'i-lucide-user',
          to: '/admin/contenu/a-propos',
          active: route.path === '/admin/contenu/a-propos',
        },
        {
          label: 'FAQ',
          icon: 'i-lucide-help-circle',
          to: '/admin/contenu/faq',
          active: route.path === '/admin/contenu/faq',
        },
      ],
    },
    {
      label: 'Voir le site',
      icon: 'i-lucide-external-link',
      to: '/',
      target: '_blank',
    },
    {
      label: 'Paramètres',
      icon: 'i-lucide-settings',
      children: [
        {
          label: 'Général',
          icon: 'i-lucide-settings-2',
          to: '/admin/parametres',
          active: route.path === '/admin/parametres',
        },
        {
          label: 'Réseaux sociaux',
          icon: 'i-lucide-share-2',
          to: '/admin/parametres/reseaux-sociaux',
          active: route.path === '/admin/parametres/reseaux-sociaux',
        },
        {
          label: 'SEO',
          icon: 'i-lucide-search',
          to: '/admin/parametres/seo',
          active: route.path === '/admin/parametres/seo',
        },
      ],
    },
  ])

  // User menu items
  const userMenuItems = [
    [
      {
        label: 'Mode sombre',
        icon: 'i-lucide-palette',
        slot: 'color-mode' as const,
      },
      {
        label: 'Mon compte',
        icon: 'i-lucide-user-circle',
        slot: 'mon-compte' as const,
      },
    ],
    [
      {
        label: 'Se déconnecter',
        icon: 'i-lucide-log-out',
        slot: 'logout' as const,
      },
    ],
  ]
</script>

<template>
  <div>
    <!-- Desktop Layout -->
    <div class="hidden md:block">
      <UDashboardGroup>
        <UDashboardSidebar resizable :min-size="8" :default-size="10" :max-size="11" class="bg-card">
          <template #header>
            <div class="flex items-center justify-between">
              <NuxtLink to="/admin" class="flex items-center gap-2 flex-1 min-w-0">
                <span class="font-semibold text-gray-900 dark:text-white truncate group-data-[collapsible=icon]:hidden">
                  {{ siteName }}
                </span>
                <span
                  class="font-bold text-gray-900 dark:text-white hidden group-data-[collapsible=icon]:block text-xs">
                  ML
                </span>
              </NuxtLink>
              <UDashboardSidebarToggle
                class="group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:ml-0" />
            </div>
          </template>

          <UNavigationMenu :items="navigationItems" orientation="vertical" />

          <template #footer>
            <div class="w-full">
              <UDropdownMenu
                v-if="user"
                :items="userMenuItems"
                :popper="{ strategy: 'fixed', placement: 'top' }"
                :ui="{ content: 'w-50' }">
                <UButton
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto"
                  icon="i-lucide-user">
                  <span class="group-data-[collapsible=icon]:hidden">
                    {{ user?.firstName }} {{ user?.lastName || '' }}
                  </span>
                  <UIcon name="i-lucide-chevron-up" class="ml-auto group-data-[collapsible=icon]:hidden" />
                </UButton>

                <template #mon-compte>
                  <NuxtLink
                    to="/admin/profile"
                    class="flex items-center justify-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <UIcon name="i-lucide-user-circle" class="w-4 h-4" />
                    <span>Mon compte</span>
                  </NuxtLink>
                </template>

                <template #color-mode>
                  <div
                    class="flex items-center justify-center gap-2 w-full cursor-pointer"
                    @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
                    <UIcon
                      :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                      class="w-4 h-4"
                      :class="colorMode.value === 'dark' ? 'text-yellow-500' : 'text-blue-500'" />
                    <span>{{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}</span>
                  </div>
                </template>

                <template #logout>
                  <UButton
                    label="Se déconnecter"
                    icon="i-lucide-log-out"
                    color="error"
                    variant="ghost"
                    class="w-full justify-center"
                    @click="logout" />
                </template>
              </UDropdownMenu>
            </div>
          </template>
        </UDashboardSidebar>

        <UDashboardPanel class="overflow-y-auto">
          <UContainer class="pt-8 pb-8">
            <slot />
          </UContainer>
        </UDashboardPanel>
      </UDashboardGroup>
    </div>

    <!-- Mobile Layout -->
    <div class="md:hidden">
      <header class="bg-card border-b border-default sticky top-0 z-40">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-2">
            <UButton color="neutral" variant="ghost" icon="i-lucide-menu" size="xl" @click="toggleDrawer" />
            <NuxtLink to="/admin" class="flex items-center gap-2">
              <span class="font-semibold text-gray-900 dark:text-white">{{ siteName }}</span>
            </NuxtLink>
          </div>

          <UDropdownMenu
            v-if="user"
            :items="userMenuItems"
            :popper="{ strategy: 'fixed', placement: 'bottom-end' }"
            :ui="{ content: 'w-50' }">
            <UButton color="neutral" variant="ghost" icon="i-lucide-user" size="xl" />

            <template #mon-compte>
              <NuxtLink
                to="/admin/profile"
                class="flex items-center justify-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <UIcon name="i-lucide-user-circle" class="w-4 h-4" />
                <span>{{ user?.firstName }} {{ user?.lastName || '' }}</span>
              </NuxtLink>
            </template>

            <template #color-mode>
              <div
                class="flex items-center justify-center gap-2 w-full cursor-pointer"
                @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
                <UIcon
                  :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
                  class="w-4 h-4"
                  :class="colorMode.value === 'dark' ? 'text-yellow-500' : 'text-blue-500'" />
                <span>{{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}</span>
              </div>
            </template>

            <template #logout>
              <UButton
                label="Se déconnecter"
                icon="i-lucide-log-out"
                color="error"
                variant="ghost"
                class="w-full justify-center"
                @click="logout" />
            </template>
          </UDropdownMenu>
        </div>
      </header>

      <main class="p-4 pb-28">
        <slot />
      </main>

      <UDrawer v-model:open="isOpen" direction="left" :overlay="true">
        <template #content>
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-between p-4 border-b border-default">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-900 dark:text-white">{{ siteName }}</span>
              </div>
              <UButton color="neutral" variant="ghost" icon="i-lucide-x" size="xl" @click="closeDrawer" />
            </div>

            <div class="flex-1 overflow-y-auto p-4">
              <UNavigationMenu :items="navigationItems" orientation="vertical" @click="closeDrawer" />
            </div>
          </div>
        </template>
      </UDrawer>
    </div>
  </div>
</template>
