import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification au démarrage
  if (process.client) {
    authStore.checkAuth()
  }
}) 