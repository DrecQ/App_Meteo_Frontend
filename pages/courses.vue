<template>
  <div class="courses-page">
    <!-- Bannière améliorée -->
    <div class="page-banner">
      <div class="banner-content">
        <h1>Cours</h1>
        <p>Trouvez le cours parfait pour développer vos compétences en météorologie</p>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher un cours, un sujet, un mot-clé..." 
            v-model="searchQuery"
            class="search-input"
          />
          <button class="search-btn" @click="searchCourses">
            <i class="fas fa-search"></i> Rechercher
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
            <label>Catégorie :</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">Toutes</option>
              <option value="meteo">Météorologie</option>
              <option value="climat">Climatologie</option>
              <option value="previsions">Prévisions</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Niveau :</label>
            <select v-model="selectedLevel" class="filter-select">
              <option value="">Tous</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Durée :</label>
            <select v-model="selectedDuration" class="filter-select">
              <option value="">Toutes</option>
              <option value="courte">Moins de 2h</option>
              <option value="moyenne">2-5h</option>
              <option value="longue">Plus de 5h</option>
            </select>
          </div>
        </div>

        <!-- Résultats -->
        <div class="results-info">
          <p>{{ filteredCourses.length }} cours disponibles</p>
          <select v-model="sortOption" class="sort-select">
            <option value="popular">Plus populaires</option>
            <option value="recent">Plus récents</option>
            <option value="duration">Durée</option>
          </select>
        </div>

        <!-- Grille de cours -->
        <div class="courses-grid">
          <!-- Cours d'introduction (accessible sans connexion) -->
          <div class="course-card introduction">
            <div class="course-header">
              <div class="course-level debutant">
                Débutant
              </div>
              <h3 class="course-title">Introduction à la Météorologie</h3>
            </div>
            
            <p class="course-description">
              Découvrez les bases de la météorologie à travers 5 leçons interactives. 
              Comprendre les phénomènes météorologiques quotidiens, les instruments de mesure 
              et les prévisions météo. Un cours parfait pour débuter votre voyage dans le monde 
              fascinant de la météorologie.
            </p>
            
            <div class="course-meta">
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>1h 30min</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-book"></i>
                <span>5 leçons</span>
              </div>
            </div>

            <div class="course-instructor">
              <i class="fas fa-user"></i>
              <span>Dr. Jean Dupont</span>
            </div>

            <NuxtLink to="/course/introduction-meteo" class="course-button free">
              Commencer
            </NuxtLink>
          </div>

          <!-- Autres cours (nécessitent une connexion) -->
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-header">
              <div class="course-level" :class="course.level.toLowerCase()">
                {{ course.level }}
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
                <span>{{ course.lessons }} leçons</span>
              </div>
            </div>

            <div class="course-instructor">
              <i class="fas fa-user"></i>
              <span>{{ course.instructor }}</span>
            </div>

            <div v-if="isLoggedIn && course.progress > 0" class="course-progress">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${course.progress}%` }"></div>
              </div>
              <span class="progress-text">{{ course.progress }}% complété</span>
            </div>

            <NuxtLink :to="`/course/${course.id}`" class="course-button" :class="{ 'locked': !isLoggedIn }">
              {{ isLoggedIn && course.progress > 0 ? 'Continuer' : 'Commencer' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Simuler l'état de connexion (à remplacer par votre logique d'authentification)
const isLoggedIn = ref(false);

// Données des cours
const courses = ref([
  {
    id: 'secrets-du-ciel',
    title: 'Les Secrets du Ciel',
    description: 'Découvrez les mystères du ciel bleu et des nuages. Comprendre pourquoi le ciel est bleu et comment se forment les différents types de nuages.',
    duration: '30 minutes',
    level: 'Débutant',
    image: '/images/courses/ciel.jpg',
    instructor: 'Dr. Marie Dubois',
    lessons: 2,
    progress: 0
  },
  {
    id: 'instruments-meteo',
    title: 'Les Instruments Météo',
    description: 'Apprenez à utiliser les instruments météorologiques essentiels. Du thermomètre à l\'anémomètre, maîtrisez les outils de mesure du temps.',
    duration: '45 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/instruments.jpg',
    instructor: 'Prof. Pierre Martin',
    lessons: 2,
    progress: 0
  },
  {
    id: 'saisons',
    title: 'Les Saisons',
    description: 'Explorez les caractéristiques météorologiques de chaque saison. Comprendre les changements climatiques et leurs impacts sur la nature.',
    duration: '40 minutes',
    level: 'Débutant',
    image: '/images/courses/saisons.jpg',
    instructor: 'Dr. Sophie Bernard',
    lessons: 4,
    progress: 0
  },
  {
    id: 'phenomenes-meteo',
    title: 'Les Phénomènes Météo',
    description: 'Découvrez les phénomènes météorologiques fascinants. Des orages aux arc-en-ciel, explorez la magie de la météo.',
    duration: '50 minutes',
    level: 'Intermédiaire',
    image: '/images/courses/phenomenes.jpg',
    instructor: 'Dr. Thomas Leroy',
    lessons: 3,
    progress: 0
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

// Ajouter les données du cours d'introduction
const introductionCourse = {
  id: 'introduction-meteo',
  title: 'Introduction à la Météorologie',
  description: 'Découvrez les bases de la météorologie à travers 5 leçons interactives. Comprendre les phénomènes météorologiques quotidiens, les instruments de mesure et les prévisions météo.',
  duration: '1h 30min',
  level: 'Débutant',
  instructor: 'Dr. Jean Dupont',
  lessons: 5,
  progress: 0,
  isPublic: true
};
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
  grid-template-columns: 1.5fr 1fr 1fr;
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
  padding-top: 0.5rem;
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

.course-button {
  display: block;
  width: 100%;
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

.introduction {
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border: 2px solid #4CAF50;
}

.course-lessons-preview {
  display: none;
}

.course-button.locked {
  background: #ccc;
  cursor: not-allowed;
}

.course-button.locked:hover {
  background: #ccc;
  transform: none;
}

.course-button.free {
  background: #4CAF50;
  position: relative;
  overflow: hidden;
}

.course-button.free::before {
  content: 'Gratuit';
  position: absolute;
  top: 0;
  right: 0;
  background: #45a049;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 0 8px 0 8px;
}

/* Responsive */
@media (max-width: 1200px) {
  .courses-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .introduction {
    grid-column: 1 / -1;
  }
}

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