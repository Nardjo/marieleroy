export default defineNuxtRouteMiddleware(to => {
  if (!to.path.startsWith('/admin') || to.path === '/connexion') {
    return
  }

  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/connexion')
  }

  // @ts-expect-error - nuxt-auth-utils User type doesn't include role by default
  if (user.value?.role !== 'ADMIN') {
    return navigateTo('/connexion')
  }
})
