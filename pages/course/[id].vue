<template>
  <div class="course-content">
    <div class="container">
      <!-- En-tête amélioré avec bouton de retour -->
      <div class="course-header">
        <button class="back-button" @click="$router.go(-1)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour
        </button>
        <div class="header-content">
          <h1>{{ course.title }}</h1>
          <div class="course-meta">
            <div class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2"/>
                <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ course.instructor }}</span>
            </div>
            <div class="meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ course.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="course-layout">
        <!-- Contenu principal amélioré -->
        <div class="main-content">
          <div class="video-container" :class="{ 'has-audio': currentLesson.audioUrl }">
            <div v-if="currentLesson.videoUrl" class="video-wrapper">
              <video 
                ref="videoPlayer"
                :src="currentLesson.videoUrl"
                controls
                class="course-video"
                @ended="markLessonCompleted"
              ></video>
              <div class="video-overlay" @click="togglePlay">
                <button class="play-button" :class="{ 'hidden': isPlaying }">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div v-else class="no-video">
              <div class="no-video-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p>Vidéo non disponible</p>
            </div>
          </div>

          <!-- Lecteur audio amélioré -->
          <div class="audio-container" v-if="currentLesson.audioUrl">
            <div class="audio-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 15V9C3 6.79086 4.79086 5 7 5H11L16 1V23L11 19H7C4.79086 19 3 17.2091 3 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 8C17.1046 8 18 8.89543 18 10C18 11.1046 17.1046 12 16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 6C21.1046 6 22 6.89543 22 8C22 9.10457 21.1046 10 20 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3>Version audio</h3>
            </div>
            <audio 
              ref="audioPlayer"
              :src="currentLesson.audioUrl"
              controls
              class="course-audio"
              @ended="markLessonCompleted"
            ></audio>
          </div>

          <!-- Contenu de la leçon -->
          <div class="lesson-content">
            <div class="lesson-header">
              <h2>{{ currentLesson.title }}</h2>
              <button 
                class="complete-button" 
                :class="{ 'completed': currentLesson.completed }"
                @click="toggleLessonCompletion"
              >
                {{ currentLesson.completed ? 'Terminé' : 'Marquer comme terminé' }}
              </button>
            </div>
            <div class="content-text" v-html="currentLesson.content"></div>
            
            <!-- Navigation entre les leçons -->
            <div class="lesson-navigation">
              <button 
                class="nav-button prev" 
                :disabled="isFirstLesson"
                @click="goToPreviousLesson"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Précédent
              </button>
              <button 
                class="nav-button next" 
                :disabled="isLastLesson"
                @click="goToNextLesson"
              >
                Suivant
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar amélioré -->
        <div class="sidebar">
          <div class="sidebar-section lessons-list">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 6.25278V19.2528M12 6.25278C10.8324 5.47686 9.24649 5 7.5 5C5.75351 5 4.16756 5.47686 3 6.25278V19.2528C4.16756 18.4769 5.75351 18 7.5 18C9.24649 18 10.8324 18.4769 12 19.2528M12 6.25278C13.1676 5.47686 14.7535 5 16.5 5C18.2465 5 19.8324 5.47686 21 6.25278V19.2528C19.8324 18.4769 18.2465 18 16.5 18C14.7535 18 13.1676 18.4769 12 19.2528" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Plan du cours
            </h3>
            <div class="lessons-scroll">
              <div 
                v-for="(lesson, index) in course.lessons" 
                :key="lesson.id"
                class="lesson-item"
                :class="{ 
                  active: currentLesson.id === lesson.id,
                  completed: lesson.completed
                }"
                @click="selectLesson(lesson)"
              >
                <div class="lesson-info">
                  <div class="lesson-number">{{ index + 1 }}</div>
                  <div class="lesson-details">
                    <span class="lesson-title">{{ lesson.title }}</span>
                    <span class="lesson-duration">{{ lesson.duration }}</span>
                  </div>
                </div>
                <div class="lesson-status">
                  <svg v-if="lesson.completed" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Progression améliorée -->
          <div class="sidebar-section course-progress">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Votre progression
            </h3>
            <div class="progress-container">
              <div class="progress-info">
                <span class="progress-percentage">{{ progressPercentage }}%</span>
                <span class="progress-text">{{ completedLessonsCount }} sur {{ course.lessons.length }} leçons terminées</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: progressPercentage + '%' }"
                  :class="{ 'complete': progressPercentage === 100 }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Ressources supplémentaires -->
          <div class="sidebar-section resources" v-if="course.resources && course.resources.length">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Ressources
            </h3>
            <div class="resources-list">
              <a 
                v-for="resource in course.resources" 
                :key="resource.id" 
                :href="resource.url" 
                target="_blank"
                class="resource-item"
              >
                <div class="resource-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>{{ resource.title }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const courseId = route.params.id;

