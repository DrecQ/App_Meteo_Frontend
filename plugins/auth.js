import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification au démarrage
  await authStore.checkAuth()
}) 