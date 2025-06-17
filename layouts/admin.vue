<template>
  <div class="admin-layout">
    <AdminNavbar />
    <div class="admin-content">
      <div class="admin-header">
        <h1>{{ currentPageTitle }}</h1>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const path = route.path
  if (path.includes('/admin/courses')) return 'Gestion des cours'
  if (path.includes('/admin/teachers')) return 'Gestion des enseignants'
  if (path.includes('/admin/users')) return 'Gestion des utilisateurs'
  if (path.includes('/admin/messages')) return 'Gestion des messages'
  return 'Tableau de bord'
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: #f8f9fa;
}

.admin-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.admin-header h1 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style> 