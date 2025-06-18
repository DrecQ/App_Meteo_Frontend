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

    <UserSidebar
      :is-sidebar-open="isSidebarOpen"
      @close="closeSidebar"
      @home-click="handleHomeClick"
      @logout="handleLogout"
    />

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Mes cours</h1>
        <p>Retrouvez tous vos cours et votre progression</p>
      </div>

      <div class="dashboard-content">
        <!-- Filtres -->
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Rechercher un cours..."
            >
          </div>
          <div class="filter-group">
            <select v-model="statusFilter" class="filter-select">
              <option value="">Tous les cours</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminés</option>
              <option value="not_started">Non commencés</option>
            </select>
          </div>
        </div>

        <!-- Liste des cours -->
        <div class="courses-grid" v-if="filteredCourses.length > 0">
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-image">
              <img :src="course.image" :alt="course.title">
            </div>
            <div class="course-content">
              <h3>{{ course.title }}</h3>
              <div class="course-meta">
                <span class="course-level">{{ course.level }}</span>
                <span class="course-duration">{{ course.duration }}</span>
              </div>
              <div class="course-progress">
                <div class="progress-bar">
                  <div class="progress" :style="{ width: `${course.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ course.progress }}% complété</span>
              </div>
              <button @click="viewCourse(course.id)" class="course-button">
                {{ course.progress > 0 ? 'Continuer' : 'Commencer' }}
              </button>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div class="empty-state" v-else>
          <i class="fas fa-book-open"></i>
          <p>Vous n'avez pas encore commencé de cours</p>
          <NuxtLink to="/courses" class="btn-primary">
            Découvrir les cours
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'user',
  middleware: ['user']
})

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

// Données des cours (à remplacer par un appel API)
const userCourses = ref([
  {
    id: 'introduction-meteo',
    title: 'Introduction à la Météorologie',
    duration: '20 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    progress: 75
  },
  {
    id: 'secrets-du-ciel',
    title: 'Les Secrets du Ciel',
    duration: '30 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    progress: 0
  }
])

// Filtrage des cours
const filteredCourses = computed(() => {
  return userCourses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         course.duration.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || course.progress > 0
    return matchesSearch && matchesStatus
  })
})

const viewCourse = (courseId) => {
  router.push(`/course/${courseId}`)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isSidebarOpen.value) {
    document.body.classList.add('sidebar-open')
    document.body.style.overflow = 'hidden'
  } else {
    document.body.classList.remove('sidebar-open')
    document.body.style.overflow = ''
  }
}

const closeSidebar = () => {
  isSidebarOpen.value = false
  document.body.classList.remove('sidebar-open')
  document.body.style.overflow = ''
}

const handleHomeClick = () => {
  closeSidebar()
  router.push('/')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Nettoyer les classes lors du démontage du composant
onUnmounted(() => {
  document.body.classList.remove('sidebar-open')
  document.body.style.overflow = ''
})
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
  transition: transform 0.3s ease;
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

.home-link {
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.home-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffe082;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
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
  border: none;
  cursor: pointer;
}

.sidebar-link.logout:hover {
  background: #c0392b;
}

/* Styles du contenu principal */
.user-dashboard-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.dashboard-header p {
  color: #7f8c8d;
  margin: 0;
}

/* Cours */
.courses-grid {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.empty-state p {
  margin: 0 0 1.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #4e73df;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #224abe;
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
@media (max-width: 1024px) {
  .hamburger-menu {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }

  .user-sidebar {
    transform: translateX(-100%);
  }

  .user-sidebar.open {
    transform: translateX(0);
  }

  body.sidebar-open .user-sidebar {
    transform: translateX(0);
  }

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }
}

@media (max-width: 768px) {
  .user-sidebar {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
  }
}

/* Styles pour les filtres */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-width: 150px;
}

/* Styles pour la grille de cours */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  height: 160px;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-content {
  padding: 1rem;
}

.course-content h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.course-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.course-level,
.course-duration {
  background: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #4a5568;
}

.course-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress {
  height: 100%;
  background: #3498db;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #718096;
  font-size: 0.8rem;
}

.course-button {
  width: 100%;
  padding: 0.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.course-button:hover {
  background: #2980b9;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: #2980b9;
}

/* Media queries */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}
</style> 