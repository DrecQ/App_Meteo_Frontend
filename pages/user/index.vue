<template>
  <div class="user-dashboard-layout">
    <!-- Menu hamburger pour mobile -->
    <button class="hamburger-menu" @click="toggleSidebar" :class="{ 'active': isSidebarOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay pour fermer la sidebar sur mobile -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>

    <aside class="user-sidebar" :class="{ 'open': isSidebarOpen }">
      <div class="sidebar-header">
        <i class="fas fa-user-circle sidebar-logo"></i>
        <span class="sidebar-title">Espace Membre</span>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/user" class="sidebar-link" exact-active-class="active" @click="closeSidebar">
          <i class="fas fa-tachometer-alt"></i> Tableau de bord
        </NuxtLink>
        <NuxtLink to="/user/courses" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-book"></i> Mes cours
        </NuxtLink>
        <NuxtLink to="/user/certificates" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-certificate"></i> Certificats
        </NuxtLink>
        <NuxtLink to="/user/profile" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-user"></i> Profil
        </NuxtLink>
        <NuxtLink to="/logout" class="sidebar-link logout" @click="closeSidebar">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </NuxtLink>
      </nav>
    </aside>
    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <div class="header-actions">
          <button class="refresh-btn" @click="refreshData">
            <i class="fas fa-sync-alt"></i>
            Actualiser
          </button>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-info">
              <h3>Cours suivis</h3>
              <p class="stat-value">12</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-certificate"></i>
            </div>
            <div class="stat-info">
              <h3>Certificats</h3>
              <p class="stat-value">3</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>Heures d'apprentissage</h3>
              <p class="stat-value">24h</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <h3>Points</h3>
              <p class="stat-value">450</p>
            </div>
          </div>
        </div>

        <div class="dashboard-sections">
          <div class="section">
            <h2>Cours en cours</h2>
            <div class="course-list">
              <div class="course-card" v-for="course in currentCourses" :key="course.id">
                <div class="course-info">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="progress-bar">
                    <div class="progress" :style="{ width: course.progress + '%' }"></div>
                  </div>
                  <p class="progress-text">{{ course.progress }}% complété</p>
                </div>
                <button class="continue-btn">Continuer</button>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Activités récentes</h2>
            <div class="activity-list">
              <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                <div class="activity-icon">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-info">
                  <p class="activity-text">{{ activity.text }}</p>
                  <p class="activity-time">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'user'
});

const currentCourses = ref([
  {
    id: 1,
    title: 'Introduction à la météorologie',
    description: 'Les bases de la météorologie et du climat',
    progress: 75
  },
  {
    id: 2,
    title: 'Instruments météorologiques',
    description: 'Apprentissage des outils de mesure',
    progress: 45
  },
  {
    id: 3,
    title: 'Prévisions météo',
    description: 'Techniques de prévision météorologique',
    progress: 30
  }
]);

const recentActivities = ref([
  {
    id: 1,
    icon: 'fas fa-book',
    text: 'Vous avez terminé le chapitre 3 de "Introduction à la météorologie"',
    time: 'Il y a 2 heures'
  },
  {
    id: 2,
    icon: 'fas fa-certificate',
    text: 'Vous avez obtenu un certificat en "Instruments météorologiques"',
    time: 'Il y a 1 jour'
  },
  {
    id: 3,
    icon: 'fas fa-star',
    text: 'Vous avez gagné 50 points en complétant un quiz',
    time: 'Il y a 2 jours'
  }
]);

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  // Empêcher le défilement du body quand la sidebar est ouverte
  document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  document.body.style.overflow = '';
};

const refreshData = () => {
  console.log('Rafraîchissement des données...');
};
</script>

<style scoped>
.user-dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fc;
}

.user-sidebar {
  width: 250px;
  background: linear-gradient(135deg, #4e73df 60%, #224abe 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem 0 1rem;
  box-shadow: 2px 0 8px rgba(0,0,0,0.07);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.sidebar-logo {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 1rem;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.sidebar-link:hover,
.sidebar-link.active {
  background: rgba(255,255,255,0.15);
  color: #ffe082;
  transform: translateX(4px);
}

.sidebar-link.logout {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: #e74c3c;
  color: #fff;
  justify-content: center;
  border-radius: 6px;
  padding: 1rem;
}

.sidebar-link.logout:hover {
  background: #c0392b;
  color: #fff;
}

.user-dashboard-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: #224abe;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #4e73df;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #6c757d;
}

.stat-value {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section h2 {
  margin: 0 0 1.5rem;
  color: #2c3e50;
  font-size: 1.3rem;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-card {
  background: #f8f9fc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.course-info {
  flex: 1;
}

.course-info h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.course-info p {
  margin: 0 0 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: #4e73df;
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0;
}

.continue-btn {
  padding: 0.5rem 1rem;
  background: #4e73df;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-btn:hover {
  background: #224abe;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fc;
  border-radius: 8px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #4e73df;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-info {
  flex: 1;
}

.activity-text {
  margin: 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.activity-time {
  margin: 0.25rem 0 0;
  color: #6c757d;
  font-size: 0.8rem;
}

/* Styles pour le menu hamburger */
.hamburger-menu {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #4e73df;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.hamburger-menu span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Overlay pour la sidebar mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Modifications pour le responsive */
@media (max-width: 1200px) {
  .user-dashboard-content {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .dashboard-sections {
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .hamburger-menu {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }

  .user-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 280px;
  }

  .user-sidebar.open {
    transform: translateX(0);
  }

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-sections {
    grid-template-columns: 1fr;
  }

  .course-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .continue-btn {
    width: 100%;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .user-sidebar {
    width: 100%;
    max-width: 280px;
  }

  .hamburger-menu {
    top: 0.5rem;
    left: 0.5rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .stat-icon {
    margin: 0 auto;
  }

  .course-card {
    padding: 0.8rem;
  }

  .course-info h3 {
    font-size: 1rem;
  }

  .course-info p {
    font-size: 0.85rem;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .activity-icon {
    margin: 0 auto;
  }
}

/* Améliorations des transitions */
.user-sidebar,
.hamburger-menu,
.stat-card,
.course-card,
.activity-item {
  transition: all 0.3s ease;
}

/* Optimisation des performances */
@media (prefers-reduced-motion: reduce) {
  .user-sidebar,
  .hamburger-menu,
  .stat-card,
  .course-card,
  .activity-item {
    transition: none;
  }
}
</style>