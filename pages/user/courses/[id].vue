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
      <div class="course-detail">
        <div class="course-header">
          <button class="back-button" @click="router.push('/user/courses')">
            <i class="fas fa-arrow-left"></i>
            Retour aux cours
          </button>
          <div class="course-header-content">
            <h1>{{ course.title }}</h1>
            <div class="course-meta">
              <span class="course-level">{{ course.level }}</span>
              <span class="course-duration">{{ course.duration }}</span>
            </div>
            <p class="course-description">{{ course.description }}</p>
            <div class="course-progress">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${course.progress}%` }"></div>
              </div>
              <span class="progress-text">{{ course.progress }}% complété</span>
            </div>
          </div>
          <div class="course-image">
            <img :src="course.image" :alt="course.title" />
          </div>
        </div>

        <div class="course-content">
          <div class="course-modules">
            <h2>Modules du cours</h2>
            <div class="modules-list">
              <div
                v-for="module in course.modules"
                :key="module.id"
                class="module-item"
                :class="{ 'module-completed': module.completed }"
              >
                <div class="module-header" @click="toggleModule(module)">
                  <div class="module-info">
                    <i :class="module.completed ? 'fas fa-check-circle' : 'fas fa-circle'"></i>
                    <h3>{{ module.title }}</h3>
                  </div>
                  <div class="module-meta">
                    <span class="module-duration">{{ module.duration }}h</span>
                    <i class="fas fa-chevron-down" :class="{ 'rotate': module.isOpen }"></i>
                  </div>
                </div>
                <div class="module-content" v-if="module.isOpen">
                  <div class="lessons-list">
                    <div
                      v-for="lesson in module.lessons"
                      :key="lesson.id"
                      class="lesson-item"
                      :class="{ 'lesson-completed': lesson.completed }"
                    >
                      <div class="lesson-info">
                        <i :class="lesson.completed ? 'fas fa-check-circle' : 'far fa-circle'"></i>
                        <span>{{ lesson.title }}</span>
                      </div>
                      <div class="lesson-meta">
                        <span class="lesson-duration">{{ lesson.duration }}min</span>
                        <button
                          class="btn-start"
                          @click="startLesson(lesson)"
                          :disabled="!lesson.available"
                        >
                          {{ lesson.completed ? 'Revoir' : 'Commencer' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="course-sidebar">
            <div class="sidebar-section">
              <h3>Progression</h3>
              <div class="progress-stats">
                <div class="stat">
                  <span class="stat-value">{{ course.stats.completedLessons }}</span>
                  <span class="stat-label">Leçons terminées</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ course.stats.totalLessons }}</span>
                  <span class="stat-label">Leçons totales</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ course.stats.quizScore }}%</span>
                  <span class="stat-label">Score moyen</span>
                </div>
              </div>
            </div>

            <div class="sidebar-section">
              <h3>Ressources</h3>
              <div class="resources-list">
                <a
                  v-for="resource in course.resources"
                  :key="resource.id"
                  :href="resource.url"
                  class="resource-item"
                  target="_blank"
                >
                  <i :class="resource.icon"></i>
                  <span>{{ resource.title }}</span>
                </a>
              </div>
            </div>

            <div class="sidebar-section">
              <h3>Certificat</h3>
              <div class="certificate-info">
                <p>Obtenez votre certificat en complétant tous les modules du cours.</p>
                <button
                  class="btn-certificate"
                  :disabled="!course.certificateAvailable"
                  @click="downloadCertificate"
                >
                  Télécharger le certificat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  layout: 'user',
  middleware: ['user']
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isSidebarOpen = ref(false)

// Données du cours (à remplacer par un appel API)
const course = ref({
  id: 'introduction-meteo',
  title: 'Introduction à la Météorologie',
  description: 'Découvrez les bases de la météorologie et apprenez à comprendre les phénomènes météorologiques quotidiens.',
  duration: '20 minutes',
  level: 'Débutant',
  image: '/images/courses/ciel.jpg',
  progress: 75,
  stats: {
    completedLessons: 15,
    totalLessons: 20,
    quizScore: 85
  },
  modules: [
    {
      id: 1,
      title: 'Les bases de la météorologie',
      duration: 5,
      completed: true,
      isOpen: true,
      lessons: [
        {
          id: 1,
          title: 'Introduction à l\'atmosphère',
          duration: 30,
          completed: true,
          available: true
        },
        {
          id: 2,
          title: 'Les éléments météorologiques',
          duration: 45,
          completed: true,
          available: true
        },
        {
          id: 3,
          title: 'Les instruments de mesure',
          duration: 40,
          completed: false,
          available: true
        }
      ]
    },
    {
      id: 2,
      title: 'Les nuages et les précipitations',
      duration: 8,
      completed: false,
      isOpen: false,
      lessons: [
        {
          id: 4,
          title: 'Types de nuages',
          duration: 35,
          completed: false,
          available: false
        },
        {
          id: 5,
          title: 'Formation des précipitations',
          duration: 40,
          completed: false,
          available: false
        }
      ]
    }
  ],
  resources: [
    {
      id: 1,
      title: 'Guide de météorologie',
      icon: 'fas fa-book',
      url: '#'
    },
    {
      id: 2,
      title: 'Fiches pratiques',
      icon: 'fas fa-file-alt',
      url: '#'
    },
    {
      id: 3,
      title: 'Vidéos explicatives',
      icon: 'fas fa-video',
      url: '#'
    }
  ],
  certificateAvailable: false
})

const toggleModule = (module) => {
  module.isOpen = !module.isOpen
}

const startLesson = (lesson) => {
  // Logique pour démarrer une leçon
  console.log('Démarrage de la leçon:', lesson)
}

const downloadCertificate = () => {
  // Logique pour télécharger le certificat
  console.log('Téléchargement du certificat')
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
.course-detail {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: none;
  border-radius: 6px;
  color: #4a5568;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s;
}

.back-button:hover {
  background: #edf2f7;
}

.course-header {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-bottom: 3rem;
}

.course-header-content h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.course-level,
.course-duration {
  background: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a5568;
}

.course-description {
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #3498db;
  border-radius: 4px;
}

.progress-text {
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.course-image {
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.course-modules h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.module-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.module-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.module-header:hover {
  background: #f7fafc;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.module-info i {
  color: #3498db;
  font-size: 1.2rem;
}

.module-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.module-duration {
  color: #718096;
  font-size: 0.9rem;
}

.module-meta i {
  color: #718096;
  transition: transform 0.3s;
}

.module-meta i.rotate {
  transform: rotate(180deg);
}

.module-content {
  border-top: 1px solid #e2e8f0;
}

.lessons-list {
  padding: 1rem 1.5rem;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.lesson-item:hover {
  background: #f7fafc;
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-info i {
  color: #3498db;
  font-size: 1rem;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-duration {
  color: #718096;
  font-size: 0.9rem;
}

.btn-start {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-start:hover {
  background: #2980b9;
}

.btn-start:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-section h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  color: #3498db;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
  color: #4a5568;
  text-decoration: none;
  transition: background-color 0.3s;
}

.resource-item:hover {
  background: #edf2f7;
}

.resource-item i {
  color: #3498db;
}

.certificate-info {
  text-align: center;
}

.certificate-info p {
  color: #718096;
  margin-bottom: 1rem;
}

.btn-certificate {
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-certificate:hover:not(:disabled) {
  background: #2980b9;
}

.btn-certificate:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

/* Media queries */
@media (max-width: 1024px) {
  .course-header {
    grid-template-columns: 1fr;
  }

  .course-image {
    height: 200px;
  }

  .course-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .course-detail {
    padding: 1rem;
  }

  .course-header-content h1 {
    font-size: 1.5rem;
  }

  .progress-stats {
    grid-template-columns: 1fr;
  }
}
</style> 