const videoPlayer = ref(null);
const audioPlayer = ref(null);
const isPlaying = ref(false);

// État du cours
const course = ref({
  id: courseId,
  title: 'Introduction à la Météorologie',
  instructor: 'Dr. Jean Dupont',
  duration: '8 heures',
  resources: [
    { id: 1, title: 'PDF du cours', url: '/resources/course.pdf' },
    { id: 2, title: 'Fiche mémo', url: '/resources/cheatsheet.pdf' }
  ],
  lessons: [
    {
      id: 1,
      title: 'Introduction à la Météorologie',
      duration: '45 min',
      videoUrl: '/videos/lesson1.mp4',
      audioUrl: '/audio/lesson1.mp3',
      content: `
        <h3>Bienvenue dans ce cours d'introduction à la météorologie</h3>
        <p>La météorologie est la science qui étudie les phénomènes atmosphériques et les prévisions du temps.</p>
        
        <h4>Objectifs du cours</h4>
        <ul>
          <li>Comprendre les bases de la météorologie</li>
          <li>Apprendre à lire les cartes météo</li>
          <li>Découvrir les instruments météorologiques</li>
        </ul>
        
        <h4>Concepts clés</h4>
        <p>Nous aborderons les concepts fondamentaux comme la pression atmosphérique, l'humidité et les masses d'air.</p>
      `,
      completed: false
    },
    {
      id: 2,
      title: 'Les instruments météorologiques',
      duration: '35 min',
      videoUrl: '/videos/lesson2.mp4',
      content: `
        <h3>Les outils du météorologue</h3>
        <p>Découvrez les principaux instruments utilisés pour mesurer les conditions atmosphériques.</p>
      `,
      completed: false
    },
    {
      id: 3,
      title: 'Lecture des cartes météo',
      duration: '50 min',
      videoUrl: '/videos/lesson3.mp4',
      content: `
        <h3>Déchiffrer les cartes météorologiques</h3>
        <p>Apprenez à interpréter les symboles et les données présentées sur les cartes météo.</p>
      `,
      completed: false
    },
    {
      id: 4,
      title: 'Prévisions météorologiques',
      duration: '40 min',
      videoUrl: '/videos/lesson4.mp4',
      content: `
        <h3>Comment sont faites les prévisions</h3>
        <p>Explorez les méthodes et modèles utilisés pour prédire le temps.</p>
      `,
      completed: false
    }
  ]
});

const currentLesson = ref(course.value.lessons[0]);

// Computed properties
const progressPercentage = computed(() => {
  const completedLessons = course.value.lessons.filter(lesson => lesson.completed).length;
  return Math.round((completedLessons / course.value.lessons.length) * 100);
});

const completedLessonsCount = computed(() => {
  return course.value.lessons.filter(lesson => lesson.completed).length;
});

const isFirstLesson = computed(() => {
  return course.value.lessons[0].id === currentLesson.value.id;
});

const isLastLesson = computed(() => {
  return course.value.lessons[course.value.lessons.length - 1].id === currentLesson.value.id;
});

// Méthodes
const selectLesson = (lesson) => {
  currentLesson.value = lesson;
  isPlaying.value = false;
  scrollToTop();
};

const toggleLessonCompletion = () => {
  currentLesson.value.completed = !currentLesson.value.completed;
};

const markLessonCompleted = () => {
  if (!currentLesson.value.completed) {
    currentLesson.value.completed = true;
  }
};

const goToPreviousLesson = () => {
  const currentIndex = course.value.lessons.findIndex(lesson => lesson.id === currentLesson.value.id);
  if (currentIndex > 0) {
    selectLesson(course.value.lessons[currentIndex - 1]);
  }
};

const goToNextLesson = () => {
  const currentIndex = course.value.lessons.findIndex(lesson => lesson.id === currentLesson.value.id);
  if (currentIndex < course.value.lessons.length - 1) {
    selectLesson(course.value.lessons[currentIndex + 1]);
  }
};

