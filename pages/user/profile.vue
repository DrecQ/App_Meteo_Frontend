<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Informations personnelles</h2>
          <div class="profile-info">
            <div class="info-group">
              <label>Nom</label>
              <p>{{ authStore.currentUser?.name }}</p>
            </div>
            <div class="info-group">
              <label>Email</label>
              <p>{{ authStore.currentUser?.email }}</p>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h2>Statistiques</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-book"></i>
              <div class="stat-info">
                <span class="stat-value">0</span>
                <span class="stat-label">Cours suivis</span>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-certificate"></i>
              <div class="stat-info">
                <span class="stat-value">0</span>
                <span class="stat-label">Certificats</span>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-clock"></i>
              <div class="stat-info">
                <span class="stat-value">0h</span>
                <span class="stat-label">Temps d'apprentissage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Vérifier si l'utilisateur est connecté
if (!authStore.isAuthenticated) {
  navigateTo('/login')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  padding: 2rem;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  text-align: center;
}

.profile-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.profile-header p {
  opacity: 0.8;
}

.profile-content {
  padding: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-section h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e6ed;
}

.profile-info {
  display: grid;
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group label {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

.info-group p {
  font-size: 1.1rem;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card i {
  font-size: 2rem;
  color: #3498db;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

@media (max-width: 640px) {
  .profile-page {
    padding: 5rem 1rem 1rem;
  }

  .profile-container {
    border-radius: 0;
  }

  .profile-header {
    padding: 1.5rem;
  }

  .profile-content {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style> 