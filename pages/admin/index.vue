<template>
  <div>
    <!-- Le H1 est maintenant dans le layout, on peut le supprimer d'ici si on le souhaite -->
    <!-- <h1 class="text-3xl font-bold mb-6">Tableau de bord</h1> -->

    <div v-if="loading" class="text-center">
      <p>Chargement des statistiques...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      <p>Erreur lors du chargement des statistiques : {{ error.message }}</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Carte Utilisateurs -->
      <div class="stat-card bg-blue-500 text-white">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
          <p class="stat-title">Utilisateurs</p>
          <p class="stat-value">{{ stats.userCount }}</p>
        </div>
      </div>

      <!-- Carte Cours -->
      <div class="stat-card bg-green-500 text-white">
        <div class="stat-icon">
          <i class="fas fa-book-open"></i>
        </div>
        <div class="stat-info">
          <p class="stat-title">Cours</p>
          <p class="stat-value">{{ stats.courseCount }}</p>
        </div>
      </div>

      <!-- Carte Quiz -->
      <div class="stat-card bg-yellow-500 text-white">
        <div class="stat-icon">
          <i class="fas fa-question-circle"></i>
        </div>
        <div class="stat-info">
          <p class="stat-title">Quiz Classiques</p>
          <p class="stat-value">{{ stats.quizCount }}</p>
        </div>
      </div>

      <!-- Carte Questions Communauté -->
      <div class="stat-card bg-purple-500 text-white">
        <div class="stat-icon">
          <i class="fas fa-comments"></i>
        </div>
        <div class="stat-info">
          <p class="stat-title">Questions (Comm.)</p>
          <p class="stat-value">{{ stats.questionCount }}</p>
        </div>
      </div>
    </div>

    <!-- Section d'actions rapides -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-4">Actions rapides</h2>
      <div class="flex flex-wrap gap-4">
        <NuxtLink to="/admin/courses" class="quick-action-btn">
          <i class="fas fa-plus-circle mr-2"></i> Gérer les cours
        </NuxtLink>
        <NuxtLink to="/admin/users" class="quick-action-btn">
          <i class="fas fa-user-edit mr-2"></i> Gérer les utilisateurs
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  // middleware: 'admin-auth' // À activer quand l'authentification admin sera prête
});

const stats = ref({
  userCount: 0,
  courseCount: 0,
  quizCount: 0,
  questionCount: 0,
});

const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await $fetch('/api/admin/stats');
    stats.value = data;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* On retire le padding du conteneur principal car il est géré par le layout */
.admin-dashboard {
  /* padding: 2rem; */
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

.quick-action-btn {
  background-color: #f8f9fa;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background-color: #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>