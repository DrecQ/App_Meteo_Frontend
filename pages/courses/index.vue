<template>
  <div class="courses-container">
    <h1 class="text-2xl font-bold mb-6">Nos Cours</h1>
    
    <!-- Bouton de test pour la connexion -->
    <div class="mb-6">
      <button @click="toggleAuth" class="btn-primary">
        {{ isAuthenticated ? 'Se déconnecter' : 'Se connecter' }}
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="course-image">
          <img :src="course.image" :alt="course.title" class="w-full h-48 object-cover rounded-t-lg">
        </div>
        <div class="course-content p-4">
          <h2 class="text-xl font-semibold mb-2">{{ course.title }}</h2>
          <p class="text-gray-600 mb-4">{{ course.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ course.duration }}</span>
            <button 
              @click="handleCourseAccess(course.id)"
              class="btn-primary"
            >
              {{ course.id === 'introduction' ? 'Commencer' : (isAuthenticated ? 'Commencer' : 'Se connecter') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Fonction de test pour la connexion/déconnexion
const toggleAuth = () => {
  if (isAuthenticated.value) {
    authStore.logout()
  } else {
    authStore.login()
  }
}

const handleCourseAccess = (courseId) => {
  if (courseId === 'introduction' || isAuthenticated.value) {
    router.push(`/course/${courseId}`)
  } else {
    router.push('/login')
  }
}

const courses = [
  {
    id: 'introduction',
    title: 'Introduction à la Météo',
    description: 'Découvrez les bases de la météorologie et apprenez à comprendre les phénomènes météorologiques quotidiens.',
    duration: '2 heures',
    image: '/images/courses/introduction.jpg'
  },
  {
    id: 'instruments',
    title: 'Les Instruments Météorologiques',
    description: 'Apprenez à utiliser les différents instruments de mesure météorologique et à interpréter leurs données.',
    duration: '3 heures',
    image: '/images/courses/instruments.jpg'
  },
  {
    id: 'phenomenes',
    title: 'Les Phénomènes Météorologiques',
    description: 'Explorez les différents phénomènes météorologiques et leurs mécanismes de formation.',
    duration: '4 heures',
    image: '/images/courses/phenomenes.jpg'
  },
  {
    id: 'saisons',
    title: 'Les Saisons et le Climat',
    description: 'Comprenez les variations saisonnières et les différents types de climats à travers le monde.',
    duration: '3 heures',
    image: '/images/courses/saisons.jpg'
  },
  {
    id: 'secrets',
    title: 'Les Secrets du Ciel',
    description: 'Découvrez les mystères des nuages, des arcs-en-ciel et autres phénomènes célestes.',
    duration: '2 heures',
    image: '/images/courses/secrets.jpg'
  }
]
</script>

<style scoped>
.courses-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.course-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-image {
  position: relative;
  overflow: hidden;
}

.course-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style> 