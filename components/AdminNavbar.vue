<template>
  <nav class="admin-navbar">
    <div class="navbar-header">
      <h1>METEO-BENIN</h1>
    </div>

    <div class="navbar-content">
      <NuxtLink to="/admin" class="nav-item" active-class="active">
        <i class="fas fa-home"></i>
        <span>Tableau de bord</span>
      </NuxtLink>

      <NuxtLink to="/admin/courses" class="nav-item" active-class="active">
        <i class="fas fa-book"></i>
        <span>Cours</span>
      </NuxtLink>

      <NuxtLink to="/admin/stats" class="nav-item" active-class="active">
        <i class="fas fa-chart-bar"></i>
        <span>Statistiques</span>
      </NuxtLink>

      <NuxtLink to="/admin/users" class="nav-item" active-class="active">
        <i class="fas fa-users"></i>
        <span>Utilisateurs</span>
      </NuxtLink>

      <NuxtLink to="/admin/messages" class="nav-item" active-class="active">
        <i class="fas fa-envelope"></i>
        <span>Messages</span>
      </NuxtLink>

      <NuxtLink to="/admin/bulletin" class="nav-item" active-class="active">
        <i class="fas fa-newspaper"></i>
        <span>Bulletin</span>
      </NuxtLink>
    </div>

    <div class="navbar-footer">
      <NuxtLink to="/" class="nav-item">
        <i class="fas fa-sign-out-alt"></i>
        <span>Retour au site</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.admin-navbar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.navbar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.navbar-content {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: #3498db;
  color: white;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.navbar-footer {
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .admin-navbar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .admin-navbar.open {
    transform: translateX(0);
  }
}
</style> 