const togglePlay = () => {
  if (videoPlayer.value.paused) {
    videoPlayer.value.play();
    isPlaying.value = true;
  } else {
    videoPlayer.value.pause();
    isPlaying.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(async () => {
  // Ici, vous pouvez charger les données du cours depuis votre API
  try {
    // const response = await fetch(`/api/courses/${courseId}`);
    // const data = await response.json();
    // course.value = data;
  } catch (error) {
    console.error('Erreur lors du chargement du cours:', error);
  }
});
</script>

<style scoped>
.course-content {
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: #f8f9fa;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* En-tête amélioré */
.course-header {
  margin-bottom: 2rem;
  position: relative;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4e6bff;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: #3a56d4;
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.header-content {
  text-align: center;
}

.course-header h1 {
  font-size: 2.5rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.course-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.meta-item svg {
  color: #4e6bff;
}

/* Layout principal */
.course-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Conteneur vidéo amélioré */
.video-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
}

.video-container.has-audio {
  margin-bottom: 1rem;
}

.video-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.course-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline: none;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-button {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button.hidden {
  opacity: 0;
  pointer-events: none;
}

.play-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.play-button svg {
  width: 32px;
  height: 32px;
  margin-left: 5px;
}

.no-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.no-video-icon {
  margin-bottom: 1rem;
}

.no-video-icon svg {
  color: rgba(255, 255, 255, 0.8);
}

.no-video p {
  font-size: 1.2rem;
  margin-top: 1rem;
}

/* Lecteur audio amélioré */
.audio-container {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem;
}

.audio-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.audio-header svg {
  color: #4e6bff;
}

.audio-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #1a1a2e;
}

.course-audio {
  width: 100%;
  height: 40px;
}

/* Contenu de la leçon */
.lesson-content {
  padding: 2rem;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.lesson-header h2 {
  color: #1a1a2e;
  margin: 0;
  font-size: 1.75rem;
  flex: 1;
}

.complete-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: #f0f2ff;
  color: #4e6bff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.complete-button.completed {
  background: #e6f7ee;
  color: #6bcb77;
}

.complete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content-text {
  line-height: 1.7;
  color: #444;
}

.content-text :deep(h3) {
  color: #1a1a2e;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.content-text :deep(h4) {
  color: #1a1a2e;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.content-text :deep(ul) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.content-text :deep(li) {
  margin-bottom: 0.5rem;
}

/* Navigation entre les leçons */
.lesson-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e7ff;
  background: white;
  color: #4e6bff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button:hover:not(:disabled) {
  background: #f0f2ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button.prev {
  margin-right: auto;
}

.nav-button.next {
  margin-left: auto;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.sidebar-section h3 {
  padding: 1.25rem;
  margin: 0;
  background: #f8f9fa;
  color: #1a1a2e;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #eee;
}

.sidebar-section h3 svg {
  color: #4e6bff;
}

.lessons-scroll {
  max-height: 500px;
  overflow-y: auto;
  padding: 0.5rem;
}

/* Liste des leçons */
.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.lesson-item:hover {
  background: #f8f9fa;
}

.lesson-item.active {
  background: #f0f2ff;
  border-left: 3px solid #4e6bff;
}

.lesson-item.completed .lesson-title {
  color: #6bcb77;
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.lesson-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2ff;
  color: #4e6bff;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
}

.lesson-item.active .lesson-number {
  background: #4e6bff;
  color: white;
}

.lesson-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.lesson-title {
  font-weight: 500;
  color: #1a1a2e;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.lesson-duration {
  font-size: 0.8rem;
  color: #6b7280;
}

.lesson-status svg {
  color: #e0e7ff;
}

.lesson-item.completed .lesson-status svg {
  color: #6bcb77;
}

/* Barre de progression */
.progress-container {
  padding: 1.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.progress-text {
  font-size: 0.9rem;
  color: #6b7280;
}

.progress-bar {
  height: 8px;
  background: #f0f2ff;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #4e6bff, #6bcb77);
  border-radius: 4px;
  transition: width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.progress-fill.complete {
  background: #6bcb77;
}

/* Ressources */
.resources-list {
  padding: 0.5rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  color: #1a1a2e;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.resource-item:hover {
  background: #f8f9fa;
  color: #4e6bff;
}

.resource-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2ff;
  border-radius: 8px;
}

.resource-icon svg {
  color: #4e6bff;
}

/* Responsive */
@media (max-width: 1024px) {
  .course-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    grid-row: 1;
  }
}

@media (max-width: 768px) {
  .course-header h1 {
    font-size: 2rem;
  }
  
  .lesson-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lesson-content {
    padding: 1.5rem;
  }
  
  .lesson-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .course-header h1 {
    font-size: 1.8rem;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  
  .lesson-header h2 {
    font-size: 1.5rem;
  }
  
  .complete-button {
    width: 100%;
    justify-content: center;
  }
}
</style>