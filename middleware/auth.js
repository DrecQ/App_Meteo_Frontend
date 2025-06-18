export default defineNuxtRouteMiddleware((to) => {
  // Vérifier si nous sommes côté client
  if (process.client) {
    const authStore = useAuthStore()
    
    // Vérifier l'authentification
    const isAuthenticated = authStore.checkAuth()
    
    if (!isAuthenticated) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
}) 