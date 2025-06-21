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

    <!-- Utilisation du composant UserSidebar -->
    <UserSidebar 
      :is-sidebar-open="isSidebarOpen"
      @close="closeSidebar"
      @home-click="handleHomeClick"
      @logout="handleLogout"
    />

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {{ authStore.user?.name || 'Utilisateur' }}</p>
      </div>

      <div class="dashboard-content">
        <!-- Informations utilisateur -->
        <div class="user-info-section">
          <div class="user-info-card">
            <div class="user-avatar-large">
              <img 
                :src="authStore.user?.avatar || '/default-avatar.svg'" 
                :alt="authStore.user?.name || 'Utilisateur'"
                @error="handleAvatarError"
              />
            </div>
            <div class="user-details">
              <h2>{{ authStore.user?.name || 'Utilisateur' }}</h2>
              <p class="user-email">{{ authStore.user?.email }}</p>
              <p class="user-domain" v-if="authStore.user?.domaineActivite">
                <i class="fas fa-briefcase"></i>
                {{ authStore.user.domaineActivite }}
              </p>
              <p class="user-join-date">
                <i class="fas fa-calendar"></i>
                Membre depuis {{ formatDate(authStore.user?.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-book"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.courses }}</h3>
              <p>Cours suivis</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-certificate"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.certificates }}</h3>
              <p>Certificats</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>{{ stats.learningTime }}</h3>
              <p>Temps d'apprentissage</p>
            </div>
          </div>
        </div>

        <!-- Cours récents -->
        <div class="recent-courses">
          <h2>Cours récents</h2>
          <div class="courses-grid">
            <div v-for="course in recentCourses" :key="course.title" class="course-card">
              <div class="course-card-header">
                <h4 class="course-title">{{ course.title }}</h4>
                <span class="course-date">{{ course.date }}</span>
              </div>
              <div class="course-progress-bar">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: course.progress + '%' }"></div>
                </div>
                <span class="progress-label">{{ course.progress }}% complété</span>
              </div>
              <button class="btn-primary" style="margin-top: 1rem;" @click="router.push(`/user/course/${course.id}`)">Accéder au cours</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import UserSidebar from '~/components/UserSidebar.vue'

definePageMeta({
  layout: 'user',
  middleware: ['user']
})

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)

// Propriétés calculées pour les statistiques
const stats = computed(() => {
  const userCourses = authStore.user?.courses || []
  const userCertificates = authStore.user?.certificates || []
  
  // Calcul du temps d'apprentissage en sommant la durée des cours
  const totalMinutes = userCourses.reduce((sum, course) => {
    // Extrait le nombre de la chaîne "XX minutes"
    const durationInMinutes = parseInt(course.duration, 10) || 0
    return sum + durationInMinutes
  }, 0)
  
  const learningTimeHours = totalMinutes / 60
  
  return {
    courses: userCourses.length,
    certificates: userCertificates.length,
    learningTime: `${learningTimeHours.toFixed(1)}h`
  }
})

// Propriétés calculées pour les cours récents
const recentCourses = computed(() => {
  const userCourses = authStore.user?.courses || []
  const completedLessons = authStore.user?.completedLessons || []

  return userCourses.slice(0, 3).map(course => {
    const courseLessons = course.lessons || []
    const completedInCourse = completedLessons.filter(cl => 
      courseLessons.some(l => l.id === cl.lessonId)
    )
    
    const progress = courseLessons.length > 0
      ? Math.round((completedInCourse.length / courseLessons.length) * 100)
      : 0
      
    return {
      ...course,
      progress: progress,
      date: formatDate(course.createdAt) // ou une autre date pertinente
    }
  })
})

// Vérifier si l'utilisateur est connecté
if (!authStore.isAuthenticated) {
  navigateTo('/login')
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

const handleAvatarError = (event) => {
  // En cas d'erreur de chargement de l'avatar, utiliser l'avatar par défaut
  event.target.src = '/default-avatar.svg'
}

const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #4e73df;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Cours récents */
.recent-courses {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-courses h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
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

  .user-dashboard-content {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .user-dashboard-content {
    padding: 0.8rem;
  }

  .dashboard-header h1 {
    font-size: 1.4rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.2s;
}

.course-card:hover {
  box-shadow: 0 6px 18px rgba(44, 62, 80, 0.13);
}

.course-card-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
}

.course-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2563eb;
}

.course-date {
  font-size: 0.95rem;
  color: #7f8c8d;
}

.course-progress-bar {
  width: 100%;
  margin: 0.5rem 0 0.2rem 0;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #e0e6ed;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #10b981);
  border-radius: 4px;
  transition: width 0.4s;
}

.progress-label {
  font-size: 0.92rem;
  color: #2563eb;
  margin-top: 0.2rem;
  display: inline-block;
}

.btn-primary {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Informations utilisateur */
.user-info-section {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
}

.user-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.user-details .user-email {
  margin-bottom: 0.5rem;
}

.user-details .user-domain {
  margin-bottom: 0.5rem;
}

.user-details .user-join-date {
  margin-bottom: 0;
}

.user-details .user-domain i {
  margin-right: 0.5rem;
}
</style>