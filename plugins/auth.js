import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()
  // Initialiser l'authentification locale au démarrage
  if (process.client) {
    authStore.initializeAuth()
  }
}) 