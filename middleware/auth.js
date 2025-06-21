export default defineNuxtRouteMiddleware((to) => {
  // Vérifier si nous sommes côté client
  if (process.client) {
    const authStore = useAuthStore()
    authStore.initializeAuth()
    if (!authStore.isAuthenticated) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
}) 