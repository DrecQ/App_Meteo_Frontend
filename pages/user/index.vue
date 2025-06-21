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
        <span class="sidebar-title">Michel Ange</span>
      </div>
      <nav class="sidebar-nav">
        <button @click="handleHomeClick" class="sidebar-link home-link">
          <i class="fas fa-home"></i> Retour à l'accueil
        </button>
        <div class="sidebar-divider"></div>
        <NuxtLink to="/user" class="sidebar-link" exact-active-class="active" @click="closeSidebar">
          <i class="fas fa-tachometer-alt"></i> Tableau de bord
        </NuxtLink>
        <NuxtLink to="/user/courses" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-book"></i> Mes cours
        </NuxtLink>
        <NuxtLink to="/user/certificates" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-certificate"></i> Certificats
        </NuxtLink>
        <NuxtLink to="/user/community-chat" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-comments"></i> Chat communautaire
        </NuxtLink>
        <NuxtLink to="/user/profile" class="sidebar-link" active-class="active" @click="closeSidebar">
          <i class="fas fa-user"></i> Profil
        </NuxtLink>
        <button @click="handleLogout" class="sidebar-link logout">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </button>
      </nav>
    </aside>

    <div class="user-dashboard-content">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {{ authStore.currentUser?.name }}</p>
      </div>

      <div class="dashboard-content">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'user',
  middleware: ['user']
})

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)

// Valeurs statiques pour la simulation
const stats = ref({
  courses: 5,
  certificates: 2,
  learningTime: '12h',
})

const recentCourses = ref([
  { title: 'Introduction à la météorologie', date: '10/06/2024', progress: 100 },
  { title: 'Prévisions saisonnières', date: '05/06/2024', progress: 60 },
  { title: 'Climat du Bénin', date: '01/06/2024', progress: 80 },
])

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
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
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
</style>