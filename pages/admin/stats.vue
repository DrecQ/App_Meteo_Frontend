<template>
  <div class="admin-page">
    <div v-if="loading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Chargement des statistiques...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>Erreur de chargement</h3>
      <p>Impossible de récupérer les statistiques. Veuillez réessayer plus tard.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Carte Total Utilisateurs -->
        <div class="stat-card bg-blue-500 text-white">
          <div class="stat-icon"><i class="fas fa-users"></i></div>
          <div class="stat-info">
            <p class="stat-title">Total Utilisateurs</p>
            <p class="stat-value">{{ stats.userCount }}</p>
          </div>
        </div>

        <!-- Carte Inscriptions (30j) -->
        <div class="stat-card bg-green-500 text-white">
          <div class="stat-icon"><i class="fas fa-user-plus"></i></div>
          <div class="stat-info">
            <p class="stat-title">Inscriptions (30j)</p>
            <p class="stat-value">{{ stats.newUsersCount }}</p>
          </div>
        </div>

        <!-- Carte Taux de complétion moyen -->
        <div class="stat-card bg-indigo-500 text-white">
          <div class="stat-icon"><i class="fas fa-tasks"></i></div>
          <div class="stat-info">
            <p class="stat-title">Complétion moyenne</p>
            <p class="stat-value">{{ stats.averageCompletion }}%</p>
          </div>
        </div>

        <!-- Carte Taux de réussite aux quiz -->
        <div class="stat-card bg-yellow-500 text-white">
          <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info">
            <p class="stat-title">Réussite aux quiz</p>
            <p class="stat-value">{{ stats.successRate }}%</p>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-4">Graphiques et Rapports</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="chart-container">
            <h3 class="chart-title">Inscriptions par mois</h3>
            <div class="chart-placeholder">Graphique à venir</div>
          </div>
          <div class="chart-container">
            <h3 class="chart-title">Cours les plus populaires</h3>
            <div class="chart-placeholder">Graphique à venir</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
});

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin/detailed-stats');
    stats.value = data;
  } catch (err) {
    error.value = err;
    console.error('Failed to load stats:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.admin-page {
  padding: 1rem;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.loading-state i, .error-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state i {
  color: #dc3545;
}

.stat-card {
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.stat-info .stat-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.stat-info .stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.chart-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #6c757d;
}
</style>