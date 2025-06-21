<template>
  <div class="admin-layout">
    <AdminNavbar />
    <main class="admin-main-content">
      <header class="admin-header">
        <h1>{{ currentPageTitle }}</h1>
        <div class="header-actions">
          <slot name="header-actions" />
        </div>
      </header>
      <div class="page-content">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const path = route.path
  
  if (path.startsWith('/admin/quizzes/')) return 'Gestion des Questions'
  if (path.startsWith('/admin/courses/')) return 'Gestion des Quiz'
  if (path.startsWith('/admin/courses')) return 'Gestion des Cours'
  if (path.startsWith('/admin/teachers')) return 'Gestion des Enseignants'
  if (path.startsWith('/admin/users')) return 'Gestion des Utilisateurs'
  if (path.startsWith('/admin/messages')) return 'Gestion des Messages'
  if (path.startsWith('/admin')) return 'Tableau de Bord'
  
  return 'Administration'
})

definePageMeta({
  middleware: 'admin-auth'
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-main-content {
  flex: 1;
  margin-left: 250px; /* Largeur de la barre de navigation latérale */
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.admin-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .admin-main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style> 