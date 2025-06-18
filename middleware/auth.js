export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Vérifier si l'utilisateur est authentifié
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion avec le retour prévu
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
}) 