import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification au démarrage de l'application
  nuxtApp.hook('app:created', () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        try {
          authStore.setToken(token)
          authStore.setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Erreur lors de la récupération des données d\'authentification:', error)
          authStore.logout()
        }
      }
    }
  })

  // Vérifier l'authentification avant chaque navigation
  nuxtApp.hook('app:beforeMount', () => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (!token || !userData) {
        authStore.logout()
      }
    }
  })
}) 