interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  success: boolean
  user?: any
}

export const useAuth = () => {
  const { loggedIn, user, session, clear, fetch: fetchSession } = useUserSession()

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })

      if (response.success && response.user) {
        await fetchSession()
        return { success: true, user: response.user }
      }

      throw new Error('Login failed')
    }
    catch (error) {
      const errorMessage
        = (error as { data?: { message?: string }, message?: string }).data?.message
        || (error as Error).message
        || 'Login failed'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })

      await clear()
      await navigateTo('/')
    }
    catch (error) {
      console.error('Logout error:', error)
      await clear()
      await navigateTo('/')
    }
  }

  const init = async () => {
    return await fetchSession()
  }

  const fetchUser = async () => {
    return await fetchSession()
  }

  const updateProfile = async (data: { firstName: string; lastName?: string | null; email: string }) => {
    const response = await $fetch('/api/user/profile', {
      method: 'PUT',
      body: data,
    })
    await fetchUser() // Refresh user data
    return response
  }

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    return await $fetch('/api/user/password', {
      method: 'PUT',
      body: data,
    })
  }

  return {
    user,
    loggedIn,
    session,
    isLoading: computed(() => false),
    login,
    logout,
    init,
    fetchUser,
    updateProfile,
    changePassword,
    isAuthenticated: loggedIn,
    clear,
  }
}
