export default defineNuxtRouteMiddleware((to, from) => {
  // Si on quitte l'espace utilisateur, on ferme la sidebar
  if (from.path.startsWith('/user') && !to.path.startsWith('/user')) {
    // On supprime la classe qui garde la sidebar ouverte
    document.body.classList.remove('sidebar-open')
    document.body.style.overflow = ''
  }
}) 