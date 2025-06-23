<template>
  <div class="courses-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>{{ $t('coursesPage.title') }}</h1>
        <p>{{ $t('coursesPage.subtitle') }}</p>
        <div class="search-bar">
          <input 
            type="text" 
            :placeholder="$t('coursesPage.searchPlaceholder')" 
            v-model="searchQuery"
            class="search-input"
          />
          <button class="search-btn" @click="searchCourses">
            <i class="fas fa-search"></i> {{ $t('coursesPage.searchBtn') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Section principale -->
    <div class="main-content">
      <div class="container">
        <!-- Filtres -->
        <div class="filters-section">
          <div class="filter-group">
            <label>{{ $t('coursesPage.category') }} :</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">{{ $t('coursesPage.allCategories') }}</option>
              <option value="meteo">{{ $t('coursesPage.meteo') }}</option>
              <option value="climat">{{ $t('coursesPage.climat') }}</option>
              <option value="previsions">{{ $t('coursesPage.previsions') }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>{{ $t('coursesPage.level') }} :</label>
            <select v-model="selectedLevel" class="filter-select">
              <option value="">{{ $t('coursesPage.allLevels') }}</option>
              <option value="debutant">{{ $t('coursesPage.beginner') }}</option>
              <option value="intermediaire">{{ $t('coursesPage.intermediate') }}</option>
              <option value="avance">{{ $t('coursesPage.advanced') }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>{{ $t('coursesPage.duration') }} :</label>
            <select v-model="selectedDuration" class="filter-select">
              <option value="">{{ $t('coursesPage.allDurations') }}</option>
              <option value="courte">{{ $t('coursesPage.short') }}</option>
              <option value="moyenne">{{ $t('coursesPage.medium') }}</option>
              <option value="longue">{{ $t('coursesPage.long') }}</option>
            </select>
          </div>
        </div>

        <!-- Résultats -->
        <div class="results-info">
          <p>{{ filteredCourses.length }} {{ $t('coursesPage.coursesAvailable') }}</p>
          <select v-model="sortOption" class="sort-select">
            <option value="popular">{{ $t('coursesPage.sortPopular') }}</option>
            <option value="recent">{{ $t('coursesPage.sortRecent') }}</option>
            <option value="duration">{{ $t('coursesPage.sortDuration') }}</option>
          </select>
        </div>

        <!-- Grille de cours -->
        <div class="courses-grid">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id" 
            class="course-card"
          >
            <div class="course-header">
              <div class="course-level" :class="course.level.toLowerCase()">
                {{ $t('coursesPage.levels.' + course.level.toLowerCase()) }}
              </div>
              <div v-if="course.isFree" class="course-badge-free">
                {{ $t('coursesPage.free') }}
              </div>
              <h3 class="course-title">{{ course.title }}</h3>
            </div>
            
            <p class="course-description">{{ course.description }}</p>
            
            <div class="course-meta">
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ course.duration }}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-book"></i>
                <span>{{ course.lessons }} {{ $t('coursesPage.lessons') }}</span>
              </div>
            </div>

            <div class="course-instructor">
              <i class="fas fa-user"></i>
              <span>Agence de Météo</span>
            </div>

            <!-- Barre de progression uniquement pour les utilisateurs connectés qui ont commencé le cours -->
            <div v-if="isUserLoggedIn && course.progress > 0" class="course-progress">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${course.progress}%` }"></div>
              </div>
              <span class="progress-text">{{ course.progress }}% {{ $t('coursesPage.completed') }}</span>
            </div>

            <!-- Boutons d'action -->
            <div class="course-actions">
              <!-- Bouton pour accéder au cours -->
              <NuxtLink :to="`/course/${course.id}`" class="course-button">
                {{ isUserLoggedIn && course.progress > 0 ? $t('coursesPage.continue') : $t('coursesPage.start') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const authStore = useAuthStore();
const { t, locale } = useI18n();

// Simuler l'état de connexion de l'utilisateur (à remplacer par votre logique d'authentification)
const isUserLoggedIn = ref(false);

// Données des cours
const courses = ref([
  {
    id: 'introduction-meteo',
    title: 'Introduction à la Météorologie',
    description: 'Découvrez les bases de la météorologie. Un cours gratuit pour comprendre les phénomènes météorologiques quotidiens et apprendre à lire les prévisions météo.',
    duration: '20 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: true
  },
  {
    id: 'secrets-du-ciel',
    title: 'Les Secrets du Ciel',
    description: 'Découvrez les mystères du ciel bleu et des nuages. Comprendre pourquoi le ciel est bleu et comment se forment les différents types de nuages.',
    duration: '30 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: false
  },
  {
    id: 'instruments-meteo',
    title: 'Les Instruments Météo',
    description: 'Apprenez à utiliser les instruments météorologiques essentiels. Du thermomètre à l\'anémomètre, maîtrisez les outils de mesure du temps.',
    duration: '45 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/instruments.jpg',
    instructor: 'Agence de Météo',
    lessons: 2,
    progress: 0,
    isFree: false
  },
  {
    id: 'saisons',
    title: 'Les Saisons',
    description: 'Explorez les caractéristiques météorologiques de chaque saison. Comprendre les changements climatiques et leurs impacts sur la nature.',
    duration: '40 minutes',
    level: 'Débutant',
    image: '/images/courses/saisons.jpg',
    instructor: 'Agence de Météo',
    lessons: 4,
    progress: 0,
    isFree: false
  },
  {
    id: 'phenomenes-meteo',
    title: 'Les Phénomènes Météo',
    description: 'Découvrez les phénomènes météorologiques fascinants. Des orages aux arc-en-ciel, explorez la magie de la météo.',
    duration: '50 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/phenomenes.jpg',
    instructor: 'Agence de Météo',
    lessons: 3,
    progress: 0,
    isFree: false
  }
]);

// Filtres
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedLevel = ref('');
const selectedDuration = ref('');
const sortOption = ref('popular');

// Cours filtrés
const filteredCourses = computed(() => {
  let result = [...courses.value];

  // Filtre par catégorie
  if (selectedCategory.value) {
    result = result.filter(course => course.category === selectedCategory.value);
  }

  // Filtre par niveau
  if (selectedLevel.value) {
    result = result.filter(course => course.level === selectedLevel.value);
  }

  // Filtre par durée
  if (selectedDuration.value) {
    const [min, max] = selectedDuration.value.split('-').map(Number);
    result = result.filter(course => {
      const duration = parseInt(course.duration);
      return duration >= min && duration <= max;
    });
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  }

  // Tri
  if (sortOption.value === 'popular') {
    result.sort((a, b) => b.students - a.students);
  } else if (sortOption.value === 'recent') {
    result.sort((a, b) => b.id - a.id);
  } else if (sortOption.value === 'duration') {
    // Simplification pour l'exemple
    result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
  }

  return result;
});

function searchCourses() {
  // Logique de recherche
}

function viewCourse(id) {
  router.push(`/course/${id}`);
}

const resetFilters = () => {
  selectedCategory.value = '';
  selectedLevel.value = '';
  selectedDuration.value = '';
  searchQuery.value = '';
  sortOption.value = 'popular';
};

// Fonction pour simuler la connexion (à remplacer par votre logique d'authentification)
const toggleLogin = () => {
  isUserLoggedIn.value = !isUserLoggedIn.value;
};

async function downloadCourse(course) {
  try {
    // Récupérer le contenu du document depuis l'API
    const response = await $fetch(`/api/courses/${course.id}/download`, {
      method: 'POST',
      body: {
        format: 'pdf'
      }
    })

    if (response.success) {
      await generatePDF(response.documentContent, response.course.title)
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    alert('Erreur lors de la génération du document. Veuillez réessayer.')
  }
}

const generatePDF = async (htmlContent, courseTitle) => {
  try {
    // Vérifier que nous sommes côté client
    if (process.server) {
      throw new Error('Génération PDF non disponible côté serveur')
    }

    // Importer jsPDF et html2canvas dynamiquement côté client
    const [jsPDF, html2canvas] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ])

    // Créer un élément temporaire pour le contenu HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    document.body.appendChild(tempDiv)

    // Convertir en canvas
    const canvas = await html2canvas.default(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: 800,
      height: tempDiv.scrollHeight
    })

    // Nettoyer l'élément temporaire
    document.body.removeChild(tempDiv)

    // Créer le PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF.default('p', 'mm', 'a4')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Télécharger le PDF
    const fileName = `${courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    throw error
  }
}
</script>

<style scoped>
.courses-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

/* Bannière */
.page-banner {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/weather-pattern.png');
  background-size: 300px;
  opacity: 0.05;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-banner h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.page-banner p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

/* Barre de recherche améliorée */
.search-bar {
  display: flex;
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #95a5a6;
}

.search-btn {
  padding: 1rem 1.8rem;
  background: #2980b9;
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-btn:hover {
  background: #1a5276;
}

/* Contenu principal */
.main-content {
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Filtres */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.filter-group label {
  font-weight: 500;
  color: #34495e;
}

.filter-select {
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  min-width: 180px;
}

/* Résultats */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-info p {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

/* Grille de cours */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e0e0e0;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.course-header {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.course-level {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: white;
}

.course-level.débutant {
  background: #4CAF50;
}

.course-level.intermédiaire {
  background: #2196F3;
}

.course-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  line-height: 1.3;
}

.course-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.8rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.course-instructor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.course-progress {
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
}

/* Boutons d'action */
.course-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 1rem;
}

.course-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.8rem;
  background: #4CAF50;
  color: white;
  text-align: center;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.course-button:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.course-badge-free {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #FFD700;
  color: #000;
  margin-left: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-banner {
    padding: 3rem 0 2rem;
  }

  .page-banner h1 {
    font-size: 2rem;
  }
  
  .search-bar {
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    gap: 1rem;
  }
  
  .search-input {
    border-radius: 30px;
    padding: 0.9rem 1.5rem;
  }
  
  .search-btn {
    width: 100%;
    justify-content: center;
    border-radius: 30px;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .courses-container {
    padding: 1rem;
  }

  .course-actions {
    flex-direction: column;
  }

  .audio-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-banner h1 {
    font-size: 1.8rem;
  }
  
  .page-banner p {
    font-size: 1rem;
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>