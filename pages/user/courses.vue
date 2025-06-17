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
        <h1>Mes Cours</h1>
        <div class="header-actions">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Rechercher un cours...">
          </div>
          <div class="filter-dropdown">
            <select v-model="selectedFilter">
              <option value="all">Tous les cours</option>
              <option value="in-progress">En cours</option>
              <option value="completed">Terminés</option>
              <option value="not-started">Non commencés</option>
            </select>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="courses-grid">
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-image">
              <img :src="course.image" :alt="course.title">
              <div class="course-status" :class="course.status">
                {{ getStatusText(course.status) }}
              </div>
            </div>
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <span><i class="fas fa-clock"></i> {{ course.duration }}</span>
                <span><i class="fas fa-star"></i> {{ course.rating }}/5</span>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: course.progress + '%' }"></div>
              </div>
              <p class="progress-text">{{ course.progress }}% complété</p>
            </div>
            <div class="course-actions">
              <button class="continue-btn" v-if="course.status === 'in-progress'">
                Continuer
              </button>
              <button class="start-btn" v-else-if="course.status === 'not-started'">
                Commencer
              </button>
              <button class="review-btn" v-else>
                Réviser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'user'
});

const isSidebarOpen = ref(false);
const searchQuery = ref('');
const selectedFilter = ref('all');

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  document.body.style.overflow = isSidebarOpen.value ? 'hidden' : '';
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
  document.body.style.overflow = '';
};

const courses = ref([
  {
    id: 1,
    title: 'Introduction à la météorologie',
    description: 'Les bases de la météorologie et du climat',
    image: '/images/courses/meteo-basics.jpg',
    duration: '4 heures',
    rating: 4.5,
    progress: 75,
    status: 'in-progress'
  },
  {
    id: 2,
    title: 'Instruments météorologiques',
    description: 'Apprentissage des outils de mesure',
    image: '/images/courses/instruments.jpg',
    duration: '3 heures',
    rating: 4.2,
    progress: 45,
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Prévisions météo',
    description: 'Techniques de prévision météorologique',
    image: '/images/courses/previsions.jpg',
    duration: '5 heures',
    rating: 4.8,
    progress: 0,
    status: 'not-started'
  },
  {
    id: 4,
    title: 'Climatologie',
    description: 'Étude des climats et de leurs variations',
    image: '/images/courses/climatologie.jpg',
    duration: '6 heures',
    rating: 4.7,
    progress: 100,
    status: 'completed'
  }
]);

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesFilter = selectedFilter.value === 'all' || course.status === selectedFilter.value;
    return matchesSearch && matchesFilter;
  });
});

const getStatusText = (status) => {
  const statusMap = {
    'in-progress': 'En cours',
    'completed': 'Terminé',
    'not-started': 'Non commencé'
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
.user-dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fc;
}

/* Styles de la sidebar */
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

/* Styles du contenu principal */
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
  align-items: center;
}

.search-bar {
  position: relative;
  width: 300px;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #4e73df;
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
}

.filter-dropdown select {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

/* Grille des cours */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  border: 1px solid #e9ecef;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.course-image {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-status {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.course-status.in-progress {
  background: #4e73df;
}

.course-status.completed {
  background: #2e7d32;
}

.course-status.not-started {
  background: #6c757d;
}

.course-info {
  padding: 1rem;
}

.course-info h3 {
  margin: 0 0 0.4rem;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.course-info p {
  margin: 0 0 0.8rem;
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 0.8rem;
  color: #6c757d;
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
}

.course-meta span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.progress-bar {
  height: 3px;
  background: #e9ecef;
  border-radius: 1.5px;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.progress {
  height: 100%;
  background: #4e73df;
  transition: width 0.2s ease;
}

.progress-text {
  color: #6c757d;
  font-size: 0.8rem;
  margin: 0;
}

.course-actions {
  padding: 0.8rem;
  border-top: 1px solid #e9ecef;
}

.continue-btn,
.start-btn,
.review-btn {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.continue-btn {
  background: #4e73df;
  color: white;
}

.continue-btn:hover {
  background: #224abe;
}

.start-btn {
  background: #2e7d32;
  color: white;
}

.start-btn:hover {
  background: #1b5e20;
}

.review-btn {
  background: #f8f9fc;
  color: #4e73df;
  border: 1px solid #4e73df;
}

.review-btn:hover {
  background: #4e73df;
  color: white;
}

/* Menu hamburger */
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

/* Media queries */
@media (max-width: 1200px) {
  .user-dashboard-content {
    padding: 1.5rem;
  }

  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
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
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-bar {
    width: 100%;
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

  .dashboard-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .courses-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .course-card {
    max-width: 100%;
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

  .course-info {
    padding: 1rem;
  }

  .course-actions {
    padding: 0.8rem 1rem;
  }
}

/* Optimisation des performances */
@media (prefers-reduced-motion: reduce) {
  .user-sidebar,
  .hamburger-menu,
  .course-card,
  .progress {
    transition: none;
  }
}
</style> 