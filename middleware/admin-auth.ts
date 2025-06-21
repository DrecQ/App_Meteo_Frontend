export default defineNuxtRouteMiddleware((to, from) => {
  // Ce middleware protège les routes de la section /admin

  // Nous utilisons le store `useAuthStore` qui devrait être initialisé
  // par un plugin au démarrage de l'app.
  const auth = useAuthStore();

  // Si le store n'est pas encore prêt ou si l'utilisateur n'est pas connecté
  if (!auth.isAuthenticated) {
    // On le redirige vers la page de login avec un message et une redirection après connexion
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath,
        error: 'Vous devez être administrateur pour accéder à cette page.'
      }
    });
  }

  // Si l'utilisateur est connecté mais n'a pas le rôle 'ADMIN'
  if (auth.user?.role !== 'ADMIN') {
    // On interdit l'accès. On pourrait le rediriger vers son propre dashboard
    // ou afficher une page 403 (Interdit).
    return abortNavigation({
      statusCode: 403,
      statusMessage: 'Accès interdit',
      message: 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.'
    });
  }

  // Si tout est en ordre (connecté et admin), on le laisse passer.
}); 